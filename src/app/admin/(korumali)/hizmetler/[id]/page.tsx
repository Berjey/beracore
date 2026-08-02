import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIcerik, getSss, listSurumler, ICERIK_DURUMLARI } from '@/lib/db/content-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HATA_METNI: Record<string, string> = {
  'baslik-bos': 'Başlık boş bırakılamaz.',
  'gecersiz-durum': 'Geçersiz durum değeri.',
  bulunamadi: 'Sayfa bulunamadı.',
  kaydedilemedi: 'Kaydedilemedi; değişiklik geri alındı.',
  origin: 'Güvenlik doğrulaması başarısız. Sayfayı yenileyip tekrar deneyin.',
};

const alan =
  'mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.88rem] text-white outline-none transition-colors hover:border-white/20 focus:border-accent/60';
const etiket = 'block font-body text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/55';
const BOS_SLOT = 2;

export default async function HizmetDuzenle({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kayit?: string; hata?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const kayit = getIcerik(Number(id));
  if (!kayit || (kayit.tip !== 'hizmet' && kayit.tip !== 'hizmet-alt')) notFound();

  const kategoriMi = kayit.tip === 'hizmet';
  const yuk = JSON.parse(kayit.govde) as Record<string, unknown>;
  const sss = getSss(kayit.id);
  const surumler = listSurumler(kayit.id);

  const sorular = [...sss.map((f) => ({ soru: f.soru, cevap: f.cevap })),
                   ...Array.from({ length: BOS_SLOT }, () => ({ soru: '', cevap: '' }))];

  const overview = kategoriMi
    ? [...(yuk.overview as { h2: string; body: string }[] ?? []),
       ...Array.from({ length: BOS_SLOT }, () => ({ h2: '', body: '' }))]
    : [];

  const stats = (yuk.stats as { value: string; label: string }[] ?? []);

  return (
    <>
      <Link href="/admin/hizmetler" className="font-body text-[0.8rem] text-white/45 transition-colors hover:text-white">
        ← Hizmet sayfaları
      </Link>

      <h1 className="mt-3 font-heading text-[1.4rem] font-semibold text-white">{kayit.baslik}</h1>
      <p className="mt-1 mb-8 font-body text-[0.8rem] text-white/35">
        /hizmetler/{kayit.slug} · {kategoriMi ? 'kategori sayfası' : 'alt hizmet sayfası'} ·{' '}
        {surumler.length === 0 ? 'sürüm geçmişi yok' : `${surumler.length} sürüm kayıtlı`}
      </p>

      {sp.kayit === 'tamam' && (
        <p role="status" className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.08] px-4 py-3 font-body text-[0.85rem] text-emerald-200">
          Kaydedildi. Sayfa yeniden üretildi — değişiklik birkaç saniye içinde yayında.
        </p>
      )}
      {sp.hata && (
        <p role="alert" className="mb-6 rounded-xl border border-red-400/30 bg-red-400/[0.08] px-4 py-3 font-body text-[0.85rem] text-red-200">
          {HATA_METNI[sp.hata] ?? 'Kaydedilemedi.'}
        </p>
      )}

      <form action={`/admin/hizmetler/${kayit.id}/kaydet`} method="post" className="space-y-8">
        <input type="hidden" name="tip" value={kayit.tip} />

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
          <h2 className="mb-5 font-heading text-[1.05rem] font-semibold text-white">Başlık ve tanıtım</h2>
          <div className="space-y-5">
            <div>
              <label htmlFor="baslik" className={etiket}>Başlık</label>
              <input id="baslik" name="baslik" type="text" required defaultValue={kayit.baslik} className={alan} />
            </div>

            {kategoriMi && (
              <div>
                <label htmlFor="subtitle" className={etiket}>Alt başlık</label>
                <p className="mt-1 font-body text-[0.76rem] text-white/35">Ana sayfadaki 3D hizmet bölümünde görünür.</p>
                <input id="subtitle" name="subtitle" type="text" defaultValue={String(yuk.subtitle ?? '')} className={alan} />
              </div>
            )}

            <div>
              <label htmlFor="ozet" className={etiket}>Kısa açıklama</label>
              <p className="mt-1 font-body text-[0.76rem] text-white/35">
                Kartlarda, menüde ve yapısal veride kullanılır.
              </p>
              <textarea id="ozet" name="ozet" rows={3} defaultValue={kayit.ozet} className={alan} />
            </div>

            {!kategoriMi && (
              <>
                <div>
                  <label htmlFor="meta_title" className={etiket}>Meta başlık</label>
                  <p className="mt-1 font-body text-[0.76rem] text-white/35">Şu an {kayit.meta_title.length} karakter.</p>
                  <input id="meta_title" name="meta_title" type="text" defaultValue={kayit.meta_title} className={alan} />
                </div>
                <div>
                  <label htmlFor="meta_description" className={etiket}>Meta açıklama</label>
                  <p className="mt-1 font-body text-[0.76rem] text-white/35">Şu an {kayit.meta_description.length} karakter.</p>
                  <textarea id="meta_description" name="meta_description" rows={3} defaultValue={kayit.meta_description} className={alan} />
                </div>
                <div>
                  <label htmlFor="longDescription" className={etiket}>Uzun açıklama</label>
                  <textarea id="longDescription" name="longDescription" rows={6} defaultValue={String(yuk.longDescription ?? '')} className={alan} />
                </div>
              </>
            )}
          </div>
        </section>

        {kategoriMi ? (
          <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
            <h2 className="font-heading text-[1.05rem] font-semibold text-white">Genel bakış bölümleri</h2>
            <p className="mt-1.5 mb-5 font-body text-[0.78rem] leading-relaxed text-white/45">
              Kategori sayfasının gövdesi. Bu bölümler 2 Ağu 2026&apos;da eklendi: hub sayfaları
              252-299 kelimeydi ve ticari sorgularda yarışacak hacimleri yoktu. Kısaltmak
              o kazanımı geri verir. Başlığı boş bırakılan bölüm kaydedilmez.
            </p>
            <div className="space-y-5">
              {overview.map((b, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] p-4">
                  <label htmlFor={`ov_h2_${i}`} className="block font-body text-[0.76rem] text-white/55">{i + 1}. bölüm başlığı</label>
                  <input id={`ov_h2_${i}`} name={`ov_h2_${i}`} type="text" defaultValue={b.h2} className={alan} />
                  <label htmlFor={`ov_body_${i}`} className="mt-3 block font-body text-[0.76rem] text-white/55">Metin</label>
                  <textarea id={`ov_body_${i}`} name={`ov_body_${i}`} rows={5} defaultValue={b.body} className={alan} />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
            <h2 className="font-heading text-[1.05rem] font-semibold text-white">Listeler</h2>
            <p className="mt-1.5 mb-5 font-body text-[0.78rem] leading-relaxed text-white/45">
              Her satır bir madde. Boş satırlar atılır.
            </p>
            <div className="space-y-5">
              {([
                ['features', 'Özellikler'],
                ['process', 'Süreç adımları'],
                ['benefits', 'Faydalar'],
              ] as const).map(([ad, baslik]) => (
                <div key={ad}>
                  <label htmlFor={ad} className={etiket}>{baslik}</label>
                  <textarea
                    id={ad}
                    name={ad}
                    rows={6}
                    defaultValue={((yuk[ad] as string[]) ?? []).join('\n')}
                    className={alan}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="stats" className={etiket}>Öne çıkanlar (4 kutu)</label>
                <p className="mt-1 font-body text-[0.76rem] leading-relaxed text-white/35">
                  Her satır <code className="text-white/60">değer | etiket</code> biçiminde.
                  <strong className="ml-1 font-semibold text-amber-200/80">
                    Kanıtlanamayan sayı yazmayın.
                  </strong>{' '}
                  Bu alanlar 2 Ağu 2026&apos;da tam da bu yüzden temizlendi: sayfalar toplamda
                  500&apos;den fazla proje iddia ediyordu, ana sayfa 25+ diyordu.
                </p>
                <textarea
                  id="stats"
                  name="stats"
                  rows={5}
                  defaultValue={stats.map((s) => `${s.value} | ${s.label}`).join('\n')}
                  className={`${alan} font-mono text-[0.82rem]`}
                />
              </div>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
          <h2 className="font-heading text-[1.05rem] font-semibold text-white">Sık sorulan sorular</h2>
          <p className="mt-1.5 mb-5 font-body text-[0.78rem] leading-relaxed text-white/45">
            FAQPage şeması olarak yayınlanır. Soru veya cevabı boş bırakılan satır kaydedilmez.
          </p>
          <div className="space-y-5">
            {sorular.map((f, i) => (
              <div key={i} className="rounded-xl border border-white/[0.06] p-4">
                <label htmlFor={`sss_soru_${i}`} className="block font-body text-[0.76rem] text-white/55">{i + 1}. soru</label>
                <input id={`sss_soru_${i}`} name={`sss_soru_${i}`} type="text" defaultValue={f.soru} className={alan} />
                <label htmlFor={`sss_cevap_${i}`} className="mt-3 block font-body text-[0.76rem] text-white/55">Cevap</label>
                <textarea id={`sss_cevap_${i}`} name={`sss_cevap_${i}`} rows={3} defaultValue={f.cevap} className={alan} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
          <label htmlFor="durum" className={etiket}>Durum</label>
          <select id="durum" name="durum" defaultValue={kayit.durum} className={`${alan} max-w-xs`}>
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
            Kaydet ve Yayınla
          </button>
          <a
            href={`/hizmetler/${kayit.slug}`}
            target="_blank"
            rel="noreferrer"
            className="font-body text-[0.8rem] text-white/50 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Sayfayı görüntüle ↗
          </a>
        </div>
      </form>

      {surumler.length > 0 && (
        <section className="mt-10 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
          <h2 className="mb-4 font-heading text-[1.05rem] font-semibold text-white">Sürüm geçmişi</h2>
          <ul className="space-y-2">
            {surumler.map((s) => (
              <li key={s.id} className="flex flex-wrap items-baseline gap-3 font-body text-[0.82rem] text-white/55">
                <span className="font-semibold text-white/75">v{s.surum}</span>
                <span>{s.created_at}</span>
                <span className="text-white/35">{s.actor}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
