#!/usr/bin/env node
/**
 * Sir tarayici — push'tan ONCE calisir, sizinti bulursa deploy'u durdurur.
 *
 * NEDEN VAR: 2 Agustos 2026'da `uretim-kimlik.tmp` dosyasi canli panelin duz metin
 * parolasini, `ADMIN_PASSWORD_HASH`'ini ve `AUTH_SECRET`'ini tasiyordu ve HERKESE ACIK
 * GitHub deposuna commit'lenmisti (e4e00a6). `.gitignore` `.env*` kaliplarini
 * kapsiyordu ama `*.tmp`'yi kapsamiyordu; kimse fark etmedi.
 *
 * `.gitignore` tek basina yeterli degil: yeni bir uzanti, farkli bir dosya adi veya
 * `git add -f` ayni delige tekrar dusurur. Bu script git'in FIILEN takip ettigi
 * icerige bakar — kalip listesine degil.
 *
 * Kullanim:
 *   node scripts/secret-scan.mjs           # takip edilen dosyalar (deploy oncesi)
 *   node scripts/secret-scan.mjs --gecmis  # TUM git gecmisi (yavas, denetim icin)
 *
 * Cikis kodu 1 = sizinti bulundu.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, extname } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Her kalip GERCEK bir sir bicimini hedefler, "password" gibi genel kelimeleri degil.
 * Amac dusuk yanlis-pozitif: gurultu yapan bir kapi, kapatilan bir kapidir.
 */
const KALIPLAR = [
  { ad: 'scrypt parola hash', re: /scrypt:[0-9a-f]{32}:[0-9a-f]{128}/i },
  { ad: 'AUTH_SECRET degeri', re: /AUTH_SECRET\s*=\s*['"]?[A-Za-z0-9_-]{32,}/ },
  { ad: 'ADMIN_PASSWORD_HASH degeri', re: /ADMIN_PASSWORD_HASH\s*=\s*['"]?\S{20,}/ },
  { ad: 'SMTP/IMAP parolasi', re: /(SMTP|IMAP)_PASS\s*=\s*['"]?(?!your-|<|\$\{)\S{6,}/ },
  { ad: 'duz metin PAROLA satiri', re: /^\s*PAROLA\s*=\s*\S+/m },
  { ad: 'ozel anahtar blogu', re: /-----BEGIN (RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/ },
  { ad: 'Google servis hesabi anahtari', re: /"private_key"\s*:\s*"-----BEGIN/ },
  { ad: 'AWS erisim anahtari', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { ad: 'Anthropic API anahtari', re: /\bsk-ant-[A-Za-z0-9_-]{20,}/ },
  { ad: 'OpenAI API anahtari', re: /\bsk-(?:proj-)?[A-Za-z0-9]{32,}/ },
  { ad: 'Slack token', re: /\bxox[baprs]-[A-Za-z0-9-]{10,}/ },
  { ad: 'GitHub token', re: /\bgh[pousr]_[A-Za-z0-9]{36,}/ },
]

/** Sirlarin bicimini ANLATAN dosyalar taranmaz — kalibi tarif etmek sizinti degildir. */
const MUAF_DOSYALAR = new Set([
  '.env.example',
  '.gitignore',
  'scripts/secret-scan.mjs',
  'scripts/hash-password.mjs',
  'tests/secret-scan.test.ts',
  // NOT: tests/auth-oturum.test.ts MUAF DEGIL — test anahtarini calisma aninda uretir.
])

const IKILI_UZANTILAR = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.svg',
  '.woff', '.woff2', '.ttf', '.otf', '.eot', '.pdf', '.zip', '.gz', '.bundle',
])

const MAKS_BAYT = 2 * 1024 * 1024

function takipEdilenDosyalar() {
  return execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
    .split('\0')
    .filter(Boolean)
}

/** Bir metni tum kaliplara karsi tarar; eslesen kalip adlarini dondurur. */
export function icerigiTara(icerik) {
  return KALIPLAR.filter((k) => k.re.test(icerik)).map((k) => k.ad)
}

function calisanDosyalariTara() {
  const bulgular = []
  for (const yol of takipEdilenDosyalar()) {
    if (MUAF_DOSYALAR.has(yol)) continue
    if (IKILI_UZANTILAR.has(extname(yol).toLowerCase())) continue

    const tamYol = resolve(root, yol)
    let bilgi
    try { bilgi = statSync(tamYol) } catch { continue }
    if (!bilgi.isFile() || bilgi.size > MAKS_BAYT) continue

    const eslesen = icerigiTara(readFileSync(tamYol, 'utf8'))
    if (eslesen.length) bulgular.push({ yol, eslesen })
  }
  return bulgular
}

function gecmisiTara() {
  const bulgular = []
  const commitler = execFileSync('git', ['rev-list', '--all'], { cwd: root, encoding: 'utf8' })
    .split('\n').filter(Boolean)

  console.log(`[secret-scan] ${commitler.length} commit taraniyor...`)
  for (const { ad, re } of KALIPLAR) {
    let cikti = ''
    try {
      // -I: ikili dosyalari atla. Eslesme yoksa git grep exit 1 doner — hata degil.
      cikti = execFileSync('git', ['grep', '-I', '-l', '-P', re.source, '--all-match', ...commitler],
        { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    } catch { /* eslesme yok */ }
    for (const satir of cikti.split('\n').filter(Boolean)) {
      const yol = satir.slice(satir.indexOf(':') + 1)
      if (MUAF_DOSYALAR.has(yol)) continue
      bulgular.push({ yol: satir, eslesen: [ad] })
    }
  }
  return bulgular
}

function main() {
  const gecmis = process.argv.includes('--gecmis')
  const bulgular = gecmis ? gecmisiTara() : calisanDosyalariTara()

  if (bulgular.length === 0) {
    console.log(`[secret-scan] temiz (${gecmis ? 'tum gecmis' : 'takip edilen dosyalar'})`)
    return 0
  }

  console.error('\n[secret-scan] SIZINTI BULUNDU — deploy durduruldu\n')
  for (const b of bulgular) console.error(`  ${b.yol}\n    -> ${b.eslesen.join(', ')}`)
  console.error(`
Ne yapmali:
  1. Dosyayi git'ten cikar:  git rm --cached <dosya>
  2. .gitignore'a ekle
  3. Deger zaten push'landiysa SIZMIS SAY: parolayi/anahtari DEGISTIR,
     gecmisi temizle (git filter-repo --invert-paths --path <dosya>)
`)
  return 1
}

// Yalnizca DOGRUDAN calistirildiginda tara. Bu koruma olmadan `icerigiTara`yi import
// eden test dosyasi da taramayi tetikliyor ve process.exit test kosucusunu oldururdu
// (testler "1 test" gorunup sessizce atlaniyordu — kontrol calisiyor sanilirdi).
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main())
}
