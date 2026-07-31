# BERACORE — Yol Haritası ve Durum

**Tek kaynak dosya.** Sitenin mevcut durumu, yapılacaklar ve nasıl yapılacağı burada.
Git ile taşınır — hangi bilgisayarda olursan ol aynı listeyi görürsün.

**Son denetim:** 30 Temmuz 2026 (üretime hazırlık + A serisi kod işleri — hepsi canlıda)

Notasyon: 🔴 kritik · 🟡 önemli · 🟢 iyileştirme · 👤 sen yapmalısın · 🛠 Claude yapar

---

## 0. YENİ OTURUMA BAŞLARKEN — 30 SANİYELİK ÖZET

**Kod tarafı bitti.** 30 Tem 2026'da iki tur denetim + A serisi tamamlandı ve canlıya alındı
(son commit `4095eb3`). Local + GitHub + canlı aynı commit'te. Kalite kapıları: `npm run lint`
(0/0) · `npm test` (25/25) · `npm run build` (119 sayfa) · `npm run seo-audit` (✅ temiz).

**Sıradaki iş kodda DEĞİL.** Kalan üç blok, önem sırasıyla:

| # | Ne | Kim | Nerede anlatılıyor |
|---|----|-----|--------------------|
| 1 | Search Console indeks sayısını oku, Claude'a söyle | 👤 sen | §2 Adım 1 |
| 2 | **Node 20 → 24 yükseltme kararı** (VPS'in Node'u destek dışı) | 👤 karar senin | §2 Adım 1.5 |
| 3 | Sosyal/dizin profilleri aç (LinkedIn, Instagram, X, Clutch…) | 👤 sen | `docs/dijital-varlik-plani.md` |

Bunlardan sonra 🛠 Claude'un sırada bekleyen büyük işi: **Admin Panel + CRM Faz A**
(`docs/panel-crm-plani.md`) — şu an gelen form talepleri hiçbir yere kaydedilmiyor.

---

## 1. ŞU AN NE DURUMDAYIZ

**Teknik durum: sağlam ve doğrulanmış.** 27 Tem denetiminde 84 sayfa tarandı (0 SEO hatası);
30 Tem'de üretime hazırlık turu + A serisi yapıldı. Güvenlik başlıkları tam, hata sınırları var,
ölçülen Core Web Vitals'ın tamamı "iyi" bandında, bundle'lar %30-40 küçültüldü.

**İçerik durumu: iyi.** 50 blog yazısı, 23 alt hizmet sayfası, 24 yerel sayfa (İstanbul, Ankara, İzmir, Bursa × 6 hizmet).

**Asıl darboğaz: görünürlük.** Site yeni, otoritesi yok. Ana kelimelerde rakiplerin
domain yaşı 15 yıla varıyor. Kısa vadede kazanılacak yer uzun kuyruk sorgular.
Gerçekçi takvim: **4-6 ayda düzenli organik trafik.**

**Bilinen, kabul edilmiş açıklar:** CSP'de `script-src 'unsafe-inline'` (kaldırmak sayfaları
statik olmaktan çıkarır) · 4 sayfa tipinde gsap duruyor · şehir sayfaları 246-302 kelime
(içerik fazı işi) · bileşen (JSX) render testi yok · Lighthouse skoru henüz ölçülmedi (👤).

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

### 🔴 Adım 1.5 — VPS Node sürümü: KARAR SENİN 👤
**Durum:** VPS Node **20.20.2** / npm 10.8.2 çalıştırıyor. Node 20'nin destek ömrü
**Nisan 2026'da doldu** → üretim sunucusu artık güvenlik yaması almıyor.

**İki somut sorun yaratıyor:**
1. **Güvenlik:** Yamalanmayan bir çalışma zamanı.
2. **Deploy sürtünmesi:** Local'de npm 11 var, VPS'te npm 10. npm 11 `sharp`'ın WASM alt
   bağımlılıklarını lockfile'a yazmıyor, VPS'te `npm ci` EUSAGE ile patlıyor (30 Tem'de bir
   deploy'u yarıda kesti). Şu anki çözüm elle: bağımlılık değişince deploy'dan önce
   `npx -y npm@10.8.2 install --package-lock-only` çalıştırmak (ayrıntı `CLAUDE.md`).

**Node 24'e yükseltmek ikisini de bitirir.** Ama üretim çalışma zamanını değiştirdiği ve
geri alması zahmetli olduğu için **Claude bunu sormadan yapmaz.** "Yükselt" dersen yapılır
(önce pm2 dump + build doğrulaması, sonra nvm ile geçiş, sonra deploy testi).

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

## 2.6. A SERİSİ — KOD TARAFI KALAN İŞLER (30 Tem 2026 — TAMAMLANDI)

Yol haritasındaki "teknik iyileştirme önerileri" listesi işlendi. Her madde ölçümle doğrulandı.

**A1 — OG görseli** ✅ Önceki OG görseli `beracore-bg.png` idi: **600×392 ve şeffaf zeminli
salt logo**. İki kusur birden — platformların beklediği 1200×630 (1.91:1) ölçüsünün altında
(kart küçük/kırpık) ve şeffaf zemin platformun beyazına düşünce pastel logo okunaksız.
Yerine gerçek bir sosyal kart üretildi: `public/og-cover.png`, 1200×630, opak marka zemini,
logo + slogan + alan adı, 58 KB. Üreteç `scripts/make-og-image.mjs` (`npm run og-image`).
Marka tipografisi uydurulmadı — karttaki "BERACORE" gerçek logo dosyasıdır (600×392 native,
460px'e küçültülür → büyütme bulanıklığı yok). Eski dosya silindi.

**A2 — Görsel ağırlığı** ✅ Ölçüldü ve yalnızca kanıtlanan kazanç uygulandı:
`beracore.png` 112→102 KB, `icon-512.png` 21.8→17.6 KB, `icon-192.png` 6.5→6.0 KB —
üçü de **bit-birebir kayıpsız** (piksel karşılaştırmasıyla doğrulandı, eşitlik sağlanmadan
dosya yazılmıyor). `beracore-bg.png` (129 KB) tamamen kaldırıldı.
WebP'ye çevirme YAPILMADI, gerekçesi ölçüldü: logolar `next/image` üzerinden gittiği için
kullanıcıya zaten optimize WebP/AVIF sunuluyor; kaynak PNG'nin boyutu kullanıcıyı etkilemiyor.
`planet.webp` yine dokunulmadı — kayıpsız hali 684 KB, q82 ise 107 KB (yalnızca 22 KB kazanç,
karşılığında zaten kayıplı bir dokuda ikinci nesil kayıp). Değmez.

**A3 — ESLint** ✅ Kuruldu: ESLint 9 flat config + `next/core-web-vitals` +
`typescript-eslint` + `no-console`/`no-unused-vars`. `npm run lint` (`--max-warnings 0`).
İlk taramada **yalnızca 5 bulgu** çıktı (kod tabanının durumu iyi):
2'si `global-error.tsx`'teki bilinçli `<a href="/">` (gerekçelendirilmiş istisna yazıldı —
kök layout çökmüşken tam sayfa yükleme gerekir), 2'si `Services`/`ServicePage` içinde
artık hiçbir şeyi bastırmayan **ölü** `eslint-disable` yorumu (silindi), 1'i config'in
kendi anonim export'u (düzeltildi). Sonuç: 0 hata / 0 uyarı.

**A4 — `/blog` sayfalama** ⛔ **Yapılmadı — ama asıl sorun bulundu ve düzeltildi.**
Ölçüm sırasında sayfalamadan çok daha ciddi bir kusur çıktı: `BlogHome` bir client
bileşeni ve sunucu ona **tam `BlogPost` nesneleri** geçiyordu. Bu, 50 yazının TÜM
gövdesini (`content` blokları + `faq`) yalnızca başlık/özet gösteren liste sayfasının
RSC payload'una serialize ediyordu. `/blog` HTML'i bu yüzden **507 KB**'tı.
Çözüm: `BlogPostSummary` (6 alan) tipi + `toSummary()`; sunucu→client sınırından yalnızca
özet geçer. Sonuç: **507 KB → 220 KB (-%57)**, gzip ~32 KB. Yazı gövdelerinin artık
sızmadığı üretilmiş HTML'de doğrulandı.
Sayfalama bundan sonra gereksiz kaldı: (1) asıl 287 KB'lık şişkinlik kalktı,
(2) sayfa **istemci tarafı anlık arama/filtreleme** yapıyor — bu tüm yazıların client'ta
olmasını gerektirir; sayfalama bu özelliği bozar veya sunucu taraflı arama yazmayı
(yeni özellik) zorunlu kılar. Yazı sayısı ~60'ı geçerse yeniden değerlendirilir.

**A5 — İç link derinliği** ✅ **En yüksek SEO etkili düzeltme.** Eski satır içi mantık
`[...sameCat, ...others].slice(0, 3)` idi ve `blogPosts` ekleme sırasında (en eski başta)
olduğu için her yazı daima kategorisinin **aynı ilk üç (en eski)** yazısına link veriyordu.
Ölçülen sonuç: **50 yazının 26'sı (%52) hiçbir yerden bağlamsal iç link almıyordu**;
en çok link alan yazı 9 link topluyordu. En yeni 5 yazı: 0 link.
Yeni `src/lib/related-posts.ts`: tüm blog grafiği bir kez, deterministik hesaplanır —
sıralama ölçütü alaka (aynı kategori / aynı hizmet / aynı hizmet alanı) → **aldığı link
sayısı (az olan önce)** → tazelik → slug. Sonuç: **0 yetim, dağılım 1-4 link**,
en yeni yazılar 3-4 link alıyor. Determinizm zorunlu (SSG: rastgelelik her build'de
tüm blog HTML'ini değiştirirdi) ve testle güvenceye alındı.

**A6 — Otomatik test** ✅ **25 test, sıfır yeni bağımlılık.** Node 24 TypeScript'i doğrudan
çalıştırdığı ve `node:test` yerleşik olduğu için vitest/jest kurulmadı; `@/` takma adını
15 satırlık `scripts/test-loader.mjs` çözüyor. `npm test` ~0.2 sn.
Kapsam bilinçli olarak `seo-audit`'in yapamadıklarına odaklı: referans bütünlüğü
(her `relatedService.href` ve `cityPages.blogHref` gerçek sayfaya gidiyor mu — kırık iç
link build'den ÖNCE yakalanır), slug biçimi/tekilliği, yinelenen başlık, meta uzunlukları,
ilgili-yazı dağılımı + determinizmi, özet nesnesinin fazla alan taşımaması (payload
sızıntısı güvencesi), OG görsel ölçüsünün `src/lib/seo.ts` sabitiyle uyumu,
arama motoru doğrulama dosyalarının silinmemiş olması.

**Yan kazanç — kod tekrarı kaldırıldı:** `https://beracore.com` 4 dosyada, OG görsel
yolu+ölçüsü 8 dosyada kopyalıydı. Tek kaynak: `src/lib/seo.ts` (`SITE_URL`, `OG_IMAGE`,
`ogImages()`, `twitterImages`, `OG_IMAGE_ABSOLUTE`).

**Bu turda BULUNAN ama düzeltilMEYEN (içerik işi):** 24 şehir sayfasının tamamı
246-302 kelime aralığında (SSS + maddeler dahil). Her biri kendi şehrine özgün metin
taşıyor, kopya değil — ama hacim yerel rakiplerin altında. Genişletmek **içerik
üretimidir** ve içerik üretimi bilinçli olarak duraklatılmış durumda. Test mevcut tabanı
(240 kelime) regresyona karşı koruyor; kullanıcı içerik fazını açtığında bu ilk işlerden
biri olmalı.

---

## 3. TEKNİK İYİLEŞTİRME ÖNERİLERİ (aciliyeti düşük)

- 🟢 **`/blog` sayfalama** — yazı sayısı ~60'ı geçerse. Şu an gereksiz, gerekçesi §2.6/A4'te
  (asıl şişkinlik giderildi, sayfa 32 KB gzip; istemci taraflı arama sayfalamayı engelliyor).
- 🟢 **Core Web Vitals** 👤 — kesin skor için https://pagespeed.web.dev üzerinden canlı ölçüm.
- 🟢 **Şehir sayfalarının içerik hacmi** — bkz. §2.6 sonu. İçerik fazı açılınca ilk iş.
- 🟢 **Bileşen render testi** — `tests/` yalnızca saf mantık/veriyi kapsıyor. JSX testi
  için jsdom + bir derleyici gerekir (Node tip soyma JSX dönüştürmez); ayrı bir iş.

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

Kalite kapıları sırayla: `npm run lint` → `npm test` → `npm run build` → `npm run seo-audit`
(ilk üçü saniyeler sürer, ayrıntı `CLAUDE.md`).

Claude `CLAUDE.md` ve bu dosyayı okuyup nerede kalındığını görür.
Deploy her zaman tek komut: `npm run deploy "commit mesajı"`

**Yeni bilgisayarda ilk kurulum:** `ssh -o BatchMode=yes beracore "hostname"` çalışıyorsa hazırsın.
Çalışmıyorsa SSH anahtarı sunucuya eklenmeli — adımlar `CLAUDE.md` içinde.
