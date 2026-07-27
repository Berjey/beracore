# BERACORE — Yol Haritası ve Durum

**Tek kaynak dosya.** Sitenin mevcut durumu, yapılacaklar ve nasıl yapılacağı burada.
Git ile taşınır — hangi bilgisayarda olursan ol aynı listeyi görürsün.

**Son denetim:** 27 Temmuz 2026 (tam site denetimi: 84 sayfa tarandı, 0 SEO hatası)

Notasyon: 🔴 kritik · 🟡 önemli · 🟢 iyileştirme · 👤 sen yapmalısın · 🛠 Claude yapar

---

## 1. ŞU AN NE DURUMDAYIZ

**Teknik durum: sağlam.** 27 Temmuz denetiminde 84 sayfanın tamamı tarandı:
title/description/canonical/OG/schema/H1/alt eksiksiz, kırık link yok, yetim sayfa yok,
http→https ve www→apex yönlendirmeleri çalışıyor, güvenlik başlıkları tam, gzip açık.

**İçerik durumu: iyi.** 41 blog yazısı, 24 alt hizmet sayfası, 6 İstanbul yerel sayfası.

**Asıl darboğaz: görünürlük.** Site yeni, otoritesi yok. Ana kelimelerde rakiplerin
domain yaşı 15 yıla varıyor. Kısa vadede kazanılacak yer uzun kuyruk sorgular.
Gerçekçi takvim: **4-6 ayda düzenli organik trafik.**

---

## 2. SIRADAKİ ADIMLAR (öncelik sırasıyla)

### 🔴 Adım 1 — Search Console indeksleme kontrolü 👤
**Neden ilk sırada:** İndekslenmeyen sayfa hiç yazılmamış sayılır. Diğer her şey buna bağlı.

1. https://search.google.com/search-console → soldan **Dizine ekleme > Sayfalar**
2. İki sayıyı not al: kaç sayfa **"Dizine eklendi"**, kaç sayfa **"Dizine eklenmedi"**
3. Eklenmeyenlerin sebep listesine bak (en sık: "Taranmadı", "Keşfedildi - dizine eklenmedi")
4. Bu iki sayıyı Claude'a söyle → sorun varsa teşhis edilip düzeltilecek

> Not: 27 Temmuz'da navigasyondaki büyük bir tarama hatası düzeltildi (aşağıya bak).
> Bu düzeltmenin etkisinin Search Console'a yansıması birkaç hafta sürebilir.

### 🟡 Adım 2 — Google Analytics 4 👤 + 🛠
**Kod tarafı HAZIR.** `CookieConsent.tsx` içinde KVKK uyumlu GA entegrasyonu duruyor:
ID yoksa hiç yüklenmiyor, varsa kullanıcı "Kabul Et" demeden çerez set edilmiyor.

Senin yapman gerekenler:
1. Mülkü iş hesabına devret: Analytics → **Yönetici → Hesap erişim yönetimi → +** →
   iş e-postan, rol **Yönetici**. Doğrula, sonra eski hesabı çıkar.
2. **Yönetici → Veri akışları → web akışı** → `G-` ile başlayan **Ölçüm Kimliği**ni al ve ver.

Claude'un yapacakları (ID gelince):
- VPS'teki `/var/www/beracore/.env` dosyasına `NEXT_PUBLIC_GA_ID=G-XXXXXXX` eklenecek
  ⚠️ `NEXT_PUBLIC_*` **build zamanında** okunur; VPS'te build alındığı için değişken
  build'den ÖNCE `.env` içinde olmalı.
- ⚠️ **CSP güncellenmeli** — şu anki politika GA'yı engeller. Nginx
  `sites-available/beracore.com` içinde:
  - `script-src` → `https://www.googletagmanager.com` eklenecek
  - `connect-src` → `https://www.google-analytics.com https://*.analytics.google.com` eklenecek
  - `img-src` → `https://www.google-analytics.com` eklenecek
  - Sonra `nginx -t` && `systemctl reload nginx`
  Bu adım atlanırsa GA sessizce çalışmaz.

### 🟢 Adım 3 — Yandex Webmaster 👤 + 🛠
1. https://webmaster.yandex.com → site ekle → doğrulama **meta etiketini** al ve ver
2. Claude `src/app/layout.tsx` içindeki `verification` alanına ekleyip deploy eder
3. Sitemap gönder: `https://beracore.com/sitemap.xml`

### 🟢 Adım 4 — Bing Webmaster Tools 👤
https://www.bing.com/webmasters → site ekle → **"Google Search Console'dan içe aktar"**
(tek tıkla doğrulama + sitemap). ChatGPT/Copilot aramaları Bing dizinini kullanır.
IndexNow zaten kurulu olduğu için yeni sayfalar otomatik bildiriliyor.

### 🟢 Adım 5 — Otorite / backlink 👤
Yeni sitenin en büyük eksiği dış bağlantı. Ücretsiz olanlar:
- LinkedIn şirket sayfası + blog yazılarını linkiyle paylaşmak
- Instagram / X profillerinde site linki
- Ücretsiz sektörel dizinler
- **En değerlisi:** iş yaptığın müşterilerden sitelerine "geliştirici: BERACORE" linki
- ⛔ Toplu backlink satın alma — kısa vadede işe yarar görünür, cezayla biter

### 🟢 Adım 6 — İçerik sürekliliği 🛠
Claude girdi beklemeden ilerletebilir:
- Diğer şehirler için yerel sayfalar (Ankara / İzmir / Bursa) — `city-pages-data.ts` çoğaltılır
- Yeni ticari niyetli blog yazıları (fiyat / nasıl seçilir / karşılaştırma / platform rehberi)

---

## 3. TEKNİK İYİLEŞTİRME ÖNERİLERİ (aciliyeti düşük)

- 🟢 **`/blog` sayfalama** — 41 yazı tek sayfada, HTML 428 KB. Yazı sayısı ~60'ı geçince
  sayfalama veya kategori bazlı bölme gerekir.
- 🟢 **Yeni yazıların iç link derinliği** — en yeni yazılar yalnızca `/blog` listesinden
  link alıyor; "ilgili yazılar" seçimi eskiler lehine çalışıyor. Seçim mantığı
  iyileştirilebilir.
- 🟢 **Görsel ağırlığı** — `beracore-bg.png` 129 KB, `beracore.png` 112 KB. WebP/AVIF'e
  çevrilirse ilk yükleme hafifler.
- 🟢 **ESLint** — projede kurulu değil (`lint` script'i kaldırıldı, `next lint` Next 15'te
  yok). İstenirse devDependency + `eslint.config.mjs` ile ayrı bir iş olarak kurulur.
  Şu anki kalite kapısı `npm run build` (tip kontrolü yapar).
- 🟢 **Core Web Vitals** 👤 — kesin skor için https://pagespeed.web.dev üzerinden canlı ölçüm.

---

## 4. KAPSAM DIŞI (bilinçli kararlar)

- **Google Business Profile** — kullanıcı şimdilik açmamayı seçti. Not: ücretsiz ve
  yerel aramada en hızlı dönüş getiren kanal. Fikir değişirse ilk sıraya alınmalı.
- **Ücretli reklam (Google Ads)** — bütçe gerektirdiği için kapsam dışı.
- **Portfolyo / vaka çalışması sayfası** — 27 Tem 2026'da kuruldu, kullanıcı gösterilecek
  yeterli proje olmadığı için beğenmedi ve kaldırıldı. Kod git geçmişinde:
  `420e937` eklendi, `01e062c` kaldırıldı. **Kullanıcı açıkça istemeden yeniden kurulmamalı.**

---

## 5. TAMAMLANANLAR

**Altyapı & teknik**
- Tek komutla deploy (`npm run deploy`), local + GitHub + canlı her zaman aynı commit'te
- IndexNow her deploy'da otomatik (Bing + Yandex bildirimi)
- İletişim formu çalışıyor (Hostinger SMTP, VPS `.env`)
- Güvenlik başlıkları (CSP/HSTS/X-Frame-Options/...), gzip+brotli, statik cache
- Form hız sınırı: nginx (`5r/m`) + uygulama katmanı (10 dk'da 5) çift koruma
- pm2 reboot'ta otomatik kalkıyor, SSL otomatik yenileniyor

**SEO**
- 84 URL sitemap, robots.txt, canonical, OG/Twitter, Google doğrulama
- Şemalar: ProfessionalService, WebSite, Service, BlogPosting, FAQPage, BreadcrumbList
- 41 blog yazısı (hepsinde FAQ + ilgili hizmete iç link), 6 İstanbul yerel sayfası
- **27 Tem 2026 — kritik düzeltme:** Navigasyon `<button onClick>` kullanıyordu; Googlebot
  bunları takip etmez. 49 sayfa (blog + İstanbul + hakkımızda) hiç iç link almıyordu.
  Gerçek `<a href>` linklere çevrildi → taranabilir sayfa 44'ten 92'ye çıktı, yetim sayfa sıfırlandı.
- Hizmet sayfalarından İstanbul sayfalarına bağlamsal iç link eklendi

**Kalite**
- Erişilebilirlik: WCAG AA kontrast (en düşük 4.87:1), klavye odağı, tek H1, ARIA, reduced-motion
- Safari uyumu: `backdrop-filter` için `-webkit-` öneki
- 404 doğru HTTP kodu döndürüyor
- Ölü kod / kullanılmayan bağımlılık / orphan dosya yok

---

## 6. HER OTURUMDA NASIL DEVAM EDİLİR

Hangi bilgisayarda olursan ol:

1. Proje klasörünü aç
2. `git pull`
3. Claude'a "kaldığımız yerden devam" de

Claude `CLAUDE.md` ve bu dosyayı okuyup nerede kalındığını görür.
Deploy her zaman tek komut: `npm run deploy "commit mesajı"`

**Yeni bilgisayarda ilk kurulum:** `ssh -o BatchMode=yes beracore "hostname"` çalışıyorsa hazırsın.
Çalışmıyorsa SSH anahtarı sunucuya eklenmeli — adımlar `CLAUDE.md` içinde.
