import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIcerik, getSss, listSurumler, ICERIK_DURUMLARI, type SehirYuku } from '@/lib/db/content-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HATA_METNI: Record<string, string> = {
  'baslik-bos': 'Başlık boş bırakılamaz.',
  'gecersiz-tarih': 'Güncelleme tarihi YYYY-AA-GG biçiminde olmalıdır.',
  'gecersiz-durum': 'Geçersiz durum değeri.',
  bulunamadi: 'Sayfa bulunamadı.',
  kaydedilemedi: 'Kaydedilemedi; değişiklik geri alındı.',
  origin: 'Güvenlik doğrulaması başarısız. Sayfayı yenileyip tekrar deneyin.',
};

const alan =
  'mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.88rem] text-white outline-none transition-colors hover:border-white/20 focus:border-accent/60';
const etiket = 'block font-body text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/55';

// Mevcut bölümlerin üstüne 2 boş slot. Dinamik ekleme JavaScript gerektirirdi;
// panel bilerek JS'siz çalışıyor (giriş akışıyla aynı gerekçe).
const BOS_SLOT = 2;

export default async function SehirDuzenle({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kayit?: string; hata?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const sayfa = getIcerik(Number(id));
  if (!sayfa || sayfa.tip !== 'sehir') notFound();

  const sss = getSss(sayfa.id);
  const surumler = listSurumler(sayfa.id);
  const y = JSON.parse(sayfa.govde) as SehirYuku;

  const bolumler = [...y.sections, ...Array.from({ length: BOS_SLOT }, () => ({ h2: '', body: '' }))];
  const sorular = [...sss.map((f) => ({ soru: f.soru, cevap: f.cevap })),
                   ...Array.from({ length: BOS_SLOT }, () => ({ soru: '', cevap: '' }))];

  return (
    <>
      <Link href="/admin/sehirler" className="font-body text-[0.8rem] text-white/45 transition-colors hover:text-white">
        ← Şehir sayfaları
      </Link>

      <h1 className="mt-3 font-heading text-[1.4rem] font-semibold text-white">{sayfa.baslik}</h1>
      <p className="mt-1 mb-8 font-body text-[0.8rem] text-white/35">
        /{sayfa.slug} · hedef kelime &ldquo;{y.keyword}&rdquo; ·{' '}
        {surumler.length === 0 ? 'sürüm geçmişi yok' : `${surumler.length} sürüm kayıtlı`}
      </p>

      {sp.kayit === 'tamam' && (
        <p role="status" className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.08] px-4 py-3 font-body text-[0.85rem] text-emerald-200">
          Kaydedildi. Sayfa yeniden üretildi ve sitemap tarihi güncellendi.
        </p>
      )}
      {sp.hata && (
        <p role="alert" className="mb-6 rounded-xl border border-red-400/30 bg-red-400/[0.08] px-4 py-3 font-body text-[0.85rem] text-red-200">
          {HATA_METNI[sp.hata] ?? 'Kaydedilemedi.'}
        </p>
      )}

      <form action={`/admin/sehirler/${sayfa.id}/kaydet`} method="post" className="space-y-8">
        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
          <h2 className="mb-5 font-heading text-[1.05rem] font-semibold text-white">Başlık ve arama görünümü</h2>
          <div className="space-y-5">
            <div>
              <label htmlFor="baslik" className={etiket}>Sayfa başlığı (H1)</label>
              <input id="baslik" name="baslik" type="text" required defaultValue={sayfa.baslik} className={alan} />
            </div>
            <div>
              <label htmlFor="meta_title" className={etiket}>Meta başlık</label>
              <p className="mt-1 font-body text-[0.76rem] text-white/35">Şu an {sayfa.meta_title.length} karakter.</p>
              <input id="meta_title" name="meta_title" type="text" defaultValue={sayfa.meta_title} className={alan} />
            </div>
            <div>
              <label htmlFor="meta_description" className={etiket}>Meta açıklama</label>
              <p className="mt-1 font-body text-[0.76rem] text-white/35">Şu an {sayfa.meta_description.length} karakter.</p>
              <textarea id="meta_description" name="meta_description" rows={3} defaultValue={sayfa.meta_description} className={alan} />
            </div>
            <div>
              <label htmlFor="keyword" className={etiket}>Hedef anahtar kelime</label>
              <p className="mt-1 font-body text-[0.76rem] text-white/35">
                Yapısal veride `serviceType` olarak yayınlanır.
              </p>
              <input id="keyword" name="keyword" type="text" defaultValue={y.keyword} className={alan} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
          <h2 className="font-heading text-[1.05rem] font-semibold text-white">Giriş metni</h2>
          <p className="mt-1.5 mb-4 font-body text-[0.78rem] leading-relaxed text-white/45">
            Sayfanın ilk paragrafı. Şehrin kendi bağlamını burada kurmak, sayfanın
            diğer şehirlerin kopyası görünmesini engelleyen ilk sinyaldir.
          </p>
          <textarea id="intro" name="intro" rows={5} defaultValue={y.intro} className={alan} />
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
          <h2 className="font-heading text-[1.05rem] font-semibold text-white">Bölümler</h2>
          <p className="mt-1.5 mb-5 font-body text-[0.78rem] leading-relaxed text-white/45">
            Her bölüm sayfada bir H2 başlık ve altındaki paragraf olarak görünür.
            Başlığı boş bırakılan bölüm kaydedilmez — silmek için başlığı boşaltın.
          </p>
          <div className="space-y-5">
            {bolumler.map((b, i) => (
              <div key={i} className="rounded-xl border border-white/[0.06] p-4">
                <label htmlFor={`bolum_h2_${i}`} className="block font-body text-[0.76rem] text-white/55">
                  {i + 1}. bölüm başlığı
                </label>
                <input id={`bolum_h2_${i}`} name={`bolum_h2_${i}`} type="text" defaultValue={b.h2} className={alan} />
                <label htmlFor={`bolum_body_${i}`} className="mt-3 block font-body text-[0.76rem] text-white/55">
                  Metin
                </label>
                <textarea id={`bolum_body_${i}`} name={`bolum_body_${i}`} rows={5} defaultValue={b.body} className={alan} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
          <h2 className="mb-5 font-heading text-[1.05rem] font-semibold text-white">Öne çıkanlar listesi</h2>
          <div>
            <label htmlFor="bullets_title" className={etiket}>Liste başlığı</label>
            <input id="bullets_title" name="bullets_title" type="text" defaultValue={y.bullets.title} className={alan} />
          </div>
          <div className="mt-5">
            <label htmlFor="bullets_items" className={etiket}>Maddeler</label>
            <p className="mt-1 font-body text-[0.76rem] text-white/35">Her satır bir madde. Boş satırlar atılır.</p>
            <textarea id="bullets_items" name="bullets_items" rows={8} defaultValue={y.bullets.items.join('\n')} className={alan} />
          </div>
        </section>

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
          <h2 className="mb-5 font-heading text-[1.05rem] font-semibold text-white">İç linkler ve yayın</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="serviceLabel" className={etiket}>Hizmet bağlantısı — metin</label>
              <input id="serviceLabel" name="serviceLabel" type="text" defaultValue={y.serviceLabel} className={alan} />
            </div>
            <div>
              <label htmlFor="serviceHref" className={etiket}>Hizmet bağlantısı — adres</label>
              <input id="serviceHref" name="serviceHref" type="text" defaultValue={y.serviceHref} className={alan} />
            </div>
            <div>
              <label htmlFor="blogLabel" className={etiket}>Blog bağlantısı — metin</label>
              <input id="blogLabel" name="blogLabel" type="text" defaultValue={y.blogLabel} className={alan} />
            </div>
            <div>
              <label htmlFor="blogHref" className={etiket}>Blog bağlantısı — adres</label>
              <input id="blogHref" name="blogHref" type="text" defaultValue={y.blogHref} className={alan} />
            </div>
            <div>
              <label htmlFor="guncelleme_tarihi" className={etiket}>Güncelleme tarihi</label>
              <p className="mt-1 font-body text-[0.76rem] text-white/35">
                Sitemap `lastmod` değeri. Artık sayfa başına — bir şehri düzenlemek
                diğerlerini &ldquo;güncellendi&rdquo; göstermez.
              </p>
              <input id="guncelleme_tarihi" name="guncelleme_tarihi" type="date" required defaultValue={sayfa.guncelleme_tarihi} className={alan} />
            </div>
            <div>
              <label htmlFor="durum" className={etiket}>Durum</label>
              <select id="durum" name="durum" defaultValue={sayfa.durum} className={alan}>
                {ICERIK_DURUMLARI.map((d) => (
                  <option key={d} value={d} className="bg-[#15121d]">{d}</option>
                ))}
              </select>
            </div>
          </div>
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
            href={`/${sayfa.slug}`}
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
