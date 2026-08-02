import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIcerik, getSss, listSurumler, ICERIK_DURUMLARI } from '@/lib/db/content-admin';
import { bloklariMetne } from '@/lib/icerik-bicim';
import { CATEGORY_META, type ContentBlock } from '@/lib/blog-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HATA_METNI: Record<string, string> = {
  'baslik-bos': 'Başlık boş bırakılamaz.',
  'gecersiz-tarih': 'Tarihler YYYY-AA-GG biçiminde olmalıdır (ör. 2026-08-02).',
  'gecersiz-durum': 'Geçersiz durum değeri.',
  bulunamadi: 'Yazı bulunamadı.',
  kaydedilemedi: 'Kaydedilemedi; değişiklik geri alındı.',
  origin: 'Güvenlik doğrulaması başarısız. Sayfayı yenileyip tekrar deneyin.',
};

const alan =
  'mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.88rem] text-white outline-none transition-colors hover:border-white/20 focus:border-accent/60';
const etiket = 'block font-body text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/55';

export default async function IcerikDuzenle({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kayit?: string; hata?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const yazi = getIcerik(Number(id));
  if (!yazi) notFound();

  const sss = getSss(yazi.id);
  const surumler = listSurumler(yazi.id);

  let bloklar: ContentBlock[] = [];
  try { bloklar = JSON.parse(yazi.govde); } catch { bloklar = []; }

  return (
    <>
      <Link href="/admin/icerik" className="font-body text-[0.8rem] text-white/45 transition-colors hover:text-white">
        ← İçerik listesi
      </Link>

      <h1 className="mt-3 font-heading text-[1.4rem] font-semibold text-white">{yazi.baslik}</h1>
      <p className="mt-1 mb-8 font-body text-[0.8rem] text-white/35">
        /blog/{yazi.slug} · son güncelleme {yazi.updated_at} ·{' '}
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

      <form action={`/admin/icerik/${yazi.id}/kaydet`} method="post" className="space-y-8">
        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
          <h2 className="mb-5 font-heading text-[1.05rem] font-semibold text-white">Başlık ve arama görünümü</h2>

          <div className="space-y-5">
            <div>
              <label htmlFor="baslik" className={etiket}>Başlık (sayfadaki H1)</label>
              <input id="baslik" name="baslik" type="text" required defaultValue={yazi.baslik} className={alan} />
            </div>
            <div>
              <label htmlFor="meta_title" className={etiket}>Meta başlık</label>
              <p className="mt-1 font-body text-[0.76rem] text-white/35">
                Google sonuç başlığı. 50-60 karakter ideal; şu an {yazi.meta_title.length}.
              </p>
              <input id="meta_title" name="meta_title" type="text" defaultValue={yazi.meta_title} className={alan} />
            </div>
            <div>
              <label htmlFor="meta_description" className={etiket}>Meta açıklama</label>
              <p className="mt-1 font-body text-[0.76rem] text-white/35">
                120-160 karakter ideal; şu an {yazi.meta_description.length}.
              </p>
              <textarea id="meta_description" name="meta_description" rows={3} defaultValue={yazi.meta_description} className={alan} />
            </div>
            <div>
              <label htmlFor="ozet" className={etiket}>Özet (kart ve liste görünümü)</label>
              <textarea id="ozet" name="ozet" rows={3} defaultValue={yazi.ozet} className={alan} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
          <h2 className="font-heading text-[1.05rem] font-semibold text-white">Gövde</h2>
          <p className="mt-1.5 mb-4 font-body text-[0.78rem] leading-relaxed text-white/45">
            Boş satır paragrafları ayırır. Satır başında: <code className="text-white/70">##</code> başlık ·{' '}
            <code className="text-white/70">###</code> alt başlık · <code className="text-white/70">-</code> madde ·{' '}
            <code className="text-white/70">&gt;</code> alıntı. Satır içi biçimlendirme (kalın, link) YOKTUR —
            sitenin render katmanı desteklemiyor, yazılsaydı düz metin olarak çıkardı.
          </p>
          <textarea
            id="govde"
            name="govde"
            rows={26}
            defaultValue={bloklariMetne(bloklar)}
            className={`${alan} font-mono text-[0.82rem] leading-relaxed`}
          />
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
          <h2 className="font-heading text-[1.05rem] font-semibold text-white">Sık sorulan sorular</h2>
          <p className="mt-1.5 mb-5 font-body text-[0.78rem] leading-relaxed text-white/45">
            Google&apos;a FAQPage şeması olarak gönderilir ve zengin sonuç üretebilir.
            Soru veya cevabı boş bırakılan satır kaydedilmez — silmek için ikisini de boşaltın.
          </p>

          {/* Sabit sayıda alan: mevcut sorular + 2 boş. Dinamik ekleme JavaScript
              gerektirirdi; panel bilerek JS'siz çalışıyor (giriş akışıyla aynı gerekçe). */}
          <div className="space-y-5">
            {[...sss, { id: 0, soru: '', cevap: '' }, { id: -1, soru: '', cevap: '' }].map((f, i) => (
              <div key={`${f.id}-${i}`} className="rounded-xl border border-white/[0.06] p-4">
                <label htmlFor={`sss_soru_${i}`} className="block font-body text-[0.76rem] text-white/55">
                  {i + 1}. soru
                </label>
                <input id={`sss_soru_${i}`} name={`sss_soru_${i}`} type="text" defaultValue={f.soru} className={alan} />
                <label htmlFor={`sss_cevap_${i}`} className="mt-3 block font-body text-[0.76rem] text-white/55">
                  Cevap
                </label>
                <textarea id={`sss_cevap_${i}`} name={`sss_cevap_${i}`} rows={3} defaultValue={f.cevap} className={alan} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-sm:p-4">
          <h2 className="mb-5 font-heading text-[1.05rem] font-semibold text-white">Yayın bilgileri</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="kategori" className={etiket}>Kategori</label>
              <select id="kategori" name="kategori" defaultValue={yazi.kategori} className={alan}>
                {Object.keys(CATEGORY_META).map((k) => (
                  <option key={k} value={k} className="bg-[#15121d]">{k}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="durum" className={etiket}>Durum</label>
              <select id="durum" name="durum" defaultValue={yazi.durum} className={alan}>
                {ICERIK_DURUMLARI.map((d) => (
                  <option key={d} value={d} className="bg-[#15121d]">{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="yayin_tarihi" className={etiket}>Yayın tarihi</label>
              <input id="yayin_tarihi" name="yayin_tarihi" type="date" required defaultValue={yazi.yayin_tarihi} className={alan} />
            </div>
            <div>
              <label htmlFor="guncelleme_tarihi" className={etiket}>Güncelleme tarihi</label>
              <p className="mt-1 font-body text-[0.76rem] text-white/35">Boşsa yapısal veride yayınlanmaz.</p>
              <input id="guncelleme_tarihi" name="guncelleme_tarihi" type="date" defaultValue={yazi.guncelleme_tarihi} className={alan} />
            </div>
            <div>
              <label htmlFor="okuma_dakika" className={etiket}>Okuma süresi (dakika)</label>
              <input id="okuma_dakika" name="okuma_dakika" type="number" min={0} step={1} defaultValue={yazi.okuma_dakika} className={alan} />
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="ilgili_hizmet_etiket" className={etiket}>İlgili hizmet — bağlantı metni</label>
              <input id="ilgili_hizmet_etiket" name="ilgili_hizmet_etiket" type="text" defaultValue={yazi.ilgili_hizmet_etiket} className={alan} />
            </div>
            <div>
              <label htmlFor="ilgili_hizmet_href" className={etiket}>İlgili hizmet — adres</label>
              <p className="mt-1 font-body text-[0.76rem] text-white/35">Boşsa yazıda hizmet bağlantısı görünmez.</p>
              <input id="ilgili_hizmet_href" name="ilgili_hizmet_href" type="text" defaultValue={yazi.ilgili_hizmet_href} className={alan} />
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
            href={`/blog/${yazi.slug}`}
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
          <h2 className="font-heading text-[1.05rem] font-semibold text-white">Sürüm geçmişi</h2>
          <p className="mt-1.5 mb-4 font-body text-[0.78rem] leading-relaxed text-white/45">
            Her kaydetmede önceki hâl saklanır. İçerik koddan çıktığı için git geçmişinin
            yerini bu tutar. Kayıtlar silinemez.
          </p>
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
