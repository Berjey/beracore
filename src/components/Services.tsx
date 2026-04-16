'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { services } from '@/lib/services-data';
import { createShapeScene, type ShapeSceneAPI } from '@/lib/service-shapes';

interface ServicesProps {
  onOpenDetail: (key: string) => void;
}

export default function Services({ onOpenDetail }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<ShapeSceneAPI | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [contentVisible, setContentVisible] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const svc = services[activeIndex];

  // Scroll-driven header
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const label = header.querySelector('.svc-label') as HTMLElement;
    const words = header.querySelectorAll('.svc-word') as NodeListOf<HTMLElement>;
    if (label) { label.style.opacity = '0'; label.style.transform = 'translateY(20px)'; }
    words.forEach(w => { w.style.opacity = '0'; w.style.transform = 'translateY(30px)'; });

    const onScroll = () => {
      const rect = header.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, 1 - (rect.top / (vh * 0.75))));
      if (label) {
        const lp = Math.max(0, Math.min(1, p / 0.3));
        label.style.opacity = String(lp);
        label.style.transform = `translateY(${(1 - lp) * 20}px)`;
      }
      words.forEach((w, i) => {
        const wp = Math.max(0, Math.min(1, (p - 0.15 - i * 0.12) / 0.25));
        w.style.opacity = String(wp);
        w.style.transform = `translateY(${(1 - wp) * 30}px)`;
      });
      if (p > 0.5 && !contentVisible) setContentVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [contentVisible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const api = createShapeScene(canvas);
    shapeRef.current = api;
    api.setShape(services[0].shape, services[0].color);
    return () => api.dispose();
  }, []);

  const goTo = useCallback((index: number) => {
    const next = (index + services.length) % services.length;
    setActiveIndex(next);
    shapeRef.current?.setShape(services[next].shape, services[next].color);
  }, []);

  // Click on shape or button → zoom transition → open detail
  const handleOpen = useCallback(() => {
    if (transitioning) return;
    setTransitioning(true);
  }, [transitioning]);

  // After zoom animation completes, open the detail page
  useEffect(() => {
    if (!transitioning) return;
    const timer = setTimeout(() => {
      onOpenDetail(svc.key);
      setTimeout(() => setTransitioning(false), 200);
    }, 1400);
    return () => clearTimeout(timer);
  }, [transitioning, svc.key, onOpenDetail]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="min-h-screen flex flex-col items-center justify-center py-24 px-8 max-md:px-5 max-md:py-16"
    >
      {/* Header */}
      <div ref={headerRef} className="text-center mb-12">
        <span className="svc-label block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
          Hizmetler
        </span>
        <h2 className="font-body text-[clamp(1.8rem,4.5vw,3.2rem)] font-light tracking-tight leading-[1.15]">
          <span className="svc-word inline-block">Çekirdeğimizden&nbsp;</span>
          <span className="svc-word inline-block gradient-text font-semibold">dallanıyoruz.</span>
        </h2>
      </div>

      <div className={`w-full max-w-3xl mx-auto transition-all duration-1000 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="flex items-center justify-center gap-10 mb-6 max-md:gap-4">
          {/* Left arrow */}
          <button
            onClick={() => goTo(activeIndex - 1)}
            className={`group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-400
              bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06]
              hover:border-accent/30 hover:from-accent/[0.06] hover:scale-110 max-md:w-11 max-md:h-11
              ${transitioning ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}
            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
            aria-label="Önceki hizmet"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:-translate-x-0.5">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-t3 group-hover:text-accent transition-colors" />
            </svg>
          </button>

          {/* Shape wrapper — this is what zooms */}
          <div
            ref={canvasWrapRef}
            className="relative flex items-center justify-center cursor-pointer"
            onClick={handleOpen}
            style={{
              transform: transitioning ? 'scale(6)' : 'scale(1)',
              transition: 'transform 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <div className="absolute rounded-full blur-[50px] -z-10"
              style={{ width: '160px', height: '160px', background: 'rgba(255,169,249,0.05)' }} />
            <canvas ref={canvasRef} className="relative w-[400px] h-[400px] max-md:w-[280px] max-md:h-[280px]" />
          </div>

          {/* Right arrow */}
          <button
            onClick={() => goTo(activeIndex + 1)}
            className={`group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-400
              bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06]
              hover:border-accent/30 hover:from-accent/[0.06] hover:scale-110 max-md:w-11 max-md:h-11
              ${transitioning ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}
            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
            aria-label="Sonraki hizmet"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-t3 group-hover:text-accent transition-colors" />
            </svg>
          </button>
        </div>

        {/* Button + subtitle + dots — fade out during transition */}
        <div style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'translateY(10px)' : 'translateY(0)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <div className="text-center mb-4">
            <button
              onClick={handleOpen}
              className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-body text-[0.95rem] font-semibold tracking-wide transition-all duration-500
                bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.08]
                hover:-translate-y-1 hover:border-accent/40 hover:from-accent/[0.08] hover:shadow-[0_8px_32px_rgba(255,169,249,0.12)]
                max-md:text-sm max-md:px-7 max-md:py-3"
            >
              <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(255,169,249,0.5)]" />
              <span className="gradient-text">{svc.title}</span>
            </button>
          </div>

          <p className="text-center text-sm font-body text-t3 font-light tracking-wide mb-8">{svc.subtitle}</p>

          <div className="flex justify-center gap-3">
            {services.map((s, i) => (
              <button
                key={s.key}
                onClick={() => goTo(i)}
                className="transition-all duration-400"
                style={{
                  width: i === activeIndex ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === activeIndex ? 'linear-gradient(90deg, #ffa9f9, #fff7ad)' : 'rgba(255,255,255,0.08)',
                  boxShadow: i === activeIndex ? '0 0 12px rgba(255,169,249,0.3)' : 'none',
                }}
                aria-label={s.title}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
