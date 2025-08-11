"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";

function getApiBase(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE) {
    return process.env.NEXT_PUBLIC_API_BASE;
  }
  return "http://localhost:8000"; // fallback dev
}

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [manualText, setManualText] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [confidential, setConfidential] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const apiBase = getApiBase();

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSummary("");
    setAnswer("");
    setSessionId("");
    setLoading(true);
    try {
      const form = new FormData();
      if (file) form.append("file", file);
      if (manualText.trim().length > 0) form.append("text", manualText.trim());
      if (confidential) form.append("confidential", "1");

      if (!file && manualText.trim().length === 0) {
        setError("Harap unggah file atau isi teks.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${apiBase}/upload`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Gagal upload");
      }
      const data = await res.json();
      const id: string = data.session_id;
      setSessionId(id);

      const sumRes = await fetch(`${apiBase}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: id }),
      });
      if (!sumRes.ok) {
        const t = await sumRes.text();
        throw new Error(t || "Gagal merangkum");
      }
      const sumData = await sumRes.json();
      setSummary(sumData.summary || "");
      // Optional extended analyze call (Level 2)
      try {
        const analyzeRes = await fetch(`${apiBase}/analyze`, {
          method: "POST",
          body: form,
        });
        if (analyzeRes.ok) {
          const analyzeData = await analyzeRes.json();
          if (analyzeData.result) {
            setSummary((prev) => `${analyzeData.result}\n\n---\n\n${prev}`);
          }
        }
      } catch (_) {}
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function handleAsk(e: FormEvent) {
    e.preventDefault();
    setError("");
    setAnswer("");
    if (!sessionId) {
      setError("Belum ada sesi. Unggah dokumen terlebih dahulu.");
      return;
    }
    if (!question.trim()) {
      setError("Pertanyaan tidak boleh kosong.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, question: question.trim() }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Gagal mengambil jawaban");
      }
      const data = await res.json();
      setAnswer(data.answer || "");
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpload} className="space-y-4 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">Upload Dokumen</h2>
        <input
          type="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-700"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Atau isi teks manual</label>
          <textarea
            value={manualText}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setManualText(e.target.value)}
            rows={5}
            className="w-full border rounded p-2"
            placeholder="Tempelkan isi dokumen di sini..."
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={confidential} onChange={(e) => setConfidential(e.target.checked)} />
          Mode rahasia (tidak simpan chat)
        </label>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Unggah & Ringkas"}
        </button>
      </form>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>
      )}

      {summary && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Ringkasan</h3>
          <pre className="whitespace-pre-wrap text-sm">{summary}</pre>
        </div>
      )}

      <form onSubmit={handleAsk} className="space-y-3 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">Tanya Jawab</h2>
        <input
          type="text"
          value={question}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
          placeholder="Tanyakan sesuatu tentang dokumen..."
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Mengambil jawaban..." : "Tanya"}
        </button>
        {answer && (
          <div className="pt-2">
            <h4 className="font-medium">Jawaban:</h4>
            <pre className="whitespace-pre-wrap text-sm">{answer}</pre>
          </div>
        )}
      </form>
    </div>
  );
}

