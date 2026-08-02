/**
 * Müşteri referansı testleri (Faz 1.4).
 *
 * Buradaki kural etik ve hukuki: bir müşteri yorumunu firma adıyla yayınlamak,
 * o firmanın sizinle çalıştığını kamuya açıklaması demektir. İzin kaydı olmadan
 * yayınlanmamalı — ve bu kural sessizce gevşeyebilecek türden.
 *
 * Ayrıca: uydurma referans üretmenin önündeki engel teknik değil kayıtsaldır.
 * `dogrulandi` alanı "metin müşterinin kendi ifadesi mi" sorusunu yazılı tutar.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { hazirla, migrasyonlariUygula, temizle, testDb } from './yardim/test-db';
import { referanslar as referanslarKod } from '@/lib/referans-data';

hazirla();

let C: typeof import('@/lib/db/content');
let T: typeof import('@/lib/db/testimonials');

const temel = (r: import('@/lib/db/testimonials').ReferansSatiri) => ({
  marka: r.marka, kisi: r.kisi, unvan: r.unvan,
  kategori: r.kategori, proje: r.proje, metin: r.metin,
  yayin_izni: r.yayin_izni === 1, izin_kaynagi: r.izin_kaynagi,
  izin_tarihi: r.izin_tarihi, dogrulandi: r.dogrulandi === 1, durum: r.durum,
});

before(async () => {
  await migrasyonlariUygula();
  C = await import('@/lib/db/content');
  T = await import('@/lib/db/testimonials');
  const { aktar } = await import('../scripts/icerik-aktar.mjs');
  await aktar(testDb());
});

after(async () => { await temizle(); });

test('3 gerçek referans izinli ve yayında tohumlanır', () => {
  const hepsi = T.listReferanslar();
  assert.equal(hepsi.length, 3);
  for (const r of hepsi) {
    // Bu üç yorum ZATEN yayındaydı; aktarım siteden düşürmemeli.
    assert.equal(r.yayin_izni, 1, `${r.marka} izinsiz tohumlanmış`);
    assert.equal(r.durum, 'yayinda');
    assert.ok(r.izin_kaynagi.length > 0);
  }
});

test('okunan referanslar koddakiyle alan alan aynı', () => {
  const db = C.getReferanslar();
  assert.equal(db.length, referanslarKod.length);
  for (const beklenen of referanslarKod) {
    const gelen = db.find((r) => r.brand === beklenen.brand);
    assert.ok(gelen, `eksik: ${beklenen.brand}`);
    assert.equal(gelen.name, beklenen.name);
    assert.equal(gelen.role, beklenen.role);
    assert.equal(gelen.category, beklenen.category);
    assert.equal(gelen.project, beklenen.project);
    assert.equal(gelen.text, beklenen.text);
  }
});

test('İZİN OLMADAN referans yayınlanamaz', () => {
  const r = T.listReferanslar()[0];
  const sonuc = T.guncelleReferans(r.id, { ...temel(r), yayin_izni: false, durum: 'yayinda' });
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.hata, 'izin-yok');
});

test('izin var ama KAYNAĞI yazılmamışsa yayınlanamaz', () => {
  const r = T.listReferanslar()[0];
  const sonuc = T.guncelleReferans(r.id, {
    ...temel(r), yayin_izni: true, izin_kaynagi: '   ', durum: 'yayinda',
  });
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.hata, 'izin-kaynagi-yok');
});

test('izni geri çekilen referans public sorgudan DÜŞER', () => {
  const r = T.listReferanslar()[0];
  const once = C.getReferanslar().length;

  const sonuc = T.guncelleReferans(r.id, { ...temel(r), yayin_izni: false, durum: 'taslak' });
  assert.equal(sonuc.ok, true);

  const kalan = testDb()
    .prepare("SELECT COUNT(*) AS n FROM testimonials WHERE durum='yayinda' AND yayin_izni=1")
    .get() as { n: number };
  assert.equal(Number(kalan.n), once - 1);

  // geri al
  T.guncelleReferans(r.id, { ...temel(r), yayin_izni: true, durum: 'yayinda' });
});

test('yeni referans HER ZAMAN izinsiz ve taslak başlar', () => {
  const sonuc = T.ekleReferans('Yeni Firma', 'Çok memnun kaldık.');
  assert.equal(sonuc.ok, true);

  const yeni = T.getReferans(sonuc.id!)!;
  assert.equal(yeni.yayin_izni, 0, 'yeni kayıt izinli başlamamalı');
  assert.equal(yeni.durum, 'taslak');

  // Ve public sorguda görünmemeli.
  assert.ok(!C.getReferanslar().some((r) => r.brand === 'Yeni Firma'));
});

test('aynı markadan ikinci kayıt eklenemez', () => {
  assert.equal(T.ekleReferans('Yeni Firma', 'İkinci yorum').hata, 'marka-var');
});

test('boş marka veya metin reddedilir', () => {
  assert.equal(T.ekleReferans('  ', 'metin').hata, 'marka-bos');
  assert.equal(T.ekleReferans('Marka', '  ').hata, 'metin-bos');

  const r = T.listReferanslar()[0];
  assert.equal(T.guncelleReferans(r.id, { ...temel(r), metin: '  ' }).hata, 'metin-bos');
  assert.equal(T.guncelleReferans(r.id, { ...temel(r), durum: 'canli' }).hata, 'gecersiz-durum');
});

test('koda uydurma referans eklenmemiş', () => {
  // Tohum dosyası GERÇEK müşterilere ait üç yorumdur. Sayının artması, birinin
  // kod üzerinden referans uydurduğu anlamına gelir — panel yolu izin sorar.
  assert.equal(referanslarKod.length, 3);
  assert.deepEqual(
    referanslarKod.map((r) => r.brand).sort(),
    ['Arovela', 'GmsGarage', 'KriptoMall']
  );
});
