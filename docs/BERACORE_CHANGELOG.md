# BERACORE — Değişiklik Günlüğü

Bu dosya **Business Operating System** programının kaydıdır. Program öncesi geçmiş için
`docs/yol-haritasi.md` §5.

Biçim: her giriş tarih, faz, değişiklik, gerekçe ve geri alma yöntemi taşır.

---

## [Faz 0] — 2 Ağustos 2026

Güvenli zemin. **Hiçbir kullanıcı yüzeyi değişmedi**; site ve panel aynı davranıyor.

### Güvenlik — Critical

**Sızan kimlik bilgileri kapatıldı.** `uretim-kimlik.tmp` dosyası canlı panelin düz metin
parolasını, `ADMIN_PASSWORD_HASH`'ini ve `AUTH_SECRET`'ini taşıyordu ve `e4e00a6` commit'iyle
**herkese açık** GitHub deposuna girmişti. `.gitignore` `.env*` kalıplarını kapsıyordu,
`*.tmp`'yi kapsamıyordu.

`AUTH_SECRET` de sızdığı için parola değişimi tek başına yetersizdi — o anahtarla parola
bilinmeden geçerli oturum çerezi imzalanabilirdi.

- Yeni parola + yeni `AUTH_SECRET` üretildi; hash yerelde doğrulandı (yanlış hash panele kilitlerdi)
- VPS `.env` güncellendi, `pm2 restart --update-env`
- `DELETE FROM sessions` → tüm oturumlar iptal
- Dosya `git filter-repo --invert-paths` ile **tüm geçmişten** kaldırıldı, force-push
- Doğrulama: sızan parola `303 …?hata=kimlik` · yeni parola `303 /admin` · `git log --all` boş · GitHub API 404
- **Geri alma:** `git bundle` yedeği alındı (doğrulandı). Kimlik rotasyonu geri alınmaz.

**Kalıcı önlem:** `scripts/secret-scan.mjs` — 12 sır kalıbı, `deploy.mjs` içinde **push'tan
önce** çalışır, bulguda deploy durur. Ekilmiş sahte sırla fiilen test edildi (exit 1).
`.gitignore`'a `*.tmp`, `*.bak`, `*.orig`, `uretim-kimlik*`, `kimlik-*.env`, `secrets.*` eklendi.

### Yedekleme — Critical + High

**Üretim `.env` hiçbir yedekte yoktu.** Eski script `.env.local` dosyasını yedekliyordu —
22 Nisan tarihli, yalnızca SMTP içeren eski dosya. Uygulamanın fiilen okuduğu `.env`
(SMTP parolası, `AUTH_SECRET`, `ADMIN_PASSWORD_HASH`, `DB_PATH`) yedeklenmiyordu.
Sunucu kaybedilse panel ve iletişim formu geri getirilemezdi.

**Veritabanı yedeği hiç çalışmamıştı.** Cron'a eklenmişti ama tek bir `.db.gz` üretilmemiş,
log dosyası bile oluşmamıştı. Geri yükleme hiç denenmemişti.

**Saklama kuralı hiçbir dosyayla eşleşmiyordu.** `find -name 'beracore-*.db.gz'` kalıbı
üretilen `*.tar.gz` adlarıyla eşleşmiyordu; hiçbir eski yedek silinmemişti.

- `scripts/vps-yedek.sh` (repoda versiyonlu, VPS'e kurulur) iki eski script'i birleştirdi
- Yedek **yazılmadan önce** `PRAGMA integrity_check` ile doğrulanır; bozuksa silinir ve hata verir
- Arşiv `.env`, `.env.local`, nginx conf, pm2 dump, sshd sertleştirme, `authorized_keys`, crontab içerir · `chmod 600`
- İki cron satırı tek satıra indirildi, log dosyası oluşturuldu
- **Geri yükleme fiilen test edildi:** `integrity_check: ok` · 5 tablonun satır sayısı canlıyla birebir · gerçek lead kaydı okundu
- **Geri alma:** eski script'ler `/root/yedek-script-oncesi-20260802/`

### Altyapı

**ISR önbelleği deploy'da korunuyor.** `server-deploy.sh` atomik takasta `.next/cache`'i de
siliyordu. Bugün bedeli küçük; Faz 2'de içerik veritabanına taşınınca her deploy tüm sayfaları
soğuturdu. Takas öncesi cache yeni build'e taşınıyor.

**Özellik bayrakları + denetim günlüğü** (`002_feature_flags_ve_audit.sql`):
- `feature_flags` — yarım modüller kapalı olarak canlıya alınabilir. Kayıt yoksa **kapalı** sayılır.
- `activity_log` — değiştirilemez tasarlandı: `src/lib/db/activity.ts` silme/güncelleme fonksiyonu **sunmaz**, bir test bunu kilitler.

### Test

**36 → 82 test.** Panel veri katmanının önceden sıfır testi vardı.

- `tests/yardim/test-db.ts` — geçici DB + **gerçek migration dosyaları** (kopyalanmış şema üretimden ayrışır)
- `db-leads.test.ts` (12) — lead yazma/okuma, `ref` tekilliği, kırpma, durum allowlist, not yalıtımı
- `auth-oturum.test.ts` (12) — oturum imzası, imza karıştırma, süre dolumu, anında iptal, IP kilidi
- `db-flags-activity.test.ts` (11) — bayrak varsayılanı, denetim günlüğünün silme yüzeyi sunmaması
- `secret-scan.test.ts` (11) — kalıp yakalama, yanlış pozitif, deploy'da push öncesi çağrılma

> Test yazarken gerçek bir hata yakalandı: `secret-scan.mjs` import edilince üst seviye kodu
> çalışıp `process.exit` çağırıyor, test koşucusunu öldürüyordu — testler "1 test geçti"
> görünüp **sessizce atlanıyordu**. CLI kısmı doğrudan-çalıştırma korumasına alındı.

Ayrıca: test dosyalarındaki sabit `AUTH_SECRET` literali sır tarayıcıyı tetikledi. Tarayıcıya
muafiyet eklemek test dosyasında gerçek sır saklanabilecek bir kör nokta açacağı için,
literal kaldırılıp anahtar çalışma anında üretilir yapıldı.

### Dokümantasyon

`BERACORE_ADMIN_BPDD_v0.1.md` · `BERACORE_SYSTEM_AUDIT.md` (18 bulgu) ·
`BERACORE_ADMIN_ROADMAP.md` · `BERACORE_DATA_MODEL.md` · `BERACORE_SECURITY_MODEL.md` ·
`BERACORE_AI_WORKFORCE.md` · `BERACORE_INTEGRATIONS.md` · `BERACORE_TEST_PLAN.md` ·
`BERACORE_CHANGELOG.md`

`docs/panel-crm-plani.md` yerini `BERACORE_ADMIN_ROADMAP.md`'ye bıraktı.

### Değişen dosyalar

```
yeni:   scripts/secret-scan.mjs · scripts/vps-yedek.sh
        src/lib/db/flags.ts · src/lib/db/activity.ts
        src/lib/db/migrations/002_feature_flags_ve_audit.sql
        tests/yardim/test-db.ts · tests/{db-leads,auth-oturum,db-flags-activity,secret-scan}.test.ts
        docs/BERACORE_*.md (9 dosya)
değişti: .gitignore · scripts/deploy.mjs · scripts/server-deploy.sh
silindi: uretim-kimlik.tmp (tüm geçmişten)
```

### Veritabanı

`002_feature_flags_ve_audit.sql` — `feature_flags`, `activity_log` + 3 indeks.
Idempotent, yerelde iki kez çalıştırılarak doğrulandı, üretimde uygulandı.

### Yeni ortam değişkeni

Yok. (`ADMIN_PASSWORD_HASH` ve `AUTH_SECRET` **değerleri** değişti, anahtar adları aynı.)

### Kalite kapıları

`npm run lint` 0 uyarı · `npm test` 82/82 · `npm run build` 119 sayfa · `secret-scan` temiz
Canlı: `/`, `/blog`, `/iletisim`, `/hizmetler/ai`, `/istanbul/yazilim`, `/admin/login` → 200
Senkron: `local = GitHub = VPS`

### Bilinen eksikler (Faz 0 kalan)

- Staging/preview ortamı henüz kurulmadı (A-12)
- `CLAUDE.md` ve `docs/yol-haritasi.md` yeni doküman yapısına henüz bağlanmadı

### Sonraki faz

**Faz 1 — Site tutarlılığı ve yönetilebilirlik:** merkezi şirket ayarları, kanıta bağlı
metrikler, içeriğin veritabanına taşınması, referanslar, vaka çalışmaları, hukuki versiyonlama,
SEO/erişilebilirlik düzeltmeleri.

**Kullanıcıdan gerekecek:** ticari unvan, vergi/MERSİS bilgisi, açık adres, çalışma saatleri ·
sayısal iddiaların kanıtı (25+ proje, 15+ müşteri, %97 memnuniyet) · vaka çalışmaları için
müşteri yayın izni.
