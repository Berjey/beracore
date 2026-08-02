#!/usr/bin/env node
/**
 * Sürümlü, idempotent migration çalıştırıcı.
 *
 * `server-deploy.sh` içinde build SONRASI, pm2 restart ÖNCESİ çalışır. Uygulanan
 * her dosya `schema_migrations` tablosuna yazılır; ikinci çalıştırmada atlanır.
 * Her dosya TEK bir işlem (transaction) içinde uygulanır — yarım kalan bir migration
 * şemayı tutarsız bırakmaz.
 *
 * Kullanım:
 *   node scripts/migrate.mjs            # DB_PATH env'inden (yoksa ./.data/beracore.db)
 *   DB_PATH=/yol/db.sqlite node scripts/migrate.mjs
 */
import { DatabaseSync } from 'node:sqlite'
import { readdirSync, readFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const migrationsDir = join(kok, 'src', 'lib', 'db', 'migrations')
const dbPath = process.env.DB_PATH?.trim() || join(kok, '.data', 'beracore.db')

mkdirSync(dirname(dbPath), { recursive: true })
const db = new DatabaseSync(dbPath)
db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA foreign_keys = ON')

db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
  name       TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
)`)

const uygulanan = new Set(
  db.prepare('SELECT name FROM schema_migrations').all().map((r) => r.name)
)

const dosyalar = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()
let sayac = 0

for (const dosya of dosyalar) {
  if (uygulanan.has(dosya)) continue
  const sql = readFileSync(join(migrationsDir, dosya), 'utf8')
  db.exec('BEGIN')
  try {
    db.exec(sql)
    db.prepare('INSERT INTO schema_migrations(name) VALUES(?)').run(dosya)
    db.exec('COMMIT')
    console.log(`[migrate] uygulandi: ${dosya}`)
    sayac++
  } catch (err) {
    db.exec('ROLLBACK')
    console.error(`[migrate] HATA (${dosya}) — geri alindi:`, err.message)
    process.exit(1)
  }
}

console.log(
  sayac === 0
    ? `[migrate] guncel — ${dosyalar.length} migration, yeni yok (${dbPath})`
    : `[migrate] ${sayac} migration uygulandi (${dbPath})`
)
db.close()
