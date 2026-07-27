# BERACORE — Site Tamamlama Planı (Profesyonel Bitiş)

**Oluşturulma:** 27 Temmuz 2026
Bu dosya, sitenin "profesyonel anlamda tam bitmiş" sayılması için gereken tüm görevleri
öncelik sırasına göre listeler. Adım adım ilerlenir; biten madde `[x]` yapılır.

Notasyon: 🔴 kritik · 🟡 önemli · 🟢 iyileştirme · 👤 kullanıcı yapmalı · 🛠 geliştirici (Claude) yapar

---

## FAZ 1 — Kritik / İşlevsel (site iş getirmeye başlasın)

- [x] 🔴🛠 **İletişim formu e-posta gönderimi** — TAMAM (27 Tem 2026). VPS `/var/www/beracore/.env` (chmod 600, git-dışı) içinde Hostinger SMTP yapılandırıldı: `smtp.hostinger.com:465`, gönderen/alıcı `info@beracore.com`. Test talebi gönderildi, `{ok:true}` döndü. Deploy `git reset` yapıyor ama `.env` untracked olduğu için silinmez.
- [ ] 🔴👤 **Search Console → Sayfalar** ekranı: "Dizine eklendi" ve "eklenmedi" sayıları paylaşılacak → indeksleme sorunu var mı teşhis edilecek.
- [ ] 🟡🛠 **GA4 analytics kurulumu** — ziyaretçi/dönüşüm ölçümü. → 👤 gerekli: GA4 ölçüm kimliği (`G-XXXXXXX`).
- [ ] 🟢🛠 **Yandex Webmaster doğrulama** — → 👤 gerekli: doğrulama meta etiketi.

## FAZ 2 — Güven & Dönüşüm İçeriği (ziyaretçiyi müşteriye çevirir)

- [x] 🟡🛠 **Gerçek müşteri referansları** — TAMAM. `Testimonials.tsx` içindeki 3 yorum **gerçek müşterilere aittir** (kullanıcı 28 Tem 2026'da teyit etti); önceki "placeholder" notu hatalıydı. İleride izin alınırsa şirket adı/logo eklenerek güven etkisi artırılabilir.
- [x] 🟡🛠 **Portfolyo / Vaka çalışması sayfaları** — TAMAM (28 Tem 2026). `/calismalarimiz` + 3 tekil vaka sayfası (GmsGarage, Arovela, KriptoMall). Veri: `src/lib/case-studies-data.ts`. Her sayfada zorluk / yaptığımız iş / sonuç + müşteri alıntısı + Article & BreadcrumbList schema. Navbar, footer, sitemap ve ana sayfa Referanslar bölümünden iç link verildi. → 👤 opsiyonel geliştirme: proje ekran görüntüleri ve müşteri onaylı ölçülebilir rakamlar (şu an uydurma metrik kullanılmadı).
- [ ] 🟢🛠 **Güven rozetleri / iş bilgileri** — ödeme güvenliği, çalışma modeli, NDA vb. iletişim ve hizmet sayfalarında netleştirme.

## FAZ 3 — İçerik & Yerel SEO Derinliği (organik büyüme)

- [x] 🟡🛠 **Şehir bazlı hizmet sayfaları** — TAMAM (27 Tem 2026). `/istanbul/[hizmet]` altında 6 sayfa: web-tasarim, yazilim, e-ticaret, dijital-pazarlama, seo, mobil-uygulama. Her biri özgün içerik + FAQ + Service/LocalBusiness/FAQPage schema + iç link. Footer'da "İstanbul Hizmetleri" bloğu. Veri: `src/lib/city-pages-data.ts`. (Diğer şehirler ileride aynı yapıyla eklenebilir.)
- [ ] 🟢🛠 **Ek blog yazıları** — kalan içerik boşlukları ve rakip SERP analizine göre yeni ticari niyetli yazılar (süreklilik).
- [ ] 🟢👤 **Google Business Profile** — yerel aramanın #1 kaldıracı (kullanıcı şimdilik ertelemişti; hazır olunca).

## FAZ 4 — Otorite / Site Dışı (sıralamanın gerçek belirleyicisi)

- [ ] 🟢👤 **Sosyal profiller** — Instagram, LinkedIn, X hesapları açılacak (sameAs zaten hazır), bio'ya site linki.
- [ ] 🟢👤 **Backlink** — sektör dizinleri, LinkedIn şirket sayfası, iş birlikleri, içerik paylaşımı.

## FAZ 5 — Profesyonel QA / Teknik Cila (teslim kalitesi)

> Not: 27 Tem 2026 — Kapsamlı kod denetimi yapıldı (subagent). Sonuç: orphan dosya yok,
> kırık iç link yok, tutarsızlık yok. Düzeltilenler: ölü `.skip-link` CSS silindi,
> İstanbul breadcrumb schema hatası (tekrarlı URL) düzeltildi, gereksiz `CATEGORY_META`
> export'u kaldırıldı. Footer'daki İstanbul link yığını kaldırılıp bağlamsal blog linklerine
> taşındı. Aşağıdaki performans/a11y/güvenlik-başlığı denetimleri henüz yapılmadı.


- [x] 🟢🛠 **Güvenlik başlıkları** — TAMAM (zaten kuruluydu): CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy (Nginx `sites-available/beracore.com`).
- [x] 🟢🛠 **Statik varlık cache** — TAMAM (27 Tem 2026): `/public` görselleri artık `max-age=2592000` (Nginx `proxy_hide_header` + regex location). `_next/static` immutable korundu. gzip+brotli zaten açık.
- [x] 🟢🛠 **Yapısal veri doğrulaması** — TAMAM: tüm sayfa tiplerinde JSON-LD geçerli (ProfessionalService/Service/FAQPage/BreadcrumbList/BlogPosting/ItemList/AboutPage).
- [ ] 🟢🛠/👤 **Core Web Vitals / Lighthouse** — LCP/CLS ve animasyonlar optimize edildi; kesin skor için 👤 [PageSpeed Insights](https://pagespeed.web.dev) ile canlı ölçüm (URL bazlı, kullanıcı çalıştırabilir).
- [x] 🟢🛠 **Erişilebilirlik (a11y) denetimi** — TAMAM (28 Tem 2026). Kontrast: tüm metin tokenları WCAG AA geçiyor (t1 15.30:1, t2 9.29:1, t3 4.87:1, accent 10.19:1, accent2 15.88:1). `lang="tr"`, tek H1/sayfa, alt metinleri, ikon butonlarda aria-label, dekoratif svg'lerde aria-hidden, reduced-motion desteği doğrulandı. **Düzeltilen:** form alanlarında klavye odak göstergesi görünmezdi (`outline:none` + %40 opak kenarlık) → görünür odak halkası eklendi (`focus-within` kenarlık + ring).
- [x] 🟢🛠 **Çapraz tarayıcı / mobil test** + 404 — TAMAM (28 Tem 2026). 404 sayfası doğru HTTP 404 döndürüyor ve yönlendirme linkleri içeriyor. **Düzeltilen:** `backdrop-filter` kullanılan 3 yerde `-webkit-` öneki eksikti (iOS Safari 15 ve öncesinde blur çalışmıyordu) → eklendi.

---

## Kullanıcıdan beklenen girdiler (özet)
1. İletişim formu için e-posta/SMTP bilgisi + talep alıcı adresi 🔴
2. Search Console "Dizine eklendi/eklenmedi" sayıları 🔴
3. GA4 ölçüm kimliği 🟡
4. Yandex doğrulama etiketi 🟢
5. Gerçek müşteri yorumları (varsa) 🟡
6. Portfolyo bilgisi: projeler + sonuçlar 🟡
7. (Sonra) Google Business Profile, sosyal hesaplar, backlink 🟢

## Geliştiricinin tek başına ilerleyebileceği işler (girdi beklemeden)
- Şehir bazlı hizmet sayfaları · portfolyo sayfa iskeleti · ek blog yazıları ·
  Lighthouse/a11y/güvenlik başlıkları denetimi · yapısal veri doğrulaması
