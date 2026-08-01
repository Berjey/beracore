#!/usr/bin/env bash
# VPS tarafında çalışır. Lokalden tetiklenir: `ssh beracore 'bash /var/www/beracore/scripts/server-deploy.sh'`
# Manuel: VPS'e gir, `bash /var/www/beracore/scripts/server-deploy.sh`
#
# TASARIM NOTU — neden bu kadar adım var:
# Eski sürüm `npm ci` + `npm run build` çalıştırıp sonra pm2'yi yeniden başlatıyordu;
# uygulama bu süre boyunca AYAKTA ve istek karşılıyordu. İki ayrı şekilde canlı hata
# üretiyordu:
#   1) `npm ci` node_modules'ü SİLİP yeniden kurar → çalışan Next.js'in tembel
#      require'ları patlar. Gerçekleşti (1 Ağu 2026 deploy'unda pm2 error log):
#      "Cannot find module './serve-static'" (next/dist/server/image-optimizer.js)
#      → görsel optimizasyonu o pencerede 500 döndü.
#   2) `next build` çıktıyı doğrudan `.next` üzerine yazar → o an sayfa isteyen
#      ziyaretçi eski manifest'teki artık var olmayan chunk'ları ister → 500.
# Çözüm: bağımlılık kurulumu YALNIZCA lockfile değiştiyse ve uygulama durdurulmuş
# haldeyken yapılır; derleme ayrı dizine yapılıp tek `mv` ile takas edilir.
set -euo pipefail

cd /var/www/beracore

echo "[deploy] fetch + reset to origin/main"
ONCEKI_LOCK=$(sha256sum package-lock.json 2>/dev/null | cut -d' ' -f1 || echo yok)
git fetch origin
git reset --hard origin/main
YENI_LOCK=$(sha256sum package-lock.json | cut -d' ' -f1)

if [ "$ONCEKI_LOCK" != "$YENI_LOCK" ] || [ ! -d node_modules ]; then
  echo "[deploy] lockfile DEGISTI -> uygulama durduruluyor (npm ci node_modules'u siler)"
  pm2 stop beracore
  npm ci --no-audit --no-fund
  echo "[deploy] bagimliliklar kuruldu -> uygulama geri aciliyor"
  pm2 start beracore --update-env
else
  echo "[deploy] lockfile ayni -> bagimlilik kurulumu atlandi (kesinti yok)"
fi

echo "[deploy] build -> .next-build (calisan .next'e dokunulmaz)"
rm -rf .next-build
NEXT_DIST_DIR=.next-build npm run build

echo "[deploy] atomik takas"
rm -rf .next-eski
[ -d .next ] && mv .next .next-eski
mv .next-build .next

echo "[deploy] pm2 restart"
pm2 restart beracore --update-env
pm2 save

# Yeni sürüm ayağa kalktı; önceki build artık gerekli değil.
rm -rf .next-eski

echo "[deploy] done at $(date -u +%FT%TZ)"
