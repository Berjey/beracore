/**
 * Test veritabanı yardımcısı.
 *
 * Her test dosyası KENDİ geçici veritabanını kullanır. Gerekçesi iki yönlü:
 *  - Geliştirme veritabanına (`./.data/beracore.db`) dokunulmaz; test verisi
 *    gerçek kayıtlara karışmaz.
 *  - Node'un test koşucusu her dosyayı ayrı süreçte çalıştırır, dolayısıyla
 *    `DB_PATH` ve `getDb()` singleton'ı dosyalar arasında çakışmaz.
 *
 * ÖNEMLİ: `hazirla()` mutlaka `getDb()`'yi kullanan HERHANGİ bir modül import
 * edilmeden ÖNCE çağrılmalıdır — singleton ilk çağrıda yolu sabitler. Bu yüzden
 * test dosyaları `hazirla()`'yı üst seviyede, dinamik import'lardan önce çalıştırır.
 */
import { mkdtempSync, rmSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const MIGRATION_DIZINI = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'src',
  'lib',
  'db',
  'migrations',
);

type Baglanti = Awaited<ReturnType<typeof acBaglanti>>;
async function acBaglanti() {
  const { getDb } = await import('@/lib/db');
  return getDb();
}

let dizin: string | null = null;
let baglanti: Baglanti | null = null;

/** Geçici bir DB oluşturur, migration'ları uygular ve `DB_PATH`'i ona yöneltir. */
export function hazirla(): string {
  dizin = mkdtempSync(join(tmpdir(), 'beracore-test-'));
  const yol = join(dizin, 'test.db');
  process.env.DB_PATH = yol;
  return yol;
}

/**
 * Migration'ları gerçek `.sql` dosyalarından uygular.
 *
 * Şemayı testte elle yazmak yerine üretim dosyalarını çalıştırmak bilinçli:
 * kopyalanmış bir şema zamanla üretimden ayrışır ve testler var olmayan bir
 * veritabanını doğrulamaya başlar.
 */
export async function migrasyonlariUygula(): Promise<void> {
  const db = await acBaglanti();
  baglanti = db;
  const dosyalar = readdirSync(MIGRATION_DIZINI).filter((f) => f.endsWith('.sql')).sort();
  for (const d of dosyalar) {
    db.exec(readFileSync(join(MIGRATION_DIZINI, d), 'utf8'));
  }
}

/**
 * Testin doğrudan sorgu çalıştırabilmesi için AÇIK bağlantı.
 *
 * `migrasyonlariUygula()` çağrıldıktan sonra kullanılabilir. Sunucu çalışırken
 * veritabanını dışarıdan ikinci bir bağlantıyla okumak WAL modunda yanlış sonuç
 * verir; bu yüzden yeni bağlantı AÇILMAZ, `getDb()` singleton'ının kendisi döner.
 */
export function testDb(): Baglanti {
  if (!baglanti) throw new Error('testDb(): önce migrasyonlariUygula() çağrılmalı');
  return baglanti;
}

export async function temizle(): Promise<void> {
  try {
    const { closeDb } = await import('@/lib/db');
    closeDb();
  } catch {
    /* bağlantı hiç açılmamış olabilir */
  }
  baglanti = null;
  if (dizin) {
    rmSync(dizin, { recursive: true, force: true });
    dizin = null;
  }
}
