import UploadForm from "../components/UploadForm";
import { Card, CardBody, CardHeader } from "../components/Card";

export default function Page() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 px-3 py-1 text-xs text-emerald-700 bg-emerald-50">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          MVP siap deploy
        </div>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">
          Asisten Hukum Cerdas untuk Dokumen Anda
        </h1>
        <p className="mt-3 text-gray-600">
          Unggah kontrak, surat, atau berkas hukum. Dapatkan ringkasan cepat, QnA, dan analisa yang fokus pada isu hukum penting.
        </p>
      </section>

      {/* Features */}
      <section id="fitur" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <h3 className="font-semibold">Ringkasan Cerdas</h3>
            <p className="text-sm text-gray-600 mt-1">Sorot poin krusial dan risiko/isu hukum utama.</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="font-semibold">Tanya Jawab Kontekstual</h3>
            <p className="text-sm text-gray-600 mt-1">Jawaban berdasarkan isi dokumen yang Anda unggah.</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="font-semibold">Mode Rahasia</h3>
            <p className="text-sm text-gray-600 mt-1">Opsional untuk tidak menyimpan chat ke riwayat.</p>
          </CardBody>
        </Card>
      </section>

      {/* Upload Card */}
      <section id="mulai" className="max-w-3xl mx-auto w-full">
        <Card>
          <CardHeader title="Upload Dokumen" subtitle="PDF/TXT atau isi teks manual, lalu ringkas dan tanya jawab" />
          <CardBody>
            <UploadForm />
          </CardBody>
        </Card>
      </section>

      <footer id="tentang" className="text-center text-xs text-gray-500 pt-8">
        Tidak ada autentikasi untuk MVP ini. Siap deploy di Vercel/Render.
      </footer>
    </div>
  );
}

