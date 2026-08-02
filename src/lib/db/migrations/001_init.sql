-- Faz A — temel şema.
-- Tarihler ISO-8601 metin olarak tutulur (SQLite'ın yerleşik tarih tipi yoktur);
-- datetime('now') UTC üretir, sunucu saat dilimi değişse bile karşılaştırma tutarlı kalır.

CREATE TABLE IF NOT EXISTS leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  ref         TEXT    NOT NULL UNIQUE,          -- müşteriye gösterilen BRC-YYYYMMDD-XXXX
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  phone       TEXT    NOT NULL DEFAULT '',
  company     TEXT    NOT NULL DEFAULT '',
  service     TEXT    NOT NULL DEFAULT '',
  budget      TEXT    NOT NULL DEFAULT '',
  timeline    TEXT    NOT NULL DEFAULT '',
  message     TEXT    NOT NULL,
  source      TEXT    NOT NULL DEFAULT 'contact-form',
  -- yeni | okundu | iletisimde | teklif | kazanildi | kaybedildi
  status      TEXT    NOT NULL DEFAULT 'yeni',
  ip          TEXT    NOT NULL DEFAULT '',
  user_agent  TEXT    NOT NULL DEFAULT '',
  mail_sent   INTEGER NOT NULL DEFAULT 0,       -- e-posta gitti mi (0/1)
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Gelen kutusu daima "yeni önce" sıralanır; durum filtresi de aynı sorguda kullanılır.
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status  ON leads (status, created_at DESC);

-- Polimorfik not: şimdilik yalnızca lead'e bağlanır, Faz C'de jobs eklenince
-- entity_type genişler. Bu yüzden yabancı anahtar YERİNE tip+id çifti kullanılır.
CREATE TABLE IF NOT EXISTS notes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT    NOT NULL,
  entity_id   INTEGER NOT NULL,
  body        TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_notes_entity ON notes (entity_type, entity_id, created_at DESC);

-- Oturumlar DB'de tutulur: çerez imzası geçerli olsa bile oturum buradan silinerek
-- ANINDA iptal edilebilir ve sunucu yeniden başladığında oturumlar kaybolmaz.
-- id_hash: çerezdeki ham oturum kimliğinin SHA-256'sı. DB sızsa bile ham kimlik
-- elde edilemez, yani DB okuma yetkisi tek başına oturum çalmaya yetmez.
CREATE TABLE IF NOT EXISTS sessions (
  id_hash     TEXT    PRIMARY KEY,
  email       TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  expires_at  TEXT    NOT NULL,
  ip          TEXT    NOT NULL DEFAULT '',
  user_agent  TEXT    NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions (expires_at);

-- Kaba kuvvet koruması. Başarılı/başarısız tüm denemeler yazılır; kilit kararı
-- son pencere içindeki BAŞARISIZ sayısına göre verilir.
CREATE TABLE IF NOT EXISTS login_attempts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  ip         TEXT    NOT NULL,
  email      TEXT    NOT NULL DEFAULT '',
  ok         INTEGER NOT NULL,
  at         TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_attempts_ip ON login_attempts (ip, at DESC);
