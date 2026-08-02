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

---

## Faz 1.3a — Blog içeriği veritabanına taşındı (2 Ağustos 2026)

50 blog yazısı `src/lib/blog-data.ts` içindeki 2821 satırlık diziden çıktı,
`content_pages` tablosuna girdi ve `/admin/icerik` üzerinden düzenlenebilir hale geldi.

### Ne DEĞİŞMEDİ

Sayfalar hâlâ **statik üretiliyor**. İçerik veritabanından geliyor ama panelde
kaydetme `revalidatePath` tetikliyor → HTML yeniden üretiliyor ve ziyaretçiye yine
hazır dosya servis ediliyor. SEO açısından hiçbir şey kaybedilmedi.

**Kanıt:** taşıma öncesi ve sonrası build çıktısı karşılaştırıldı —
**51 sayfanın 51'i birebir aynı** (blog listesi + 50 yazı).

### Taşımanın yakaladığı gerçek hata: sıralama

İlk karşılaştırmada `/blog` listesinde 1624 fark çıktı; öne çıkan yazı değişmişti.
Sebep: **13 yazı aynı yayın gününü paylaşıyor** (2026-07-28) ve veritabanı sorgusu
eşitliği slug'a göre bozuyordu. Koddaki dizi ise ekleme sırasındaydı.

Çözüm: aktarım `sira` alanına koddaki ekleme sırasını yazıyor, sorgu
`ORDER BY yayin_tarihi DESC, sira` kullanıyor. Tekrar karşılaştırıldı: **0 fark.**

Bu fark, HTML denklik kontrolü olmasa sessizce yayına giderdi.

### Aktarım tek yönlüdür ve var olanı EZMEZ

`scripts/icerik-aktar.mjs` `INSERT OR IGNORE` kullanır. Kritik: aksi halde
panelden yapılan her düzenleme, bir sonraki deploy'da koddaki eski hâliyle
sessizce geri alınırdı. Script bir "senkronizasyon" değil, "eksikse tohumla" aracı.
`tests/icerik-db.test.ts` bunu kilitler (panel düzenlemesi aktarımdan sağ çıkmalı).

Kod tarafı silinmedi: `blog-data.ts` tohum **ve geri düşme** kaynağı olarak duruyor.
Tablo boşsa veya okunamıyorsa site koddaki içerikle çalışmaya devam eder.

### Gövde düzenleme: JSON değil düz metin

Gövde veritabanında `ContentBlock[]` JSON'u. Panelde ham JSON düzenletmek, tek bir
eksik virgülün yazıyı boşaltması demekti. Bunun yerine kayıpsız gidip gelen basit
bir biçim: boş satır paragrafı ayırır, `##` başlık, `###` alt başlık, `-` madde,
`>` alıntı. Satır içi biçimlendirme (kalın/link) **bilerek yok** — render katmanı
desteklemiyor, destekliyormuş gibi görünen bir editör yazarın `**kalın**` yazıp
siteye düz metin çıkmasına yol açardı.

`tests/icerik-bicim.test.ts` **50 yazının hepsi** için gidiş-dönüş denkliğini
doğrular; örnek birkaç yazı değil. Sebebi: kullanıcı bir yazıyı açıp hiçbir şey
değiştirmeden kaydettiğinde içerik bozulmamalı.

### Sürüm geçmişi — git commit'lerinin yerine

İçerik koddan çıkınca her düzenlemenin commit'i de kayboldu. Yerine
`content_versions`: her kaydetmede **önceki** hâl (meta + gövde + SSS) saklanır.
Sürüm kaydı güncellemeden ÖNCE alınır — sonra alınsaydı "önceki hâl" diye saklanan
şey yeni hâlin kopyası olurdu. Tamamı tek transaction. Silme fonksiyonu bilerek yok.

### Değişen dosyalar

**Yeni:** `src/lib/db/migrations/005_icerik.sql` · `scripts/icerik-aktar.mjs` ·
`src/lib/db/content.ts` (okuma) · `src/lib/db/content-admin.ts` (yazma) ·
`src/lib/icerik-bicim.ts` · `src/app/admin/(korumali)/icerik/page.tsx` ·
`src/app/admin/(korumali)/icerik/[id]/page.tsx` · `src/app/admin/icerik/[id]/kaydet/route.ts` ·
`tests/icerik-db.test.ts` · `tests/icerik-bicim.test.ts` · `tests/icerik-kaydet.test.ts`

**Değişen:** `src/app/blog/page.tsx` · `src/app/blog/[slug]/page.tsx` · `src/app/sitemap.ts` ·
`src/lib/related-posts.ts` (yazı listesi artık enjekte edilebilir) · `src/lib/blog-data.ts`
(`CATEGORY_META` dışa açıldı) · `src/app/admin/(korumali)/layout.tsx` ·
`scripts/server-deploy.sh` · `scripts/staging-deploy.sh` · `tests/yardim/test-db.ts`

`related-posts.ts` neden değişti: grafik modül düzeyinde tek sefer önbelleğe
alınıyordu. İçerik artık her render'da okunduğu için bu, panelden düzenlemeden
sonra ESKİ grafiği döndürürdü. Önbellek `WeakMap` ile yazı listesinin kendisine
bağlandı.

### Veritabanı değişikliği

`content_pages` (UNIQUE tip+slug+dil) · `content_faq` · `content_versions` + 5 indeks.
50 yazı + SSS kayıtları tohumlandı. Yeni env değişkeni yok.

### Kalite kapıları

`npm run lint` 0 uyarı · `npm test` **104 → 127** · `npm run build` 119 sayfa ·
`npm run seo-audit` ✅ TEMİZ · `secret-scan` temiz · HTML denkliği 51/51 birebir aynı

### Geri alma

Kod: `git revert`. Veritabanı: `content_pages` boşaltılırsa okuma katmanı koddaki
içeriğe düşer, site kırılmaz. Tek bir yazıyı geri almak için sürüm geçmişindeki
anlık görüntü kullanılır (şu an okunabiliyor; tek tıkla geri yükleme henüz yok).

### Bilinen eksikler

- **Panelden yeni yazı EKLEME ve silme yok.** Yeni içerik `blog-data.ts` üzerinden
  eklenir ve deploy'da tohumlanır. Bilinçli ara adım: slug üretimi, sitemap ve iç
  link grafiği etkileri ayrı ele alınmalı.
- **Sürüm geri yükleme tek tıkla değil** — anlık görüntü saklanıyor ve okunabiliyor,
  ama panelden "bu sürüme dön" düğmesi yok.
- `npm run seo-audit` veri katmanında hâlâ `blog-data.ts`'i denetliyor; panelden
  düzenlenen içerik yalnızca HTML katmanında denetleniyor. Panel düzenlemesi
  yaygınlaşınca veri katmanı denetimi de veritabanına bağlanmalı.
- Hizmet (6+23), şehir (24) ve hukuki (4) sayfalar hâlâ kodda → Faz 1.3b.

### Sonraki adım

**Faz 1.3b:** hizmet ve şehir sayfalarının aynı yöntemle taşınması (her adımda
öncesi/sonrası HTML denkliği).

---

## Faz 1.2b — Dürüstlük taraması: 92 hizmet istatistiği + sertifika iddiaları (2 Ağustos 2026)

Faz 1.2'de ana sayfa metrikleri kanıta bağlanmıştı ama iki soru kullanıcıya
bırakılmıştı. Kullanıcı kararı bana devretti; ikisi de kapatıldı.

### 1. Hizmet sayfalarındaki 92 sayı

23 alt hizmet sayfası dört sayı basıyordu. Toplandığında ortaya çıkan tablo:
**120+ web projesi · 80+ özel proje · 180+ tasarım projesi · 2500+ tasarım ·
60+ e-ticaret projesi · 45+ mobil uygulama · 35+ AI projesi...** — toplamı 500 proje
sınırını çoktan aşıyordu. Ana sayfa ise "25+ Tamamlanan Proje" diyordu. Aynı ziyaretçi
iki sayfayı da görebiliyordu.

Yanında duran diğer iddialar da savunulabilir değildi: `%99.9 Uptime`, `%99.95 İşlem
Başarısı`, `%35 Dönüşüm Artışı`, `3x Ortalama ROI`, `₺5M+ Yönetilen Bütçe`,
`Top 10 Google Sıralaması`. Sonuncusu ayrıca sıralama garantisi anlamına geliyordu —
sitenin KENDİ şehir sayfası SSS'inde "hiçbir dürüst SEO ajansı 1 numara garantisi
veremez" yazarken.

**Karar:** 92 istatistiğin tamamı, doğruluğu şirketin kendi çalışma biçiminden gelen
ifadelerle değiştirildi. Tasarım korundu — aynı 4'lü ızgara, aynı görsel dil, yalnızca
içerik doğru hale getirildi. Örnek: `120+ Web Projesi` → `Next.js · Modern Altyapı`,
`%99.9 Uptime` → `Responsive · Tüm Ekran Boyutları`.

Teknik standart adları (`256-bit`, `3D Secure`, `ERC-20`, `360°`) ve sözleşmeye bağlı
taahhütler (`3+ Revizyon Hakkı`) korundu: bunlar iddia değil, tanım.

### 2. Sertifika iddiaları

Kayan şeritte dört savunulamaz ifade vardı:

| İfade | Sorun |
|---|---|
| `PCI DSS Uyumlu` | **Sertifika iddiası.** PCI DSS'i ödeme sağlayıcısı taşır, entegrasyonu yapan değil |
| `ISO Standartları` | **Sertifika iddiası.** Elde böyle bir belge yok |
| `7/24 Destek` | Beş kişilik ekip için karşılığı olmayan taahhüt |
| `%99.9 Uptime` | Ölçülmeyen hizmet seviyesi sayısı |

Sertifikası olmayan bir sertifika rozetini yayınlamak, kanıtsız proje sayısından daha
ağır sorumluluk doğurur — bu yüzden ikisi de kaldırıldı.

`KVKK Uyumlu` **kaldı**: sertifika değil yasal yükümlülük, ve sitede karşılığı olan
bir uyum çalışması (KVKK sayfası, aydınlatma metni, çerez onayı) var.

### Testler

`tests/sirket-metrikleri.test.ts`'e iki test eklendi: hizmet istatistiklerinde muaf
liste dışında sayı bulunursa ve kayan şeritte kaldırılan ifadeler geri gelirse test
patlar. Bu tür içerik, gözden kaçarak geri gelmeye en açık olan türdür.

### Kalite kapıları

`npm run lint` 0 uyarı · `npm test` **127 → 129** · `npm run build` 119 sayfa ·
`npm run seo-audit` ✅ TEMİZ

### Değişen dosyalar

`src/lib/services-data.ts` (23 `stats` satırı) · `src/components/TechMarquee.tsx` ·
`tests/sirket-metrikleri.test.ts`

### Not

Ana sayfadaki `25+ proje`, `15+ müşteri`, `%97 memnuniyet` metrikleri **taslak**
durumunda kalmaya devam ediyor (sitede görünmüyor). Kanıt geldiğinde panelden
yayına alınabilir. `memnuniyet-orani` için özel not: anket yapılmadıysa bu metrik
hiç yayınlanmamalı — oran uydurulamaz.
