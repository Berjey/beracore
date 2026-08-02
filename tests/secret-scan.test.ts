/**
 * Sir tarayicinin FIILEN yakaladigini kanitlar.
 *
 * Bu testin var olma sebebi: `scripts/secret-scan.mjs` yalnizca sizinti ANINDA
 * calisir ve o an calismazsa kimse fark etmez — tam da `uretim-kimlik.tmp`
 * olayindaki gibi (2 Agu 2026, canli parola herkese acik depoya gitti).
 * Sessizce bozulan bir guvenlik kontrolu, hic olmayan bir kontrolden daha kotudur:
 * yanlis bir guven duygusu verir.
 *
 * Burada gercek dosya sistemine dokunulmaz — tarayicinin kalip motoru
 * (`icerigiTara`) dogrudan cagrilir.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { icerigiTara } from '../scripts/secret-scan.mjs'

/** Gercek sizintiya benzeyen ama GECERSIZ, uydurma degerler. */
const SIZINTILAR: [string, string][] = [
  [
    'scrypt parola hash',
    'ADMIN_PASSWORD_HASH=scrypt:0123456789abcdef0123456789abcdef:' + 'a'.repeat(128),
  ],
  ['AUTH_SECRET degeri', 'AUTH_SECRET=' + 'B'.repeat(48)],
  ['duz metin PAROLA satiri', 'PAROLA=Bera-uydurma-parola'],
  ['SMTP/IMAP parolasi', 'SMTP_PASS=gercek-gorunumlu-parola'],
  ['ozel anahtar blogu', '-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n'],
  ['AWS erisim anahtari', 'AKIAIOSFODNN7EXAMPLE'],
  ['GitHub token', 'ghp_' + 'a'.repeat(36)],
  ['Slack token', 'xoxb-1234567890-abcdefghij'],
]

for (const [ad, icerik] of SIZINTILAR) {
  test(`sir tarayici yakaliyor: ${ad}`, () => {
    const bulgular = icerigiTara(icerik)
    assert.ok(
      bulgular.length > 0,
      `"${ad}" yakalanmadi — bu kalip icin tarayici kor. Icerik: ${icerik.slice(0, 60)}`,
    )
  })
}

test('temiz icerikte yanlis pozitif uretmiyor', () => {
  // Gurultu yapan bir kapi kapatilan bir kapidir: yanlis pozitif tarayiciyi ise yaramaz kilar.
  const temiz = [
    'const parola = await istemcidenAl()',
    'SMTP_PASS=your-smtp-password-or-app-password', // .env.example sablonu
    'AUTH_SECRET=',                                  // bos sablon satiri
    'SMTP_PASS=${SMTP_PASS}',                        // degisken referansi
    'Kullanicinin parolasi scrypt ile hash lenir.',
    'password: formData.get("parola")',
  ].join('\n')
  assert.deepEqual(icerigiTara(temiz), [])
})

test('deploy.mjs push oncesi sir taramasini calistiriyor', () => {
  // Tarayicinin dogru calismasi, CAGRILMIYORSA hicbir sey ifade etmez.
  // Ayrica sira onemli: push GERI ALINAMAZ, tarama ondan once olmali.
  const deploy = readFileSync(new URL('../scripts/deploy.mjs', import.meta.url), 'utf8')
  const taramaIndex = deploy.indexOf('secret-scan.mjs')
  const pushIndex = deploy.indexOf("'push', 'origin', 'main'")

  assert.ok(taramaIndex !== -1, 'deploy.mjs sir taramasini hic cagirmiyor')
  assert.ok(pushIndex !== -1, 'deploy.mjs icindeki push komutu bulunamadi')
  assert.ok(taramaIndex < pushIndex, 'sir taramasi push SONRASINA kaymis — push geri alinamaz')
})

test('.gitignore gecici dosya kaliplarini kapsiyor', () => {
  // `uretim-kimlik.tmp` tam olarak buradaki bosluktan sizdi: `.env*` vardi, `*.tmp` yoktu.
  const gitignore = readFileSync(new URL('../.gitignore', import.meta.url), 'utf8')
  for (const kalip of ['*.tmp', '*.bak', 'uretim-kimlik*']) {
    assert.ok(
      gitignore.split('\n').some((s) => s.trim() === kalip),
      `.gitignore "${kalip}" kalibini icermiyor`,
    )
  }
})
