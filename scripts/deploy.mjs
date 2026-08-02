#!/usr/bin/env node
// Platformdan bagimsiz deploy: local commit + push + VPS build/restart.
// Kullanim:
//   npm run deploy "commit mesaji"
//   npm run deploy                  # zaten commit edilmisse: sadece push + remote build
//
// Tek deploy yoludur. (Eski bash surumu kaldirildi: Windows'ta `bash` WSL'e gidiyordu
// ve IndexNow adimini icermedigi icin iki yol birbirinden ayrisiyordu.)

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function run(cmd, args) {
  execFileSync(cmd, args, { cwd: root, stdio: 'inherit' })
}

function capture(cmd, args) {
  return execFileSync(cmd, args, { cwd: root, encoding: 'utf8' })
}

const msg = process.argv[2] ?? ''

if (capture('git', ['status', '--porcelain']).trim()) {
  if (!msg) {
    console.error('Çalışma alanında değişiklik var ama commit mesajı verilmedi.')
    console.error('Kullanım: npm run deploy "commit mesajı"')
    process.exit(1)
  }
  console.log('[local] git add + commit')
  run('git', ['add', '-A'])
  run('git', ['commit', '-m', msg])
}

// Sir taramasi PUSH'TAN ONCE. Push geri alinamaz: herkese acik bir depoya giden deger
// silinse bile sizmis sayilir (klon/onbellek/dizin). 2 Agu 2026'da `uretim-kimlik.tmp`
// tam boyle sizdi. Bulgu varsa deploy burada durur.
console.log('[local] sir taramasi')
run('node', ['scripts/secret-scan.mjs'])

console.log('[local] git push origin main')
run('git', ['push', 'origin', 'main'])

// Script DOSYADAN DEĞİL, stdin'den çalıştırılır. Sebep: server-deploy.sh içindeki
// `git reset --hard` script dosyasının kendisini de günceller; bash ise script'i
// çalışırken kademeli okur. Dosyadan çalıştırılırsa, script'in kendisi değiştiği
// deploy'larda bash yarıda kalan bayt konumundan devam edip bozuk komut çalıştırabilir.
// Boru hattından okununca içerik VPS'teki dosyadan bağımsızdır ve az önce push'lanan
// sürümün ta kendisidir.
console.log('[remote] server-deploy.sh çalıştırılıyor (stdin üzerinden)')
execFileSync('ssh', ['beracore', 'bash -s'], {
  cwd: root,
  input: readFileSync(resolve(root, 'scripts/server-deploy.sh')),
  stdio: ['pipe', 'inherit', 'inherit'],
})

console.log('[remote] pm2 status')
run('ssh', ['beracore', 'pm2 list'])

// Yeni/degisen sayfalari Bing + Yandex'e bildir. Basarisiz olursa deploy'u bozmaz.
console.log('[indexnow] arama motorlarina bildiriliyor')
try {
  run('node', ['scripts/indexnow-submit.mjs'])
} catch {
  console.warn('[indexnow] atlandi (deploy etkilenmedi)')
}

console.log('deploy tamam — https://beracore.com')
