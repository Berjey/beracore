'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollText from '@/components/ScrollText';

gsap.registerPlugin(ScrollTrigger);

const REASONS = [
  { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Uçtan Uca Çözüm', desc: 'Strateji, tasarım, geliştirme ve lansman — tek ekipten eksiksiz dijital dönüşüm.' },
  { icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', title: 'Modern Teknoloji Yığını', desc: 'React, Next.js, Node.js, Blockchain, AI — endüstri lideri teknolojilerle geliştiriyoruz.' },
  { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Sonuç Odaklı Yaklaşım', desc: 'Her projeyi ölçülebilir KPI\'larla takip ediyor, somut sonuçlar üretiyoruz.' },
  { icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', title: 'Şeffaf Süreç', desc: 'Proje yönetim paneli, haftalık raporlama ve anlık iletişim ile her adımı birlikte yürütüyoruz.' },
  { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', title: 'Kurumsal Güvenlik', desc: 'PCI DSS, KVKK uyumlu altyapı. Penetrasyon testleri ve güvenlik denetimleri standart.' },
  { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', title: 'Uzman Ekip', desc: 'Full-stack geliştiriciler, UI/UX tasarımcılar, blockchain mühendisleri ve dijital pazarlama uzmanları.' },
];

export default function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        gsap.fromTo('.why-card', { y: 60, opacity: 0, scale: 0.93 }, {
          y: 0, opacity: 1, scale: 1, stagger: 0.03,
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 25%', scrub: 0.15 },
        });
        gsap.fromTo('.why-icon', { scale: 0, rotation: -20 }, {
          scale: 1, rotation: 0, stagger: 0.03,
          scrollTrigger: { trigger: section, start: 'top 75%', end: 'top 25%', scrub: 0.12 },
        });
      }, section);
    }, 800);
    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  return (
    <section ref={sectionRef} id="why-us" className="py-32 px-8 max-md:px-5 max-md:py-20">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-body text-[clamp(2rem,4vw,3.2rem)] font-light tracking-tight leading-[1.15]">
            <ScrollText before="Neden " accent="BERACORE?" />
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((r, i) => (
            <div key={r.title} className="why-card group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden hover:border-accent/20 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-accent2/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="why-icon w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: i % 2 === 0 ? 'rgba(255,169,249,0.08)' : 'rgba(255,247,173,0.08)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={i % 2 === 0 ? '#ffa9f9' : '#fff7ad'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={r.icon} /></svg>
                </div>
                <h3 className="font-body text-[1.05rem] font-semibold text-t1 mb-3 group-hover:text-accent transition-colors duration-300">{r.title}</h3>
                <p className="font-body text-[0.85rem] text-t2 font-light leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
