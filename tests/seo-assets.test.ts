import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SITE_URL, OG_IMAGE, OG_IMAGE_ABSOLUTE, ogImages, twitterImages } from '@/lib/seo';
import { formatDate } from '@/lib/format';

const ROOT = join(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');

/** PNG başlığından genişlik/yükseklik okur (IHDR chunk, bayt 16-23). */
function pngSize(path: string) {
  const buf = readFileSync(path);
  assert.equal(buf.toString('ascii', 1, 4), 'PNG', `${path}: PNG değil`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

test('SITE_URL biçimi doğru (sonda / yok — çift slash üretmesin)', () => {
  assert.match(SITE_URL, /^https:\/\/[a-z0-9.-]+$/, `beklenmeyen SITE_URL: ${SITE_URL}`);
});

test('OG görseli diskte VAR ve sabitle aynı ölçüde', () => {
  // Bu test A1'in tekrar bozulmasını engeller: görsel yeniden üretilip ölçüsü
  // değişirse ama src/lib/seo.ts güncellenmezse, sosyal platformlara yanlış
  // width/height bildirilir ve kart kırpılır. Sessiz hata olur — burada patlar.
  const file = join(PUBLIC, OG_IMAGE.url.replace(/^\//, ''));
  assert.ok(existsSync(file), `OG görseli yok: ${OG_IMAGE.url}`);
  const { width, height } = pngSize(file);
  assert.equal(width, OG_IMAGE.width, 'OG genişliği sabitle uyuşmuyor');
  assert.equal(height, OG_IMAGE.height, 'OG yüksekliği sabitle uyuşmuyor');
});

test('OG görseli platform gereksinimini karşılar (>=1200x630, ~1.91:1)', () => {
  assert.ok(OG_IMAGE.width >= 1200, `OG genişliği ${OG_IMAGE.width} (>=1200 gerekli)`);
  assert.ok(OG_IMAGE.height >= 630, `OG yüksekliği ${OG_IMAGE.height} (>=630 gerekli)`);
  const ratio = OG_IMAGE.width / OG_IMAGE.height;
  assert.ok(Math.abs(ratio - 1.91) < 0.05, `en-boy oranı ${ratio.toFixed(2)} (1.91 bekleniyor)`);
});

test('şema logosu diskte var ve Google alt sınırını (112px) geçiyor', () => {
  const file = join(PUBLIC, 'beracore.png');
  assert.ok(existsSync(file), 'beracore.png yok — JSON-LD logo alanı kırık olur');
  const { width, height } = pngSize(file);
  assert.ok(width >= 112 && height >= 112, `logo ${width}x${height} (>=112x112 gerekli)`);
});

test('arama motoru doğrulama dosyaları SİLİNMEDİ', () => {
  // Bunlar silinirse Search Console / Yandex mülk doğrulaması düşer.
  for (const f of ['googleb8ca659074d30ada.html', 'yandex_3d09533b9553da5c.html']) {
    assert.ok(existsSync(join(PUBLIC, f)), `doğrulama dosyası eksik: public/${f}`);
  }
});

test('IndexNow anahtar dosyası var (deploy adımı buna bağlı)', () => {
  const keyFile = readFileSync(join(PUBLIC, '53e5eb3557281173cd3bdd2db519e082.txt'), 'utf8').trim();
  assert.equal(keyFile, '53e5eb3557281173cd3bdd2db519e082', 'anahtar dosyasının içeriği adıyla aynı olmalı');
});

test('ogImages / twitterImages doğru şekli üretir', () => {
  const [img] = ogImages('Alt metin');
  assert.deepEqual(img, { url: OG_IMAGE.url, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: 'Alt metin' });
  assert.deepEqual(twitterImages, [OG_IMAGE.url]);
  assert.equal(OG_IMAGE_ABSOLUTE, `${SITE_URL}${OG_IMAGE.url}`);
});

test('formatDate: ISO tarihi Türkçe uzun biçime çevirir', () => {
  assert.equal(formatDate('2026-07-03'), '3 Temmuz 2026');
  assert.equal(formatDate('2026-01-01'), '1 Ocak 2026');
  assert.equal(formatDate('2026-12-31'), '31 Aralık 2026');
});
