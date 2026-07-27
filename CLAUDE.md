# BERACORE — Proje Bağlamı

Bu dosya, yeni bir sohbette veya farklı bir bilgisayarda çalışmaya başlandığında
projenin durumunu ve devam edilecek noktayı aktarır. Git ile taşındığı için her makinede bulunur.

**Son güncelleme:** 27 Temmuz 2026

---

## Proje

BERACORE kurumsal web sitesi — Next.js 15 (App Router) + TypeScript + Tailwind, koyu tema, GSAP animasyon.
6 hizmet kategorisi ve 24 alt hizmet: Yapay Zeka & Otomasyon, Blockchain & Fintech, Yazılım Geliştirme,
Tasarım, E-Ticaret, Dijital Pazarlama. Site Türkçe, hedef pazar Türkiye.

## Deploy — tek komut

```
npm run deploy "commit mesajı"
```

`scripts/deploy.mjs` çalışır ve şunları sırayla yapar:
local commit → `git push origin main` → SSH ile VPS'te `server-deploy.sh`
(git reset --hard + npm ci + next build + pm2 restart) → IndexNow ile Bing/Yandex bildirimi.

Local + GitHub + canlı **her zaman aynı commit'te tutulur**. Kullanıcı bunu böyle istiyor.

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
Yeni sunucuya taşınırsa `.env` elle yeniden oluşturulmalı.

### Bilinen papercut
`npm run lint` çalışmıyor — Next 15'te `next lint` kaldırıldı, komut interaktif kurulum sorusu soruyor.
Kalite kapısı olarak **`npm run build`** kullan (tip kontrolü içerir).

---

## Blog / içerik modeli

Tüm içerik tek dosyada: **`src/lib/blog-data.ts`**. `blogPosts` dizisine `BlogPost` nesnesi eklenir,
sayfalar SSG ile otomatik üretilir (`/blog/[slug]`). Başka dosyaya dokunmak gerekmez.

Her yazıda zorunlu standart:
- `metaTitle` / `metaDescription`
- `relatedService` → ilgili hizmet sayfasına iç link (huni girişi)
- `faq` dizisi → FAQPage schema + zengin sonuç
- Kategori, `CATEGORY_META`'daki 6 değerden biri olmalı

**Durum:** 37 yazı yayında, 24 alt hizmetin tamamı kapsanıyor.

### İçerik stratejisi (26-27 Tem 2026 rakip SERP analizinden)
Türkiye pazarında ticari sorgularda ilk sıraları tutan içerik tipleri:
fiyat/maliyet yazıları · "X nasıl seçilir" · karşılaştırma · platform/marka özel rehberler
(ör. IdeaSoft'un Trendyol/n11 mağaza açma rehberleri) · 2.500+ kelime uzun form + FAQ blokları.

Öne çıkan rakipler: Cesa Yazılım & Crypto Software (kripto borsa), IdeaSoft/T-Soft/Dopigo (pazaryeri),
Zeo/Mobitek/Digipeak (SEO), Erpin/Kotivon (özel yazılım fiyat), WebCraft/Cbot (chatbot), Kafein/Gen RPA (RPA).

İlk 23 yazı tamamen "X nedir" bilgi amaçlıydı; bu analizden sonra 12 ticari niyetli yazı eklendi.

Trendyol, Hepsiburada, N11 ve Amazon mağaza açma/entegrasyon rehberleri tamamlandı (4 pazaryeri tam kapsam).

**Kalan içerik boşlukları:** şehir bazlı hizmet sayfaları (ör. "istanbul web tasarım"),
vaka çalışması / portfolyo sayfaları, müşteri yorumları.

---

## Görünürlük durumu ve DEVAM EDİLECEK NOKTA

Ayrıntılı ücretsiz kurulum rehberi: **`docs/gorunurluk-rehberi.md`**

### Asıl darboğaz
Site teknik olarak iyi ama **yeni ve otoritesi yok**. Temmuz 2026'da Google beracore.com için
"açıklama sağlanamıyor" gösteriyordu. Ana kelimelerde rakiplerin domain yaşı 15 yıla varıyor —
kısa vadede kazanılacak yer uzun kuyruk sorgular. Gerçekçi takvim: 4-6 ayda düzenli organik trafik.

### Kullanıcıdan beklenen (yapılmadı — sohbete bununla devam edilecek)
1. **Search Console → Dizine ekleme > Sayfalar**: "Dizine eklendi" ve "Dizine eklenmedi" sayıları.
   Bu iki sayı indeksleme sorunu olup olmadığını belirleyecek.
2. **GA4 ölçüm kimliği** (`G-XXXXXXX`) — alınınca `src/app/layout.tsx`'e eklenecek.
   Mülk `kemalberkealanel@gmail.com` hesabında, iş hesabına devredilecek.
3. **Yandex Webmaster doğrulama meta etiketi** — alınınca `layout.tsx`'e eklenecek.
4. **Portfolyo içeriği** — hangi projeler yapıldı, ne sonuç verdi? Vaka çalışması sayfaları için gerekli.

### Kullanıcı kararları
- **Google Business Profile şimdilik AÇILMAYACAK** (kullanıcının kararı; ücretsiz ve yerel aramada
  en hızlı dönüş getiren kanal olduğu kendisine söylendi)
- **Ücretli kanal yok** — Google Ads şimdilik kapsam dışı, sadece ücretsiz yöntemlerle ilerleniyor
- Kullanıcının müşteriye ve gelire acil ihtiyacı var; beklenti yönetimi konusunda dürüst olunmalı

### Yapılmış olanlar
sitemap.xml (80 URL) · robots.txt · Google doğrulama etiketi · ProfessionalService/WebSite/BlogPosting/
FAQPage/BreadcrumbList/Service şemaları · sameAs sosyal sinyalleri · canonical + OG · HTTPS · mobil uyum ·
37 blog yazısı · İstanbul şehir bazlı 6 hizmet sayfası (`/istanbul/[hizmet]`, `src/lib/city-pages-data.ts`) ·
çalışan iletişim formu (Hostinger SMTP, `.env`) · WhatsApp CTA (`src/components/WhatsAppCta.tsx`, +905539862306) ·
IndexNow her deploy'da otomatik (`scripts/indexnow-submit.mjs`, key `public/*.txt`)

---

## Çalışma tarzı

Kullanıcı onay beklemeden ilerlenmesini istiyor: kodu yaz, build al, deploy et, sonra raporla.
Ancak geri döndürülmesi zor veya dışa dönük işlerde (sunucu güvenlik ayarı değiştirme, hesap silme,
ücretli işlem) önce sor. Türkçe iletişim. Kısa ve net cevap tercih ediyor.
