"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur bg-white/60 supports-[backdrop-filter]:bg-white/40">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_20px_4px_rgba(16,185,129,0.4)]" />
          <span className="font-semibold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600">AI Hukum</span>
          </span>
        </Link>
        <div className="hidden sm:flex items-center gap-5 text-sm text-gray-600">
          <a href="#fitur" className="hover:text-gray-900">Fitur</a>
          <a href="#mulai" className="hover:text-gray-900">Mulai</a>
          <a href="#tentang" className="hover:text-gray-900">Tentang</a>
        </div>
      </nav>
    </header>
  );
}


