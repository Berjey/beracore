/**
 * Şirket metriklerinin SAF katmanı — istemci bileşenleri bu dosyayı import edebilir.
 *
 * Veritabanına DOKUNMAZ. `node:sqlite` içeren `src/lib/db/metrics.ts` bir istemci
 * bileşeninden import edilirse tarayıcı paketi kırılır (aynı hata Faz 1.1'de
 * `getSirket` ile yaşandı). Sunucu okur, `MetrikProvider` ile aşağı verir.
 */

/** Public sitede gösterilebilen metrik. Kanıt alanları burada YOKTUR: */
/*  panele aittir, ziyaretçiye değil.                                    */
export interface Metrik {
  anahtar: string;
  baslik: string;
  altBaslik: string;
  deger: number;
  onEk: string;
  sonEk: string;
  ikon: string;
}

/**
 * Public sitede görünecek metriklerin varsayılanı BOŞ dizidir.
 *
 * Bilerek: veritabanı okunamazsa metrik bölümü kaybolur, ama kanıtlanmamış bir
 * sayı ASLA kod varsayılanı olarak geri sızmaz. Şirket ayarlarında (telefon,
 * e-posta) tercih bunun tersiydi — orada yanlış bilgi göstermemek için varsayılana
 * düşmek doğruydu. Burada doğru davranış susmaktır.
 */
export const METRIK_VARSAYILAN: Metrik[] = [];

/** Sayacın gösterilecek metni: "%97", "25+", "2024". */
export function metrikMetni(m: Metrik, deger: number = m.deger): string {
  return `${m.onEk}${deger}${m.sonEk}`;
}
