/**
 * Şehir sayfalarının veritabanı katmanı testleri (Faz 1.3b).
 *
 * Şehir sayfaları yerel arama için sitenin en değerli 24 sayfası. Taşımada
 * sessizce bozulabilecek noktalar:
 *  - `slug` kolonunda `sehir/hizmet` birleşik duruyor; ayrıştırma yanlışsa rota kırılır.
 *  - `citySlug`/`city` panelden değiştirilebilirse URL kırılır (301 altyapısı yok).
 *  - Aktarım var olan kaydı ezerse panel düzenlemesi her deploy'da geri alınır.
 *  - Sitemap `lastmod` artık sayfa başına; tarih doğrulaması gevşerse arama
 *    motoruna geçersiz değer gider.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { hazirla, migrasyonlariUygula, temizle, testDb } from './yardim/test-db';
import { cityPages } from '@/lib/city-pages-data';

hazirla();

let C: typeof import('@/lib/db/content');
let A: typeof import('@/lib/db/content-admin');
let aktar: (db: unknown) => Promise<unknown>;

before(async () => {
  await migrasyonlariUygula();
  C = await import('@/lib/db/content');
  A = await import('@/lib/db/content-admin');
  ({ aktar } = await import('../scripts/icerik-aktar.mjs'));
});

after(async () => { await temizle(); });

test('tablo boşken koddaki şehir içeriğine düşülür', () => {
  assert.equal(C.getCityPages().length, cityPages.length);
});

test('aktarım 24 şehir sayfasını yazar ve idempotenttir', async () => {
  const r1 = (await aktar(testDb())) as { sehir: { yeni: number; atlanan: number } };
  assert.equal(r1.sehir.yeni, 24);
  assert.equal(r1.sehir.atlanan, 0);

  const r2 = (await aktar(testDb())) as { sehir: { yeni: number; atlanan: number } };
  assert.equal(r2.sehir.yeni, 0);
  assert.equal(r2.sehir.atlanan, 24);
});

test('veritabanından okunan şehir sayfaları koddakiyle ALAN ALAN aynı', () => {
  const db = C.getCityPages();
  assert.equal(db.length, cityPages.length);

  for (const beklenen of cityPages) {
    const gelen = db.find((p) => p.citySlug === beklenen.citySlug && p.slug === beklenen.slug);
    assert.ok(gelen, `eksik sayfa: ${beklenen.citySlug}/${beklenen.slug}`);
    assert.equal(gelen.city, beklenen.city);
    assert.equal(gelen.title, beklenen.title);
    assert.equal(gelen.metaTitle, beklenen.metaTitle);
    assert.equal(gelen.metaDescription, beklenen.metaDescription);
    assert.equal(gelen.keyword, beklenen.keyword);
    assert.equal(gelen.intro, beklenen.intro);
    assert.deepEqual(gelen.sections, beklenen.sections);
    assert.deepEqual(gelen.bullets, beklenen.bullets);
    assert.equal(gelen.serviceHref, beklenen.serviceHref);
    assert.equal(gelen.serviceLabel, beklenen.serviceLabel);
    assert.equal(gelen.blogHref, beklenen.blogHref);
    assert.equal(gelen.blogLabel, beklenen.blogLabel);
    assert.deepEqual(gelen.faq, beklenen.faq);
  }
});

test('birleşik slug doğru ayrıştırılır', () => {
  // `slug` kolonunda `istanbul/web-tasarim` duruyor; rota iki parça bekliyor.
  // Ayrıştırma yanlış olsa 24 sayfa da 404 verirdi.
  const s = C.getCityPage('istanbul', 'web-tasarim');
  assert.ok(s);
  assert.equal(s.citySlug, 'istanbul');
  assert.equal(s.slug, 'web-tasarim');
  assert.equal(C.getCityPage('istanbul', 'olmayan'), undefined);
});

test('sitemap lastmod değeri sayfa başına döner', () => {
  const t = C.getCityLastMod('ankara', 'yazilim');
  assert.match(t ?? '', /^\d{4}-\d{2}-\d{2}$/);
});

test('kaydetme citySlug ve city alanlarını DEĞİŞTİRMEZ', () => {
  const kayit = A.listIcerik('sehir').find((s) => s.slug === 'istanbul/web-tasarim')!;
  const once = JSON.parse(A.getIcerik(kayit.id)!.govde);

  const r = A.guncelleSehir(kayit.id, {
    baslik: 'Değişmiş Başlık',
    meta_title: 'Meta',
    meta_description: 'Açıklama',
    durum: 'yayinda',
    guncelleme_tarihi: '2026-08-02',
    yuk: {
      // Saldırgan/kazara farklı değer göndermeye çalışıyor:
      citySlug: 'baska-sehir',
      city: 'Başka Şehir',
      keyword: once.keyword,
      intro: once.intro,
      sections: once.sections,
      bullets: once.bullets,
      serviceHref: once.serviceHref,
      serviceLabel: once.serviceLabel,
      blogHref: once.blogHref,
      blogLabel: once.blogLabel,
    },
    sss: [{ soru: 'S', cevap: 'C' }],
  }, 'admin@beracore.com');

  assert.equal(r.ok, true);
  const sonra = JSON.parse(A.getIcerik(kayit.id)!.govde);
  assert.equal(sonra.citySlug, 'istanbul');
  assert.equal(sonra.city, once.city);
  // URL değişmemiş olmalı
  assert.equal(A.getIcerik(kayit.id)!.slug, 'istanbul/web-tasarim');
});

test('kaydetme önceki hâli sürüm geçmişine yazar', () => {
  const kayit = A.listIcerik('sehir').find((s) => s.slug === 'istanbul/web-tasarim')!;
  const surumler = A.listSurumler(kayit.id);
  assert.ok(surumler.length >= 1);
  const anlik = JSON.parse(
    (testDb().prepare('SELECT anlik FROM content_versions WHERE content_id = ? ORDER BY surum').get(kayit.id) as { anlik: string }).anlik
  );
  // v1, düzenlemeden ÖNCEKİ başlığı taşımalı.
  assert.notEqual(anlik.baslik, 'Değişmiş Başlık');
});

test('geçersiz tarih ve boş başlık reddedilir', () => {
  const kayit = A.listIcerik('sehir')[0];
  const govde = JSON.parse(A.getIcerik(kayit.id)!.govde);
  const temel = {
    baslik: 'Başlık', meta_title: '', meta_description: '',
    durum: 'yayinda', guncelleme_tarihi: '2026-08-02',
    yuk: govde, sss: [],
  };
  assert.equal(A.guncelleSehir(kayit.id, { ...temel, guncelleme_tarihi: '02.08.2026' }, 'a@b.c').hata, 'gecersiz-tarih');
  assert.equal(A.guncelleSehir(kayit.id, { ...temel, baslik: '  ' }, 'a@b.c').hata, 'baslik-bos');
  assert.equal(A.guncelleSehir(kayit.id, { ...temel, durum: 'canli' }, 'a@b.c').hata, 'gecersiz-durum');
});

test('blog kaydı şehir olarak güncellenemez', () => {
  // İki içerik tipi aynı tabloda; tip kontrolü olmasa bir blog yazısı şehir
  // yükü ile ezilebilir ve gövdesi kaybolurdu.
  const blog = A.listIcerik('blog')[0];
  const govde = JSON.parse(A.getIcerik(A.listIcerik('sehir')[0].id)!.govde);
  const r = A.guncelleSehir(blog.id, {
    baslik: 'X', meta_title: '', meta_description: '',
    durum: 'yayinda', guncelleme_tarihi: '2026-08-02', yuk: govde, sss: [],
  }, 'a@b.c');
  assert.equal(r.ok, false);
  assert.equal(r.hata, 'bulunamadi');
});
