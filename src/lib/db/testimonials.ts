/**
 * Müşteri referanslarının panel katmanı — yalnızca sunucu.
 *
 * Public okuma `content.ts`'te (`getReferanslar`). Burada yayın izni ve
 * doğrulama alanları da görünür.
 */
import { getDb } from './index';

export interface ReferansSatiri {
  id: number;
  marka: string;
  kisi: string;
  unvan: string;
  kategori: string;
  proje: string;
  metin: string;
  yayin_izni: number;
  izin_kaynagi: string;
  izin_tarihi: string;
  dogrulandi: number;
  durum: string;
  sira: number;
  updated_at: string;
}

export const REFERANS_DURUMLARI = ['taslak', 'yayinda', 'arsiv'] as const;

export function listReferanslar(): ReferansSatiri[] {
  return getDb()
    .prepare('SELECT * FROM testimonials ORDER BY sira, id')
    .all() as unknown as ReferansSatiri[];
}

export function getReferans(id: number): ReferansSatiri | undefined {
  return getDb().prepare('SELECT * FROM testimonials WHERE id = ?').get(id) as
    | unknown as ReferansSatiri | undefined;
}

export interface ReferansGuncelleme {
  marka: string;
  kisi: string;
  unvan: string;
  kategori: string;
  proje: string;
  metin: string;
  yayin_izni: boolean;
  izin_kaynagi: string;
  izin_tarihi: string;
  dogrulandi: boolean;
  durum: string;
}

/**
 * KURAL: yayın izni yoksa durum 'yayinda' YAPILAMAZ; izin varsa da kaynağı
 * yazılmadan yayınlanamaz.
 *
 * Bir müşteri yorumunu firma adıyla yayınlamak, o firmanın ticari ilişkiyi
 * kamuya açıklaması demektir. "İzin var mıydı" sorusunun cevabı kimsenin
 * hafızasında değil, kayıtta durmalı. Reddetme veri katmanındadır — panel formu
 * da uyarır ama tek koruma o olmamalı.
 */
export function guncelleReferans(
  id: number,
  g: ReferansGuncelleme
): { ok: boolean; hata?: string } {
  if (!REFERANS_DURUMLARI.includes(g.durum as (typeof REFERANS_DURUMLARI)[number])) {
    return { ok: false, hata: 'gecersiz-durum' };
  }
  if (!g.marka.trim()) return { ok: false, hata: 'marka-bos' };
  if (!g.metin.trim()) return { ok: false, hata: 'metin-bos' };

  if (g.durum === 'yayinda') {
    if (!g.yayin_izni) return { ok: false, hata: 'izin-yok' };
    if (!g.izin_kaynagi.trim()) return { ok: false, hata: 'izin-kaynagi-yok' };
  }

  const r = getDb()
    .prepare(
      `UPDATE testimonials
          SET marka = ?, kisi = ?, unvan = ?, kategori = ?, proje = ?, metin = ?,
              yayin_izni = ?, izin_kaynagi = ?, izin_tarihi = ?, dogrulandi = ?,
              durum = ?, updated_at = datetime('now')
        WHERE id = ?`
    )
    .run(
      g.marka, g.kisi, g.unvan, g.kategori, g.proje, g.metin,
      g.yayin_izni ? 1 : 0, g.izin_kaynagi, g.izin_tarihi, g.dogrulandi ? 1 : 0,
      g.durum, id
    );

  return Number(r.changes) > 0 ? { ok: true } : { ok: false, hata: 'bulunamadi' };
}

/**
 * Yeni referans ekler. HER ZAMAN izinsiz ve taslak olarak başlar.
 *
 * Bilinçli: ekleme formunda "yayınla" kutusu olsaydı, izin sorusu bir onay
 * kutusuna indirgenirdi. Yayına almak ayrı ve bilinçli bir ikinci adım olmalı.
 */
export function ekleReferans(marka: string, metin: string): { ok: boolean; id?: number; hata?: string } {
  if (!marka.trim()) return { ok: false, hata: 'marka-bos' };
  if (!metin.trim()) return { ok: false, hata: 'metin-bos' };
  try {
    const r = getDb()
      .prepare("INSERT INTO testimonials (marka, metin, durum, yayin_izni) VALUES (?, ?, 'taslak', 0)")
      .run(marka.trim(), metin.trim());
    return { ok: true, id: Number(r.lastInsertRowid) };
  } catch {
    // UNIQUE(marka) — aynı markadan ikinci kayıt, çoğu zaman kazara çift ekleme.
    return { ok: false, hata: 'marka-var' };
  }
}
