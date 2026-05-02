#!/usr/bin/env bash
# VPS tarafında çalışır. Lokalden tetiklenir: `ssh beracore 'bash /var/www/beracore/scripts/server-deploy.sh'`
# Manuel: VPS'e gir, `bash /var/www/beracore/scripts/server-deploy.sh`
set -euo pipefail

cd /var/www/beracore

echo "[deploy] fetch + reset to origin/main"
git fetch origin
git reset --hard origin/main

echo "[deploy] install deps"
npm ci --no-audit --no-fund

echo "[deploy] build"
npm run build

echo "[deploy] pm2 restart"
pm2 restart beracore --update-env
pm2 save

echo "[deploy] done at $(date -u +%FT%TZ)"
