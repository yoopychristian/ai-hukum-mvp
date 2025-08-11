# AI Hukum MVP

Full-stack MVP: FastAPI backend + Next.js 14 frontend. Fitur: upload PDF/TXT atau teks, ringkasan, dan QnA via Anthropic Claude.

## Struktur
```
ai-hukum-mvp/
├─ backend/
│  ├─ main.py
│  ├─ requirements.txt
│  ├─ README.md
│  └─ Procfile (opsional)
├─ frontend/
│  ├─ package.json
│  ├─ next.config.js
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ globals.css
│  │  └─ page.tsx
│  ├─ components/
│  │  └─ UploadForm.tsx
│  ├─ tailwind.config.js
│  ├─ postcss.config.js
│  ├─ tsconfig.json
│  └─ README.md
├─ docker-compose.yml
└─ README.md
```

## Setup Singkat
- Backend: lihat `backend/README.md`
- Frontend: lihat `frontend/README.md`

## Deploy
- Backend (Render): Start `cd backend && gunicorn -k uvicorn.workers.UvicornWorker main:app`
- Frontend (Vercel): set `NEXT_PUBLIC_API_BASE` → URL backend

## Docker (Lokal)
1) Siapkan env key (Linux/macOS):
```
export ANTHROPIC_API_KEY=sk-ant-...
```
2) Jalankan:
```
docker compose up --build
```
3) Akses:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
