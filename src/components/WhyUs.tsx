'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollText from '@/components/ScrollText';

gsap.registerPlugin(ScrollTrigger);

const REASONS = [
  {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    title: 'Uçtan Uca Çözüm',
    desc: 'Stratejiden lansmana kadar dijital dönüşümün her aşamasını tek bir disiplinli ekiple yönetiyoruz.',
  },
  {
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    title: 'Modern Teknoloji Yığını',
    desc: 'Next.js, Node.js, Blockchain ve yapay zekâ başta olmak üzere endüstri standardı teknolojilerle ölçeklenebilir ürünler geliştiriyoruz.',
  },
  {
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Sonuç Odaklı Yaklaşım',
    desc: 'Her projeyi iş hedeflerinize bağlı ölçülebilir KPI\'lar üzerinden yönetir, somut performans çıktıları üretiriz.',
  },
  {
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    title: 'Şeffaf Süreç',
    desc: 'Canlı proje panosu, haftalık ilerleme raporları ve doğrudan iletişim kanalları ile sürecin her adımı takibinizdedir.',
  },
  {
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    title: 'Kurumsal Güvenlik',
    desc: 'KVKK ve PCI DSS uyumlu altyapı; düzenli penetrasyon testleri ve güvenlik denetimleri operasyonel standardımızdır.',
  },
  {
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    title: 'Uzman Ekip',
    desc: 'Full-stack mühendisler, UI/UX tasarımcıları, blockchain geliştiriciler ve büyüme stratejistlerinden oluşan disiplinlerarası bir kadro.',
  },
];

export default function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // İlk yüklemede flash olmasın diye initial state'i hemen uygula
    gsap.set('.why-card-slot', {
      opacity: 0, y: 120, scale: 0.88, rotationX: -18, z: -200,
      filter: 'blur(6px)', transformOrigin: 'center bottom',
    });
    if (headerRef.current) gsap.set(headerRef.current, { y: 40, scale: 0.96 });
    if (glowRef.current) gsap.set(glowRef.current, { opacity: 0, scale: 0.85 });

    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // 1) Sinematik giriş — kartlar derinlikten (z ekseni) ve aşağıdan geliyor
        gsap.to('.why-card-slot', {
          y: 0, opacity: 1, scale: 1, rotationX: 0, z: 0, filter: 'blur(0px)',
          stagger: { each: 0.06, from: 'start' },
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 0.6,
          },
        });

        // 2) Başlık parallax + scale
        if (headerRef.current) {
          gsap.to(headerRef.current, {
            y: -30, scale: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top 95%',
              end: 'top 20%',
              scrub: 0.4,
            },
          });
        }

        // 3) Arkaplan glow — giriş
        if (glowRef.current) {
          gsap.to(glowRef.current, {
            opacity: 1, scale: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top 90%',
              end: 'center center',
              scrub: 0.4,
            },
          });
          // 4) Arkaplan glow — çıkış
          gsap.to(glowRef.current, {
            opacity: 0, scale: 1.15,
            scrollTrigger: {
              trigger: section,
              start: 'bottom 60%',
              end: 'bottom top',
              scrub: 0.4,
            },
          });
        }

        // 5) Grid'e hafif parallax
        if (gridRef.current) {
          gsap.fromTo(
            gridRef.current,
            { y: 30 },
            {
              y: -30,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            }
          );
        }

        // Layout tamamlandıktan sonra pozisyonları yeniden hesapla
        ScrollTrigger.refresh();
      }, section);
    }, 400);
    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      scale: 1.025,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -14;
    const ry = ((x / rect.width) - 0.5) * 18;
    gsap.to(card, {
      rotationX: rx,
      rotationY: ry,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  };

  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="relative py-32 px-8 max-md:px-5 max-md:py-20"
    >
      {/* Arkaplan sinematik glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(900px 600px at 50% 45%, rgba(255,169,249,0.08), transparent 60%), radial-gradient(700px 500px at 80% 70%, rgba(255,247,173,0.05), transparent 65%)',
        }}
      />

      <div className="max-w-[1100px] mx-auto">
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="font-body text-[clamp(2rem,4vw,3.2rem)] font-light tracking-tight leading-[1.15]">
            <ScrollText before="Neden " accent="BERACORE?" />
          </h2>
        </div>
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ perspective: '1400px' }}
        >
          {REASONS.map((r, i) => {
            const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
            return (
              // DIŞ WRAPPER — GSAP burayı anime ediyor (y, opacity, scale, rotX, z, filter)
              <div
                key={r.title}
                className="why-card-slot will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* İÇ WRAPPER — hover 3D tilt, GSAP'a dokunmuyor */}
                <div
                  onMouseEnter={handleEnter}
                  onMouseMove={handleMove}
                  onMouseLeave={handleLeave}
                  className="why-card group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden cursor-pointer hover:border-white/[0.18] hover:bg-white/[0.03] h-full"
                  style={{
                    transformStyle: 'preserve-3d',
                    transition: 'border-color 0.4s, box-shadow 0.4s',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    '--glow': accent,
                  } as React.CSSProperties}
                >
                  {/* cursor-follow spotlight */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${accent}55, transparent 55%)`,
                    }}
                  />
                  {/* edge glow */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      boxShadow: `0 0 0 1px ${accent}66 inset, 0 30px 80px -20px ${accent}55, 0 0 0 1px ${accent}33`,
                    }}
                  />
                  {/* conic sheen border */}
                  <div
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `conic-gradient(from 180deg at var(--mx, 50%) var(--my, 50%), ${accent}00, ${accent}99, ${accent}00 45%)`,
                      WebkitMask:
                        'linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      padding: '1.5px',
                    }}
                  />
                  {/* İÇERİK KATMANI — derinlik için translateZ */}
                  <div className="relative" style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>
                    {/* İkon çerçevesi — statik translateZ(20px) */}
                    <div
                      className="mb-5"
                      style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
                    >
                      {/* İkon içi — hover scale için ayrı katman */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                          background: `${accent}14`,
                          boxShadow: `0 0 0 1px ${accent}22`,
                        }}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={accent}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d={r.icon} />
                        </svg>
                      </div>
                    </div>
                    <h3
                      className="font-body text-[1.05rem] font-semibold text-t1 mb-3 transition-colors duration-300 group-hover:text-[color:var(--glow)]"
                      style={{ transform: 'translateZ(18px)' }}
                    >
                      {r.title}
                    </h3>
                    <p
                      className="font-body text-[0.85rem] text-t2 font-light leading-relaxed group-hover:text-t1/90 transition-colors duration-300"
                      style={{ transform: 'translateZ(10px)' }}
                    >
                      {r.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
