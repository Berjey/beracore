/**
 * Oturum ve kaba kuvvet koruması testleri.
 *
 * Mevcut `tests/auth.test.ts` yalnızca parola hash'ini (saf, DB'siz kısmı) test
 * ediyordu. Oturumun kendisi — imza doğrulaması, süre dolumu, iptal, IP kilidi —
 * hiç test edilmemişti. Oysa panelin TEK savunma hattı bu kod.
 *
 * Sessizce bozulabilecek yerler özellikle hedeflendi: imzası kurcalanmış çerez,
 * süresi dolmuş oturum, silinmiş oturumun çerezi, kilit penceresi sınırı.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { hazirla, migrasyonlariUygula, temizle } from './yardim/test-db';

hazirla();
// `AUTH_SECRET` auth modülü ilk kullanıldığında okunur; import'tan önce kurulmalı.
//
// Değer KAYNAK KODA YAZILMAZ, her çalıştırmada üretilir. İki sebep:
//  - `scripts/secret-scan.mjs` sabit bir `AUTH_SECRET=...` satırını (haklı olarak)
//    sızıntı sayıp deploy'u durdurur. Tarayıcıya muafiyet eklemek, test dosyasında
//    gerçek bir sırrın saklanabileceği kör nokta açardı.
//  - Sabit test anahtarı zamanla "geçici olarak" üretime kopyalanma riski taşır.
process.env.AUTH_SECRET = randomBytes(32).toString('base64url');

type AuthModulu = typeof import('@/lib/auth');
type DbModulu = typeof import('@/lib/db');
let A: AuthModulu;
let D: DbModulu;

before(async () => {
  await migrasyonlariUygula();
  A = await import('@/lib/auth');
  D = await import('@/lib/db');
});

after(async () => { await temizle(); });

// ───────────────────────── oturum ─────────────────────────

test('createSession geçerli bir çerez üretir, readSession okur', () => {
  const cerez = A.createSession('admin@ornek.com', '10.0.0.1', 'test-agent');
  assert.ok(cerez.includes('.'), 'çerez id.imza biçiminde olmalı');
  assert.deepEqual(A.readSession(cerez), { email: 'admin@ornek.com' });
});

test('ham oturum kimliği veritabanında DÜZ saklanmaz', () => {
  // Çerez çalınırsa saldırgan oturumu kullanır; ama DB sızarsa oturumları
  // kullanamamalı. Bu yüzden tabloda yalnızca SHA-256 özeti durur.
  const cerez = A.createSession('admin@ornek.com', '10.0.0.1', 'ua');
  const hamId = cerez.slice(0, cerez.lastIndexOf('.'));

  const satir = D.getDb()
    .prepare('SELECT COUNT(*) AS n FROM sessions WHERE id_hash = ?')
    .get(hamId) as { n: number };
  assert.equal(satir.n, 0, 'ham kimlik id_hash sütununda bulunmamalı');
});

test('imzası kurcalanmış çerez reddedilir', () => {
  const cerez = A.createSession('admin@ornek.com', '10.0.0.1', 'ua');
  const nokta = cerez.lastIndexOf('.');
  const bozuk = `${cerez.slice(0, nokta)}.${'A'.repeat(cerez.length - nokta - 1)}`;
  assert.equal(A.readSession(bozuk), null);
});

test('başka oturumun imzası bu kimlikle kullanılamaz (imza karıştırma)', () => {
  const a = A.createSession('a@ornek.com', '10.0.0.1', 'ua');
  const b = A.createSession('b@ornek.com', '10.0.0.2', 'ua');
  const melez = `${a.slice(0, a.lastIndexOf('.'))}.${b.slice(b.lastIndexOf('.') + 1)}`;
  assert.equal(A.readSession(melez), null);
});

test('biçimsiz çerezler çökmeden reddedilir', () => {
  for (const v of [undefined, '', '.', 'noktasiz', '.sadeceimza']) {
    assert.equal(A.readSession(v as string | undefined), null, `"${v}" kabul edildi`);
  }
});

test('destroySession erişimi ANINDA bitirir', () => {
  // DB tabanlı oturumun tek sebebi bu: imza tek başına yeterli olsaydı çalınmış
  // bir çerez süresi dolana kadar geçerli kalır ve iptal edilemezdi.
  const cerez = A.createSession('admin@ornek.com', '10.0.0.1', 'ua');
  assert.ok(A.readSession(cerez));
  A.destroySession(cerez);
  assert.equal(A.readSession(cerez), null);
});

test('süresi dolmuş oturum reddedilir ve pruneSessions temizler', () => {
  const cerez = A.createSession('admin@ornek.com', '10.0.0.1', 'ua');
  D.getDb().exec("UPDATE sessions SET expires_at = datetime('now','-1 hour')");

  assert.equal(A.readSession(cerez), null, 'süresi dolmuş oturum kabul edildi');

  A.pruneSessions();
  const kalan = D.getDb().prepare('SELECT COUNT(*) AS n FROM sessions').get() as { n: number };
  assert.equal(kalan.n, 0);
});

test('pruneSessions GEÇERLİ oturumları silmez', () => {
  const cerez = A.createSession('admin@ornek.com', '10.0.0.1', 'ua');
  A.pruneSessions();
  assert.ok(A.readSession(cerez), 'geçerli oturum yanlışlıkla silindi');
  A.destroySession(cerez);
});

// ───────────────────────── kaba kuvvet ─────────────────────────

test('IP 8 başarısız denemeden sonra kilitlenir, öncesinde kilitlenmez', () => {
  const ip = '203.0.113.10';
  for (let i = 0; i < 7; i++) {
    A.recordAttempt(ip, 'admin@ornek.com', false);
    assert.equal(A.isLocked(ip), false, `${i + 1}. denemede erken kilitlendi`);
  }
  A.recordAttempt(ip, 'admin@ornek.com', false);
  assert.equal(A.isLocked(ip), true, '8. başarısız denemede kilitlenmeliydi');
});

test('kilit IP başına — bir IP kilitlenince diğeri etkilenmez', () => {
  const kilitli = '203.0.113.20';
  for (let i = 0; i < 8; i++) A.recordAttempt(kilitli, 'admin@ornek.com', false);
  assert.equal(A.isLocked(kilitli), true);
  assert.equal(A.isLocked('203.0.113.21'), false);
});

test('BAŞARILI denemeler kilide sayılmaz', () => {
  const ip = '203.0.113.30';
  for (let i = 0; i < 20; i++) A.recordAttempt(ip, 'admin@ornek.com', true);
  assert.equal(A.isLocked(ip), false);
});

test('15 dakikalık pencerenin dışındaki denemeler kilidi düşürür', () => {
  const ip = '203.0.113.40';
  for (let i = 0; i < 8; i++) A.recordAttempt(ip, 'admin@ornek.com', false);
  assert.equal(A.isLocked(ip), true);

  D.getDb()
    .prepare("UPDATE login_attempts SET at = datetime('now','-16 minutes') WHERE ip = ?")
    .run(ip);
  assert.equal(A.isLocked(ip), false, 'pencere dışına çıkan denemeler hâlâ sayılıyor');
});
