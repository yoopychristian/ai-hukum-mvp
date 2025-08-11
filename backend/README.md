# AI Hukum MVP Backend (FastAPI)

FastAPI backend untuk upload dokumen (PDF/TXT) atau teks, ringkas dokumen, dan QnA berbasis Anthropic Claude.

## Endpoint
- POST `/upload` → terima PDF/TXT atau teks manual, ekstrak & simpan di sesi in-memory, kembalikan `session_id`
- POST `/summarize` → terima `session_id`, kembalikan ringkasan dokumen
- POST `/ask` → terima `session_id` + `question`, kembalikan jawaban berbasis dokumen

## Environment
- `ANTHROPIC_API_KEY` (wajib)
- `ANTHROPIC_MODEL` (opsional, default `claude-3-haiku-20240307`)
- `CORS_ORIGINS` (opsional, default `*`)
- `PORT` (opsional saat dev, default `8000`)

Contoh `.env` lokal:
```
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-haiku-20240307
CORS_ORIGINS=*
```

## Menjalankan Lokal
```
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Deploy ke Render
- Build Command: `pip install -r backend/requirements.txt`
- Start Command: `cd backend && gunicorn -k uvicorn.workers.UvicornWorker main:app`
- Set env `ANTHROPIC_API_KEY`

## Catatan
- Penyimpanan sesi sementara: in-memory dictionary (non-persisten)
- PDF diekstrak dengan PyMuPDF (`fitz`)
