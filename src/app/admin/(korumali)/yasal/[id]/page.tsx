import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIcerik, listSurumler, ICERIK_DURUMLARI } from '@/lib/db/content-admin';
import { getRevizyonlar } from '@/lib/db/content';
import type { LegalSection } from '@/lib/legal-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HATA_METNI: Record<string, string> = {
  'baslik-bos': 'Başlık boş bırakılamaz.',
  'not-bos': 'Değişiklik notu zorunludur — neyin değiştiği yazılmadan revizyon kaydedilmez.',
  'gecersiz-tarih': 'Yürürlük tarihi YYYY-AA-GG biçiminde olmalıdır.',
  'tarih-geriye': 'Yürürlük tarihi mevcut sürümden ERKEN olamaz; revizyon geçmişi tutarsız olurdu.',
  'bolum-yok': 'En az bir bölüm gerekir.',
  'gecersiz-durum': 'Geçersiz durum değeri.',
  bulunamadi: 'Belge bulunamadı.',
  kaydedilemedi: 'Kaydedilemedi; değişiklik geri alındı.',
  origin: 'Güvenlik doğrulaması başarısız. Sayfayı yenileyip tekrar deneyin.',
};

const alan =
  'mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.88rem] text-white outline-none transition-colors hover:border-white/20 focus:border-accent/60';
const etiket = 'block font-body text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/55';
const BOS_SLOT = 2;

export default async function YasalDuzenle({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kayit?: string; hata?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const belge = getIcerik(Number(id));
  if (!belge || belge.tip !== 'yasal') notFound();

  const yuk = JSON.parse(belge.govde) as { accent: string; lastUpdated: string; sections: LegalSection[] };
  const surumler = listSurumler(belge.id);
  const revizyonlar = getRevizyonlar(belge.slug);

  const bolumler = [...yuk.sections,
                    ...Array.from({ length: BOS_SLOT }, () => ({ title: '', body: '' as string | string[] }))];

  return (
    <>
      <Link href="/admin/yasal" className="font-body text-[0.8rem] text-white/45 transition-colors hover:text-white">
        ← Hukuki metinler
      </Link>

      <h1 className="mt-3 font-heading text-[1.4rem] font-semibold text-white">{belge.baslik}</h1>
      <p className="mt-1 mb-8 font-body text-[0.8rem] text-white/35">
        /{belge.slug} · yürürlük {belge.guncelleme_tarihi} ·{' '}
        {surumler.length === 0 ? 'revizyon yok' : `${surumler.length} revizyon`}
      </p>

      {sp.kayit === 'tamam' && (
        <p role="status" className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.08] px-4 py-3 font-body text-[0.85rem] text-emerald-200">
          Kaydedildi. Yeni sürüm yürürlüğe girdi ve revizyon geçmişine işlendi.
        </p>
      )}
      {sp.hata && (
        <p role="alert" className="mb-6 rounded-xl border border-red-400/30 bg-red-400/[0.08] px-4 py-3 font-body text-[0.85rem] text-red-200">
          {HATA_METNI[sp.hata] ?? 'Kaydedilemedi.'}
        </p>
      )}

      <form action={`/admin/yasal/${belge.id}/kaydet`} method="post" className="space-y-8">
        <section className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.04] p-6 max-sm:p-4">
          <h2 className="font-heading text-[1.05rem] font-semibold text-white">Bu revizyon</h2>
          <p className="mt-1.5 mb-5 font-body text-[0.78rem] leading-relaxed text-white/50">
            Bu iki alan hukuki metinlerde <strong className="font-semibold text-amber-200/90">zorunludur</strong> ve
            ziyaretçiye de gösterilir. Değişiklik notu, bir uyuşmazlıkta sorulacak
            &ldquo;ne değişti&rdquo; sorusunun cevabıdır.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="yururluk" className={etiket}>Yürürlük tarihi</label>
              <p className="mt-1 font-body text-[0.76rem] text-white/35">
                Mevcut sürümden erken olamaz ({belge.guncelleme_tarihi}).
              </p>
              <input id="yururluk" name="yururluk" type="date" required
                     min={belge.guncelleme_tarihi} defaultValue={belge.guncelleme_tarihi} className={alan} />
            </div>
            <div>
              <label htmlFor="lastUpdated" className={etiket}>Sayfada görünen tarih metni</label>
              <p className="mt-1 font-body text-[0.76rem] text-white/35">
                Ziyaretçiye &ldquo;Son güncelleme: …&rdquo; olarak gösterilir.
              </p>
              <input id="lastUpdated" name="lastUpdated" type="text" defaultValue={yuk.lastUpdated} className={alan} />
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="degisiklik_notu" className={etiket}>Değişiklik notu (zorunlu)</label>
            <input id="degisiklik_notu" name="degisiklik_notu" type="text" required
                   placeholder="ör. Veri saklama süreleri bölümü eklendi"
                   className={`${alan} placeholder:text-white/20`} />
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
          <h2 className="mb-5 font-heading text-[1.05rem] font-semibold text-white">Başlık ve giriş</h2>
          <div className="space-y-5">
            <div>
              <label htmlFor="baslik" className={etiket}>Belge başlığı</label>
              <input id="baslik" name="baslik" type="text" required defaultValue={belge.baslik} className={alan} />
            </div>
            <div>
              <label htmlFor="accent" className={etiket}>Üst etiket</label>
              <input id="accent" name="accent" type="text" defaultValue={yuk.accent} className={alan} />
            </div>
            <div>
              <label htmlFor="intro" className={etiket}>Giriş metni</label>
              <textarea id="intro" name="intro" rows={4} defaultValue={belge.ozet} className={alan} />
            </div>
            <div>
              <label htmlFor="meta_title" className={etiket}>Meta başlık</label>
              <input id="meta_title" name="meta_title" type="text" defaultValue={belge.meta_title} className={alan} />
            </div>
            <div>
              <label htmlFor="meta_description" className={etiket}>Meta açıklama</label>
              <textarea id="meta_description" name="meta_description" rows={3} defaultValue={belge.meta_description} className={alan} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
          <h2 className="font-heading text-[1.05rem] font-semibold text-white">Bölümler</h2>
          <p className="mt-1.5 mb-5 font-body text-[0.78rem] leading-relaxed text-white/45">
            Metin alanına <strong className="font-semibold text-white/70">tek paragraf</strong> yazarsanız paragraf olarak,
            <strong className="font-semibold text-white/70"> her satıra bir madde</strong> yazarsanız madde listesi olarak
            basılır. Başlığı boş bırakılan bölüm kaydedilmez.
          </p>
          <div className="space-y-5">
            {bolumler.map((b, i) => (
              <div key={i} className="rounded-xl border border-white/[0.06] p-4">
                <label htmlFor={`bolum_baslik_${i}`} className="block font-body text-[0.76rem] text-white/55">
                  {i + 1}. bölüm başlığı
                </label>
                <input id={`bolum_baslik_${i}`} name={`bolum_baslik_${i}`} type="text" defaultValue={b.title} className={alan} />
                <label htmlFor={`bolum_metin_${i}`} className="mt-3 block font-body text-[0.76rem] text-white/55">Metin</label>
                <textarea
                  id={`bolum_metin_${i}`}
                  name={`bolum_metin_${i}`}
                  rows={Array.isArray(b.body) ? Math.max(4, b.body.length + 1) : 5}
                  defaultValue={Array.isArray(b.body) ? b.body.join('\n') : b.body}
                  className={alan}
                />
                {/* Liste mi paragraf mı olduğu, satır sayısından DEĞİL bu kutudan
                    belirlenir: tek maddelik bir liste yanlışlıkla paragrafa dönüşmemeli. */}
                <label className="mt-3 inline-flex items-center gap-2 font-body text-[0.8rem] text-white/55">
                  <input type="checkbox" name={`bolum_liste_${i}`} defaultChecked={Array.isArray(b.body)} className="h-4 w-4 accent-[#ffa9f9]" />
                  Madde listesi olarak göster
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
          <label htmlFor="durum" className={etiket}>Durum</label>
          <select id="durum" name="durum" defaultValue={belge.durum} className={`${alan} max-w-xs`}>
            {ICERIK_DURUMLARI.map((d) => (
              <option key={d} value={d} className="bg-[#15121d]">{d}</option>
            ))}
          </select>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="min-h-[46px] rounded-xl px-7 py-3 font-body text-[0.85rem] font-semibold text-black transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #fff7ad, #ffa9f9)' }}
          >
            Yeni Sürümü Yayınla
          </button>
          <a href={`/${belge.slug}`} target="_blank" rel="noreferrer"
             className="font-body text-[0.8rem] text-white/50 underline-offset-4 transition-colors hover:text-white hover:underline">
            Sayfayı görüntüle ↗
          </a>
        </div>
      </form>

      {revizyonlar.length > 0 && (
        <section className="mt-10 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
          <h2 className="mb-4 font-heading text-[1.05rem] font-semibold text-white">Revizyon geçmişi</h2>
          <ul className="space-y-3">
            {revizyonlar.map((r) => (
              <li key={r.surum} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-body text-[0.82rem] text-white/55">
                <span className="font-semibold text-white/75">v{r.surum}</span>
                <span>{r.yururluk}</span>
                <span className="text-white/40">{r.degisiklik_notu}</span>
                <span className="text-white/25">{r.onaylayan}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
