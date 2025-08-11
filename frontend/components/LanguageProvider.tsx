"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "id" | "en";

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const defaultContext: LangContextType = {
  lang: "id",
  setLang: () => {},
  t: (k) => k,
};

const LangContext = createContext<LangContextType>(defaultContext);

const DICT: Record<Lang, Record<string, string>> = {
  id: {
    "nav.features": "Fitur",
    "nav.start": "Mulai",
    "nav.about": "Tentang",
    "nav.features.summarize": "Ringkas",
    "nav.features.drafting": "Drafting",
    "nav.features.review": "Review",
    "nav.drafting": "Drafting",
    "nav.review": "Review",

    "hero.badge": "MVP siap deploy",
    "hero.title": "Asisten Hukum Cerdas untuk Dokumen Anda",
    "hero.desc": "Unggah kontrak, surat, atau berkas hukum. Dapatkan ringkasan cepat, QnA, dan analisa yang fokus pada isu hukum penting.",

    "feat.summary.title": "Ringkasan Cerdas",
    "feat.summary.desc": "Sorot poin krusial dan risiko/isu hukum utama.",
    "feat.qna.title": "Tanya Jawab Kontekstual",
    "feat.qna.desc": "Jawaban berdasarkan isi dokumen yang Anda unggah.",
    "feat.conf.title": "Mode Rahasia",
    "feat.conf.desc": "Opsional untuk tidak menyimpan chat ke riwayat.",

    "upload.title": "Upload Dokumen",
    "upload.subtitle": "PDF/TXT atau isi teks manual, lalu ringkas dan tanya jawab",
    "upload.file": "Pilih berkas PDF/TXT",
    "upload.text": "Atau isi teks manual",
    "upload.placeholder": "Tempelkan isi dokumen di sini...",
    "upload.preset": "Preset",
    "upload.lang": "Bahasa",
    "upload.conf": "Mode rahasia (tidak simpan chat)",
    "upload.submit": "Unggah & Ringkas",

    "qna.title": "Tanya Jawab",
    "qna.placeholder": "Tanyakan sesuatu tentang dokumen...",
    "qna.submit": "Tanya",

    "summary.title": "Ringkasan",
    "answer.title": "Jawaban:",

    "footer.note": "Tidak ada autentikasi untuk MVP ini. Siap deploy di Vercel/Render.",

    // Preset labels
    "preset.summary": "Ringkas",
    "preset.risk": "Risiko",
    "preset.clauses": "Klausul",
    "preset.timeline": "Timeline",

    // Features page
    "features.page.title": "Fitur",
    "features.page.subtitle": "Ringkasan kemampuan saat ini dan rencana pengembangan.",
    "features.available.title": "Tersedia",
    "features.available.upload": "Upload PDF/TXT dan input teks manual.",
    "features.available.summary": "Ringkasan poin penting dokumen.",
    "features.available.qna": "Tanya jawab (QnA) berdasarkan isi dokumen.",
    "features.available.analysis": "Analisis dokumen (opsional mode rahasia agar tidak disimpan).",
    "features.available.history": "Riwayat chat dasar (SQLite sementara) dan ekspor PDF.",
    "features.available.drafting": "Drafting dokumen (preview & download PDF/DOCX).",
    "features.available.review": "Review dokumen untuk pengajuan (cek kelengkapan & ringkas perubahan).",
    "features.roadmap.title": "Roadmap",
    "features.roadmap.citations": "Highlight kutipan dari dokumen sebagai dasar jawaban.",
    "features.roadmap.clauses": "Ekstraksi klausul/entitas (pihak, tanggal, nilai, pasal).",
    "features.roadmap.risk": "Skor risiko dan rekomendasi tindakan terstruktur.",
    "features.roadmap.compare": "Perbandingan dua dokumen (diff kontrak).",
    "features.roadmap.export": "Export ke Word (DOCX) dan template compliance.",
    "features.roadmap.login": "Login (Google/GitHub) dan penyimpanan riwayat terkelola.",

    // About page
    "about.title": "Tentang",
    "about.subtitle": "AI Hukum membantu merangkum dan menganalisa dokumen hukum dengan cepat.",
    "about.mvpTitle": "MVP",
    "about.mvp": "MVP ini fokus pada kemudahan upload dokumen, ringkasan cepat, dan QnA kontekstual. Data dapat diset sebagai rahasia (tidak disimpan) untuk menjaga privasi.",
    "about.techTitle": "Teknologi",
    "about.frontend": "Frontend: Next.js + TailwindCSS",
    "about.backend": "Backend: FastAPI (Python)",
    "about.ai": "AI: Anthropic Claude",

    // Review page
    "review.title": "Review Dokumen",
    "review.subtitle": "Cek kesiapan untuk pengajuan ke MA, dan ringkas perubahan dari versi sebelumnya.",
    "review.current": "Dokumen Saat Ini (PDF/TXT)",
    "review.previous": "Dokumen Sebelumnya (opsional)",
    "review.currentPlaceholder": "Atau tempel teks saat ini",
    "review.previousPlaceholder": "Atau tempel teks sebelumnya",
    "review.submit": "Review",
    "review.summary": "Ringkasan",
    "review.missing": "Kekurangan",
    "review.issues": "Isu",
    "review.changes": "Perubahan",
    "review.recommendations": "Rekomendasi",
  },
  en: {
    "nav.features": "Features",
    "nav.start": "Start",
    "nav.about": "About",
    "nav.features.summarize": "Summarize",
    "nav.features.drafting": "Drafting",
    "nav.features.review": "Review",
    "nav.drafting": "Drafting",
    "nav.review": "Review",

    "hero.badge": "Deployment-ready MVP",
    "hero.title": "Smart Legal Assistant for Your Documents",
    "hero.desc": "Upload contracts, letters, or legal files. Get quick summaries, QnA, and analysis focused on key legal issues.",

    "feat.summary.title": "Smart Summaries",
    "feat.summary.desc": "Highlight crucial points and key legal risks.",
    "feat.qna.title": "Contextual QnA",
    "feat.qna.desc": "Answers based strictly on your uploaded document.",
    "feat.conf.title": "Confidential Mode",
    "feat.conf.desc": "Option to avoid saving the chat history.",

    "upload.title": "Upload Document",
    "upload.subtitle": "PDF/TXT or paste text, then summarize and ask questions",
    "upload.file": "Choose PDF/TXT file",
    "upload.text": "Or paste text manually",
    "upload.placeholder": "Paste your document text here...",
    "upload.preset": "Preset",
    "upload.lang": "Language",
    "upload.conf": "Confidential mode (do not save chat)",
    "upload.submit": "Upload & Summarize",

    "qna.title": "Questions & Answers",
    "qna.placeholder": "Ask something about the document...",
    "qna.submit": "Ask",

    "summary.title": "Summary",
    "answer.title": "Answer:",

    "footer.note": "No authentication for this MVP. Ready to deploy on Vercel/Render.",

    // Preset labels
    "preset.summary": "Summary",
    "preset.risk": "Risk",
    "preset.clauses": "Clauses",
    "preset.timeline": "Timeline",

    // Features page
    "features.page.title": "Features",
    "features.page.subtitle": "Summary of current capabilities and development roadmap.",
    "features.available.title": "Available",
    "features.available.upload": "Upload PDF/TXT and paste text manually.",
    "features.available.summary": "Summarize key points of the document.",
    "features.available.qna": "QnA based on the document content.",
    "features.available.analysis": "Document analysis (optional confidential mode to avoid saving).",
    "features.available.history": "Basic chat history (temporary SQLite) and PDF export.",
    "features.available.drafting": "Document drafting (preview & download PDF/DOCX).",
    "features.available.review": "Document review for court submission (completeness check & change summary).",
    "features.roadmap.title": "Roadmap",
    "features.roadmap.citations": "Highlight quotes from the document as the basis for answers.",
    "features.roadmap.clauses": "Extract clauses/entities (parties, dates, amounts, articles).",
    "features.roadmap.risk": "Risk scoring and structured action recommendations.",
    "features.roadmap.compare": "Compare two documents (contract diff).",
    "features.roadmap.export": "Export to Word (DOCX) and compliance templates.",
    "features.roadmap.login": "Login (Google/GitHub) and managed history storage.",

    // About page
    "about.title": "About",
    "about.subtitle": "AI Hukum helps summarize and analyze legal documents quickly.",
    "about.mvpTitle": "MVP",
    "about.mvp": "This MVP focuses on simple uploads, quick summaries, and contextual QnA. Data can be set to confidential (not saved) to preserve privacy.",
    "about.techTitle": "Technology",
    "about.frontend": "Frontend: Next.js + TailwindCSS",
    "about.backend": "Backend: FastAPI (Python)",
    "about.ai": "AI: Anthropic Claude",

    // Review page
    "review.title": "Document Review",
    "review.subtitle": "Check readiness for Supreme Court submission and summarize changes versus a previous version.",
    "review.current": "Current Document (PDF/TXT)",
    "review.previous": "Previous Document (optional)",
    "review.currentPlaceholder": "Or paste current text",
    "review.previousPlaceholder": "Or paste previous text",
    "review.submit": "Review",
    "review.summary": "Summary",
    "review.missing": "Missing",
    "review.issues": "Issues",
    "review.changes": "Changes",
    "review.recommendations": "Recommendations",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "id";
    const saved = window.localStorage.getItem("lang") as Lang | null;
    return saved === "en" ? "en" : "id";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lang", lang);
    }
  }, [lang]);

  const t = useMemo(() => {
    return (key: string) => DICT[lang][key] ?? key;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LangContext);
}


