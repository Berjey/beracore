/**
 * İçeriğin okuma katmanı — YALNIZCA SUNUCU.
 *
 * Sayfalar bu modülden okur; `src/lib/blog-data.ts` artık TOHUM ve GERİ DÜŞME
 * kaynağıdır. Veritabanı okunamazsa veya tablo boşsa site koddaki içerikle
 * çalışmaya devam eder — içerik taşımasının sitenin ayakta kalmasını riske
 * atmaması için.
 *
 * `cache()` React'in istek başına önbelleği: tek bir render sırasında 50 yazı
 * defalarca sorgulanmasın. İstekler arasında paylaşılmaz, bu yüzden panelden
 * kaydetme + `revalidatePath` sonrası yeni içerik ANINDA görünür (modül düzeyi
 * bir `const` kullanılsaydı süreç yeniden başlayana kadar eski içerik kalırdı).
 */
import { cache } from 'react';
import { getDb } from './index';
import {
  blogPosts as blogPostsKod,
  CATEGORY_META,
  type BlogPost,
  type CategoryMeta,
  type ContentBlock,
} from '../blog-data';

interface SatirBlog {
  id: number;
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
}

/**
 * Gövde JSON'unu bloklara çevirir.
 *
 * Bozuk JSON tek bir yazıyı boşaltır ama SAYFAYI KIRMAZ: `notFound()` veya 500
 * yerine başlığı olan, gövdesi boş bir yazı görünür. Sessiz kalmamak için hata
 * loglanır — build çıktısında görülür.
 */
function blokla(ham: string, slug: string): ContentBlock[] {
  try {
    const v = JSON.parse(ham);
    return Array.isArray(v) ? (v as ContentBlock[]) : [];
  } catch (err) {
    console.error(`[icerik] govde cozulemedi: ${slug}`, err);
    return [];
  }
}

/**
 * SIRALAMA NOTU: eşitlik bozucu `sira` kolonudur, slug DEĞİL.
 * 13 yazı aynı yayın gününü paylaşıyor; slug'a göre sıralamak `/blog` listesinin
 * dizilimini ve öne çıkan yazısını değiştiriyordu (aktarımda ölçüldü, HTML farkı
 * bunu yakaladı). `sira` koddaki ekleme sırasını taşır → görünen sıra korunur.
 */
const oku = cache((): BlogPost[] => {
  try {
    const db = getDb();

    const satirlar = db
      .prepare(
        `SELECT id, slug, baslik, meta_title, meta_description, ozet, govde,
                kategori, yazar, okuma_dakika, ilgili_hizmet_etiket,
                ilgili_hizmet_href, yayin_tarihi, guncelleme_tarihi
           FROM content_pages
          WHERE tip = 'blog' AND dil = 'tr' AND durum = 'yayinda'
          ORDER BY yayin_tarihi DESC, sira`
      )
      .all() as unknown as SatirBlog[];

    // Tablo boşsa (migration çalıştı, aktarım henüz çalışmadı) koda düş.
    if (satirlar.length === 0) return blogPostsKod;

    const sss = db
      .prepare('SELECT content_id, soru, cevap FROM content_faq ORDER BY content_id, sira')
      .all() as unknown as { content_id: number; soru: string; cevap: string }[];

    const sssHarita = new Map<number, { question: string; answer: string }[]>();
    for (const f of sss) {
      const liste = sssHarita.get(f.content_id) ?? [];
      liste.push({ question: f.soru, answer: f.cevap });
      sssHarita.set(f.content_id, liste);
    }

    return satirlar.map((s) => ({
      slug: s.slug,
      title: s.baslik,
      metaTitle: s.meta_title,
      metaDescription: s.meta_description,
      excerpt: s.ozet,
      publishedAt: s.yayin_tarihi,
      // Boş dize `undefined` olmalı: `updatedAt` yoksa şemada `dateModified`
      // basılmaz. Boş dize geçerse geçersiz bir tarih yayınlanırdı.
      ...(s.guncelleme_tarihi ? { updatedAt: s.guncelleme_tarihi } : {}),
      author: s.yazar,
      category: s.kategori,
      readingMinutes: Number(s.okuma_dakika),
      ...(s.ilgili_hizmet_href
        ? { relatedService: { label: s.ilgili_hizmet_etiket, href: s.ilgili_hizmet_href } }
        : {}),
      content: blokla(s.govde, s.slug),
      ...(sssHarita.has(s.id) ? { faq: sssHarita.get(s.id) } : {}),
    }));
  } catch (err) {
    console.error('[icerik] veritabani okunamadi, koddaki icerik kullaniliyor', err);
    return blogPostsKod;
  }
});

/** Yayındaki tüm blog yazıları (veritabanı, yoksa kod). */
export function getBlogPosts(): BlogPost[] {
  return oku();
}

/** En yeni üstte. Sorgu zaten sıralı döner; kod geri düşmesi için burada da sıralanır. */
export function getSortedPosts(): BlogPost[] {
  return [...getBlogPosts()].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getBlogPosts().find((p) => p.slug === slug);
}

/** İçerikte GERÇEKTEN kullanılan kategoriler, `CATEGORY_META` sırasında. */
export function getUsedCategories(): CategoryMeta[] {
  const kullanilan = new Set(getBlogPosts().map((p) => p.category));
  return Object.values(CATEGORY_META).filter((c) => kullanilan.has(c.name));
}
