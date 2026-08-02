-- Faz 1.4 — müşteri referansları (yorumlar) yayın izni kaydıyla birlikte.
--
-- BUGÜNKÜ DURUM: Ana sayfadaki 3 yorum GERÇEK müşterilere ait (kullanıcı 27 Tem
-- 2026'da teyit etti) ve zaten yayında. Bu migration onları veritabanına taşır;
-- SİTEDE GÖRÜNEN HİÇBİR ŞEY DEĞİŞMEZ.
--
-- NEDEN YAYIN İZNİ ALANI VAR: bir müşteri yorumunu ve firma adını yayınlamak,
-- o firmanın ticari ilişkiyi kamuya açıklaması demektir. İzin kaydı tutulmadığında
-- "bunu yayınlayabilir miyiz" sorusunun cevabı kimsenin hafızasında kalır.
-- Yeni eklenecek referanslarda kural: izin YOKSA yayınlanmaz.
--
-- `dogrulandi` ayrı bir alandır: izin var ama metin müşteriden değil de bizim
-- kalemimizden çıkmışsa bu ikisi aynı şey değildir. Sahte yorum üretmenin önündeki
-- engel teknik değil kayıtsaldır — kimin söylediği yazılı olmalı.

CREATE TABLE IF NOT EXISTS testimonials (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  marka        TEXT NOT NULL,
  kisi         TEXT NOT NULL DEFAULT '',
  unvan        TEXT NOT NULL DEFAULT '',
  kategori     TEXT NOT NULL DEFAULT '',
  proje        TEXT NOT NULL DEFAULT '',
  metin        TEXT NOT NULL,

  -- ── izin ve doğrulama zinciri ────────────────────────────────────────────
  -- 0/1. İzin yoksa `durum` ne olursa olsun public sitede GÖRÜNMEZ.
  yayin_izni   INTEGER NOT NULL DEFAULT 0,
  izin_kaynagi TEXT NOT NULL DEFAULT '',   -- ör. "e-posta onayı, 27 Tem 2026"
  izin_tarihi  TEXT NOT NULL DEFAULT '',
  -- Metin müşterinin kendi ifadesi mi?
  dogrulandi   INTEGER NOT NULL DEFAULT 0,

  -- taslak | yayinda | arsiv → yalnızca 'yayinda' VE yayin_izni=1 görünür
  durum        TEXT NOT NULL DEFAULT 'taslak',
  sira         INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_testimonials_yayin ON testimonials(durum, yayin_izni, sira);
CREATE UNIQUE INDEX IF NOT EXISTS idx_testimonials_marka ON testimonials(marka);
