import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blogPosts, getCategoryMeta } from '@/lib/blog-data';
import { cityPages } from '@/lib/city-pages-data';
import { services } from '@/lib/services-data';

/**
 * İçerik verisi bütünlüğü.
 *
 * `npm run seo-audit` derlenmiş HTML üzerinde çalışır (kapsamlı ama build
 * gerektirir, ~1 dk). Buradaki testler build'den ÖNCE, saniyeler içinde
 * REFERANS BÜTÜNLÜĞÜNÜ kontrol eder: kırık iç link ve tutarsız veri, HTML
 * üretilmeden yakalanır. İkisi birbirinin yerine değil, art arda çalışır.
 */

// Tüm gerçek hizmet sayfası yolları (kategori + alt hizmet).
const servicePaths = new Set<string>();
for (const s of services) {
  servicePaths.add(`/hizmetler/${s.key}`);
  for (const sub of s.subServices) servicePaths.add(`/hizmetler/${s.key}/${sub.slug}`);
}
const blogPaths = new Set(blogPosts.map((p) => `/blog/${p.slug}`));

test('hizmet yapısı: 6 kategori, 23 alt hizmet', () => {
  assert.equal(services.length, 6, 'kategori sayısı değişti');
  const subCount = services.reduce((n, s) => n + s.subServices.length, 0);
  assert.equal(subCount, 23, 'alt hizmet sayısı değişti');
});

test('slug\'lar tekil (blog / hizmet / şehir sayfaları)', () => {
  const blogSlugs = blogPosts.map((p) => p.slug);
  assert.equal(new Set(blogSlugs).size, blogSlugs.length, 'yinelenen blog slug');

  const serviceKeys = services.map((s) => s.key);
  assert.equal(new Set(serviceKeys).size, serviceKeys.length, 'yinelenen hizmet key');

  const cityKeys = cityPages.map((c) => `${c.citySlug}/${c.slug}`);
  assert.equal(new Set(cityKeys).size, cityKeys.length, 'yinelenen şehir sayfası');
});

test('slug biçimi: küçük harf, tire, Türkçe karakter yok (URL güvenliği)', () => {
  const ok = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  for (const p of blogPosts) assert.match(p.slug, ok, `geçersiz blog slug: ${p.slug}`);
  for (const s of services) {
    assert.match(s.key, ok, `geçersiz hizmet key: ${s.key}`);
    for (const sub of s.subServices) assert.match(sub.slug, ok, `geçersiz alt hizmet slug: ${sub.slug}`);
  }
  for (const c of cityPages) {
    assert.match(c.citySlug, ok, `geçersiz şehir slug: ${c.citySlug}`);
    assert.match(c.slug, ok, `geçersiz şehir hizmet slug: ${c.slug}`);
  }
});

test('blog başlıkları tekil (yinelenen içerik sinyali vermesin)', () => {
  const titles = blogPosts.map((p) => p.title.trim().toLocaleLowerCase('tr'));
  const dupes = titles.filter((t, i) => titles.indexOf(t) !== i);
  assert.deepEqual([...new Set(dupes)], [], 'yinelenen blog başlığı');
});

test('her blog yazısı proje standardını taşır (relatedService + faq + kategori)', () => {
  for (const p of blogPosts) {
    assert.ok(p.relatedService, `${p.slug}: relatedService yok (huni girişi zorunlu)`);
    assert.ok(p.faq && p.faq.length > 0, `${p.slug}: faq yok (FAQPage schema zorunlu)`);
    assert.ok(getCategoryMeta(p.category), `${p.slug}: CATEGORY_META'da tanımsız kategori "${p.category}"`);
    assert.ok(p.readingMinutes > 0, `${p.slug}: readingMinutes geçersiz`);
    assert.ok(p.content.length > 0, `${p.slug}: içerik boş`);
    assert.ok(
      p.content.some((b) => b.type === 'h2'),
      `${p.slug}: hiç h2 yok (yapısız içerik)`,
    );
  }
});

test('KIRIK İÇ LİNK YOK — relatedService gerçek bir hizmet sayfasına gider', () => {
  for (const p of blogPosts) {
    const href = p.relatedService?.href;
    if (!href) continue;
    assert.ok(servicePaths.has(href), `${p.slug}: relatedService kırık → ${href}`);
  }
});

test('KIRIK İÇ LİNK YOK — şehir sayfalarının hizmet ve blog linkleri gerçek', () => {
  for (const c of cityPages) {
    assert.ok(servicePaths.has(c.serviceHref), `${c.citySlug}/${c.slug}: serviceHref kırık → ${c.serviceHref}`);
    assert.ok(blogPaths.has(c.blogHref), `${c.citySlug}/${c.slug}: blogHref kırık → ${c.blogHref}`);
  }
});

test('tarihler geçerli ISO ve updatedAt >= publishedAt', () => {
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  for (const p of blogPosts) {
    assert.match(p.publishedAt, iso, `${p.slug}: publishedAt biçimi hatalı`);
    assert.ok(!Number.isNaN(Date.parse(p.publishedAt)), `${p.slug}: publishedAt geçersiz tarih`);
    if (p.updatedAt) {
      assert.match(p.updatedAt, iso, `${p.slug}: updatedAt biçimi hatalı`);
      assert.ok(p.updatedAt >= p.publishedAt, `${p.slug}: updatedAt publishedAt'ten önce`);
    }
  }
});

test('meta uzunlukları arama sonucunda kırpılmayacak aralıkta', () => {
  // Google ~580px başlık / ~920px açıklama gösterir; karakter üst sınırları
  // pratik eşiklerdir. Alt sınır "çok kısa/zayıf meta" tespiti içindir.
  const check = (label: string, title: string, desc: string) => {
    assert.ok(title.length >= 20 && title.length <= 70, `${label}: metaTitle ${title.length} karakter (20-70 bekleniyor)`);
    assert.ok(desc.length >= 70 && desc.length <= 170, `${label}: metaDescription ${desc.length} karakter (70-170 bekleniyor)`);
  };
  for (const p of blogPosts) check(`blog/${p.slug}`, p.metaTitle, p.metaDescription);
  for (const c of cityPages) check(`${c.citySlug}/${c.slug}`, c.metaTitle, c.metaDescription);
});

test('şehir sayfaları yapısal olarak eksiksiz ve içerik hacmi gerilemiyor', () => {
  // ÖLÇÜM (30 Tem 2026): 24 şehir sayfasının tamamı 246-302 kelime aralığında.
  // Her sayfa kendi şehrine özgü metin taşır (kopya değil), ancak hacim yerel
  // rakiplerin altında. Genişletmek İÇERİK işidir ve içerik üretimi şu an
  // bilinçli olarak duraklatılmış durumda (bkz. docs/yol-haritasi.md).
  // Buradaki eşik bir HEDEF değil, REGRESYON KORUMASIDIR: mevcut tabanın
  // (246) altına düşen bir sayfa eklenirse/kısaltılırsa test patlar.
  const FLOOR = 240;
  for (const c of cityPages) {
    assert.ok(c.sections.length >= 3, `${c.citySlug}/${c.slug}: ${c.sections.length} bölüm (en az 3 bekleniyor)`);
    assert.ok(c.faq.length >= 3, `${c.citySlug}/${c.slug}: ${c.faq.length} SSS (en az 3 bekleniyor)`);
    const text = [
      c.intro,
      ...c.sections.map((s) => `${s.h2} ${s.body}`),
      c.bullets.title,
      ...c.bullets.items,
      ...c.faq.map((f) => `${f.question} ${f.answer}`),
    ].join(' ');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    assert.ok(words >= FLOOR, `${c.citySlug}/${c.slug}: ~${words} kelime, taban ${FLOOR} altına düştü`);
  }
});
