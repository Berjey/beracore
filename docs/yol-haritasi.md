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

**İçerik durumu: iyi.** 50 blog yazısı, 24 alt hizmet sayfası, 24 yerel sayfa (İstanbul, Ankara, İzmir, Bursa × 6 hizmet).

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

### ✅ Adım 2 — Google Analytics 4 (28 Tem 2026 — TAMAMLANDI)
GA4 mülkü açıldı, ölçüm kimliği **`G-NX5SRKJT2M`** VPS `/var/www/beracore/.env`'e eklendi ve
build alındı. CSP `next.config.ts` içinde ID'den **otomatik** kuruluyor (nginx'e dokunulmadı):
ID varken `script-src`/`connect-src`/`img-src` GA alan adlarını içerir, ID yokken CSP tam sıkı kalır.
GA ID client bundle'a gömülü (local + canlı doğrulandı). KVKK uyumu: ziyaretçi "Kabul Et" demeden
çerez set edilmez, IP anonim.

> Kullanıcı doğrulaması: beracore.com → çerez banner'ında "Kabul Et" → GA Raporlar → Gerçek Zamanlı'da
> kendini aktif kullanıcı olarak görmeli. GA yalnızca çerezi kabul eden ziyaretçileri sayar (yasal).

### ✅ Adım 3 — Yandex Webmaster (28 Tem 2026 — TAMAMLANDI)
Site eklendi ve doğrulandı (HTML dosya yöntemi: `public/yandex_3d09533b9553da5c.html`).
Sitemap `https://beracore.com/sitemap.xml` gönderildi (işleme kuyruğunda, 1-2 hafta sürebilir).
Yandex özet paneli: "No errors or recommendations", yinelenen başlık/açıklama yok.

### ✅ Adım 4 — Bing Webmaster Tools (28 Tem 2026 — TAMAMLANDI)
GSC'den içe aktarıldı (otomatik doğrulama). Sitemap `Success`, 111 URL keşfedildi, 0 hata/uyarı.
ChatGPT/Copilot aramaları Bing dizinini kullanır. IndexNow zaten Bing'e otomatik bildirim yapıyor.
Bonus araçlar (ileride): **Site Scan** (Bing'in ücretsiz teknik SEO taraması), **Microsoft Clarity** (ısı haritası).

### 🟢 Adım 5 — Dijital varlık & otorite/backlink 👤+🛠
➡️ **Tam sistematik plan: `docs/dijital-varlik-plani.md`** — BERACORE'un yer alması gereken tüm
platformlar (arama motorları ✅, işletme profilleri, ajans dizinleri, sosyal, freelance, portfolyo,
yorum siteleri) fazlı liste + standart NAP/bio blokları + hazır profil metinleri. Adım adım işlenir.
Özet: yeni sitenin en büyük eksiği dış bağlantı; en değerlisi müşteri sitelerine "geliştirici: BERACORE"
linki + ajans dizinleri (Clutch/GoodFirms) + sosyal + Google İşletme Profili. ⛔ Toplu backlink satın alma yok.

### 🟢 Adım 6 — İçerik sürekliliği 🛠
Claude girdi beklemeden ilerletebilir:
- Diğer şehirler için yerel sayfalar (Antalya / Konya / Adana …) — `city-pages-data.ts` içindeki `cityPages` dizisine CityPage nesnesi eklemek yeterlidir; rotalar bundan otomatik türetilir (Ankara/İzmir/Bursa 28 Tem 2026'da tamamlandı)
- Yeni ticari niyetli blog yazıları (fiyat / nasıl seçilir / karşılaştırma / platform rehberi)

---

## 2.5. ÜRETİM HAZIRLIK DENETİMİ (30 Tem 2026 — TAMAMLANDI)

Gerçek Chrome'da 10 sayfa × 9 çözünürlük (320→1920px) = 90 kombinasyon test edildi.
Test araçları `scratchpad`'de tutuldu (projeye bağımlılık eklenmedi).

**Düzeltilen gerçek hatalar:**
- 🔴 **TechMarquee sonsuz rAF sızıntısı** — `waitForStop` özyinelemeli döngüsü `rafRef`'te
  izlenmiyordu; hızın söndüğü `tick` unmount'ta iptal edilince hız hiç azalmıyor ve döngü
  **sonsuza kadar** dönüyordu. Marquee'yi kaydırıp sayfa değiştiren kullanıcıda oturum boyunca
  CPU yakıyordu. Devam mantığı tek `tick` döngüsüne taşındı, iki kopya `waitForStop` silindi.
- 🔴 **768px'te navbar kesilmesi** — 9 menü öğesi + CTA `md` (768px) kırılımında sığmıyordu;
  öğeler iki satıra sarıyor, "Teklif Al" ekran dışında kalıyordu (ekran görüntüsüyle doğrulandı).
  Masaüstü menü `lg` (1024px) kırılımına taşındı; 768-1023px artık mobil menü kullanıyor.
- 🟡 **320px'te hizmet karuseli** — ok butonlarında `shrink-0` yoktu, flex onları 2px'e
  sıkıştırıyordu (tıklanamaz). `shrink-0` eklendi + canvas akışkan yapıldı
  (`min(280px,calc(100vw-160px))`) ki satır 320px'e sığsın.
- 🟡 **Temizlenmeyen timer'lar** — HeroCore (rAF + iç setTimeout), ContactPage (kopyalandı
  rozeti), ServicePage (şekil tıklama zinciri), ScrollToTop (rAF + timer) unmount'ta
  iptal edilmiyordu → sökülmüş bileşende setState. Hepsi ref'e alınıp temizlendi.
- 🟡 **WCAG 2.5.8 dokunma hedefleri: 76 → 0 ihlal** — ana sayfa ve hizmet detay nokta
  butonları 8x8px'ti (24x24 şeffaf hedef + içte görsel nokta yapısına geçildi), "Kopyala",
  KVKK butonu, footer iletişim linkleri ve 6 tek başına duran link 24px'e çıkarıldı.
  Kalan 217 kayıt metin içi satır bağlantısı — standardın açık istisnası.
- 🟢 **Ölü API yüzeyi** — `setShape(shape, color)` imzasındaki `color` her iki 3D modülde de
  hiç kullanılmıyordu (şekiller daima kurumsal palet), 4 çağrı noktasından boşuna geçiliyordu.
  Parametre kaldırıldı.
- 🟢 **İkinci doğruluk kaynağı** — `CITY_SLUGS` sabiti kod tarafından hiç okunmuyordu ama
  yol haritası "yeni şehir eklerken buraya da ekle" diyordu (yanıltıcı talimat). Sabit
  silindi; rotalar zaten `cityPages`'ten türetiliyor.

**Denetlenip temiz çıkanlar:** XSS yüzeyi (tüm `dangerouslySetInnerHTML` build-zamanı sabit
JSON-LD, `innerHTML`/`eval`/kullanıcı girdisi yansıtma yok) · güvenlik başlıkları (HSTS/CSP/
X-Frame/Referrer/Permissions) · CSP tek kaynak (`next.config.ts`, nginx'ten kaldırılmış, GA
alan adları ID varken otomatik ekleniyor) · secret yönetimi (repoda sızıntı yok, `.env`
git-dışı, istemciye sadece GA ölçüm kimliği) · API (405/400/413/422/429 doğru kodlar, hata
gövdesinde iç detay yok, honeypot + çift katman hız sınırı) · 90 kombinasyonda **sıfır JS
konsol hatası** · kullanılmayan dosya/export/CSS/asset/paket yok · tip kontrolü temiz.

**İkinci tur (aynı gün) eklenenler:**
- 🟡 **Hata sınırları eklendi** — `error.tsx` (rota seviyesi, "Yeniden Dene" + ana sayfa/iletişim
  çıkışları, `digest` referansı) ve `global-error.tsx` (kök layout patlarsa; kendi `<html>/<body>`
  ve satır içi stille çalışır). Önceden bir client bileşeni hata atarsa Next.js'in stilsiz
  İngilizce ekranı görünüyordu. `loading.tsx` eklenmedi — sayfalar SSG olduğu için anlamlı bir
  yükleme durumu yok, gezinme göstergesi Navbar'da mevcut.
- 🟢 **Cross-Origin-Opener-Policy: same-origin** — `next.config.ts` üzerinden eklendi
  (nginx'e dokunulmadı, reload riski alınmadı). Sitede OAuth/ödeme popup akışı yok.

**Ölçülen Core Web Vitals (gerçek Chrome, mobil profil 390px/DPR3):**

| Sayfa | LCP | CLS | FCP | TTFB |
|---|---|---|---|---|
| `/` | 856ms | 0 | 672ms | 246ms |
| `/blog` | 328ms | 0 | 332ms | 109ms |
| blog yazısı | 212ms | 0 | 280ms | 90ms |
| hizmet detay | 1664ms | 0 | 292ms | 109ms |
| `/iletisim` | 1764ms | 0 | 344ms | 84ms |

Eşikler: LCP <2500ms, CLS <0.1, FCP <1800ms, TTFB <800ms → **tamamı "iyi" bandında.**

**Ölçülüp bilinçli DOKUNULMAYANLAR (kanıtlanamayan kazanç / kabul edilen takas):**
- `planet.webp` 129 KB (1024×1024 3D doku) — ana sayfa transferinin en büyük tek kalemi.
  Küçültmek cazip ama düzlemin ekrandaki piksel ayak izi kamera mesafesine bağlı; görsel
  olarak güvenli olduğu **kanıtlanamadı**. Doku LCP'den sonra yükleniyor, CWV etkisi yok.
  Marka merkezindeki görseli kanıtsız riske atmak yerine öneri olarak bırakıldı.
- `/blog` RSC prefetch 95 KB — Next'in `<Link>` ön yüklemesi; gezinmeyi hızlandırıyor,
  hiçbir şeyi bloklamıyor. `prefetch={false}` bayt kazandırır ama blog gezinmesini
  yavaşlatır. Blog sayfalaması yapılırsa bu kalem kendiliğinden küçülür.
- Font ağırlığı azaltma denendi ve **ölçülüp geri alındı**: Space Grotesk'te 2 ağırlık
  kaldırmak çıktıyı hiç değiştirmedi (10 dosya / 261 KB aynı — `next/font` değişken font
  indiriyor). Faydası ölçülemeyen değişiklik bırakılmadı.

**Kapsamı olmayan başlıklar:** Proje veritabanı, auth/oturum ve ORM içermeyen bir SSG sitesi
olduğu için SQL/NoSQL injection, N+1, index, transaction, authorization ve CSRF (çerez/oturum
yok) bu mimaride karşılık bulmuyor.

**Bilinçli kabul edilen durum:** Dekoratif yörünge/parıltı öğeleri ve marquee şeridi viewport
dışına taşacak şekilde tasarlandı; `body { overflow-x: hidden }` bunları içeriyor ve
**kullanıcı hiçbir sayfada/çözünürlükte yatay kaydırma yapamıyor** (Chrome'da `scrollTo`
ile doğrulandı). Bu bir hata değil, tasarım tercihidir.

---

## 3. TEKNİK İYİLEŞTİRME ÖNERİLERİ (aciliyeti düşük)

- 🟢 **`/blog` sayfalama** — 50 yazı tek sayfada. Yazı sayısı ~60'ı geçince
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
- 50 blog yazısı (hepsinde FAQ + ilgili hizmete iç link), 24 yerel sayfa (İstanbul/Ankara/İzmir/Bursa × 6)
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
