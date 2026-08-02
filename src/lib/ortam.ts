/**
 * Çalışma ortamı — üretim mi, staging (ön izleme) mi?
 *
 * NEDEN AYRI BİR MODÜL: staging ortamı üretimin birebir kopyasıdır; aynı içeriği,
 * aynı URL yapısını ve aynı HTML'i üretir. Tam da bu yüzden arama motoru için
 * **yinelenen içerik** riskidir: aynı metnin iki alan adında bulunması, hangisinin
 * asıl olduğunu belirsizleştirir ve üretim sayfalarının sıralamasını zayıflatabilir.
 *
 * Tek bir ortam değişkeni (`BERACORE_ORTAM=staging`) üç ayrı korumayı birden açar:
 *   1. `robots.txt` → `Disallow: /`
 *   2. Her yanıtta `X-Robots-Tag: noindex, nofollow` başlığı (next.config.ts)
 *   3. Panelde ve sayfada görünür ortam rozeti (yanlış ortamda çalışmayı önler)
 *
 * Üçü birden bilinçli: robots.txt taramayı engeller ama zaten bilinen bir URL'in
 * indekslenmesini kesin olarak durdurmaz; `X-Robots-Tag` bunu kapatır.
 */

/** `.env` dosyasında `BERACORE_ORTAM=staging` ise true. Varsayılan: üretim. */
export const STAGING = process.env.BERACORE_ORTAM === 'staging';

/** Public tarafta gösterilecek ortam etiketi; üretimde null. */
export const ORTAM_ETIKETI: string | null = STAGING ? 'ÖN İZLEME' : null;
