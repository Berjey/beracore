'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CtaBand() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(section.querySelector('.cta-title'), { y: 50, opacity: 0 }, {
        y: 0, opacity: 1,
        scrollTrigger: { trigger: section, start: 'top 75%', end: 'top 50%', scrub: 0.5 },
      });
      gsap.fromTo(section.querySelector('.cta-desc'), { y: 30, opacity: 0 }, {
        y: 0, opacity: 1,
        scrollTrigger: { trigger: section, start: 'top 65%', end: 'top 40%', scrub: 0.5 },
      });
      gsap.fromTo(section.querySelector('.cta-btn'), { y: 20, opacity: 0 }, {
        y: 0, opacity: 1,
        scrollTrigger: { trigger: section, start: 'top 55%', end: 'top 35%', scrub: 0.5 },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="iletisim" className="py-36 px-8 text-center relative overflow-hidden max-md:py-24 max-md:px-5">
      {/* Ambient glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none blur-[50px]"
        style={{ background: 'radial-gradient(circle, rgba(255,169,249,0.06), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="max-w-2xl mx-auto relative z-[2]">
        <h2 className="cta-title font-body text-[clamp(2rem,5vw,3.8rem)] font-light tracking-tight leading-[1.15] mb-6">
          Sıra <span className="gradient-text font-semibold">senin projende.</span>
        </h2>
        <p className="cta-desc text-base text-t2 mb-10 leading-relaxed max-md:text-sm">
          Aklındaki dijital fikri konuşalım — keşif görüşmesi ücretsiz, taahhütsüz.
        </p>
        <a
          href="mailto:info@beracore.com"
          className="cta-btn inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-heading text-sm font-bold tracking-wider uppercase transition-all duration-500
            bg-gradient-to-r from-accent to-accent2 text-bg
            hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,169,249,0.3)] hover:scale-[1.02]"
        >
          Hemen Teklif Al →
        </a>
      </div>
    </section>
  );
}
