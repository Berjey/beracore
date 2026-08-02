-- Faz 1.2 — şirket metrikleri, KANIT ALANLARIYLA (denetim bulgusu A-07).
--
-- SORUN: Ana sayfada "25+ Tamamlanan Proje", "15+ Kurumsal Müşteri", "%97 Memnuniyet
-- Oranı" yazıyordu. Bu sayıların hiçbirinin arkasında bir ölçüm, kayıt veya kaynak
-- yoktu — kodda sabit olarak duruyorlardı. Aynı rakamlar `AboutPage.tsx`'te de
-- KOPYALIYDI; ikisi ayrışsa hangisinin doğru olduğunu söylemenin yolu yoktu.
--
-- KURAL: `durum` 'yayinda' DEĞİLSE metrik public sitede RENDER EDİLMEZ.
-- Bu, "kanıtlanmamış metrik yayınlanmaz" ilkesinin veri katmanındaki karşılığı;
-- bir bileşenin unutması mümkün olmasın diye kararı sorgu veriyor, JSX değil.
--
-- Kanıt alanları (`olcum_yontemi`, `veri_kaynagi`, `kanit_url`, `son_dogrulama`)
-- ZORUNLU değil ama 'yayinda' durumuna geçen bir metrikte `veri_kaynagi` boşsa
-- panel uyarır: sayının nereden geldiği yazılı olmadan yayınlanmamalı.
--
-- Tek satır iki yüzeyi birden besler (`ana_sayfa`, `hakkimizda`). Metriği iki
-- tabloya/dosyaya kopyalamak, bugünkü tutarsızlığı yeniden üretmek olurdu.

CREATE TABLE IF NOT EXISTS company_metrics (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  anahtar         TEXT NOT NULL UNIQUE,
  baslik          TEXT NOT NULL,
  alt_baslik      TEXT NOT NULL DEFAULT '',
  -- Sayaç animasyonu tam sayı üzerinde çalışır; biçim ön/son ekle verilir (%, +).
  deger           INTEGER NOT NULL DEFAULT 0,
  on_ek           TEXT NOT NULL DEFAULT '',
  son_ek          TEXT NOT NULL DEFAULT '',
  -- SVG `path` verisi; ikon setini koda bağımlı bırakmamak için burada durur.
  ikon            TEXT NOT NULL DEFAULT '',

  -- ── kanıt zinciri ─────────────────────────────────────────────────────────
  olcum_yontemi   TEXT NOT NULL DEFAULT '',
  veri_kaynagi    TEXT NOT NULL DEFAULT '',
  kanit_url       TEXT NOT NULL DEFAULT '',
  son_dogrulama   TEXT NOT NULL DEFAULT '',

  -- taslak | dogrulandi | yayinda | arsiv  → yalnızca 'yayinda' public'te görünür
  durum           TEXT NOT NULL DEFAULT 'taslak',

  ana_sayfa       INTEGER NOT NULL DEFAULT 0,
  hakkimizda      INTEGER NOT NULL DEFAULT 0,
  sira            INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_metrics_durum ON company_metrics(durum, sira);

-- Başlangıç kayıtları: koddaki metriklerin AYNISI, ama her biri kendi kanıt
-- durumuyla. `INSERT OR IGNORE` → idempotent ve elle düzenlenmiş kaydı ezmez.
--
-- YAYINDA olanlar: şirketin kendi hakkında doğrudan bildiği, dış kanıt gerektirmeyen
-- ve sitenin görünen içeriğiyle zaten tutarlı olan iki gerçek.
INSERT OR IGNORE INTO company_metrics
  (anahtar, baslik, alt_baslik, deger, on_ek, son_ek, ikon,
   olcum_yontemi, veri_kaynagi, durum, ana_sayfa, hakkimizda, sira)
VALUES
  ('kurulus-yili', 'Kuruluş Yılı', 'BERACORE stüdyosu', 2024, '', '',
   'M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83',
   'Şirketin faaliyete başladığı yıl.',
   'Şirket kaydı — sitedeki zaman çizelgesi ve yapısal veri (foundingDate) ile aynı.',
   'yayinda', 1, 1, 10),

  ('uzman-ekip', 'Uzman Ekip', 'Disiplinlerarası çekirdek', 5, '', '+',
   'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
   'Çekirdek ekipte aktif çalışan kişi sayısı.',
   'İç kayıt — şirket beyanı.',
   'yayinda', 1, 1, 20);

-- TASLAK olanlar: bir ölçüme dayanması gereken, ama bugün dayanmayan iddialar.
-- Public sitede GÖRÜNMEZLER. Kanıt (proje listesi, müşteri listesi, anket sonucu)
-- panele girilip durum 'yayinda' yapıldığında kendiliğinden geri gelirler.
INSERT OR IGNORE INTO company_metrics
  (anahtar, baslik, alt_baslik, deger, on_ek, son_ek, ikon,
   olcum_yontemi, durum, ana_sayfa, hakkimizda, sira)
VALUES
  ('tamamlanan-proje', 'Tamamlanan Proje', 'Teslim edilen', 25, '', '+',
   'M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3',
   'Teslim edilip kapatılmış proje sayısı. Kanıt: proje/teslimat kaydı.',
   'taslak', 1, 1, 30),

  ('kurumsal-musteri', 'Kurumsal Müşteri', 'Aktif iş ortağı', 15, '', '+',
   'M20 7h-4V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM10 4h4v3h-4V4z',
   'Fatura kesilmiş benzersiz kurumsal müşteri sayısı. Kanıt: müşteri kaydı.',
   'taslak', 1, 1, 40),

  ('memnuniyet-orani', 'Memnuniyet Oranı', 'Müşteri geri bildirimi', 97, '%', '',
   'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
   'Tamamlanan projelerde yapılan memnuniyet anketinin ortalaması. Kanıt: anket sonuçları. '
   || 'Anket YAPILMADIYSA bu metrik yayınlanmamalıdır — oran uydurulamaz.',
   'taslak', 1, 0, 50);
