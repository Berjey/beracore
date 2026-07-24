'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { BlogPost, CategoryMeta } from '@/lib/blog-data';
import { getCategoryColor } from '@/lib/blog-data';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  posts: BlogPost[];
  categories: CategoryMeta[];
}

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${parseInt(d, 10)} ${MONTHS[parseInt(m, 10) - 1]} ${y}`;
}

export default function BlogIndex({ posts, categories }: Props) {
  const [activeCat, setActiveCat] = useState<string>('Tümü');
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const featured = posts[0];
  const rest = posts.slice(1);

  const filteredRest = useMemo(() => {
    if (activeCat === 'Tümü') return rest;
    return rest.filter((p) => p.category === activeCat);
  }, [activeCat, rest]);

  // Featured yalnızca "Tümü" veya kendi kategorisinde görünür
  const showFeatured = activeCat === 'Tümü' || featured?.category === activeCat;

  // ===== Hero giriş animasyonu =====
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.15 });
        tl.fromTo('.bl-label', { y: 20, opacity: 0, letterSpacing: '0.8em' }, { y: 0, opacity: 1, letterSpacing: '0.5em', duration: 0.8, ease: 'power3.out' })
          .fromTo('.bl-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.35')
          .fromTo('.bl-sub', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.45')
          .fromTo('.bl-filter', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, '-=0.3')
          .fromTo('.bl-featured', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.2');
      }, container);
    }, 60);
    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  // ===== Filtre değişince kart giriş animasyonu =====
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = grid.querySelectorAll('.bl-card');
    if (!cards.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(cards, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: 'power2.out' });
    }, grid);
    return () => ctx.revert();
  }, [activeCat]);

  const handleTilt = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    el.style.setProperty('--mx', `${mx}px`);
    el.style.setProperty('--my', `${my}px`);
  }, []);

  return (
    <article ref={containerRef} className="relative pt-36 pb-28 px-6 max-md:pt-28 max-md:pb-20">
      <div className="max-w-6xl mx-auto">
        {/* ===== HERO ===== */}
        <header className="text-center mb-14 max-md:mb-10">
          <span className="bl-label inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-5">
            BERACORE Blog
          </span>
          <h1 className="bl-title font-heading text-[clamp(2.4rem,6.5vw,4.5rem)] font-semibold tracking-tight leading-[1.02] mb-6">
            <span className="gradient-text">İçgörüler ve Rehberler</span>
          </h1>
          <p className="bl-sub font-body text-[1.15rem] max-md:text-[1rem] text-t2 font-light leading-relaxed max-w-2xl mx-auto">
            Yapay zeka, web, e-ticaret, yazılım ve dijital pazarlama üzerine uygulanabilir bilgiler — işletmenizi bir adım öne taşıyacak içerikler.
          </p>
        </header>

        {/* ===== KATEGORİ FİLTRESİ ===== */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-14 max-md:mb-10">
          <FilterPill label="Tümü" color="#ffa9f9" active={activeCat === 'Tümü'} count={posts.length} onClick={() => setActiveCat('Tümü')} />
          {categories.map((cat) => (
            <FilterPill
              key={cat.name}
              label={cat.name}
              color={cat.color}
              active={activeCat === cat.name}
              count={posts.filter((p) => p.category === cat.name).length}
              onClick={() => setActiveCat(cat.name)}
            />
          ))}
        </div>

        {/* ===== FEATURED (öne çıkan / en yeni) ===== */}
        {showFeatured && featured && (
          <Link
            href={`/blog/${featured.slug}`}
            onMouseMove={handleTilt}
            className="bl-featured group relative block mb-8 p-10 max-md:p-7 rounded-3xl border border-white/[0.07] bg-white/[0.02] overflow-hidden transition-all duration-500 hover:border-white/[0.2] hover:bg-white/[0.04]"
            style={{ '--accent': getCategoryColor(featured.category) } as React.CSSProperties}
          >
            <span className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `radial-gradient(500px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%)` }} aria-hidden="true" />
            <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4 font-body text-[0.72rem] text-t3">
                  <CatBadge category={featured.category} />
                  <span className="text-accent2/70 font-semibold tracking-wider uppercase">Öne Çıkan</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatDate(featured.publishedAt)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featured.readingMinutes} dk</span>
                </div>
                <h2 className="font-body text-[clamp(1.5rem,3.2vw,2.2rem)] font-semibold text-t1 leading-tight mb-4 transition-colors duration-300 group-hover:text-[color:var(--accent)]">
                  {featured.title}
                </h2>
                <p className="font-body text-[0.98rem] text-t3 font-light leading-relaxed max-w-2xl">
                  {featured.excerpt}
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-2 font-body text-[0.78rem] font-semibold tracking-wider uppercase text-accent/60 group-hover:text-[color:var(--accent)] transition-all duration-300 group-hover:gap-3.5">
                Oku
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </span>
            </div>
          </Link>
        )}

        {/* ===== GRID ===== */}
        <div ref={gridRef}>
          {filteredRest.length === 0 && !showFeatured ? (
            <p className="text-center font-body text-t3 py-16">Bu kategoride henüz yazı yok.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" style={{ perspective: '1400px' }}>
              {filteredRest.map((post) => {
                const color = getCategoryColor(post.category);
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    onMouseMove={handleTilt}
                    className="bl-card group relative flex flex-col p-7 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden transition-all duration-400 hover:border-white/[0.18] hover:bg-white/[0.035] hover:-translate-y-1"
                    style={{ '--accent': color } as React.CSSProperties}
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(300px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%)` }} aria-hidden="true" />
                    <span className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(90deg, transparent, var(--accent), transparent)` }} aria-hidden="true" />
                    <div className="relative flex flex-col h-full">
                      <div className="flex items-center gap-2.5 mb-4 font-body text-[0.7rem] text-t3">
                        <CatBadge category={post.category} />
                        <span>{post.readingMinutes} dk</span>
                      </div>
                      <h3 className="font-body text-[1.15rem] font-semibold text-t1 leading-snug mb-3 transition-colors duration-300 group-hover:text-[color:var(--accent)]">
                        {post.title}
                      </h3>
                      <p className="font-body text-[0.86rem] text-t3 font-light leading-relaxed mb-5 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.05]">
                        <span className="font-body text-[0.72rem] text-t3">{formatDate(post.publishedAt)}</span>
                        <span className="inline-flex items-center gap-1.5 font-body text-[0.72rem] font-semibold tracking-wider uppercase text-accent/50 group-hover:text-[color:var(--accent)] transition-all duration-300 group-hover:gap-2.5">
                          Oku
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function FilterPill({ label, color, active, count, onClick }: { label: string; color: string; active: boolean; count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`bl-filter group relative inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-[0.82rem] font-medium transition-all duration-300 border ${
        active ? 'text-bg border-transparent' : 'text-t2 border-white/[0.1] hover:border-white/25 hover:text-t1'
      }`}
      style={active ? { background: color } : undefined}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: active ? 'rgba(0,0,0,0.5)' : color }} aria-hidden="true" />
      {label}
      <span className={`text-[0.7rem] ${active ? 'text-bg/60' : 'text-t3'}`}>{count}</span>
    </button>
  );
}

function CatBadge({ category }: { category: string }) {
  const color = getCategoryColor(category);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold tracking-wide"
      style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} aria-hidden="true" />
      {category}
    </span>
  );
}
