# BERACORE — Güvenlik Modeli

**Son güncelleme:** 2 Ağustos 2026 (Faz 0)

---

## Tehdit modeli

Gerçekçi olalım: BERACORE hedefli bir saldırganın öncelikli hedefi değil. Asıl riskler
sırasıyla şunlar:

| # | Tehdit | Gerçekleşti mi | Karşılık |
|---|---|---|---|
| T1 | **Kazara sır sızıntısı** (repo, log, ekran görüntüsü) | ✅ 2 Ağu 2026 — `uretim-kimlik.tmp` | `secret-scan` deploy kancası, `.gitignore` sertleştirme, rotasyon |
| T2 | Panel parolasına kaba kuvvet | — | IP başına 15 dk'da 8 deneme kilidi + fail2ban + (Faz 2) MFA |
| T3 | Oturum çerezi çalınması | — | HttpOnly + Secure + SameSite=Lax, DB tabanlı iptal, HMAC imza |
| T4 | İletişim formu üzerinden spam / kaynak tüketimi | — | Honeypot + iki katmanlı hız sınırı + origin kontrolü |
| T5 | **Panelin şirket adına mail göndermesi** (Faz 3+) | — | MFA + RBAC + denetim günlüğü Faz 3'ten ÖNCE |
| T6 | Müşteri verisinin başka müşteriye sızması (portal) | — | Sorgu düzeyinde zorunlu sahiplik filtresi + yetki testleri |
| T7 | AI'ın yetkisiz veriyi modele göndermesi | — | Veri kapsamı tanımı + maskeleme + yürütme günlüğü |
| T8 | AI'ın onaysız dış işlem yapması | — | Yazma işlemleri onay kuyruğundan geçer |
| T9 | Sunucu kaybı / veri kaybı | — | Gecelik yedek + **doğrulanmış** geri yükleme |
| T10 | Bağımlılık zinciri zafiyeti | — | Minimum bağımlılık, yerel modül yok, her paket gerekçelendirilir |

---

## Kimlik doğrulama

**Bugün (tek yönetici):**
- Parola `scrypt` ile hash'lenir: `scrypt:<tuz-hex>:<hash-hex>`, 16 bayt tuz, 64 bayt çıktı, NFKC normalize
- Doğrulama `timingSafeEqual` ile — zamanlama sızıntısı yok
- E-posta yanlış olsa bile parola doğrulaması **yine çalıştırılır** (kullanıcı sayımı engellenir)
- Oturum çerezi HMAC-SHA256 imzalı (`AUTH_SECRET`, min 32 karakter)
- Oturum kaydı DB'de; **yalnızca ham kimliğin SHA-256 özeti** saklanır → DB sızarsa oturumlar kullanılamaz
- Çerez: `HttpOnly`, `SameSite=Lax`, `Secure` (`X-Forwarded-Proto`'dan türetilir), 7 gün
- Kilit: IP başına 15 dakikada 8 başarısız deneme

> ⚠️ **`.env` değerlerinde `$` kullanılmaz.** Next `.env`'i dotenv-expand ile okur;
> `$xxx` değişken referansı sanılıp boşaltılır ve doğru parola bile reddedilir.

**Faz 2'de eklenecek:** çok kullanıcı, TOTP tabanlı MFA, davet akışı, oturum listesi
ve tek tek iptal, parola politikası, rol bazlı yetki.

## Yetkilendirme

İki katman, bilerek ayrı:

| Katman | Nerede | Ne yapar |
|---|---|---|
| Edge | `middleware.ts` | Yalnızca HMAC imzasını doğrular (Web Crypto). Ucuz ön eleme; DB'ye gitmez. |
| Sunucu | `(korumali)/layout.tsx` + mutasyon rotaları | **Asıl kapı.** Oturumu DB'den doğrular. |

Mutasyon rotaları `(korumali)` grubunun dışındadır ve **yetkiyi kendileri doğrular** —
düzenin koruduğunu varsaymazlar.

**Faz 2'den sonra:** her sorgu, çağıranın yetkisini modül × işlem düzeyinde kontrol eder.
Müşteri portalında sahiplik filtresi sorgu katmanında zorunludur (UI'da değil).

## CSRF ve girdi güvenliği

- Tüm mutasyonlar POST; `Origin` başlığı host ile karşılaştırılır (uyuşmazsa 403)
- `SameSite=Lax` ikinci katman
- Girdiler tip zorlamasından geçer (`typeof === 'string'` değilse boşa düşer)
- Uzunluk sınırları sunucuda uygulanır (413)
- HTML çıktısında tüm dinamik değerler escape edilir
- E-posta başlıkları `oneLine()` ile temizlenir → CRLF başlık enjeksiyonu kapalı
- SQL: yalnızca parametreli sorgu. Enum benzeri alanlar allowlist'ten geçer
  (`listLeads` bunun örneği; testle kilitli)

## Sır yönetimi

| Kural | Uygulama |
|---|---|
| Sır kaynak koda yazılmaz | `scripts/secret-scan.mjs`, `deploy.mjs` içinde **push'tan önce** çalışır |
| `.env` git dışı | `.gitignore`: `.env`, `.env.*`, `*.tmp`, `*.bak`, `*.orig`, `uretim-kimlik*`, `kimlik-*.env`, `secrets.*` |
| Üretim `.env` yedekleniyor | `scripts/vps-yedek.sh` (Faz 0'da eklendi; öncesinde **yedeklenmiyordu**) |
| Yedek arşivi kısıtlı | `chmod 600` |
| Müşteri erişim bilgileri düz metin saklanmaz | `credential_references` — sırrın kendisi değil, nerede olduğunun referansı |
| Sızan sır rotasyona sokulur | Geçmiş temizliği hijyendir; asıl koruma rotasyondur |

**Sızıntı müdahale sırası:** ① değeri değiştir → ② oturumları/token'ları iptal et →
③ dosyayı kaldır + `.gitignore` → ④ geçmişi temizle + force-push → ⑤ tarayıcıya kalıp ekle.

## Ağ ve sunucu

- SSH **yalnızca anahtar** (`PasswordAuthentication no`, `PermitRootLogin prohibit-password`)
  — `sshd_config.d/01-` öneki bilinçli: OpenSSH bir ayarın **ilk** gördüğü değeri kullanır
- `fail2ban` sshd jail (5 deneme / 10 dk → 1 saat)
- Nginx: HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy
- CSP **tek kaynak** `next.config.ts`; GA alan adları yalnızca `NEXT_PUBLIC_GA_ID` varken eklenir
- `script-src 'unsafe-inline'` **bilinçli kabul edilmiş açık** — nonce sayfaları statik olmaktan çıkarır
- Nginx hız sınırı `5r/m` (uygulama katmanının üstünde ikinci savunma)

## Denetim günlüğü

`activity_log` — yalnızca INSERT. `src/lib/db/activity.ts` bilerek silme/güncelleme
fonksiyonu **sunmaz**; bir test bunu kilitler (`db-flags-activity.test.ts`).

Günlük yazımı ana işlemi asla bozmaz (`try/catch` ile yutulur) — aynı ilke lead kaydında da geçerli.

Günlüğe yazılacaklar: giriş/çıkış ve başarısız denemeler · yetki değişikliği ·
içerik yayını ve geri alma · müşteriye giden mesaj · teklif/sözleşme gönderimi ·
kampanya başlatma · AI yürütmesi ve onayı · entegrasyon bağlama/kaldırma · veri dışa aktarma.

## KVKK ve gizlilik

- Kişisel veri yalnızca hukuki dayanakla işlenir; dayanak `consent_records`'ta kaydedilir
- Unsubscribe **kalıcıdır** — `suppression_list` kaydı silinmez
- Analitik çerezleri onay öncesi yüklenmez; GA IP anonimleştirmesi açık
- Panel trafiği GA'ya karışmaz (`/admin` altında analitik yüklenmez)
- Veri saklama süreleri: `login_attempts` 30 gün · oturumlar süre dolumunda ·
  yedekler 30 gün · lead/müşteri verisi ticari ilişki süresince
- Veri sahibi talepleri (erişim, silme, taşınabilirlik) panelden karşılanabilmeli
- Hassas veri modele gönderilmeden önce maskelenir

> **Sistem hukuki uygunluk KARARI VERMEZ.** Riski gösterir, eksikleri işaretler,
> insan onayı ister. "Hukuken uygundur" çıktısı üretilmez.

## AI güvenlik sınırları

AI **yapamaz:** müşteriye doğrudan mesaj göndermek · production'a deploy · sözleşme onaylamak ·
ödeme gerçekleştirmek · kayıt silmek · yetki değiştirmek · kampanya başlatmak ·
yetkisi olmayan veriye erişmek · uydurma metrik/referans üretmek.

AI **yapabilir:** okumak, özetlemek, sınıflandırmak, taslak üretmek, öneri sunmak, risk işaretlemek.

Her yürütme `ai_executions`'a yazılır: kim başlattı, hangi çalışan, hangi veri, hangi model,
maliyet, sonuç, onay alındı mı, uygulandı mı, geri alındı mı.

## Doğrulanmış kontroller (2 Ağu 2026)

| Kontrol | Sonuç |
|---|---|
| Sızan parolayla giriş | ❌ reddedildi (`?hata=kimlik`) |
| Yeni parolayla giriş | ✅ `303 /admin` + Secure çerez |
| Geçmişte sızan dosya | ✅ yok (`git log --all` boş, GitHub API 404) |
| Sır tarayıcı ekilmiş sırrı yakalıyor | ✅ exit 1, deploy durdu |
| Sır tarayıcı yanlış pozitif üretmiyor | ✅ 82 test yeşil |
| Yedekten geri yükleme | ✅ `integrity_check: ok`, 5 tablo satır sayısı birebir |
| Yedekte `AUTH_SECRET` + parola hash | ✅ mevcut |
| Oturum iptali anında etkili | ✅ testle kilitli |
| Kaba kuvvet kilidi 8. denemede | ✅ testle kilitli |
| Ham oturum kimliği DB'de düz değil | ✅ testle kilitli |

## Açık maddeler

| # | Madde | Faz |
|---|---|---|
| G-1 | Staging ortamı yok — değişiklikler doğrudan production'a çıkıyor | Faz 0 |
| G-2 | MFA yok | Faz 2 |
| G-3 | Sunucu dışı yedek kopyası yok (tek VPS) | Faz 9 |
| G-4 | Hız sınırı bellekte — ikinci süreçte bozulur | Faz 3 |
| G-5 | Bağımlılık zafiyet taraması otomatik değil | Faz 2 |
| G-6 | `script-src 'unsafe-inline'` — bilinçli kabul | — |
