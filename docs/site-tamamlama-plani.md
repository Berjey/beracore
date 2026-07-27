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

- [ ] 🟡🛠 **Gerçek müşteri referansları** — `Testimonials.tsx` şu an placeholder. Gerçek yorumlarla değiştirilecek. → 👤 gerekli: 3-6 gerçek müşteri yorumu (isim/şirket/metin) veya "yeni stüdyo" konumlandırması için alternatif kurgu.
- [ ] 🟡🛠 **Portfolyo / Vaka çalışması sayfaları** — `/calismalarimiz` (veya `/portfolyo`) + tekil vaka sayfaları. Güçlü sosyal kanıt + SEO. → 👤 gerekli: hangi projeler yapıldı, ne sonuç verdi (rakam/ekran görüntüsü).
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


- [ ] 🟢🛠 **Core Web Vitals / Lighthouse** — mobil+masaüstü performans, erişilebilirlik, SEO skoru denetimi ve düzeltmeleri.
- [ ] 🟢🛠 **Erişilebilirlik (a11y) denetimi** — kontrast, klavye navigasyonu, ARIA, alt metinler.
- [ ] 🟢🛠 **Yapısal veri doğrulaması** — Rich Results Test ile tüm şablonlar.
- [ ] 🟢🛠 **Güvenlik başlıkları** — CSP, HSTS, X-Frame-Options vb. (Nginx).
- [ ] 🟢🛠 **Çapraz tarayıcı / mobil test** + 404 ve hata durumları cilası.

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
