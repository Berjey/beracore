/**
 * İletişim formu uzunluk sınırları — tek kaynak testi (bulgu A-10).
 *
 * Sunucu ve istemci sınırları ayrı yazılıyordu ve ayrışmıştı (mesaj: 4000 / 2000).
 * Bugün zararsızdı çünkü istemci daha katıydı; ters yönde bir ayrışma kullanıcının
 * yazdığı metnin sessizce kırpılması demekti. Bu test, ikisinin de aynı modülü
 * kullandığını doğrular — değerlerin eşit olduğunu değil, KAYNAĞIN tek olduğunu.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FORM_LIMITS } from '@/lib/form-limits';

test('sınırlar makul ve tam sayı', () => {
  for (const [alan, deger] of Object.entries(FORM_LIMITS)) {
    assert.ok(Number.isInteger(deger) && deger > 0, `${alan} geçersiz`);
  }
  assert.ok(FORM_LIMITS.message >= 500, 'mesaj sınırı anlamlı uzunlukta olmalı');
});

test('sunucu rotası sınırları koda SABİT YAZMAZ', () => {
  const kaynak = readFileSync('src/app/api/contact/route.ts', 'utf8');
  assert.ok(kaynak.includes("from '@/lib/form-limits'"), 'tek kaynak import edilmemiş');
  assert.ok(
    !/const LIMITS = \{[^}]*\d+/.test(kaynak),
    'sunucu tarafında sabit sınır sözlüğü geri gelmiş'
  );
});

test('iletişim formu maxLength değerlerini koda SABİT YAZMAZ', () => {
  const kaynak = readFileSync('src/components/ContactPage.tsx', 'utf8');
  assert.ok(kaynak.includes("from '@/lib/form-limits'"), 'tek kaynak import edilmemiş');
  assert.ok(
    !/maxLength=\{\d+\}/.test(kaynak),
    'istemci tarafında sabit maxLength geri gelmiş'
  );
});
