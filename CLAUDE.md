# BERACORE — Proje Bağlamı

Bu dosya, yeni bir sohbette veya farklı bir bilgisayarda çalışmaya başlandığında
projenin durumunu ve devam edilecek noktayı aktarır. Git ile taşındığı için her makinede bulunur.

**Son güncelleme:** 2 Ağustos 2026

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
local commit → `git push origin main` → SSH ile VPS'te `server-deploy.sh` → IndexNow bildirimi.

**Deploy artık kesintisiz (2 Ağu 2026'da düzeltildi).** Eski akış canlı sitede 500 üretiyordu:
- `npm ci` node_modules'ü silip kurarken çalışan Next.js'in tembel require'ları patlıyordu
  (`Cannot find module './serve-static'` → görsel optimizasyonu 500).
- `next build` çıktıyı doğrudan `.next` üzerine yazdığı için o an sayfa isteyen ziyaretçi
  artık var olmayan chunk'ları istiyordu.

Yeni akış: bağımlılık kurulumu **yalnızca lockfile değiştiyse** ve uygulama durdurulmuşken
yapılır; derleme `NEXT_DIST_DIR=.next-build` ile ayrı dizine yapılıp tek `mv` ile takas edilir.
`next.config.ts`'teki `distDir: process.env.NEXT_DIST_DIR || '.next'` bunu mümkün kılar.

`deploy.mjs` script'i VPS'te **dosyadan değil stdin'den** çalıştırır (`ssh beracore 'bash -s'`).
Sebep: `server-deploy.sh` içindeki `git reset --hard` script'in kendisini de günceller ve bash
script'i çalışırken kademeli okur → script'in değiştiği deploy'larda bozuk komut çalışabilirdi.

**Tek deploy yolu budur.** Eski `scripts/deploy.sh` ve `scripts/indexnow-submit.sh` kaldırıldı:
Windows'ta `bash` System32'deki WSL shim'ine gidiyordu ve bash sürümü IndexNow adımını
içermediği için iki yol birbirinden ayrışmıştı. `scripts/server-deploy.sh` VPS'te çalıştığı için durur.

Local + GitHub + canlı **her zaman aynı commit'te tutulur**. Kullanıcı bunu böyle istiyor.

### ✅ Node sürümü — 2 Ağu 2026'da VPS Node 24'e yükseltildi

**VPS: Node 24.18.1 / npm 11.16.0 · Local: Node 24.18.0 / npm 11.16.0 → artık AYNI hat.**

Bu, 30 Tem'de bir deploy'u patlatan lockfile tuzağını **kökten bitirdi**: npm 11 `sharp`'ın
WASM alt bağımlılıklarını lockfile'a yazmıyordu, VPS'in npm 10'u bunları bekleyip `npm ci`'da
EUSAGE veriyordu. İki taraf da npm 11 olduğu için `npx npm@10.8.2 install --package-lock-only`
geçici çözümü **artık gereksiz — kullanmayın**, lockfile'ı bozar.

Yükseltme yöntemi: NodeSource deposu `node_20.x` → `node_24.x`, ardından `apt install nodejs`.
`sharp` yerel (native) bağımlılık olduğu için ABI değişiminde **`node_modules` silinip
`npm ci` yeniden çalıştırılmalıdır** — aksi halde görsel optimizasyonu çöker.

> ⚠️ **`pm2 update` tuzağı:** pm2 daemon'ını yeni Node ile yenilerken kayıtlı uygulama
> listeden düşebilir; sonrasında `pm2 start beracore` "app not found" verir. Bu durumda
> uygulama orijinal tanımıyla yeniden kaydedilir:
> ```
> cd /var/www/beracore && pm2 start npm --name beracore -- start && pm2 save
> ```
> (script `/usr/bin/npm`, args `start`, cwd `/var/www/beracore`, fork mode)

Geri alma yönergesi sunucuda: `/root/NODE-GERI-ALMA.txt` · pm2 yedeği:
`/root/pm2-dump-yedek-20260802.json`

`npm test` Node'un yerleşik TypeScript çalıştırmasına dayanır (Node ≥22.6) — VPS artık
Node 24 olduğu için orada da çalışabilir. Yine de deploy adımı yalnızca `npm ci` + `next build`
yapar; testler local kalite kapısıdır.

### VPS
- Host `187.124.181.213`, user `root`, SSH alias `beracore` (Hostinger, Ubuntu)
- **SSH yalnızca ANAHTAR ile** (2 Ağu 2026). `/etc/ssh/sshd_config.d/01-beracore-hardening.conf`:
  `PasswordAuthentication no` + `PermitRootLogin prohibit-password`. Dosya `01-` önekli çünkü
  `sshd_config.d/*.conf` alfabetik okunur ve OpenSSH bir ayarın **ilk** gördüğü değeri kullanır;
  `50-cloud-init.conf` içindeki `yes` satırını ezmek için önce gelmesi gerekir.
  Yedek `/root/ssh-yedek-20260802/`. Geri alma: dosyayı sil + `systemctl reload ssh`.
  **Parola ile giriş artık mümkün değil** — yeni makine eklerken public key'i mevcut bir
  makineden `authorized_keys`'e eklemek ZORUNLU (parolayla ekleme yolu kapandı).
- `fail2ban` aktif (sshd jail, 5 deneme / 10 dk → 1 saat ban)
- `authorized_keys`'te 3 anahtar: `hostinger-managed` (panel kurtarma), `beracore-local-deploy`,
  `beracore-vps-deploy`. Sahibi doğrulanmamış `emirhan` anahtarı 2 Ağu 2026'da kullanıcı
  onayıyla KALDIRILDI (yedek: `/root/ssh-yedek-20260802/authorized_keys.emirhan-oncesi`).
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

#### Windows tuzağı: Smart App Control git'i öldürür
Windows 11'de **Akıllı Uygulama Denetimi (Smart App Control)** açıksa `git.exe` ve `bash.exe`
**hiçbir çıktı vermeden** `-1058471934` (`0xC0E90002`) ile çöker. Git bozuk sanılıp yeniden
kurulur — fayda etmez, çünkü engellenen git'in imzasız MinGW DLL'leridir
(`libiconv-2.dll`, `libpcre2-8-0.dll`, `libintl-8.dll`).

Teşhis:
```
Get-WinEvent -LogName "Microsoft-Windows-CodeIntegrity/Operational" -MaxEvents 20 |
  Where-Object { $_.Message -match "git" }
(Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Control\CI\Policy").VerifiedAndReputablePolicyState
```
`1` = açık/zorlayıcı, `0` = kapalı.

Çözüm: Windows Güvenliği → Uygulama ve tarayıcı denetimi → Akıllı Uygulama Denetimi → **Kapalı**
(`windowsdefender://smartappcontrol`). **Geri döndürülemez** — bir kez kapatılınca Windows
yeniden kurulmadan açılamaz, bu yüzden kullanıcı onayı şart. 2 Ağu 2026'da bu makinede kapatıldı.

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
npm test         # node:test, 36 test, ~0.5 sn — SIFIR ek bağımlılık
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

**Faz 1.3a'dan itibaren blog içeriği VERİTABANINDA.** Sayfalar `src/lib/db/content.ts`
üzerinden okur; `src/lib/blog-data.ts` artık **tohum ve geri düşme** kaynağıdır.

- **Yeni yazı eklemek:** yine `blog-data.ts`'teki `blogPosts` dizisine `BlogPost` nesnesi
  eklenir. Deploy'da `scripts/icerik-aktar.mjs` onu veritabanına tohumlar.
- **Var olan yazıyı düzenlemek:** `/admin/icerik` üzerinden. Kod tarafına DOKUNMAZ.
- ⚠️ **Aktarım `INSERT OR IGNORE`'dur ve var olan kaydı EZMEZ.** Bunu "senkronizasyona"
  çevirmeyin: panelden yapılan her düzenleme bir sonraki deploy'da sessizce geri alınırdı.
- **Sıralamanın eşitlik bozucusu `sira` kolonudur, slug DEĞİL.** 13 yazı aynı yayın gününü
  paylaşıyor; slug'a göre sıralamak `/blog` listesinin öne çıkan yazısını değiştiriyor.
- Gövde düzenleme biçimi: boş satır paragraf ayırır, `##`/`###` başlık, `-` madde,
  `>` alıntı. Satır içi biçimlendirme YOK (render katmanı desteklemiyor).
  `tests/icerik-bicim.test.ts` 50 yazının tamamı için gidiş-dönüş denkliğini kilitler.
- Her kaydetme önceki hâli `content_versions`'a yazar — git geçmişinin yerini bu tutar.

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

➡️ **Önce `docs/BERACORE_ADMIN_ROADMAP.md`'yi oku.** 2 Ağu 2026'da başlayan
**Business Operating System** programının yol haritası orada: fazlar, kilitli kararlar,
kullanıcıdan beklenenler.

| Konu | Dosya |
|---|---|
| Program yol haritası | `docs/BERACORE_ADMIN_ROADMAP.md` |
| Ne inşa ediliyor, neden | `docs/BERACORE_ADMIN_BPDD_v0.1.md` |
| Denetim bulguları (18 madde, açık/kapalı) | `docs/BERACORE_SYSTEM_AUDIT.md` |
| Veri modeli (mevcut + planlanan şema) | `docs/BERACORE_DATA_MODEL.md` |
| Güvenlik modeli ve tehdit tablosu | `docs/BERACORE_SECURITY_MODEL.md` |
| AI çalışanları ve yetki sınırları | `docs/BERACORE_AI_WORKFORCE.md` |
| Entegrasyon mimarisi | `docs/BERACORE_INTEGRATIONS.md` |
| Test planı ve kapsam | `docs/BERACORE_TEST_PLAN.md` |
| **Yapılanların kaydı (faz raporları)** | `docs/BERACORE_CHANGELOG.md` |
| Site/SEO durumu ve geçmişi | `docs/yol-haritasi.md` |
| Dijital varlık/platform planı | `docs/dijital-varlik-plani.md` |

`docs/panel-crm-plani.md` kaldırıldı — yerini `BERACORE_ADMIN_ROADMAP.md` aldı.
(Daha önce `site-tamamlama-plani.md` ve `gorunurluk-rehberi.md` de birleştirilip kaldırılmıştı.)

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
- **Çerez bandı KOŞULSUZ render edilir**, görünürlüğünü `globals.css`'teki `.cc-banner` +
  `html[data-cc]` çifti belirler; değeri `layout.tsx`'teki senkron `<head>` script'i yazar.
  `{decision === 'pending' && ...}` koşuluna DÖNÜLMEMELİ: band hidrasyondan sonra belirdiğinde
  sayfanın en büyük metin bloğu (10608px²) olarak **LCP öğesi** oluyordu ve ana sayfada LCP'yi
  1392ms yerine 6252ms yapıyordu (2 Ağu 2026 ölçümü, 4x CPU kısıtlı mobil).
- **Geç beliren büyük overlay'lere dikkat.** Sitenin en büyük "içerikli" metni yalnızca
  7605px² (hero başlığı harf harf animasyonlu span'lara bölündüğü için LCP adayı değil).
  Bu yüzden sonradan mount olan herhangi bir geniş kutu kolayca LCP öğesi haline gelir.
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

---

## Yönetim Paneli (Faz A — 2 Ağu 2026, canlıda)

`/admin` — gelen kutusu + lead yönetimi + **şirket ayarları** + **metrikler**.
Blog/sayfa içeriği şimdilik kodda (Faz 1.3'te veritabanına taşınacak).

**Metrik kuralı (Faz 1.2):** ana sayfa ve Hakkımızda'daki rakamlar `company_metrics`
tablosundan gelir ve **yalnızca `durum = 'yayinda'` olanlar render edilir**. Filtre
`src/lib/db/metrics.ts` içindeki SORGUDADIR, bileşende değil — bir JSX dalını unutmak
kuralı delmeye yetmesin diye. Panel de veri kaynağı boşken yayına almayı reddeder.
Bugün `25+ proje`, `15+ müşteri`, `%97 memnuniyet` **taslak** durumda, yani sitede yok;
kanıt girilip durum değiştirilince deploy'suz geri gelirler.
**Koda tekrar sabit sayı yazma** — `tests/sirket-metrikleri.test.ts` bunu yakalar.
Public site %100 statik ve SEO-bütün; panel aynı Next.js süreci içinde dinamik olarak yaşar
(PM2/nginx/TLS değişmedi).

**Veritabanı:** `node:sqlite` (Node 24 yerleşiği) — `better-sqlite3` yerine bilinçli tercih.
Yerel (native) modül ABI'ye bağlıdır ve Node yükseltmesinde `sharp` yüzünden tam da bu sorun
yaşandı; yerleşik modül sıfır bağımlılık ve sıfır ABI riski demek.
Konum **repo DIŞINDA**: `/var/www/beracore-data/beracore.db` (chmod 700) — `git reset --hard`
dokunamaz. Dev'de `./.data/` (gitignore).

**Şema:** `leads` · `notes` (polimorfik) · `sessions` · `login_attempts` · `schema_migrations`.
Migration'lar `src/lib/db/migrations/*.sql`, çalıştırıcı `scripts/migrate.mjs` (idempotent,
her dosya tek transaction). Deploy'da build sonrası / restart öncesi otomatik çalışır.

**Kimlik doğrulama:** tek yönetici. Parola `scrypt` hash'i `.env`'de, oturum çerezi HMAC imzalı,
oturum kaydı DB'de (silinince erişim ANINDA biter). `middleware.ts` edge'de imzayı,
`(korumali)/layout.tsx` DB'den asıl yetkiyi doğrular. Kilit: IP başına 15 dk'da 8 başarısız.

### Panelde öğrenilen tuzaklar (tekrar düşmemek için)

- **`.env` değerlerinde `$` KULLANMAYIN.** Next dotenv-expand ile okur; `scrypt$tuz$hash`
  biçimindeki hash'te `$tuz` değişken referansı sanılıp boşa çevriliyor ve DOĞRU parola bile
  reddediliyordu. Ayırıcı `:` yapıldı, `tests/auth.test.ts` bunu kilitliyor.
- **Oturum çerezi kuran işlem Server Action OLMAMALI.** Server Action içinde
  `cookies().set()` + `redirect()` yapıldığında `Set-Cookie` yanıtta görünüyor ama tarayıcı
  saklamıyor. Kontrol deneyiyle doğrulandı (aynı tarayıcıda rota işleyicisinin çerezi saklandı).
  Giriş/çıkış/mutasyonların hepsi klasik form POST + rota işleyicisi — yan faydası panelin
  JavaScript kapalıyken de çalışması ve düz HTTP ile test edilebilmesi.
- **Yönlendirme hedefi `new URL(yol, req.url)` ile kurulmamalı.** `req.url` isteğin gerçek
  ana makinesini taşımayabiliyor (`127.0.0.1`'e gelen isteğe `localhost` hedefli yönlendirme
  döndü); çerez farklı host'ta gönderilmediği için sonsuz giriş döngüsü oluştu. Hedef `Host`
  başlığından kurulur (nginx `proxy_set_header Host $host` yazar).
- **Çerezin `Secure` bayrağı `NODE_ENV`'den değil `X-Forwarded-Proto`'dan türetilir.**
  Aksi halde üretim build'i yerelde http üzerinde hiç oturum açamıyor (Secure çerez sessizce atılır).
- **`(korumali)` rota grubu şart:** giriş sayfası korumalı düzenin İÇİNDE olursa
  login → düzen → login sonsuz yönlendirmesi oluşur.
- **Kabuk script'leri LF olmalı** — `.gitattributes` zorluyor. CRLF, VPS'te
  `set: pipefail: invalid option name` verip deploy'u kırar.
- **Sunucu çalışırken DB'yi dışarıdan okumayın.** WAL modunda başka bir süreç taahhüt edilmiş
  satırları göremiyor (Windows'ta doğrulandı) — testler yanlış "veri yok" sonucu verir.
  Doğrulama sunucunun kendi sayfaları üzerinden yapılmalı.

### Panel bakımı
- Parola değiştirme: `node scripts/hash-password.mjs 'yeni-parola'` → çıktıyı VPS `.env`'e yaz → deploy.
  **Parolada `$` KULLANMA** (dotenv-expand hash'i bozar). Hash'i VPS'e yazmadan önce yerelde
  doğrula — yanlış hash panele kilitler.
- Yedek: her gece 03:30 `/usr/local/bin/beracore-yedek.sh` → `/var/backups/beracore/`.
  Kaynak dosya repoda: `scripts/vps-yedek.sh` (kurulum: `scp` + `chmod +x`).
  DB (`db-*.db.gz`, yazmadan önce `integrity_check`) **ve** yapılandırma (`config-*.tar.gz`:
  `.env`, nginx, pm2 dump, sshd conf, authorized_keys, crontab) alınır. Log:
  `/var/log/beracore-yedek.log`. Eski script'ler `/root/yedek-script-oncesi-20260802/`.
- Oturumları toptan iptal: VPS'te `sqlite3 /var/www/beracore-data/beracore.db "DELETE FROM sessions"`

### 2 Ağustos 2026 — Faz 0 kalıcı notları

- **🔴 Sır tarayıcı deploy'u durdurur.** `scripts/secret-scan.mjs` `deploy.mjs` içinde
  **push'tan ÖNCE** çalışır. Sebebi acı: `uretim-kimlik.tmp` canlı panel parolasını ve
  `AUTH_SECRET`'i **herkese açık** GitHub deposuna taşımıştı (`.gitignore` `.env*`'i
  kapsıyordu, `*.tmp`'yi kapsamıyordu). Geçmiş `git filter-repo` ile temizlendi, kimlikler
  rotasyona sokuldu. **Tarayıcıya muafiyet EKLEME** — bunun yerine sabiti koddan kaldır
  (test anahtarları çalışma anında üretilir). Muafiyet, o dosyada gerçek bir sırrın
  saklanabileceği kör nokta açar.
- **Yedek doğrulanmadan yedek sayılmaz.** Denetimde iki şey birden çıktı: üretim `.env`
  hiçbir yedekte yoktu (eski script Nisan tarihli `.env.local`'i alıyordu) ve DB yedeği
  hiç çalışmamıştı. Geri yükleme artık test edildi (satır sayıları canlıyla birebir).
- **Atomik takas `.next/cache`'i taşır.** Yoksa her deploy ISR önbelleğini siliyordu.
  Faz 2'de içerik DB'ye taşınınca bu, her deploy'da tüm sayfaların soğuması demek olurdu.
- **Denetim günlüğüne silme fonksiyonu eklenmez.** `src/lib/db/activity.ts` bilerek
  yalnızca yazma+okuma sunar; `db-flags-activity.test.ts` bunu kilitler.
- **Tanımsız özellik bayrağı KAPALI sayılır.** Migration çalışmamış bir ortamda yarım
  modül kazara açılmasın diye (`src/lib/db/flags.ts`).
- **Test DB'si gerçek migration dosyalarını çalıştırır** (`tests/yardim/test-db.ts`).
  Şemayı testte elle yazmak, zamanla üretimden ayrışıp var olmayan bir veritabanını
  doğrulamaya başlamak demektir. `hazirla()` mutlaka `getDb()` kullanan modüller import
  edilmeden önce çağrılır → test dosyaları modülleri **dinamik** import eder.
- **Script'i import eden test, script'i ÇALIŞTIRIR.** `secret-scan.mjs` ilk yazıldığında
  import edilince `process.exit` çağırıp test koşucusunu öldürüyordu; testler "1 test
  geçti" görünüp sessizce atlanıyordu. CLI kısmı `process.argv[1]` karşılaştırmasıyla
  korumaya alındı. Yeni script'lerde aynı kalıbı kullan.
