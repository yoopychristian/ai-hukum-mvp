"use client";

import { useLanguage } from "../../components/LanguageProvider";

export default function FiturPage() {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{t('features.page.title')}</h1>
        <p className="text-gray-600">{t('features.page.subtitle')}</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t('features.available.title')}</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-800">
          <li>{t('features.available.upload')}</li>
          <li>{t('features.available.summary')}</li>
          <li>{t('features.available.qna')}</li>
          <li>{t('features.available.analysis')}</li>
          <li>{t('features.available.history')}</li>
          <li>{t('features.available.drafting')}</li>
          <li>{t('features.available.review')}</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t('features.roadmap.title')}</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-800">
          <li>{t('features.roadmap.citations')}</li>
          <li>{t('features.roadmap.clauses')}</li>
          <li>{t('features.roadmap.risk')}</li>
          <li>{t('features.roadmap.compare')}</li>
          <li>{t('features.roadmap.export')}</li>
          <li>{t('features.roadmap.login')}</li>
        </ul>
      </section>
    </div>
  );
}


