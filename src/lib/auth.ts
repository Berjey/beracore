/**
 * Tek yöneticili kimlik doğrulama. Auth.js YOK — bir kullanıcı, bir parola.
 *
 * Tasarım:
 *  - Parola `scrypt` ile hash'lenir (yavaş KDF; bcrypt/argon2 bağımlılığı eklemeden
 *    `node:crypto` ile gelir). Karşılaştırma `timingSafeEqual` iledir.
 *  - Oturum çerezi `<ham-kimlik>.<hmac>` biçimindedir. HMAC, edge middleware'in
 *    DB'ye gitmeden çerezin sahte olmadığını anlamasını sağlar (ucuz ön eleme).
 *  - ASIL yetki DB'den doğrulanır (`sessions`): oturum silinince erişim ANINDA biter.
 *    Yalnızca imzaya güvenilseydi, çalınan bir çerez süresi dolana kadar geçerli kalırdı.
 *  - DB'de ham kimlik değil SHA-256'sı tutulur; veritabanı okunsa bile oturum çalınamaz.
 */
import { createHmac, randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { getDb } from '@/lib/db';

export const SESSION_COOKIE = 'brc_admin';
const OTURUM_GUN = 7;

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    throw new Error('AUTH_SECRET tanımlı değil veya 32 karakterden kısa.');
  }
  return s;
}

// ───────────────────────── parola ─────────────────────────

/**
 * `scrypt:<tuz-hex>:<hash-hex>` üretir.
 *
 * AYIRICI NEDEN `:` — `$` DEĞİL: Next.js `.env` dosyalarını dotenv-expand ile okur ve
 * değerin içindeki `$ad` dizisini değişken referansı sayıp genişletir. `scrypt$b50f...$c087...`
 * biçimindeki bir hash'te `$b50f...` tanımsız bir değişken gibi görülüp BOŞA çevriliyor,
 * kayıt sessizce bozuluyor ve doğru parola bile reddediliyordu. Bu, geliştirmede
 * yakalandı; aynı hata üretim `.env`'inde de aynen oluşurdu.
 */
export function hashPassword(parola: string): string {
  const tuz = randomBytes(16);
  const hash = scryptSync(parola.normalize('NFKC'), tuz, 64);
  return `scrypt:${tuz.toString('hex')}:${hash.toString('hex')}`;
}

export function verifyPassword(parola: string, kayit: string): boolean {
  const [alg, tuzHex, hashHex] = kayit.trim().split(':');
  if (alg !== 'scrypt' || !tuzHex || !hashHex) return false;
  const beklenen = Buffer.from(hashHex, 'hex');
  const gelen = scryptSync(parola.normalize('NFKC'), Buffer.from(tuzHex, 'hex'), beklenen.length);
  return beklenen.length === gelen.length && timingSafeEqual(beklenen, gelen);
}

// ───────────────────────── çerez imzası ─────────────────────────

export function signSessionId(id: string): string {
  const mac = createHmac('sha256', secret()).update(id).digest('base64url');
  return `${id}.${mac}`;
}

const hashId = (id: string) => createHash('sha256').update(id).digest('hex');

// ───────────────────────── oturum ─────────────────────────

export function createSession(email: string, ip: string, ua: string): string {
  const id = randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + OTURUM_GUN * 864e5).toISOString().replace('T', ' ').slice(0, 19);
  getDb()
    .prepare('INSERT INTO sessions(id_hash,email,expires_at,ip,user_agent) VALUES(?,?,?,?,?)')
    .run(hashId(id), email, expires, ip.slice(0, 64), ua.slice(0, 300));
  return signSessionId(id);
}

/** Çerez değerini doğrular. Geçersiz/süresi dolmuşsa null döner. */
export function readSession(cerez: string | undefined): { email: string } | null {
  if (!cerez) return null;
  const nokta = cerez.lastIndexOf('.');
  if (nokta < 1) return null;

  const id = cerez.slice(0, nokta);
  // İmzayı burada da doğrula: middleware atlanabilir (örn. doğrudan sunucu
  // bileşeni çağrısı), bu yüzden asıl kontrol tek noktada bırakılmaz.
  if (signSessionId(id) !== cerez) return null;

  const satir = getDb()
    .prepare("SELECT email, expires_at FROM sessions WHERE id_hash = ? AND expires_at > datetime('now')")
    .get(hashId(id)) as { email: string } | undefined;

  return satir ? { email: satir.email } : null;
}

export function destroySession(cerez: string | undefined): void {
  if (!cerez) return;
  const nokta = cerez.lastIndexOf('.');
  if (nokta < 1) return;
  getDb().prepare('DELETE FROM sessions WHERE id_hash = ?').run(hashId(cerez.slice(0, nokta)));
}

/** Süresi dolmuş oturumları temizler (girişte çağrılır — ayrı cron gerekmez). */
export function pruneSessions(): void {
  getDb().exec("DELETE FROM sessions WHERE expires_at <= datetime('now')");
}

// ───────────────────────── kaba kuvvet ─────────────────────────

const DENEME_LIMIT = 8;
const PENCERE_DK = 15;

export function isLocked(ip: string): boolean {
  const r = getDb()
    .prepare(
      `SELECT COUNT(*) AS n FROM login_attempts
       WHERE ip = ? AND ok = 0 AND at > datetime('now', ?)`
    )
    .get(ip, `-${PENCERE_DK} minutes`) as { n: number };
  return r.n >= DENEME_LIMIT;
}

export function recordAttempt(ip: string, email: string, ok: boolean): void {
  const db = getDb();
  db.prepare('INSERT INTO login_attempts(ip,email,ok) VALUES(?,?,?)').run(ip.slice(0, 64), email.slice(0, 160), ok ? 1 : 0);
  // Tablo sınırsız büyümesin: 30 günden eski kayıtlar gereksiz.
  db.exec("DELETE FROM login_attempts WHERE at < datetime('now','-30 days')");
}
