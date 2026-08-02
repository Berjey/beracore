/**
 * Panelden içerik kaydetme testleri (Faz 1.3).
 *
 * Kaydetme yolunun sessizce bozulabilecek üç davranışı var:
 *  - Sürüm kaydı güncellemeden ÖNCE alınmalı; sonra alınırsa "önceki hâl" diye
 *    saklanan şey yeni hâlin kopyası olur ve geri dönüş imkânı kaybolur.
 *  - Geçersiz tarih kabul edilirse sitemap `lastmod` ve JSON-LD'ye bozuk değer gider.
 *  - Hata durumunda transaction geri alınmalı; yarım kaydetme, SSS'i silinmiş
 *    ama gövdesi eski bir yazı bırakır.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { hazirla, migrasyonlariUygula, temizle, testDb } from './yardim/test-db';

hazirla();

let A: typeof import('@/lib/db/content-admin');
let contentId: number;

const temelGuncelleme = () => ({
  baslik: 'Yeni Başlık',
  meta_title: 'Yeni Meta Başlık',
  meta_description: 'Yeni meta açıklama.',
  ozet: 'Yeni özet.',
  govde: [{ type: 'p' as const, text: 'Yeni gövde.' }],
  kategori: 'Yapay Zeka',
  okuma_dakika: 7,
  ilgili_hizmet_etiket: 'Etiket',
  ilgili_hizmet_href: '/hizmetler/ai',
  yayin_tarihi: '2026-07-24',
  guncelleme_tarihi: '',
  durum: 'yayinda',
  sss: [{ soru: 'Soru 1', cevap: 'Cevap 1' }],
});

before(async () => {
  await migrasyonlariUygula();
  A = await import('@/lib/db/content-admin');
  const { aktar } = await import('../scripts/icerik-aktar.mjs');
  await aktar(testDb());
  contentId = (testDb()
    .prepare("SELECT id FROM content_pages WHERE tip='blog' AND slug='ai-chatbot-nedir'")
    .get() as { id: number }).id;
});

after(async () => { await temizle(); });

test('kaydetme ÖNCEKİ hâli sürüm geçmişine yazar', () => {
  const onceki = A.getIcerik(contentId)!;
  const r = A.guncelleIcerik(contentId, temelGuncelleme(), 'admin@beracore.com');
  assert.equal(r.ok, true);

  const surumler = A.listSurumler(contentId);
  assert.equal(surumler.length, 1);
  assert.equal(surumler[0].surum, 1);
  assert.equal(surumler[0].actor, 'admin@beracore.com');

  const anlik = JSON.parse(
    (testDb().prepare('SELECT anlik FROM content_versions WHERE content_id = ?').get(contentId) as { anlik: string }).anlik
  );
  // Saklanan YENİ değil ESKİ başlık olmalı.
  assert.equal(anlik.baslik, onceki.baslik);
  assert.notEqual(anlik.baslik, 'Yeni Başlık');
  // SSS de anlık görüntüye dahil — sürüm eksiksiz olmalı.
  assert.ok(Array.isArray(anlik.sss) && anlik.sss.length > 0);
});

test('güncelleme gerçekten uygulanır ve SSS yeniden yazılır', () => {
  const yazi = A.getIcerik(contentId)!;
  assert.equal(yazi.baslik, 'Yeni Başlık');
  assert.equal(yazi.okuma_dakika, 7);

  const sss = A.getSss(contentId);
  assert.equal(sss.length, 1);
  assert.equal(sss[0].soru, 'Soru 1');
});

test('boş soru veya cevap kaydedilmez', () => {
  A.guncelleIcerik(contentId, {
    ...temelGuncelleme(),
    sss: [
      { soru: 'Dolu soru', cevap: 'Dolu cevap' },
      { soru: 'Cevapsız soru', cevap: '   ' },
      { soru: '', cevap: '' },
    ],
  }, 'admin@beracore.com');

  const sss = A.getSss(contentId);
  assert.equal(sss.length, 1);
  assert.equal(sss[0].soru, 'Dolu soru');
});

test('geçersiz tarih reddedilir ve içerik DEĞİŞMEZ', () => {
  const once = A.getIcerik(contentId)!;

  for (const tarih of ['24.07.2026', '2026-7-4', 'bugün', '']) {
    const r = A.guncelleIcerik(contentId, { ...temelGuncelleme(), baslik: 'Bozuk', yayin_tarihi: tarih }, 'a@b.c');
    assert.equal(r.ok, false, `kabul edilmemeliydi: ${tarih}`);
    assert.equal(r.hata, 'gecersiz-tarih');
  }

  assert.equal(A.getIcerik(contentId)!.baslik, once.baslik);
});

test('boş başlık ve geçersiz durum reddedilir', () => {
  assert.equal(A.guncelleIcerik(contentId, { ...temelGuncelleme(), baslik: '  ' }, 'a@b.c').hata, 'baslik-bos');
  assert.equal(A.guncelleIcerik(contentId, { ...temelGuncelleme(), durum: 'canli' }, 'a@b.c').hata, 'gecersiz-durum');
});

test('olmayan kayıt güncellenemez', () => {
  assert.equal(A.guncelleIcerik(999999, temelGuncelleme(), 'a@b.c').hata, 'bulunamadi');
});

test('sürüm numarası her kaydetmede artar', () => {
  const oncekiSayi = A.listSurumler(contentId).length;
  A.guncelleIcerik(contentId, { ...temelGuncelleme(), baslik: 'Bir Sonraki' }, 'a@b.c');
  const surumler = A.listSurumler(contentId);
  assert.equal(surumler.length, oncekiSayi + 1);
  // En yeni üstte
  assert.equal(surumler[0].surum, oncekiSayi + 1);
});

test('panel listesi SSS ve sürüm sayılarını taşır', () => {
  const liste = A.listIcerik('blog');
  assert.equal(liste.length, 50);
  const kayit = liste.find((y) => y.slug === 'ai-chatbot-nedir')!;
  assert.equal(kayit.sss_sayisi, A.getSss(contentId).length);
  assert.equal(kayit.surum_sayisi, A.listSurumler(contentId).length);
});
