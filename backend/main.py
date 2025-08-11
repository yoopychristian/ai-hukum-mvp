import os
import uuid
from datetime import datetime
from typing import Optional, List

import fitz  # PyMuPDF
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, Mapped, mapped_column, relationship, Session
from fpdf import FPDF

try:
    from anthropic import Anthropic
except Exception as e:  # pragma: no cover
    Anthropic = None  # type: ignore


APP_NAME = "AI Hukum MVP Backend"

app = FastAPI(title=APP_NAME)

# CORS
cors_origins = os.getenv("CORS_ORIGINS", "*")
allow_all = cors_origins.strip() == "*"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else [o.strip() for o in cors_origins.split(",") if o.strip()],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# In-memory session storage
SESSIONS: dict[str, dict[str, str]] = {}


# SQLite (Level 2 features: chat history)
DB_URL = os.getenv("DATABASE_URL", "sqlite:///hukum.db")
engine = create_engine(DB_URL, connect_args={"check_same_thread": False} if DB_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Chat(Base):
    __tablename__ = "chats"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    confidential: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    messages: Mapped[List["Message"]] = relationship("Message", back_populates="chat", cascade="all, delete-orphan")
    files: Mapped[List["FileRec"]] = relationship("FileRec", back_populates="chat", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    chat_id: Mapped[str] = mapped_column(String, ForeignKey("chats.id"))
    role: Mapped[str] = mapped_column(String)  # 'user' | 'assistant'
    content: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    chat: Mapped[Chat] = relationship("Chat", back_populates="messages")


class FileRec(Base):
    __tablename__ = "files"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    chat_id: Mapped[str] = mapped_column(String, ForeignKey("chats.id"))
    name: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    chat: Mapped[Chat] = relationship("Chat", back_populates="files")


Base.metadata.create_all(bind=engine)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class SummarizeRequest(BaseModel):
    session_id: str


class AskRequest(BaseModel):
    session_id: str
    question: str


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    try:
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            texts: list[str] = []
            for page in doc:
                texts.append(page.get_text())
            return "\n".join(texts).strip()
    except Exception as e:  # pragma: no cover
        raise HTTPException(status_code=400, detail=f"Gagal membaca PDF: {e}")


def get_client() -> Anthropic:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY belum diset di environment")
    if Anthropic is None:  # pragma: no cover
        raise HTTPException(status_code=500, detail="anthropic SDK tidak terinstal")
    return Anthropic(api_key=api_key)


def call_claude(prompt: str, max_tokens: int = 1024, temperature: float = 0.2) -> str:
    client = get_client()
    model = os.getenv("ANTHROPIC_MODEL", "claude-3-haiku-20240307")
    try:
        msg = client.messages.create(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                    ],
                }
            ],
        )
        # anthropic SDK returns a list of content blocks; we expect first to be text
        if hasattr(msg, "content") and len(msg.content) > 0:
            block = msg.content[0]
            # New SDK returns objects with .type and .text
            text = getattr(block, "text", None)
            if isinstance(text, str):
                return text
        return ""
    except Exception as e:  # pragma: no cover
        raise HTTPException(status_code=500, detail=f"Gagal memanggil model: {e}")


@app.get("/")
def root():
    return {"name": APP_NAME, "status": "ok"}


@app.post("/upload")
async def upload(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
):
    parts: List[str] = []

    # single file
    if file is not None:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="File kosong")
        content_type = (file.content_type or "").lower()
        filename_lower = (file.filename or "").lower()
        is_pdf = "pdf" in content_type or filename_lower.endswith(".pdf")
        is_txt = "text" in content_type or filename_lower.endswith(".txt")
        if is_pdf:
            parts.append(extract_text_from_pdf(content))
        elif is_txt:
            try:
                parts.append(content.decode("utf-8", errors="ignore"))
            except Exception:
                parts.append(content.decode("latin-1", errors="ignore"))
        else:
            raise HTTPException(status_code=400, detail="Tipe file tidak didukung. Gunakan PDF atau TXT.")

    if text and text.strip():
        parts.append(text.strip())

    extracted_text = "\n\n---\n\n".join([p for p in parts if p]).strip()
    if not extracted_text:
        raise HTTPException(status_code=400, detail="Kirim file PDF/TXT atau teks pada field 'text'")

    session_id = str(uuid.uuid4())
    SESSIONS[session_id] = {"text": extracted_text}
    return {"session_id": session_id, "num_chars": len(extracted_text)}


@app.post("/summarize")
def summarize(req: SummarizeRequest):
    session = SESSIONS.get(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session tidak ditemukan")

    doc_text = session.get("text", "")
    if not doc_text:
        raise HTTPException(status_code=400, detail="Tidak ada teks dalam sesi")

    # Keep prompt within limits
    snippet = doc_text[:15000]
    prompt = (
        "Anda adalah asisten hukum berbahasa Indonesia. Ringkas dokumen berikut menjadi poin-poin yang jelas, "
        "sertakan subjudul jika relevan, dan sorot risiko/isu hukum. Jawab singkat dan to the point.\n\n"
        f"Dokumen:\n\n{snippet}"
    )
    summary = call_claude(prompt, max_tokens=800, temperature=0.2)
    return {"summary": summary}


@app.post("/ask")
def ask(req: AskRequest):
    session = SESSIONS.get(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session tidak ditemukan")

    doc_text = session.get("text", "")
    if not doc_text:
        raise HTTPException(status_code=400, detail="Tidak ada teks dalam sesi")

    question = req.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Pertanyaan tidak boleh kosong")

    snippet = doc_text[:15000]
    prompt = (
        "Anda adalah asisten QnA yang hanya menjawab berdasarkan isi dokumen. Jika jawaban tidak ada, katakan tidak ditemukan. "
        "Jawab ringkas dalam bahasa Indonesia, dan bila relevan sertakan kutipan singkat dari dokumen.\n\n"
        f"Dokumen:\n\n{snippet}\n\n"
        f"Pertanyaan: {question}"
    )
    answer = call_claude(prompt, max_tokens=800, temperature=0.0)
    return {"answer": answer}


# Level 2: Multi-file analyze with optional confidential mode and chat history
@app.post("/analyze")
async def analyze(
    files: Optional[List[UploadFile]] = File(None),
    text: Optional[str] = Form(None),
    confidential: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    combined_text_parts: List[str] = []

    # Process files
    if files:
        for f in files:
            content = await f.read()
            if not content:
                continue
            name_lower = (f.filename or "").lower()
            ctype = (f.content_type or "").lower()
            is_pdf = "pdf" in ctype or name_lower.endswith(".pdf")
            is_txt = "text" in ctype or name_lower.endswith(".txt")
            if is_pdf:
                combined_text_parts.append(extract_text_from_pdf(content))
            elif is_txt:
                try:
                    combined_text_parts.append(content.decode("utf-8", errors="ignore"))
                except Exception:
                    combined_text_parts.append(content.decode("latin-1", errors="ignore"))

    if text and text.strip():
        combined_text_parts.append(text.strip())

    combined_text = "\n\n---\n\n".join([p for p in combined_text_parts if p]).strip()
    if not combined_text:
        raise HTTPException(status_code=400, detail="Tidak ada input untuk dianalisa")

    prompt = (
        "Anda adalah asisten hukum. Ringkas dokumen, tandai pasal/isu relevan, dan berikan rekomendasi langkah singkat. "
        "Jawab ringkas dalam bahasa Indonesia.\n\n"
        f"Dokumen:\n{combined_text[:15000]}"
    )
    result = call_claude(prompt, max_tokens=800, temperature=0.2)

    is_confidential = (confidential or "").strip() in {"1", "true", "True", "on"}

    chat_id: Optional[str] = None
    if not is_confidential:
        chat = Chat(title="Analisa Dokumen", confidential=False)
        db.add(chat)
        db.flush()
        chat_id = chat.id
        db.add_all(
            [
                Message(chat_id=chat.id, role="user", content=combined_text[:15000]),
                Message(chat_id=chat.id, role="assistant", content=result),
            ]
        )
        # Save file names metadata
        if files:
            for f in files:
                if f and f.filename:
                    db.add(FileRec(chat_id=chat.id, name=f.filename))
        chat.updated_at = datetime.utcnow()
        db.commit()

    return {"result": result, "chat_id": chat_id}


@app.get("/chats")
def list_chats(db: Session = Depends(get_db)):
    chats = db.query(Chat).order_by(Chat.updated_at.desc()).limit(50).all()
    return {
        "chats": [
            {
                "id": c.id,
                "title": c.title,
                "confidential": c.confidential,
                "created_at": c.created_at.isoformat(),
                "updated_at": c.updated_at.isoformat(),
            }
            for c in chats
        ]
    }


@app.post("/export_pdf")
def export_pdf(chat_id: str = Form(...), db: Session = Depends(get_db)):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat tidak ditemukan")

    messages = db.query(Message).filter(Message.chat_id == chat_id).order_by(Message.created_at.asc()).all()
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    title = chat.title or "Analisa Dokumen"
    pdf.multi_cell(0, 10, txt=title)
    pdf.ln(5)
    for m in messages:
        header = f"[{m.role.upper()}] {m.created_at.isoformat()}\n"
        pdf.set_font("Arial", style="B", size=11)
        pdf.multi_cell(0, 8, txt=header)
        pdf.set_font("Arial", size=11)
        pdf.multi_cell(0, 6, txt=m.content)
        pdf.ln(2)

    pdf_bytes = pdf.output(dest="S").encode("latin-1", errors="ignore")
    from fastapi.responses import Response

    return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=chat_{chat_id}.pdf"})


# Local dev entrypoint (optional)
if __name__ == "__main__":  # pragma: no cover
    import uvicorn

    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)


