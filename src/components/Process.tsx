'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollText from '@/components/ScrollText';

gsap.registerPlugin(ScrollTrigger);

type Step = {
  num: string;
  title: string;
  desc: string;
  deliverables: string[];
  iconPath: string;
};

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Keşif',
    desc: 'Markanızın DNA\'sını, pazar konumunu ve rekabet ortamını derinlemesine analiz ediyoruz. Paydaş atölyeleri, kullanıcı görüşmeleri ve veri araştırmaları ile projenin sağlam bir temel üzerine kurulmasını sağlıyoruz.',
    deliverables: ['Paydaş atölyesi', 'Rakip ve pazar analizi', 'Kullanıcı persona\'ları', 'Proje brief\'i'],
    iconPath: 'M21 21l-4.35-4.35M11 17.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z',
  },
  {
    num: '02',
    title: 'Strateji',
    desc: 'Keşif bulgularını ölçülebilir bir yol haritasına dönüştürüyoruz. Kapsam, teknoloji seçimi, başarı kriterleri ve iletişim planı bu aşamada netleşir; riskler önceden öngörülür ve yönetilir.',
    deliverables: ['Dijital yol haritası', 'Teknoloji mimarisi', 'KPI ve ölçüm çerçevesi', 'Risk ve zaman planı'],
    iconPath: 'M12 2L4 7v6c0 4.5 3.5 8.5 8 10 4.5-1.5 8-5.5 8-10V7l-8-5z M9 12l2 2 4-4',
  },
  {
    num: '03',
    title: 'Tasarım',
    desc: 'Kullanıcı yolculuğu, bilgi mimarisi ve arayüz tasarımını bütünsel olarak ele alıyoruz. Prototiplerle etkileşimleri kullanıcıyla doğrular, en verimli ve erişilebilir deneyimi kurgularız.',
    deliverables: ['UX akış diyagramları', 'High-fidelity UI sistemi', 'İnteraktif prototip', 'Erişilebilirlik denetimi'],
    iconPath: 'M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z M11 11a2 2 0 11-4 0 2 2 0 014 0z',
  },
  {
    num: '04',
    title: 'Geliştirme',
    desc: 'Modüler ve ölçeklenebilir bir kod tabanı üzerine kurarak ürünü hayata geçiriyoruz. Otomatik test, kod incelemesi ve sürekli entegrasyon süreçleri standart operasyonumuzdur; her build üretime hazır niteliktedir.',
    deliverables: ['Üretim mimarisi ve altyapı', 'Frontend / backend entegrasyonu', 'Otomatik test ve CI/CD', 'Performans optimizasyonu'],
    iconPath: 'M16 18l6-6-6-6 M8 6l-6 6 6 6 M14 4l-4 16',
  },
  {
    num: '05',
    title: 'Lansman',
    desc: 'Canlıya geçişi kontrollü bir sahne gibi yönetiyoruz. Beta testleri, güvenlik denetimleri ve gerçek kullanıcı izleme ile sürecin her katmanını doğruluyor; yayın sonrası sürekli iyileştirme programına geçiyoruz.',
    deliverables: ['Kullanıcı kabul testi (UAT)', 'Güvenlik ve penetrasyon denetimi', 'Canlı izleme ve raporlama', 'Bakım ve destek planı'],
    iconPath: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3-.09-3.08a2.18 2.18 0 00-2.92.08zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0',
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Dikey çizgi — scroll'a bağlı çizilir (daha erken başlar)
        gsap.fromTo('.p-line',
          { scaleY: 0 },
          {
            scaleY: 1, ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 95%',
              end: 'bottom 60%',
              scrub: 0.3,
            },
          }
        );

        // Kartlar — scrub ile scroll'a bağlı (aşağı girer, yukarı çıkar)
        const isDesktop = window.matchMedia('(min-width: 768px)').matches;
        section.querySelectorAll<HTMLElement>('.p-step').forEach((el, idx) => {
          const isLeft = idx % 2 === 0;
          gsap.fromTo(el,
            {
              opacity: 0,
              x: isDesktop ? (isLeft ? -80 : 80) : -40,
              y: 40,
            },
            {
              opacity: 1, x: 0, y: 0,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                end: 'top 60%',
                scrub: 0.5,
              },
            }
          );
        });

        // Dot'lar
        section.querySelectorAll<HTMLElement>('.p-dot').forEach((el) => {
          gsap.fromTo(el,
            { scale: 0 },
            {
              scale: 1, ease: 'back.out(2)',
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                end: 'top 60%',
                scrub: 0.3,
              },
            }
          );
        });

        // Çıktılar stagger
        section.querySelectorAll<HTMLElement>('.p-step').forEach((el) => {
          const items = el.querySelectorAll<HTMLElement>('.p-deliverable');
          if (!items.length) return;
          gsap.fromTo(items,
            { opacity: 0, x: -14 },
            {
              opacity: 1, x: 0, stagger: 0.05, ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 75%',
                end: 'top 50%',
                scrub: 0.4,
              },
            }
          );
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, section);
    }, 400);

    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative py-32 px-8 max-md:px-5 max-md:py-24 overflow-hidden"
    >
      {/* Header */}
      <div className="text-center mb-20 max-md:mb-14">
        <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
          Metodoloji
        </span>
        <h2 className="font-body text-[clamp(2rem,4vw,3.2rem)] font-light tracking-tight leading-[1.15] mb-5">
          <ScrollText before="Nasıl " accent="çalışıyoruz?" />
        </h2>
        <p className="font-body text-sm text-t2 font-light max-w-xl mx-auto leading-relaxed max-md:text-[0.82rem]">
          Stratejiden lansmana kadar birbirine kenetlenmiş, her projede uyguladığımız beş aşamalı disiplinli bir süreç.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative max-w-[1100px] mx-auto">
        {/* Merkez çizgi (desktop) / sol çizgi (mobile) */}
        <div
          className="p-line absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-px origin-top max-md:left-5 max-md:translate-x-0"
          style={{
            background:
              'linear-gradient(180deg, var(--color-accent), var(--color-accent2) 85%, transparent)',
          }}
        />

        {/* Adımlar */}
        <ol className="list-none space-y-20 max-md:space-y-12">
          {STEPS.map((step, i) => {
            const isLeft = i % 2 === 0;
            const accent = isLeft ? '#ffa9f9' : '#fff7ad';
            return (
              <li key={step.num} className="p-step relative">
                {/* Hat üzerinde nokta */}
                <span
                  className="p-dot absolute left-1/2 -translate-x-1/2 -ml-[1px] top-8 w-3.5 h-3.5 rounded-full z-10 max-md:left-5 max-md:ml-0"
                  style={{
                    background: accent,
                    boxShadow: `0 0 0 4px #1a1a1a, 0 0 14px ${accent}bb, 0 0 32px ${accent}55`,
                  }}
                  aria-hidden="true"
                />

                {/* Kart konteyner — desktop'ta zigzag, mobilde tek kolon */}
                <div
                  className={`
                    md:w-[calc(50%-2.5rem)]
                    ${isLeft ? 'md:mr-auto md:pr-0' : 'md:ml-auto md:pl-0'}
                    max-md:w-full max-md:pl-14
                  `}
                >
                  <article
                    className="group relative p-7 rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all duration-400 ease-out hover:border-white/[0.18] hover:bg-white/[0.04] hover:-translate-y-0.5 max-md:p-5"
                    style={{ '--accent': accent } as React.CSSProperties}
                  >
                    {/* Accent border — hover'da 4 kenar accent rengine bürünür */}
                    <span
                      className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        boxShadow: `0 0 0 1px ${accent} inset, 0 0 24px ${accent}55, 0 0 50px ${accent}22`,
                      }}
                      aria-hidden="true"
                    />

                    {/* 4 köşe bracket'ı */}
                    <span
                      className="pointer-events-none absolute top-2.5 left-2.5 w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-0.5 -translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out"
                      style={{
                        borderTop: `1.5px solid ${accent}`,
                        borderLeft: `1.5px solid ${accent}`,
                        borderTopLeftRadius: '6px',
                        filter: `drop-shadow(0 0 6px ${accent}88)`,
                      }}
                      aria-hidden="true"
                    />
                    <span
                      className="pointer-events-none absolute top-2.5 right-2.5 w-4 h-4 opacity-0 group-hover:opacity-100 translate-x-0.5 -translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out"
                      style={{
                        borderTop: `1.5px solid ${accent}`,
                        borderRight: `1.5px solid ${accent}`,
                        borderTopRightRadius: '6px',
                        filter: `drop-shadow(0 0 6px ${accent}88)`,
                      }}
                      aria-hidden="true"
                    />
                    <span
                      className="pointer-events-none absolute bottom-2.5 left-2.5 w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out"
                      style={{
                        borderBottom: `1.5px solid ${accent}`,
                        borderLeft: `1.5px solid ${accent}`,
                        borderBottomLeftRadius: '6px',
                        filter: `drop-shadow(0 0 6px ${accent}88)`,
                      }}
                      aria-hidden="true"
                    />
                    <span
                      className="pointer-events-none absolute bottom-2.5 right-2.5 w-4 h-4 opacity-0 group-hover:opacity-100 translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out"
                      style={{
                        borderBottom: `1.5px solid ${accent}`,
                        borderRight: `1.5px solid ${accent}`,
                        borderBottomRightRadius: '6px',
                        filter: `drop-shadow(0 0 6px ${accent}88)`,
                      }}
                      aria-hidden="true"
                    />

                    {/* Header: Büyük numara + ikon + başlık */}
                    <header className="flex items-start gap-5 mb-4 max-md:gap-4">
                      {/* Büyük accent numara */}
                      <div
                        className="font-heading font-bold leading-none shrink-0 text-[3rem] max-md:text-[2.4rem]"
                        style={{
                          background: `linear-gradient(135deg, ${accent}, ${accent}70)`,
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                          letterSpacing: '-0.03em',
                        }}
                      >
                        {step.num}
                      </div>

                      {/* İkon + başlık */}
                      <div className="min-w-0 flex-1 pt-1.5 max-md:pt-0.5">
                        <div className="flex items-center gap-3 mb-1.5">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 max-md:w-8 max-md:h-8"
                            style={{
                              background: `${accent}14`,
                              boxShadow: `0 0 0 1px ${accent}33 inset`,
                            }}
                          >
                            <svg
                              width="17" height="17" viewBox="0 0 24 24"
                              fill="none" stroke={accent}
                              strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
                            >
                              <path d={step.iconPath} />
                            </svg>
                          </div>
                          <h3
                            className="font-heading text-xl font-bold text-t1 transition-colors duration-400 group-hover:text-[color:var(--accent)] max-md:text-lg"
                          >
                            {step.title}
                          </h3>
                        </div>
                      </div>
                    </header>

                    {/* Açıklama */}
                    <p className="font-body text-[0.88rem] text-t2 font-light leading-relaxed mb-5 max-md:text-[0.82rem]">
                      {step.desc}
                    </p>

                    {/* Ayraç */}
                    <div
                      className="h-px w-full mb-4"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${accent}33, transparent)`,
                      }}
                    />

                    {/* Çıktılar */}
                    <div>
                      <div className="font-body text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-t3 mb-3">
                        Çıktılar
                      </div>
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 max-md:grid-cols-1">
                        {step.deliverables.map((d) => (
                          <li
                            key={d}
                            className="p-deliverable flex items-start gap-2.5 font-body text-[0.82rem] text-t2 font-light"
                          >
                            <svg
                              width="14" height="14" viewBox="0 0 24 24"
                              fill="none" stroke={accent} strokeWidth="2.2"
                              strokeLinecap="round" strokeLinejoin="round"
                              className="shrink-0 mt-0.5"
                              aria-hidden="true"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
