import './globals.css';
import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import { LanguageProvider } from '../components/LanguageProvider';

export const metadata: Metadata = {
  title: 'AI Hukum MVP',
  description: 'Upload, ringkas, dan tanya jawab dokumen hukum',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
        <LanguageProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}

