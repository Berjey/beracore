-- Faz 1.3 — içeriğin veritabanına taşınması (blog ilk adım).
--
-- BUGÜNE KADAR: 50 blog yazısı `src/lib/blog-data.ts` içinde, 2821 satırlık tek
-- bir dizide duruyordu. Bir yazının başlığını düzeltmek bile kod değişikliği,
-- derleme ve deploy gerektiriyordu.
--
-- NE DEĞİŞMİYOR: sayfalar hâlâ STATİK üretilir. İçerik veritabanından gelir ama
-- panelde kaydetme `revalidatePath` tetikler → HTML yeniden üretilir ve ziyaretçiye
-- yine hazır dosya servis edilir. SEO açısından hiçbir şey kaybedilmez.
--
-- GİT GEÇMİŞİNİN YERİNİ NE TUTAR: kod dosyasında her düzenlemenin bir commit'i
-- vardı. Onun yerine üç ağ kuruluyor: `content_versions` (her kaydetmede önceki
-- hâl saklanır) · panelden JSON dışa aktarma · gece SQLite yedeği.
--
-- KOD TARAFI SİLİNMİYOR: `blog-data.ts` tohum (seed) ve GERİ DÜŞME kaynağı olarak
-- kalır. Tablo boşsa veya okunamıyorsa site koddaki içerikle çalışmaya devam eder.

CREATE TABLE IF NOT EXISTS content_pages (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  -- blog | hizmet | hizmet-alt | sehir | yasal
  tip              TEXT NOT NULL,
  slug             TEXT NOT NULL,
  dil              TEXT NOT NULL DEFAULT 'tr',

  baslik           TEXT NOT NULL,
  meta_title       TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  ozet             TEXT NOT NULL DEFAULT '',

  -- ContentBlock dizisi (p | h2 | h3 | ul | quote) — koddaki biçimin AYNISI.
  -- JSON olarak saklanır: blokları ayrı tabloya bölmek sıra yönetimi ve
  -- birleştirme maliyeti getirirdi, karşılığında sorgulanabilirlik kazandırmazdı
  -- (blok içi arama zaten yapılmıyor).
  govde            TEXT NOT NULL DEFAULT '[]',

  kategori         TEXT NOT NULL DEFAULT '',
  yazar            TEXT NOT NULL DEFAULT 'BERACORE',
  okuma_dakika     INTEGER NOT NULL DEFAULT 0,

  -- İlgili hizmet bağlantısı (huni girişi). Serbest metin yerine iki alan.
  ilgili_hizmet_etiket TEXT NOT NULL DEFAULT '',
  ilgili_hizmet_href   TEXT NOT NULL DEFAULT '',

  -- YYYY-MM-DD. Sitemap `lastmod` buradan türer; saat/dakika TAŞIMAZ
  -- (tests/sitemap.test.ts bunu kilitliyor — her build'de değişen lastmod,
  -- arama motoruna "her sayfa güncellendi" yalanı söyler).
  yayin_tarihi     TEXT NOT NULL DEFAULT '',
  guncelleme_tarihi TEXT NOT NULL DEFAULT '',

  -- taslak | yayinda | arsiv → yalnızca 'yayinda' public sitede görünür
  durum            TEXT NOT NULL DEFAULT 'yayinda',
  sira             INTEGER NOT NULL DEFAULT 0,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Aynı tip+slug+dil ikinci kez eklenemez. Aktarım script'inin idempotent
-- olmasını sağlayan kısıt budur (`INSERT OR IGNORE` buna dayanır).
CREATE UNIQUE INDEX IF NOT EXISTS idx_content_slug ON content_pages(tip, slug, dil);
CREATE INDEX IF NOT EXISTS idx_content_durum ON content_pages(tip, durum, yayin_tarihi);

-- SSS ayrı tabloda: FAQPage şeması için sıra önemli ve panelde tek tek
-- düzenlenmeleri gerekiyor. Gövdenin içine gömülü olsalardı ikisi de zorlaşırdı.
CREATE TABLE IF NOT EXISTS content_faq (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  content_id INTEGER NOT NULL REFERENCES content_pages(id) ON DELETE CASCADE,
  soru       TEXT NOT NULL,
  cevap      TEXT NOT NULL,
  sira       INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_faq_content ON content_faq(content_id, sira);

-- Sürüm geçmişi — git commit'lerinin yerini tutar.
-- Yalnızca YAZILIR ve OKUNUR; silme fonksiyonu bilerek sunulmaz
-- (denetim günlüğüyle aynı gerekçe, bkz. src/lib/db/activity.ts).
CREATE TABLE IF NOT EXISTS content_versions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  content_id INTEGER NOT NULL REFERENCES content_pages(id) ON DELETE CASCADE,
  surum      INTEGER NOT NULL,
  -- Kaydetme ANINDAKİ tam hâl (meta + gövde + sss) tek JSON olarak.
  anlik      TEXT NOT NULL,
  actor      TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_versions_content ON content_versions(content_id, surum);
