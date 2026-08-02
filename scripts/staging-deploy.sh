#!/usr/bin/env bash
# Staging (ön izleme) ortamına herhangi bir dalı yayınlar.
#
# Kullanim (localden):
#   ssh beracore 'bash -s' < scripts/staging-deploy.sh            # main
#   echo "DAL=ozellik/xyz" | cat - scripts/staging-deploy.sh | ssh beracore 'bash -s'
#
# NEDEN VAR: 2 Agu 2026'ya kadar tek ortam production'di. Icerik veritabanina
# tasindiginda ve SEO degisiklikleri otomatiklestiginde "once bir yerde gor, sonra
# yayinla" akisi zorunlu hale geliyor. Burasi o "bir yer".
#
# URETIMDEN FARKLARI (bilincli):
#   - AYRI veritabani (/var/www/beracore-data-staging) -> uretim verisine dokunmaz
#   - BERACORE_ORTAM=staging -> robots.txt Disallow: / + X-Robots-Tag: noindex
#   - 127.0.0.1:3001'e baglanir -> disaridan dogrudan erisilemez (SSH tuneli veya nginx)
#   - IndexNow CALISTIRILMAZ (staging URL'leri arama motorlarina bildirilmemeli)
set -euo pipefail

DAL="${DAL:-main}"
DIZIN=/var/www/beracore-staging
VERI=/var/www/beracore-data-staging
PORT=3001

echo "[staging] dal: $DAL"

# ── ilk kurulum ──────────────────────────────────────────────────────────────
if [ ! -d "$DIZIN/.git" ]; then
  echo "[staging] ilk kurulum: klonlaniyor"
  git clone https://github.com/Berjey/beracore.git "$DIZIN"
fi

mkdir -p "$VERI"
chmod 700 "$VERI"

cd "$DIZIN"
git fetch origin --prune
git checkout -B "$DAL" "origin/$DAL"
git reset --hard "origin/$DAL"

# ── .env: uretimden turetilir, kritik alanlar EZILIR ─────────────────────────
# Staging kendi veritabanini kullanmali ve kendini staging olarak bilmeli.
# SMTP ayarlari kopyalanir ama gonderim hedefi degistirilmez — staging'den
# musteriye mail GITMEMELI; bu yuzden alici kendi adresimize sabitlenir.
if [ -f /var/www/beracore/.env ]; then
  grep -v -E '^(DB_PATH|BERACORE_ORTAM|SMTP_TO)=' /var/www/beracore/.env > "$DIZIN/.env"
  {
    echo "DB_PATH=$VERI/beracore.db"
    echo "BERACORE_ORTAM=staging"
    echo "SMTP_TO=info@beracore.com"
  } >> "$DIZIN/.env"
  chmod 600 "$DIZIN/.env"
else
  echo "[staging] HATA: uretim .env bulunamadi"; exit 1
fi

# ── bagimliliklar: yalnizca lockfile degistiyse ──────────────────────────────
LOCK_HASH=$(sha256sum package-lock.json | cut -d' ' -f1)
ONCEKI=$(cat .lock-hash 2>/dev/null || echo yok)
if [ "$LOCK_HASH" != "$ONCEKI" ] || [ ! -d node_modules ]; then
  echo "[staging] npm ci"
  npm ci --no-audit --no-fund
  echo "$LOCK_HASH" > .lock-hash
fi

# Migration BUILD'DEN ONCE — server-deploy.sh ile ayni gerekce: statik sayfalar
# derleme aninda `company_settings` tablosunu okuyor. Tablo yokken build kod
# varsayilanlarina duser (kirilmaz) ama panelden girilen degerler siteye yansimaz.
echo "[staging] migrationlar"
node --env-file=.env scripts/migrate.mjs

echo "[staging] icerik aktarimi"
node --env-file=.env scripts/icerik-aktar.mjs

echo "[staging] build"
npm run build

# ── pm2 ──────────────────────────────────────────────────────────────────────
if pm2 describe beracore-staging > /dev/null 2>&1; then
  pm2 restart beracore-staging --update-env
else
  # `npm start` zaten `next start -H 127.0.0.1` — yalnizca yerel arayuze baglanir.
  # DNS/nginx kurulana kadar staging'e erisim SSH tuneli gerektirir; boylece gercek
  # veriyle dolu bir kopya internete acik durmaz.
  # Port `-p` bayragi yerine PORT env'i ile verilir: `npm start -- -p` ikinci bir
  # `-H` daha eklerdi (script'te zaten var) ve komut satiri karisirdi.
  PORT=$PORT pm2 start npm --name beracore-staging -- run start
fi
pm2 save

echo "[staging] hazir — http://127.0.0.1:$PORT (SSH tuneli: ssh -L $PORT:127.0.0.1:$PORT beracore)"
echo "[staging] dal=$DAL commit=$(git rev-parse --short HEAD)"
