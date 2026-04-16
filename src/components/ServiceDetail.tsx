'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { services } from '@/lib/services-data';
import { createShapeScene, type ShapeSceneAPI } from '@/lib/service-shapes';

interface ServiceDetailProps {
  activeKey: string | null;
  onClose: () => void;
}

const subShapes = ['sphere', 'cube', 'octahedron', 'diamond', 'torus', 'ring'];

function SubShape({ shape }: { shape: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const api = createShapeScene(c);
    api.setShape(shape, '#ffa9f9');
    return () => api.dispose();
  }, [shape]);
  return <canvas ref={ref} className="w-[90px] h-[90px] max-md:w-[70px] max-md:h-[70px] cursor-grab active:cursor-grabbing" />;
}

export default function ServiceDetail({ activeKey, onClose }: ServiceDetailProps) {
  const isOpen = activeKey !== null;
  const svc = services.find((s) => s.key === activeKey);
  const [phase, setPhase] = useState<'closed' | 'entering' | 'open' | 'closing'>('closed');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setPhase('closing');
    setTimeout(() => { setPhase('closed'); onClose(); }, 700);
  }, [onClose]);

  useEffect(() => {
    if (isOpen && phase === 'closed') {
      setPhase('entering');
      // Wait for shape zoom to be near peak, then smoothly reveal content
      requestAnimationFrame(() => {
        setTimeout(() => setPhase('open'), 150);
      });
    }
  }, [isOpen, phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) handleClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (phase === 'open' && contentRef.current) contentRef.current.scrollTop = 0;
  }, [phase]);

  if (!svc && phase === 'closed') return null;
  const s = svc || services[0];
  const show = phase === 'open';
  const isVisible = phase !== 'closed';

  return (
    <div
      ref={contentRef}
      role="dialog"
      aria-hidden={!isVisible}
      className={`fixed inset-0 z-[10000] overflow-y-auto ${isVisible ? 'visible' : 'invisible pointer-events-none'}`}
      style={{
        scrollbarWidth: 'none',
        background: '#1a1a1a',
        opacity: phase === 'open' ? 1 : phase === 'closing' ? 0 : 0,
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Kurumsal pembe glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 15%, rgba(255,169,249,0.06), transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      {/* Close */}
      <button
        onClick={handleClose}
        className="fixed top-6 right-8 z-[10002] group inline-flex items-center gap-2 font-body text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-t2
          bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-[14px] px-5 py-2.5 rounded-xl border border-white/[0.06] transition-all duration-300
          hover:border-accent/30 hover:text-t1 max-md:top-4 max-md:right-4"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="group-hover:text-accent transition-colors">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Geri
      </button>

      <div className="min-h-screen max-w-[1000px] mx-auto px-8 pt-28 pb-20 relative z-[1] max-md:px-5 max-md:pt-20">
        {/* Header */}
        <div className={`mb-14 transition-all duration-700 delay-200 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(255,169,249,0.5)]" />
            <span className="font-body text-[0.6rem] font-bold tracking-[0.4em] uppercase text-accent2/60">{s.title}</span>
          </div>
          <h1 className={`font-body text-[clamp(2rem,4.5vw,3.2rem)] font-light tracking-tight leading-[1.15] mb-4 transition-all duration-800 delay-300
            ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'}`}>
            {s.subtitle}
          </h1>
          <p className={`text-base leading-relaxed text-t2 font-body font-light max-w-2xl transition-all duration-700 delay-400
            ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} max-md:text-sm`}>
            {s.description}
          </p>
          <div
            className={`h-px w-full max-w-xs mt-8 transition-all duration-700 delay-500 origin-left
              ${show ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
            style={{ background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent2), transparent)' }}
          />
        </div>

        {/* Alt Hizmetler label */}
        <span className={`block font-body text-[0.6rem] font-bold tracking-[0.5em] uppercase text-accent2/40 mb-8 transition-all duration-600 delay-500
          ${show ? 'opacity-100' : 'opacity-0'}`}>
          Alt Hizmetler
        </span>

        {/* Sub-service cards */}
        <div className="grid grid-cols-2 gap-5 mb-16 max-md:grid-cols-1">
          {s.subServices.map((sub, i) => (
            <div
              key={sub.title}
              className={`flex items-center gap-5 p-5 rounded-2xl border border-white/[0.04] transition-all duration-600
                hover:-translate-y-1 hover:bg-accent/[0.03] hover:border-accent/[0.12]
                ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                max-md:p-4 max-md:gap-3`}
              style={{ transitionDelay: show ? `${600 + i * 100}ms` : '0ms' }}
            >
              <div className="shrink-0">
                <SubShape shape={subShapes[i % subShapes.length]} />
              </div>
              <div>
                <h3 className="font-body text-sm font-semibold mb-1">{sub.title}</h3>
                <span className="text-[0.7rem] text-t3 font-light">Detaylı bilgi için iletişime geçin →</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA — kurumsal gradient */}
        <a
          href="mailto:info@beracore.com"
          className={`inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-body text-sm font-semibold tracking-wider uppercase transition-all duration-500 delay-[900ms]
            bg-gradient-to-r from-accent to-accent2 text-bg
            hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,169,249,0.25)] hover:scale-[1.02]
            ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Bu Hizmeti Konuşalım
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
