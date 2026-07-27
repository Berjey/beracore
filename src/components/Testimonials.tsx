'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollText from '@/components/ScrollText';

gsap.registerPlugin(ScrollTrigger);

type Testimonial = {
  brand: string;
  name: string;
  role: string;
  category: string;
  project: string;
  text: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    brand: 'GmsGarage',
    name: 'Ertuğrul Atalay',
    role: 'Kurucu',
    category: 'Web & Yönetim Paneli',
    project: 'Oto Galeri Web Sitesi ve Yönetim Paneli',
    text: 'Galeriye özel geliştirilen yönetim paneli sayesinde araç stoğumuzu, müşteri görüşmelerini ve finans takibini tek ekrandan yönetiyoruz. Modern ve hızlı web sitemiz üzerinden gelen organik trafik ile iletişim formu dönüşümleri ciddi oranda arttı. BERACORE\'un süreç boyunca gösterdiği şeffaflık ve hızlı iletişim fark yarattı.',
  },
  {
    brand: 'Arovela',
    name: 'Enes Çağlar',
    role: 'Kurucu Ortak',
    category: 'E-Ticaret & Pazarlama',
    project: 'E-Ticaret ve Dijital Pazarlama',
    text: 'E-ticaret altyapımızı sıfırdan kurgulayıp dijital pazarlama süreçlerimizi baştan yapılandırdık. Lansmanın ardından ilk üç ayda satışlarımız gözle görülür biçimde büyüdü, sepet terk oranımız belirgin şekilde düştü. Veri odaklı yaklaşımları sayesinde her kampanyanın getirisini net olarak ölçebiliyoruz.',
  },
  {
    brand: 'KriptoMall',
    name: 'Ürün Ekibi',
    role: 'Ürün & Teknoloji',
    category: 'Mobil Uygulama & UI/UX',
    project: 'Mobil Uygulama ve UI/UX Geliştirme',
    text: 'Mobil uygulamamızın ve web platformumuzun UI/UX tasarımını BERACORE üstlendi. Kullanıcı yolculuğunu sıfırdan yeniden kurguladılar; mobil aktif kullanıcı oranımız belirgin şekilde arttı. Disiplinli tasarım sistemleri sayesinde yeni özellikleri çok daha hızlı ve tutarlı şekilde yayınlıyoruz.',
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Header
        gsap.fromTo('.t-header',
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );

        // Arkaplan glow
        gsap.fromTo('.t-glow',
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1, scale: 1,
            scrollTrigger: { trigger: section, start: 'top 85%', end: 'center center', scrub: 0.4 },
          }
        );
        gsap.to('.t-glow', {
          opacity: 0, scale: 1.1,
          scrollTrigger: { trigger: section, start: 'bottom 60%', end: 'bottom top', scrub: 0.4 },
        });

        // Kartlar — scrub ile (iki yönlü çalışır)
        section.querySelectorAll<HTMLElement>('.t-card').forEach((el, idx) => {
          gsap.fromTo(el,
            { opacity: 0, y: 60, rotationX: -12, scale: 0.94 },
            {
              opacity: 1, y: 0, rotationX: 0, scale: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: `top ${85 - idx * 2}%`,
                end: `top ${55 - idx * 2}%`,
                scrub: 0.5,
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
      id="referanslar"
      className="relative py-32 px-8 overflow-hidden max-md:px-5 max-md:py-20"
    >
      {/* Arkaplan sinematik glow */}
      <div
        className="t-glow pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(900px 500px at 30% 40%, rgba(255,169,249,0.05), transparent 60%), radial-gradient(700px 400px at 80% 70%, rgba(255,247,173,0.04), transparent 60%)',
        }}
      />

      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="t-header text-center mb-16 max-md:mb-12">
          <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
            Referanslar
          </span>
          <h2 className="font-body text-[clamp(2rem,4vw,3.2rem)] font-light tracking-tight leading-[1.15] mb-5">
            <ScrollText before="Müşterilerimiz " accent="ne diyor?" />
          </h2>
          <p className="font-body text-sm text-t2 font-light max-w-xl mx-auto leading-relaxed max-md:text-[0.82rem]">
            Birlikte çalıştığımız ekiplerin kendi sözlerinden — teknolojinin arkasındaki gerçek hikâyeler.
          </p>
        </div>

        {/* Kartlar grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ perspective: '1400px' }}
        >
          {TESTIMONIALS.map((t, i) => {
            const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
            const initials = t.name === 'Ürün Ekibi'
              ? t.brand.charAt(0)
              : t.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
            return (
              <article
                key={t.brand}
                className="t-card group relative flex flex-col p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden cursor-default transition-all duration-400 ease-out hover:border-white/[0.18] hover:bg-white/[0.035] hover:-translate-y-0.5 max-md:p-6"
                style={{ '--accent': accent } as React.CSSProperties}
              >
                {/* Accent border glow — hover'da 4 kenar canlanır */}
                <span
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: `0 0 0 1px ${accent} inset, 0 0 24px ${accent}44, 0 0 50px ${accent}1a`,
                  }}
                  aria-hidden="true"
                />

                {/* 4 köşe bracket'ı */}
                {([
                  ['top-2.5 left-2.5', '-translate-x-0.5 -translate-y-0.5', 'borderTop borderLeft', 'borderTopLeftRadius'],
                  ['top-2.5 right-2.5', 'translate-x-0.5 -translate-y-0.5', 'borderTop borderRight', 'borderTopRightRadius'],
                  ['bottom-2.5 left-2.5', '-translate-x-0.5 translate-y-0.5', 'borderBottom borderLeft', 'borderBottomLeftRadius'],
                  ['bottom-2.5 right-2.5', 'translate-x-0.5 translate-y-0.5', 'borderBottom borderRight', 'borderBottomRightRadius'],
                ] as const).map(([pos, initialTransform, borders, radius], idx) => (
                  <span
                    key={idx}
                    className={`pointer-events-none absolute w-4 h-4 opacity-0 group-hover:opacity-100 ${initialTransform} group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out ${pos}`}
                    style={{
                      ...(borders.includes('borderTop') && { borderTop: `1.5px solid ${accent}` }),
                      ...(borders.includes('borderBottom') && { borderBottom: `1.5px solid ${accent}` }),
                      ...(borders.includes('borderLeft') && { borderLeft: `1.5px solid ${accent}` }),
                      ...(borders.includes('borderRight') && { borderRight: `1.5px solid ${accent}` }),
                      [radius]: '8px',
                      filter: `drop-shadow(0 0 6px ${accent}88)`,
                    }}
                    aria-hidden="true"
                  />
                ))}

                {/* Kategori etiketi */}
                <div className="relative flex items-center justify-between mb-6">
                  <span
                    className="font-body text-[0.62rem] font-semibold tracking-[0.22em] uppercase px-2.5 py-1 rounded-full"
                    style={{
                      color: accent,
                      background: `${accent}12`,
                      border: `1px solid ${accent}28`,
                    }}
                  >
                    {t.category}
                  </span>
                  {/* Büyük tırnak işareti */}
                  <span
                    className="font-heading text-[3rem] leading-none select-none opacity-30 group-hover:opacity-70 transition-opacity duration-500"
                    style={{ color: accent, transform: 'translateY(-0.2em)' }}
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                </div>

                {/* Testimonial metni */}
                <p className="relative font-body text-[0.92rem] text-t1 font-light leading-[1.75] mb-6 flex-1 max-md:text-[0.86rem]">
                  {t.text}
                </p>

                {/* Ayraç */}
                <div
                  className="relative h-px w-full mb-5"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${accent}33, transparent)`,
                  }}
                />

                {/* Author */}
                <div className="relative flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-[0.8rem] font-bold font-heading shrink-0 transition-transform duration-500 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${accent}22, ${accent}08)`,
                      boxShadow: `0 0 0 1px ${accent}40 inset`,
                      color: accent,
                    }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-body text-[0.88rem] font-semibold text-t1 leading-tight">
                      {t.name}
                    </div>
                    <div className="font-body text-[0.72rem] text-t2 leading-tight mt-0.5">
                      <span
                        className="font-semibold transition-colors duration-400"
                        style={{ color: `${accent}dd` }}
                      >
                        {t.brand}
                      </span>
                      <span className="mx-1.5 text-t3">•</span>
                      <span>{t.role}</span>
                    </div>
                  </div>
                </div>

                {/* Proje altbilgi */}
                <div
                  className="relative mt-4 pt-3 font-body text-[0.68rem] font-light tracking-wide text-t3 border-t border-white/[0.04] group-hover:text-t2 transition-colors duration-500"
                >
                  <span className="opacity-60">Proje:</span> {t.project}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
