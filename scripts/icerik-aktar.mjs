#!/usr/bin/env node
/**
 * Koddaki içeriği veritabanına aktarır (Faz 1.3).
 *
 * `server-deploy.sh` içinde migration'lardan HEMEN SONRA, build'den ÖNCE çalışır.
 *
 * TEK YÖNLÜ VE EKLEMELİDİR. `INSERT OR IGNORE` kullanır: bir yazı veritabanında
 * zaten varsa DOKUNULMAZ. Bu kritik — aksi halde panelden yapılan her düzenleme,
 * bir sonraki deploy'da koddaki eski hâlle sessizce geri alınırdı. Script bir
 * "senkronizasyon" değil, "eksikse tohumla" aracıdır.
 *
 * Yani: kod tarafındaki `blog-data.ts` bir yazıyı yayınlamanın ilk yolu olmaya
 * devam eder; ikinci kez aynı slug'ı düzenlemek panelin işidir.
 *
 * Kullanım:
 *   node scripts/icerik-aktar.mjs
 *   DB_PATH=/yol/db.sqlite node scripts/icerik-aktar.mjs
 */
import { DatabaseSync } from 'node:sqlite'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dbPath = process.env.DB_PATH?.trim() || join(kok, '.data', 'beracore.db')

export async function aktar(db) {
  // Dinamik import: Node 24 TypeScript'i doğrudan çalıştırır (tip soyma).
  // `pathToFileURL` şart — Windows'ta `C:\...` mutlak yolu ESM yükleyicisine
  // "c:" protokolü gibi görünür ve ERR_UNSUPPORTED_ESM_URL_SCHEME verir.
  const { blogPosts } = await import(pathToFileURL(join(kok, 'src', 'lib', 'blog-data.ts')).href)

  const ekle = db.prepare(`
    INSERT OR IGNORE INTO content_pages
      (tip, slug, dil, baslik, meta_title, meta_description, ozet, govde,
       kategori, yazar, okuma_dakika, ilgili_hizmet_etiket, ilgili_hizmet_href,
       yayin_tarihi, guncelleme_tarihi, sira, durum)
    VALUES ('blog', ?, 'tr', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'yayinda')
  `)
  const idBul = db.prepare("SELECT id FROM content_pages WHERE tip='blog' AND slug=? AND dil='tr'")
  const sssEkle = db.prepare('INSERT INTO content_faq (content_id, soru, cevap, sira) VALUES (?, ?, ?, ?)')
  const sssVar = db.prepare('SELECT COUNT(*) AS n FROM content_faq WHERE content_id = ?')

  let yeni = 0
  let atlanan = 0

  db.exec('BEGIN')
  try {
    // `sira` = koddaki EKLEME SIRASI. Gerekli, çünkü 13 yazı aynı yayın gününü
    // paylaşıyor; eşit tarihte sıra bozulursa /blog listesinin öne çıkan yazısı
    // ve tüm kart dizilimi değişir. Aktarımın görünen hiçbir şeyi değiştirmemesi
    // için eşitlik bozucu birebir korunuyor.
    for (const [i, p] of blogPosts.entries()) {
      const sonuc = ekle.run(
        p.slug,
        p.title,
        p.metaTitle,
        p.metaDescription,
        p.excerpt,
        JSON.stringify(p.content),
        p.category,
        p.author,
        p.readingMinutes,
        p.relatedService?.label ?? '',
        p.relatedService?.href ?? '',
        p.publishedAt,
        p.updatedAt ?? '',
        i,
      )

      if (Number(sonuc.changes) === 0) { atlanan++; continue }
      yeni++

      const { id } = idBul.get(p.slug)
      // SSS yalnızca yazı YENİ eklendiyse yazılır; mevcut kayda ikinci kez
      // eklenirse sorular çiftlenirdi.
      if (Number(sssVar.get(id).n) === 0) {
        ;(p.faq ?? []).forEach((f, i) => sssEkle.run(id, f.question, f.answer, i))
      }
    }
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }

  return { yeni, atlanan, toplam: blogPosts.length }
}

async function main() {
  const db = new DatabaseSync(dbPath)
  db.exec('PRAGMA journal_mode = WAL')
  db.exec('PRAGMA foreign_keys = ON')
  try {
    const r = await aktar(db)
    console.log(`[icerik] blog: ${r.yeni} eklendi, ${r.atlanan} zaten vardi (toplam ${r.toplam})`)
  } finally {
    db.close()
  }
}

// Doğrudan çalıştırıldığında CLI, import edildiğinde yalnızca `aktar` verir.
// (secret-scan.mjs'te öğrenilen ders: import eden test script'i ÇALIŞTIRMAMALI.)
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main()
}
