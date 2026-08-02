import Link from 'next/link';
import { listIcerik } from '@/lib/db/content-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DURUM_RENK: Record<string, string> = {
  yayinda: 'border-emerald-400/30 bg-emerald-400/[0.08] text-emerald-200',
  taslak: 'border-amber-400/25 bg-amber-400/[0.08] text-amber-200',
  arsiv: 'border-white/15 bg-white/[0.04] text-white/50',
};

export default async function SehirListesi() {
  const sayfalar = listIcerik('sehir');

  // Şehre göre grupla — 4 şehir × 6 hizmet. Düz liste 24 satır olur ve
  // "hangi şehirde neyim var" sorusu okunmaz hale gelir.
  const gruplar = sayfalar.reduce<Record<string, typeof sayfalar>>((acc, s) => {
    (acc[s.kategori] ??= []).push(s);
    return acc;
  }, {});

  return (
    <>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-[1.5rem] font-semibold text-white">Şehir Sayfaları</h1>
        <p className="font-body text-[0.82rem] text-white/40">
          {Object.keys(gruplar).length} şehir · {sayfalar.length} sayfa
        </p>
      </div>
      <p className="mb-8 max-w-2xl font-body text-[0.85rem] leading-relaxed text-white/50">
        Yerel arama için en değerli sayfalar bunlar. Her sayfa kendi şehrinin ekonomik
        kimliğine göre özgün içerik taşır — aynı metni şehir adı değiştirerek çoğaltmak
        (doorway sayfa) arama motoru tarafından cezalandırılır. Düzenlerken bu farkı koruyun.
      </p>

      <div className="space-y-8">
        {Object.entries(gruplar).map(([sehir, liste]) => (
          <section key={sehir}>
            <h2 className="mb-3 font-heading text-[1.05rem] font-semibold text-white">{sehir}</h2>
            <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
              <table className="w-full min-w-[38rem] border-collapse">
                <tbody>
                  {liste.map((s) => (
                    <tr key={s.id} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <Link href={`/admin/sehirler/${s.id}`} className="font-body text-[0.88rem] text-white transition-colors hover:text-accent">
                          {s.baslik}
                        </Link>
                        <span className="mt-0.5 block font-body text-[0.72rem] text-white/30">/{s.slug}</span>
                      </td>
                      <td className="px-4 py-3 font-body text-[0.8rem] text-white/45">{s.guncelleme_tarihi}</td>
                      <td className="px-4 py-3 font-body text-[0.8rem] text-white/40">{s.sss_sayisi} SSS</td>
                      <td className="px-4 py-3 font-body text-[0.8rem] text-white/40">{s.surum_sayisi} sürüm</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full border px-2.5 py-1 font-body text-[0.7rem] font-semibold ${DURUM_RENK[s.durum] ?? DURUM_RENK.arsiv}`}>
                          {s.durum}
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

      <p className="mt-8 max-w-2xl font-body text-[0.78rem] leading-relaxed text-white/35">
        Yeni şehir eklemek panelde yok: `/[sehir]/[hizmet]` rotası ve iç link yapısı
        koddan türüyor. Yeni şehir `src/lib/city-pages-data.ts`&apos;e eklenir ve deploy&apos;da
        veritabanına tohumlanır.
      </p>
    </>
  );
}
