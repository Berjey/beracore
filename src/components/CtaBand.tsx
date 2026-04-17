'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import ScrollText from '@/components/ScrollText';

gsap.registerPlugin(ScrollTrigger);

export default function CtaBand() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        gsap.fromTo('.cta-glow', { scale: 0.3, opacity: 0 }, {
          scale: 1, opacity: 1,
          scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 50%', scrub: 0.15 },
        });
        gsap.fromTo('.cta-desc', { y: 35, opacity: 0 }, {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 45%', scrub: 0.15 },
        });
        gsap.fromTo('.cta-btn', { y: 25, opacity: 0, scale: 0.92 }, {
          y: 0, opacity: 1, scale: 1,
          scrollTrigger: { trigger: section, start: 'top 75%', end: 'top 42%', scrub: 0.15 },
        });
      }, section);
    }, 800);
    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  return (
    <section ref={sectionRef} id="iletisim" className="py-36 px-8 text-center relative overflow-hidden max-md:py-24 max-md:px-5">
      <div className="cta-glow absolute w-[600px] h-[600px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,169,249,0.08), rgba(255,247,173,0.03) 40%, transparent 70%)', filter: 'blur(40px)' }} aria-hidden="true" />
      <div className="max-w-2xl mx-auto relative z-[2]">
        <h2 className="font-body text-[clamp(2rem,5vw,3.8rem)] font-light tracking-tight leading-[1.15] mb-6">
          <ScrollText before="Sıra " accent="senin projende." />
        </h2>
        <p className="cta-desc text-base text-t2 mb-10 leading-relaxed max-md:text-sm">
          Aklındaki dijital fikri konuşalım — keşif görüşmesi ücretsiz, taahhütsüz.
        </p>
        <Link href="/teklif-al"
          className="cta-btn inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-heading text-sm font-bold tracking-wider uppercase transition-all duration-500
            bg-gradient-to-r from-accent to-accent2 text-bg hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,169,249,0.3)] hover:scale-[1.02]">
          Hemen Teklif Al →
        </Link>
      </div>
    </section>
  );
}
