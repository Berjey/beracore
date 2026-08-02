-- Faz 1 — merkezi şirket ayarları (denetim bulgusu A-08).
--
-- Telefon 6, e-posta 8+, adres 5 dosyada kopyalıydı. Numara değiştiğinde bir yerde
-- eski kalması kaçınılmazdı; NAP tutarsızlığı yerel SEO'yu doğrudan zayıflatır.
--
-- Tablo BİLEREK anahtar-değer biçiminde: yeni bir alan eklemek migration
-- gerektirmesin. Tip bilgisi panelin doğru girdi tipini (metin/liste/e-posta)
-- göstermesi için tutulur.
--
-- Kayıt YOKSA kod varsayılanı kullanılır (src/lib/sirket.ts). Bu bir geri düşme
-- hattıdır: veritabanı okunamazsa site yanlış bilgi göstermek yerine doğru
-- varsayılanı gösterir.

CREATE TABLE IF NOT EXISTS company_settings (
  anahtar    TEXT PRIMARY KEY,
  deger      TEXT NOT NULL DEFAULT '',
  -- metin | uzun-metin | eposta | telefon | url | liste
  tip        TEXT NOT NULL DEFAULT 'metin',
  grup       TEXT NOT NULL DEFAULT 'genel',
  etiket     TEXT NOT NULL DEFAULT '',
  aciklama   TEXT NOT NULL DEFAULT '',
  sira       INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Başlangıç kayıtları koddaki DEĞERLERİN BİREBİR AYNISI.
-- Bu migration uygulandığında sitede görünen hiçbir metin değişmemelidir;
-- taşımanın işi içeriği değiştirmek değil, kaynağını tekilleştirmektir.
-- `INSERT OR IGNORE`: migration idempotent kalır ve elle düzenlenmiş bir değeri EZMEZ.

INSERT OR IGNORE INTO company_settings (anahtar, deger, tip, grup, etiket, aciklama, sira) VALUES
  ('ad',              'BERACORE',                    'metin',      'kimlik',   'Şirket adı',            'Markanın görünen adı', 10),
  ('unvan',           '',                            'metin',      'kimlik',   'Ticari unvan',          'Resmî unvan. Boşsa yasal metinlerde şirket adı kullanılır.', 20),
  ('slogan',          'Markanız için unutulmaz dijital deneyimler.', 'metin', 'kimlik', 'Slogan',        'Tüm profillerde aynı kullanılmalı', 30),

  ('email',           'info@beracore.com',           'eposta',     'iletisim', 'E-posta',               'Sitede gösterilen ve mailto bağlantılarında kullanılan adres', 40),
  ('telefonE164',     '+905539862306',               'telefon',    'iletisim', 'Telefon (E.164)',       'Uluslararası biçim. tel: ve WhatsApp bağlantılarının kaynağı.', 50),
  ('telefonGorunen',  '0553 986 23 06',              'metin',      'iletisim', 'Telefon (görünen)',     'Ziyaretçiye gösterilen biçim', 60),
  ('whatsappMesaji',  'Merhaba, BERACORE ile bir projem hakkında görüşmek istiyorum.', 'uzun-metin', 'iletisim', 'WhatsApp ön mesajı', 'Butona tıklayınca hazır gelen metin', 70),
  ('calismaSaatleri', 'Hafta içi 09:00 — 17:00',     'metin',      'iletisim', 'Çalışma saatleri',      'İletişim sayfasındaki telefon kartında AYNEN gösterilir. Yapısal verideki makine biçimi (09:00/17:00) ayrıdır.', 80),

  ('sehir',           'İstanbul',                    'metin',      'adres',    'Şehir',                 '', 90),
  ('ulke',            'Türkiye',                     'metin',      'adres',    'Ülke',                  '', 100),
  ('ulkeKodu',        'TR',                          'metin',      'adres',    'Ülke kodu',             'ISO 3166-1 alfa-2', 110),
  ('adres',           '',                            'uzun-metin', 'adres',    'Açık adres',            'Boşsa yapısal veride sokak satırı üretilmez', 120),

  ('vergiDairesi',    '',                            'metin',      'yasal',    'Vergi dairesi',         '', 130),
  ('vergiNo',         '',                            'metin',      'yasal',    'Vergi numarası',        '', 140),
  ('mersis',          '',                            'metin',      'yasal',    'MERSİS numarası',       '', 150),
  ('kvkkEposta',      'info@beracore.com',           'eposta',     'yasal',    'KVKK başvuru adresi',   'Aydınlatma metninde gösterilir', 160),

  ('sosyal',          '',                            'liste',      'sosyal',   'Sosyal profiller',      'Her satıra bir tam URL. JSON-LD sameAs alanını besler; boşsa alan hiç üretilmez.', 170);
