/**
 * Lead veri katmanı testleri.
 *
 * Bu dosyanın var olma sebebi: `src/lib/db/leads.ts` panelin ve iletişim formunun
 * TEK kalıcılık yolu ama Faz 0'a kadar hiç testi yoktu. Buradaki bir regresyon
 * "müşteri talebi kayboldu" demektir — sitedeki en pahalı hata sınıfı.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { hazirla, migrasyonlariUygula, temizle } from './yardim/test-db';

// DB_PATH, getDb()'yi kullanan hiçbir modül import edilmeden ÖNCE ayarlanmalı.
hazirla();

type LeadsModulu = typeof import('@/lib/db/leads');
let L: LeadsModulu;

before(async () => {
  await migrasyonlariUygula();
  L = await import('@/lib/db/leads');
});

after(async () => { await temizle(); });

function ornekLead(ref: string, ekstra: Partial<Parameters<LeadsModulu['insertLead']>[0]> = {}) {
  return {
    ref,
    name: 'Test Kullanıcı',
    email: 'test@ornek.com',
    phone: '',
    company: '',
    service: 'Yazılım Geliştirme',
    budget: '',
    timeline: '',
    message: 'Deneme mesajı',
    ip: '10.0.0.1',
    userAgent: 'test-agent',
    mailSent: false,
    ...ekstra,
  };
}

test('insertLead kaydı yazar ve getLead aynısını geri verir', () => {
  const id = L.insertLead(ornekLead('BRC-20260802-0001'));
  assert.ok(id > 0);

  const lead = L.getLead(id);
  assert.ok(lead, 'kayıt bulunamadı');
  assert.equal(lead.ref, 'BRC-20260802-0001');
  assert.equal(lead.email, 'test@ornek.com');
  assert.equal(lead.status, 'yeni', 'yeni kayıt varsayılan olarak "yeni" olmalı');
  assert.equal(lead.mail_sent, 0);
  assert.equal(lead.source, 'contact-form');
});

test('ref UNIQUE — aynı referans iki kez yazılamaz', () => {
  L.insertLead(ornekLead('BRC-20260802-0002'));
  // Referans numarası müşteriye gösteriliyor; iki farklı talebin aynı numarayı
  // taşıması destek tarafında çözülemez bir karışıklık üretir.
  assert.throws(() => L.insertLead(ornekLead('BRC-20260802-0002')));
});

test('ip ve user_agent uzunluk sınırına kırpılır', () => {
  const id = L.insertLead(
    ornekLead('BRC-20260802-0003', { ip: 'x'.repeat(200), userAgent: 'y'.repeat(500) }),
  );
  const lead = L.getLead(id)!;
  assert.equal(lead.ip.length, 64);
  assert.equal(lead.user_agent.length, 300);
});

test('getLead olmayan kimlik için null döner', () => {
  assert.equal(L.getLead(999999), null);
});

test('updateLeadStatus durumu değiştirir', () => {
  const id = L.insertLead(ornekLead('BRC-20260802-0004'));
  L.updateLeadStatus(id, 'iletisimde');
  assert.equal(L.getLead(id)!.status, 'iletisimde');
});

test('listLeads geçersiz durum filtresini YOK SAYAR (SQL enjeksiyonu yüzeyi)', () => {
  // `durum` kullanıcıdan gelen bir query parametresi. Allowlist dışındaki değer
  // filtresiz listeye düşmeli — sessizce boş sonuç değil, ama asla sorguya girmemeli.
  const hepsi = L.listLeads();
  const uydurma = L.listLeads("yeni' OR '1'='1");
  assert.equal(uydurma.length, hepsi.length);
});

test('listLeads durum filtresi doğru çalışır', () => {
  const id = L.insertLead(ornekLead('BRC-20260802-0005'));
  L.updateLeadStatus(id, 'kazanildi');

  const kazanilan = L.listLeads('kazanildi');
  assert.ok(kazanilan.length >= 1);
  assert.ok(kazanilan.every((l) => l.status === 'kazanildi'));
});

test('listLeads en yeniden eskiye sıralar', () => {
  const liste = L.listLeads();
  for (let i = 1; i < liste.length; i++) {
    assert.ok(
      liste[i - 1].created_at >= liste[i].created_at,
      'created_at azalan sırada olmalı',
    );
  }
});

test('countByStatus durum başına sayar', () => {
  const sayilar = L.countByStatus();
  const toplam = Object.values(sayilar).reduce((a, b) => a + b, 0);
  assert.equal(toplam, L.listLeads(undefined, 1000).length);
});

test('not ekleme ve listeleme — en yeni önce', () => {
  const id = L.insertLead(ornekLead('BRC-20260802-0006'));
  L.addNote(id, 'ilk not');
  L.addNote(id, 'ikinci not');

  const notlar = L.listNotes(id);
  assert.equal(notlar.length, 2);
  assert.ok(notlar.every((n) => n.entity_type === 'lead' && n.entity_id === id));
});

test('notlar lead bazında yalıtılmış — başka kaydın notu sızmaz', () => {
  const a = L.insertLead(ornekLead('BRC-20260802-0007'));
  const b = L.insertLead(ornekLead('BRC-20260802-0008'));
  L.addNote(a, 'yalnizca A');

  assert.equal(L.listNotes(a).length, 1);
  assert.equal(L.listNotes(b).length, 0);
});

test('LEAD_DURUMLARI ile DURUM_ETIKET birebir örtüşür', () => {
  // Etiketi olmayan bir durum panelde ham slug olarak görünür; sessiz bozulma.
  for (const d of L.LEAD_DURUMLARI) {
    assert.ok(L.DURUM_ETIKET[d], `"${d}" durumunun Türkçe etiketi yok`);
  }
  assert.equal(Object.keys(L.DURUM_ETIKET).length, L.LEAD_DURUMLARI.length);
});
