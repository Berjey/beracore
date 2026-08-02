# BERACORE — Test Planı

**Son güncelleme:** 2 Ağustos 2026 (Faz 0) · **Mevcut:** 82 test, ~1 sn, sıfır ek bağımlılık

---

## Altyapı

Node'un yerleşik test koşucusu (`node:test`). Vitest/Jest **kurulmadı** — Node 24
TypeScript'i doğrudan çalıştırıyor, `@/` takma adını `scripts/test-loader.mjs` çözüyor.

```
npm test    # node --import ./scripts/test-register.mjs --test "tests/**/*.test.ts"
```

**Veritabanı testleri:** `tests/yardim/test-db.ts` her dosya için geçici bir DB açar ve
**gerçek migration dosyalarını** çalıştırır. Şemayı testte elle yazmak yerine üretim
dosyalarını kullanmak bilinçli: kopyalanmış şema zamanla üretimden ayrışır ve testler var
olmayan bir veritabanını doğrulamaya başlar.

`hazirla()` mutlaka `getDb()` kullanan modüller import edilmeden **önce** çağrılır —
singleton ilk çağrıda yolu sabitler. Bu yüzden test dosyaları modülleri dinamik import eder.

**`.tsx` kapsam dışı:** Node tip soyma yapar, JSX dönüştürmez. Bileşen render testi jsdom +
derleyici gerektirir; ayrı bir iş kalemi (bkz. Açık maddeler).

---

## Mevcut kapsam (82 test)

| Dosya | Test | Ne koruyor |
|---|---|---|
| `data-integrity.test.ts` | 12 | Kırık iç link, slug tekilliği, kategori allowlist, 6+23 hizmet yapısı |
| `sitemap.test.ts` | 6 | `lastmod` regresyonu (`new Date()` kullanımı), tarih geçerliliği, kapsam |
| `related-posts.test.ts` | 6 | Yetim yazı yok, determinizm, kendine link vermeme |
| `seo-assets.test.ts` | 7 | OG ölçüsü ↔ `seo.ts` sabiti, doğrulama dosyalarının silinmemesi |
| `auth.test.ts` | 4 | Parola hash'i (saf kısım), her çağrıda farklı tuz |
| **`auth-oturum.test.ts`** | **12** | Oturum imzası, imza karıştırma, süre dolumu, anında iptal, IP kilidi eşiği/penceresi |
| **`db-leads.test.ts`** | **12** | Lead yazma/okuma, `ref` tekilliği, kırpma, durum allowlist (SQL enjeksiyonu), not yalıtımı |
| **`db-flags-activity.test.ts`** | **11** | Bayrak varsayılanının kapalı olması, denetim günlüğünün silme yüzeyi sunmaması |
| **`secret-scan.test.ts`** | **11** | Sır kalıplarının yakalanması, yanlış pozitif olmaması, deploy'da **push'tan önce** çağrılması |

**Kalın** = Faz 0'da eklendi (36 → 82).

### Faz 0'da özellikle hedeflenen "sessiz bozulma" noktaları

Bir güvenlik kontrolünün sessizce çalışmaz hâle gelmesi, hiç olmamasından kötüdür —
yanlış güven verir. Bu yüzden şunlar ayrıca test edildi:

- Sır tarayıcının deploy'da **çağrıldığı** ve **push'tan önce** çalıştığı
- Denetim günlüğü modülüne silme/güncelleme fonksiyonu eklenmediği
- Tanımsız bayrağın **kapalı** sayıldığı (migration çalışmamış ortamda yarım modül açılmasın)
- `.gitignore`'un geçici dosya kalıplarını kapsadığı

> Bu testler Faz 0'da gerçek bir hata yakaladı: `secret-scan.mjs` import edildiğinde üst
> seviye kodu çalışıp `process.exit` çağırıyor, test koşucusunu öldürüyor ve testler
> "1 test geçti" görünüp **sessizce atlanıyordu**.

---

## Faz bazında test gereksinimleri

### Faz 0 (kalan)
- Staging ortamının production'dan yalıtıldığı (ayrı DB, `noindex`)

### Faz 1 — İçerik ve şirket verisi
- **Aktarım eşdeğerliği:** içerik DB'ye taşındıktan sonra üretilen HTML, taşıma öncesiyle **birebir aynı** (fark taraması)
- 111 URL'in tamamı 200; `seo-audit` 0 bulgu
- Kanıtsız metriğin public sitede **render edilmediği**
- Şirket bilgisinin tek kaynaktan okunduğu (telefon/e-posta hiçbir bileşende sabit değil)
- Sayaçların JS olmadan gerçek değeri gösterdiği
- İstemci ve sunucu uzunluk limitlerinin aynı sabitten türediği
- Hukuki doküman versiyonlamasının doğru sürümü yayınladığı
- Yayın → sayfa tazeleme akışı (revalidate) çalıştığı
- Sürüm geri alma işlevi

### Faz 2 — Kimlik ve yetki
- **Yetki matrisi testleri:** her rol × her modül × her işlem
- Yetkisiz erişimin 403 verdiği (UI'da gizlemek yeterli değil)
- MFA'sız girişin reddedildiği
- Oturum listeleme ve tek tek iptal
- Denetim günlüğünün her kritik işlemde yazdığı
- Yetki yükseltme denemesinin engellendiği

### Faz 3 — CRM ve posta
- IMAP bağlantısı ve senkronizasyonu
- HTML postada script ve uzak görselin engellendiği
- Yanıtın gönderildiği **ve** Gönderilenler'e yazıldığı
- `BRC-` konulu mailin doğru lead'e bağlandığı
- Hız sınırının çok süreçli ortamda çalıştığı (A-14)
- SMTP yapılandırması değişince transporter'ın yenilendiği (A-13)

### Faz 4-5 — Satış ve teslimat
- Lead → fırsat → müşteri → proje zincirinin veri kaybetmeden ilerlediği
- Teklif PDF üretimi ve versiyonlama
- **Müşteri portalı yalıtımı:** bir müşterinin diğerinin verisine erişemediği (kritik)
- İç notların ve maliyetlerin portalda görünmediği

### Faz 6 — SEO ve içerik
- Kalite kapısının eksik meta/H2/SSS'yi yakaladığı
- Yüksek riskli değişikliklerin (noindex, canonical, URL) onaysız uygulanmadığı
- Preview → onay → merge akışı
- Veri kaynağı bağlı değilken **uydurma sayı gösterilmediği**

### Faz 7 — Outbound
- Unsubscribe sonrası mesaj gönderilmediği (**kalıcı**)
- Bounce sonrası sıranın durduğu
- Yanıt gelince sıranın durduğu
- Günlük/domain gönderim limitlerinin uygulandığı
- Kara listedeki adrese gönderilmediği
- Onaysız kampanyanın başlatılamadığı

### Faz 8-9 — AI, otomasyon, finans
- Yapılandırılmış çıktının şemaya uyduğu; uymayanın yeniden istendiği
- AI'ın yetki kapsamı dışındaki veriyi **görmediği**
- Bütçe limiti aşımında otomasyonun durduğu
- Onay gerektiren aksiyonun onaysız çalışmadığı
- Arka plan işlerinin yeniden deneme ve iptal davranışı
- Para hesaplarının kuruş tamsayısıyla doğru toplandığı

---

## Her faz sonunda çalıştırılacak kapı

```
npm run lint        # 0 uyarı toleransı
npm test
npm run build
npm run seo-audit
node scripts/secret-scan.mjs
```

Ardından: staging'de duman testi → 111 URL 200 kontrolü → onay → production →
deploy sonrası sayfa sağlığı + `local = GitHub = VPS` commit kontrolü.

## Açık maddeler

| # | Eksik | Neden bekliyor |
|---|---|---|
| T-1 | Bileşen (JSX) render testi | jsdom + derleyici gerekir; Node tip soyma JSX dönüştürmez |
| T-2 | Route handler HTTP testleri | Çalışan sunucu gerektirir; şu an scratchpad'deki manuel suite ile yapılıyor, kalıcılaştırılmalı |
| T-3 | E2E tarayıcı testleri | Faz 2'de panel kabuğu oturunca anlamlı |
| T-4 | Erişilebilirlik otomasyonu | Bugün manuel; CI'ya bağlanmalı |
| T-5 | Yük testi | Trafik hacmi henüz gerektirmiyor |
| T-6 | Bağımlılık zafiyet taraması | Faz 2'de deploy zincirine eklenecek |
