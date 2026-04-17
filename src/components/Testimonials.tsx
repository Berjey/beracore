'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollText from '@/components/ScrollText';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  { name: 'Ahmet Yılmaz', role: 'CEO', company: 'TechVenture A.Ş.', text: 'BERACORE ekibi kripto para borsası projemizi baştan sona kusursuz yönetti. Güvenlik denetimlerinden performans optimizasyonuna kadar her detay düşünülmüştü. Lansmandan itibaren sıfır kesinti ile çalışıyoruz.' },
  { name: 'Elif Kaya', role: 'Dijital Pazarlama Müdürü', company: 'ModaStyle', text: 'E-ticaret sitemizin yenilenmesinde BERACORE ile çalıştık. Dönüşüm oranımız %42 arttı, sayfa yükleme süremiz 1.8 saniyeye düştü. SEO çalışmasıyla organik trafiğimiz 3 ayda ikiye katlandı.' },
  { name: 'Murat Demir', role: 'Kurucu', company: 'FinoPay', text: 'Ödeme altyapısı ve mobil uygulamamızı BERACORE geliştirdi. PCI DSS uyumlu, ölçeklenebilir bir sistem kurdular. Ekibin teknik bilgisi ve iletişim kalitesi sektörde gördüğüm en iyi seviyede.' },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        gsap.fromTo('.test-card', { y: 50, opacity: 0, scale: 0.92 }, {
          y: 0, opacity: 1, scale: 1, stagger: 0.03,
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 25%', scrub: 0.15 },
        });
      }, section);
    }, 800);
    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  return (
    <section ref={sectionRef} id="referanslar" className="py-32 px-8 max-md:px-5 max-md:py-20">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-body text-[clamp(2rem,4vw,3.2rem)] font-light tracking-tight leading-[1.15]">
            <ScrollText before="Müşterilerimiz " accent="ne diyor?" />
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="test-card relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full" style={{ background: `linear-gradient(to bottom, ${i % 2 === 0 ? '#ffa9f9' : '#fff7ad'}, transparent)` }} />
              <div className="mb-5 gradient-text text-3xl font-serif leading-none select-none">&ldquo;</div>
              <p className="font-body text-[0.92rem] text-t1 font-light leading-[1.8] mb-6">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[0.75rem] font-bold" style={{ background: i % 2 === 0 ? 'rgba(255,169,249,0.12)' : 'rgba(255,247,173,0.12)', color: i % 2 === 0 ? '#ffa9f9' : '#fff7ad' }}>
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-body text-[0.85rem] font-semibold text-t1">{t.name}</div>
                  <div className="font-body text-[0.72rem] text-t2">{t.role} — {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
