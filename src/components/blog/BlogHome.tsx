'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import type { BlogPost, CategoryMeta } from '@/lib/blog-data';
import styles from './blog.module.css';
import FeaturedPost from './FeaturedPost';
import PostCard from './PostCard';
import BlogCTA from './BlogCTA';
import { ArrowIcon, CategoryIcon, catKey } from './util';

interface Props {
  posts: BlogPost[];           // en yeni üstte
  categories: CategoryMeta[];
  picks: BlogPost[];           // popüler konular (kategori çeşitliliği)
}

const HERO_LINE1 = 'İçgörüler ve';
const HERO_LINE2 = 'Rehberler';

/** Başlığı karakterlere böler (site hero diliyle 3D reveal). --ci yalnızca
 *  sıralama indeksidir (görsel stil değil). */
function Chars({ text, offset, accent }: { text: string; offset: number; accent?: boolean }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className={`${styles.char} ${accent ? styles.accentText : ''}`}
          style={{ '--ci': offset + i } as CSSProperties}
        >
          {ch}
        </span>
      ))}
    </>
  );
}

export default function BlogHome({ posts, categories, picks }: Props) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('Tümü');
  const rootRef = useRef<HTMLDivElement>(null);

  const featured = posts[0];
  const q = query.trim().toLocaleLowerCase('tr');
  const isDefault = activeCat === 'Tümü' && q === '';

  const matches = useMemo(() => {
    return posts.filter((p) => {
      if (activeCat !== 'Tümü' && p.category !== activeCat) return false;
      if (!q) return true;
      return `${p.title} ${p.excerpt} ${p.category}`.toLocaleLowerCase('tr').includes(q);
    });
  }, [posts, activeCat, q]);

  // Varsayılan görünümde en yeni yazı vitrinde → grid'den çıkar. Filtre/aramada
  // tüm eşleşmeler gride girer.
  const gridPosts = isDefault ? posts.slice(1) : matches;

  // ===== Reveal: ekrana giren [data-reveal]'lere .is-visible ekle.
  // reduced-motion açıksa veya IO yoksa hepsi anında görünür (flash/kilitlenme yok).
  const revealKey = `${activeCat}|${q}|${gridPosts.length}`;
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
    );
    els.forEach((el) => {
      if (!el.classList.contains('is-visible')) io.observe(el);
    });
    // Güvenlik ağı: JS/IO takılırsa 1.5s sonra her şeyi göster.
    const fallback = window.setTimeout(() => els.forEach((el) => el.classList.add('is-visible')), 1500);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [revealKey]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of posts) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return map;
  }, [posts]);

  return (
    <div ref={rootRef} className={`${styles.root} overflow-hidden pb-28 pt-32 max-md:pb-20 max-md:pt-28`}>
      {/* ===== HERO ===== */}
      <div className={styles.ambient} aria-hidden="true">
        <span className={styles.ambientGlow} />
        <span className={styles.ambientMesh} />
      </div>

      <header className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <span data-reveal="up" className="mb-5 inline-block font-body text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-accent2/60">
          BERACORE Blog
        </span>
        <h1
          aria-label={`${HERO_LINE1} ${HERO_LINE2}`}
          className={`${styles.title} font-heading text-[clamp(2.4rem,6.5vw,4.4rem)] font-semibold leading-[1.03] tracking-tight`}
        >
          <span aria-hidden="true" className="mr-[0.28em] inline-block text-t1">
            <Chars text={HERO_LINE1} offset={0} />
          </span>
          <span aria-hidden="true" className="relative inline-block">
            <span className={styles.titleGlow} aria-hidden="true" />
            <Chars text={HERO_LINE2} offset={HERO_LINE1.length} accent />
          </span>
        </h1>
        <p data-reveal="up" className="mx-auto mt-6 max-w-2xl font-body text-[1.12rem] font-light leading-relaxed text-t2 max-md:text-[1rem]">
          Yapay zeka, web, e-ticaret, yazılım ve dijital pazarlama üzerine uygulanabilir bilgiler —
          işletmenizi bir adım öne taşıyacak içerikler.
        </p>

        {/* Arama */}
        <div data-reveal="up" className={`${styles.search} mt-9`}>
          <span className={styles.searchIcon} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.2-3.2" />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Yazılarda ara…"
            aria-label="Blog yazılarında ara"
            className={styles.searchInput}
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Aramayı temizle" className={styles.searchClear}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          )}
        </div>

        {/* Kategori filtresi */}
        <div data-reveal="up" className="mt-6 flex flex-wrap justify-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveCat('Tümü')}
            className={`${styles.pill} ${activeCat === 'Tümü' ? styles.pillActive : ''}`}
          >
            <span className={styles.pillDot} aria-hidden="true" />
            Tümü
            <span className={styles.pillCount}>{posts.length}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => setActiveCat(cat.name)}
              className={`${styles.tint} ${styles.pill} ${activeCat === cat.name ? styles.pillActive : ''}`}
              data-cat={catKey(cat.name)}
            >
              <span className={styles.pillDot} aria-hidden="true" />
              {cat.name}
              <span className={styles.pillCount}>{counts.get(cat.name) ?? 0}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ===== İÇERİK ===== */}
      <div className="relative z-10 mx-auto mt-16 max-w-6xl px-6 max-md:mt-12">
        {/* Öne çıkan (yalnızca varsayılan görünüm) */}
        {isDefault && featured && (
          <section aria-label="Öne çıkan yazı" className="mb-16 max-md:mb-12">
            <FeaturedPost post={featured} />
          </section>
        )}

        {/* Yazı listesi */}
        <section aria-labelledby="blog-list-title">
          <div data-reveal="up" className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className={styles.sectionKicker}>{isDefault ? 'Arşiv' : 'Sonuçlar'}</span>
              <h2 id="blog-list-title" className={`${styles.sectionTitle} mt-2`}>
                {isDefault ? 'Son Yazılar' : `${matches.length} sonuç`}
              </h2>
            </div>
            {!isDefault && (
              <button
                type="button"
                onClick={() => { setActiveCat('Tümü'); setQuery(''); }}
                className="shrink-0 font-body text-[0.8rem] font-medium text-t3 underline-offset-4 transition-colors hover:text-t1 hover:underline"
              >
                Filtreyi temizle
              </button>
            )}
          </div>

          {gridPosts.length === 0 ? (
            <div data-reveal="up" className="rounded-2xl border border-white/[0.06] bg-white/[0.015] py-20 text-center">
              <p className="font-body text-t2">Aramanıza uygun yazı bulunamadı.</p>
              <button
                type="button"
                onClick={() => { setActiveCat('Tümü'); setQuery(''); }}
                className="mt-3 font-body text-[0.85rem] font-semibold text-accent transition-opacity hover:opacity-80"
              >
                Tüm yazıları göster
              </button>
            </div>
          ) : (
            <ul className={`${styles.cards} grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3`}>
              {gridPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </ul>
          )}
        </section>

        {/* Popüler konular (yalnızca varsayılan görünüm) */}
        {isDefault && picks.length > 0 && (
          <section aria-labelledby="blog-popular-title" className="mt-20 max-md:mt-16">
            <div data-reveal="up" className="mb-8">
              <span className={styles.sectionKicker}>Kategoriye göre</span>
              <h2 id="blog-popular-title" className={`${styles.sectionTitle} mt-2`}>Popüler Konular</h2>
            </div>
            <div className={`${styles.cards} grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3`}>
              {picks.map((post) => (
                <div key={post.slug} data-reveal="scale">
                  <Link href={`/blog/${post.slug}`} className={`${styles.tint} ${styles.topic}`} data-cat={catKey(post.category)}>
                    <span className={styles.topicIcon} aria-hidden="true">
                      <CategoryIcon category={post.category} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-t3">{post.category}</span>
                      <span className="mt-1 block truncate font-body text-[0.92rem] font-medium text-t1">{post.title}</span>
                    </span>
                    <span className="shrink-0 text-t3"><ArrowIcon size={15} /></span>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dönüşüm bandı */}
        <div className="mt-24 max-md:mt-16">
          <BlogCTA />
        </div>
      </div>
    </div>
  );
}
