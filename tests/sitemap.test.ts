import { test } from 'node:test';
import assert from 'node:assert/strict';
import sitemap from '@/app/sitemap';
import { blogPosts } from '@/lib/blog-data';
import { cityPages, CITY_CONTENT_UPDATED } from '@/lib/city-pages-data';
import { services } from '@/lib/services-data';
import { SITE_URL } from '@/lib/seo';

const entries = sitemap();
const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : String(v));

/**
 * BU TESTİN SEBEBİ (2 Ağu 2026):
 * sitemap.ts `new Date()` kullanıyordu; içerik hiç değişmese bile her deploy
 * 62 sayfaya "bugün güncellendi" damgası vuruyordu. Google güvenilmez lastmod'u
 * yok sayar. GSC o sırada 9 dizinde / 36 "Discovered - currently not indexed"
 * gösteriyordu — tarama önceliğini etkileyecek sinyali boşa harcıyorduk.
 * Aşağıdaki testler o hatanın sessizce geri gelmesini engeller.
 */

test('sitemap lastmod ASLA build zamanı olmamalı (bugünün tarihi yasak)', () => {
  const bugun = new Date().toISOString().slice(0, 10);
  const suclular = entries
    .filter((e) => e.lastModified && iso(e.lastModified).slice(0, 10) === bugun)
    .map((e) => e.url);

  // Bir blog yazısı gerçekten bugün yayımlandıysa meşrudur — onları hariç tut.
  const mesruBlog = new Set(
    blogPosts
      .filter((p) => (p.updatedAt ?? p.publishedAt).slice(0, 10) === bugun)
      .map((p) => `${SITE_URL}/blog/${p.slug}`)
  );
  const gercekSuclular = suclular.filter((u) => !mesruBlog.has(u));

  assert.deepEqual(
    gercekSuclular,
    [],
    `Bu URL'ler lastmod olarak build tarihini yazıyor (new Date() sızmış olabilir):\n  ${gercekSuclular.join('\n  ')}`
  );
});

test('sitemap lastmod değerleri geçerli ve gelecek tarihli değil', () => {
  const yarin = Date.now() + 24 * 60 * 60 * 1000;
  for (const e of entries) {
    if (!e.lastModified) continue;
    const t = new Date(iso(e.lastModified)).getTime();
    assert.ok(!Number.isNaN(t), `${e.url}: ayrıştırılamayan lastmod (${iso(e.lastModified)})`);
    assert.ok(t < yarin, `${e.url}: gelecek tarihli lastmod (${iso(e.lastModified)})`);
  }
});

test('blog girişleri GERÇEK yayın/güncelleme tarihini taşır', () => {
  for (const p of blogPosts) {
    const e = entries.find((x) => x.url === `${SITE_URL}/blog/${p.slug}`);
    assert.ok(e, `sitemap'te yok: ${p.slug}`);
    assert.equal(
      iso(e!.lastModified).slice(0, 10),
      (p.updatedAt ?? p.publishedAt).slice(0, 10),
      `${p.slug}: lastmod yazının tarihiyle uyuşmuyor`
    );
  }
});

test('şehir girişleri elle yönetilen içerik tarihini kullanır', () => {
  assert.match(CITY_CONTENT_UPDATED, /^\d{4}-\d{2}-\d{2}$/, 'CITY_CONTENT_UPDATED YYYY-MM-DD olmalı');
  for (const p of cityPages) {
    const e = entries.find((x) => x.url === `${SITE_URL}/${p.citySlug}/${p.slug}`);
    assert.ok(e, `sitemap'te yok: ${p.citySlug}/${p.slug}`);
    assert.equal(iso(e!.lastModified).slice(0, 10), CITY_CONTENT_UPDATED);
  }
});

test('sitemap tüm sayfa tiplerini kapsar ve URL tekrarı yok', () => {
  const beklenenHizmet = services.reduce((n, s) => n + 1 + s.subServices.length, 0);
  const urls = entries.map((e) => e.url);
  assert.equal(new Set(urls).size, urls.length, 'sitemap YİNELENEN URL içeriyor');
  assert.equal(urls.length, 8 + beklenenHizmet + blogPosts.length + cityPages.length);
  for (const u of urls) {
    assert.ok(u.startsWith(SITE_URL), `mutlak olmayan URL: ${u}`);
    assert.ok(!u.endsWith('/'), `sondaki eğik çizgi canonical ile çakışır: ${u}`);
  }
});
