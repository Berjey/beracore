/**
 * Hizmet sayfalarının veritabanı katmanı testleri (Faz 1.3c).
 *
 * Üç içerik tipinin en karmaşığı: kategori ve alt hizmet AYRI satırlarda duruyor
 * ve okuma katmanında yeniden ağaç hâline getiriliyor. Sessizce bozulabilecekler:
 *  - Alt hizmetler yanlış kategoriye bağlanırsa menü ve sayfalar karışır.
 *  - `sira` kaybolursa hizmet dizilimi ve ana sayfadaki 3D sıra değişir.
 *  - Görsel kimlik alanları (color/shape/icon) panelden yazılabilirse 3D sahne kırılır.
 *  - Kategori bir alt hizmet gibi güncellenebilirse gövde yükü kaybolur.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { hazirla, migrasyonlariUygula, temizle, testDb } from './yardim/test-db';
import { services } from '@/lib/services-data';

hazirla();

let C: typeof import('@/lib/db/content');
let A: typeof import('@/lib/db/content-admin');

before(async () => {
  await migrasyonlariUygula();
  C = await import('@/lib/db/content');
  A = await import('@/lib/db/content-admin');
  const { aktar } = await import('../scripts/icerik-aktar.mjs');
  await aktar(testDb());
});

after(async () => { await temizle(); });

test('6 kategori ve 23 alt hizmet yazılır', () => {
  const kategori = A.listIcerik('hizmet');
  const alt = A.listIcerik('hizmet-alt');
  assert.equal(kategori.length, 6);
  assert.equal(alt.length, 23);
  assert.equal(alt.length, services.reduce((t, s) => t + s.subServices.length, 0));
});

test('veritabanından okunan hizmet ağacı koddakiyle ALAN ALAN aynı', () => {
  const db = C.getServices();
  assert.equal(db.length, services.length);

  for (const [i, beklenen] of services.entries()) {
    const gelen = db[i];
    // Sıra da doğrulanıyor: ana sayfadaki 3D hizmet karuseli bu diziyi kullanıyor.
    assert.equal(gelen.key, beklenen.key, 'kategori sırası değişmiş');
    assert.equal(gelen.title, beklenen.title);
    assert.equal(gelen.subtitle, beklenen.subtitle);
    assert.equal(gelen.color, beklenen.color);
    assert.equal(gelen.glowColor, beklenen.glowColor);
    assert.equal(gelen.shape, beklenen.shape);
    assert.equal(gelen.description, beklenen.description);
    assert.deepEqual(gelen.overview, beklenen.overview);
    assert.deepEqual(gelen.faq, beklenen.faq);

    assert.equal(gelen.subServices.length, beklenen.subServices.length);
    for (const [k, bAlt] of beklenen.subServices.entries()) {
      const gAlt = gelen.subServices[k];
      assert.equal(gAlt.slug, bAlt.slug, `alt hizmet sırası değişmiş: ${beklenen.key}`);
      assert.equal(gAlt.title, bAlt.title);
      assert.equal(gAlt.icon, bAlt.icon);
      assert.equal(gAlt.image, bAlt.image);
      assert.equal(gAlt.description, bAlt.description);
      assert.equal(gAlt.longDescription, bAlt.longDescription);
      assert.deepEqual(gAlt.features, bAlt.features);
      assert.deepEqual(gAlt.process, bAlt.process);
      assert.deepEqual(gAlt.benefits, bAlt.benefits);
      assert.deepEqual(gAlt.stats, bAlt.stats);
      assert.deepEqual(gAlt.faq, bAlt.faq);
      assert.equal(gAlt.metaTitle, bAlt.metaTitle);
      assert.equal(gAlt.metaDescription, bAlt.metaDescription);
    }
  }
});

test('alt hizmetler doğru kategoriye bağlanır', () => {
  for (const s of C.getServices()) {
    const kodKategori = services.find((k) => k.key === s.key)!;
    const kodSluglar = kodKategori.subServices.map((x) => x.slug).sort();
    assert.deepEqual(s.subServices.map((x) => x.slug).sort(), kodSluglar);
  }
});

test('gezinme listesi UZUN alanları TAŞIMAZ', () => {
  // Bu testin amacı performans değil, regresyon: tam nesne bağlama konulursa
  // 23 alt hizmetin tüm metni her sayfanın istemci yüküne geri girer.
  const nav = C.getServicesNav();
  assert.equal(nav.length, 6);
  for (const s of nav) {
    const kayit = s as unknown as Record<string, unknown>;
    for (const yasak of ['overview', 'faq', 'longDescription', 'features', 'process', 'benefits']) {
      assert.equal(kayit[yasak], undefined, `nav listesinde ağır alan var: ${yasak}`);
    }
    for (const alt of s.subServices) {
      const a = alt as unknown as Record<string, unknown>;
      for (const yasak of ['longDescription', 'features', 'process', 'benefits', 'faq', 'stats', 'metaTitle']) {
        assert.equal(a[yasak], undefined, `nav alt hizmetinde ağır alan var: ${yasak}`);
      }
    }
  }
});

test('kategori kaydetme görsel kimlik alanlarını KORUR', () => {
  const kategori = A.listIcerik('hizmet').find((k) => k.slug === 'ai')!;
  const once = JSON.parse(A.getIcerik(kategori.id)!.govde);

  const r = A.guncelleKategori(kategori.id, {
    baslik: 'Yeni Kategori Başlığı',
    ozet: 'Yeni açıklama',
    subtitle: 'Yeni alt başlık',
    overview: [{ h2: 'Başlık', body: 'Metin' }],
    durum: 'yayinda',
    sss: [{ soru: 'S', cevap: 'C' }],
  }, 'admin@beracore.com');
  assert.equal(r.ok, true);

  const sonra = JSON.parse(A.getIcerik(kategori.id)!.govde);
  // Renk ve 3D şekil panelden gelmiyor; geçersiz bir değer sahneyi kırardı.
  assert.equal(sonra.color, once.color);
  assert.equal(sonra.glowColor, once.glowColor);
  assert.equal(sonra.shape, once.shape);
  assert.equal(sonra.subtitle, 'Yeni alt başlık');
});

test('alt hizmet kaydetme ikon ve görseli KORUR', () => {
  const alt = A.listIcerik('hizmet-alt').find((a) => a.slug === 'ai/ai-chatbot-asistan')!;
  const once = JSON.parse(A.getIcerik(alt.id)!.govde);

  const r = A.guncelleAltHizmet(alt.id, {
    baslik: 'Yeni Alt Başlık',
    meta_title: 'M', meta_description: 'MD', ozet: 'Özet',
    longDescription: 'Uzun',
    features: ['a', 'b'], process: ['x'], benefits: ['y'],
    stats: [{ value: 'NLP', label: 'Doğal Dil İşleme' }],
    durum: 'yayinda',
    sss: [],
  }, 'admin@beracore.com');
  assert.equal(r.ok, true);

  const sonra = JSON.parse(A.getIcerik(alt.id)!.govde);
  assert.equal(sonra.icon, once.icon);
  assert.equal(sonra.image, once.image);
  assert.deepEqual(sonra.features, ['a', 'b']);
});

test('kategori alt hizmet olarak, alt hizmet kategori olarak güncellenemez', () => {
  const kategori = A.listIcerik('hizmet')[0];
  const alt = A.listIcerik('hizmet-alt')[0];

  assert.equal(A.guncelleAltHizmet(kategori.id, {
    baslik: 'X', meta_title: '', meta_description: '', ozet: '', longDescription: '',
    features: [], process: [], benefits: [], stats: [], durum: 'yayinda', sss: [],
  }, 'a@b.c').hata, 'bulunamadi');

  assert.equal(A.guncelleKategori(alt.id, {
    baslik: 'X', ozet: '', subtitle: '', overview: [], durum: 'yayinda', sss: [],
  }, 'a@b.c').hata, 'bulunamadi');
});

test('boş başlık ve geçersiz durum reddedilir', () => {
  const kategori = A.listIcerik('hizmet')[0];
  assert.equal(A.guncelleKategori(kategori.id, {
    baslik: '  ', ozet: '', subtitle: '', overview: [], durum: 'yayinda', sss: [],
  }, 'a@b.c').hata, 'baslik-bos');
  assert.equal(A.guncelleKategori(kategori.id, {
    baslik: 'X', ozet: '', subtitle: '', overview: [], durum: 'canli', sss: [],
  }, 'a@b.c').hata, 'gecersiz-durum');
});

test('kaydetme önceki hâli sürüm geçmişine yazar', () => {
  const kategori = A.listIcerik('hizmet').find((k) => k.slug === 'ai')!;
  const surumler = A.listSurumler(kategori.id);
  assert.ok(surumler.length >= 1);
  const anlik = JSON.parse(
    (testDb().prepare('SELECT anlik FROM content_versions WHERE content_id=? ORDER BY surum').get(kategori.id) as { anlik: string }).anlik
  );
  assert.notEqual(anlik.baslik, 'Yeni Kategori Başlığı');
});
