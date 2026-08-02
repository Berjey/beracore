# BERACORE — Entegrasyon Mimarisi

**Son güncelleme:** 2 Ağustos 2026

---

## İlke: adapter, doğrudan bağımlılık değil

Entegrasyonlar iş mantığına gömülmez. Her sağlayıcı bir **adapter** arkasındadır; iş katmanı
yalnızca arayüzü bilir.

```
src/lib/entegrasyon/
├── tipler.ts            ortak arayüzler + hata tipleri
├── kayit.ts             sağlayıcı kaydı, bağlantı durumu
├── posta/{imap,smtp}.ts
├── google/{gsc,ga4,psi}.ts
├── bing/webmaster.ts
└── ai/{saglayici,yonlendirme}.ts
```

Gerekçe pratik: Hostinger'dan Google Workspace'e geçiş, GA4'ün API değiştirmesi veya
AI sağlayıcısının fiyat değiştirmesi durumunda **tek dosya** değişir.

## Her entegrasyonda zorunlu alanlar

Bağlantı durumu · son senkronizasyon · son hata · yeniden deneme sayacı · yetki kapsamı ·
token süresi · webhook durumu · **test bağlantısı** düğmesi · bağlantıyı kaldırma · veri kapsamı.

## Sır yönetimi

Kimlik bilgileri **kaynak kodda tutulmaz**. VPS `/var/www/beracore/.env` (chmod 600, git dışı).
Veritabanında yalnızca `credential_references` — sırrın kendisi değil, nerede olduğunun kaydı.
`scripts/secret-scan.mjs` push öncesi kontrol eder.

---

## Durum

| Entegrasyon | Faz | Durum | Maliyet |
|---|---|---|---|
| SMTP (Hostinger) | ✅ Faz A | Kurulu — `api/contact` kullanıyor | Mevcut |
| IMAP (Hostinger) | Faz 3 | Planlandı | Mevcut hesap |
| Google Search Console | Faz 6 | Planlandı | Ücretsiz |
| Google Analytics 4 Data API | Faz 6 | Planlandı (GA4 mülkü kurulu: `G-NX5SRKJT2M`) | Ücretsiz |
| PageSpeed Insights | Faz 6 | Planlandı | Ücretsiz |
| Bing Webmaster | Faz 6 | Hesap var, API planlandı | Ücretsiz |
| IndexNow | ✅ Kurulu | `scripts/indexnow-submit.mjs`, her deploy'da | Ücretsiz |
| AI model sağlayıcı | Faz 8 | Planlandı | **Tek sürekli gider** |
| Google Business Profile | — | Kullanıcı kararıyla ertelendi | Ücretsiz |
| Takvim / Drive / GitHub / Slack | Sonraki sürüm | Adapter hazırlanacak | Ücretsiz katman |
| E-imza | Sonraki sürüm | Mimari hazır, sağlayıcı seçilmedi | Ücretli |
| Muhasebe / ödeme | Sonraki sürüm | Adapter hazır | Ücretli |

---

## Faz 3 — Posta

**IMAP:** `imap.hostinger.com:993` (TLS). Kütüphane `imapflow` — saf JS, yerel bağımlılık yok
(ABI riski yok; `node:sqlite` tercihiyle aynı gerekçe). MIME çözümleme `mailparser`.

**Senkronizasyon:** zarf/başlık bilgileri SQLite'a yazılır, gövdeler istendiğinde çekilir.
Kalıcı IMAP IDLE bağlantısı yerine **60 sn yoklama + elle tazeleme** — tek süreçte kalıcı
bağlantı yeniden bağlanma fırtınası riski taşır; yoklama basit ve dayanıklı.

**Güvenlik:**
- Gelen HTML `sanitize-html` ile temizlenir (script, style, event handler)
- `sandbox` özellikli `<iframe srcdoc>` içinde render → CSS sızıntısı yok
- **Uzak görseller varsayılan kapalı.** CSP zaten `img-src 'self' data: blob:` — takip
  pikselleri kendiliğinden engellenir. "Göster" denince `/admin/posta/gorsel?u=…`
  proxy'sinden geçer → gönderen IP öğrenemez.

**Gönderim:** mevcut nodemailer transporter'ı `src/lib/mail/smtp.ts`'e çıkarılır;
`api/contact` oradan import eder. Yanıt `In-Reply-To` + `References` ile zincire bağlanır,
IMAP `append()` ile Gönderilenler'e yazılır.

**Eşleştirme:** konudaki `BRC-YYYYMMDD-XXXX` → ilgili lead; bulunamazsa gönderen adresi
`leads.email` / `contacts.email` ile eşleştirilir.

**Yeni `.env`:** `IMAP_HOST`, `IMAP_PORT`, `IMAP_SECURE`, `IMAP_USER`, `IMAP_PASS`
(mevcut SMTP parolası — **kullanıcının parola değiştirmesi gerekmiyor**).

## Faz 6 — Google ve Bing

Tek servis hesabı; GSC ve GA4 property'lerine okuma yetkisi verilir.
Çağrılar **sunucu tarafında** yapılır → CSP değişmez, anahtar tarayıcıya gitmez.

Kotalar düşük değil ama sınırsız da değil: sonuçlar `seo_metrics` tablosunda önbelleklenir,
senkron arka plan işi olarak günde birkaç kez çalışır. Panel her açılışta API'ye gitmez.

**Yeni `.env`:** `GOOGLE_SERVICE_ACCOUNT_JSON` (dosya yolu), `GA4_PROPERTY_ID`, `GSC_SITE_URL`.

## Faz 8 — AI sağlayıcı

Model çağrıları `src/lib/entegrasyon/ai/saglayici.ts` arkasında. Göreve göre model
yönlendirme (basit sınıflandırma → ekonomik model, karmaşık analiz → güçlü model),
token/maliyet takibi, yeniden deneme, zaman aşımı, hız sınırı, yedek model,
yapılandırılmış çıktı + şema doğrulama.

**Yeni `.env`:** sağlayıcı API anahtarı, aylık bütçe limiti.

---

## Kapalı API'ler — dürüst değerlendirme

Instagram, LinkedIn, X ve Google İşletme Profili **otomatik takibe kapalıdır**
(API kısıtlı, ticari doğrulama veya ücretli erişim gerektirir).

Bu platformlar için panel **manuel takip listesi** tutar (`presence_items`, Faz 9):
platform, profil linki, durum, son kontrol tarihi, elle girilen metrikler.

Bunu "otomatik sosyal medya panosu" gibi göstermek yanlış olurdu. Panel, veri kaynağı
bağlı olmayan hiçbir alanda uydurma sayı göstermez — **"Veri kaynağı bağlı değil"** yazar.

---

## Bağımlılık ekleme kuralı

Her yeni npm paketi için dokümante edilir: neden gerekli · alternatifleri · bundle ve
performans etkisi · bakım durumu (son sürüm, açık güvenlik uyarısı) · güvenlik etkisi.

**Yerel (native) bağımlılık eklenmez.** Gerekçe kayıtlı: Node 20→24 yükseltmesinde `sharp`
tam bu yüzden `node_modules` silinip yeniden kurulmak zorunda kaldı ve görsel optimizasyonu
çöktü. `better-sqlite3` yerine `node:sqlite` tercihi de aynı sebeple yapıldı.

> ⚠️ Paket eklemek `package-lock.json`'ı değiştirir → `server-deploy.sh` **pm2 stop + npm ci +
> pm2 start** dalına girer (kısa kesinti). Bir fazın tüm paketleri **tek deploy'da** eklenmeli.
