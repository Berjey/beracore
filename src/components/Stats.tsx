'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 120, suffix: '+', label: 'Tamamlanan Proje' },
  { value: 50, suffix: '+', label: 'Kurumsal Müşteri' },
  { value: 98, suffix: '%', label: 'Memnuniyet Oranı' },
  { value: 6, suffix: '+', label: 'Yıllık Tecrübe' },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        gsap.fromTo('.stat-item', { y: 40, opacity: 0, scale: 0.88 }, {
          y: 0, opacity: 1, scale: 1, stagger: 0.03,
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 30%', scrub: 0.15 },
        });

        section.querySelectorAll('.stat-item').forEach((el) => {

          // Count up — bu bir kez çalışır (geri saymak mantıksız)
          const numEl = el.querySelector('.stat-num') as HTMLElement;
          if (!numEl) return;
          const target = parseInt(numEl.dataset.target || '0');
          const suffix = numEl.dataset.suffix || '';
          ScrollTrigger.create({
            trigger: el, start: 'top 80%', once: true,
            onEnter: () => {
              const obj = { n: 0 };
              gsap.to(obj, { n: target, duration: 2.2, ease: 'power2.out', onUpdate: () => { numEl.textContent = Math.round(obj.n) + suffix; } });
            },
          });
        });
      }, section);
    }, 800);
    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  return (
    <section ref={sectionRef} id="stats" className="py-24 px-8 border-t border-b border-border max-md:px-5 max-md:py-16"
      style={{ background: 'linear-gradient(180deg, transparent, rgba(255,169,249,0.02), transparent)' }}>
      <div className="grid grid-cols-4 gap-8 max-w-[1100px] mx-auto max-lg:grid-cols-2 max-md:gap-6">
        {stats.map((s) => (
          <div key={s.label} className="stat-item text-center py-4">
            <div className="stat-num font-heading text-[clamp(2.4rem,5vw,4rem)] font-bold leading-none tracking-tight mb-2 gradient-text" data-target={s.value} data-suffix={s.suffix}>0</div>
            <div className="text-[0.72rem] font-medium text-t2 tracking-[0.15em] uppercase">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
