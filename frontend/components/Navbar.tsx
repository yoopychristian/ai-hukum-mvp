"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import Logo from "./Logo";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);
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

        {/* Mobile menu button */}
        <button
          type="button"
          className="sm:hidden inline-flex items-center justify-center rounded-md border px-2 py-1 text-gray-700 bg-white/80 hover:bg-white"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          <span className="block w-5 h-0.5 bg-gray-700" />
          <span className="block w-5 h-0.5 bg-gray-700 mt-1" />
          <span className="block w-5 h-0.5 bg-gray-700 mt-1" />
        </button>
      </nav>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="sm:hidden border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
          <div className="px-4 py-3 flex flex-col text-sm text-gray-700">
            <button
              type="button"
              className="text-left py-2"
              onClick={() => setMobileFeaturesOpen((v) => !v)}
              aria-expanded={mobileFeaturesOpen}
            >
              {t('nav.features')}
            </button>
            {mobileFeaturesOpen && (
              <div className="pl-3 pb-2 flex flex-col">
                <Link href="/" className="py-1" onClick={closeMobile}>{t('nav.features.summarize')}</Link>
                <Link href="/draft" className="py-1" onClick={closeMobile}>{t('nav.features.drafting')}</Link>
                <Link href="/review" className="py-1" onClick={closeMobile}>{t('nav.features.review')}</Link>
              </div>
            )}
            <Link href="/tentang" className="py-2" onClick={closeMobile}>{t('nav.about')}</Link>
            <div className="pt-2">
              <label className="mr-2 text-xs">Lang</label>
              <select
                value={lang}
                onChange={(e) => { setLang(e.target.value as any); }}
                className="border rounded px-2 py-1 text-xs"
                aria-label="Language"
              >
                <option value="id">ID</option>
                <option value="en">EN</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


