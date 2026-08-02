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
  const { cityPages, CITY_CONTENT_UPDATED } = await import(
    pathToFileURL(join(kok, 'src', 'lib', 'city-pages-data.ts')).href
  )
  const { services } = await import(pathToFileURL(join(kok, 'src', 'lib', 'services-data.ts')).href)

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

  const sehir = await aktarSehirler(db, cityPages, CITY_CONTENT_UPDATED)
  const hizmet = await aktarHizmetler(db, services)

  return { yeni, atlanan, toplam: blogPosts.length, sehir, hizmet }
}

/**
 * Hizmet kategorileri (6) ve alt hizmetler (23).
 *
 * İki AYRI tip olarak yazılır:
 *   tip='hizmet'      slug='ai'                       → kategori hub sayfası
 *   tip='hizmet-alt'  slug='ai/ai-chatbot-asistan'    → alt hizmet sayfası
 *
 * Neden ayrı: ikisi ayrı URL, ayrı meta ve ayrı SSS taşıyor. Tek satırda iç içe
 * JSON olarak tutulsalardı panelde tek bir alt hizmeti düzenlemek tüm kategoriyi
 * yeniden yazmak olurdu ve sürüm geçmişi anlamsızlaşırdı.
 *
 * Görsel kimlik alanları (color, glowColor, shape, icon, image) de yükte durur:
 * bunlar içerik değil ama sayfayla birlikte taşınmazsa kategori kodda, metni
 * veritabanında olan bölünmüş bir model çıkardı.
 */
async function aktarHizmetler(db, services) {
  const ekle = db.prepare(`
    INSERT OR IGNORE INTO content_pages
      (tip, slug, dil, baslik, meta_title, meta_description, ozet, govde,
       kategori, sira, durum)
    VALUES (?, ?, 'tr', ?, ?, ?, ?, ?, ?, ?, 'yayinda')
  `)
  const idBul = db.prepare("SELECT id FROM content_pages WHERE tip=? AND slug=? AND dil='tr'")
  const sssEkle = db.prepare('INSERT INTO content_faq (content_id, soru, cevap, sira) VALUES (?, ?, ?, ?)')
  const sssVar = db.prepare('SELECT COUNT(*) AS n FROM content_faq WHERE content_id = ?')

  let yeni = 0
  let atlanan = 0

  const sssYaz = (tip, slug, faq) => {
    const { id } = idBul.get(tip, slug)
    if (Number(sssVar.get(id).n) === 0) {
      ;(faq ?? []).forEach((f, k) => sssEkle.run(id, f.question, f.answer, k))
    }
  }

  db.exec('BEGIN')
  try {
    for (const [i, s] of services.entries()) {
      const kategoriYuk = {
        subtitle: s.subtitle,
        color: s.color,
        glowColor: s.glowColor,
        shape: s.shape,
        overview: s.overview,
      }

      let sonuc = ekle.run(
        'hizmet', s.key, s.title, '', '', s.description,
        JSON.stringify(kategoriYuk), s.key, i,
      )
      if (Number(sonuc.changes) === 0) { atlanan++ } else { yeni++; sssYaz('hizmet', s.key, s.faq) }

      for (const [k, sub] of s.subServices.entries()) {
        const altYuk = {
          image: sub.image,
          icon: sub.icon,
          longDescription: sub.longDescription,
          features: sub.features,
          process: sub.process,
          benefits: sub.benefits,
          stats: sub.stats,
        }

        const altSlug = `${s.key}/${sub.slug}`
        sonuc = ekle.run(
          'hizmet-alt', altSlug, sub.title, sub.metaTitle, sub.metaDescription,
          sub.description, JSON.stringify(altYuk), s.key, k,
        )
        if (Number(sonuc.changes) === 0) { atlanan++ } else { yeni++; sssYaz('hizmet-alt', altSlug, sub.faq) }
      }
    }
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }

  return { yeni, atlanan, toplam: services.length + services.reduce((t, s) => t + s.subServices.length, 0) }
}

/**
 * Şehir sayfaları.
 *
 * Blogdan farkı: şehir sayfasının alan kümesi (intro, sections, bullets,
 * serviceHref/blogHref, keyword) blog kolonlarına oturmuyor. Bu alanlar tek bir
 * JSON yükü olarak `govde`ye yazılır — bloklara bölmenin karşılığı yok, çünkü
 * yapı sabit ve sorgulanmıyor.
 *
 * `slug` = `sehir/hizmet` (ör. `istanbul/web-tasarim`). UNIQUE kısıt (tip, slug, dil)
 * olduğu için iki şehirdeki aynı hizmet çakışmaz.
 */
async function aktarSehirler(db, cityPages, contentUpdated) {
  const ekle = db.prepare(`
    INSERT OR IGNORE INTO content_pages
      (tip, slug, dil, baslik, meta_title, meta_description, ozet, govde,
       kategori, yayin_tarihi, guncelleme_tarihi, sira, durum)
    VALUES ('sehir', ?, 'tr', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'yayinda')
  `)
  const idBul = db.prepare("SELECT id FROM content_pages WHERE tip='sehir' AND slug=? AND dil='tr'")
  const sssEkle = db.prepare('INSERT INTO content_faq (content_id, soru, cevap, sira) VALUES (?, ?, ?, ?)')
  const sssVar = db.prepare('SELECT COUNT(*) AS n FROM content_faq WHERE content_id = ?')

  let yeni = 0
  let atlanan = 0

  db.exec('BEGIN')
  try {
    for (const [i, c] of cityPages.entries()) {
      const yuk = {
        citySlug: c.citySlug,
        city: c.city,
        keyword: c.keyword,
        intro: c.intro,
        sections: c.sections,
        bullets: c.bullets,
        serviceHref: c.serviceHref,
        serviceLabel: c.serviceLabel,
        blogHref: c.blogHref,
        blogLabel: c.blogLabel,
      }

      const sonuc = ekle.run(
        `${c.citySlug}/${c.slug}`,
        c.title,
        c.metaTitle,
        c.metaDescription,
        c.intro,
        JSON.stringify(yuk),
        c.city,
        // Sehir sayfalarinin yayin tarihi yok; sitemap `lastmod` icin elle
        // yonetilen CITY_CONTENT_UPDATED kullanilir. Ikisi de ayni deger olur ki
        // aktarim sitemap ciktisini DEGISTIRMESIN.
        contentUpdated,
        contentUpdated,
        i,
      )

      if (Number(sonuc.changes) === 0) { atlanan++; continue }
      yeni++

      const { id } = idBul.get(`${c.citySlug}/${c.slug}`)
      if (Number(sssVar.get(id).n) === 0) {
        ;(c.faq ?? []).forEach((f, k) => sssEkle.run(id, f.question, f.answer, k))
      }
    }
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }

  return { yeni, atlanan, toplam: cityPages.length }
}

async function main() {
  const db = new DatabaseSync(dbPath)
  db.exec('PRAGMA journal_mode = WAL')
  db.exec('PRAGMA foreign_keys = ON')
  try {
    const r = await aktar(db)
    console.log(`[icerik] blog:  ${r.yeni} eklendi, ${r.atlanan} zaten vardi (toplam ${r.toplam})`)
    console.log(`[icerik] sehir: ${r.sehir.yeni} eklendi, ${r.sehir.atlanan} zaten vardi (toplam ${r.sehir.toplam})`)
    console.log(`[icerik] hizmet: ${r.hizmet.yeni} eklendi, ${r.hizmet.atlanan} zaten vardi (toplam ${r.hizmet.toplam})`)
  } finally {
    db.close()
  }
}

// Doğrudan çalıştırıldığında CLI, import edildiğinde yalnızca `aktar` verir.
// (secret-scan.mjs'te öğrenilen ders: import eden test script'i ÇALIŞTIRMAMALI.)
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main()
}
