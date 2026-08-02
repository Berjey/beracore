# BERACORE — Sistem Denetimi

**Denetim tarihi:** 2 Ağustos 2026 (Faz 0)
**Kapsam:** Tüm repository, VPS yapılandırması, yedekleme, güvenlik, test kapsamı, içerik katmanı
**Yöntem:** Kod okuma + canlı sistem doğrulaması. Her bulgu kanıtlanmıştır; varsayım raporlanmamıştır.

Önem seviyeleri: `Critical` · `High` · `Medium` · `Low` · `Improvement`

---

## Özet tablo

| # | Bulgu | Önem | Durum |
|---|---|---|---|
| A-01 | Canlı panel parolası ve `AUTH_SECRET` herkese açık GitHub deposunda | **Critical** | ✅ Kapatıldı |
| A-02 | Üretim `.env` dosyası hiçbir yedekte yok | **Critical** | ✅ Kapatıldı |
| A-03 | Veritabanı yedeği hiç çalışmamış, geri yükleme hiç denenmemiş | **High** | ✅ Kapatıldı |
| A-04 | Yedek saklama kuralı hiçbir dosyayla eşleşmiyordu | Medium | ✅ Kapatıldı |
| A-05 | Panel veri katmanının sıfır testi | **High** | ✅ Kapatıldı |
| A-06 | Atomik takas ISR önbelleğini her deploy'da siliyor | Medium | ✅ Kapatıldı |
| A-07 | Ana sayfa ve hizmet sayfalarındaki sayısal iddialar kanıtsız | **High** | ✅ Faz 1.2 |
| A-08 | Şirket iletişim bilgileri 6+ dosyada kopyalı (tek kaynak yok) | Medium | 🔲 Faz 1 |
| A-09 | Animasyonlu sayaçlar JS olmadan gerçek değeri göstermiyor | Medium | ✅ Faz 1.2 |
| A-10 | Sunucu ve istemci mesaj uzunluk limitleri uyuşmuyor (4000 / 2000) | Low | 🔲 Faz 1 |
| A-11 | Hukuki metinler versiyonsuz, yürürlük tarihi izlenmiyor | Medium | 🔲 Faz 1 |
| A-12 | Staging / preview ortamı yok | **High** | ✅ Kapatıldı (DNS bekliyor) |
| A-13 | Nodemailer transporter singleton env değişiminde yenilenmiyor | Low | 🔲 Faz 3 |
| A-14 | Rate limit belleğe bağlı — ikinci süreçte çöker | Medium | 🔲 Faz 3 |
| A-15 | `CITY_CONTENT_UPDATED` elle güncelleniyor | Low | 🔲 Faz 2 |
| A-16 | Tek kullanıcı, rol/yetki ayrımı yok | **High** | 🔲 Faz 2 |
| A-17 | İç link alanları serbest metin (kırık link üretebilir) | Medium | 🔲 Faz 2 |
| A-18 | JSON-LD `sameAs` boş — sosyal profil sinyali yok | Low | 🔲 Faz 1 |

---

## Kapatılan bulgular

### A-01 — Canlı kimlik bilgileri herkese açık depoda

- **Bulgu:** `uretim-kimlik.tmp` dosyası `e4e00a6` commit'iyle depoya girmiş; içinde canlı panelin **düz metin parolası**, `ADMIN_PASSWORD_HASH` ve `AUTH_SECRET` var. Depo `github.com/Berjey/beracore` = **PUBLIC**.
- **Etkilenen alan:** Yönetim paneli kimlik doğrulaması, oturum imzalama, tüm panel verisi
- **Önem:** **Critical**
- **Mevcut durum (denetim anında):** `.gitignore` `.env` ve `.env.*` kalıplarını kapsıyordu ama `*.tmp`'yi kapsamıyordu. `AUTH_SECRET` sızdığı için parola değişimi tek başına yetersizdi — o anahtarla parola bilinmeden geçerli oturum çerezi imzalanabilirdi.
- **Uygulanan çözüm:** Yeni parola + yeni `AUTH_SECRET` üretildi (scrypt hash yerelde doğrulandı), VPS `.env` güncellendi, `DELETE FROM sessions` ile tüm oturumlar iptal edildi, dosya `git filter-repo --invert-paths` ile **tüm geçmişten** kaldırıldı, force-push yapıldı.
- **Değişiklik riski:** Yüksek — geçmiş yeniden yazıldı, force-push geri alınamaz. Öncesinde `git bundle` ile tam depo yedeği alındı (`beracore-yedek-oncesi.bundle`, doğrulandı).
- **Test yöntemi:** Sızan parolayla `POST /admin/giris` → `303 …?hata=kimlik` (ret). Yeni parolayla → `303 /admin` + çerez. `git log --all -- uretim-kimlik.tmp` boş. GitHub API `contents` → 404, `commits?path=` → `[]`.
- **Geri alma:** `git bundle` yedeğinden geri yükleme. Kimlik rotasyonu geri alınmaz (alınmamalı).
- **Kalıcı önlem:** `scripts/secret-scan.mjs` — `deploy.mjs` içinde **push'tan önce** çalışır. `.gitignore`'a `*.tmp`, `*.bak`, `*.orig`, `uretim-kimlik*`, `kimlik-*.env`, `secrets.*` eklendi.
- **Durum:** ✅ Kapatıldı

> **Not:** Değer herkese açık bir depoda bulunduğu için **sızmış sayılmalıdır**. Geçmiş temizliği hijyendir; asıl koruma rotasyondur ve yapılmıştır.

### A-02 — Üretim `.env` hiçbir yedekte yok

- **Bulgu:** `beracore-backup.sh` yapılandırmayı yedekliyordu ama `/var/www/beracore/.env.local` dosyasını — 22 Nisan tarihli, yalnızca SMTP içeren eski dosyayı. Uygulamanın fiilen okuduğu `/var/www/beracore/.env` (SMTP_PASS, `AUTH_SECRET`, `ADMIN_PASSWORD_HASH`, `DB_PATH`, GA ID) **hiçbir yedekte yoktu**.
- **Önem:** **Critical** — sunucu kaybedilse panel ve iletişim formu yedekten geri getirilemezdi.
- **Kanıt:** `tar tzvf` çıktısı `.env.local` (183 bayt, 2026-04-22) gösteriyordu; `ls -la .env*` üretimde 604 baytlık ayrı bir `.env` olduğunu doğruladı. İki dosyanın anahtar listeleri karşılaştırıldı.
- **Uygulanan çözüm:** `scripts/vps-yedek.sh` — `.env`, `.env.local`, nginx config, pm2 dump, sshd sertleştirme conf'u, `authorized_keys`, crontab ve yedek script'inin kendisini arşivler. Arşiv `chmod 600`.
- **Test yöntemi:** Yedek açıldı; `env-uretim` içinde `AUTH_SECRET` ve `ADMIN_PASSWORD_HASH` satırlarının varlığı sayıldı (her biri 1).
- **Geri alma:** Eski script'ler `/root/yedek-script-oncesi-20260802/` altında.
- **Durum:** ✅ Kapatıldı

### A-03 — DB yedeği hiç çalışmamış, geri yükleme hiç denenmemiş

- **Bulgu:** `beracore-db-yedek.sh` cron'a eklenmişti ama tek bir `.db.gz` üretmemişti; `/var/log/beracore-yedek.log` **hiç oluşmamıştı**. Geri yükleme hiçbir zaman denenmemişti.
- **Önem:** **High** — test edilmemiş yedek, yedek sayılmaz.
- **Uygulanan çözüm:** Tek script'te birleştirildi (`vps-yedek.sh`). Yedek **yazılmadan önce** `PRAGMA integrity_check` ile doğrulanır; bozuksa yedek silinir ve script hata verir. İki cron satırı tek satıra indirildi.
- **Test yöntemi (fiilen çalıştırıldı):** Yedek açıldı → `integrity_check: ok` → 5 tablonun satır sayıları canlı veritabanıyla **birebir eşleşti** → gerçek lead kaydı okundu.
- **Durum:** ✅ Kapatıldı

### A-04 — Saklama kuralı hiçbir dosyayla eşleşmiyordu

- **Bulgu:** `find -name 'beracore-*.db.gz' -mtime +30 -delete` — üretilen dosyalar `beracore-*.tar.gz` adındaydı. Kalıp hiçbir zaman eşleşmedi; **hiçbir eski yedek silinmedi** (23 Temmuz'dan itibaren birikmişti).
- **Önem:** Medium — disk sızıntısı; ayrıca "temizlik çalışıyor" yanılsaması.
- **Uygulanan çözüm:** Kalıplar üretilen adlarla aynı hale getirildi (`db-*.db.gz`, `config-*.tar.gz`).
- **Durum:** ✅ Kapatıldı

### A-05 — Panel veri katmanının sıfır testi

- **Bulgu:** 36 test yalnızca içerik/SEO verisini kapsıyordu. `src/lib/db/leads.ts`, oturum yönetimi, kaba kuvvet kilidi, `middleware.ts` ve `api/contact` **hiç test edilmiyordu**.
- **Önem:** **High** — 24 modüllük bir program bu tabanın üstüne inşa edilecek.
- **Uygulanan çözüm:** `tests/yardim/test-db.ts` (geçici DB + gerçek migration dosyaları) + 3 yeni test dosyası. **36 → 82 test.**
- **Kapsanan davranışlar:** lead yazma/okuma/kırpma, `ref` tekilliği, durum filtresinde allowlist (SQL enjeksiyonu yüzeyi), not yalıtımı; oturum imzası, imza karıştırma, süre dolumu, anında iptal, ham kimliğin DB'de düz saklanmaması; IP kilidi eşiği/penceresi/IP yalıtımı; bayrak varsayılanının kapalı olması; denetim günlüğünün silme yüzeyi sunmaması.
- **Durum:** ✅ Kapatıldı

### A-06 — Atomik takas ISR önbelleğini siliyor

- **Bulgu:** `server-deploy.sh` `mv .next .next-eski` yapıyor; `.next/cache` de gidiyor.
- **Önem:** Medium bugün, **High Faz 2'den sonra** — içerik veritabanına taşınıp sayfalar on-demand üretilmeye başlayınca her deploy tüm sayfaları soğuturdu.
- **Uygulanan çözüm:** Takas öncesi `.next-eski/cache` yeni build'e taşınır (build kendi cache'ini yazmışsa üzerine yazılmaz).
- **Durum:** ✅ Kapatıldı

---

## Açık bulgular

### A-07 — Sayısal iddialar kanıtsız · **High** · ✅ Faz 1.2'de kapatıldı (2 Ağu 2026)

- **Bulgu:** `Stats.tsx` ve `AboutPage.tsx` içinde kopyalı `STATS` dizileri: 25+ proje, 15+ müşteri, %97 memnuniyet, 2024, 5+ ekip. Ayrıca üç yerde daha aynı iddianın farklı kopyaları:
  - `TechMarquee.tsx` kayan şeridi **120+ Tamamlanan Proje** ve **50+ Kurumsal Müşteri** diyordu — sayaç bölümünün söylediğinin (25+/15+) yaklaşık 4 katı, üstelik aynı sayfada.
  - `AboutPage.tsx` zaman çizelgesi düz metinde "15+ kurumsal müşteri ve 25+ teslim edilmiş proje" tekrar ediyordu.
  - `services-data.ts` özel yazılım hizmetinde **8+ Yıl Deneyim** yazıyordu; şirket 2024'te kuruldu → sitenin kendi zaman çizelgesiyle ve `foundingDate` yapısal verisiyle doğrudan çelişki.
- **Etki:** Doğrulanamayan iddia, ticari güvenilirlik ve reklam mevzuatı uyum riski. Çelişkili sayılar ayrıca ziyaretçi tarafından yan yana görülebiliyordu.
- **Uygulanan çözüm:** `company_metrics` tablosu (migration `004`) her metriği ölçüm yöntemi, veri kaynağı, kanıt bağlantısı ve son doğrulama tarihiyle tutar. **Filtre SORGUDA:** `getMetrikler()` yalnızca `durum = 'yayinda'` satırları döner; bir bileşenin kuralı unutması mümkün değil. Panel (`/admin/metrikler`) veri kaynağı boşken yayına almayı reddeder; reddetme veri katmanındadır, formda değil.
- **Yayına alınanlar:** `kurulus-yili` (2024) ve `uzman-ekip` (5+) — şirketin kendi hakkında doğrudan bildiği, sitenin görünen içeriğiyle zaten tutarlı iki gerçek.
- **Taslağa düşenler (public sitede GÖRÜNMÜYOR):** `tamamlanan-proje`, `kurumsal-musteri`, `memnuniyet-orani`. Kanıt panele girilip durum "yayında" yapıldığında kendiliğinden geri gelirler.
- **Kalan iş (Faz 1.3):** 23 alt hizmet sayfasındaki `SubService.stats` (92 sayı) hâlâ kodda sabit. Bunların çoğu şirket geçmişi değil ürün/kabiliyet iddiası ("%99.9 Uptime", "<2s Yanıt Süresi"); ayrı bir sınıflandırma gerektiriyor. Doğrudan çelişki üreten tek kayıt ("8+ Yıl Deneyim") şimdi düzeltildi.
- **Kullanıcıdan beklenen:** proje/müşteri sayısının dayandığı kayıt; memnuniyet oranı için anket yapıldıysa sonuçları.

### A-08 — İletişim bilgisi tek kaynakta değil · Medium · Faz 1

- **Bulgu:** Telefon, e-posta ve adres en az 6 yerde kopyalı: `ContactPage.tsx` (`METHODS`, satır 27), `WhatsAppCta.tsx` (`PHONE`/`MESSAGE`, satır 8-9), `Footer.tsx`, `layout.tsx` JSON-LD, `docs/dijital-varlik-plani.md`, blog içerikleri.
- **Etki:** Numara değişince bir yerde eski kalması kaçınılmaz; NAP tutarsızlığı yerel SEO'yu doğrudan zayıflatır.
- **Önerilen çözüm:** `CompanySettings` — tek kaynak; tüm bileşenler oradan okur.

### A-09 — Sayaçlar JS olmadan gerçek değeri göstermiyor · Medium · ✅ Faz 1.2'de kapatıldı (2 Ağu 2026)

- **Bulgu:** `AboutPage.tsx` sunucu HTML'ine `0{suffix}` basıyordu → JavaScript çalışmayan ziyaretçi ve render etmeyen bot "0+ Tamamlanan Proje" görüyordu. (`Stats.tsx` 30 Tem'de düzeltilmişti; `AboutPage` atlanmıştı.)
- **Etki:** Erişilebilirlik + arama motorunun değeri okuyamaması.
- **Uygulanan çözüm:** SSR'da gerçek değer basılır; sıfırlama `useEffect` içinde, mount anında yapılır. Bölüm ilk ekranın altında olduğu için kullanıcı sıfırlamayı görmez. `prefers-reduced-motion` açıkken hiç sıfırlanmaz — o kullanıcı animasyon değil doğru sayıyı görür.

### A-10 — Mesaj uzunluk limitleri uyuşmuyor · Low · Faz 1

- **Bulgu:** `api/contact/route.ts` `LIMITS.message = 4000`, `ContactPage.tsx` `maxLength = 2000`. Koddaki yorum "AYNI olmalı" diyor.
- **Etki:** Bugün zararsız (istemci daha katı). Ters çevrilirse sessiz veri kaybı olur.
- **Önerilen çözüm:** Tek sabitten türet; testle kilitle.

### A-11 — Hukuki metinler versiyonsuz · Medium · Faz 1

- **Bulgu:** Gizlilik, Çerez ve Kullanım Koşulları metinleri ilgili `page.tsx` içinde `const sections`; KVKK `src/lib/kvkk-data.ts`. Versiyon numarası, yürürlük tarihi, onaylayan ve revizyon geçmişi yok.
- **Önerilen çözüm:** `LegalDocument` + `LegalDocumentVersion`. `kvkk-data.ts` bu çıkarımın hazır örneğidir.
- **Sınır:** AI taslak hazırlayabilir; "hukuken uygundur" kararı veremez.

### A-12 — Staging / preview ortamı yok · **High** · ✅ Kapatıldı (kısmi)

- **Bulgu:** Tek ortam production. Spec "branch → test → preview → onay → merge → deploy → rollback" akışı istiyor.
- **Uygulanan çözüm:** `beracore-staging` PM2 uygulaması, `/var/www/beracore-staging`, port 3001, **ayrı veritabanı** (`/var/www/beracore-data-staging`). `scripts/staging-deploy.sh` herhangi bir dalı yayınlar (`DAL=ozellik/xyz`).
- **Yinelenen içerik koruması — çift katman:** `BERACORE_ORTAM=staging` tek değişkeni hem `robots.txt`'yi `Disallow: /` yapar hem de her yanıta `X-Robots-Tag: noindex, nofollow, noarchive` ekler. İkisi birden bilinçli: robots.txt taramayı engeller ama **zaten bilinen** bir URL'in indekslenmesini kesin durdurmaz.
- **Erişim:** `127.0.0.1:3001` — dışarıdan erişilemez (doğrulandı: harici istek `000`). Erişim SSH tüneli ile: `ssh -L 3001:127.0.0.1:3001 beracore`. Gerçek veri kopyası taşıyan bir ortamın internete açık durmaması bilinçli.
- **Test yöntemi (fiilen çalıştırıldı):** staging `robots.txt` = `Disallow: /` ✅ · `X-Robots-Tag` mevcut ✅ · üretim ikisinden de etkilenmedi ✅ · DB'ler ayrı (0 vs 1 kayıt) ✅ · dış port kapalı ✅ · 4 sayfa 200 ✅
- **Kalan:** Alt alan adı + TLS için `staging.beracore.com` DNS A kaydı gerekiyor (👤 kullanıcı). O zamana kadar SSH tüneli yeterli.
- **Durum:** ✅ Kapatıldı (DNS bekliyor)

### A-13 — SMTP transporter singleton'ı env değişimini görmüyor · Low · Faz 3
`api/contact/route.ts` transporter'ı modül seviyesinde bir kez kurar. `.env` değişip `pm2 restart` yapılmazsa eski ayar kullanılır. Faz 3'te `src/lib/mail/smtp.ts`'e çıkarılırken yapılandırma imzası değişince yeniden kurulmalı.

### A-14 — Rate limit bellekte · Medium · Faz 3
`hits` bir `Map`; tek PM2 fork süreci varsayıyor. Faz 3'te işçi süreç eklenince ikinci süreç kendi sayacını tutar ve limit fiilen ikiye katlanır. Sayaç DB'ye veya paylaşımlı bir kaynağa taşınmalı. (nginx `5r/m` ikinci katman olarak duruyor.)

### A-15 — `CITY_CONTENT_UPDATED` elle güncelleniyor · Low · Faz 2
24 şehir sayfasının tamamı tek bir elle yazılan tarihi paylaşıyor; sitemap `lastmod` buradan besleniyor. İçerik DB'ye taşınınca sayfa başına gerçek `updated_at` kullanılmalı.

### A-16 — Rol ve yetki ayrımı yok · **High** · Faz 2
Tek admin; kimlik `.env`'de. Spec 17 rol ve modül×işlem yetki matrisi istiyor. Mevcut scrypt + HMAC + DB oturum altyapısı korunup üstüne `users`/`roles`/`permissions` kurulacak.

### A-17 — İç link alanları serbest metin · Medium · Faz 2
`BlogPost.relatedService.href`, `CityPage.serviceHref`, `CityPage.blogHref` doğrulanmayan string. Bugün `tests/data-integrity.test.ts` kırık linki yakalıyor; içerik DB'ye taşınınca bu koruma kaybolur. Editörde seçici (picker) + kayıt anında doğrulama gerekir.

### A-18 — JSON-LD `sameAs` boş · Low · Faz 1
`src/app/layout.tsx` `socialProfiles` dizisi boş; Organization şemasında `sameAs` üretilmiyor. Sosyal profiller açıldığında `CompanySettings` üzerinden doldurulmalı.

---

## Denetlenip temiz çıkanlar

- **Deploy zinciri:** kesintisiz (ayrı build dizini + atomik takas), script stdin'den çalıştırılıyor, migration build sonrası/restart öncesi, IndexNow hatası deploy'u bozmuyor.
- **Migration runner:** sürümlü, idempotent, her dosya tek transaction, hata → exit 1. İki kez çalıştırılarak doğrulandı.
- **Veritabanı konumu:** repo dışında (`/var/www/beracore-data/`), `git reset --hard` erişemiyor. WAL + `foreign_keys=ON` + `busy_timeout`.
- **İletişim API'si:** origin kontrolü, honeypot, tip zorlaması, uzunluk sınırları, HTML escape, CRLF başlık enjeksiyonu koruması, **lead kaydı SMTP'den önce** (mail çökse bile talep kaybolmuyor).
- **Rate limit IP çözümü:** `x-real-ip` → XFF'in **son** değeri; sahte XFF ile atlatılamıyor.
- **Oturum güvenliği:** çerez HMAC imzalı, DB'de yalnızca SHA-256 özeti, iptal anında etkili, edge middleware + sunucu katmanı çift kontrol.
- **CSP:** tek kaynak (`next.config.ts`), GA alan adları yalnızca ID varken ekleniyor.
- **SSH:** anahtar tabanlı, parola girişi kapalı, fail2ban aktif, 3 yetkili anahtar.
- **Node sürümü:** VPS ve local aynı hatta (24.18.x / npm 11.16.0).
- **İçerik bütünlüğü:** 111 URL 200, kırık iç link 0, yetim sayfa 0, yinelenen başlık/açıklama yok.

---

## Kapsam dışı bırakılanlar (gerekçeli)

- **`planet.webp` (129 KB) küçültme:** ekrandaki piksel ayak izi kamera mesafesine bağlı; görsel olarak güvenli olduğu kanıtlanamadı. LCP'den sonra yükleniyor, Core Web Vitals etkisi yok.
- **`/blog` sayfalama:** asıl şişkinlik (507→220 KB) çözüldü; sayfa istemci taraflı arama yapıyor, sayfalama bu özelliği bozar. Yazı sayısı ~60'ı geçerse yeniden değerlendirilir.
- **CSP'den `'unsafe-inline'` kaldırma:** nonce gerektirir, sayfaları statik olmaktan çıkarır.
- **Bileşen (JSX) render testi:** Node tip soyma JSX dönüştürmez; jsdom + derleyici gerektirir. Ayrı bir iş kalemi.
