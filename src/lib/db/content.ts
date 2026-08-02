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
import { cityPages as cityPagesKod, type CityPage } from '../city-pages-data';
import { services as servicesKod, toNav, type Service, type ServiceNav } from '../services-data';
import { legalDocs as legalDocsKod, type LegalDoc, type LegalSection } from '../legal-data';
import { referanslar as referanslarKod, type Referans } from '../referans-data';

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

// ─────────────────────────── şehir sayfaları ───────────────────────────

interface SatirSehir {
  id: number;
  slug: string;
  baslik: string;
  meta_title: string;
  meta_description: string;
  govde: string;
  guncelleme_tarihi: string;
}

/** `govde` JSON'undaki şehir yükü — blog kolonlarına oturmayan alanlar. */
interface SehirYuku {
  citySlug: string;
  city: string;
  keyword: string;
  intro: string;
  sections: { h2: string; body: string }[];
  bullets: { title: string; items: string[] };
  serviceHref: string;
  serviceLabel: string;
  blogHref: string;
  blogLabel: string;
}

const okuSehir = cache((): CityPage[] => {
  try {
    const db = getDb();
    const satirlar = db
      .prepare(
        `SELECT id, slug, baslik, meta_title, meta_description, govde, guncelleme_tarihi
           FROM content_pages
          WHERE tip = 'sehir' AND dil = 'tr' AND durum = 'yayinda'
          ORDER BY sira`
      )
      .all() as unknown as SatirSehir[];

    if (satirlar.length === 0) return cityPagesKod;

    const sss = db
      .prepare('SELECT content_id, soru, cevap FROM content_faq ORDER BY content_id, sira')
      .all() as unknown as { content_id: number; soru: string; cevap: string }[];

    const sssHarita = new Map<number, { question: string; answer: string }[]>();
    for (const f of sss) {
      const liste = sssHarita.get(f.content_id) ?? [];
      liste.push({ question: f.soru, answer: f.cevap });
      sssHarita.set(f.content_id, liste);
    }

    return satirlar.map((s) => {
      const y = JSON.parse(s.govde) as SehirYuku;
      return {
        // `slug` kolonunda `sehir/hizmet` duruyor; rota iki parçayı ayrı bekliyor.
        citySlug: y.citySlug,
        slug: s.slug.slice(y.citySlug.length + 1),
        city: y.city,
        title: s.baslik,
        metaTitle: s.meta_title,
        metaDescription: s.meta_description,
        keyword: y.keyword,
        intro: y.intro,
        sections: y.sections,
        bullets: y.bullets,
        serviceHref: y.serviceHref,
        serviceLabel: y.serviceLabel,
        blogHref: y.blogHref,
        blogLabel: y.blogLabel,
        faq: sssHarita.get(s.id) ?? [],
      };
    });
  } catch (err) {
    console.error('[icerik] sehir sayfalari okunamadi, koddaki icerik kullaniliyor', err);
    return cityPagesKod;
  }
});

export function getCityPages(): CityPage[] {
  return okuSehir();
}

export function getCityPage(citySlug: string, slug: string): CityPage | undefined {
  return getCityPages().find((p) => p.citySlug === citySlug && p.slug === slug);
}

/**
 * Sitemap `lastmod` için sayfa başına güncelleme tarihi.
 *
 * Önceden 24 sayfanın hepsi elle yönetilen tek bir sabiti (`CITY_CONTENT_UPDATED`)
 * paylaşıyordu; bir şehri düzenleyince diğer 23'ü de "güncellendi" görünüyordu.
 * İçerik panele taşındığı için artık her sayfa kendi tarihini taşır.
 * Veritabanı okunamazsa koddaki sabite düşülür (kod yolunda tarih zaten tekti).
 */
export function getCityLastMod(citySlug: string, slug: string): string | undefined {
  try {
    const satir = getDb()
      .prepare("SELECT guncelleme_tarihi FROM content_pages WHERE tip='sehir' AND slug=? AND dil='tr'")
      .get(`${citySlug}/${slug}`) as unknown as { guncelleme_tarihi: string } | undefined;
    return satir?.guncelleme_tarihi || undefined;
  } catch {
    return undefined;
  }
}

// ─────────────────────────── hizmet sayfaları ───────────────────────────

interface KategoriYuku {
  subtitle: string;
  color: string;
  glowColor: string;
  shape: Service['shape'];
  overview: { h2: string; body: string }[];
}

interface AltYuku {
  image: string;
  icon: string;
  longDescription: string;
  features: string[];
  process: string[];
  benefits: string[];
  stats: { value: string; label: string }[];
}

interface SatirHizmet {
  id: number;
  tip: string;
  slug: string;
  baslik: string;
  meta_title: string;
  meta_description: string;
  ozet: string;
  govde: string;
  kategori: string;
  sira: number;
}

/**
 * Hizmet ağacını veritabanından kurar.
 *
 * Kategori (`tip='hizmet'`) ve alt hizmet (`tip='hizmet-alt'`) ayrı satırlarda
 * durur; burada `Service.subServices` altında yeniden birleştirilir. Kategori
 * sırası ve alt hizmet sırası `sira` kolonundan gelir — koddaki dizilim
 * korunsun diye (blogda eşit tarihlerde sırayı kaybetme hatası yaşandı).
 */
const okuHizmet = cache((): Service[] => {
  try {
    const db = getDb();
    const satirlar = db
      .prepare(
        `SELECT id, tip, slug, baslik, meta_title, meta_description, ozet, govde, kategori, sira
           FROM content_pages
          WHERE tip IN ('hizmet', 'hizmet-alt') AND dil = 'tr' AND durum = 'yayinda'
          ORDER BY sira`
      )
      .all() as unknown as SatirHizmet[];

    const kategoriler = satirlar.filter((s) => s.tip === 'hizmet');
    if (kategoriler.length === 0) return servicesKod;

    const sss = db
      .prepare('SELECT content_id, soru, cevap FROM content_faq ORDER BY content_id, sira')
      .all() as unknown as { content_id: number; soru: string; cevap: string }[];

    const sssHarita = new Map<number, { question: string; answer: string }[]>();
    for (const f of sss) {
      const liste = sssHarita.get(f.content_id) ?? [];
      liste.push({ question: f.soru, answer: f.cevap });
      sssHarita.set(f.content_id, liste);
    }

    return kategoriler.map((k) => {
      const ky = JSON.parse(k.govde) as KategoriYuku;
      const altlar = satirlar
        .filter((s) => s.tip === 'hizmet-alt' && s.kategori === k.slug)
        .sort((a, b) => a.sira - b.sira);

      return {
        key: k.slug,
        title: k.baslik,
        subtitle: ky.subtitle,
        color: ky.color,
        glowColor: ky.glowColor,
        shape: ky.shape,
        description: k.ozet,
        overview: ky.overview,
        faq: sssHarita.get(k.id) ?? [],
        subServices: altlar.map((a) => {
          const ay = JSON.parse(a.govde) as AltYuku;
          return {
            title: a.baslik,
            // `slug` kolonunda `kategori/alt` birleşik duruyor.
            slug: a.slug.slice(k.slug.length + 1),
            image: ay.image,
            icon: ay.icon,
            description: a.ozet,
            longDescription: ay.longDescription,
            features: ay.features,
            process: ay.process,
            benefits: ay.benefits,
            stats: ay.stats,
            faq: sssHarita.get(a.id) ?? [],
            metaTitle: a.meta_title,
            metaDescription: a.meta_description,
          };
        }),
      };
    });
  } catch (err) {
    console.error('[icerik] hizmetler okunamadi, koddaki icerik kullaniliyor', err);
    return servicesKod;
  }
});

export function getServices(): Service[] {
  return okuHizmet();
}

export function getService(key: string): Service | undefined {
  return getServices().find((s) => s.key === key);
}

/**
 * İstemci bileşenlerine verilecek HAFİF liste.
 *
 * Kök düzen bunu bağlamla aşağı verir. Tam `Service` nesnesi verilseydi 23 alt
 * hizmetin tüm uzun metni her sayfanın RSC yüküne girerdi.
 */
export function getServicesNav(): ServiceNav[] {
  return getServices().map(toNav);
}

// ─────────────────────────── hukuki metinler ───────────────────────────

interface YasalYuku {
  accent: string;
  sections: LegalSection[];
  lastUpdated: string;
}

const okuYasal = cache((): LegalDoc[] => {
  try {
    const satirlar = getDb()
      .prepare(
        `SELECT slug, baslik, meta_title, meta_description, ozet, govde, guncelleme_tarihi
           FROM content_pages
          WHERE tip = 'yasal' AND dil = 'tr' AND durum = 'yayinda'
          ORDER BY sira`
      )
      .all() as unknown as {
      slug: string; baslik: string; meta_title: string; meta_description: string;
      ozet: string; govde: string; guncelleme_tarihi: string;
    }[];

    if (satirlar.length === 0) return legalDocsKod;

    return satirlar.map((s) => {
      const y = JSON.parse(s.govde) as YasalYuku;
      return {
        slug: s.slug,
        title: s.baslik,
        accent: y.accent,
        metaTitle: s.meta_title,
        metaDescription: s.meta_description,
        intro: s.ozet,
        lastUpdated: y.lastUpdated,
        yururluk: s.guncelleme_tarihi,
        sections: y.sections,
      };
    });
  } catch (err) {
    console.error('[icerik] hukuki metinler okunamadi, koddaki icerik kullaniliyor', err);
    return legalDocsKod;
  }
});

export function getLegalDocs(): LegalDoc[] {
  return okuYasal();
}

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return getLegalDocs().find((d) => d.slug === slug);
}

export interface Revizyon {
  surum: number;
  yururluk: string;
  degisiklik_notu: string;
  onaylayan: string;
  created_at: string;
}

/**
 * Bir hukuki metnin PUBLIC revizyon geçmişi.
 *
 * Sayfanın altında listelenir. Amaç şeffaflık değil sadece; bir uyuşmazlıkta
 * "o tarihte hangi metin geçerliydi" sorusunun cevabı burada durur (A-11).
 *
 * Tam metin anlık görüntüsü (`anlik`) BİLEREK dışarı verilmez: eski sürümlerin
 * tam metnini yayınlamak ayrı bir karar ve ayrı bir URL şeması gerektirir;
 * burada yalnızca "ne zaman, kim, ne değişti" listelenir.
 */
export function getRevizyonlar(slug: string): Revizyon[] {
  try {
    return getDb()
      .prepare(
        `SELECT v.surum, v.yururluk, v.degisiklik_notu, v.actor AS onaylayan, v.created_at
           FROM content_versions v
           JOIN content_pages p ON p.id = v.content_id
          WHERE p.tip = 'yasal' AND p.slug = ?
          ORDER BY v.surum DESC`
      )
      .all(slug) as unknown as Revizyon[];
  } catch {
    return [];
  }
}

// ─────────────────────────── müşteri referansları ───────────────────────────

/**
 * Public sitede gösterilecek referanslar.
 *
 * İKİ KOŞUL BİRDEN: `durum = 'yayinda'` VE `yayin_izni = 1`. İzin, durumdan
 * ayrı bir kapıdır — bir referansı yanlışlıkla yayına almak, izni olmayan bir
 * firmanın adını ve ticari ilişkiyi kamuya açıklamak demektir. Filtre sorguda
 * durur, bileşende değil (metriklerle aynı gerekçe).
 */
const okuReferans = cache((): Referans[] => {
  try {
    const satirlar = getDb()
      .prepare(
        `SELECT marka, kisi, unvan, kategori, proje, metin
           FROM testimonials
          WHERE durum = 'yayinda' AND yayin_izni = 1
          ORDER BY sira, id`
      )
      .all() as unknown as {
      marka: string; kisi: string; unvan: string;
      kategori: string; proje: string; metin: string;
    }[];

    // Kayıt yoksa koda düşülür; ama İZİNSİZ kayıt asla buraya gelmez.
    if (satirlar.length === 0) return referanslarKod;

    return satirlar.map((s) => ({
      brand: s.marka,
      name: s.kisi,
      role: s.unvan,
      category: s.kategori,
      project: s.proje,
      text: s.metin,
    }));
  } catch (err) {
    console.error('[icerik] referanslar okunamadi, koddaki icerik kullaniliyor', err);
    return referanslarKod;
  }
});

export function getReferanslar(): Referans[] {
  return okuReferans();
}
