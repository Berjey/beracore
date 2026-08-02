import { listReferanslar, REFERANS_DURUMLARI } from '@/lib/db/testimonials';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HATA_METNI: Record<string, string> = {
  'marka-bos': 'Marka adı boş bırakılamaz.',
  'metin-bos': 'Yorum metni boş bırakılamaz.',
  'marka-var': 'Bu markadan zaten bir referans var.',
  'izin-yok': 'Yayın izni işaretlenmeden referans yayınlanamaz.',
  'izin-kaynagi-yok': 'İzni nereden aldığınızı yazmadan yayınlayamazsınız.',
  'gecersiz-durum': 'Geçersiz durum değeri.',
  bulunamadi: 'Referans bulunamadı.',
  origin: 'Güvenlik doğrulaması başarısız. Sayfayı yenileyip tekrar deneyin.',
};

const alan =
  'mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.88rem] text-white outline-none transition-colors hover:border-white/20 focus:border-accent/60';
const etiket = 'block font-body text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/55';

export default async function ReferansPaneli({
  searchParams,
}: {
  searchParams: Promise<{ kayit?: string; hata?: string }>;
}) {
  const sp = await searchParams;
  const referanslar = listReferanslar();
  const yayinda = referanslar.filter((r) => r.durum === 'yayinda' && r.yayin_izni === 1).length;

  return (
    <>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-[1.5rem] font-semibold text-white">Müşteri Referansları</h1>
        <p className="font-body text-[0.82rem] text-white/40">{yayinda} / {referanslar.length} yayında</p>
      </div>
      <p className="mb-8 max-w-2xl font-body text-[0.85rem] leading-relaxed text-white/50">
        Bir müşteri yorumunu firma adıyla yayınlamak, o firmanın sizinle çalıştığını
        kamuya açıklaması demektir. Bu yüzden{' '}
        <strong className="font-semibold text-white/75">yayın izni işaretlenmeden ve izni nereden
        aldığınız yazılmadan bir referans yayınlanamaz.</strong>{' '}
        Kural veri katmanındadır; formu atlamak sonucu değiştirmez.
      </p>

      {sp.kayit === 'tamam' && (
        <p role="status" className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.08] px-4 py-3 font-body text-[0.85rem] text-emerald-200">
          Kaydedildi. Ana sayfa yeniden üretildi.
        </p>
      )}
      {sp.hata && (
        <p role="alert" className="mb-6 rounded-xl border border-red-400/30 bg-red-400/[0.08] px-4 py-3 font-body text-[0.85rem] text-red-200">
          {HATA_METNI[sp.hata] ?? 'Kaydedilemedi.'}
        </p>
      )}

      <div className="space-y-6">
        {referanslar.map((r) => {
          const gorunuyor = r.durum === 'yayinda' && r.yayin_izni === 1;
          return (
            <form key={r.id} action="/admin/referanslar/kaydet" method="post"
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
              <input type="hidden" name="id" value={r.id} />

              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-heading text-[1.05rem] font-semibold text-white">{r.marka}</h2>
                <span className={`rounded-full border px-3 py-1 font-body text-[0.72rem] font-semibold ${
                  gorunuyor
                    ? 'border-emerald-400/30 bg-emerald-400/[0.1] text-emerald-200'
                    : 'border-amber-400/25 bg-amber-400/[0.08] text-amber-200'
                }`}>
                  {gorunuyor ? 'Sitede görünüyor' : 'Sitede görünmüyor'}
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor={`marka-${r.id}`} className={etiket}>Marka</label>
                  <input id={`marka-${r.id}`} name="marka" type="text" required defaultValue={r.marka} className={alan} />
                </div>
                <div>
                  <label htmlFor={`kisi-${r.id}`} className={etiket}>Kişi</label>
                  <input id={`kisi-${r.id}`} name="kisi" type="text" defaultValue={r.kisi} className={alan} />
                </div>
                <div>
                  <label htmlFor={`unvan-${r.id}`} className={etiket}>Unvan</label>
                  <input id={`unvan-${r.id}`} name="unvan" type="text" defaultValue={r.unvan} className={alan} />
                </div>
                <div>
                  <label htmlFor={`kategori-${r.id}`} className={etiket}>Kategori</label>
                  <input id={`kategori-${r.id}`} name="kategori" type="text" defaultValue={r.kategori} className={alan} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`proje-${r.id}`} className={etiket}>Proje</label>
                  <input id={`proje-${r.id}`} name="proje" type="text" defaultValue={r.proje} className={alan} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`metin-${r.id}`} className={etiket}>Yorum metni</label>
                  <textarea id={`metin-${r.id}`} name="metin" rows={5} required defaultValue={r.metin} className={alan} />
                </div>
              </div>

              <fieldset className="mt-6 rounded-xl border border-white/[0.07] p-5 max-sm:p-4">
                <legend className="px-2 font-body text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/55">
                  İzin ve doğrulama
                </legend>

                <div className="space-y-4">
                  <label className="flex items-start gap-2.5 font-body text-[0.85rem] text-white/70">
                    <input type="checkbox" name="yayin_izni" defaultChecked={r.yayin_izni === 1} className="mt-0.5 h-4 w-4 accent-[#ffa9f9]" />
                    <span>Müşteri, adının ve yorumunun yayınlanmasına <strong className="font-semibold">izin verdi</strong></span>
                  </label>
                  <label className="flex items-start gap-2.5 font-body text-[0.85rem] text-white/70">
                    <input type="checkbox" name="dogrulandi" defaultChecked={r.dogrulandi === 1} className="mt-0.5 h-4 w-4 accent-[#ffa9f9]" />
                    <span>Metin <strong className="font-semibold">müşterinin kendi ifadesi</strong> (bizim kalemimizden çıkmadı)</span>
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`kaynak-${r.id}`} className="block font-body text-[0.76rem] text-white/55">
                        İzni nereden aldınız? <span className="text-amber-200/70">(yayınlamak için zorunlu)</span>
                      </label>
                      <input id={`kaynak-${r.id}`} name="izin_kaynagi" type="text"
                             placeholder="ör. e-posta onayı, WhatsApp yazışması"
                             defaultValue={r.izin_kaynagi} className={`${alan} placeholder:text-white/20`} />
                    </div>
                    <div>
                      <label htmlFor={`tarih-${r.id}`} className="block font-body text-[0.76rem] text-white/55">İzin tarihi</label>
                      <input id={`tarih-${r.id}`} name="izin_tarihi" type="date" defaultValue={r.izin_tarihi} className={alan} />
                    </div>
                  </div>
                </div>
              </fieldset>

              <div className="mt-5 flex flex-wrap items-end gap-4">
                <div>
                  <label htmlFor={`durum-${r.id}`} className={etiket}>Durum</label>
                  <select id={`durum-${r.id}`} name="durum" defaultValue={r.durum} className={`${alan} min-w-[12rem]`}>
                    {REFERANS_DURUMLARI.map((d) => (
                      <option key={d} value={d} className="bg-[#15121d]">{d}</option>
                    ))}
                  </select>
                </div>
                <button type="submit"
                        className="min-h-[46px] rounded-xl px-6 py-3 font-body text-[0.85rem] font-semibold text-black transition-transform hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(135deg, #fff7ad, #ffa9f9)' }}>
                  Kaydet
                </button>
              </div>
            </form>
          );
        })}
      </div>

      <section className="mt-10 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
        <h2 className="font-heading text-[1.05rem] font-semibold text-white">Yeni referans ekle</h2>
        <p className="mt-1.5 mb-5 font-body text-[0.78rem] leading-relaxed text-white/45">
          Yeni kayıt her zaman <strong className="font-semibold text-white/70">izinsiz ve taslak</strong> olarak
          başlar. Yayına almak ayrı ve bilinçli bir ikinci adımdır — izin sorusu bir
          onay kutusuna indirgenmemeli.
        </p>
        <form action="/admin/referanslar/ekle" method="post" className="space-y-4">
          <div>
            <label htmlFor="yeni-marka" className={etiket}>Marka</label>
            <input id="yeni-marka" name="marka" type="text" required className={alan} />
          </div>
          <div>
            <label htmlFor="yeni-metin" className={etiket}>Yorum metni</label>
            <textarea id="yeni-metin" name="metin" rows={4} required className={alan} />
          </div>
          <button type="submit"
                  className="min-h-[44px] rounded-xl border border-white/15 px-6 py-2.5 font-body text-[0.85rem] font-semibold text-white/80 transition-colors hover:border-white/35 hover:text-white">
            Taslak olarak ekle
          </button>
        </form>
      </section>
    </>
  );
}
