/**
 * Özellik bayrakları ve denetim günlüğü testleri (Faz 0).
 *
 * Bu iki modül bundan sonraki tüm fazların güvenlik ağı: bayrak yarım modülü
 * kapalı tutar, günlük ise "bunu kim değiştirdi" sorusunu cevaplar. İkisi de
 * sessizce bozulabilecek türden — bayrak yanlışlıkla açık kalırsa yarım özellik
 * müşteriye görünür, günlük yazmazsa kimse fark etmez.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { hazirla, migrasyonlariUygula, temizle } from './yardim/test-db';

hazirla();

let F: typeof import('@/lib/db/flags');
let G: typeof import('@/lib/db/activity');

before(async () => {
  await migrasyonlariUygula();
  F = await import('@/lib/db/flags');
  G = await import('@/lib/db/activity');
});

after(async () => { await temizle(); });

// ───────────────────────── bayraklar ─────────────────────────

test('tanımsız bayrak KAPALI sayılır', () => {
  // En önemli davranış: migration çalışmamış veya kayıt silinmiş bir ortamda
  // yarım bir modül kazara açılmamalı.
  assert.equal(F.flagAcik('hic-tanimlanmamis-bayrak'), false);
});

test('setFlag bayrağı oluşturur ve açar/kapatır', () => {
  F.setFlag('posta-merkezi', false, 'IMAP gelen kutusu', 'Faz 3');
  assert.equal(F.flagAcik('posta-merkezi'), false);

  F.setFlag('posta-merkezi', true);
  assert.equal(F.flagAcik('posta-merkezi'), true);

  F.setFlag('posta-merkezi', false);
  assert.equal(F.flagAcik('posta-merkezi'), false);
});

test('setFlag güncellemede açıklama ve fazı ezmez', () => {
  // Bayrağı panelden açıp kapatmak, onun ne olduğu bilgisini silmemeli.
  F.setFlag('icerik-editoru', false, 'Blok tabanlı editör', 'Faz 2');
  F.setFlag('icerik-editoru', true);

  const kayit = F.listFlags().find((b) => b.anahtar === 'icerik-editoru')!;
  assert.equal(kayit.aciklama, 'Blok tabanlı editör');
  assert.equal(kayit.faz, 'Faz 2');
  assert.equal(kayit.acik, 1);
});

test('listFlags faz ve anahtara göre sıralı döner', () => {
  const liste = F.listFlags();
  const anahtarlar = liste.map((b) => `${b.faz}|${b.anahtar}`);
  assert.deepEqual(anahtarlar, [...anahtarlar].sort());
});

// ───────────────────────── denetim günlüğü ─────────────────────────

test('logActivity kayıt yazar, listActivity en yeniden okur', () => {
  G.logActivity({ actor: 'admin@ornek.com', action: 'lead.durum-degisti', entityType: 'lead', entityId: 7 });
  const kayitlar = G.listActivity();
  assert.ok(kayitlar.length >= 1);
  assert.equal(kayitlar[0].action, 'lead.durum-degisti');
  assert.equal(kayitlar[0].entity_id, '7', 'entity_id metin olarak saklanmalı');
});

test('actor verilmezse "sistem" yazılır', () => {
  G.logActivity({ action: 'yedek.alindi' });
  assert.equal(G.listActivity()[0].actor, 'sistem');
});

test('detail JSON olarak saklanır', () => {
  G.logActivity({ action: 'test.detay', detail: { onceki: 'yeni', sonraki: 'teklif' } });
  assert.deepEqual(JSON.parse(G.listActivity()[0].detail), { onceki: 'yeni', sonraki: 'teklif' });
});

test('serialize edilemeyen detail günlüğü PATLATMAZ', () => {
  // Günlük yazımı asıl işlemi asla bozmamalı. Döngüsel referans gerçek bir risk:
  // hata nesneleri ve istek bağlamları sık sık döngüsel olur.
  const dongusel: Record<string, unknown> = { a: 1 };
  dongusel.kendisi = dongusel;

  assert.doesNotThrow(() => G.logActivity({ action: 'test.dongusel', detail: dongusel }));
});

test('aşırı uzun detail kırpılır (tablo şişmesin)', () => {
  G.logActivity({ action: 'test.uzun', detail: 'x'.repeat(10_000) });
  assert.ok(G.listActivity()[0].detail.length <= 4000);
});

test('listActivityForEntity yalnızca o varlığın kayıtlarını verir', () => {
  G.logActivity({ action: 'lead.not-eklendi', entityType: 'lead', entityId: 101 });
  G.logActivity({ action: 'lead.not-eklendi', entityType: 'lead', entityId: 102 });

  const kayitlar = G.listActivityForEntity('lead', 101);
  assert.ok(kayitlar.length >= 1);
  assert.ok(kayitlar.every((k) => k.entity_id === '101' && k.entity_type === 'lead'));
});

test('günlük modülü silme/güncelleme fonksiyonu SUNMAZ', () => {
  // Değiştirilebilen bir denetim kaydı, denetim kaydı değildir. Bu test, ileride
  // "temizlik" gerekçesiyle eklenecek bir delete fonksiyonunu yakalar.
  const disaAcilan = Object.keys(G);
  const yasakli = disaAcilan.filter((ad) => /delete|remove|update|clear|purge|sil/i.test(ad));
  assert.deepEqual(yasakli, [], `denetim günlüğüne değiştirme yüzeyi eklenmiş: ${yasakli.join(', ')}`);
});
