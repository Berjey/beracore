#!/usr/bin/env node
// Platformdan bagimsiz deploy: local commit + push + VPS build/restart.
// Kullanim:
//   npm run deploy "commit mesaji"
//   npm run deploy                  # zaten commit edilmisse: sadece push + remote build
//
// deploy.sh ile ayni isi yapar; Windows'ta `bash` WSL'e gittigi icin bu surum kullanilir.

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

console.log('deploy tamam — https://beracore.com')
