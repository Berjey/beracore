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

### Staging / ön izleme ortamı

Tek ortam production'dı. `beracore-staging` PM2 uygulaması kuruldu:
`/var/www/beracore-staging`, port 3001, **ayrı veritabanı** (`/var/www/beracore-data-staging`).
`scripts/staging-deploy.sh` herhangi bir dalı yayınlar (`DAL=ozellik/xyz`).

**Yinelenen içerik koruması çift katman.** Staging üretimin birebir kopyasıdır; aynı metnin
iki yerde bulunması üretim sayfalarının sıralamasını zayıflatabilir. `BERACORE_ORTAM=staging`
tek değişkeni hem `robots.txt`'yi `Disallow: /` yapar hem de `X-Robots-Tag: noindex, nofollow,
noarchive` başlığı ekler — robots.txt taramayı engeller ama **zaten bilinen** bir URL'in
indekslenmesini kesin durdurmaz.

**Dışarıdan erişilemez.** `127.0.0.1:3001`'e bağlanır; harici istek `000` döndü (doğrulandı).
Erişim SSH tüneli ile: `ssh -L 3001:127.0.0.1:3001 beracore`. Gerçek veri kopyası taşıyan bir
ortamın internete açık durmaması bilinçli. Staging'den müşteriye mail gitmemesi için `SMTP_TO`
kendi adresimize sabitlenir; IndexNow **çalıştırılmaz**.

Doğrulama: staging robots `Disallow: /` ✅ · `X-Robots-Tag` var ✅ · üretim ikisinden de
etkilenmedi ✅ · DB'ler ayrı (0 vs 1 kayıt) ✅ · dış port kapalı ✅ · 4 sayfa 200 ✅

**Kalan:** `staging.beracore.com` DNS A kaydı (👤 kullanıcı) → sonra nginx + TLS + basic auth.

### Dokümantasyon

`BERACORE_ADMIN_BPDD_v0.1.md` · `BERACORE_SYSTEM_AUDIT.md` (18 bulgu) ·
`BERACORE_ADMIN_ROADMAP.md` · `BERACORE_DATA_MODEL.md` · `BERACORE_SECURITY_MODEL.md` ·
`BERACORE_AI_WORKFORCE.md` · `BERACORE_INTEGRATIONS.md` · `BERACORE_TEST_PLAN.md` ·
`BERACORE_CHANGELOG.md`

`docs/panel-crm-plani.md` yerini `BERACORE_ADMIN_ROADMAP.md`'ye bıraktı.

### Değişen dosyalar

```
yeni:   scripts/secret-scan.mjs · scripts/vps-yedek.sh · scripts/staging-deploy.sh
        src/lib/db/flags.ts · src/lib/db/activity.ts · src/lib/ortam.ts
        src/lib/db/migrations/002_feature_flags_ve_audit.sql
        tests/yardim/test-db.ts · tests/{db-leads,auth-oturum,db-flags-activity,secret-scan}.test.ts
        docs/BERACORE_*.md (9 dosya)
değişti: .gitignore · scripts/deploy.mjs · scripts/server-deploy.sh
        next.config.ts · src/app/robots.ts · CLAUDE.md · docs/yol-haritasi.md
silindi: uretim-kimlik.tmp (tüm geçmişten)
```

### Veritabanı

`002_feature_flags_ve_audit.sql` — `feature_flags`, `activity_log` + 3 indeks.
Idempotent, yerelde iki kez çalıştırılarak doğrulandı, üretimde uygulandı.

### Yeni ortam değişkeni

`BERACORE_ORTAM` — yalnızca staging `.env`'inde `staging` olarak tanımlıdır. Üretimde
**tanımlanmaz**; tanımsızken tüm staging davranışları kapalıdır (varsayılan güvenli).

`ADMIN_PASSWORD_HASH` ve `AUTH_SECRET` **değerleri** değişti; anahtar adları aynı.

### Kalite kapıları

`npm run lint` 0 uyarı · `npm test` 82/82 · `npm run build` 119 sayfa · `secret-scan` temiz
Canlı: `/`, `/blog`, `/iletisim`, `/hizmetler/ai`, `/istanbul/yazilim`, `/admin/login` → 200
Senkron: `local = GitHub = VPS`

### Bilinen eksikler

- `staging.beracore.com` DNS A kaydı yok → staging'e erişim şimdilik SSH tüneliyle (👤 kullanıcı)
- Sunucu dışı yedek kopyası yok — tek VPS (Faz 9)
- Bağımlılık zafiyet taraması deploy zincirinde değil (Faz 2)

### Sonraki faz

**Faz 1 — Site tutarlılığı ve yönetilebilirlik:** merkezi şirket ayarları, kanıta bağlı
metrikler, içeriğin veritabanına taşınması, referanslar, vaka çalışmaları, hukuki versiyonlama,
SEO/erişilebilirlik düzeltmeleri.

**Kullanıcıdan gerekecek:** ticari unvan, vergi/MERSİS bilgisi, açık adres, çalışma saatleri ·
sayısal iddiaların kanıtı (25+ proje, 15+ müşteri, %97 memnuniyet) · vaka çalışmaları için
müşteri yayın izni.

---

## Faz 1.2 — Şirket metrikleri, kanıta bağlı (2 Ağustos 2026)

Bulgu **A-07** (High) ve **A-09** (Medium) kapatıldı.

### Yapılanlar

`company_metrics` tablosu (migration `004_sirket_metrikleri.sql`) her metriği ölçüm
yöntemi, veri kaynağı, kanıt bağlantısı ve son doğrulama tarihiyle birlikte tutar.

**Yayın kuralı sorguda durur, bileşende değil.** `getMetrikler()` yalnızca
`durum = 'yayinda'` satırları döner. Bir JSX dalını unutmak kuralı delmeye yetmez;
delmek için sorguyu değiştirmek gerekir. Panel de veri kaynağı boşken yayına almayı
reddeder — ve reddetme veri katmanındadır (`guncelleMetrik`), yalnızca formda değil.

**Yayında (2):** `kurulus-yili` 2024 · `uzman-ekip` 5+ — şirketin kendi hakkında
doğrudan bildiği, sitenin görünen içeriğiyle zaten tutarlı iki gerçek.

**Taslak, yani public sitede GÖRÜNMÜYOR (3):** `tamamlanan-proje` 25+ ·
`kurumsal-musteri` 15+ · `memnuniyet-orani` %97. Kanıt panele girilip durum
"yayında" yapıldığında kendiliğinden geri gelirler; kod değişikliği gerekmez.

### Taşıma sırasında bulunan üç ek çelişki

Metrikler tek kaynağa toplanınca, aynı iddianın kodda dolaşan başka kopyaları çıktı:

1. **`TechMarquee.tsx` kayan şeridi** `120+ Tamamlanan Proje` ve `50+ Kurumsal Müşteri`
   diyordu — sayaç bölümünün söylediğinin ~4 katı, **aynı sayfada**. Ziyaretçi ikisini
   yan yana görebiliyordu. Sayısal olmayan ifadelerle değiştirildi.
2. **`AboutPage.tsx` zaman çizelgesi** düz metinde "15+ kurumsal müşteri ve 25+ teslim
   edilmiş proje" tekrar ediyordu. Sayaç kartını kaldırıp bu cümleyi bırakmak iddiayı
   kaldırmak değil saklamak olurdu.
3. **`services-data.ts`** özel yazılım hizmetinde `8+ Yıl Deneyim` yazıyordu. Şirket
   2024'te kuruldu → sitenin kendi zaman çizelgesiyle ve `foundingDate` yapısal
   verisiyle doğrudan çelişki. `Agile · Çalışma Modeli` ile değiştirildi.

### A-09 — sayaçlar JS'siz gerçek değeri gösteriyor

`AboutPage.tsx` sunucu HTML'ine `0{suffix}` basıyordu: JavaScript çalışmayan ziyaretçi
ve render etmeyen bot **"0+ Tamamlanan Proje"** görüyordu. Artık gerçek değer basılır,
sıfırlama mount anında yapılır. `prefers-reduced-motion` açıkken hiç sıfırlanmaz.
(`Stats.tsx` 30 Tem'de düzeltilmişti; `AboutPage` atlanmıştı — aynı hatanın ikinci kopyası.)

### Değişen dosyalar

**Yeni:** `src/lib/db/migrations/004_sirket_metrikleri.sql` · `src/lib/metrikler.ts` (saf,
istemci güvenli) · `src/lib/db/metrics.ts` (yalnızca sunucu) · `src/components/MetrikProvider.tsx` ·
`src/app/admin/(korumali)/metrikler/page.tsx` · `src/app/admin/metrikler/kaydet/route.ts` ·
`tests/sirket-metrikleri.test.ts`

**Değişen:** `src/app/layout.tsx` · `src/components/Stats.tsx` · `src/components/AboutPage.tsx` ·
`src/components/TechMarquee.tsx` · `src/lib/services-data.ts` · `src/app/admin/(korumali)/layout.tsx`

### Veritabanı değişikliği

`company_metrics` tablosu + `idx_metrics_durum` indeksi. 5 kayıt tohumlandı
(`INSERT OR IGNORE` → idempotent, elle düzenlenmiş kaydı ezmez). Yeni env değişkeni yok.

### Kalite kapıları

`npm run lint` 0 uyarı · `npm test` **93 → 104** · `npm run build` 119 sayfa ·
`npm run seo-audit` ✅ TEMİZ · `secret-scan` temiz

Üretilen HTML doğrulandı: ana sayfa ve `/hakkimizda` yalnızca `2024` ve `5+` basıyor;
`25+`, `15+`, `%97`, `120+`, `50+` hiçbir sayfada yok.

### Geri alma

Kod: `git revert`. Veritabanı: tablo bırakılabilir (kod tabloyu bulamazsa `getMetrikler()`
boş döner ve metrik bölümü gizlenir — site kırılmaz). Metrikleri hızlıca geri getirmek
için panelden durum "yayında" yapmak yeterli; deploy gerekmez.

### Bilinen eksikler

- 23 alt hizmet sayfasındaki `SubService.stats` (92 sayı) hâlâ kodda sabit. Çoğu şirket
  geçmişi değil ürün/kabiliyet iddiası ("%99.9 Uptime", "<2s Yanıt Süresi"); ayrı bir
  sınıflandırma gerektiriyor → Faz 1.3.
- `TechMarquee.tsx` içinde **`PCI DSS Uyumlu`** ve **`ISO Standartları`** ifadeleri duruyor.
  Bunlar metrik değil sertifika iddiası; doğruysa kalmalı, değilse kaldırılmalı.
  Karar kullanıcıya ait — 👤 **teyit bekliyor.**
- Metrik **ekleme/silme** panelde yok (bilinçli): her metriğin ne ölçtüğü migration'da
  tanımlıdır. Panelden serbestçe uydurulabilseydi kanıt kuralı anlamını yitirirdi.

### Sonraki adım

**Faz 1.3 — içeriğin veritabanına taşınması:** blog (50) → hizmetler (6+23) →
şehirler (24) → hukuki (4). Her adımda öncesi/sonrası HTML denkliği doğrulanacak.
