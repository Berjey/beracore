/**
 * Gövde biçimi gidiş-dönüş testleri (Faz 1.3).
 *
 * Panel gövdeyi düz metin olarak düzenletir. Dönüşüm kayıplı olursa, kullanıcı
 * yazıyı AÇIP HİÇBİR ŞEY DEĞİŞTİRMEDEN kaydettiğinde içerik bozulur — sessiz ve
 * geri dönüşü zor bir hata. Bu yüzden 50 yazının HEPSİ için denklik aranıyor,
 * örnek birkaç yazı için değil.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blogPosts } from '@/lib/blog-data';
import { bloklariMetne, metniBloklara } from '@/lib/icerik-bicim';

test('50 yazının tamamı metne çevrilip geri okununca AYNI kalır', () => {
  for (const p of blogPosts) {
    const geri = metniBloklara(bloklariMetne(p.content));
    assert.deepEqual(geri, p.content, `gidis-donus bozuldu: ${p.slug}`);
  }
});

test('blok tipleri doğru tanınır', () => {
  const metin = [
    'Giriş paragrafı.',
    '## İkinci seviye başlık',
    '### Üçüncü seviye başlık',
    '- birinci madde\n- ikinci madde',
    '> Bir alıntı.',
    'Kapanış paragrafı.',
  ].join('\n\n');

  assert.deepEqual(metniBloklara(metin), [
    { type: 'p', text: 'Giriş paragrafı.' },
    { type: 'h2', text: 'İkinci seviye başlık' },
    { type: 'h3', text: 'Üçüncü seviye başlık' },
    { type: 'ul', items: ['birinci madde', 'ikinci madde'] },
    { type: 'quote', text: 'Bir alıntı.' },
    { type: 'p', text: 'Kapanış paragrafı.' },
  ]);
});

test('karışık parçada liste varsayımı yapılmaz', () => {
  // "- " ile başlamayan bir satır varsa parça liste sayılmamalı; aksi halde
  // araya sıkışmış bir paragraf sessizce madde olurdu.
  const bloklar = metniBloklara('Şunlar önemli:\n- ilk madde');
  assert.deepEqual(bloklar, [
    { type: 'p', text: 'Şunlar önemli:' },
    { type: 'p', text: '- ilk madde' },
  ]);
});

test('CRLF ve fazladan boş satırlar sorun çıkarmaz', () => {
  const bloklar = metniBloklara('Bir.\r\n\r\n\r\n## Başlık\r\n\r\nİki.\r\n');
  assert.deepEqual(bloklar, [
    { type: 'p', text: 'Bir.' },
    { type: 'h2', text: 'Başlık' },
    { type: 'p', text: 'İki.' },
  ]);
});

test('boş gövde boş dizi verir', () => {
  assert.deepEqual(metniBloklara(''), []);
  assert.deepEqual(metniBloklara('   \n\n  '), []);
  assert.equal(bloklariMetne([]), '');
});
