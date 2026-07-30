/**
 * Sosyal paylaşım kartı üreteci — public/og-cover.png (1200×630).
 *
 * NEDEN VAR: Önceki OG görseli `beracore-bg.png` idi; 600×392 ve ŞEFFAF zeminli
 * salt logo dosyası. İki sorun: (1) Facebook/WhatsApp/LinkedIn/X'in beklediği
 * 1200×630 (1.91:1) ölçüsünün altında kaldığı için kart küçük/kırpılmış
 * gösteriliyordu; (2) şeffaf zemin platformun beyaz arkaplanına düşüyor,
 * pastel gradyanlı logo okunaksız hale geliyordu.
 *
 * TASARIM KARARI: Marka tipografisi UYDURULMAZ — kartın "BERACORE" yazısı
 * gerçek logo dosyasının kendisidir (public/beracore.png, 600×392 native).
 * 460px genişliğe KÜÇÜLTÜLEREK yerleştirilir, yani büyütme bulanıklığı yoktur.
 * Yalnızca yardımcı metinler (slogan + alan adı) sistem sans fontuyla basılır.
 *
 * ÇIKTI REPOYA COMMIT EDİLİR. Bu script tek seferlik/yeniden üretim aracıdır,
 * build zincirinin parçası değildir (VPS'te font varlığına bağımlılık olmasın).
 *
 * Yeniden üretmek için:  node scripts/make-og-image.mjs
 */

import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOGO = join(ROOT, 'public', 'beracore.png');
const OUT = join(ROOT, 'public', 'og-cover.png');

const W = 1200;
const H = 630;

// Marka paleti — globals.css ile birebir aynı.
const BG = '#1a1a1a';
const INK = '#f2f0ed';
const PINK = '#ffa9f9';
const YELLOW = '#fff7ad';

// Logo yerleşimi (native 600×392 → 460×300; oran korunur, BÜYÜTME YOK).
const LOGO_W = 460;
const LOGO_H = Math.round((LOGO_W * 392) / 600); // 300
const LOGO_X = Math.round((W - LOGO_W) / 2); // 370
const LOGO_Y = 72;

const TAGLINE = 'Markanız için unutulmaz dijital deneyimler';
const DOMAIN = 'beracore.com';

// Sistem sans yığını — kartın yardımcı metinleri için. Space Grotesk bir web
// fontu olduğu için burada yok; marka adı zaten logo görseliyle basıldığından
// tipografi tutarlılığı bozulmuyor.
const SANS = 'Segoe UI, Inter, Helvetica Neue, Arial, sans-serif';

const background = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="glowPink" cx="18%" cy="12%" r="62%">
      <stop offset="0%" stop-color="${PINK}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${PINK}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowYellow" cx="86%" cy="88%" r="58%">
      <stop offset="0%" stop-color="${YELLOW}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${YELLOW}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${PINK}" stop-opacity="0"/>
      <stop offset="45%" stop-color="${PINK}" stop-opacity="1"/>
      <stop offset="55%" stop-color="${YELLOW}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${YELLOW}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${PINK}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${PINK}" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="${YELLOW}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#glowPink)"/>
  <rect width="${W}" height="${H}" fill="url(#glowYellow)"/>

  <!-- Sitedeki bölüm ayırıcılarıyla aynı ince kenar çizgileri -->
  <rect x="0" y="0" width="${W}" height="3" fill="url(#edge)"/>
  <rect x="0" y="${H - 3}" width="${W}" height="3" fill="url(#edge)"/>

  <text x="${W / 2}" y="452" text-anchor="middle"
        font-family="${SANS}" font-size="38" font-weight="500"
        fill="${INK}" fill-opacity="0.88">${TAGLINE}</text>

  <rect x="${W / 2 - 130}" y="490" width="260" height="3" fill="url(#rule)"/>

  <text x="${W / 2}" y="552" text-anchor="middle"
        font-family="${SANS}" font-size="26" font-weight="600"
        letter-spacing="4" fill="${PINK}" fill-opacity="0.92">${DOMAIN}</text>
</svg>`;

const logo = await sharp(readFileSync(LOGO))
  .resize(LOGO_W, LOGO_H, { fit: 'inside' })
  .png()
  .toBuffer();

// PNG kayıpsız: logo kenarları keskin kalır. Ölçüldü — bu kompozisyonda PNG
// (60 KB) JPEG q92'den (71 KB) hem küçük hem kayıpsız çıkıyor, dolayısıyla
// format seçimi için koşullu mantık tutulmuyor.
const png = await sharp(Buffer.from(background))
  .composite([{ input: logo, left: LOGO_X, top: LOGO_Y }])
  // Şeffaflık YOK: platformlar alfa kanalını beyaza düşürüyor. Zemin opak.
  .flatten({ background: BG })
  .png({ compressionLevel: 9, effort: 10 })
  .toBuffer();

writeFileSync(OUT, png);
console.log(`Yazıldı: public/og-cover.png — ${(statSync(OUT).size / 1024).toFixed(0)} KB, ${W}×${H}`);
