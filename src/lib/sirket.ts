/**
 * Şirket bilgisi — TEK KAYNAK (saf katman).
 *
 * NEDEN VAR (denetim bulgusu A-08): telefon 6 dosyada, e-posta 8+ dosyada, adres
 * 5 dosyada kopyalıydı. Numara değiştiğinde bir yerde eski kalması kaçınılmazdı ve
 * NAP tutarsızlığı (Name-Address-Phone) yerel SEO'yu doğrudan zayıflatır.
 *
 * BU DOSYA VERİTABANINA DOKUNMAZ — bilerek. İstemci bileşenleri de import edebilsin
 * diye saf tutuldu; `node:sqlite` buraya girerse tarayıcı paketine sızar.
 * Veritabanı katmanı `src/lib/db/settings.ts`'tedir ve YALNIZCA sunucu bileşenleri
 * tarafından çağrılır; sonuç prop olarak istemciye geçirilir.
 *
 * Buradaki değerler VARSAYILANDIR ve aynı zamanda **geri düşme (fallback)** hattıdır:
 * veritabanı okunamazsa site yine doğru bilgiyle render edilir. Sitenin, panelin bir
 * sorunu yüzünden yanlış telefon numarası göstermesi kabul edilemez.
 */

export interface SirketBilgisi {
  ad: string;
  /** Resmî ticari unvan. Boşsa yasal metinlerde `ad` kullanılır. */
  unvan: string;
  slogan: string;
  email: string;
  /** E.164 biçimi, `+` ile — `tel:` ve `wa.me` bağlantılarının kaynağı. */
  telefonE164: string;
  /** İnsana gösterilen biçim. */
  telefonGorunen: string;
  whatsappMesaji: string;
  sehir: string;
  ulke: string;
  ulkeKodu: string;
  /** Açık adres. Boşsa yapısal veride sokak satırı üretilmez. */
  adres: string;
  vergiDairesi: string;
  vergiNo: string;
  mersis: string;
  calismaSaatleri: string;
  kvkkEposta: string;
  /** Sosyal profiller — JSON-LD `sameAs` buradan beslenir. Boş dizi = alan üretilmez. */
  sosyal: string[];
}

/**
 * Mevcut koddaki değerlerin birebir aynısı. Bu dosya eklenirken sitede
 * görünen hiçbir metin değişmemelidir — değişim, taşımanın değil içeriğin işidir.
 */
export const SIRKET_VARSAYILAN: SirketBilgisi = {
  ad: 'BERACORE',
  unvan: '',
  slogan: 'Markanız için unutulmaz dijital deneyimler.',
  email: 'info@beracore.com',
  telefonE164: '+905539862306',
  telefonGorunen: '0553 986 23 06',
  whatsappMesaji: 'Merhaba, BERACORE ile bir projem hakkında görüşmek istiyorum.',
  sehir: 'İstanbul',
  ulke: 'Türkiye',
  ulkeKodu: 'TR',
  adres: '',
  vergiDairesi: '',
  vergiNo: '',
  mersis: '',
  calismaSaatleri: 'Hafta içi 09:00 — 17:00',
  kvkkEposta: 'info@beracore.com',
  sosyal: [],
};

// ───────────────────────── türetilmiş değerler ─────────────────────────
// Bağlantı biçimleri tek yerde üretilir; `tel:` ile görünen numaranın ayrışması
// (biri güncellenip diğerinin unutulması) böylece imkânsız hale gelir.

export const telHref = (s: SirketBilgisi) => `tel:${s.telefonE164}`;
export const mailtoHref = (s: SirketBilgisi) => `mailto:${s.email}`;

/** `wa.me` numarayı `+` ve boşluk olmadan ister. */
export const whatsappHref = (s: SirketBilgisi) =>
  `https://wa.me/${s.telefonE164.replace(/\D/g, '')}?text=${encodeURIComponent(s.whatsappMesaji)}`;

/** "İstanbul, Türkiye" */
export const konumMetni = (s: SirketBilgisi) => `${s.sehir}, ${s.ulke}`;

/** schema.org PostalAddress. Açık adres girilmemişse `streetAddress` üretilmez. */
export function postalAddress(s: SirketBilgisi) {
  return {
    '@type': 'PostalAddress' as const,
    ...(s.adres ? { streetAddress: s.adres } : {}),
    addressLocality: s.sehir,
    addressRegion: s.sehir,
    addressCountry: s.ulkeKodu,
  };
}
