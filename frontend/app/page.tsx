"use client";

import UploadForm from "../components/UploadForm";
import { Card, CardBody, CardHeader } from "../components/Card";
import { useLanguage } from "../components/LanguageProvider";

export default function Page() {
  const { t } = useLanguage();
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 px-3 py-1 text-xs text-emerald-700 bg-emerald-50">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {t('hero.badge')}
        </div>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">{t('hero.title')}</h1>
        <p className="mt-3 text-gray-600">{t('hero.desc')}</p>
      </section>

      {/* Features */}
      <section id="fitur" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <h3 className="font-semibold">{t('feat.summary.title')}</h3>
            <p className="text-sm text-gray-600 mt-1">{t('feat.summary.desc')}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="font-semibold">{t('feat.qna.title')}</h3>
            <p className="text-sm text-gray-600 mt-1">{t('feat.qna.desc')}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="font-semibold">{t('feat.conf.title')}</h3>
            <p className="text-sm text-gray-600 mt-1">{t('feat.conf.desc')}</p>
          </CardBody>
        </Card>
      </section>

      {/* Upload Card */}
      <section id="mulai" className="max-w-3xl mx-auto w-full">
        <Card>
          <CardHeader title={t('upload.title')} subtitle={t('upload.subtitle')} />
          <CardBody>
            <UploadForm />
          </CardBody>
        </Card>
      </section>

      <footer id="tentang" className="text-center text-xs text-gray-500 pt-8">{t('footer.note')}</footer>
    </div>
  );
}

