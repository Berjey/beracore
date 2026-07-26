# BERACORE — Ücretsiz Görünürlük Kurulum Rehberi

Bu dosya, para harcamadan yapılabilecek tüm arama motoru görünürlük işlerini sırasıyla listeler.
Yapıldıkça kutucukları işaretle. Sıralama önem sırasına göredir — yukarıdakiler en yüksek etkili.

Son güncelleme: 27 Temmuz 2026

---

## 0. Sitede hazır olanlar (ben yaptım, senin yapman gereken bir şey yok)

- [x] `sitemap.xml` — 72 URL, her deploy'da otomatik güncelleniyor
- [x] `robots.txt` — sitemap'e işaret ediyor, `/api` ve `/_next` kapalı
- [x] Google doğrulama meta etiketi — `src/app/layout.tsx` içinde
- [x] Schema işaretlemesi — ProfessionalService, WebSite, BlogPosting, FAQPage, BreadcrumbList
- [x] `sameAs` sosyal profil sinyalleri (Instagram, LinkedIn, X)
- [x] Canonical URL, Open Graph, mobil uyum, HTTPS
- [x] 35 blog yazısı, hepsinde SSS + ilgili hizmet sayfasına iç link
- [x] WhatsApp iletişim butonu (her sayfada)
- [x] IndexNow — her deploy'da Bing + Yandex'e otomatik bildirim

---

## 1. Google Search Console — EN ÖNCELİKLİ

Adres: https://search.google.com/search-console

Site kayıtlı ve sitemap gönderilmiş durumda. Yapılacaklar:

- [ ] **Dizine ekleme > Sayfalar** raporunu aç. İki sayıyı not et:
      "Dizine eklendi" kaç sayfa, "Dizine eklenmedi" kaç sayfa.
      Dizine eklenmeyenlerin sebep listesine bak (en sık: "Taranmadı", "Keşfedildi - dizine eklenmedi").
- [ ] Üstteki arama kutusuna `https://beracore.com` yaz → **Dizine eklenmesini iste**.
- [ ] Aynısını en önemli 8-10 sayfa için tek tek yap (günlük kota var, birkaç güne yay):
      - `/`
      - `/hizmetler/blockchain/kripto-para-borsasi-yazilimi`
      - `/hizmetler/software/ozel-yazilim`
      - `/hizmetler/software/mobil-uygulama`
      - `/hizmetler/ecommerce/e-ticaret-yazilim`
      - `/hizmetler/marketing/seo`
      - `/hizmetler/design/web-tasarim`
      - `/blog`
      - `/iletisim`
- [ ] **Sitemap'ler** bölümünde `sitemap.xml` durumunun "Başarılı" olduğunu doğrula.
- [ ] **Deneyim > Core Web Vitals** ve **Mobil Kullanılabilirlik** raporlarında hata var mı bak.

### Haftalık rutin (5 dakika)
- [ ] **Performans** raporu: hangi sorgularda gösteriliyoruz, tıklama geliyor mu?
      Buradaki "gösterim alıyor ama tıklanmıyor" sorgular, başlık/açıklama iyileştirmesi için altın değerinde.
- [ ] Yeni blog yazısı yayınlandıkça o URL için "Dizine eklenmesini iste".

---

## 2. Google Analytics 4

Adres: https://analytics.google.com

Mevcut mülk `kemalberkealanel@gmail.com` hesabında. İş hesabına devir:

- [ ] Eski hesapla gir → sol alt **Yönetici**
- [ ] **Hesap erişim yönetimi** → sağ üst **+** → **Kullanıcı ekle**
- [ ] İş e-postanı yaz, rol olarak **Yönetici** seç, kaydet
- [ ] İş hesabından giriş yapıp eriştiğini doğrula
- [ ] Doğruladıktan sonra eski hesabı listeden çıkarabilirsin (acele etme, önce yenisinin çalıştığından emin ol)

Ölçüm kimliğini almak için:
- [ ] **Yönetici → Veri akışları → web akışı**na tıkla
- [ ] `G-` ile başlayan **Ölçüm Kimliği**ni kopyala ve bana ver → siteye ben ekleyip yayına alırım

> Not: Analytics kurulmadan hangi yazının işe yaradığını ölçemeyiz. Bu yüzden Search Console'dan hemen sonra gelir.

---

## 3. Bing Webmaster Tools — ücretsiz, 10 dakika

Adres: https://www.bing.com/webmasters

Bing küçük görünür ama ChatGPT ve Copilot aramaları Bing dizinini kullanır; B2B'de karşılığı var.

- [ ] Hesap aç, `beracore.com` ekle
- [ ] **"Google Search Console'dan içe aktar"** seçeneğini kullan — doğrulama ve sitemap tek tıkla gelir
- [ ] İçe aktarma çalışmazsa: sitemap olarak `https://beracore.com/sitemap.xml` gönder
- [ ] IndexNow zaten kurulu olduğu için yeni sayfalar otomatik bildirilecek

---

## 4. Yandex Webmaster — Türkiye için anlamlı

Adres: https://webmaster.yandex.com

- [ ] Hesap aç, `beracore.com` ekle
- [ ] Doğrulama için verilen meta etiketi bana ver → `layout.tsx`'e ekleyeyim
- [ ] Sitemap gönder: `https://beracore.com/sitemap.xml`

---

## 5. Ücretsiz güven ve bağlantı sinyalleri

Yeni bir sitenin en büyük eksiği "otorite". Bunlar ücretsiz ve kalıcı:

- [ ] **LinkedIn şirket sayfası** — varsa web sitesi alanına beracore.com eklendiğinden emin ol
- [ ] LinkedIn'de blog yazılarını düzenli paylaş (yazıya link vererek)
- [ ] **Instagram** biyografisine site linki
- [ ] **X (Twitter)** profiline site linki
- [ ] Ücretsiz sektörel dizinlere kayıt (yazılım firması listeleri, B2B rehberler)
- [ ] Çalıştığın müşterilerden sitelerine "geliştirici: BERACORE" linki istemek — en değerli ücretsiz bağlantı türü
- [ ] Teknik forumlarda / topluluklarda profil oluşturup imzada site linki

> Uyarı: Ücretli/toplu backlink satın alma. Kısa vadede işe yarar görünür, cezayla biter. Yapma.

---

## 6. İçerik ritmi (benim yapacağım kısım)

- [x] 35 yazı yayında, 6 hizmet kategorisinin tamamı kapsandı
- [ ] Kalan boşluklar: n11 / Amazon mağaza açma rehberleri, şehir bazlı hizmet sayfaları, vaka çalışması sayfaları
- [ ] Hedef ritim: haftada 1-2 yazı. Sana düşen tek şey "şu konuda yaz" demek.

---

## 7. Dönüşüm — trafik geldiğinde kaybetmemek için

- [x] WhatsApp butonu her sayfada
- [ ] Portfolyo / vaka çalışması sayfaları (yaptığın işler, ölçülebilir sonuçlarla)
- [ ] Gerçek müşteri yorumları
- [ ] İletişim formunun gerçekten mail ilettiğini test et (`/iletisim` üzerinden kendine bir test mesajı gönder)

---

## 8. Bilerek yapmadıklarımız

- **Google Business Profile** — senin kararınla şimdilik ertelendi.
  Not: ücretsiz ve yerel aramalarda ("istanbul yazılım firması") en hızlı müşteri getiren kanaldır.
  Fikrin değişirse ilk sıraya alınmalı.
- **Google Ads** — bütçe gerektirdiği için şimdilik kapsam dışı.

---

## Gerçekçi beklenti

Yeni domainlerde Google'ın güven kazanması zaman alır. Yukarıdakiler eksiksiz yapılsa bile:

- İlk 1 ay: indekslenme ve gösterim başlar, tıklama azdır
- 2-3 ay: uzun kuyruk sorgularda ("özel yazılım fiyatları" gibi) sıralamalar oluşmaya başlar
- 4-6 ay: düzenli organik trafik ve ilk teklif talepleri

Ana kelimelerde ("kripto para borsası yazılımı") rakiplerin domain yaşı 15 yıla varıyor; oradaki rekabet uzun soluklu bir iştir.
