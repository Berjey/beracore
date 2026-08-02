# BERACORE — Yapay Zekâ İş Gücü

**Uygulama fazı:** Faz 8 · **Durum:** tasarım

Sistemde yapay zekâ tek bir genel sohbet botu değil, **görev ve yetkileri tanımlı dijital
çalışanlar** olarak yapılandırılır. Her çalışanın ne yapabileceği kadar **ne yapamayacağı** da
yazılıdır.

---

## Değişmez kurallar

1. **AI müşteriye doğrudan mesaj göndermez.** Taslak üretir, insan onaylar, sistem gönderir.
2. **AI uydurmaz.** Müşteri, yorum, istatistik, referans veya sonuç üretmesi yasaktır.
   Doğrulanamayan bilgi "bilinmiyor" olarak işaretlenir.
3. **AI hukuki veya finansal karar vermez.** Riski gösterir, insan karar verir.
4. **AI yetkisiz veri görmez.** Bağlama yalnızca çalışanın veri kapsamındaki kayıtlar girer.
5. **Her yürütme loglanır ve maliyeti ölçülür.**
6. **Bütçe limiti aşılırsa otomasyon durur.**

## Onay seviyeleri

| Seviye | Anlamı | Örnek |
|---|---|---|
| `oku` | Yalnızca okur ve raporlar | Günlük özet |
| `oneri` | Öneri üretir, hiçbir şey yazmaz | Lead skoru gerekçesi |
| `taslak` | Kayıt oluşturur ama **taslak** durumunda | E-posta yanıtı, blog taslağı |
| `onayli-yazma` | İnsan onayından sonra uygular | Durum değişikliği, görev atama |
| `otomatik` | Onaysız uygular — **yalnızca geri alınabilir, dışa dönük olmayan işler** | Etiketleme, mükerrer işaretleme |

Dışa dönük hiçbir işlem (mail, teklif, sözleşme, ödeme, deploy) `otomatik` olamaz.

---

## Çalışanlar

| # | Çalışan | Departman | Seviye | Ana görev |
|---|---|---|---|---|
| 1 | Executive Assistant | Yönetim | `oku` | Günlük özet, öncelik listesi, geciken işler |
| 2 | Strategy Director | Yönetim | `oneri` | Performans analizi, büyüme fırsatı, aylık rapor |
| 3 | Sales Development Rep | Satış | `taslak` | Lead skoru, ihtiyaç sinyali, ilk temas taslağı |
| 4 | Account Executive | Satış | `taslak` | Görüşme notu analizi, teklif taslağı, kapanış olasılığı |
| 5 | CRM Specialist | Satış | `oneri` | Mükerrer kayıt, eksik veri, veri kalitesi raporu |
| 6 | Customer Success | Müşteri | `taslak` | Memnuniyet riski, yenileme takibi, ek satış fırsatı |
| 7 | Project Manager | Üretim | `onayli-yazma` | Plan taslağı, gecikme riski, toplantıdan görev çıkarma |
| 8 | Solutions Architect | Üretim | `taslak` | Teknik çözüm taslağı, entegrasyon, risk |
| 9 | SEO Director | Pazarlama | `taslak` | Sorun önceliklendirme, anahtar kelime, iç link, aylık rapor |
| 10 | Content Strategist | Pazarlama | `taslak` | İçerik takvimi, küme, brief, güncelleme planı |
| 11 | Copywriter | Pazarlama | `taslak` | Blog/hizmet/e-posta metni, meta açıklama, CTA |
| 12 | Growth Analyst | Pazarlama | `oneri` | Trafik, dönüşüm, kampanya, huni, A/B önerisi |
| 13 | Finance Assistant | Finans | `oneri` | Geciken tahsilat, karlılık, bütçe sapması, AI maliyeti |
| 14 | Legal & Compliance | Hukuk | `oneri` | Eksik alan, versiyon farkı, KVKK riski işaretleme |
| 15 | Security & QA Auditor | Teknik | `oneri` | Yetki hatası, şüpheli oturum, test özeti, release listesi |

### Kritik yasaklar (çalışan bazında)

- **SDR / Account Executive:** kampanya başlatamaz, e-posta gönderemez, **fiyat belirleyemez**
- **Customer Success:** müşteriye onaysız mesaj gönderemez
- **Project Manager:** görev atamasını ve tarihi onaysız değiştiremez
- **Solutions Architect:** kod veya altyapı değişikliğini production'a uygulayamaz
- **SEO Director:** `noindex`, canonical, URL ve `robots.txt` değişikliğini **otomatik yayınlayamaz**
- **Copywriter:** sahte veri/müşteri/istatistik/yorum üretemez
- **Finance Assistant:** ödeme veya muhasebe kaydı gerçekleştiremez
- **Legal:** "uygundur" kararı veremez
- **CRM Specialist:** kayıt silemez (yalnızca mükerrer işaretler)

---

## Orkestrasyon

**Sağlayıcı bağımsızlığı.** Model çağrıları bir adapter arkasındadır; sağlayıcı
değiştirilebilir olmalıdır. Göreve göre model seçilir:

| Görev tipi | Model sınıfı | Gerekçe |
|---|---|---|
| Sınıflandırma, etiketleme, duygu | Ekonomik | Basit iş için pahalı model israf |
| Özetleme, taslak metin | Orta | Kalite/maliyet dengesi |
| Strateji, teknik çözüm, karmaşık analiz | Güçlü | Hata maliyeti yüksek |

**Yapılandırılmış çıktı zorunlu.** Her çalışan bir JSON şeması döndürür; şema doğrulanır,
uymayan çıktı yeniden istenir. Serbest metin yalnızca insana gösterilecek alanlarda.

**Bilgi tabanı.** Hizmetler, projeler, teklifler, blog içeriği, marka dili, fiyatlandırma
kuralları ve geçmiş iletişimler. Erişim çalışanın veri kapsamıyla sınırlıdır; müşteri
verileri birbirine karışmaz.

**Halüsinasyon kontrolü:** kaynak gösterme zorunluluğu · güven skoru · doğrulanamayan
bilginin "bilinmiyor" olarak işaretlenmesi · sayısal iddiaların `company_metrics` ile
çapraz kontrolü.

## Maliyet kontrolü

- Kullanıcı, departman ve çalışan bazında aylık bütçe limiti
- İşlem öncesi tahmini maliyet gösterilir
- Aynı veri tekrar tekrar modele gönderilmez (özet + önbellek)
- Token kullanımı `ai_executions`'a yazılır; proje/müşteri ile ilişkilendirilebilir
- **Limit aşımında otomasyonlar durur** ve bildirim gider

## Otomasyon merkezi

Kod yazmadan kural kurulur: **tetikleyici → koşullar → aksiyonlar → onay gereksinimi**.

Tetikleyici örnekleri: yeni form talebi · yeni e-posta · lead aşaması değişti ·
teklif görüntülendi · teklif süresi doluyor · ödeme gecikti · görev gecikti ·
müşteri yanıt vermedi · SEO sorunu bulundu · AI maliyet limiti aşıldı · güvenlik uyarısı.

Aksiyon örnekleri: görev oluştur · ata · bildirim gönder · **e-posta taslağı oluştur** ·
etiket ekle · AI analizi çalıştır · rapor üret · webhook · onay iste · kampanyayı durdur.

Her otomasyonda: test modu, hata politikası, yeniden deneme, çalışma geçmişi, başarı oranı.

## Değerlendirme

Her çalışan için düzenli ölçüm: taslakların onay oranı · insan düzeltme miktarı ·
yanlış pozitif oranı · işlem başına maliyet · kazandırılan süre.

Onay oranı düşen bir çalışanın prompt'u gözden geçirilir. Sürekli düzeltilen bir çalışan,
yardım değil yük demektir — kapatılır.
