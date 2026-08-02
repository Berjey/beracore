/**
 * Şirket ayarlarının veritabanı katmanı — YALNIZCA SUNUCU.
 *
 * Bu modülü bir istemci bileşeninden import etmeyin: `node:sqlite` tarayıcı
 * paketine sızar. Sunucu bileşeni `getSirket()` çağırır, sonucu prop olarak geçirir.
 *
 * Saf katman ve varsayılanlar `src/lib/sirket.ts`'tedir.
 */
import { getDb } from './index';
import { SIRKET_VARSAYILAN, type SirketBilgisi } from '../sirket';

export interface AyarSatiri {
  anahtar: string;
  deger: string;
  tip: string;
  grup: string;
  etiket: string;
  aciklama: string;
  sira: number;
  updated_at: string;
}

/**
 * Kod varsayılanlarının üzerine veritabanındaki değerleri bindirir.
 *
 * GERİ DÜŞME DAVRANIŞI KRİTİK: veritabanı okunamazsa (dosya yok, migration
 * çalışmamış, kilit) hata FIRLATILMAZ — varsayılanlar döner. Aksi halde panelin
 * bir sorunu tüm public sayfaların derlenmesini veya render'ını engellerdi.
 * Sitenin yanlış telefon göstermesi kadar, hiç açılmaması da kabul edilemez.
 *
 * Boş dizeler varsayılanı EZMEZ: DB'de doldurulmamış bir alan (ör. ticari unvan)
 * kod varsayılanını silmemeli.
 */
export function getSirket(): SirketBilgisi {
  try {
    const satirlar = getDb()
      .prepare('SELECT anahtar, deger FROM company_settings')
      .all() as unknown as { anahtar: string; deger: string }[];

    const sirket: SirketBilgisi = { ...SIRKET_VARSAYILAN };

    for (const { anahtar, deger } of satirlar) {
      const v = (deger ?? '').trim();

      if (anahtar === 'sosyal') {
        // Liste tipi: her satır bir URL. Boş satırlar atılır.
        sirket.sosyal = v ? v.split('\n').map((s) => s.trim()).filter(Boolean) : [];
        continue;
      }

      if (!v) continue; // boş değer varsayılanı ezmez
      if (anahtar in sirket) {
        (sirket as unknown as Record<string, string>)[anahtar] = v;
      }
    }

    return sirket;
  } catch (err) {
    console.error('[sirket] ayarlar okunamadi, kod varsayilanlari kullaniliyor', err);
    return { ...SIRKET_VARSAYILAN };
  }
}

/** Panel için: gruplanmış, sıralı tam liste. */
export function listAyarlar(): AyarSatiri[] {
  return getDb()
    .prepare('SELECT * FROM company_settings ORDER BY sira, anahtar')
    .all() as unknown as AyarSatiri[];
}

/**
 * Tek ayar günceller. Bilinmeyen anahtar kabul edilmez — panelden gelen
 * form verisi allowlist'ten geçmeden yazılmamalı.
 */
export function setAyar(anahtar: string, deger: string): boolean {
  const r = getDb()
    .prepare("UPDATE company_settings SET deger = ?, updated_at = datetime('now') WHERE anahtar = ?")
    .run(deger, anahtar);
  return Number(r.changes) > 0;
}
