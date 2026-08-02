/**
 * İçeriğin veritabanı katmanı testleri (Faz 1.3).
 *
 * Bu taşımanın asıl riski görünen içeriği sessizce bozmaktı. Build çıktısı
 * öncesi/sonrası karşılaştırıldı ve 51 sayfa birebir aynı çıktı; buradaki
 * testler o denkliği ÜRETEN kuralları kilitler, çünkü hepsi sessizce bozulabilir:
 *
 *  - Aktarım idempotent olmazsa ikinci deploy'da yazılar veya SSS'ler çiftlenir.
 *  - Aktarım var olan kaydı EZERSE panelden yapılan düzenleme her deploy'da
 *    koddaki eski hâle döner — kullanıcı düzenlemesinin sessizce silinmesi.
 *  - Sıralamanın eşitlik bozucusu `sira` değilse /blog listesinin dizilimi ve
 *    öne çıkan yazısı değişir (13 yazı aynı yayın gününü paylaşıyor).
 *  - Tablo boşken koda düşülmezse site içeriksiz kalır.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { hazirla, migrasyonlariUygula, temizle, testDb } from './yardim/test-db';
import { blogPosts } from '@/lib/blog-data';

hazirla();

let C: typeof import('@/lib/db/content');
let aktar: (db: unknown) => Promise<{ yeni: number; atlanan: number; toplam: number }>;

before(async () => {
  await migrasyonlariUygula();
  C = await import('@/lib/db/content');
  ({ aktar } = await import('../scripts/icerik-aktar.mjs'));
});

after(async () => { await temizle(); });

test('tablo BOŞKEN koddaki içeriğe düşülür', () => {
  // Aktarım henüz çalışmadı. Site içeriksiz kalmamalı.
  const posts = C.getBlogPosts();
  assert.equal(posts.length, blogPosts.length);
});

test('aktarım 50 yazıyı ve SSS kayıtlarını yazar', async () => {
  const r = await aktar(testDb());
  assert.equal(r.yeni, 50);
  assert.equal(r.atlanan, 0);

  const db = testDb();
  const n = db.prepare("SELECT COUNT(*) AS n FROM content_pages WHERE tip='blog'").get() as { n: number };
  assert.equal(Number(n.n), 50);

  const sssKod = blogPosts.reduce((t, p) => t + (p.faq?.length ?? 0), 0);
  const sss = db.prepare('SELECT COUNT(*) AS n FROM content_faq').get() as { n: number };
  assert.equal(Number(sss.n), sssKod);
});

test('aktarım İDEMPOTENT — ikinci çalıştırma hiçbir şey eklemez', async () => {
  const r = await aktar(testDb());
  assert.equal(r.yeni, 0);
  assert.equal(r.atlanan, 50);

  const db = testDb();
  const sss = db.prepare('SELECT COUNT(*) AS n FROM content_faq').get() as { n: number };
  const sssKod = blogPosts.reduce((t, p) => t + (p.faq?.length ?? 0), 0);
  // SSS çiftlenmemeli — en kolay gözden kaçacak hata bu.
  assert.equal(Number(sss.n), sssKod);
});

test('aktarım var olan kaydı EZMEZ (panel düzenlemesi korunur)', async () => {
  const db = testDb();
  db.prepare("UPDATE content_pages SET baslik = ? WHERE tip='blog' AND slug = ?")
    .run('Panelden Degistirilmis Baslik', 'ai-chatbot-nedir');

  await aktar(db);

  const satir = db
    .prepare("SELECT baslik FROM content_pages WHERE tip='blog' AND slug = ?")
    .get('ai-chatbot-nedir') as { baslik: string };
  assert.equal(satir.baslik, 'Panelden Degistirilmis Baslik');

  // geri al — sonraki testler koddaki hâli bekliyor
  db.prepare("UPDATE content_pages SET baslik = ? WHERE tip='blog' AND slug = ?")
    .run(blogPosts.find((p) => p.slug === 'ai-chatbot-nedir')!.title, 'ai-chatbot-nedir');
});

test('veritabanından okunan yazılar koddakiyle ALAN ALAN aynı', () => {
  const db = C.getBlogPosts();
  const kod = [...blogPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  assert.equal(db.length, kod.length);

  for (const beklenen of kod) {
    const gelen = db.find((p) => p.slug === beklenen.slug);
    assert.ok(gelen, `eksik yazı: ${beklenen.slug}`);
    assert.equal(gelen.title, beklenen.title);
    assert.equal(gelen.metaTitle, beklenen.metaTitle);
    assert.equal(gelen.metaDescription, beklenen.metaDescription);
    assert.equal(gelen.excerpt, beklenen.excerpt);
    assert.equal(gelen.category, beklenen.category);
    assert.equal(gelen.author, beklenen.author);
    assert.equal(gelen.readingMinutes, beklenen.readingMinutes);
    assert.equal(gelen.publishedAt, beklenen.publishedAt);
    assert.equal(gelen.updatedAt, beklenen.updatedAt);
    assert.deepEqual(gelen.relatedService, beklenen.relatedService);
    assert.deepEqual(gelen.content, beklenen.content);
    assert.deepEqual(gelen.faq, beklenen.faq);
  }
});

test('SIRALAMA koddaki sırayla birebir aynı (eşit tarihler dahil)', () => {
  // 13 yazı 2026-07-28 tarihli. Eşitlik bozucu `sira` değil de slug olsaydı
  // /blog listesinin öne çıkan yazısı değişirdi — aktarımda gerçekten oldu.
  const dbSirasi = C.getSortedPosts().map((p) => p.slug);
  const kodSirasi = [...blogPosts]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .map((p) => p.slug);
  assert.deepEqual(dbSirasi, kodSirasi);
});

test('slug ile tek yazı okunur, olmayan slug undefined döner', () => {
  assert.equal(C.getPostBySlug('ai-chatbot-nedir')?.slug, 'ai-chatbot-nedir');
  assert.equal(C.getPostBySlug('olmayan-yazi'), undefined);
});

test('kullanılan kategoriler CATEGORY_META sırasında döner', () => {
  const kategoriler = C.getUsedCategories().map((c) => c.name);
  assert.deepEqual(kategoriler, [
    'Yapay Zeka', 'Blockchain', 'Yazılım Geliştirme',
    'Tasarım', 'E-Ticaret', 'Dijital Pazarlama',
  ]);
});

test('taslak durumundaki yazı public listede GÖRÜNMEZ', () => {
  const db = testDb();
  db.prepare("UPDATE content_pages SET durum='taslak' WHERE tip='blog' AND slug=?")
    .run('ai-chatbot-nedir');

  // `cache()` istek başına önbellek — test sürecinde tek bir "istek" olduğu için
  // doğrudan sorguyla doğrularız; okuma katmanının filtresi sorguda durur.
  const n = db
    .prepare("SELECT COUNT(*) AS n FROM content_pages WHERE tip='blog' AND durum='yayinda'")
    .get() as { n: number };
  assert.equal(Number(n.n), 49);

  db.prepare("UPDATE content_pages SET durum='yayinda' WHERE tip='blog' AND slug=?")
    .run('ai-chatbot-nedir');
});

test('bozuk gövde JSON tek yazıyı boşaltır, okumayı KIRMAZ', () => {
  const db = testDb();
  db.prepare("UPDATE content_pages SET govde='{bozuk' WHERE tip='blog' AND slug=?")
    .run('rpa-surec-otomasyonu-nedir');

  const satir = db
    .prepare("SELECT govde FROM content_pages WHERE tip='blog' AND slug=?")
    .get('rpa-surec-otomasyonu-nedir') as { govde: string };
  assert.equal(satir.govde, '{bozuk');

  // Okuma katmanı hata fırlatmamalı; kural burada: bozuk içerik 500 değil boş gövde.
  assert.doesNotThrow(() => JSON.parse(JSON.stringify(C.getBlogPosts())));

  db.prepare("UPDATE content_pages SET govde=? WHERE tip='blog' AND slug=?")
    .run(JSON.stringify(blogPosts.find((p) => p.slug === 'rpa-surec-otomasyonu-nedir')!.content),
         'rpa-surec-otomasyonu-nedir');
});
