import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blogPosts } from '@/lib/blog-data';
import { getRelatedPosts, getInboundLinkCounts } from '@/lib/related-posts';

test('her yazı tam 3 ilgili yazı alır', () => {
  for (const post of blogPosts) {
    const related = getRelatedPosts(post.slug);
    assert.equal(related.length, 3, `${post.slug}: 3 yerine ${related.length} ilgili yazı`);
  }
});

test('bir yazı kendisine link vermez ve aynı yazı iki kez listelenmez', () => {
  for (const post of blogPosts) {
    const slugs = getRelatedPosts(post.slug).map((r) => r.slug);
    assert.ok(!slugs.includes(post.slug), `${post.slug}: kendisine link veriyor`);
    assert.equal(new Set(slugs).size, slugs.length, `${post.slug}: yinelenen ilgili yazı`);
  }
});

test('YETİM YAZI YOK — her yazı en az 1 iç link alır', () => {
  // A5'in varlık nedeni: eski mantık daima kategorinin en eski 3 yazısını
  // seçtiği için yeni yazılar 0 link alıyordu.
  const counts = getInboundLinkCounts();
  const orphans = [...counts.entries()].filter(([, n]) => n === 0).map(([slug]) => slug);
  assert.deepEqual(orphans, [], `iç link almayan yazı(lar): ${orphans.join(', ')}`);
});

test('iç link dağılımı dengeli — hiçbir yazı ortalamanın 3 katından fazla link almaz', () => {
  const counts = [...getInboundLinkCounts().values()];
  const total = counts.reduce((a, b) => a + b, 0);
  const avg = total / counts.length;
  const max = Math.max(...counts);
  assert.ok(
    max <= avg * 3,
    `dağılım dengesiz: ortalama ${avg.toFixed(2)}, en yüksek ${max}`,
  );
});

test('alaka korunur — mümkün olduğunda aynı kategoriden seçilir', () => {
  for (const post of blogPosts) {
    const sameCatAvailable = blogPosts.filter(
      (p) => p.slug !== post.slug && p.category === post.category,
    ).length;
    if (sameCatAvailable === 0) continue;
    const related = getRelatedPosts(post.slug);
    const sameCatPicked = related.filter((r) => r.category === post.category).length;
    assert.equal(
      sameCatPicked,
      Math.min(3, sameCatAvailable),
      `${post.slug}: aynı kategoriden ${Math.min(3, sameCatAvailable)} beklenirken ${sameCatPicked} seçildi`,
    );
  }
});

test('DETERMİNİSTİK — aynı girdi her çağrıda aynı çıktıyı verir', () => {
  // SSG için zorunlu: rastgelelik olsaydı her build tüm blog HTML'ini değiştirirdi.
  const first = blogPosts.map((p) => getRelatedPosts(p.slug).map((r) => r.slug).join(','));
  const second = blogPosts.map((p) => getRelatedPosts(p.slug).map((r) => r.slug).join(','));
  assert.deepEqual(first, second);
});

test('ilgili yazı nesneleri YALNIZCA özet alanlarını taşır (client payload güvencesi)', () => {
  const related = getRelatedPosts(blogPosts[0].slug);
  const allowed = ['slug', 'title', 'excerpt', 'publishedAt', 'category', 'readingMinutes'];
  for (const r of related) {
    assert.deepEqual(
      Object.keys(r).sort(),
      [...allowed].sort(),
      'özet nesnesi beklenmeyen alan taşıyor (content/faq client\'a sızıyor olabilir)',
    );
  }
});
