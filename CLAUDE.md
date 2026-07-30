# BERACORE — Proje Bağlamı

Bu dosya, yeni bir sohbette veya farklı bir bilgisayarda çalışmaya başlandığında
projenin durumunu ve devam edilecek noktayı aktarır. Git ile taşındığı için her makinede bulunur.

**Son güncelleme:** 30 Temmuz 2026

---

## Proje

BERACORE kurumsal web sitesi — Next.js 15 (App Router) + TypeScript + Tailwind, koyu tema, GSAP animasyon.
6 hizmet kategorisi ve 23 alt hizmet (E-Ticaret 3, diğerleri 4'er): Yapay Zeka & Otomasyon, Blockchain & Fintech, Yazılım Geliştirme,
Tasarım, E-Ticaret, Dijital Pazarlama. Site Türkçe, hedef pazar Türkiye.

## Deploy — tek komut

```
npm run deploy "commit mesajı"
```

`scripts/deploy.mjs` çalışır ve şunları sırayla yapar:
local commit → `git push origin main` → SSH ile VPS'te `server-deploy.sh`
(git reset --hard + npm ci + next build + pm2 restart) → IndexNow ile Bing/Yandex bildirimi.

**Tek deploy yolu budur.** Eski `scripts/deploy.sh` ve `scripts/indexnow-submit.sh` kaldırıldı:
Windows'ta `bash` System32'deki WSL shim'ine gidiyordu ve bash sürümü IndexNow adımını
içermediği için iki yol birbirinden ayrışmıştı. `scripts/server-deploy.sh` VPS'te çalıştığı için durur.

Local + GitHub + canlı **her zaman aynı commit'te tutulur**. Kullanıcı bunu böyle istiyor.

### ⚠️ Node/npm sürüm farkı — lockfile tuzağı (30 Tem 2026'da bir deploy'u patlattı)

**VPS: Node 20.20.2 / npm 10.8.2 · Local (bu makine): Node 24.12 / npm 11.6.2**

npm 11 ile `npm install` çalıştırmak, `sharp`'ın WASM alt bağımlılıklarını
(`@emnapi/core`, `@emnapi/wasi-threads`) lockfile'a YAZMIYOR. npm 10 bunları bekliyor ve
VPS'te `npm ci` **EUSAGE** ("package.json and package-lock.json are not in sync") ile
patlıyor → deploy git push'tan sonra, build'den önce yarıda kalıyor.

**Kural:** Local'de bağımlılık ekledikten/güncelledikten sonra, deploy'dan ÖNCE:
```
npx -y npm@10.8.2 install --package-lock-only --no-audit --no-fund
npx -y npm@10.8.2 ci --dry-run --no-audit --no-fund   # doğrulama
```

Ayrıca `npm test` Node'un yerleşik TypeScript çalıştırmasına dayanır (Node ≥22.6) →
**VPS'in Node 20'sinde çalışmaz.** Sorun değil: testler local kalite kapısıdır, deploy
adımı yalnızca `npm ci` + `next build` yapar. Ama VPS'te test çalıştırmayı denemeyin.

> 🔴 **Kullanıcıya sorulacak:** Node 20 destek ömrünü tamamladı (Nisan 2026). VPS'i
> Node 24'e yükseltmek hem bu lockfile sürtünmesini bitirir hem güvenlik yamalarını
> geri getirir. Üretim çalışma zamanını değiştirdiği için **karar kullanıcınındır.**

### VPS
- Host `187.124.181.213`, user `root`, SSH alias `beracore` (Hostinger, Ubuntu)
- Proje yolu `/var/www/beracore`, PM2 app adı `beracore`, Nginx + Let's Encrypt
- pm2-root servisi enabled (reboot'ta site kendiliğinden kalkar), certbot timer aktif
- Nginx config `sites-available/beracore.com`: güvenlik başlıkları (CSP/HSTS/…),
  gzip+brotli, `_next/static` immutable cache, `/public` statik varlıklar 30 gün cache
  (`proxy_hide_header Cache-Control` + regex location). Config değişikliğinde önce
  `cp .bak`, `nginx -t`, sonra `systemctl reload nginx` (yedekler `.bak-*` olarak durur).

### Yeni bir bilgisayarda kurulum
SSH anahtarı makineye özeldir. Yeni makinede:
1. `~/.ssh/config`'e `beracore` alias'ı ve key yolu tanımlı mı bak
2. `ssh -o BatchMode=yes beracore "hostname"` → `srv1544645` dönüyorsa hazır
3. Dönmüyorsa: anahtar üret, public key'i sunucudaki `/root/.ssh/authorized_keys`'e ekle.
   Windows'ta `ssh-copy-id`/`sshpass` yok; tek seferlik parola ile eklemek için
   `pip install paramiko` + kısa bir Python script'i en pratik yol. Parola kullanıcıda.

### İletişim formu (çalışıyor)
Form `src/app/api/contact/route.ts` nodemailer + SMTP kullanır. Ayarlar VPS'te
`/var/www/beracore/.env` dosyasında (chmod 600, **git'e dahil değil**, şifre burada tutulur):
Hostinger `smtp.hostinger.com:465`, gönderen/alıcı `info@beracore.com`.
Deploy `git reset --hard` yapar ama `git clean` yapmaz → `.env` kalıcıdır.
Yeni sunucuya taşınırsa `.env` elle yeniden oluşturulmalı (`.env.example` şablon).

Korumalar: honeypot · alan doğrulama · HTML escape · nginx hız sınırı (`limit_req` 5r/m,
`nginx.conf` + site config) · uygulama katmanı hız sınırı (IP başına 10 dk'da 5, route.ts).
Nginx limitine takılan istek HTML 503, uygulama limitine takılan JSON 429 döner.

### Kalite kapıları (30 Tem 2026'da tamamlandı)

Sırayla çalıştırılır — hepsi hızlı, build öncesi ilk üçü saniyeler sürer:

```
npm run lint     # ESLint 9 flat config (eslint.config.mjs) — 0 uyarı toleransı
npm test         # node:test, 25 test, ~0.2 sn — SIFIR ek bağımlılık
npm run build    # tip kontrolü + 119 sayfa SSG
npm run seo-audit
```

**ESLint** kuruldu (`eslint`, `eslint-config-next`, `typescript-eslint`, `@eslint/eslintrc`).
`next/core-web-vitals` + `typescript-eslint/recommended` + `no-console`/`no-unused-vars`.
`scripts/` ve `tests/` içinde `no-console` kapalıdır (araç kodu konsola yazar).
`--max-warnings 0` → uyarı da hata sayılır.

**Testler** Node'un yerleşik test çalıştırıcısını kullanır (vitest/jest YOK, bağımlılık eklenmedi).
Node 24 TypeScript'i doğrudan çalıştırır; `@/` takma adını `scripts/test-loader.mjs` çözer.
`.tsx` (JSX) kapsam dışıdır — Node tip soyma yapar, JSX dönüştürmez. Testler saf mantık ve
veri modüllerini hedefler: referans bütünlüğü (kırık iç link), slug/meta kuralları,
ilgili-yazı dağılımı, OG görsel ölçüsü ↔ sabit uyumu, doğrulama dosyalarının varlığı.
`package.json`'da `"type": "module"` var (projede hiç `.js` dosyası yok, etkisi nötr).

---

## Blog / içerik modeli

Tüm içerik tek dosyada: **`src/lib/blog-data.ts`**. `blogPosts` dizisine `BlogPost` nesnesi eklenir,
sayfalar SSG ile otomatik üretilir (`/blog/[slug]`). Başka dosyaya dokunmak gerekmez.

Her yazıda zorunlu standart:
- `metaTitle` / `metaDescription`
- `relatedService` → ilgili hizmet sayfasına iç link (huni girişi)
- `faq` dizisi → FAQPage schema + zengin sonuç
- Kategori, `CATEGORY_META`'daki 6 değerden biri olmalı

**Durum:** 50 yazı yayında, 23 alt hizmetin tamamı kapsanıyor.

**Vaka çalışmaları / portfolyo sayfası YOK.** 27 Tem 2026'da `/calismalarimiz` kuruldu ancak
kullanıcı gösterilecek yeterli proje olmadığı gerekçesiyle beğenmedi ve kaldırıldı.
**Kullanıcı açıkça istemeden yeniden kurulmamalı.**
Eski kod git geçmişinde: `420e937` eklendi, `01e062c` kaldırıldı
(`git show 420e937` ile geri getirilebilir).

### İçerik stratejisi (26-27 Tem 2026 rakip SERP analizinden)
Türkiye pazarında ticari sorgularda ilk sıraları tutan içerik tipleri:
fiyat/maliyet yazıları · "X nasıl seçilir" · karşılaştırma · platform/marka özel rehberler
(ör. IdeaSoft'un Trendyol/n11 mağaza açma rehberleri) · 2.500+ kelime uzun form + FAQ blokları.

Öne çıkan rakipler: Cesa Yazılım & Crypto Software (kripto borsa), IdeaSoft/T-Soft/Dopigo (pazaryeri),
Zeo/Mobitek/Digipeak (SEO), Erpin/Kotivon (özel yazılım fiyat), WebCraft/Cbot (chatbot), Kafein/Gen RPA (RPA).

İlk 23 yazı tamamen "X nedir" bilgi amaçlıydı; bu analizden sonra ticari niyetli yazılar eklendi (23 → 46).
Son parti (28 Tem 2026, her kategoride bir boşluk): logo/marka kimliği fiyatları, RPA maliyeti,
WordPress mi özel yazılım mı, sosyal medya yönetimi fiyatları, token/coin oluşturma maliyeti.

Trendyol, Hepsiburada, N11 ve Amazon mağaza açma/entegrasyon rehberleri tamamlandı (4 pazaryeri tam kapsam).

**Yerel sayfalar (28 Tem 2026 — tamamlandı):** İstanbul, Ankara, İzmir, Bursa × 6 hizmet = 24 yerel
sayfa. Route `/istanbul/[hizmet]`'ten `/[sehir]/[hizmet]`'e genelleştirildi (mevcut İstanbul URL'leri
korundu). Her şehir kendi ekonomik kimliğiyle özgün içerik taşır (Ankara: kamu/savunma/teknokent,
İzmir: ihracat/üretici, Bursa: sanayi/imalat/B2B) — doorway/ince sayfa değil. Yeni şehir eklemek:
`src/lib/city-pages-data.ts`'teki `cityPages` dizisine CityPage nesnesi eklemek yeterlidir
(generateStaticParams ve 404 kontrolü bu diziden türetilir; ayrıca tutulan bir şehir listesi YOK).

**Kalan içerik boşlukları:** Yeni şehirler (Antalya/Konya/Adana vb.) ve sürekli yeni ticari blog yazıları.

**Müşteri yorumları gerçektir** — `Testimonials.tsx` içindeki 3 yorum gerçek müşterilere aittir
(kullanıcı 27 Tem 2026'da teyit etti). Uydurma referans/metrik eklenmemelidir.

---

## Görünürlük, yapılacaklar, durum

➡️ **Tek kaynak: `docs/yol-haritasi.md`.** Sıradaki adımlar, kullanıcıdan beklenenler,
tamamlananlar ve bilinçli kapsam-dışı kararlar orada. Önce onu oku.
(Eski `site-tamamlama-plani.md` ve `gorunurluk-rehberi.md` birleştirilip kaldırıldı.)

### Kısa özet
- Teknik durum sağlam: 27 Tem 2026 tam denetiminde 84 sayfa tarandı, **0 SEO hatası**.
- Asıl darboğaz görünürlük: site yeni, otoritesi yok, 4-6 ayda organik trafik beklenir.
- ✅ Arama motoru üçlüsü tamam: Google Search Console + Yandex + Bing Webmaster (28 Tem 2026).
- ✅ GSC ↔ GA4 bağlantısı kuruldu (organik sorgular GA4'te). Yapısal veri (JSON-LD) + OG/Twitter kartları
  tüm sayfa tiplerinde doğrulandı (`npm run seo-audit` şema kontrolünü de kapsıyor). OG görsel 600×392
  (ideal 1200×630 — opsiyonel iyileştirme). **Teknik/entegrasyon kurulum fazı büyük ölçüde bitti.**
- Kalan asıl kaldıraç: otorite/backlink + sosyal profiller (kullanıcı) · GSC indeks kademeli artacak (yeni site).
- ✅ GA4 kuruldu (28 Tem 2026): `G-NX5SRKJT2M`, VPS `.env`'de. CSP `next.config.ts`'te ID'den otomatik.
- ✅ Yandex Webmaster kuruldu (28 Tem 2026): HTML dosya doğrulaması (`public/yandex_3d09533b9553da5c.html`), sitemap gönderildi.
- ✅ Google Search Console mülkü iş hesabına devredildi (28 Tem 2026): sahip `berkealanelbusiness@gmail.com`,
  HTML dosya doğrulaması (`public/googleb8ca659074d30ada.html` — SİLİNMEMELİ), eski hesap + meta token kaldırıldı.
  İndeks durumu (24 Tem): 9 dizinde, 36 "keşfedildi-bekliyor" (yeni site, otorite/zaman meselesi, teknik hata değil).

### 30 Temmuz 2026 — üretime hazırlık denetimi (kalıcı notlar)

Kapsamlı QA turunda bulunup düzeltilen, **tekrar bozulmaması gereken** noktalar:

- **Scroll-typewriter başlıklar metnin TAMAMINI DOM'da tutar.** `ScrollText` ve
  `Manifesto` yazılmamış kısmı `opacity:0` ile render eder. Öncesinde sunucu HTML'inde
  h2'ler boştu (`<h2><span></span></h2>`) → başlıklar SEO'da yok sayılıyordu.
  Yalnızca "yazılan" kısmı render etmeye geri dönülmemeli.
- **Harflere bölünmüş hero başlıklarında iki kelime arasında GERÇEK boşluk olmalı.**
  Aksi halde metin "DijitalinÇekirdeğindeyiz" gibi birleşir. Hakkımızda / İletişim /
  Blog h1'lerinde `{' '}` + `aria-label` bu yüzden var.
- **gsap kök layout'a statik import EDİLMEZ.** `MotionGuard` gsap'ı dinamik import eder;
  aksi halde ~70 kB gsap, gsap kullanmayan tüm sayfalara (50 blog yazısı, yasal, şehir,
  kategori) yükleniyordu. `Footer`, `BlogArticle`, `LegalLayout` gsap yerine
  `useReveal` + globals.css `[data-rv]` / `.lg-anim` / `.ft-*` mekanizmasını kullanır.
- **three.js dinamik import edilir** (`Services`, `ServicePage`) → ilk yük paketine girmez.
- **3D şekil sarmalayıcılarında `onClick` yerine `useTapOnly`.** OrbitControls ile
  döndürmek için sürüklemek de `click` üretiyor; düz `onClick` sürükleme sonunda
  gezinme/kaydırma tetikliyordu.
- **WebGL sahneleri `renderer.forceContextLoss()` + `dispose()` ile kapatılır.**
  Sadece dispose bağlamı bırakmıyor; sayfalar arası gezinmede bağlam havuzu (~16) tükeniyordu.
- **robots.txt `/_next/` engellenmez** — Googlebot render için JS/CSS'e erişmek zorunda.
- **Hız sınırı IP'si `x-real-ip`, sonra XFF'in SON değeri.** XFF'in ilk değeri istemci
  tarafından uydurulabiliyor ve sınır atlanabiliyordu (nginx `$proxy_add_x_forwarded_for`
  gerçek IP'yi sona ekler, `X-Real-IP`'yi ise komple ezer).
- **Talep referans numarası SUNUCUDA üretilir** ve e-postanın konusunda yer alır.
  Öncesinde tarayıcıda rastgele üretiliyordu; müşteriye hiçbir kaydı olmayan numara veriliyordu.
- **Görünmez ama odaklanabilir öğe bırakılmaz.** Navbar alt menüsü `inert`,
  ScrollToTop/WhatsApp `visibility:hidden`, Services bölümü açılana kadar `inert`.
- **Nokta/karusel butonları:** görünen nokta içteki `<span>`, buton 24×24px şeffaf dokunma
  hedefi (WCAG 2.5.8). Yeni karusel eklenirse bu kalıp kullanılmalı.
- **Masaüstü navigasyon `lg` (1024px) kırılımında** açılır, `md` değil — 768px'te 9 öğe + CTA
  sığmıyor ve buton kesiliyordu.
- **Özyinelemeli/koşulsuz `requestAnimationFrame` kullanma.** TechMarquee'de kalıcı döngü
  sızıntısına yol açtı: döngü yalnızca hareket varken çalışmalı, boşta kapanmalı;
  id ref'te tutulmalı ve unmount'ta `cancelAnimationFrame` çağrılmalı.
- **setState çağıran her timer/rAF ref'e alınır ve unmount'ta iptal edilir.**
- **Flex satırındaki sabit boyutlu butonlara `shrink-0`** — yoksa dar ekranda 2px'e sıkışıp
  tıklanamaz hale geliyorlar.
- **Hata sınırları:** `src/app/error.tsx` + `global-error.tsx` üretimde stilize Türkçe
  ekran gösterir; kaldırılmamalı. `global-error.tsx` içindeki `<a href="/">` bilinçlidir
  (`Link` DEĞİL): kök layout çökmüşken istemci gezinmesi bozuk React ağacında kalır,
  tam sayfa yükleme temiz durum garanti eder. ESLint istisnası gerekçesiyle yazılıdır.

### 30 Temmuz 2026 — A serisi (kod tarafı kalan işler) kalıcı notları

- **Client bileşenine TAM `BlogPost` GEÇİLMEZ.** `src/lib/blog-data.ts` içindeki
  `BlogPostSummary` (6 alan) + `toSummary()` kullanılır. Sunucudan client'a tam nesne
  geçmek yazının `content`/`faq` gövdesini RSC payload'una serialize eder: `/blog`
  HTML'i bu yüzden 507 KB'tı, düzeltmeden sonra 220 KB (-%57). `BlogHome`, `PostCard`,
  `FeaturedPost` ve `BlogArticle.relatedPosts` yalnızca özet tipini kabul eder.
- **"İlgili Yazılar" `src/lib/related-posts.ts`'ten gelir.** Eski satır içi mantık
  (`sameCat.slice(0,3)`) daima kategorinin en eski yazılarını seçiyordu → **50 yazının
  26'sı (%52) hiç iç link almıyordu**. Yeni mantık: alaka → link eşitliği → tazelik,
  tamamen deterministik (SSG için zorunlu). Sonuç: 0 yetim, dağılım 1-4.
  Testler bunu doğrular; `getRelatedPosts` dışında bir seçim yazılmamalı.
- **OG görseli `public/og-cover.png`, 1200×630, opak.** `npm run og-image`
  (`scripts/make-og-image.mjs`) üretir; çıktı repoya commit edilir (VPS'te font
  varlığına bağımlılık olmasın). Kartın "BERACORE" yazısı gerçek logo dosyasıdır,
  yalnızca slogan/alan adı sistem fontuyla basılır. Ölçü değişirse `src/lib/seo.ts`
  güncellenmeli — test ikisinin uyumunu kontrol eder ve uyuşmazsa patlar.
- **`src/lib/seo.ts` tek kaynaktır.** `SITE_URL` ve OG görsel yolu/ölçüsü öncesinde
  8 sayfa dosyasında kopyalıydı. Yeni sayfa eklerken `ogImages(alt)` / `twitterImages`
  kullanılır, elle URL yazılmaz.
- **Görsel yeniden sıkıştırma bit-birebir doğrulanır.** `sharp` PNG çıktısı için
  `palette:false, quality:100` verilmezse sessizce palet nicemlemesi uygular (kayıplı).
  Kayıpsız olduğu piksel karşılaştırmasıyla doğrulanmadan asset üzerine yazılmamalı.


### Dikkat edilecek teknik tuzaklar
- **GA4 kuruldu** (28 Tem 2026, `G-NX5SRKJT2M`). Not: CSP artık **nginx'te değil `next.config.ts`'te**
  ve `NEXT_PUBLIC_GA_ID`'den otomatik kuruluyor — ID varken GA alan adlarını ekler, yokken tam sıkı kalır.
  Yeni bir `NEXT_PUBLIC_*` değişkeni build zamanı okunur; VPS `.env`'e build'den ÖNCE eklenmeli.
  Ölçüm kimliğini değiştirmek için: VPS `.env`'de `NEXT_PUBLIC_GA_ID`'yi güncelle + yeniden deploy.
- **Navigasyon linkleri `<a href>` olmak ZORUNDA.** 27 Tem 2026'da bulunan en büyük SEO kusuru:
  Navbar/Footer `<button onClick={router.push}>` kullanıyordu, Googlebot takip etmiyordu ve
  49 sayfa hiç iç link almıyordu. `Link href` + onClick (yumuşak kaydırma için) kalıbı korunmalı.

### Kullanıcı kararları
- **Google Business Profile şimdilik AÇILMAYACAK** (ücretsiz ve yerel aramada en hızlı dönüş
  getiren kanal olduğu kendisine söylendi; kararı kendisinin)
- **Ücretli kanal yok** — Google Ads kapsam dışı, sadece ücretsiz yöntemler
- Kullanıcının müşteriye ve gelire acil ihtiyacı var; beklenti yönetiminde dürüst olunmalı

---

## Çalışma tarzı

Kullanıcı onay beklemeden ilerlenmesini istiyor: kodu yaz, build al, deploy et, sonra raporla.
Ancak geri döndürülmesi zor veya dışa dönük işlerde (sunucu güvenlik ayarı değiştirme, hesap silme,
ücretli işlem) önce sor. Türkçe iletişim. Kısa ve net cevap tercih ediyor.

### Çalışma çerçevesi (28 Tem 2026'dan itibaren)
1. **İçerik üretimi DURAKLATILDI** — kullanıcı özel istemedikçe yeni blog/içerik üretme. Öncelik teknik + yapısal mükemmellik.
2. **Öncelik:** kapsamlı SEO ve dijital varlık yönetimi — her platformda doğru, profesyonel, hatasız görünürlük.
3. **Sıra:** tüm SEO/dijital araç kurulumları (GA4 ✅ + Yandex ✅ bitti) → kapsamlı son test → sonra web sitesi UX/geliştirme.
4. **Haftalık rutin + her içerik/iş oturumu:** `npm run seo-audit` (scripts/seo-audit.mjs — A-Z denetim:
   meta uzunlukları, tek H1, canonical, JSON-LD, iç link, SSS, yinelenen, ince içerik) → `npm run build`
   → `npm run deploy` → yeni sayfalar canlıda 200 mü → ara ara GSC indeks sayısı + GA4 çalışıyor mu.
