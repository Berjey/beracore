#!/usr/bin/env node
// BERACORE SEO denetim script'i — A'dan Z'ye kontrol.
// Kullanım:  node scripts/seo-audit.mjs      (önce `npm run build` almak HTML kontrollerini de açar)
//            npm run seo-audit
//
// İki katman:
//   1) VERİ  — blog-data.ts / city-pages-data.ts: meta uzunlukları, kategori, iç link,
//              içerik derinliği, SSS, yinelenen başlık/açıklama, ince içerik.
//   2) HTML  — .next prerender çıktısı (varsa): tek H1, canonical, OG, JSON-LD, gerçek noindex.
// Sorun bulunursa çıkış kodu 1 (CI/kapı olarak kullanılabilir).

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(resolve(ROOT, p), 'utf8');

const blogSrc = read('src/lib/blog-data.ts');
const svcSrc = read('src/lib/services-data.ts');
const citySrc = read('src/lib/city-pages-data.ts');

const VALID_CATEGORIES = new Set(['Yapay Zeka', 'Blockchain', 'Yazılım Geliştirme', 'Tasarım', 'E-Ticaret', 'Dijital Pazarlama']);
const MAX_TITLE = 62, MAX_DESC = 165, MIN_DESC = 110, MIN_H2 = 3, MIN_FAQ = 3, THIN_WORDS = 300;

// Geçerli hizmet hrefleri (relatedService doğrulaması)
const validServiceHrefs = new Set();
{
  let curKey = null;
  for (const m of svcSrc.matchAll(/(key|slug): '([^']+)'/g)) {
    if (m[1] === 'key') { curKey = m[2]; validServiceHrefs.add(`/hizmetler/${curKey}`); }
    else if (curKey) validServiceHrefs.add(`/hizmetler/${curKey}/${m[2]}`);
  }
}

const field = (t, n) => { const m = t.match(new RegExp(`${n}:\\s*\\n?\\s*'((?:[^'\\\\]|\\\\.)*)'`)); return m ? m[1] : null; };
function splitPosts(src) {
  const idxs = [...src.matchAll(/\n    slug: '([^']+)',/g)];
  return idxs.map((m, i) => ({
    slug: m[1],
    text: src.slice(m.index, i + 1 < idxs.length ? idxs[i + 1].index : src.indexOf('\n];', m.index)),
  }));
}

const problems = [];
const P = (slug, msg) => problems.push(`[${slug}] ${msg}`);

// ---------- 1) VERİ: blog ----------
const posts = splitPosts(blogSrc);
const seen = new Set(), byTitle = {}, byMeta = {}, byDesc = {};
for (const p of posts) {
  const t = p.text;
  if (seen.has(p.slug)) P(p.slug, 'YİNELENEN slug');
  seen.add(p.slug);
  if (!/^[a-z0-9-]+$/.test(p.slug)) P(p.slug, 'slug formatı geçersiz');

  const title = field(t, 'title'), mt = field(t, 'metaTitle'), md = field(t, 'metaDescription');
  const cat = field(t, 'category');
  if (!title) P(p.slug, 'title yok'); else (byTitle[title] ??= []).push(p.slug);
  if (!mt) P(p.slug, 'metaTitle yok');
  else { (byMeta[mt] ??= []).push(p.slug); if (mt.length > MAX_TITLE) P(p.slug, `metaTitle ${mt.length}>${MAX_TITLE}`); }
  if (!md) P(p.slug, 'metaDescription yok');
  else { (byDesc[md] ??= []).push(p.slug); if (md.length > MAX_DESC) P(p.slug, `metaDescription ${md.length}>${MAX_DESC}`); else if (md.length < MIN_DESC) P(p.slug, `metaDescription kısa (${md.length}<${MIN_DESC})`); }
  if (!field(t, 'excerpt')) P(p.slug, 'excerpt yok');
  if (!cat) P(p.slug, 'category yok'); else if (!VALID_CATEGORIES.has(cat)) P(p.slug, `category geçersiz: ${cat}`);
  if (!/publishedAt: '\d{4}-\d{2}-\d{2}'/.test(t)) P(p.slug, 'publishedAt yok/geçersiz');
  if (!/readingMinutes: \d+/.test(t)) P(p.slug, 'readingMinutes yok');

  const rs = (t.match(/relatedService:\s*\{[^}]*href:\s*'([^']+)'/) || [])[1];
  if (!rs) P(p.slug, 'relatedService yok (huni iç linki)');
  else if (!validServiceHrefs.has(rs)) P(p.slug, `relatedService href KIRIK: ${rs}`);

  const h2 = (t.match(/type: 'h2'/g) || []).length;
  if (h2 < MIN_H2) P(p.slug, `h2 az (${h2}<${MIN_H2})`);
  if (!/Sonuç/.test(t)) P(p.slug, 'Sonuç bölümü yok');
  const faq = (t.match(/question:/g) || []).length;
  if (faq < MIN_FAQ) P(p.slug, `FAQ az (${faq}<${MIN_FAQ})`);

  let words = 0;
  for (const m of t.matchAll(/text: '((?:[^'\\]|\\.)*)'/g)) words += m[1].split(/\s+/).length;
  for (const m of t.matchAll(/^\s+'((?:[^'\\]|\\.)*)',$/gm)) words += m[1].split(/\s+/).length;
  if (words < THIN_WORDS) P(p.slug, `ince içerik (~${words} kelime<${THIN_WORDS})`);
}
const dupes = (o, label) => Object.entries(o).filter(([, v]) => v.length > 1).forEach(([k, v]) => problems.push(`[YİNELEME] ${label}: "${k.slice(0, 40)}" → ${v.join(', ')}`));
dupes(byTitle, 'title'); dupes(byMeta, 'metaTitle'); dupes(byDesc, 'metaDescription');

// ---------- 1b) VERİ: şehir sayfaları ----------
const cityMt = [...citySrc.matchAll(/metaTitle: '([^']+)'/g)];
const cityMd = [...citySrc.matchAll(/metaDescription:\s*\n\s*'([^']+)'/g)];
cityMt.forEach((m) => { if (m[1].length > MAX_TITLE) problems.push(`[şehir] metaTitle ${m[1].length}>${MAX_TITLE}: ${m[1]}`); });
cityMd.forEach((m) => { if (m[1].length > MAX_DESC) problems.push(`[şehir] metaDescription ${m[1].length}>${MAX_DESC}`); });

// ---------- 2) HTML (build alınmışsa) ----------
const htmlDir = resolve(ROOT, '.next/server/app/blog');
const htmlProblems = [];
let htmlChecked = 0;
if (fs.existsSync(htmlDir)) {
  for (const p of posts) {
    const f = resolve(htmlDir, `${p.slug}.html`);
    if (!fs.existsSync(f)) { htmlProblems.push(`[${p.slug}] HTML üretilmemiş`); continue; }
    htmlChecked++;
    const h = fs.readFileSync(f, 'utf8');
    const H = (m) => htmlProblems.push(`[${p.slug}] ${m}`);
    const h1 = (h.match(/<h1[ >]/g) || []).length;
    if (h1 !== 1) H(`h1 sayısı ${h1} (1 olmalı)`);
    if (!new RegExp(`<link rel="canonical" href="https://beracore\\.com/blog/${p.slug}"`).test(h)) H('canonical yok/yanlış');
    if (!/<meta name="description"/.test(h)) H('meta description yok');
    if (!/<meta property="og:title"/.test(h)) H('og:title yok');
    if (!/"@type":"BlogPosting"/.test(h)) H('BlogPosting JSON-LD yok');
    if (!/"@type":"FAQPage"/.test(h)) H('FAQPage JSON-LD yok');
    if (!/"@type":"BreadcrumbList"/.test(h)) H('BreadcrumbList JSON-LD yok');
    if (/<meta name="robots"[^>]*noindex/i.test(h)) H('GERÇEK noindex robots meta!');
  }
}

// ---------- RAPOR ----------
console.log(`\n════ BERACORE SEO DENETİMİ ════`);
console.log(`Blog yazısı: ${posts.length} | Şehir metaTitle: ${cityMt.length}`);
console.log(`\n── VERİ katmanı ──`);
console.log(problems.length ? problems.join('\n') : '✅ Veri seviyesinde sorun YOK');
console.log(`\n── HTML katmanı ${htmlChecked ? `(${htmlChecked} sayfa)` : '(build yok — atlandı, önce npm run build)'} ──`);
console.log(htmlProblems.length ? htmlProblems.join('\n') : (htmlChecked ? '✅ HTML seviyesinde sorun YOK' : '—'));

const total = problems.length + htmlProblems.length;
console.log(`\n════ SONUÇ: ${total === 0 ? '✅ TEMİZ' : `⚠ ${total} sorun`} ════\n`);
process.exit(total === 0 ? 0 : 1);
