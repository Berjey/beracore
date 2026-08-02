import { listMetrikler } from '@/lib/db/metrics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DURUM_ETIKET: Record<string, string> = {
  taslak: 'Taslak — yayında değil',
  dogrulandi: 'Doğrulandı — yayına hazır',
  yayinda: 'Yayında',
  arsiv: 'Arşiv',
};

const HATA_METNI: Record<string, string> = {
  'kanitsiz-yayin':
    'Bir metriği yayınlamak için "Veri kaynağı" alanı doldurulmalıdır. Sayının nereden geldiği yazılı olmadan yayına alınamaz.',
  'gecersiz-durum': 'Geçersiz durum değeri.',
  'gecersiz-deger': 'Değer negatif olamaz ve sayı olmalıdır.',
  bulunamadi: 'Metrik bulunamadı.',
  origin: 'Güvenlik doğrulaması başarısız. Sayfayı yenileyip tekrar deneyin.',
};

export default async function MetriklerSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ kayit?: string; hata?: string }>;
}) {
  const sp = await searchParams;
  const metrikler = listMetrikler();
  const yayinda = metrikler.filter((m) => m.durum === 'yayinda').length;

  return (
    <>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-[1.5rem] font-semibold text-white">Şirket Metrikleri</h1>
        <p className="font-body text-[0.82rem] text-white/40">
          {yayinda} / {metrikler.length} yayında
        </p>
      </div>
      <p className="mb-8 max-w-2xl font-body text-[0.85rem] leading-relaxed text-white/50">
        Ana sayfa ve Hakkımızda sayfasındaki rakamlar buradan gelir. <strong className="font-semibold text-white/75">Yalnızca
        durumu &ldquo;Yayında&rdquo; olan metrikler sitede görünür.</strong> Bir metriği yayına almak için önce
        veri kaynağını yazın: sayının hangi kayda dayandığı belli değilse yayınlanmamalıdır.
      </p>

      {sp.kayit === 'tamam' && (
        <p role="status" className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.08] px-4 py-3 font-body text-[0.85rem] text-emerald-200">
          Kaydedildi. Site sayfaları yeniden üretildi — değişiklik birkaç saniye içinde yayında.
        </p>
      )}
      {sp.hata && (
        <p role="alert" className="mb-6 rounded-xl border border-red-400/30 bg-red-400/[0.08] px-4 py-3 font-body text-[0.85rem] text-red-200">
          {HATA_METNI[sp.hata] ?? 'Kaydedilemedi. Değerleri kontrol edip tekrar deneyin.'}
        </p>
      )}

      <div className="space-y-6">
        {metrikler.map((m) => {
          const acik = m.durum === 'yayinda';
          return (
            /* Her metrik AYRI form: bir metriğin kanıtını girerken diğerinin
               yarım kalmış alanları kazara kaydedilmesin. */
            <form
              key={m.anahtar}
              action="/admin/metrikler/kaydet"
              method="post"
              className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4"
            >
              <input type="hidden" name="anahtar" value={m.anahtar} />

              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-[1.05rem] font-semibold text-white">{m.baslik}</h2>
                  <p className="mt-0.5 font-body text-[0.76rem] text-white/35">{m.alt_baslik}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 font-body text-[0.72rem] font-semibold ${
                    acik
                      ? 'border border-emerald-400/30 bg-emerald-400/[0.1] text-emerald-200'
                      : 'border border-amber-400/25 bg-amber-400/[0.08] text-amber-200'
                  }`}
                >
                  {acik ? 'Sitede görünüyor' : 'Sitede görünmüyor'}
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${m.anahtar}-deger`} className="block font-body text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/55">
                    Değer
                  </label>
                  <p className="mt-1 font-body text-[0.76rem] text-white/35">
                    Sitede &ldquo;{m.on_ek}{m.deger}{m.son_ek}&rdquo; olarak görünür.
                  </p>
                  <input
                    id={`${m.anahtar}-deger`}
                    name="deger"
                    type="number"
                    min={0}
                    step={1}
                    required
                    defaultValue={m.deger}
                    className="mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.9rem] text-white outline-none transition-colors hover:border-white/20 focus:border-accent/60"
                  />
                </div>

                <div>
                  <label htmlFor={`${m.anahtar}-durum`} className="block font-body text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/55">
                    Durum
                  </label>
                  <p className="mt-1 font-body text-[0.76rem] text-white/35">
                    Yalnızca &ldquo;Yayında&rdquo; sitede görünür.
                  </p>
                  <select
                    id={`${m.anahtar}-durum`}
                    name="durum"
                    defaultValue={m.durum}
                    className="mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.9rem] text-white outline-none transition-colors hover:border-white/20 focus:border-accent/60"
                  >
                    {Object.entries(DURUM_ETIKET).map(([v, etiket]) => (
                      <option key={v} value={v} className="bg-[#15121d]">
                        {etiket}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <fieldset className="mt-6 rounded-xl border border-white/[0.07] p-5 max-sm:p-4">
                <legend className="px-2 font-body text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/55">
                  Kanıt
                </legend>
                <p className="mb-4 font-body text-[0.76rem] leading-relaxed text-white/35">
                  Bu alanlar ziyaretçiye gösterilmez. Amaçları, bir sayı sorulduğunda
                  cevabın kayıtlı olması.
                </p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor={`${m.anahtar}-yontem`} className="block font-body text-[0.76rem] text-white/55">
                      Ölçüm yöntemi — sayı nasıl hesaplanıyor?
                    </label>
                    <textarea
                      id={`${m.anahtar}-yontem`}
                      name="olcum_yontemi"
                      rows={2}
                      defaultValue={m.olcum_yontemi}
                      className="mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.88rem] text-white outline-none transition-colors hover:border-white/20 focus:border-accent/60"
                    />
                  </div>

                  <div>
                    <label htmlFor={`${m.anahtar}-kaynak`} className="block font-body text-[0.76rem] text-white/55">
                      Veri kaynağı — hangi kayıt? <span className="text-amber-200/70">(yayınlamak için zorunlu)</span>
                    </label>
                    <input
                      id={`${m.anahtar}-kaynak`}
                      name="veri_kaynagi"
                      type="text"
                      defaultValue={m.veri_kaynagi}
                      placeholder="ör. Muhasebe kaydı — kesilen faturalar, Ocak 2024 – Ağustos 2026"
                      className="mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.88rem] text-white outline-none transition-colors placeholder:text-white/20 hover:border-white/20 focus:border-accent/60"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`${m.anahtar}-kanit`} className="block font-body text-[0.76rem] text-white/55">
                        Kanıt bağlantısı (varsa)
                      </label>
                      <input
                        id={`${m.anahtar}-kanit`}
                        name="kanit_url"
                        type="text"
                        defaultValue={m.kanit_url}
                        className="mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.88rem] text-white outline-none transition-colors hover:border-white/20 focus:border-accent/60"
                      />
                    </div>
                    <div>
                      <label htmlFor={`${m.anahtar}-dogrulama`} className="block font-body text-[0.76rem] text-white/55">
                        Son doğrulama tarihi
                      </label>
                      <input
                        id={`${m.anahtar}-dogrulama`}
                        name="son_dogrulama"
                        type="date"
                        defaultValue={m.son_dogrulama}
                        className="mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.88rem] text-white outline-none transition-colors hover:border-white/20 focus:border-accent/60"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <div className="mt-5 flex flex-wrap items-center gap-6">
                <label className="inline-flex items-center gap-2 font-body text-[0.82rem] text-white/60">
                  <input type="checkbox" name="ana_sayfa" defaultChecked={m.ana_sayfa === 1} className="h-4 w-4 accent-[#ffa9f9]" />
                  Ana sayfada göster
                </label>
                <label className="inline-flex items-center gap-2 font-body text-[0.82rem] text-white/60">
                  <input type="checkbox" name="hakkimizda" defaultChecked={m.hakkimizda === 1} className="h-4 w-4 accent-[#ffa9f9]" />
                  Hakkımızda sayfasında göster
                </label>
              </div>

              <button
                type="submit"
                className="mt-6 min-h-[44px] rounded-xl px-6 py-2.5 font-body text-[0.82rem] font-semibold text-black transition-transform hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #fff7ad, #ffa9f9)' }}
              >
                Kaydet
              </button>
            </form>
          );
        })}
      </div>
    </>
  );
}
