# BERACORE — Yol Haritası (Business Operating System)

**Onaylı plan.** `docs/panel-crm-plani.md`'nin yerini alır.
**Son güncelleme:** 2 Ağustos 2026 — Faz 0 büyük ölçüde tamamlandı

---

## Hedef

BERACORE'un satıştan teslimata kadar tüm operasyonunu, mevcut web sitesinin **tasarımını ve
SEO bütünlüğünü bozmadan**, tek bir güvenli panelden yönetilebilir hâle getirmek.

Ölçek: 24 modül · 9 faz · ~60 veri varlığı · 15 AI çalışanı. **Aylara yayılan bir program.**
Her faz tek başına canlıya alınabilir ve tek başına değer üretir.

---

## Faz durumu

| Faz | Kapsam | Durum |
|---|---|---|
| **0** | Audit, dokümanlar, güvenlik onarımı, yedek doğrulaması, test altyapısı, feature flag, staging | 🔵 %85 |
| **1** | Merkezi şirket ayarları · kanıtlı metrikler · içerik DB'ye · referans · vaka çalışması · hukuki versiyonlama · SEO/erişilebilirlik | 🔲 |
| **2** | Auth, MFA, kullanıcı, rol, yetki, denetim, bildirim, dosya, global arama | 🔲 |
| **3** | CRM (şirket/kişi/lead/pipeline) · **birleşik gelen kutusu (IMAP+SMTP)** · AI özet · atama · SLA | 🔲 |
| **4** | Fırsat · teklif oluşturucu + PDF + takip · sözleşme · onay akışları | 🔲 |
| **5** | Müşteri · proje · milestone · görev · **müşteri portalı** · destek | 🔲 |
| **6** | GSC/GA4/Bing · SEO issue motoru · CMS · içerik takvimi · AI içerik desteği | 🔲 |
| **7** | Firma keşfi · lead scoring · kampanya · teslimat sağlığı · suppression | 🔲 |
| **8** | AI çalışan kaydı · prompt yönetimi · model yönlendirme · bilgi tabanı · onay · maliyet · otomasyon | 🔲 |
| **9** | Finans · karlılık · raporlama · yönetici dashboard · optimizasyon · güvenlik sertleştirme | 🔲 |

> **Faz sırası notu:** Posta merkezi Faz 3'te. Öne çekilebilir ama **önerilmiyor** — panelin
> şirket adına mail gönderebilmesi, önce Faz 2'nin getirdiği RBAC + MFA + denetim günlüğünü
> gerektirir. Yetkisiz erişimin bedeli "talep listesi görüldü"den "şirket adına mail
> gönderildi"ye çıkar.

---

## Kilitli kararlar

| Konu | Karar | Sonuç |
|---|---|---|
| İçerik mimarisi | **DB + on-demand revalidation** | Kaydet → sayfa saniyeler içinde yeniden üretilir, statik HTML servis edilmeye devam eder |
| E-posta | **Tam IMAP + SMTP istemcisi** | Gelen kutusu, arama, ek, yanıt, Gönderilenler, talep eşleşmesi |
| Veritabanı | `node:sqlite` (yerleşik) | Yerel modül yok → ABI riski yok |
| Kuyruk / işçi | PM2 ikinci süreç + SQLite kuyruk | Yeni servis yok |
| Staging | Aynı VPS, ikinci port, `noindex` | Ek maliyet yok |

### İçeriğin git'ten çıkmasının karşılığı

| Kayıp | Karşı önlem |
|---|---|
| `git revert` | `content_versions` — her kaydetmede önceki hâl, tek tıkla geri alma |
| Repoda yedek | Gecelik SQLite yedeği (**doğrulandı**) + panelden JSON dışa aktarma |
| Veri bütünlüğü testleri | `scripts/content-check.mjs` — aynı kuralları DB'ye karşı çalıştırır |

---

## Değişmeyecek ilkeler

**Site:** tasarım, renk, tipografi, animasyon, navigasyon, route yapısı, component tasarım
dili korunur. Yeni UI framework yok. Çalışan bileşenler gereksiz yere yeniden yazılmaz.

**Kod** (bedeli ödenerek öğrenildi — ayrıntı `CLAUDE.md`):
- Oturum çerezi kuran işlem Server Action olamaz → form POST + rota işleyicisi
- Yönlendirme hedefi `Host` başlığından kurulur, `req.url`'den değil
- `Secure` bayrağı `X-Forwarded-Proto`'dan türetilir
- `.env` değerlerinde `$` yok (dotenv-expand)
- `(korumali)` rota grubu korunur
- Yerel (native) bağımlılık eklenmez
- Kabuk script'leri LF (`.gitattributes`)
- Public site paketine panel kodu sızmaz

**İçerik:** uydurma müşteri, yorum, istatistik veya vaka çalışması üretilmez.
`Testimonials.tsx` içindeki 3 yorum **gerçek müşterilere aittir**.

---

## Faz 0 — durum

| İş | Durum |
|---|---|
| Güvenlik onarımı (rotasyon, geçmiş temizliği, sır tarayıcı) | ✅ |
| Yedek onarımı + **geri yükleme testi** | ✅ |
| ISR önbellek koruması | ✅ |
| `feature_flags` + `activity_log` | ✅ |
| Test altyapısı (36 → 82) | ✅ |
| 9 doküman | ✅ |
| Staging / preview ortamı | 🔲 |
| `CLAUDE.md` + `yol-haritasi.md` bağlama | 🔲 |

Ayrıntılı bulgular: `BERACORE_SYSTEM_AUDIT.md` · Yapılanların kaydı: `BERACORE_CHANGELOG.md`

---

## Faz 1 — sıradaki

**Öncelik sırası** (her madde tek başına canlıya alınabilir):

1. **Merkezi şirket ayarları** — telefon/e-posta/adres bugün 6+ dosyada kopyalı (A-08).
   Tek kaynağa bağlanır; JSON-LD `sameAs` da buradan beslenir (A-18).
2. **Şirket metrikleri** — kanıt alanlarıyla birlikte. **Kanıtsız metrik public sitede
   görünmez** (A-07). Ticari sonucu var: kanıt gelene kadar ana sayfada bir bölüm boşalır.
3. **İçeriğin veritabanına taşınması** — blog (50) → hizmet (6+23) → şehir (24) → hukuki (4).
   Her adımda **aktarım öncesi/sonrası HTML birebir karşılaştırılır**.
4. **Referanslar + vaka çalışmaları** — yalnızca yayın izni olan ve doğrulanmış kayıtlar.
5. **Hukuki versiyonlama** (A-11) — versiyon, yürürlük tarihi, onaylayan, revizyon geçmişi.
6. **SEO/erişilebilirlik düzeltmeleri** — sayaçların JS'siz gerçek değeri (A-09),
   uzunluk limiti uyumsuzluğu (A-10).

**Kullanıcıdan gerekecek:** ticari unvan, vergi dairesi/no, MERSİS, açık adres, çalışma
saatleri · **sayısal iddiaların kanıtı** · vaka çalışması için müşteri yayın izni.

---

## Maliyet duruşu

Programın **tek zorunlu yeni harcaması AI model kullanımı** (Faz 8). Geri kalan her şey
mevcut altyapıda çalışır: veritabanı yerleşik · kuyruk PM2'nin ikinci süreci · staging aynı
sunucu · posta mevcut Hostinger hesabı · GA4/GSC/Bing/PageSpeed ücretsiz.

Yeni SaaS önerilmez. Eklenen her npm paketi için gerekçe, alternatif, bundle etkisi, bakım
durumu ve güvenlik etkisi dokümante edilir (`BERACORE_INTEGRATIONS.md`).

---

## Kullanıcıdan gerekecekler (faz sırasına göre)

| Faz | Ne |
|---|---|
| 1 | Ticari unvan, vergi/MERSİS, adres, çalışma saatleri |
| 1 | Sayısal iddiaların kanıtı (25+ proje, 15+ müşteri, %97 memnuniyet) |
| 1 | Vaka çalışması için müşteri yayın izni |
| 3 | IMAP parolası — mevcut SMTP parolası kullanılır, **değiştirmek gerekmiyor** |
| 6 | Google Cloud servis hesabı (GA4 + Search Console) — ücretsiz |
| 8 | AI model sağlayıcı API anahtarı + aylık bütçe limiti |

---

## Her faz sonunda

```
npm run lint → npm test → npm run build → npm run seo-audit → secret-scan
→ staging duman testi → 111 URL 200 → onay → production
→ local = GitHub = VPS commit kontrolü
```

Faz sonu raporu `BERACORE_CHANGELOG.md`'ye yazılır: tamamlananlar · değişen dosyalar ·
DB değişiklikleri · yeni env değişkenleri · testler · sonuçlar · bilinen eksikler ·
güvenlik etkisi · geri alma yöntemi · sonraki faz.
