'use client';

import { useEffect, useRef, useCallback } from 'react';

// Satır 1 — Hizmetler
const ROW1 = [
  'Yapay Zeka Çözümleri', 'Blockchain Altyapısı', 'Web Yazılım Geliştirme',
  'Mobil Uygulama', 'UI/UX Tasarım', 'E-Ticaret Platformları',
  'SEO Optimizasyonu', 'Dijital Pazarlama', 'Kripto Para Borsası',
  'Akıllı Kontrat Geliştirme', 'DeFi Protokolleri', 'Fintech Çözümleri',
  'Kurumsal Marka Kimliği', 'RPA Süreç Otomasyonu', 'AI Veri Analizi',
  'Chatbot & Sanal Asistan', 'Token Ekonomisi', 'Ödeme Altyapısı',
];

// Satır 2 — Teknolojiler
const ROW2 = [
  'React', 'Next.js', 'Node.js', 'TypeScript', 'Solidity', 'Rust', 'Python',
  'Flutter', 'Swift', 'Kotlin', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS',
  'Docker', 'Kubernetes', 'GraphQL', 'Three.js', 'Figma', 'Ethereum',
  'Solana', 'Web3.js', 'TailwindCSS', 'NestJS', 'Stripe', 'Firebase',
];

// Satır 3 — Şirket Özellikleri & Değerler
const ROW3 = [
  'Uçtan Uca Çözüm', '7/24 Destek', 'Agile Metodoloji', 'Şeffaf Süreç',
  '%99.9 Uptime', 'PCI DSS Uyumlu', 'KVKK Uyumlu', 'ISO Standartları',
  '120+ Tamamlanan Proje', '50+ Kurumsal Müşteri', 'Microservice Mimari',
  'CI/CD Pipeline', 'Penetrasyon Testi', 'Ölçeklenebilir Altyapı',
  'Tam Kaynak Kod Sahipliği', 'Haftalık Sprint Raporları',
];

// Satır 4 — Sektörler & Uzmanlık
const ROW4 = [
  'Finans & Bankacılık', 'E-Ticaret & Perakende', 'Sağlık Teknolojileri',
  'Eğitim & EdTech', 'Lojistik & Tedarik', 'Gayrimenkul & PropTech',
  'SaaS Platformları', 'Startup MVP', 'Kurumsal ERP', 'CRM Sistemleri',
  'IoT & Edge Computing', 'Siber Güvenlik', 'Cloud Native', 'DevOps',
  'Büyük Veri & Analytics', 'Otonom Sistemler',
];

function useMarqueeDrag(containerRef: React.RefObject<HTMLDivElement | null>) {
  const velocityRef = useRef(0);
  const offsetRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef(0);

  const applyOffset = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const inner = el.querySelector('[data-marquee-inner]') as HTMLElement;
    if (!inner) return;
    inner.style.transform = `translateX(${offsetRef.current}px)`;
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const inner = el.querySelector('[data-marquee-inner]') as HTMLElement;
    if (!inner) return;

    // Momentum decay loop
    const tick = () => {
      if (!draggingRef.current && Math.abs(velocityRef.current) > 0.1) {
        offsetRef.current += velocityRef.current;
        velocityRef.current *= 0.94; // friction
        applyOffset();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // Mouse events
    const onDown = (e: PointerEvent) => {
      draggingRef.current = true;
      lastXRef.current = e.clientX;
      lastTimeRef.current = Date.now();
      velocityRef.current = 0;
      inner.style.animationPlayState = 'paused';
      el.style.cursor = 'grabbing';
    };

    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      const now = Date.now();
      const dt = Math.max(1, now - lastTimeRef.current);
      velocityRef.current = dx / dt * 16; // normalize to ~60fps
      offsetRef.current += dx;
      lastXRef.current = e.clientX;
      lastTimeRef.current = now;
      applyOffset();
    };

    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      el.style.cursor = '';
      // Momentum will decay in tick loop, then CSS anim resumes
      const waitForStop = () => {
        if (Math.abs(velocityRef.current) < 0.1) {
          velocityRef.current = 0;
          // Smoothly reset offset and resume CSS animation
          offsetRef.current = 0;
          inner.style.transform = '';
          inner.style.animationPlayState = '';
        } else {
          requestAnimationFrame(waitForStop);
        }
      };
      requestAnimationFrame(waitForStop);
    };

    // Scroll velocity boost
    const onWheel = (e: WheelEvent) => {
      velocityRef.current += e.deltaY * 0.3;
      inner.style.animationPlayState = 'paused';
      // Resume after momentum dies
      const waitForStop = () => {
        if (Math.abs(velocityRef.current) < 0.1) {
          velocityRef.current = 0;
          offsetRef.current = 0;
          inner.style.transform = '';
          inner.style.animationPlayState = '';
        } else {
          requestAnimationFrame(waitForStop);
        }
      };
      requestAnimationFrame(waitForStop);
    };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('wheel', onWheel);
    };
  }, [containerRef, applyOffset]);
}

function MarqueeRow({ items, duration, reverse = false }: { items: string[]; duration: number; reverse?: boolean }) {
  const rowRef = useRef<HTMLDivElement>(null);
  useMarqueeDrag(rowRef);

  const doubled = [...items, ...items];

  return (
    <div ref={rowRef} className="overflow-hidden select-none" style={{ cursor: 'grab' }}>
      <div
        data-marquee-inner
        className="flex w-max"
        style={{ animation: `marquee ${duration}s linear infinite${reverse ? ' reverse' : ''}` }}
      >
        {doubled.map((text, i) => {
          const colorIdx = i % 3;
          const color = colorIdx === 0 ? '#ffa9f9' : colorIdx === 1 ? '#fff7ad' : '#f2f0ed';
          const glow = colorIdx === 0
            ? '0 0 12px rgba(255,169,249,0.25)'
            : colorIdx === 1
              ? '0 0 12px rgba(255,247,173,0.2)'
              : 'none';

          return (
            <span key={i} className="shrink-0 flex items-center gap-4 mx-3">
              <span className="w-1 h-1 rounded-full shrink-0 opacity-30" style={{ background: color }} />
              <span
                className="font-heading text-[0.85rem] font-semibold tracking-[0.15em] uppercase whitespace-nowrap"
                style={{ color, textShadow: glow }}
              >
                {text}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <section className="py-8 overflow-hidden relative"
      style={{ background: 'linear-gradient(180deg, transparent, rgba(255,169,249,0.02), rgba(255,247,173,0.01), transparent)' }}>
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,169,249,0.15) 50%, transparent 90%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,247,173,0.12) 50%, transparent 90%)' }} />
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10"
        style={{ background: 'linear-gradient(90deg, var(--color-bg), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10"
        style={{ background: 'linear-gradient(270deg, var(--color-bg), transparent)' }} />

      <div className="mb-3">
        <MarqueeRow items={ROW1} duration={90} />
      </div>
      <div className="mb-3">
        <MarqueeRow items={ROW2} duration={80} reverse />
      </div>
      <div className="mb-3">
        <MarqueeRow items={ROW3} duration={85} />
      </div>
      <div>
        <MarqueeRow items={ROW4} duration={75} reverse />
      </div>
    </section>
  );
}
