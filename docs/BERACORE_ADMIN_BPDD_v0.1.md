# BERACORE — Business Product Design Document (BPDD) v0.1

**Tarih:** 2 Ağustos 2026 · **Durum:** Faz 0 devam ediyor
**Kapsam:** BERACORE Business Operating System — web sitesi + yönetim paneli + AI iş gücü

Bu doküman ne inşa edileceğini ve neyin bilinçli olarak dışarıda bırakıldığını tanımlar.
Faz sırası ve teslim planı için `BERACORE_ADMIN_ROADMAP.md`.

---

## 1. Amaç

BERACORE'un satıştan teslimata kadar tüm operasyonunu, mevcut web sitesinin tasarımını ve
SEO bütünlüğünü **bozmadan**, tek bir güvenli panelden yönetilebilir hâle getirmek.

Sistem bir "admin paneli" değil, şirketin dijital operasyon merkezidir.

## 2. İş hedefleri

| # | Hedef | Nasıl ölçülür |
|---|---|---|
| H1 | Hiçbir müşteri talebi kaybolmasın | Form gönderimi ↔ DB kaydı sayısı birebir; `mail_sent=0` kayıtlar görünür |
| H2 | Gelen iletişime yanıt süresi kısalsın | İlk yanıt süresi (SLA) ölçülür |
| H3 | Site içeriği geliştirici beklemeden güncellensin | Yayın için gereken adım sayısı; yayın→canlı gecikmesi |
| H4 | Sitedeki her iddia kanıtlanabilir olsun | Kanıtlı metrik oranı; "doğrulama bekliyor" sayısı |
| H5 | Organik görünürlük artsın | GSC indekslenen sayfa, tıklama, ortalama pozisyon |
| H6 | Proje kârlılığı görünür olsun | Proje bazlı gelir − maliyet |
| H7 | Operasyon tekrar eden işten kurtulsun | Otomasyon çalışma sayısı; AI taslak → onay oranı |

## 3. Kullanıcı tipleri

| Tip | Kim | Erişim |
|---|---|---|
| Owner | Şirket sahibi | Tam yetki; yetki devri ve güvenlik ayarları |
| Yönetici | Genel yönetim | Finans dahil çoğu modül |
| Satış | Satış temsilcisi / AE | CRM, teklif, kampanya (gönderim onaya bağlı) |
| Üretim | PM, geliştirici, tasarımcı | Proje, görev, dosya |
| İçerik/SEO | Editör, SEO uzmanı | İçerik, SEO, yayın onayı |
| Finans | Muhasebe | Fatura, ödeme, karlılık |
| Hukuk | Hukuk gözden geçiren | Sözleşme ve hukuki metin inceleme |
| Destek | Destek | Talepler, gelen kutusu |
| Müşteri | Dış kullanıcı | **Yalnızca müşteri portalı**, yalnızca kendi verisi |
| AI çalışan | Sistem aktörü | Tanımlı araç + veri kapsamı; yazma işlemleri onaya bağlı |

## 4. Ana kullanıcı senaryoları

**S1 — Talep gelir:** Ziyaretçi formu doldurur → lead DB'ye yazılır (SMTP'den önce) → bildirim
maili gider → panelde "yeni" olarak görünür → AI özet ve öncelik önerir → sorumlu atanır →
yanıt taslağı hazırlanır → **insan onaylar** → gönderilir → takip görevi oluşur.

**S2 — İçerik yayınlanır:** Editör panelde yazıyı hazırlar → kalite kapısı meta/H2/SSS/iç linki
kontrol eder → önizleme → onay → yayın → ilgili sayfalar yeniden üretilir → sitemap güncellenir →
IndexNow bildirimi gider → performans izlenir.

**S3 — Satış kapanır:** Lead fırsata dönüşür → teklif hazırlanır (AI taslak, fiyatı **insan**
belirler) → gönderilir, görüntülenme izlenir → kabul → sözleşme → müşteri + proje kaydı oluşur.

**S4 — SEO sorunu düzelir:** Entegrasyon sorunu bulur → AI önceliklendirir ve çözüm önerir →
değişiklik taslağı + preview → insan onaylar → yayınlanır → sonuç ölçülür → gerekirse geri alınır.

**S5 — Metrik doğrulanır:** Sitede gösterilecek her sayı kanıt alanlarıyla kaydedilir →
doğrulanmadan **public sitede görünmez**.

## 5. Modüller

`01` Yönetici Özeti · `02` Birleşik Gelen Kutusu · `03` CRM · `04` Satış/Fırsat ·
`05` Etik Outbound · `06` Teklif & Sözleşme · `07` Müşteriler · `08` Projeler ·
`09` Görev & İş Akışı · `10` Müşteri Portalı · `11` Web Sitesi Yönetimi · `12` Blog & İçerik ·
`13` SEO & Webmaster · `14` Pazarlama · `15` Analitik & Raporlama · `16` Finans ·
`17` Destek · `18` Doküman & Bilgi · `19` AI Çalışanları · `20` Otomasyon ·
`21` Ekip & Yetkiler · `22` Entegrasyonlar · `23` Güvenlik & Denetim · `24` Sistem Ayarları

## 6. Fonksiyonel gereksinimler (çekirdek)

- **F-01** İletişim formundan gelen her talep, e-posta gönderiminden **önce** kalıcı olarak kaydedilir.
- **F-02** E-posta gönderilemezse talep yine kaydedilir ve panelde işaretlenir.
- **F-03** Şirket bilgileri (ad, telefon, e-posta, adres, saatler, sosyal) tek kaynaktan yönetilir; site oradan okur.
- **F-04** Sitede gösterilen her sayısal iddia bir metrik kaydına bağlıdır; **doğrulanmamış metrik yayınlanmaz**.
- **F-05** Blog, hizmet, şehir ve hukuki içerik panelden düzenlenir; yayın sonrası ilgili sayfalar yeniden üretilir.
- **F-06** İçerik yayını öncesi kalite kapısı çalışır (meta uzunluğu, tek H1, min H2, SSS, iç link, ince içerik).
- **F-07** Her içerik değişikliği sürümlenir ve geri alınabilir.
- **F-08** Gelen e-postalar panelde okunur, yanıtlanır; yanıt Gönderilenler'e yazılır.
- **F-09** Gelen e-posta ilgili lead/müşteri kaydıyla eşleştirilir.
- **F-10** Kullanıcılar rol bazlı yetkilendirilir; yetki modül × işlem düzeyinde tanımlanır.
- **F-11** Her kritik işlem denetim günlüğüne yazılır; günlük değiştirilemez.
- **F-12** AI çalışanları taslak üretir; **müşteriye giden hiçbir mesaj insan onayı olmadan gönderilmez**.
- **F-13** Toplu e-posta kampanyaları insan onayı olmadan başlatılamaz; unsubscribe kalıcıdır.
- **F-14** Müşteri portalı yalnızca o müşterinin verisini gösterir; iç notlar ve maliyetler görünmez.
- **F-15** Yarım modüller özellik bayrağı arkasında canlıya alınabilir; varsayılan kapalıdır.

## 7. Fonksiyonel olmayan gereksinimler

| Alan | Gereksinim |
|---|---|
| Performans | Public sayfalar statik servis edilmeye devam eder; Core Web Vitals "iyi" bandında kalır |
| Panel performansı | Liste ekranları sunucu tarafı sayfalama/filtreleme; uzun işler arka planda |
| Kullanılabilirlik | Panel Türkçe; mobilde temel işlemler yapılabilir |
| Erişilebilirlik | WCAG AA kontrast, klavye navigasyonu, 24×24px dokunma hedefi |
| Güvenlik | `BERACORE_SECURITY_MODEL.md` |
| Dayanıklılık | Gecelik yedek + doğrulanmış geri yükleme; her faz için geri alma yöntemi |
| Maliyet | Yeni SaaS yok; tek sürekli gider AI model kullanımı |
| Taşınabilirlik | Tek VPS, tek Next.js süreci + bir işçi süreç; yerel (native) bağımlılık yok |

## 8. Veri modeli

`BERACORE_DATA_MODEL.md`.

## 9. Entegrasyonlar

`BERACORE_INTEGRATIONS.md`.

## 10. AI çalışanları ve otomasyon

`BERACORE_AI_WORKFORCE.md`.

## 11. Güvenlik ve KVKK

`BERACORE_SECURITY_MODEL.md`. Özet ilkeler:

- Sır kaynak koda yazılmaz; `secret-scan` deploy'u durdurur.
- Müşteri erişim bilgileri düz metin saklanmaz.
- Kişisel veri yalnızca hukuki dayanakla işlenir; izin ve suppression kayıtları tutulur.
- Sistem "hukuken uygundur" kararı **vermez**; riski gösterir, insan onayı ister.

## 12. Test kriterleri

`BERACORE_TEST_PLAN.md`.

## 13. Kabul kriterleri (özellik bazında)

Bir özellik ancak şu koşullarda tamamlanmış sayılır: fonksiyonel gereksinimi karşılıyor ·
yetki kontrolleri çalışıyor · girdi doğrulaması var · hata senaryoları ele alınmış ·
denetim günlüğü yazıyor · responsive · erişilebilirlik kontrollerinden geçiyor ·
testleri yazıldı ve geçti · dokümantasyon güncellendi · env değişkenleri belgelendi ·
migration test edildi · geri alma yöntemi hazır · güvenlik etkisi değerlendirildi ·
mevcut site tasarımını bozmuyor · regresyon üretmiyor.

## 14. Bilinen riskler

| Risk | Etki | Azaltma |
|---|---|---|
| İçerik DB'ye taşınırken SEO regresyonu | Yüksek | Taşıma öncesi/sonrası üretilen HTML birebir karşılaştırılır; `seo-audit` 0 bulgu şartı |
| İçerik git geçmişinden çıkıyor | Orta | Sürüm geçmişi + JSON dışa aktarma + gecelik yedek |
| ISR önbelleği deploy'da sıfırlanması | Orta | Faz 0'da çözüldü (`.next/cache` taşınıyor) |
| Panel posta gönderebilir hâle geliyor | Yüksek | Faz 2 (RBAC + MFA + denetim) Faz 3'ten **önce** |
| Outbound satışta KVKK/ETK ihlali | Yüksek | İzin kaydı, suppression, gönderim limiti, insan onayı; sistem uygunluk kararı vermez |
| AI maliyetinin kontrolsüz büyümesi | Orta | Model yönlendirme, bütçe limiti, limit aşımında otomasyon durur |
| AI'ın uydurma bilgi üretmesi | Yüksek | Yapılandırılmış çıktı + şema doğrulama + kaynak gösterme + insan onayı |
| Tek VPS — donanım arızası | Yüksek | Doğrulanmış yedek; sunucu dışı kopya (açık madde) |
| Kanıtsız metriklerin siteden düşmesi | Orta (ticari) | Kullanıcıya önceden bildirildi; kanıt sağlanınca geri gelir |

## 15. Sonraki sürümlere bırakılanlar

Çok dilli içerik (TR/EN) altyapısı hazırlanır, içerik üretimi ertelenir · e-imza entegrasyonu
(mimari hazır, sağlayıcı sonra) · muhasebe/ödeme sağlayıcı entegrasyonu (adapter hazır) ·
mobil uygulama bildirimleri · WhatsApp Business API (izin gerektirir) · sunucu dışı yedek kopya.

## 16. Kapsam dışı (bilinçli)

- Public sitenin yeniden tasarımı, yeni UI framework, gereksiz route değişikliği
- Resmî muhasebe/e-fatura yerine geçmek
- Uydurma müşteri, yorum, istatistik veya vaka çalışması
- Satın alınmış e-posta listesi, izinsiz kişisel veri toplama
- AI'ın onaysız mesaj göndermesi, deploy yapması, sözleşme onaylaması veya ödeme gerçekleştirmesi
