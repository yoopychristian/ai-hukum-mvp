"use client";

import { useLanguage } from "../../components/LanguageProvider";

export default function TentangPage() {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{t('about.title')}</h1>
        <p className="text-gray-600">{t('about.subtitle')}</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t('about.mvpTitle')}</h2>
        <p className="text-gray-800">{t('about.mvp')}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t('about.techTitle')}</h2>
        <ul className="list-disc pl-5 text-gray-800 space-y-1">
          <li>{t('about.frontend')}</li>
          <li>{t('about.backend')}</li>
          <li>{t('about.ai')}</li>
        </ul>
      </section>
    </div>
  );
}


