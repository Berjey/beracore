# BERACORE — Admin Panel + CRM Mimarisi (Onaylı Plan)

**Durum:** ✅ **Faz A 2 Ağu 2026'da tamamlandı ve canlıya alındı.** Sıradaki: Faz B (GA4+GSC).

> **Plandan tek sapma:** DB sürücüsü `better-sqlite3` yerine Node 24'ün yerleşik `node:sqlite`'ı.
> Gerekçe: yerel (native) modül ABI'ye bağlı; Node 20→24 yükseltmesinde `sharp` tam da bu yüzden
> yeniden kurulmak zorunda kaldı. Yerleşik modül sıfır bağımlılık ve sıfır ABI riski.
> Mimarinin geri kalanı plandaki gibi uygulandı. Uygulama notları ve tuzaklar `CLAUDE.md`'de.
Bu dosya panele geçildiğinde doğru kurmak içindir. İçerik (blog/sayfa) **statik kalır, kodda güncellenir** — panel CMS değildir.

## Kilitli kararlar
- **Kapsam:** Dashboard + CRM (görüntüle & yönet). CMS değil. Public site %100 statik/SEO-bütün kalır.
- **Barındırma:** Kendi VPS'inde, self-hosted.
- **CRM:** Başlangıç = lead + iş takibi (durum + not), büyümeye açık.

## Temel gerçek
Site tamamen statik; DB/auth/admin yok. Tek backend `src/app/api/contact/route.ts` ve **gelen
talepler kaydedilmiyor, sadece e-postalanıp kayboluyor**. Panelin ilk ve en değerli kazanımı: bunları DB'ye kaydetmek.

## Mimari (kilitli seçimler)
- **DB:** SQLite (`better-sqlite3`). Tek dosya, ek servis yok. Konum **repo DIŞINDA**
  `/var/www/beracore-data/beracore.db` (chmod 700) → deploy'daki `git reset --hard` silemez.
  `src/lib/db/index.ts` (WAL modu, singleton). Dev'de `./.data/` (gitignore).
  `next.config.ts` → `serverExternalPackages: ['better-sqlite3']`.
- **Auth:** Auth.js YOK (tek admin). `node:crypto`: parola `scrypt` hash'i `.env`'de, HMAC imzalı
  oturum çerezi (`AUTH_SECRET`), **DB tabanlı oturum** (anında iptal, restart'a dayanıklı).
  `middleware.ts` (edge, Web Crypto imza kontrolü) `/admin/*` korur; `/admin/layout.tsx` (node) DB'den
  asıl yetkiyi doğrular. CSRF: `SameSite=Lax` + Origin kontrolü. Brute-force: DB `login_attempts`.
- **Lead kalıcılığı:** Yalnızca `route.ts`'e cerrahi ekleme (mevcut doğrulama/escape/rate-limit aynen
  kalır; `leads` tablosuna `try/catch` ile yazılır, DB hatası e-postayı engellemez). Public form değişmez.
- **Panel:** Aynı Next.js uygulamasında `/admin` route grubu. Site `next start` (PM2) ile çalıştığı
  için (statik export DEĞİL) dinamik `/admin` SSR, statik public sayfalarla aynı süreçte yaşar —
  PM2/nginx/TLS değişmez.
- **Dashboard fizibilite (dürüst):** Leads (kendi DB) ✅ · GA4 Data API + Search Console API ✅
  (server-side → CSP değişmez) · Instagram/LinkedIn/X/Google İşletme ⚠️ kapalı API → **manuel takip**.
- **Ops:** A–C fazları CSP değişikliği gerektirmez. `.env`'e: `DB_PATH, AUTH_SECRET, ADMIN_EMAIL,
  ADMIN_PASSWORD_HASH` (+B: Google servis hesabı, GA4 property id, GSC url). `server-deploy.sh`'e
  build sonrası/restart öncesi tek satır `node scripts/migrate.mjs` (idempotent, versiyonlu).
  Gece SQLite `.backup` cron + off-box kopya. Tek seferlik VPS bootstrap (klasörler, cron) elle.

## Faz kırılımı (her faz tek başına değer üretir)
- ✅ **Faz A — TAMAMLANDI (2 Ağu 2026)**: DB modülü + ilk migration
  (`leads`, `notes`, `sessions`, `login_attempts`), `migrate.mjs` + deploy kancası, auth, `route.ts`
  düzenlemesi, leads gelen kutusu UI. **Getiri:** lead kaybolmaz + güvenli admin. İlk yapılır.
- **Faz B — Analitik (GA4 + GSC):** Google Cloud servis hesabı, önbellekli server-side çekim, kartlar.
- **Faz C — CRM işler:** `jobs` + lead→iş dönüşümü, iş panosu, notlar, pipeline.
- **Faz D — Varlık durum panosu:** `presence_items` (dijital-varlik-plani.md'den) + durum toggle +
  kısıtlı sosyaller için elle metrik.

## Şema (başlangıç, SQLite)
`leads(id,name,email,phone,company,service,budget,timeline,message,source,status,created_at,updated_at)` ·
`notes(id,entity_type,entity_id,body,created_at)` (polimorfik) · `jobs(id,lead_id,title,status,...)` ·
`sessions(id_hash,expires_at,...)` · `login_attempts(ip,email,ok,at)` · `presence_items(...)`.
Büyüme (kırmadan): `customers`, `projects` (gmsgarage gibi) + `tasks`/`invoices`.

## Kritik dosyalar (uygulama sırası gelince)
`src/app/api/contact/route.ts` · `next.config.ts` · `scripts/server-deploy.sh` ·
yeni: `src/lib/db/index.ts`, `src/lib/db/migrations/*.sql`, auth modülü, `src/app/admin/**` ·
`docs/dijital-varlik-plani.md` (Faz D panosunu besler).
