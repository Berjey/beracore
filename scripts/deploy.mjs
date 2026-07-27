#!/usr/bin/env node
// Platformdan bagimsiz deploy: local commit + push + VPS build/restart.
// Kullanim:
//   npm run deploy "commit mesaji"
//   npm run deploy                  # zaten commit edilmisse: sadece push + remote build
//
// Tek deploy yoludur. (Eski bash surumu kaldirildi: Windows'ta `bash` WSL'e gidiyordu
// ve IndexNow adimini icermedigi icin iki yol birbirinden ayrisiyordu.)

import { execFileSync } from 'node:child_process'
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

console.log('[local] git push origin main')
run('git', ['push', 'origin', 'main'])

console.log('[remote] server-deploy.sh çalıştırılıyor')
run('ssh', ['beracore', 'bash /var/www/beracore/scripts/server-deploy.sh'])

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
