'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollText from '@/components/ScrollText';
import { useMetrikler } from '@/components/MetrikProvider';
import { metrikMetni } from '@/lib/metrikler';

gsap.registerPlugin(ScrollTrigger);

// Tailwind sınıfları derleme anında TARANIR — `grid-cols-${n}` şeklinde kurulan
// bir sınıf üretilen CSS'te yer almaz. Bu yüzden tam metin olarak yazılırlar.
const SUTUN: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  // Metrikler artık kodda SABİT DEĞİL, veritabanından gelir ve yalnızca
  // `durum = 'yayinda'` olanlar döner (bulgu A-07). Kanıtı olmayan bir sayı
  // buraya hiç ulaşmaz; ekleyip çıkarmak için kod değişikliği gerekmez.
  const STATS = useMetrikler('anaSayfa');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // SSR'da GERÇEK değerler basılır (Googlebot ve JS'siz kullanıcı "0 proje" görmez).
    // Sayaç animasyonu için sıfırlama JS ile, mount anında yapılır; bölüm ilk ekranın
    // altında olduğu için kullanıcı bu sıfırlamayı görmez.
    const nums = Array.from(section.querySelectorAll<HTMLElement>('.stat-num'));
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nums.forEach((el) => {
        el.textContent = `${el.dataset.prefix ?? ''}0${el.dataset.suffix ?? ''}`;
      });
    }

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
              // Tüm sayılar aynı sürede biter — birlikte hizalı animasyon
              gsap.to(obj, {
                n: target,
                duration: 2.2,
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

  // Yayında metrik yoksa bölüm HİÇ render edilmez — "Rakamlarla" başlığının
  // altında boş bir ızgara bırakmak, sayıyı uydurmaktan sonraki en kötü seçenek.
  // Kanıt panele girilip durum 'yayinda' yapıldığında bölüm kendiliğinden döner.
  if (STATS.length === 0) return null;

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
        {/* Sütun sayısı metrik sayısından türetilir: sabit `grid-cols-4` iken
            yayındaki metrik 4'ten azsa ızgarada boş hücre kalıyordu. */}
        <div
          className={`grid gap-0 max-lg:grid-cols-2 max-md:grid-cols-1 ${
            SUTUN[Math.min(STATS.length, 4)] ?? 'grid-cols-4'
          }`}
        >
          {STATS.map((s, i) => {
            const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
            return (
              <div
                key={s.anahtar}
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
                    <path d={s.ikon} />
                  </svg>
                </div>

                {/* Numara */}
                <div
                  className="stat-num font-heading font-bold leading-none tracking-tight mb-3 gradient-text"
                  style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.6rem)' }}
                  data-target={s.deger}
                  data-prefix={s.onEk}
                  data-suffix={s.sonEk}
                >
                  {metrikMetni(s)}
                </div>

                {/* Label */}
                <div className="font-body text-[0.8rem] font-semibold text-t1 tracking-[0.05em] mb-1">
                  {s.baslik}
                </div>
                <div
                  className="font-body text-[0.68rem] font-light tracking-[0.12em] uppercase transition-colors duration-500"
                  style={{ color: `${accent}99` }}
                >
                  {s.altBaslik}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
