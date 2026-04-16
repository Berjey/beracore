'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { services } from '@/lib/services-data';
import { createSubScene, type SubShapeAPI } from '@/lib/sub-shapes';
import Starfield from '@/components/Starfield';

interface ServiceDetailProps {
  activeKey: string | null;
  onClose: () => void;
}

export default function ServiceDetail({ activeKey, onClose }: ServiceDetailProps) {
  const isOpen = activeKey !== null;
  const svc = services.find((s) => s.key === activeKey);
  const [phase, setPhase] = useState<'closed' | 'entering' | 'open' | 'closing'>('closed');
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeRef = useRef<SubShapeAPI | null>(null);
  const [subIndex, setSubIndex] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);

  const s = svc || services[0];
  const sub = s.subServices[subIndex];

  const handleClose = useCallback(() => {
    setDetailOpen(false);
    setPhase('closing');
    setTimeout(() => { setPhase('closed'); onClose(); setSubIndex(0); }, 700);
  }, [onClose]);

  useEffect(() => {
    if (isOpen && phase === 'closed') {
      setPhase('entering');
      setSubIndex(0);
      setDetailOpen(false);
      requestAnimationFrame(() => {
        setTimeout(() => setPhase('open'), 150);
      });
    }
  }, [isOpen, phase]);

  // Init shape scene
  useEffect(() => {
    if (phase !== 'open') return;
    const c = canvasRef.current;
    if (!c || shapeRef.current) return;
    const api = createSubScene(c);
    shapeRef.current = api;
    api.setShape(s.subServices[0].icon, s.color);
    return () => {
      api.dispose();
      shapeRef.current = null;
    };
  }, [phase, s]);

  // Morph on sub change
  useEffect(() => {
    if (shapeRef.current && sub) {
      shapeRef.current.setShape(sub.icon, s.color);
    }
  }, [subIndex, sub, s.color]);

  const goTo = useCallback((index: number) => {
    setDetailOpen(false);
    setSubIndex((index + s.subServices.length) % s.subServices.length);
  }, [s.subServices.length]);

  // Şekle tıklayınca detay panelini aç/kapa
  const handleShapeClick = useCallback(() => {
    setDetailOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (detailOpen) setDetailOpen(false);
        else handleClose();
      }
      if (e.key === 'ArrowRight') goTo(subIndex + 1);
      if (e.key === 'ArrowLeft') goTo(subIndex - 1);
      if (e.key === 'Enter') setDetailOpen(prev => !prev);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose, goTo, subIndex, detailOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!svc && phase === 'closed') return null;
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
        background: 'var(--color-bg)',
        opacity: phase === 'open' ? 1 : phase === 'closing' ? 0 : 0,
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {isVisible && <Starfield />}

      {/* Geri */}
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

      <div className="min-h-screen flex flex-col items-center justify-center relative z-[1] px-8 py-24 max-md:px-5 max-md:py-16">

        {/* Üst label */}
        <div className={`text-center mb-4 transition-all duration-700 delay-200 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60">
            {s.title}
          </span>
        </div>

        {/* Ana bölüm — shape + detay yan yana */}
        <div className={`w-full max-w-5xl mx-auto transition-all duration-1000 delay-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

          <div className={`flex items-center justify-center transition-all duration-700 ease-out ${detailOpen ? 'gap-0 max-md:flex-col' : 'gap-10 max-md:gap-4'}`}>

            {/* Sol ok */}
            <button
              onClick={() => goTo(subIndex - 1)}
              className={`group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden shrink-0
                border border-accent/20 hover:border-accent/50 hover:scale-110 active:scale-95
                max-md:w-11 max-md:h-11
                ${detailOpen ? 'opacity-0 scale-75 pointer-events-none w-0 !p-0 !border-0' : 'opacity-100 scale-100'}`}
              style={{ transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              aria-label="Önceki alt hizmet"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-accent2/[0.04] to-transparent group-hover:from-accent/[0.18] group-hover:via-accent2/[0.10] transition-all duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: 'inset 0 0 20px rgba(255,169,249,0.08), 0 0 24px rgba(255,169,249,0.12)' }} />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5">
                <defs><linearGradient id="subArrowL" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ffa9f9" /><stop offset="100%" stopColor="#fff7ad" /></linearGradient></defs>
                <path d="M15 6l-6 6 6 6" stroke="url(#subArrowL)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-opacity" />
              </svg>
            </button>

            {/* 3D Şekil — tıklanabilir */}
            <div
              className={`relative flex items-center justify-center cursor-pointer transition-all duration-700 ease-out shrink-0
                ${detailOpen ? 'scale-[0.65] max-md:scale-[0.55]' : 'scale-100'}`}
              onClick={handleShapeClick}
            >
              <div className="absolute rounded-full blur-[50px] -z-10 transition-all duration-700"
                style={{ width: '200px', height: '200px', background: s.glowColor, opacity: detailOpen ? 0.5 : 1 }} />
              <canvas
                ref={canvasRef}
                className="relative w-[400px] h-[400px] max-md:w-[280px] max-md:h-[280px]"
              />
              {/* Tıkla ipucu */}
              {!detailOpen && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 animate-pulse">
                  <span className="text-[0.6rem] font-body text-t3 tracking-wider uppercase">Detay için tıkla</span>
                </div>
              )}
            </div>

            {/* Sağ ok */}
            <button
              onClick={() => goTo(subIndex + 1)}
              className={`group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden shrink-0
                border border-accent/20 hover:border-accent/50 hover:scale-110 active:scale-95
                max-md:w-11 max-md:h-11
                ${detailOpen ? 'opacity-0 scale-75 pointer-events-none w-0 !p-0 !border-0' : 'opacity-100 scale-100'}`}
              style={{ transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              aria-label="Sonraki alt hizmet"
            >
              <div className="absolute inset-0 bg-gradient-to-bl from-accent/[0.08] via-accent2/[0.04] to-transparent group-hover:from-accent/[0.18] group-hover:via-accent2/[0.10] transition-all duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: 'inset 0 0 20px rgba(255,169,249,0.08), 0 0 24px rgba(255,169,249,0.12)' }} />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">
                <defs><linearGradient id="subArrowR" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ffa9f9" /><stop offset="100%" stopColor="#fff7ad" /></linearGradient></defs>
                <path d="M9 6l6 6-6 6" stroke="url(#subArrowR)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-opacity" />
              </svg>
            </button>

            {/* Detay Paneli — şeklin sağında açılır */}
            <div
              className={`overflow-hidden transition-all duration-700 ease-out max-md:w-full
                ${detailOpen ? 'max-w-[480px] opacity-100 max-md:max-w-full' : 'max-w-0 opacity-0 pointer-events-none'}`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              <div className={`pl-4 pr-2 py-6 min-w-[400px] max-md:min-w-0 max-md:pl-0 max-md:pt-2 transition-all duration-500 delay-200
                ${detailOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>

                {/* Detay başlık */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(255,169,249,0.5)]" />
                  <h3 className="font-body text-[clamp(1.2rem,2.5vw,1.6rem)] font-semibold gradient-text">{sub?.title}</h3>
                </div>

                {/* Açıklama */}
                <p className="text-sm leading-relaxed text-t2 font-body font-light mb-6 max-md:text-[0.8rem]">
                  {sub?.description}
                </p>

                {/* Gradient divider */}
                <div className="h-px w-full max-w-[200px] mb-5"
                  style={{ background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent2), transparent)' }} />

                {/* Features */}
                <div className="space-y-2.5 mb-6">
                  {sub?.features.map((feat, i) => (
                    <div key={feat} className="flex items-center gap-3 transition-all duration-500"
                      style={{ transitionDelay: detailOpen ? `${300 + i * 80}ms` : '0ms', opacity: detailOpen ? 1 : 0, transform: detailOpen ? 'translateX(0)' : 'translateX(12px)' }}>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: i % 2 === 0 ? '#ffa9f9' : '#fff7ad', boxShadow: `0 0 6px ${i % 2 === 0 ? 'rgba(255,169,249,0.4)' : 'rgba(255,247,173,0.4)'}` }} />
                      <span className="text-[0.8rem] font-body text-t1 font-light">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* CTA mini */}
                <a
                  href="mailto:info@beracore.com"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-body text-[0.75rem] font-semibold tracking-wider uppercase transition-all duration-400
                    bg-gradient-to-r from-accent to-accent2 text-bg
                    hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,169,249,0.2)] hover:scale-[1.02]"
                >
                  Teklif Al
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>

                {/* Kapat butonu */}
                <button
                  onClick={() => setDetailOpen(false)}
                  className="mt-4 block text-[0.65rem] font-body text-t3 tracking-wider uppercase hover:text-accent transition-colors"
                >
                  Paneli Kapat
                </button>
              </div>
            </div>
          </div>

          {/* Başlık butonu + alt bilgi + dots — detay kapalıyken görünür */}
          <div className={`transition-all duration-500 ${detailOpen ? 'opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden' : 'opacity-100 translate-y-0'}`}>
            <div className="text-center mb-4 mt-2">
              <button
                onClick={handleShapeClick}
                className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-body text-[0.95rem] font-semibold tracking-wide transition-all duration-500
                  bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.08]
                  hover:-translate-y-1 hover:border-accent/40 hover:from-accent/[0.08] hover:shadow-[0_8px_32px_rgba(255,169,249,0.12)]
                  max-md:text-sm max-md:px-7 max-md:py-3"
              >
                <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(255,169,249,0.5)]" />
                <span className="gradient-text">{sub?.title}</span>
              </button>
            </div>

            <p className="text-center text-sm font-body text-t3 font-light tracking-wide mb-8">
              Detaylar için şekle veya başlığa tıklayın
            </p>

            {/* Dot navigasyon */}
            <div className="flex justify-center gap-3 mb-12">
              {s.subServices.map((ss, i) => (
                <button
                  key={ss.title}
                  onClick={() => goTo(i)}
                  className="transition-all duration-400"
                  style={{
                    width: i === subIndex ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: i === subIndex ? 'linear-gradient(90deg, #ffa9f9, #fff7ad)' : 'rgba(255,255,255,0.08)',
                    boxShadow: i === subIndex ? '0 0 12px rgba(255,169,249,0.3)' : 'none',
                  }}
                  aria-label={ss.title}
                />
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <a
                href="mailto:info@beracore.com"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-body text-sm font-semibold tracking-wider uppercase transition-all duration-500
                  bg-gradient-to-r from-accent to-accent2 text-bg
                  hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,169,249,0.25)] hover:scale-[1.02]"
              >
                Bu Hizmeti Konuşalım
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Detay açıkken alt dot nav — kompakt */}
          {detailOpen && (
            <div className="flex justify-center gap-3 mt-6">
              {s.subServices.map((ss, i) => (
                <button
                  key={ss.title}
                  onClick={() => goTo(i)}
                  className="transition-all duration-400"
                  style={{
                    width: i === subIndex ? '24px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: i === subIndex ? 'linear-gradient(90deg, #ffa9f9, #fff7ad)' : 'rgba(255,255,255,0.06)',
                    boxShadow: i === subIndex ? '0 0 8px rgba(255,169,249,0.25)' : 'none',
                  }}
                  aria-label={ss.title}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
