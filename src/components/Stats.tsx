'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollText from '@/components/ScrollText';

gsap.registerPlugin(ScrollTrigger);

type Stat = {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
  iconPath: string;
};

const STATS: Stat[] = [
  {
    value: 25,
    suffix: '+',
    label: 'Tamamlanan Proje',
    sublabel: 'Teslim edilen',
    iconPath: 'M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3',
  },
  {
    value: 15,
    suffix: '+',
    label: 'Kurumsal Müşteri',
    sublabel: 'Aktif iş ortağı',
    iconPath: 'M20 7h-4V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM10 4h4v3h-4V4z',
  },
  {
    value: 97,
    prefix: '%',
    suffix: '',
    label: 'Memnuniyet Oranı',
    sublabel: 'Müşteri geri bildirimi',
    iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  },
  {
    value: 2024,
    suffix: '',
    label: 'Kuruluş Yılı',
    sublabel: 'BERACORE stüdyosu',
    iconPath: 'M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83',
  },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Başlık
        gsap.fromTo('.stats-header',
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );

        // Kartlar — tek seferde fade-up + scale (stagger)
        gsap.fromTo('.stat-card',
          { y: 60, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.9, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' },
          }
        );

        // Dikey ayraçlar — stagger ile yukarıdan aşağı açılıyor
        gsap.fromTo('.stat-divider',
          { scaleY: 0 },
          {
            scaleY: 1, duration: 0.8, stagger: 0.12, ease: 'power2.out', delay: 0.3,
            scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' },
          }
        );

        // Count-up animasyonu (bir kez)
        section.querySelectorAll<HTMLElement>('.stat-card').forEach((el) => {
          const numEl = el.querySelector<HTMLElement>('.stat-num');
          if (!numEl) return;
          const target = parseInt(numEl.dataset.target || '0');
          const prefix = numEl.dataset.prefix || '';
          const suffix = numEl.dataset.suffix || '';
          ScrollTrigger.create({
            trigger: el,
            start: 'top 80%',
            once: true,
            onEnter: () => {
              const obj = { n: 0 };
              // Büyük sayılar (ör. 2024) daha uzun sürede sayılsın; okunabilirlik
              const duration = target > 100 ? 2.8 : 2;
              gsap.to(obj, {
                n: target,
                duration,
                ease: 'power2.out',
                onUpdate: () => {
                  numEl.textContent = prefix + Math.round(obj.n) + suffix;
                },
              });
            },
          });
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, section);
    }, 400);
    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative py-28 px-8 border-t border-b border-border overflow-hidden max-md:px-5 max-md:py-20"
      style={{
        background:
          'linear-gradient(180deg, transparent, rgba(255,169,249,0.025) 50%, transparent)',
      }}
    >
      {/* Arkaplan accent glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(800px 300px at 50% 50%, rgba(255,169,249,0.06), transparent 70%)',
        }}
      />

      {/* Header */}
      <div className="stats-header text-center mb-16 max-md:mb-12">
        <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
          Rakamlarla
        </span>
        <h2 className="font-body text-[clamp(1.8rem,3.5vw,2.6rem)] font-light tracking-tight leading-[1.2] max-md:text-[1.5rem]">
          <ScrollText before="Genç bir ekip, " accent="hızlı ivme." />
        </h2>
      </div>

      {/* Grid */}
      <div className="relative max-w-[1150px] mx-auto">
        <div className="grid grid-cols-4 gap-0 max-lg:grid-cols-2 max-md:grid-cols-1">
          {STATS.map((s, i) => {
            const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
            return (
              <div
                key={s.label}
                className="stat-card group relative px-6 py-8 text-center transition-colors duration-500 max-md:py-6"
                style={{ '--accent': accent } as React.CSSProperties}
              >
                {/* Dikey ayraç (son hariç, desktop'ta) */}
                {i < STATS.length - 1 && (
                  <span
                    className="stat-divider pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-px h-[70%] origin-center max-lg:hidden"
                    style={{
                      background:
                        'linear-gradient(180deg, transparent, rgba(255,169,249,0.18), rgba(255,247,173,0.14), transparent)',
                    }}
                    aria-hidden="true"
                  />
                )}

                {/* Hover accent glow */}
                <span
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(250px circle at 50% 50%, ${accent}18, transparent 70%)`,
                  }}
                  aria-hidden="true"
                />

                {/* İkon */}
                <div
                  className="relative inline-flex w-11 h-11 rounded-xl items-center justify-center mb-5 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6"
                  style={{
                    background: `${accent}14`,
                    boxShadow: `0 0 0 1px ${accent}30 inset, 0 0 24px ${accent}22`,
                  }}
                >
                  <svg
                    width="20" height="20" viewBox="0 0 24 24"
                    fill="none" stroke={accent}
                    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d={s.iconPath} />
                  </svg>
                </div>

                {/* Numara */}
                <div
                  className="stat-num font-heading font-bold leading-none tracking-tight mb-3 gradient-text"
                  style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.6rem)' }}
                  data-target={s.value}
                  data-prefix={s.prefix || ''}
                  data-suffix={s.suffix}
                >
                  {s.prefix || ''}0{s.suffix}
                </div>

                {/* Label */}
                <div className="font-body text-[0.8rem] font-semibold text-t1 tracking-[0.05em] mb-1">
                  {s.label}
                </div>
                <div
                  className="font-body text-[0.68rem] font-light tracking-[0.12em] uppercase transition-colors duration-500"
                  style={{ color: `${accent}99` }}
                >
                  {s.sublabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
