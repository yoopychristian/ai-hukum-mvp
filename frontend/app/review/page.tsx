"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useLanguage } from "../../components/LanguageProvider";

function getApiBase(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE) {
    return process.env.NEXT_PUBLIC_API_BASE;
  }
  return "http://localhost:8000";
}

type ReviewResult = {
  summary?: string;
  missing?: string[];
  issues?: string[];
  changes?: string[];
  recommendations?: string[];
  citations?: string[];
};

export default function ReviewPage() {
  const { lang, t } = useLanguage();
  const [fileCurrent, setFileCurrent] = useState<File | null>(null);
  const [filePrev, setFilePrev] = useState<File | null>(null);
  const [textCurrent, setTextCurrent] = useState<string>("");
  const [textPrev, setTextPrev] = useState<string>("");
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const apiBase = getApiBase();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const form = new FormData();
      if (fileCurrent) form.append("file_current", fileCurrent);
      if (filePrev) form.append("file_previous", filePrev);
      if (textCurrent.trim()) form.append("text_current", textCurrent.trim());
      if (textPrev.trim()) form.append("text_previous", textPrev.trim());
      form.append("lang", lang);
      const res = await fetch(`${apiBase}/review`, { method: "POST", body: form });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to review");
      }
      const data = await res.json();
      setResult(data.review || {});
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{t('review.title')}</h1>
        <p className="text-gray-600 text-sm">{t('review.subtitle')}</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t('review.current')}</label>
            <input type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={(e: ChangeEvent<HTMLInputElement>) => setFileCurrent(e.target.files?.[0] || null)} />
            <textarea value={textCurrent} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTextCurrent(e.target.value)} rows={6} placeholder={t('review.currentPlaceholder')} className="w-full border rounded p-2" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t('review.previous')}</label>
            <input type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={(e: ChangeEvent<HTMLInputElement>) => setFilePrev(e.target.files?.[0] || null)} />
            <textarea value={textPrev} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTextPrev(e.target.value)} rows={6} placeholder={t('review.previousPlaceholder')} className="w-full border rounded p-2" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">{loading ? "Processing..." : t('review.submit')}</button>
      </form>

      {error && <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>}

      {result && (
        <div className="bg-white p-4 rounded-lg shadow space-y-3">
          {result.summary && (
            <div>
              <h2 className="font-semibold">{t('review.summary')}</h2>
              <p className="text-sm whitespace-pre-wrap">{result.summary}</p>
            </div>
          )}
          {result.missing && result.missing.length > 0 && (
            <div>
              <h3 className="font-semibold">{t('review.missing')}</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">{result.missing.map((x, i) => (<li key={i}>{x}</li>))}</ul>
            </div>
          )}
          {result.issues && result.issues.length > 0 && (
            <div>
              <h3 className="font-semibold">{t('review.issues')}</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">{result.issues.map((x, i) => (<li key={i}>{x}</li>))}</ul>
            </div>
          )}
          {result.changes && result.changes.length > 0 && (
            <div>
              <h3 className="font-semibold">{t('review.changes')}</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">{result.changes.map((x, i) => (<li key={i}>{x}</li>))}</ul>
            </div>
          )}
          {result.recommendations && result.recommendations.length > 0 && (
            <div>
              <h3 className="font-semibold">{t('review.recommendations')}</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">{result.recommendations.map((x, i) => (<li key={i}>{x}</li>))}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


