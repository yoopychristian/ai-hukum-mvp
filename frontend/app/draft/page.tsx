"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useLanguage } from "../../components/LanguageProvider";

function getApiBase(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE) {
    return process.env.NEXT_PUBLIC_API_BASE;
  }
  return "http://localhost:8000";
}

export default function DraftPage() {
  const { lang } = useLanguage();
  const [sessionId, setSessionId] = useState<string>("");
  const [docType, setDocType] = useState<string>("Surat Kuasa");
  const [requirements, setRequirements] = useState<string>("");
  const [tone, setTone] = useState<string>("formal");
  const [length, setLength] = useState<string>("medium");
  const [draft, setDraft] = useState<string>("");
  const [title, setTitle] = useState<string>("Draft Dokumen");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const apiBase = getApiBase();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setDraft("");
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId || undefined, doc_type: docType, requirements, tone, length, lang }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to draft");
      }
      const data = await res.json();
      setDraft(data.draft || "");
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Drafting</h1>
        <p className="text-gray-600 text-sm">Generate dokumen hukum berdasarkan tipe, kebutuhan, dan konteks sesi.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Dokumen</label>
            <input value={docType} onChange={(e: ChangeEvent<HTMLInputElement>) => setDocType(e.target.value)} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full border rounded p-2 text-sm">
              <option value="formal">Formal</option>
              <option value="neutral">Netral</option>
              <option value="persuasive">Persuasif</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Panjang</label>
            <select value={length} onChange={(e) => setLength(e.target.value)} className="w-full border rounded p-2 text-sm">
              <option value="short">Pendek</option>
              <option value="medium">Sedang</option>
              <option value="long">Panjang</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session ID (opsional)</label>
            <input value={sessionId} onChange={(e: ChangeEvent<HTMLInputElement>) => setSessionId(e.target.value)} placeholder="Gunakan sesi upload untuk konteks" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <input value={title} onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} className="w-full border rounded p-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kebutuhan / Poin yang harus ada</label>
          <textarea value={requirements} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setRequirements(e.target.value)} rows={6} className="w-full border rounded p-2" placeholder="Contoh: Identitas para pihak; ruang lingkup; jangka waktu; kewajiban; sanksi; tanda tangan." />
        </div>

        <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-60">
          {loading ? "Generating..." : "Generate Draft"}
        </button>
      </form>

      {error && <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>}

      {draft && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Hasil Draft</h2>
          <pre className="whitespace-pre-wrap text-sm">{draft}</pre>
          <div className="flex gap-3 mt-3">
            <form action={`${apiBase}/export_draft_pdf`} method="POST" target="_blank">
              <input type="hidden" name="text" value={draft} />
              <input type="hidden" name="title" value={title} />
              <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Download PDF</button>
            </form>
            <form action={`${apiBase}/export_draft_docx`} method="POST" target="_blank">
              <input type="hidden" name="text" value={draft} />
              <input type="hidden" name="title" value={title} />
              <button type="submit" className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Download DOCX</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


