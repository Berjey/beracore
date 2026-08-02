/**
 * Hukuki metin ve versiyonlama testleri (Faz 1.5, bulgu A-11).
 *
 * Buradaki kurallar diğer içerik tiplerinden daha katı ve sebebi hukuki:
 * bir uyuşmazlıkta "verinin işlendiği tarihte hangi metin geçerliydi" sorusunun
 * cevabı bu kayıttır. Gevşerse, kayıt işe yaramaz hâle gelir ve bunu fark etmek
 * için gerçek bir uyuşmazlık gerekir — çok geç.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { hazirla, migrasyonlariUygula, temizle, testDb } from './yardim/test-db';
import { legalDocs } from '@/lib/legal-data';

hazirla();

let C: typeof import('@/lib/db/content');
let A: typeof import('@/lib/db/content-admin');
let kvkkId: number;

const temel = () => ({
  baslik: 'KVKK Aydınlatma Metni',
  meta_title: 'M', meta_description: 'MD',
  intro: 'Giriş',
  accent: 'Yasal',
  lastUpdated: 'Ağustos 2026',
  yururluk: '2026-08-02',
  sections: [{ title: 'Bölüm', body: 'Metin' }],
  degisiklik_notu: 'Saklama süreleri eklendi',
  durum: 'yayinda',
});

before(async () => {
  await migrasyonlariUygula();
  C = await import('@/lib/db/content');
  A = await import('@/lib/db/content-admin');
  const { aktar } = await import('../scripts/icerik-aktar.mjs');
  await aktar(testDb());
  kvkkId = A.listIcerik('yasal').find((b) => b.slug === 'kvkk')!.id;
});

after(async () => { await temizle(); });

test('4 hukuki metin yazılır ve koddakiyle aynı okunur', () => {
  const db = C.getLegalDocs();
  assert.equal(db.length, 4);

  for (const beklenen of legalDocs) {
    const gelen = db.find((d) => d.slug === beklenen.slug);
    assert.ok(gelen, `eksik belge: ${beklenen.slug}`);
    assert.equal(gelen.title, beklenen.title);
    assert.equal(gelen.accent, beklenen.accent);
    assert.equal(gelen.intro, beklenen.intro);
    assert.equal(gelen.lastUpdated, beklenen.lastUpdated);
    assert.equal(gelen.metaTitle, beklenen.metaTitle);
    assert.equal(gelen.metaDescription, beklenen.metaDescription);
    assert.deepEqual(gelen.sections, beklenen.sections);
  }
});

test('DEĞİŞİKLİK NOTU olmadan revizyon kaydedilemez', () => {
  const r = A.guncelleYasal(kvkkId, { ...temel(), degisiklik_notu: '   ' }, 'admin@beracore.com');
  assert.equal(r.ok, false);
  assert.equal(r.hata, 'not-bos');
});

test('yürürlük tarihi GERİYE alınamaz', () => {
  const r = A.guncelleYasal(kvkkId, { ...temel(), yururluk: '2026-01-01' }, 'admin@beracore.com');
  assert.equal(r.ok, false);
  assert.equal(r.hata, 'tarih-geriye');
});

test('geçersiz tarih biçimi reddedilir', () => {
  for (const t of ['02.08.2026', '2026-8-2', 'bugün', '']) {
    assert.equal(
      A.guncelleYasal(kvkkId, { ...temel(), yururluk: t }, 'a@b.c').hata,
      'gecersiz-tarih',
      `kabul edilmemeliydi: ${t}`
    );
  }
});

test('bölümsüz belge kaydedilemez', () => {
  assert.equal(A.guncelleYasal(kvkkId, { ...temel(), sections: [] }, 'a@b.c').hata, 'bolum-yok');
});

test('geçerli revizyon kaydedilir ve geçmişe ÖNCEKİ metin yazılır', () => {
  const once = A.getIcerik(kvkkId)!;
  const r = A.guncelleYasal(kvkkId, temel(), 'admin@beracore.com');
  assert.equal(r.ok, true);

  const revizyonlar = C.getRevizyonlar('kvkk');
  assert.equal(revizyonlar.length, 1);
  assert.equal(revizyonlar[0].surum, 1);
  assert.equal(revizyonlar[0].yururluk, '2026-08-02');
  assert.equal(revizyonlar[0].degisiklik_notu, 'Saklama süreleri eklendi');
  assert.equal(revizyonlar[0].onaylayan, 'admin@beracore.com');

  // Saklanan ÖNCEKİ metin olmalı.
  const anlik = JSON.parse(
    (testDb().prepare('SELECT anlik FROM content_versions WHERE content_id=? ORDER BY surum').get(kvkkId) as { anlik: string }).anlik
  );
  assert.equal(anlik.govde, once.govde);
  assert.equal(anlik.guncelleme_tarihi, once.guncelleme_tarihi);

  // Yürürlük tarihi belgeye işlemiş olmalı.
  assert.equal(A.getIcerik(kvkkId)!.guncelleme_tarihi, '2026-08-02');
});

test('revizyon geçmişi tam METNİ dışarı vermez', () => {
  // Eski sürümlerin tam metnini public yayınlamak ayrı bir karar; burada
  // yalnızca "ne zaman, kim, ne değişti" listelenir.
  for (const r of C.getRevizyonlar('kvkk')) {
    assert.equal((r as unknown as Record<string, unknown>).anlik, undefined);
  }
});

test('aynı tarihte ikinci revizyon kabul edilir, sürüm artar', () => {
  const r = A.guncelleYasal(kvkkId, { ...temel(), degisiklik_notu: 'Yazım düzeltmesi' }, 'admin@beracore.com');
  assert.equal(r.ok, true);
  const revizyonlar = C.getRevizyonlar('kvkk');
  assert.equal(revizyonlar.length, 2);
  // En yeni üstte
  assert.equal(revizyonlar[0].surum, 2);
});

test('hukuki olmayan içerik bu yolla güncellenemez', () => {
  const blog = A.listIcerik('blog')[0];
  assert.equal(A.guncelleYasal(blog.id, temel(), 'a@b.c').hata, 'bulunamadi');
});

test('madde listesi ve paragraf ayrımı korunur', () => {
  const r = A.guncelleYasal(kvkkId, {
    ...temel(),
    degisiklik_notu: 'Bölüm biçimi testi',
    sections: [
      { title: 'Paragraf', body: 'Tek bir paragraf.' },
      { title: 'Liste', body: ['Birinci madde', 'İkinci madde'] },
    ],
  }, 'a@b.c');
  assert.equal(r.ok, true);

  const belge = C.getLegalDoc('kvkk')!;
  assert.equal(typeof belge.sections[0].body, 'string');
  assert.ok(Array.isArray(belge.sections[1].body));
  assert.equal((belge.sections[1].body as string[]).length, 2);
});
