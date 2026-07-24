'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { BlogPost, ContentBlock } from '@/lib/blog-data';
import { getCategoryColor } from '@/lib/blog-data';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${parseInt(d, 10)} ${MONTHS[parseInt(m, 10) - 1]} ${y}`;
}

function renderBlock(block: ContentBlock, i: number, accent: string) {
  switch (block.type) {
    case 'h2':
      return <h2 key={i} className="bl-reveal font-body text-[clamp(1.4rem,3vw,1.95rem)] font-semibold text-t1 tracking-tight mt-14 mb-4">{block.text}</h2>;
    case 'h3':
      return <h3 key={i} className="bl-reveal font-body text-[1.2rem] font-semibold text-t1 mt-9 mb-3">{block.text}</h3>;
    case 'p':
      return <p key={i} className="bl-reveal font-body text-[1.05rem] text-t2 font-light leading-[1.85] mb-6">{block.text}</p>;
    case 'ul':
      return (
        <ul key={i} className="bl-reveal mb-7 space-y-3">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 font-body text-[1.02rem] text-t2 font-light leading-relaxed">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <blockquote key={i} className="bl-reveal my-10 pl-6 py-1 border-l-2 font-body text-[1.15rem] text-t1 font-light italic leading-relaxed" style={{ borderColor: accent }}>
          {block.text}
        </blockquote>
      );
    default:
      return null;
  }
}

export default function BlogArticle({ post, relatedPosts }: Props) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const accent = getCategoryColor(post.category);

  // Okuma ilerleme çubuğu
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const onScroll = () => {
      const rect = body.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const pct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Giriş + içerik reveal animasyonları
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.15 });
        tl.fromTo('.bl-crumb', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
          .fromTo('.bl-meta', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.25')
          .fromTo('.bl-h1', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.25');

        gsap.utils.toArray<HTMLElement>('.bl-reveal').forEach((el) => {
          gsap.fromTo(el, { y: 24, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          });
        });
      }, container);
    }, 60);
    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  return (
    <div ref={containerRef}>
      {/* Okuma ilerleme çubuğu */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-transparent">
        <div className="h-full transition-[width] duration-100 ease-out" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${accent}, #fff7ad)` }} />
      </div>

      <article className="relative pt-36 pb-24 px-6 max-md:pt-28 max-md:pb-16">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="bl-crumb mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-body text-[0.78rem] text-t3">
              <li><Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
            </ol>
          </nav>

          <header className="mb-12">
            <div className="bl-meta flex flex-wrap items-center gap-3 mb-6 font-body text-[0.75rem] text-t3">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold tracking-wide"
                style={{ background: `color-mix(in srgb, ${accent} 14%, transparent)`, color: accent }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} aria-hidden="true" />
                {post.category}
              </span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} dk okuma</span>
            </div>
            <h1 className="bl-h1 font-heading text-[clamp(2rem,5vw,3.1rem)] font-semibold tracking-tight leading-[1.08]">
              {post.title}
            </h1>
          </header>

          {/* İçerik */}
          <div ref={bodyRef} className="blog-content">
            {post.content.map((b, i) => renderBlock(b, i, accent))}
          </div>

          {/* İlgili hizmet — huni girişi */}
          {post.relatedService && (
            <div className="bl-reveal mt-16 p-8 rounded-2xl border overflow-hidden relative text-center"
              style={{ borderColor: `color-mix(in srgb, ${accent} 25%, transparent)`, background: `color-mix(in srgb, ${accent} 5%, transparent)` }}>
              <p className="font-body text-[1.02rem] text-t2 font-light mb-5">
                Bu konuda profesyonel destek mi arıyorsunuz?
              </p>
              <Link
                href={post.relatedService.href}
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-body text-[0.85rem] font-semibold tracking-wider uppercase text-bg transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${accent}, #fff7ad)` }}
              >
                {post.relatedService.label}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          )}
        </div>

        {/* İlgili yazılar — iç link ağı */}
        {relatedPosts.length > 0 && (
          <div className="max-w-5xl mx-auto mt-24">
            <h2 className="bl-reveal font-body text-[1.4rem] font-light text-t1 text-center mb-10">
              İlgili yazılar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedPosts.map((rp) => {
                const c = getCategoryColor(rp.category);
                return (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="bl-reveal group relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.015] transition-all duration-400 hover:border-white/[0.18] hover:bg-white/[0.035] hover:-translate-y-1"
                    style={{ '--accent': c } as React.CSSProperties}
                  >
                    <span className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(90deg, transparent, ${c}, transparent)` }} aria-hidden="true" />
                    <div className="flex items-center gap-2 mb-3 font-body text-[0.68rem] text-t3">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} aria-hidden="true" />
                      {rp.category}
                    </div>
                    <h3 className="font-body text-[1rem] font-semibold text-t1 leading-snug mb-2 transition-colors duration-300 group-hover:text-[color:var(--accent)]">
                      {rp.title}
                    </h3>
                    <p className="font-body text-[0.8rem] text-t3 font-light leading-relaxed line-clamp-2">{rp.excerpt}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto mt-14 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 font-body text-[0.82rem] text-t3 hover:text-accent transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Tüm yazılar
          </Link>
        </div>
      </article>
    </div>
  );
}
