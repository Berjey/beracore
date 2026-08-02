/**
 * İçeriğin YAZMA katmanı (panel) — yalnızca sunucu.
 *
 * Okuma katmanından (`content.ts`) ayrı tutuluyor: okuma public sayfaların
 * sıcak yolu ve geri düşme davranışına sahip; yazma yalnızca panelden çağrılıyor
 * ve hata durumunda SESSİZCE BAŞARILI GÖRÜNMEMELİ — burada geri düşme yok, hata
 * yukarı çıkar.
 */
import { getDb } from './index';
import type { ContentBlock } from '../blog-data';

export interface IcerikSatiri {
  id: number;
  tip: string;
  slug: string;
  baslik: string;
  meta_title: string;
  meta_description: string;
  ozet: string;
  govde: string;
  kategori: string;
  yazar: string;
  okuma_dakika: number;
  ilgili_hizmet_etiket: string;
  ilgili_hizmet_href: string;
  yayin_tarihi: string;
  guncelleme_tarihi: string;
  durum: string;
  sira: number;
  updated_at: string;
}

export interface IcerikOzet {
  id: number;
  slug: string;
  baslik: string;
  kategori: string;
  durum: string;
  yayin_tarihi: string;
  guncelleme_tarihi: string;
  sss_sayisi: number;
  surum_sayisi: number;
}

export const ICERIK_DURUMLARI = ['taslak', 'yayinda', 'arsiv'] as const;

/** Panel listesi — gövde OKUNMAZ (50 yazının tam metnini listelemek gereksiz). */
export function listIcerik(tip = 'blog'): IcerikOzet[] {
  return getDb()
    .prepare(
      `SELECT p.id, p.slug, p.baslik, p.kategori, p.durum, p.yayin_tarihi, p.guncelleme_tarihi,
              (SELECT COUNT(*) FROM content_faq   f WHERE f.content_id = p.id) AS sss_sayisi,
              (SELECT COUNT(*) FROM content_versions v WHERE v.content_id = p.id) AS surum_sayisi
         FROM content_pages p
        WHERE p.tip = ? AND p.dil = 'tr'
        ORDER BY p.yayin_tarihi DESC, p.sira`
    )
    .all(tip) as unknown as IcerikOzet[];
}

export function getIcerik(id: number): IcerikSatiri | undefined {
  return getDb().prepare('SELECT * FROM content_pages WHERE id = ?').get(id) as
    | unknown as IcerikSatiri | undefined;
}

export function getSss(contentId: number): { id: number; soru: string; cevap: string }[] {
  return getDb()
    .prepare('SELECT id, soru, cevap FROM content_faq WHERE content_id = ? ORDER BY sira')
    .all(contentId) as unknown as { id: number; soru: string; cevap: string }[];
}

export interface SurumOzet {
  id: number;
  surum: number;
  actor: string;
  created_at: string;
}

export function listSurumler(contentId: number): SurumOzet[] {
  return getDb()
    .prepare('SELECT id, surum, actor, created_at FROM content_versions WHERE content_id = ? ORDER BY surum DESC')
    .all(contentId) as unknown as SurumOzet[];
}

export interface IcerikGuncelleme {
  baslik: string;
  meta_title: string;
  meta_description: string;
  ozet: string;
  govde: ContentBlock[];
  kategori: string;
  okuma_dakika: number;
  ilgili_hizmet_etiket: string;
  ilgili_hizmet_href: string;
  yayin_tarihi: string;
  guncelleme_tarihi: string;
  durum: string;
  sss: { soru: string; cevap: string }[];
}

/**
 * Kaydeder. ÖNCE mevcut hâli `content_versions`'a yazar.
 *
 * Sıra önemli: sürüm kaydı güncellemeden ÖNCE alınır, yoksa "önceki hâl" diye
 * saklanan şey yeni hâlin kopyası olurdu. Tamamı tek transaction — yarım kalan
 * bir kaydetme, sürümü olmayan bir değişiklik bırakmamalı.
 *
 * SSS satırları silinip yeniden yazılır: panelde soru eklemek/çıkarmak/sırasını
 * değiştirmek serbest, kimlik takibi yapmanın karşılığı yok.
 */
export function guncelleIcerik(
  id: number,
  g: IcerikGuncelleme,
  actor: string
): { ok: boolean; hata?: string } {
  if (!ICERIK_DURUMLARI.includes(g.durum as (typeof ICERIK_DURUMLARI)[number])) {
    return { ok: false, hata: 'gecersiz-durum' };
  }
  if (!g.baslik.trim()) return { ok: false, hata: 'baslik-bos' };
  // Tarih biçimi sitemap `lastmod` ve JSON-LD'ye doğrudan gider; serbest metin
  // geçerse arama motoruna geçersiz tarih yayınlanır.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(g.yayin_tarihi)) return { ok: false, hata: 'gecersiz-tarih' };
  if (g.guncelleme_tarihi && !/^\d{4}-\d{2}-\d{2}$/.test(g.guncelleme_tarihi)) {
    return { ok: false, hata: 'gecersiz-tarih' };
  }

  const db = getDb();
  const mevcut = getIcerik(id);
  if (!mevcut) return { ok: false, hata: 'bulunamadi' };

  const oncekiSss = getSss(id);
  const sonSurum = db
    .prepare('SELECT COALESCE(MAX(surum), 0) AS s FROM content_versions WHERE content_id = ?')
    .get(id) as { s: number };

  db.exec('BEGIN');
  try {
    db.prepare('INSERT INTO content_versions (content_id, surum, anlik, actor) VALUES (?, ?, ?, ?)')
      .run(id, Number(sonSurum.s) + 1, JSON.stringify({ ...mevcut, sss: oncekiSss }), actor);

    db.prepare(
      `UPDATE content_pages
          SET baslik = ?, meta_title = ?, meta_description = ?, ozet = ?, govde = ?,
              kategori = ?, okuma_dakika = ?, ilgili_hizmet_etiket = ?, ilgili_hizmet_href = ?,
              yayin_tarihi = ?, guncelleme_tarihi = ?, durum = ?, updated_at = datetime('now')
        WHERE id = ?`
    ).run(
      g.baslik, g.meta_title, g.meta_description, g.ozet, JSON.stringify(g.govde),
      g.kategori, Math.max(0, Math.trunc(g.okuma_dakika)),
      g.ilgili_hizmet_etiket, g.ilgili_hizmet_href,
      g.yayin_tarihi, g.guncelleme_tarihi, g.durum, id
    );

    db.prepare('DELETE FROM content_faq WHERE content_id = ?').run(id);
    const ekle = db.prepare('INSERT INTO content_faq (content_id, soru, cevap, sira) VALUES (?, ?, ?, ?)');
    g.sss.forEach((f, i) => {
      if (f.soru.trim() && f.cevap.trim()) ekle.run(id, f.soru, f.cevap, i);
    });

    db.exec('COMMIT');
    return { ok: true };
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('[icerik] kaydetme basarisiz', err);
    return { ok: false, hata: 'kaydedilemedi' };
  }
}
