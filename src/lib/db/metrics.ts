/**
 * Şirket metriklerinin veritabanı katmanı — YALNIZCA SUNUCU.
 *
 * `src/lib/metrikler.ts` saf katmandır ve istemciden import edilebilir; burası
 * `node:sqlite` kullandığı için edilemez.
 */
import { getDb } from './index';
import { METRIK_VARSAYILAN, type Metrik } from '../metrikler';

export type MetrikDurum = 'taslak' | 'dogrulandi' | 'yayinda' | 'arsiv';

export const METRIK_DURUMLARI: MetrikDurum[] = ['taslak', 'dogrulandi', 'yayinda', 'arsiv'];

/** Panelin gördüğü tam kayıt — kanıt alanları dahil. */
export interface MetrikSatiri {
  id: number;
  anahtar: string;
  baslik: string;
  alt_baslik: string;
  deger: number;
  on_ek: string;
  son_ek: string;
  ikon: string;
  olcum_yontemi: string;
  veri_kaynagi: string;
  kanit_url: string;
  son_dogrulama: string;
  durum: string;
  ana_sayfa: number;
  hakkimizda: number;
  sira: number;
  created_at: string;
  updated_at: string;
}

export type MetrikYuzey = 'ana_sayfa' | 'hakkimizda';

/**
 * Public sitede gösterilecek metrikler.
 *
 * `durum = 'yayinda'` filtresi SORGUDA durur, bileşende değil: kanıtsız bir
 * metriğin yayına sızması için birinin bu satırı değiştirmesi gerekir; bir JSX
 * dalını unutması yetmez.
 *
 * Hata durumunda BOŞ döner (bkz. METRIK_VARSAYILAN gerekçesi) — veritabanı
 * sorunu asla kanıtsız sayı yayınlamaya dönüşmemeli.
 */
export function getMetrikler(yuzey: MetrikYuzey): Metrik[] {
  try {
    // `yuzey` kolon adı olarak kullanılıyor → tip birliği dışında bir değer
    // gelemeyecek olsa da allowlist ile kilitlenir (SQL'e kolon adı bağlanamaz).
    const kolon = yuzey === 'ana_sayfa' ? 'ana_sayfa' : 'hakkimizda';

    const satirlar = getDb()
      .prepare(
        `SELECT anahtar, baslik, alt_baslik, deger, on_ek, son_ek, ikon
           FROM company_metrics
          WHERE durum = 'yayinda' AND ${kolon} = 1
          ORDER BY sira, id`
      )
      .all() as unknown as {
      anahtar: string; baslik: string; alt_baslik: string;
      deger: number; on_ek: string; son_ek: string; ikon: string;
    }[];

    return satirlar.map((s) => ({
      anahtar: s.anahtar,
      baslik: s.baslik,
      altBaslik: s.alt_baslik,
      deger: Number(s.deger),
      onEk: s.on_ek,
      sonEk: s.son_ek,
      ikon: s.ikon,
    }));
  } catch (err) {
    console.error('[metrik] okunamadi, metrik bolumu gizleniyor', err);
    return [...METRIK_VARSAYILAN];
  }
}

/** Panel için: her durumdaki tüm metrikler, kanıt alanlarıyla. */
export function listMetrikler(): MetrikSatiri[] {
  return getDb()
    .prepare('SELECT * FROM company_metrics ORDER BY sira, id')
    .all() as unknown as MetrikSatiri[];
}

export interface MetrikGuncelleme {
  deger: number;
  olcum_yontemi: string;
  veri_kaynagi: string;
  kanit_url: string;
  son_dogrulama: string;
  durum: string;
  ana_sayfa: boolean;
  hakkimizda: boolean;
}

/**
 * Metriğin değerini ve kanıt zincirini günceller.
 *
 * KURAL: `veri_kaynagi` boşken durum 'yayinda' YAPILAMAZ. Reddetme veri
 * katmanındadır; panel formu da uyarır ama tek koruma o olmamalı — sayının
 * nereden geldiği yazılı olmadan yayınlanması engellenmeli.
 *
 * Başlık/alt başlık/ikon buradan DEĞİŞTİRİLEMEZ: metrik tanımı (neyi ölçtüğü)
 * migration'a aittir. Panelden serbestçe yeniden adlandırılabilseydi, "Tamamlanan
 * Proje" kaydı bir gün "Mutlu Müşteri" olur ve kanıt zinciri sessizce kopardı.
 */
export function guncelleMetrik(anahtar: string, g: MetrikGuncelleme): { ok: boolean; hata?: string } {
  if (!METRIK_DURUMLARI.includes(g.durum as MetrikDurum)) {
    return { ok: false, hata: 'gecersiz-durum' };
  }
  if (g.durum === 'yayinda' && !g.veri_kaynagi.trim()) {
    return { ok: false, hata: 'kanitsiz-yayin' };
  }
  if (!Number.isFinite(g.deger) || g.deger < 0) {
    return { ok: false, hata: 'gecersiz-deger' };
  }

  const r = getDb()
    .prepare(
      `UPDATE company_metrics
          SET deger = ?, olcum_yontemi = ?, veri_kaynagi = ?, kanit_url = ?,
              son_dogrulama = ?, durum = ?, ana_sayfa = ?, hakkimizda = ?,
              updated_at = datetime('now')
        WHERE anahtar = ?`
    )
    .run(
      Math.trunc(g.deger),
      g.olcum_yontemi,
      g.veri_kaynagi,
      g.kanit_url,
      g.son_dogrulama,
      g.durum,
      g.ana_sayfa ? 1 : 0,
      g.hakkimizda ? 1 : 0,
      anahtar
    );

  return Number(r.changes) > 0 ? { ok: true } : { ok: false, hata: 'bulunamadi' };
}
