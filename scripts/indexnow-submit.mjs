#!/usr/bin/env node
// IndexNow — sitemap'teki tum URL'leri Bing + Yandex'e aninda bildirir.
// Google IndexNow'i dogrudan kullanmaz; onun icin Search Console + sitemap gerekir.
//
// Kullanim:
//   node scripts/indexnow-submit.mjs            # sitemap'teki tum URL'ler
//   node scripts/indexnow-submit.mjs <url> ...  # sadece verilen URL'ler
//
// Her platformda calisir; deploy.mjs sonunda otomatik cagrilir.

import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const HOST = 'beracore.com'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// Anahtar dosyasi: public/<hexkey>.txt
const keyFile = readdirSync(resolve(root, 'public')).find((f) => /^[0-9a-f]{8,128}\.txt$/.test(f))
if (!keyFile) {
  console.error('HATA: public/ altinda IndexNow anahtar dosyasi (hex.txt) bulunamadi.')
  process.exit(1)
}
const key = keyFile.replace(/\.txt$/, '')

// URL listesi: argüman verildiyse onlar, yoksa sitemap
let urls = process.argv.slice(2)
if (urls.length === 0) {
  const xml = await fetch(`https://${HOST}/sitemap.xml`).then((r) => r.text())
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

if (urls.length === 0) {
  console.error('[indexnow] gonderilecek URL bulunamadi')
  process.exit(1)
}

console.log(`[indexnow] ${urls.length} URL gonderiliyor (key: ${key})`)

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList: urls,
  }),
})

console.log(`[indexnow] HTTP ${res.status}`)
// 200 ve 202 basarili sayilir; digerleri deploy'u bozmasin diye sadece uyarilir.
if (res.status !== 200 && res.status !== 202) {
  console.warn('[indexnow] uyari: beklenmeyen yanit —', (await res.text()).slice(0, 200))
}
