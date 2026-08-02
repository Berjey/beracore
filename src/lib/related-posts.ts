import { blogPosts, toSummary, type BlogPost, type BlogPostSummary } from '@/lib/blog-data';

/**
 * "İlgili Yazılar" seçimi — alaka + iç link EŞİTLİĞİ + tazelik.
 *
 * ÖNCEKİ DAVRANIŞ VE SORUNU:
 *   const sameCat = blogPosts.filter(p => p.category === post.category)
 *   relatedPosts  = [...sameCat, ...others].slice(0, 3)
 * `blogPosts` ekleme sırasındadır (en eski başta). Dolayısıyla her yazı, kendi
 * kategorisinin DAİMA aynı ilk üç (en eski) yazısına link veriyordu. Sonuç:
 * en yeni yazılar `/blog` listesi dışında hiçbir yerden iç link almıyor,
 * eski yazılar ise gereğinden fazla link topluyordu. İç link derinliği
 * Googlebot'un tarama önceliğini doğrudan etkilediği için bu bir SEO kusuru.
 *
 * ÇÖZÜM: Tüm blog grafiği bir kez, deterministik biçimde hesaplanır. Her yazı
 * için adaylar şu sırayla değerlendirilir:
 *   1. ALAKA puanı (yüksek → düşük): aynı kategori, aynı hizmet sayfası,
 *      aynı hizmet alanı.
 *   2. ALDIĞI LİNK sayısı (az → çok): eşit alakalı adaylar arasında henüz az
 *      link almış olan seçilir. Linkleri grafiğe eşit dağıtan kısım budur.
 *   3. TAZELİK (yeni → eski).
 *   4. Slug (alfabetik) — tam determinizm için son kırıcı.
 *
 * Rastgelelik YOKTUR: site SSG olduğu için aynı girdi her build'de aynı çıktıyı
 * vermek zorundadır (aksi halde her deploy'da tüm blog HTML'i değişirdi).
 */

const RELATED_COUNT = 3;

// Puanlar — alaka her zaman eşitlik/tazelikten baskındır.
const SCORE_SAME_CATEGORY = 100;
const SCORE_SAME_SERVICE = 40;
const SCORE_SAME_SERVICE_AREA = 20;

/** `/hizmetler/ai/ai-chatbot-asistan` → `ai` (hizmet kategorisi anahtarı). */
function serviceArea(post: BlogPost): string | undefined {
  const href = post.relatedService?.href;
  if (!href) return undefined;
  const parts = href.split('/').filter(Boolean); // ['hizmetler','ai','ai-chatbot-asistan']
  return parts[0] === 'hizmetler' ? parts[1] : undefined;
}

function relevance(from: BlogPost, to: BlogPost): number {
  let score = 0;
  if (from.category === to.category) score += SCORE_SAME_CATEGORY;
  if (from.relatedService?.href && from.relatedService.href === to.relatedService?.href) {
    score += SCORE_SAME_SERVICE;
  } else {
    const a = serviceArea(from);
    if (a && a === serviceArea(to)) score += SCORE_SAME_SERVICE_AREA;
  }
  return score;
}

/**
 * Grafik, verilen yazı DİZİSİ başına bir kez hesaplanır.
 *
 * NEDEN DİZİ REFERANSINA GÖRE: Faz 1.3'te içerik veritabanına taşındı ve yazı
 * listesi artık modül sabiti değil, her render'da okunan bir değer. Tek bir
 * modül düzeyi önbellek, panelden yapılan düzenlemeden sonra ESKİ grafiği
 * döndürürdü. `WeakMap` ile önbellek listenin kendisine bağlanır: liste
 * yenilenince grafik de yenilenir, aynı render içinde ise tekrar hesaplanmaz.
 */
const cache = new WeakMap<BlogPost[], Map<string, BlogPostSummary[]>>();

function build(posts: BlogPost[]): Map<string, BlogPostSummary[]> {
  // En yeni üstte — atama sırası da buradan gelir (deterministik).
  const ordered = [...posts].sort((a, b) =>
    a.publishedAt === b.publishedAt
      ? a.slug.localeCompare(b.slug)
      : a.publishedAt < b.publishedAt
        ? 1
        : -1,
  );

  const inbound = new Map<string, number>(ordered.map((p) => [p.slug, 0]));
  const result = new Map<string, BlogPostSummary[]>();

  for (const post of ordered) {
    const picked = ordered
      .filter((c) => c.slug !== post.slug)
      .map((c) => ({ post: c, score: relevance(post, c) }))
      .sort((x, y) => {
        if (x.score !== y.score) return y.score - x.score;
        const ix = inbound.get(x.post.slug) ?? 0;
        const iy = inbound.get(y.post.slug) ?? 0;
        if (ix !== iy) return ix - iy;
        if (x.post.publishedAt !== y.post.publishedAt) {
          return x.post.publishedAt < y.post.publishedAt ? 1 : -1;
        }
        return x.post.slug.localeCompare(y.post.slug);
      })
      .slice(0, RELATED_COUNT);

    for (const c of picked) inbound.set(c.post.slug, (inbound.get(c.post.slug) ?? 0) + 1);
    result.set(
      post.slug,
      picked.map((c) => toSummary(c.post)),
    );
  }

  return result;
}

/**
 * `posts` verilmezse KODDAKİ liste kullanılır. Sayfalar veritabanından okuyup
 * listeyi geçirir; testler ve araçlar varsayılanla çalışmaya devam eder.
 */
export function getRelatedPosts(slug: string, posts: BlogPost[] = blogPosts): BlogPostSummary[] {
  let graf = cache.get(posts);
  if (!graf) { graf = build(posts); cache.set(posts, graf); }
  return graf.get(slug) ?? [];
}

/**
 * İç link dağılımı — her yazının kaç "ilgili yazı" linki aldığı.
 * Denetim/test amaçlıdır: yetim (0 link alan) yazı kalmadığını doğrular.
 */
export function getInboundLinkCounts(posts: BlogPost[] = blogPosts): Map<string, number> {
  let graf = cache.get(posts);
  if (!graf) { graf = build(posts); cache.set(posts, graf); }
  const counts = new Map<string, number>(posts.map((p) => [p.slug, 0]));
  for (const related of graf.values()) {
    for (const r of related) counts.set(r.slug, (counts.get(r.slug) ?? 0) + 1);
  }
  return counts;
}
