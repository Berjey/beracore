/**
 * SEO sabitleri — TEK KAYNAK.
 *
 * Öncesinde `https://beracore.com` 4 dosyada, OG görsel yolu + ölçüsü ise 8 dosyada
 * ayrı ayrı yazılıydı. Görsel değiştiğinde 8 yerin de güncellenmesi gerekiyordu;
 * bir tanesi atlanırsa sessizce yanlış ölçü yayınlanıyordu. Burada tutulur.
 */

export const SITE_URL = 'https://beracore.com';

/**
 * Sosyal paylaşım kartı — 1200×630 (1.91:1), opak zeminli.
 * `scripts/make-og-image.mjs` üretir; ölçü değişirse burası da değişmeli.
 */
export const OG_IMAGE = {
  url: '/og-cover.png',
  width: 1200,
  height: 630,
} as const;

/** Sayfaya özel alt metinle Open Graph `images` dizisi. */
export function ogImages(alt: string) {
  return [{ ...OG_IMAGE, alt }];
}

/** Twitter `images` yalnızca URL listesi bekler. */
export const twitterImages = [OG_IMAGE.url];

/** Schema.org alanları mutlak URL ister. */
export const OG_IMAGE_ABSOLUTE = `${SITE_URL}${OG_IMAGE.url}`;
