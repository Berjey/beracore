/**
 * Merkezi şirket ayarları testleri (bulgu A-08).
 *
 * Bu modülün iki kritik davranışı var ve ikisi de sessizce bozulabilir:
 *
 *  1. **Geri düşme.** Veritabanı okunamazsa site yanlış/boş iletişim bilgisi
 *     göstermek yerine kod varsayılanlarını göstermeli. Bu davranış bozulursa
 *     panelin bir sorunu tüm public sayfaları etkiler — ve kimse fark etmez,
 *     çünkü hata değil, sessiz bir boşluk üretir.
 *
 *  2. **Kaynak tekliği.** Bilgi 6+ dosyada kopyalıydı. Kod tabanında yeniden
 *     sabit değer belirmesini burada yakalıyoruz.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { hazirla, migrasyonlariUygula, temizle } from './yardim/test-db';
import {
  SIRKET_VARSAYILAN,
  telHref,
  mailtoHref,
  whatsappHref,
  konumMetni,
  postalAddress,
} from '@/lib/sirket';

hazirla();

let S: typeof import('@/lib/db/settings');

before(async () => {
  await migrasyonlariUygula();
  S = await import('@/lib/db/settings');
});

after(async () => { await temizle(); });

// ───────────────────────── saf katman ─────────────────────────

test('türetilmiş bağlantılar doğru biçimde üretilir', () => {
  const s = SIRKET_VARSAYILAN;
  assert.equal(telHref(s), 'tel:+905539862306');
  assert.equal(mailtoHref(s), 'mailto:info@beracore.com');
  assert.equal(konumMetni(s), 'İstanbul, Türkiye');
});

test('whatsapp bağlantısı numaradan + ve boşlukları temizler', () => {
  // wa.me yalnızca rakam kabul eder; `+` ile gönderilirse bağlantı sessizce bozulur.
  const url = whatsappHref({ ...SIRKET_VARSAYILAN, telefonE164: '+90 553 986 23 06' });
  assert.ok(url.startsWith('https://wa.me/905539862306?text='), url);
  assert.ok(!url.includes('+90 '), 'numarada biçimlendirme karakteri kaldı');
});

test('açık adres boşken yapısal veride streetAddress ÜRETİLMEZ', () => {
  // Boş bir streetAddress yayınlamak arama motoruna eksik/yanlış sinyal verir.
  assert.ok(!('streetAddress' in postalAddress(SIRKET_VARSAYILAN)));
  assert.equal(
    'streetAddress' in postalAddress({ ...SIRKET_VARSAYILAN, adres: 'Örnek Cad. 1' }),
    true,
  );
});

// ───────────────────────── veritabanı katmanı ─────────────────────────

test('migration koddaki değerlerin AYNISIYLA tohumlar', () => {
  // Taşıma işlemi sitede görünen hiçbir metni değiştirmemeliydi. Bu test, ileride
  // varsayılan ile tohum değerinin ayrışmasını yakalar.
  const s = S.getSirket();
  for (const alan of ['ad', 'email', 'telefonE164', 'telefonGorunen', 'sehir', 'ulke', 'calismaSaatleri'] as const) {
    assert.equal(s[alan], SIRKET_VARSAYILAN[alan], `"${alan}" tohum değeri koddan farklı`);
  }
});

test('setAyar değeri günceller, getSirket yenisini döner', () => {
  S.setAyar('telefonGorunen', '0555 111 22 33');
  assert.equal(S.getSirket().telefonGorunen, '0555 111 22 33');
  S.setAyar('telefonGorunen', SIRKET_VARSAYILAN.telefonGorunen);
});

test('BOŞ değer kod varsayılanını EZMEZ', () => {
  // Panelde bir alan yanlışlıkla temizlenirse site boş telefon göstermemeli.
  S.setAyar('email', '');
  assert.equal(S.getSirket().email, SIRKET_VARSAYILAN.email);
  S.setAyar('email', SIRKET_VARSAYILAN.email);
});

test('bilinmeyen anahtar yazılamaz', () => {
  // Panel formundan gelen alan adları allowlist'ten geçmeli.
  assert.equal(S.setAyar('uydurma_anahtar', 'x'), false);
});

test('sosyal listesi satırlara bölünür, boş satırlar atılır', () => {
  S.setAyar('sosyal', 'https://x.com/beracore\n\n  https://linkedin.com/company/beracore  \n');
  assert.deepEqual(S.getSirket().sosyal, [
    'https://x.com/beracore',
    'https://linkedin.com/company/beracore',
  ]);
  S.setAyar('sosyal', '');
  assert.deepEqual(S.getSirket().sosyal, [], 'boş ayar boş dizi vermeli');
});

test('listAyarlar panel için gruplu ve sıralı döner', () => {
  const liste = S.listAyarlar();
  assert.ok(liste.length >= 17);
  assert.deepEqual(liste.map((a) => a.sira), [...liste.map((a) => a.sira)].sort((x, y) => x - y));
  assert.ok(liste.every((a) => a.grup && a.tip), 'her ayarın grubu ve tipi olmalı');
});

// ───────────────────────── kaynak tekliği ─────────────────────────

test('iletişim bilgisi bileşenlerde YENİDEN SABİTLENMEMİŞ', () => {
  // Asıl amaç buydu: telefon 6, e-posta 8+ dosyada kopyalıydı (A-08).
  // Bu test, ileride birinin kolaylık olsun diye tekrar sabit yazmasını yakalar.
  const dosyalar = [
    'src/components/Footer.tsx',
    'src/components/ContactPage.tsx',
    'src/components/AboutPage.tsx',
    'src/components/ServicePage.tsx',
    'src/components/WhatsAppCta.tsx',
    'src/app/layout.tsx',
  ];
  const yasakli = [/905539862306/, /0553\s?986\s?23\s?06/, /info@beracore\.com/];

  const bulgular: string[] = [];
  for (const yol of dosyalar) {
    const icerik = readFileSync(new URL(`../${yol}`, import.meta.url), 'utf8');
    for (const kalip of yasakli) {
      if (kalip.test(icerik)) bulgular.push(`${yol} → ${kalip}`);
    }
  }
  assert.deepEqual(
    bulgular,
    [],
    `iletişim bilgisi yeniden sabitlenmiş; @/lib/sirket üzerinden okunmalı:\n${bulgular.join('\n')}`,
  );
});

test('varsayılanlar ile migration tohumu aynı anahtar kümesini kapsar', () => {
  // Kodda olup migration'da olmayan bir alan panelden asla düzenlenemez —
  // sessizce "yönetilemeyen ayar" doğar.
  const dbAnahtarlari = new Set(S.listAyarlar().map((a) => a.anahtar));
  const eksikler = Object.keys(SIRKET_VARSAYILAN).filter((k) => !dbAnahtarlari.has(k));
  assert.deepEqual(eksikler, [], `migration'da karşılığı olmayan alanlar: ${eksikler.join(', ')}`);
});
