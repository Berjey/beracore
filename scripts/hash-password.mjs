#!/usr/bin/env node
/**
 * Admin parolası için `.env`'e yazılacak scrypt hash'ini üretir.
 * Parola HİÇBİR ZAMAN düz metin saklanmaz.
 *
 * Ayırıcı `:` kullanılır, `$` DEĞİL — Next.js .env değerlerinde `$ad` dizisini
 * değişken referansı sayıp genişletir ve hash'i sessizce bozar.
 *
 * Kullanım:  node scripts/hash-password.mjs 'parolaniz'
 *
 * Not: Parolayı komut satırına yazmak kabuk geçmişine düşer. Tek kullanımlık bir
 * makinede sorun değil; kalıcı makinede sonra `history -d` ile silin.
 */
import { randomBytes, scryptSync } from 'node:crypto'

const parola = process.argv[2]
if (!parola) {
  console.error("Kullanim: node scripts/hash-password.mjs 'parolaniz'")
  process.exit(1)
}
if (parola.length < 12) {
  console.error('Parola en az 12 karakter olmali (panel tek savunma hatti).')
  process.exit(1)
}

const tuz = randomBytes(16)
const hash = scryptSync(parola.normalize('NFKC'), tuz, 64)

console.log('\n.env dosyasina ekleyin:\n')
console.log(`ADMIN_PASSWORD_HASH=scrypt:${tuz.toString('hex')}:${hash.toString('hex')}`)
console.log(`AUTH_SECRET=${randomBytes(48).toString('base64url')}`)
console.log('')
