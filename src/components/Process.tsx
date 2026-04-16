'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: '01', title: 'Keşif', desc: 'Markanızı, hedeflerinizi ve rakiplerinizi derinlemesine analiz ediyoruz.' },
  { num: '02', title: 'Strateji', desc: 'Veri odaklı yol haritası çıkarıyor, doğru teknolojiyi belirliyoruz.' },
  { num: '03', title: 'Tasarım', desc: 'Kullanıcı deneyimini merkeze alan, estetik arayüzler kurgulanıyor.' },
  { num: '04', title: 'Geliştirme', desc: 'Temiz kod, modern altyapı — ölçeklenebilir ve performanslı.' },
  { num: '05', title: 'Lansman', desc: 'Test, optimizasyon ve canlıya alma — her detay kontrol altında.' },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title
      gsap.fromTo(section.querySelector('.proc-title'), { y: 40, opacity: 0 }, {
        y: 0, opacity: 1,
        scrollTrigger: { trigger: section, start: 'top 75%', end: 'top 50%', scrub: 0.5 },
      });

      // Timeline line grows
      gsap.fromTo(section.querySelector('.proc-line'), { scaleY: 0 }, {
        scaleY: 1,
        scrollTrigger: { trigger: section, start: 'top 60%', end: 'bottom 60%', scrub: 0.3 },
      });

      // Steps stagger
      section.querySelectorAll('.proc-step').forEach((step, i) => {
        gsap.fromTo(step,
          { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
          {
            x: 0, opacity: 1,
            scrollTrigger: {
              trigger: step,
              start: 'top 80%',
              end: 'top 55%',
              scrub: 0.5,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="process" className="py-32 px-8 max-w-[900px] mx-auto max-md:px-5 max-md:py-20">
      <div className="proc-title text-center mb-20">
        <span className="block font-body text-[0.7rem] font-semibold tracking-[0.35em] uppercase text-accent2/60 mb-4">
          Süreç
        </span>
        <h2 className="font-body text-[clamp(2rem,4vw,3.2rem)] font-light tracking-tight leading-[1.15]">
          Nasıl <span className="gradient-text font-semibold">çalışıyoruz?</span>
        </h2>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div
          className="proc-line absolute left-8 top-0 bottom-0 w-px origin-top max-md:left-4"
          style={{ background: 'linear-gradient(180deg, var(--color-accent), var(--color-accent2), transparent)' }}
        />

        <div className="space-y-16 max-md:space-y-10">
          {steps.map((step) => (
            <div key={step.num} className="proc-step flex gap-8 items-start pl-20 relative max-md:pl-12 max-md:gap-5">
              {/* Dot on timeline */}
              <div className="absolute left-[26px] top-1 w-3 h-3 rounded-full bg-accent/30 border-2 border-accent shadow-[0_0_12px_rgba(255,169,249,0.3)] max-md:left-[10px]" />

              <div>
                <span className="font-heading text-[0.65rem] font-bold tracking-[0.2em] uppercase text-accent2/50 mb-1 block">
                  {step.num}
                </span>
                <h3 className="font-heading text-xl font-bold mb-2 max-md:text-lg">{step.title}</h3>
                <p className="text-sm leading-relaxed text-t2 max-w-md">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
