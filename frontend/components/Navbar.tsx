"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import Logo from "./Logo";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [featuresOpen, setFeaturesOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur bg-white/60 supports-[backdrop-filter]:bg-white/40">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Logo size={24} withText={true} />
        <div className="hidden sm:flex items-center gap-5 text-sm text-gray-600">
          <div
            className="relative"
            onMouseEnter={() => setFeaturesOpen(true)}
            onMouseLeave={() => setFeaturesOpen(false)}
          >
            <button
              type="button"
              className="hover:text-gray-900"
              onClick={() => setFeaturesOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={featuresOpen}
            >
              {t('nav.features')}
            </button>
            <div
              className={`${featuresOpen ? 'block' : 'hidden'} absolute left-0 top-full z-50 pt-2`}
            >
              <div className="bg-white shadow rounded border text-xs whitespace-nowrap py-1 min-w-[140px]">
                <Link href="/" className="block px-3 py-2 hover:bg-gray-50">{t('nav.features.summarize')}</Link>
                <Link href="/draft" className="block px-3 py-2 hover:bg-gray-50">{t('nav.features.drafting')}</Link>
                <Link href="/review" className="block px-3 py-2 hover:bg-gray-50">{t('nav.features.review')}</Link>
              </div>
            </div>
          </div>
          <Link href="/tentang" className="hover:text-gray-900">{t('nav.about')}</Link>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className="ml-4 border rounded px-2 py-1 text-xs"
            aria-label="Language"
          >
            <option value="id">ID</option>
            <option value="en">EN</option>
          </select>
        </div>
      </nav>
    </header>
  );
}


