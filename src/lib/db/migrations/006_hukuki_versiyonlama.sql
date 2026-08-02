-- Faz 1.5 — hukuki metinlerde yürürlük ve revizyon geçmişi (denetim bulgusu A-11).
--
-- SORUN: KVKK aydınlatma metni, gizlilik politikası, çerez politikası ve kullanım
-- koşulları sayfalarında yalnızca "Son güncelleme: Nisan 2026" yazıyordu. Metnin
-- ne zaman yürürlüğe girdiği, kimin onayladığı ve NEYİN değiştiği hiçbir yerde
-- kayıtlı değildi.
--
-- Bu bir düzen meselesi değil: bir uyuşmazlıkta "kullanıcı verisini topladığımız
-- tarihte hangi aydınlatma metni geçerliydi" sorusunun tek cevabı bu kayıttır.
-- Git geçmişi bu işi görüyordu; içerik koddan çıktığı için o ağ da kalktı.
--
-- AYRI TABLO KURULMUYOR. `content_versions` zaten her kaydetmede önceki hâlin tam
-- anlık görüntüsünü ve kaydedeni saklıyor. Eksik olan iki alan buraya ekleniyor;
-- hukuki olmayan içerikte boş kalırlar. Paralel bir sürüm sistemi kurmak, iki
-- geçmişin zamanla ayrışması demekti.

ALTER TABLE content_versions ADD COLUMN yururluk TEXT NOT NULL DEFAULT '';
ALTER TABLE content_versions ADD COLUMN degisiklik_notu TEXT NOT NULL DEFAULT '';

-- Revizyon geçmişi PUBLIC sayfada listelenir; tarihe göre sorgulanır.
CREATE INDEX IF NOT EXISTS idx_versions_yururluk ON content_versions(content_id, yururluk);
