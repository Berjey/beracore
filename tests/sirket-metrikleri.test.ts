/**
 * Şirket metrikleri testleri (bulgu A-07).
 *
 * Buradaki asıl mesele estetik değil dürüstlük: kanıtı olmayan bir sayı public
 * sitede görünmemeli. O kural üç ayrı yerde kırılabilir ve üçü de sessizdir —
 * sorgu filtresi kalkarsa, panel doğrulaması gevşerse, ya da biri sayıyı tekrar
 * koda sabitlerse. Testler üçünü de kilitler.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { hazirla, migrasyonlariUygula, temizle } from './yardim/test-db';
import { METRIK_VARSAYILAN, metrikMetni, type Metrik } from '@/lib/metrikler';

hazirla();

let M: typeof import('@/lib/db/metrics');

before(async () => {
  await migrasyonlariUygula();
  M = await import('@/lib/db/metrics');
});

after(async () => { await temizle(); });

// ───────────────────────── saf katman ─────────────────────────

test('varsayılan metrik listesi BOŞTUR', () => {
  // Şirket ayarlarının tersine burada varsayılan "sus"tur: veritabanı okunamazsa
  // bölüm kaybolur, kanıtsız bir sayı kod varsayılanı olarak geri sızmaz.
  assert.deepEqual(METRIK_VARSAYILAN, []);
});

test('metrik metni ön ek ve son ekle birlikte kurulur', () => {
  const m: Metrik = {
    anahtar: 't', baslik: 'T', altBaslik: '', deger: 97, onEk: '%', sonEk: '', ikon: '',
  };
  assert.equal(metrikMetni(m), '%97');
  assert.equal(metrikMetni({ ...m, onEk: '', sonEk: '+', deger: 25 }), '25+');
  assert.equal(metrikMetni({ ...m, onEk: '', sonEk: '', deger: 2024 }), '2024');
  // Sayaç animasyonu ara değerlerde de aynı biçimi kullanır.
  assert.equal(metrikMetni(m, 40), '%40');
});

// ───────────────────────── yayın kuralı ─────────────────────────

test('yalnızca durumu yayinda olan metrikler public sorguda döner', () => {
  const anaSayfa = M.getMetrikler('ana_sayfa');
  const anahtarlar = anaSayfa.map((m) => m.anahtar);

  assert.ok(anahtarlar.includes('kurulus-yili'));
  assert.ok(anahtarlar.includes('uzman-ekip'));

  // Kanıtı olmayan üç iddia migration'da 'taslak' olarak gelir → görünmez.
  assert.ok(!anahtarlar.includes('tamamlanan-proje'));
  assert.ok(!anahtarlar.includes('kurumsal-musteri'));
  assert.ok(!anahtarlar.includes('memnuniyet-orani'));
});

test('taslak metrik yayına alınınca sorguda belirir, geri alınınca kaybolur', () => {
  const oncesi = M.getMetrikler('ana_sayfa').length;

  const r = M.guncelleMetrik('tamamlanan-proje', {
    deger: 25,
    olcum_yontemi: 'Kapatılmış proje sayısı',
    veri_kaynagi: 'Proje kaydı 2024-2026',
    kanit_url: '',
    son_dogrulama: '2026-08-02',
    durum: 'yayinda',
    ana_sayfa: true,
    hakkimizda: true,
  });
  assert.equal(r.ok, true);
  assert.equal(M.getMetrikler('ana_sayfa').length, oncesi + 1);

  // Geri al — testin diğer testlerden bağımsız kalması için de gerekli.
  M.guncelleMetrik('tamamlanan-proje', {
    deger: 25, olcum_yontemi: '', veri_kaynagi: '', kanit_url: '',
    son_dogrulama: '', durum: 'taslak', ana_sayfa: true, hakkimizda: true,
  });
  assert.equal(M.getMetrikler('ana_sayfa').length, oncesi);
});

test('veri kaynağı boşken metrik YAYINLANAMAZ', () => {
  const r = M.guncelleMetrik('memnuniyet-orani', {
    deger: 97,
    olcum_yontemi: 'Anket ortalaması',
    veri_kaynagi: '   ', // yalnızca boşluk — dolu sayılmaz
    kanit_url: '',
    son_dogrulama: '',
    durum: 'yayinda',
    ana_sayfa: true,
    hakkimizda: false,
  });
  assert.equal(r.ok, false);
  assert.equal(r.hata, 'kanitsiz-yayin');
  // Ve gerçekten yayına geçmemiş olmalı.
  assert.ok(!M.getMetrikler('ana_sayfa').some((m) => m.anahtar === 'memnuniyet-orani'));
});

test('geçersiz durum ve negatif değer reddedilir', () => {
  assert.equal(
    M.guncelleMetrik('uzman-ekip', {
      deger: 5, olcum_yontemi: '', veri_kaynagi: 'İç kayıt', kanit_url: '',
      son_dogrulama: '', durum: 'canli', ana_sayfa: true, hakkimizda: true,
    }).hata,
    'gecersiz-durum'
  );

  assert.equal(
    M.guncelleMetrik('uzman-ekip', {
      deger: -3, olcum_yontemi: '', veri_kaynagi: 'İç kayıt', kanit_url: '',
      son_dogrulama: '', durum: 'yayinda', ana_sayfa: true, hakkimizda: true,
    }).hata,
    'gecersiz-deger'
  );
});

test('bilinmeyen anahtar güncellenemez', () => {
  const r = M.guncelleMetrik('uydurma-metrik', {
    deger: 999, olcum_yontemi: '', veri_kaynagi: 'x', kanit_url: '',
    son_dogrulama: '', durum: 'yayinda', ana_sayfa: true, hakkimizda: true,
  });
  assert.equal(r.ok, false);
  assert.equal(r.hata, 'bulunamadi');
});

test('yüzey bayrakları ayrı çalışır', () => {
  M.guncelleMetrik('uzman-ekip', {
    deger: 5, olcum_yontemi: '', veri_kaynagi: 'İç kayıt', kanit_url: '',
    son_dogrulama: '', durum: 'yayinda', ana_sayfa: false, hakkimizda: true,
  });

  assert.ok(!M.getMetrikler('ana_sayfa').some((m) => m.anahtar === 'uzman-ekip'));
  assert.ok(M.getMetrikler('hakkimizda').some((m) => m.anahtar === 'uzman-ekip'));

  // eski hâline döndür
  M.guncelleMetrik('uzman-ekip', {
    deger: 5, olcum_yontemi: '', veri_kaynagi: 'İç kayıt', kanit_url: '',
    son_dogrulama: '', durum: 'yayinda', ana_sayfa: true, hakkimizda: true,
  });
});

test('panel listesi her durumdaki metriği kanıt alanlarıyla döner', () => {
  const hepsi = M.listMetrikler();
  assert.ok(hepsi.length >= 5);
  const memnuniyet = hepsi.find((m) => m.anahtar === 'memnuniyet-orani');
  assert.ok(memnuniyet);
  assert.equal(memnuniyet.durum, 'taslak');
  // Ölçüm yöntemi migration'da yazılı — "anket yapılmadıysa yayınlanmamalı" notu.
  assert.ok(memnuniyet.olcum_yontemi.length > 0);
});

// ───────────────────── kaynak tekliği ─────────────────────

/**
 * Yorumları söker. Gerekli, çünkü bulguların GEREKÇESİ yorumlarda anlatılıyor ve
 * o metinler yasaklı ifadeleri içeriyor; satır başına bakan basit bir filtre
 * çok satırlı yorumların devam satırlarını kaçırır.
 */
function kodSuz(kaynak: string): string {
  return kaynak.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

test('metrik sayıları bileşenlerde yeniden sabitlenmemiş', () => {
  // A-07'nin tekrar etme biçimi: birinin "kolay olsun" diye sayıyı tekrar JSX'e
  // yazması. Bu test o an patlar.
  const dosyalar = [
    'src/components/Stats.tsx',
    'src/components/AboutPage.tsx',
  ];

  for (const yol of dosyalar) {
    const kaynak = readFileSync(yol, 'utf8');
    // Yorum satırları hariç tutulur: bulgunun gerekçesi yorumlarda ANLATILIYOR.
    const kod = kodSuz(kaynak);

    for (const yasak of ['25+', '15+', '%97', 'Tamamlanan Proje', 'Kurumsal Müşteri', 'Memnuniyet Oranı']) {
      assert.ok(
        !kod.includes(yasak),
        `${yol} içinde metrik değeri yeniden sabitlenmiş: ${yasak}`
      );
    }
  }
});

test('hizmet sayfalarında kuruluş yılıyla çelişen deneyim iddiası yok', () => {
  // "8+ Yıl Deneyim" yazıyordu; şirket 2024'te kuruldu.
  const kaynak = readFileSync('src/lib/services-data.ts', 'utf8');
  const kod = kaynak.split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  assert.ok(!/\d\+'?\s*'?,?\s*label:\s*'Yıl Deneyim'/.test(kod));
  assert.ok(!kod.includes("label: 'Yıl Deneyim'"));
});

// ────────────── hizmet sayfaları ve kayan şerit ──────────────

test('hizmet sayfası istatistikleri kanıtsız SAYI taşımaz', async () => {
  // Öncesinde 23 alt hizmet sayfası toplam 92 sayı basıyordu: "120+ Web Projesi",
  // "80+ Özel Proje", "180+ Tasarım Projesi", "2500+ Tasarım"... Toplamı 500'ü
  // aşıyordu, ana sayfa ise "25+ proje" diyordu. Aynı ziyaretçi ikisini de görebiliyordu.
  //
  // Yerlerine, doğruluğu şirketin kendi çalışma biçiminden gelen ifadeler kondu.
  // Teknik standart adları (256-bit, 3D Secure, ERC-20, 360°) ve sözleşmeye bağlı
  // taahhütler (3+ revizyon hakkı) sayı içerse de iddia değildir; muaf tutulur.
  const { services } = await import('@/lib/services-data');
  const MUAF = new Set(['256-bit', '3D Secure', 'ERC-20', '360°', '3+']);

  const ihlaller: string[] = [];
  for (const s of services) {
    for (const alt of s.subServices) {
      for (const st of alt.stats) {
        if (MUAF.has(st.value)) continue;
        if (/\d/.test(st.value)) ihlaller.push(`${alt.slug}: ${st.value} ${st.label}`);
      }
    }
  }
  assert.deepEqual(ihlaller, []);
});

test('kayan şeritte sertifika veya hizmet seviyesi iddiası yok', async () => {
  // 'PCI DSS Uyumlu' ve 'ISO Standartları' sertifika iddiasıydı; elde böyle bir
  // belge yok. '7/24 Destek' ve '%99.9 Uptime' ise karşılığı olmayan taahhütlerdi.
  const kaynak = readFileSync('src/components/TechMarquee.tsx', 'utf8');
  const kod = kodSuz(kaynak);
  for (const yasak of ['PCI DSS', 'ISO Standartları', '7/24 Destek', '%99.9', '120+', '50+']) {
    assert.ok(!kod.includes(yasak), `kayan şeritte savunulamaz iddia: ${yasak}`);
  }
  // KVKK sertifika değil yasal yükümlülük — kalmalı.
  assert.ok(kod.includes('KVKK Uyumlu'));
});
