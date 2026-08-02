import Link from 'next/link';
import { listIcerik } from '@/lib/db/content-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function YasalListesi() {
  const belgeler = listIcerik('yasal');

  return (
    <>
      <h1 className="mb-2 font-heading text-[1.5rem] font-semibold text-white">Hukuki Metinler</h1>
      <p className="mb-8 max-w-2xl font-body text-[0.85rem] leading-relaxed text-white/50">
        Bu metinler diğer içeriklerden farklı yönetilir: her kaydetmede{' '}
        <strong className="font-semibold text-white/75">yürürlük tarihi ve değişiklik notu zorunludur</strong>,
        ve revizyon geçmişi sayfanın altında ziyaretçiye de gösterilir. Sebebi
        biçimsel değil: bir uyuşmazlıkta &ldquo;verinin işlendiği tarihte hangi metin
        geçerliydi&rdquo; sorusunun cevabı bu kayıttır.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
        <table className="w-full min-w-[36rem] border-collapse">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/[0.02] text-left">
              {['Belge', 'Yürürlük', 'Revizyon', 'Durum'].map((h) => (
                <th key={h} className="px-4 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white/45">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {belgeler.map((b) => (
              <tr key={b.id} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <Link href={`/admin/yasal/${b.id}`} className="font-body text-[0.88rem] text-white transition-colors hover:text-accent">
                    {b.baslik}
                  </Link>
                  <span className="mt-0.5 block font-body text-[0.72rem] text-white/30">/{b.slug}</span>
                </td>
                <td className="px-4 py-3 font-body text-[0.82rem] text-white/55">{b.guncelleme_tarihi}</td>
                <td className="px-4 py-3 font-body text-[0.82rem] text-white/40">{b.surum_sayisi}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/[0.08] px-2.5 py-1 font-body text-[0.7rem] font-semibold text-emerald-200">
                    {b.durum}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 max-w-2xl font-body text-[0.78rem] leading-relaxed text-white/35">
        Hukuki metin arşivlenemez veya taslağa alınamaz gibi bir kısıt YOK, ama
        yayından kaldırmadan önce iki kez düşünün: KVKK aydınlatma metni ve çerez
        politikası, sitede veri toplandığı sürece erişilebilir olmak zorundadır.
      </p>
    </>
  );
}
