#!/usr/bin/env bash
# IndexNow — sitemap'teki tüm URL'leri Bing + Yandex'e anında bildirir.
# Google IndexNow'ı doğrudan kullanmaz; onun için Search Console + sitemap gerekir.
#
# Kullanım:
#   bash scripts/indexnow-submit.sh            # sitemap'teki tüm URL'ler
#   bash scripts/indexnow-submit.sh <url> ...  # sadece verilen URL'ler
set -euo pipefail
cd "$(dirname "$0")/.."

HOST="beracore.com"

# Anahtar dosyası: public/<hexkey>.txt
KEY_FILE=$(ls public/*.txt 2>/dev/null | grep -E '[0-9a-f]{8,128}\.txt$' | head -1 || true)
if [[ -z "${KEY_FILE:-}" ]]; then
  echo "HATA: public/ altında IndexNow anahtar dosyası (hex.txt) bulunamadı." >&2
  exit 1
fi
KEY=$(basename "$KEY_FILE" .txt)

# URL listesi: argüman verildiyse onları, yoksa sitemap'i kullan
if [[ $# -gt 0 ]]; then
  URLS=$(printf '%s\n' "$@")
else
  URLS=$(curl -s "https://$HOST/sitemap.xml" | grep -oE '<loc>[^<]+' | sed 's/<loc>//')
fi

COUNT=$(printf '%s\n' "$URLS" | grep -c . || true)
LIST=$(printf '%s\n' "$URLS" | awk 'NF{printf "\"%s\",", $0}' | sed 's/,$//')
PAYLOAD="{\"host\":\"$HOST\",\"key\":\"$KEY\",\"keyLocation\":\"https://$HOST/$KEY.txt\",\"urlList\":[$LIST]}"

echo "[indexnow] $COUNT URL gönderiliyor (key: $KEY)"
curl -s -w "\n[indexnow] HTTP %{http_code}\n" \
  -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$PAYLOAD"
