'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Section = {
  title: string;
  body: string | string[];
};

type LegalLayoutProps = {
  title: string;
  accent?: string;
  intro: string;
  lastUpdated: string;
  sections: Section[];
};

export default function LegalLayout({
  title,
  accent = 'Yasal',
  intro,
  lastUpdated,
  sections,
}: LegalLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        gsap.fromTo('.lg-hero > *',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08 }
        );

        gsap.fromTo('.lg-section',
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: 'power3.out',
            scrollTrigger: {
              trigger: '.lg-body',
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, container);
    }, 400);
    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  return (
    <main ref={containerRef} className="relative min-h-screen pt-32 pb-20 px-8 max-md:px-5 max-md:pt-24">
      {/* Arkaplan sinematik glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(900px 500px at 50% 15%, rgba(255,169,249,0.06), transparent 60%), radial-gradient(700px 400px at 30% 80%, rgba(255,247,173,0.04), transparent 60%)',
        }}
      />

      <div className="max-w-[820px] mx-auto">
        {/* Hero */}
        <div className="lg-hero mb-14 max-md:mb-10">
          <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
            {accent}
          </span>
          <h1 className="font-heading text-[clamp(2.2rem,5vw,3.6rem)] font-bold tracking-tight leading-[1.1] mb-5">
            {title}
          </h1>
          <p className="font-body text-[0.95rem] text-t2 font-light leading-[1.8] max-md:text-[0.88rem]">
            {intro}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 font-body text-[0.72rem] text-t3 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-accent2/60" aria-hidden="true" />
            Son güncelleme: {lastUpdated}
          </div>
        </div>

        {/* Ayraç */}
        <div
          className="h-px w-full mb-12 max-md:mb-8"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,169,249,0.25), rgba(255,247,173,0.2), transparent)',
          }}
        />

        {/* İçerik */}
        <div className="lg-body space-y-10 max-md:space-y-8">
          {sections.map((section, i) => (
            <section key={i} className="lg-section">
              <h2 className="font-heading text-[1.25rem] font-bold text-t1 mb-3 max-md:text-[1.1rem]">
                <span
                  className="font-body text-[0.7rem] font-semibold tracking-[0.2em] mr-2 align-middle"
                  style={{ color: i % 2 === 0 ? '#ffa9f9' : '#fff7ad' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {section.title}
              </h2>
              {Array.isArray(section.body) ? (
                <ul className="space-y-2 pl-1">
                  {section.body.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 font-body text-[0.9rem] text-t2 font-light leading-[1.75] max-md:text-[0.85rem]"
                    >
                      <span
                        className="shrink-0 mt-[0.55em] w-1 h-1 rounded-full"
                        style={{ background: i % 2 === 0 ? '#ffa9f9' : '#fff7ad' }}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-body text-[0.9rem] text-t2 font-light leading-[1.8] max-md:text-[0.85rem]">
                  {section.body}
                </p>
              )}
            </section>
          ))}
        </div>

        {/* Alt navigasyon */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-4 max-md:mt-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-body text-[0.85rem] text-t2 hover:text-accent transition-colors duration-300"
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/iletisim"
            className="font-body text-[0.85rem] font-semibold gradient-text hover:opacity-80 transition-opacity duration-300"
          >
            Sorunuz mu var? İletişime Geçin →
          </Link>
        </div>
      </div>
    </main>
  );
}
