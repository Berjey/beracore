#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   scripts/deploy.sh "commit mesajı"
#   scripts/deploy.sh                  # zaten commit edilmişse: sadece push + remote build
#
# Local + GitHub + VPS canlıyı tek komutla senkron tutar.

cd "$(dirname "$0")/.."

MSG="${1:-}"

if [[ -n "$(git status --porcelain)" ]]; then
  if [[ -z "$MSG" ]]; then
    echo "Çalışma alanında değişiklik var ama commit mesajı verilmedi."
    echo "Kullanım: scripts/deploy.sh \"commit mesajı\""
    exit 1
  fi
  echo "[local] git add + commit"
  git add -A
  git commit -m "$MSG"
fi

echo "[local] git push origin main"
git push origin main

echo "[remote] server-deploy.sh çalıştırılıyor"
ssh beracore 'bash /var/www/beracore/server-deploy.sh'

echo "[remote] pm2 status"
ssh beracore 'pm2 list'

echo "deploy tamam — https://beracore.com"
