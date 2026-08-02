/**
 * SQLite bağlantısı — tek kaynak.
 *
 * SÜRÜCÜ KARARI (2 Ağu 2026): `better-sqlite3` yerine Node'un YERLEŞİK `node:sqlite`
 * modülü kullanılıyor. Panel planı (28 Tem) better-sqlite3 diyordu; o karar VPS Node 20
 * çalıştırırken alınmıştı ve `node:sqlite` erişilebilir değildi. VPS 2 Ağu'da Node 24'e
 * yükseltildi ve yerleşik modül hem local hem üretimde doğrulandı.
 * Neden değişti: better-sqlite3 yerel (native) bir modüldür ve Node ABI'sine bağlıdır.
 * Aynı sınıf bir sorun bugün `sharp` ile yaşandı — Node yükseltmesinde node_modules
 * silinip `npm ci` tekrar çalıştırılmak zorunda kaldı. Yerleşik modül bu riski
 * tamamen ortadan kaldırır ve projeye bağımlılık eklemez.
 *
 * VERİTABANI KONUMU repo DIŞINDADIR. `server-deploy.sh` her deploy'da
 * `git reset --hard` çalıştırır; repo içindeki bir dosya bundan etkilenmese de
 * yanlışlıkla `git clean` eklenmesi tüm müşteri verisini silerdi. Bu yüzden
 * üretimde `/var/www/beracore-data/` altında durur.
 */
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

let db: DatabaseSync | null = null;

/** Üretimde DB_PATH .env'den gelir; dev'de repo içi `.data/` (gitignore'da). */
function dbPath(): string {
  return process.env.DB_PATH?.trim() || './.data/beracore.db';
}

export function getDb(): DatabaseSync {
  if (db) return db;

  const path = dbPath();
  mkdirSync(dirname(path), { recursive: true });

  const veri = new DatabaseSync(path);

  // WAL: okuma ve yazma birbirini bloklamaz. Tek süreçli PM2 fork modunda bile
  // uzun bir okuma sırasında gelen form gönderiminin beklememesi için gerekli.
  veri.exec('PRAGMA journal_mode = WAL');
  // Yabancı anahtar kısıtları SQLite'ta VARSAYILAN OLARAK KAPALIDIR — açılmazsa
  // notes.lead_id gibi bağlar sessizce doğrulanmaz.
  veri.exec('PRAGMA foreign_keys = ON');
  // Yazma sırasında kilit varsa hemen hata vermek yerine 5 sn bekle.
  veri.exec('PRAGMA busy_timeout = 5000');
  veri.exec('PRAGMA synchronous = NORMAL');

  db = veri;
  return db;
}

/** Test ve script'ler için: bağlantıyı kapatıp singleton'ı sıfırlar. */
export function closeDb(): void {
  db?.close();
  db = null;
}
