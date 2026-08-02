import { listAyarlar } from '@/lib/db/settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GRUP_BASLIK: Record<string, string> = {
  kimlik: 'Kimlik',
  iletisim: 'İletişim',
  adres: 'Adres',
  yasal: 'Yasal Bilgiler',
  sosyal: 'Sosyal Profiller',
};

const GRUP_ACIKLAMA: Record<string, string> = {
  kimlik: 'Markanın adı ve sloganı.',
  iletisim: 'Bu alanlar sitenin TAMAMINDA kullanılır: iletişim sayfası, alt bilgi, WhatsApp butonu ve arama motorlarına gönderilen yapısal veri.',
  adres: 'Açık adres boş bırakılabilir; o zaman yapısal veride sokak satırı üretilmez.',
  yasal: 'Ticari unvan, vergi ve MERSİS bilgileri. Faturalarda ve yasal metinlerde kullanılır.',
  sosyal: 'Her satıra bir tam URL. Yalnızca GERÇEKTEN açık olan profilleri girin — var olmayan bir profili arama motoruna bildirmek doğrulanamaz sinyal üretir.',
};

export default async function AyarlarSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ kayit?: string; hata?: string }>;
}) {
  const sp = await searchParams;
  const ayarlar = listAyarlar();

  const gruplar = ayarlar.reduce<Record<string, typeof ayarlar>>((acc, a) => {
    (acc[a.grup] ??= []).push(a);
    return acc;
  }, {});

  return (
    <>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-[1.5rem] font-semibold text-white">Şirket Ayarları</h1>
        <p className="font-body text-[0.82rem] text-white/40">{ayarlar.length} alan</p>
      </div>
      <p className="mb-8 max-w-2xl font-body text-[0.85rem] leading-relaxed text-white/50">
        Buradaki bilgiler sitenin tek kaynağıdır. Bir alanı değiştirdiğinizde iletişim
        sayfası, alt bilgi, WhatsApp butonu ve arama motorlarına gönderilen yapısal veri
        birlikte güncellenir.
      </p>

      {sp.kayit === 'tamam' && (
        <p role="status" className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.08] px-4 py-3 font-body text-[0.85rem] text-emerald-200">
          Kaydedildi. Site sayfaları yeniden üretildi — değişiklik birkaç saniye içinde yayında.
        </p>
      )}
      {sp.hata && (
        <p role="alert" className="mb-6 rounded-xl border border-red-400/30 bg-red-400/[0.08] px-4 py-3 font-body text-[0.85rem] text-red-200">
          {sp.hata === 'origin'
            ? 'Güvenlik doğrulaması başarısız. Sayfayı yenileyip tekrar deneyin.'
            : 'Kaydedilemedi. Değerleri kontrol edip tekrar deneyin.'}
        </p>
      )}

      {/* Server Action DEĞİL, klasik form POST + rota işleyicisi.
          Panelin genelinde uygulanan kalıp; JavaScript kapalıyken de çalışır. */}
      <form action="/admin/ayarlar/kaydet" method="post" className="space-y-8">
        {Object.entries(gruplar).map(([grup, liste]) => (
          <section key={grup} className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
            <h2 className="font-heading text-[1.05rem] font-semibold text-white">
              {GRUP_BASLIK[grup] ?? grup}
            </h2>
            {GRUP_ACIKLAMA[grup] && (
              <p className="mt-1.5 mb-5 font-body text-[0.8rem] leading-relaxed text-white/45">
                {GRUP_ACIKLAMA[grup]}
              </p>
            )}

            <div className="space-y-5">
              {liste.map((a) => (
                <div key={a.anahtar}>
                  <label
                    htmlFor={a.anahtar}
                    className="block font-body text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/55"
                  >
                    {a.etiket || a.anahtar}
                  </label>
                  {a.aciklama && (
                    <p className="mt-1 font-body text-[0.76rem] leading-relaxed text-white/35">{a.aciklama}</p>
                  )}

                  {a.tip === 'uzun-metin' || a.tip === 'liste' ? (
                    <textarea
                      id={a.anahtar}
                      name={a.anahtar}
                      rows={a.tip === 'liste' ? 4 : 3}
                      defaultValue={a.deger}
                      className="mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.9rem] text-white outline-none transition-colors hover:border-white/20 focus:border-accent/60"
                    />
                  ) : (
                    <input
                      id={a.anahtar}
                      name={a.anahtar}
                      type={a.tip === 'eposta' ? 'email' : a.tip === 'telefon' ? 'tel' : 'text'}
                      defaultValue={a.deger}
                      className="mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.9rem] text-white outline-none transition-colors hover:border-white/20 focus:border-accent/60"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="min-h-[46px] rounded-xl px-7 py-3 font-body text-[0.85rem] font-semibold text-black transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #fff7ad, #ffa9f9)' }}
          >
            Kaydet ve Yayınla
          </button>
          <p className="font-body text-[0.76rem] text-white/40">
            Kaydetme, etkilenen sayfaları yeniden üretir.
          </p>
        </div>
      </form>
    </>
  );
}
