import Link from 'next/link';
import { listIcerik } from '@/lib/db/content-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DURUM_RENK: Record<string, string> = {
  yayinda: 'border-emerald-400/30 bg-emerald-400/[0.08] text-emerald-200',
  taslak: 'border-amber-400/25 bg-amber-400/[0.08] text-amber-200',
  arsiv: 'border-white/15 bg-white/[0.04] text-white/50',
};

export default async function IcerikListesi() {
  const yazilar = listIcerik('blog');
  const yayinda = yazilar.filter((y) => y.durum === 'yayinda').length;

  return (
    <>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-[1.5rem] font-semibold text-white">Blog İçeriği</h1>
        <p className="font-body text-[0.82rem] text-white/40">{yayinda} / {yazilar.length} yayında</p>
      </div>
      <p className="mb-8 max-w-2xl font-body text-[0.85rem] leading-relaxed text-white/50">
        Yazılar artık veritabanında. Kaydettiğinizde ilgili sayfalar yeniden üretilir —
        site statik kalmaya devam eder, ziyaretçiye yine hazır sayfa servis edilir.
        Her kaydetmede önceki hâl sürüm geçmişine yazılır.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
        <table className="w-full min-w-[46rem] border-collapse">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/[0.02] text-left">
              {['Başlık', 'Kategori', 'Yayın', 'SSS', 'Sürüm', 'Durum'].map((h) => (
                <th key={h} className="px-4 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white/45">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {yazilar.map((y) => (
              <tr key={y.id} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <Link href={`/admin/icerik/${y.id}`} className="font-body text-[0.88rem] text-white transition-colors hover:text-accent">
                    {y.baslik}
                  </Link>
                  <span className="mt-0.5 block font-body text-[0.72rem] text-white/30">/blog/{y.slug}</span>
                </td>
                <td className="px-4 py-3 font-body text-[0.8rem] text-white/55">{y.kategori}</td>
                <td className="px-4 py-3 font-body text-[0.8rem] text-white/55">{y.yayin_tarihi}</td>
                <td className="px-4 py-3 font-body text-[0.8rem] text-white/40">{y.sss_sayisi}</td>
                <td className="px-4 py-3 font-body text-[0.8rem] text-white/40">{y.surum_sayisi}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2.5 py-1 font-body text-[0.7rem] font-semibold ${DURUM_RENK[y.durum] ?? DURUM_RENK.arsiv}`}>
                    {y.durum}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 max-w-2xl font-body text-[0.78rem] leading-relaxed text-white/35">
        Yeni yazı ekleme henüz panelde yok: yeni içerik `src/lib/blog-data.ts` üzerinden
        eklenir ve deploy sırasında veritabanına tohumlanır. Var olan bir yazıyı düzenlemek
        ise buradan yapılır ve kod tarafına DOKUNMAZ — aktarım var olan kaydı ezmez.
      </p>
    </>
  );
}
