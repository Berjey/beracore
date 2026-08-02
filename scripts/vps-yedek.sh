#!/usr/bin/env bash
# BERACORE VPS yedegi — veritabani + kurtarma icin gereken yapilandirma.
# Kaynak dosya burasidir (versiyonlu); VPS'e `/usr/local/bin/beracore-yedek.sh`
# olarak kurulur. Kurulum:
#   scp scripts/vps-yedek.sh beracore:/usr/local/bin/beracore-yedek.sh
#   ssh beracore 'chmod +x /usr/local/bin/beracore-yedek.sh'
#
# NEDEN BU DOSYA VAR (2 Agu 2026 Faz 0 denetimi):
# Onceden iki ayri cron ayni dakikada calisiyordu ve ikisi birlikte bile
# sistemi kurtarmaya YETMIYORDU:
#   1) `beracore-backup.sh` yapilandirmayi yediyordu ama `.env.local` dosyasini —
#      yani 22 Nisan tarihli, yalnizca SMTP iceren ESKI dosyayi. Uretimin fiilen
#      okudugu `/var/www/beracore/.env` (AUTH_SECRET, ADMIN_PASSWORD_HASH, DB_PATH,
#      GA ID) hicbir yedekte YOKTU. Sunucu kaybedilse panel ve iletisim formu
#      yedekten geri getirilemezdi.
#   2) `beracore-db-yedek.sh` veritabanini yediyordu ama cron'a eklendigi gun
#      henuz calismamisti; tek bir .db.gz uretilmemisti ve geri yukleme hic
#      denenmemisti. Test edilmemis yedek, yedek sayilmaz.
#
# `.backup` KULLANILIR, `cp` DEGIL: veritabani WAL modunda ve canli yaziliyor;
# dosyayi kopyalamak yazma ortasinda bozuk yedek uretebilir. `.backup` tutarli
# bir anlik goruntu alir.
set -euo pipefail

DB=/var/www/beracore-data/beracore.db
HEDEF=/var/backups/beracore
SAKLAMA_GUN=30
TARIH=$(date +%Y%m%d-%H%M)

mkdir -p "$HEDEF"

# ── 1. Veritabani ────────────────────────────────────────────────────────────
if [ -f "$DB" ]; then
  sqlite3 "$DB" ".backup '$HEDEF/db-$TARIH.db'"

  # Yedegi YAZMADAN once dogrula. Bozuk bir yedegi saklamak, yedek olmadigini
  # bilmekten daha tehlikelidir.
  SONUC=$(sqlite3 "$HEDEF/db-$TARIH.db" 'PRAGMA integrity_check;')
  if [ "$SONUC" != "ok" ]; then
    echo "[yedek] HATA: veritabani yedegi bozuk -> $SONUC"
    rm -f "$HEDEF/db-$TARIH.db"
    exit 1
  fi

  gzip -f "$HEDEF/db-$TARIH.db"
  echo "[yedek] db  -> $HEDEF/db-$TARIH.db.gz ($(stat -c%s "$HEDEF/db-$TARIH.db.gz") bayt)"
else
  echo "[yedek] UYARI: veritabani bulunamadi ($DB)"
fi

# ── 2. Yapilandirma ──────────────────────────────────────────────────────────
# Kod GitHub'da; burada yalnizca git'te OLMAYAN ve kurtarma icin sart olan seyler.
GECICI=$(mktemp -d)
trap 'rm -rf "$GECICI"' EXIT

kopyala() { [ -e "$1" ] && cp -a "$1" "$GECICI/$2" || true; }

kopyala /var/www/beracore/.env                              env-uretim
kopyala /var/www/beracore/.env.local                        env-local
kopyala /etc/nginx/sites-available/beracore.com             nginx-beracore.com
kopyala /root/.pm2/dump.pm2                                 pm2-dump.json
kopyala /etc/ssh/sshd_config.d/01-beracore-hardening.conf   sshd-hardening.conf
kopyala /root/.ssh/authorized_keys                          ssh-authorized_keys
kopyala /usr/local/bin/beracore-yedek.sh                    yedek-script.sh
crontab -l > "$GECICI/crontab.txt" 2>/dev/null || true

tar -czf "$HEDEF/config-$TARIH.tar.gz" -C "$GECICI" .
chmod 600 "$HEDEF/config-$TARIH.tar.gz"   # icinde sirlar var
echo "[yedek] cfg -> $HEDEF/config-$TARIH.tar.gz ($(tar tzf "$HEDEF/config-$TARIH.tar.gz" | grep -c . ) dosya)"

# ── 3. Saklama suresi ────────────────────────────────────────────────────────
# Eski `find -name 'beracore-*.db.gz'` kalibi uretilen `.tar.gz` adlariyla
# eslesmiyordu; hicbir eski yedek silinmiyordu. Kalip artik uretilen adlarla ayni.
find "$HEDEF" -name 'db-*.db.gz'      -mtime +$SAKLAMA_GUN -delete
find "$HEDEF" -name 'config-*.tar.gz' -mtime +$SAKLAMA_GUN -delete

echo "[yedek] tamam $(date -u +%FT%TZ) — toplam $(ls -1 "$HEDEF" | grep -c . ) dosya"
