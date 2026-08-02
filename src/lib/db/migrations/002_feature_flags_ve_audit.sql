-- Faz 0 — güvenli zemin: özellik bayrakları + denetim günlüğü.
--
-- NEDEN ŞİMDİ: Bundan sonraki program (24 modül, 9 faz) tek seferde canlıya
-- alınamaz. İki şey olmadan güvenli ilerlenemez:
--   1) Yarım bir modülü kod olarak canlıya alıp KAPALI tutabilmek (feature_flags).
--      Aksi halde her modül "tamamen bitene kadar" dallanmada bekler; uzun yaşayan
--      dallar birleştirme acısı ve gözden kaçan regresyon üretir.
--   2) Kimin ne değiştirdiğini geriye dönük görebilmek (activity_log). Panel
--      içerik, e-posta ve müşteri verisi yönetmeye başlayınca "bunu ne zaman kim
--      değiştirdi" sorusunun cevapsız kalması kabul edilemez.

CREATE TABLE IF NOT EXISTS feature_flags (
  anahtar     TEXT    PRIMARY KEY,               -- ör. 'posta-merkezi', 'icerik-editoru'
  acik        INTEGER NOT NULL DEFAULT 0,        -- 0 = kapalı (varsayılan)
  aciklama    TEXT    NOT NULL DEFAULT '',
  -- Bayrağın hangi faz ile geldiği; temizlik zamanı gelince hangilerinin
  -- kaldırılabileceğini bilmek için. Kalıcı bayrak birikmesi teknik borçtur.
  faz         TEXT    NOT NULL DEFAULT '',
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Denetim günlüğü. DEĞİŞTİRİLEMEZ olarak tasarlanır: yalnızca INSERT yapılır,
-- UPDATE/DELETE için sorgu katmanında fonksiyon YAZILMAZ. Silinebilen bir denetim
-- kaydı, denetim kaydı değildir.
CREATE TABLE IF NOT EXISTS activity_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  actor       TEXT    NOT NULL DEFAULT '',       -- e-posta; sistem işleri için 'sistem'
  action      TEXT    NOT NULL,                  -- ör. 'lead.durum-degisti', 'oturum.acildi'
  entity_type TEXT    NOT NULL DEFAULT '',
  entity_id   TEXT    NOT NULL DEFAULT '',       -- TEXT: her varlık tamsayı kimlik kullanmıyor
  detail      TEXT    NOT NULL DEFAULT '',       -- JSON; şema serbest bırakıldı
  ip          TEXT    NOT NULL DEFAULT '',
  at          TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_activity_at     ON activity_log (at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_entity ON activity_log (entity_type, entity_id, at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_actor  ON activity_log (actor, at DESC);
