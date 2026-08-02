import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from '@/lib/auth';

/**
 * Panel kimlik doğrulamasının saf (DB'siz) kısmı.
 * Oturum/kilit davranışı çalışan sunucu gerektirdiği için burada değil,
 * scratchpad'deki HTTP suite'inde doğrulanır.
 */

test('hashPassword: doğru parolayı doğrular, yanlışı reddeder', () => {
  const kayit = hashPassword('cok-gizli-parola-123');
  assert.ok(verifyPassword('cok-gizli-parola-123', kayit));
  assert.ok(!verifyPassword('cok-gizli-parola-124', kayit));
  assert.ok(!verifyPassword('', kayit));
});

test('hashPassword: her çağrıda FARKLI tuz üretir', () => {
  const a = hashPassword('ayni-parola');
  const b = hashPassword('ayni-parola');
  assert.notEqual(a, b, 'aynı parola için aynı hash üretiliyor — tuz kullanılmıyor');
  assert.ok(verifyPassword('ayni-parola', a) && verifyPassword('ayni-parola', b));
});

test('hash biçimi `$` İÇERMEZ — .env değişken genişletmesi hash\'i bozar', () => {
  // Next `.env` dosyalarını dotenv-expand ile okur ve `$ad` dizisini değişken
  // referansı sayıp boşa çevirir. Ayırıcı olarak `$` kullanılırsa kayıt sessizce
  // bozulur ve DOĞRU parola bile reddedilir (2 Ağu 2026'da yaşandı).
  const kayit = hashPassword('parola-ornegi-12345');
  assert.ok(!kayit.includes('$'), `hash '$' içeriyor: ${kayit.slice(0, 20)}…`);
  assert.match(kayit, /^scrypt:[0-9a-f]{32}:[0-9a-f]{128}$/);
});

test('verifyPassword: bozuk/eksik kayıtlarda çökmez, false döner', () => {
  for (const bozuk of ['', 'scrypt', 'scrypt:', 'scrypt:abc', 'bcrypt:aa:bb', 'rastgele-metin']) {
    assert.equal(verifyPassword('herhangi', bozuk), false, `bozuk kayıt kabul edildi: ${bozuk}`);
  }
});

test('verifyPassword: baştaki/sondaki boşluğa dayanıklı (.env kopyalama hatası)', () => {
  const kayit = hashPassword('parola-bosluk-testi');
  assert.ok(verifyPassword('parola-bosluk-testi', `  ${kayit}\n`));
});
