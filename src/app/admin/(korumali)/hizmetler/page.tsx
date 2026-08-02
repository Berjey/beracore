import Link from 'next/link';
import { listIcerik } from '@/lib/db/content-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DURUM_RENK: Record<string, string> = {
  yayinda: 'border-emerald-400/30 bg-emerald-400/[0.08] text-emerald-200',
  taslak: 'border-amber-400/25 bg-amber-400/[0.08] text-amber-200',
  arsiv: 'border-white/15 bg-white/[0.04] text-white/50',
};

export default async function HizmetListesi() {
  const kategoriler = listIcerik('hizmet');
  const altlar = listIcerik('hizmet-alt');

  return (
    <>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-[1.5rem] font-semibold text-white">Hizmet Sayfaları</h1>
        <p className="font-body text-[0.82rem] text-white/40">
          {kategoriler.length} kategori · {altlar.length} alt hizmet
        </p>
      </div>
      <p className="mb-8 max-w-2xl font-body text-[0.85rem] leading-relaxed text-white/50">
        Kategori sayfası (`/hizmetler/ai`) ve alt hizmet sayfası
        (`/hizmetler/ai/ai-chatbot-asistan`) ayrı kayıtlardır: ayrı URL, ayrı meta,
        ayrı SSS. Renk, 3D şekil ve ikon gibi görsel kimlik alanları panelde
        düzenlenmez — geçersiz bir değer 3D sahneyi kırar.
      </p>

      <div className="space-y-8">
        {kategoriler.map((k) => (
          <section key={k.id}>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-heading text-[1.05rem] font-semibold text-white">
                <Link href={`/admin/hizmetler/${k.id}`} className="transition-colors hover:text-accent">
                  {k.baslik}
                </Link>
              </h2>
              <span className="font-body text-[0.75rem] text-white/30">/hizmetler/{k.slug}</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
              <table className="w-full min-w-[38rem] border-collapse">
                <tbody>
                  {altlar.filter((a) => a.kategori === k.slug).map((a) => (
                    <tr key={a.id} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <Link href={`/admin/hizmetler/${a.id}`} className="font-body text-[0.88rem] text-white transition-colors hover:text-accent">
                          {a.baslik}
                        </Link>
                        <span className="mt-0.5 block font-body text-[0.72rem] text-white/30">/hizmetler/{a.slug}</span>
                      </td>
                      <td className="px-4 py-3 font-body text-[0.8rem] text-white/40">{a.sss_sayisi} SSS</td>
                      <td className="px-4 py-3 font-body text-[0.8rem] text-white/40">{a.surum_sayisi} sürüm</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full border px-2.5 py-1 font-body text-[0.7rem] font-semibold ${DURUM_RENK[a.durum] ?? DURUM_RENK.arsiv}`}>
                          {a.durum}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
