# BERACORE — Veri Modeli

**Motor:** SQLite (`node:sqlite`, Node 24 yerleşiği) · **Konum:** `/var/www/beracore-data/beracore.db` (repo dışı)
**Migration:** `src/lib/db/migrations/NNN_ad.sql`, çalıştırıcı `scripts/migrate.mjs`

---

## Sözleşmeler

Bu kurallar tüm tablolarda geçerlidir; yeni tablo eklerken uyulur.

| Kural | Gerekçe |
|---|---|
| Tarihler `TEXT`, `datetime('now')` (UTC) | SQLite'ın tarih tipi yok; UTC saklamak sunucu saat dilimi değişse bile karşılaştırmayı tutarlı tutar. Türkiye saatine **gösterim anında** çevrilir. |
| `created_at` / `updated_at` her ana tabloda | Denetlenebilirlik |
| Silme = `deleted_at` (soft delete) | Yanlışlıkla silinen müşteri/proje geri getirilebilmeli. İstisna: `sessions`, `login_attempts` — gerçekten silinir. |
| Yabancı anahtar `ON DELETE` bilinçli seçilir | `PRAGMA foreign_keys = ON` açık; sessiz yetim kayıt olmaz |
| E-posta ve domain **normalize** saklanır (küçük harf, trim) | Mükerrer müşteri kaydını önler |
| Para: tamsayı **kuruş** + `currency` | Kayan nokta ile para tutulmaz |
| Enum'lar `TEXT` + uygulama katmanında allowlist | SQLite'ta enum yok; allowlist `LEAD_DURUMLARI` kalıbıyla tipli tutulur |
| Denetim tablolarına yalnızca INSERT | Değiştirilebilen denetim kaydı, denetim kaydı değildir |

---

## Uygulanmış şema

### `001_init.sql` — Faz A

```
leads(id, ref UNIQUE, name, email, phone, company, service, budget, timeline,
      message, source, status, ip, user_agent, mail_sent, created_at, updated_at)
  idx: (created_at DESC), (status, created_at DESC)

notes(id, entity_type, entity_id, body, created_at)          -- polimorfik
  idx: (entity_type, entity_id, created_at DESC)

sessions(id_hash PK, email, created_at, expires_at, ip, user_agent)
  -- id_hash = ham çerez kimliğinin SHA-256'sı. DB sızarsa oturumlar kullanılamaz.
  idx: (expires_at)

login_attempts(id, ip, email, ok, at)
  idx: (ip, at DESC)

schema_migrations(name PK, applied_at)                        -- migrate.mjs üretir
```

### `002_feature_flags_ve_audit.sql` — Faz 0

```
feature_flags(anahtar PK, acik, aciklama, faz, updated_at)
  -- Kayıt yoksa KAPALI sayılır (src/lib/db/flags.ts)

activity_log(id, actor, action, entity_type, entity_id TEXT, detail JSON, ip, at)
  idx: (at DESC), (entity_type, entity_id, at DESC), (actor, at DESC)
  -- src/lib/db/activity.ts yalnızca yazma + okuma sunar; silme/güncelleme YOK
```

---

## Planlanan şema

Tablolar geldikleri fazla birlikte listelenmiştir. Kolon listeleri niyeti gösterir;
kesin hâli migration yazılırken netleşir.

### Faz 1 — Site içeriği ve şirket verisi

```
company_settings(anahtar PK, deger, tip, grup, updated_at)
  -- ad, unvan, telefon, e-posta, adres, saatler, vergi/MERSİS, sosyal linkler,
  -- para birimi, dil, zaman dilimi, SEO varsayılanları, analytics ID

company_metrics(id, anahtar UNIQUE, baslik, deger, birim, aciklama, kapsam,
                donem_baslangic, donem_bitis, olcum_yontemi, veri_kaynagi,
                kanit_url, son_dogrulama, sorumlu, gorunur, durum, created_at, updated_at)
  -- durum: taslak | dogrulandi | yayinda | arsiv
  -- KURAL: durum != 'yayinda' ise public sitede RENDER EDİLMEZ

content_pages(id, tip, slug, dil, baslik, meta_title, meta_description, canonical,
              og_gorsel, govde JSON, durum, yayin_at, created_at, updated_at, deleted_at)
  -- tip: blog | hizmet | hizmet-alt | sehir | yasal | sayfa-blogu
  -- UNIQUE (tip, slug, dil)
  -- govde: mevcut ContentBlock birliği (p | h2 | h3 | ul | quote)

content_versions(id, content_id, surum, govde JSON, meta JSON, actor, created_at)
  -- Git geçmişinin yerini tutar. Her kaydetmede önceki hâl saklanır.

content_faq(id, content_id, soru, cevap, sira)
content_links(id, content_id, tip, hedef_tip, hedef_slug)
  -- serviceHref / blogHref / relatedService — serbest metin yerine doğrulanan bağ

testimonials(id, musteri_adi, firma, unvan, metin, yayin_izni, dogrulandi,
             kaynak, sira, gorunur, created_at, updated_at)
case_studies(id, slug, musteri_id, sektor, problem, hedef, yaklasim, cozum,
             teknolojiler JSON, asamalar JSON, teslimatlar JSON, sonuclar JSON,
             olcum_yontemi, gorseller JSON, yayin_izni, durum, created_at, updated_at)

legal_documents(id, anahtar UNIQUE, baslik, aktif_versiyon_id)
legal_document_versions(id, document_id, surum, govde JSON, yururluk_tarihi,
                        hazirlayan, onaylayan, degisiklik_ozeti, created_at)

media_assets(id, dosya_adi, yol, mime, boyut, genislik, yukseklik, alt_metin,
             yukleyen, created_at, deleted_at)
  -- Dosyalar /var/www/beracore-data/uploads (repo dışı)

redirects(id, kaynak UNIQUE, hedef, kod, aktif, created_at)
```

### Faz 2 — Kimlik ve yetki

```
users(id, email UNIQUE, ad, parola_hash, totp_secret, totp_enabled, durum,
      son_giris_at, created_at, updated_at, deleted_at)
roles(id, anahtar UNIQUE, ad, aciklama, sistem)
permissions(id, modul, islem)                 -- UNIQUE (modul, islem)
role_permissions(role_id, permission_id)      -- PK (role_id, permission_id)
user_roles(user_id, role_id)                  -- PK (user_id, role_id)
notifications(id, user_id, tip, oncelik, baslik, govde, okundu, link, created_at)
files(id, entity_type, entity_id, media_id, yukleyen, created_at)
```

> `sessions.email` bugün metin; Faz 2'de `user_id` yabancı anahtarına dönüşür.
> Migration mevcut satırları e-postadan eşleyerek taşır (veri kaybı yok).

### Faz 3 — CRM ve iletişim

```
organizations(id, ad, unvan, domain UNIQUE, sektor, buyukluk, ulke, sehir, adres,
              telefon, email, web, kaynak, skor, iletisim_izni, sorumlu_id,
              created_at, updated_at, deleted_at)
contacts(id, organization_id, ad, unvan, email UNIQUE, telefon, karar_verici,
         iletisim_tercihi, iletisim_izni, dil, created_at, updated_at, deleted_at)
pipelines(id, ad, tip) · pipeline_stages(id, pipeline_id, anahtar, ad, sira, kazanim)
activities(id, entity_type, entity_id, tip, ozet, actor, at)

mail_accounts(id, tur, host, port, kullanici, klasor_haritasi JSON, son_uid, son_sync_at)
mail_messages(id, account_id, uid, klasor, message_id, in_reply_to, references TEXT,
              from_ad, from_adres, to_adres, konu, tarih, okundu, isaretli,
              ek_var, ozet, lead_id, contact_id, synced_at)
  UNIQUE (account_id, klasor, uid)
mail_bodies(message_id PK, text, html_temiz, fetched_at)
mail_attachments(id, message_id, dosya_adi, mime, boyut, part_id)
```

> `leads` korunur; `organization_id` / `contact_id` kolonları eklenerek CRM'e bağlanır.
> Mevcut kayıtlar kaybolmaz.

### Faz 4-5 — Satış ve teslimat

```
opportunities(id, organization_id, contact_id, baslik, tutar, currency, olasilik,
              stage_id, kapanis_tahmini, kaynak, sorumlu_id, kayip_nedeni, ...)
proposals(id, opportunity_id, no UNIQUE, durum, gecerlilik, toplam, currency, ...)
proposal_versions(id, proposal_id, surum, govde JSON, created_at)
contracts(id, proposal_id, tur, durum, imza_tarihi, bitis_tarihi, yenileme_tarihi, ...)
contract_versions(id, contract_id, surum, govde JSON, created_at)

clients(id, organization_id, durum, risk, memnuniyet, yasam_boyu_deger, ...)
projects(id, client_id, ad, tur, durum, saglik, pm_id, baslangic, hedef_teslim,
         butce, gerceklesen_maliyet, ...)
project_members(project_id, user_id, rol)
milestones(id, project_id, ad, hedef_tarih, durum)
tasks(id, project_id, milestone_id, baslik, durum, oncelik, sorumlu_id,
      tahmini_sure, gerceklesen_sure, son_tarih, parent_id, ...)
support_tickets(id, client_id, project_id, konu, durum, oncelik, sla_bitis, ...)
```

### Faz 7 — Outbound (izin altyapısı)

```
campaigns(id, ad, durum, segment JSON, gunluk_limit, onaylayan_id, ...)
campaign_recipients(id, campaign_id, contact_id, durum, gonderim_at, acilma_at, yanit_at)
consent_records(id, contact_id, kanal, izin, hukuki_dayanak, kaynak, at)
suppression_list(id, email UNIQUE, sebep, at)   -- unsubscribe KALICI; silinmez
```

### Faz 8-9 — AI, otomasyon, finans

```
ai_employees(id, anahtar UNIQUE, ad, unvan, departman, gorevler JSON, araclar JSON,
             veri_kapsami JSON, onay_seviyesi, model, prompt_id, maliyet_limiti, aktif)
ai_prompts(id, employee_id, surum, govde, created_at)
ai_executions(id, employee_id, prompt_id, model, girdi_ozet, cikti_ozet, token_giris,
              token_cikis, maliyet, sure_ms, onay_id, sonuc, at)
ai_approvals(id, execution_id, onaylayan_id, karar, gerekce, at)

automations(id, ad, tetikleyici, kosullar JSON, aksiyonlar JSON, onay_gerekli, aktif)
automation_runs(id, automation_id, durum, girdi JSON, cikti JSON, hata, at)
system_jobs(id, tur, durum, ilerleme, girdi JSON, sonuc JSON, hata, deneme,
            basladi_at, bitti_at)   -- SQLite tabanlı kuyruk; işçi süreç okur

invoices(id, client_id, project_id, no UNIQUE, tutar, currency, vade, durum, ...)
payments(id, invoice_id, tutar, currency, tarih, yontem)
expenses(id, project_id, kategori, tutar, currency, tarih, aciklama)

seo_issues(id, tur, onem, url, aciklama, oneri, otomatik_duzeltilebilir, durum, ...)
seo_metrics(id, kaynak, tarih, url, sorgu, tiklama, gosterim, ctr, pozisyon)
integrations(id, saglayici, durum, son_sync_at, hata, kapsam JSON)
credential_references(id, anahtar UNIQUE, saglayici, aciklama, konum)
  -- Sırrın KENDİSİ değil, nerede tutulduğunun referansı
security_events(id, tur, onem, detay JSON, ip, at)
presence_items(id, platform, url, durum, sorumlu, son_kontrol, metrikler JSON)
```

---

## Kritik ilişkiler

```
lead ──dönüşür──> opportunity ──kazanılır──> client ──> project ──> task
  │                    │                        │
  └─ mail_message      ├─ proposal ─> contract  ├─ invoice ─> payment
     (ref no veya      │                        └─ support_ticket
      e-posta ile      └─ activity
      eşleşir)

organization ──1:N──> contact ──1:N──> consent_record
content_pages ──1:N──> content_versions / content_faq / content_links
user ──N:M──> role ──N:M──> permission
```

---

## Yayın akışı (Faz 2 sonrası)

```
content_pages güncellenir (durum = 'yayinda')
  → content_versions'a önceki hâl yazılır
  → kalite kapısı çalışır (src/lib/content/kontrol.ts)
  → revalidatePath(sayfa) + revalidatePath(liste) + revalidatePath('/sitemap.xml')
  → IndexNow bildirimi
  → activity_log kaydı
```

## Kaldırılacak dosyalar (Faz 2 sonunda)

`src/lib/blog-data.ts` · `services-data.ts` · `city-pages-data.ts` · `kvkk-data.ts`
Kaldırma yalnızca şu şart sağlandığında yapılır: **aktarım sonrası üretilen HTML,
aktarım öncesiyle birebir aynı.**
