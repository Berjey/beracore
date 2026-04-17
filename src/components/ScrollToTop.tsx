'use client';

import { useEffect, useState, useCallback } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    let tick = false;
    const onScroll = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 400);
        tick = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    setClicking(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setClicking(false), 1200);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      aria-label="Sayfanın başına dön"
      className="fixed bottom-8 right-8 z-[8000] max-md:bottom-5 max-md:right-5"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
        pointerEvents: visible ? 'auto' : 'none',
        transitionProperty: 'opacity, transform',
        transitionDuration: '0.5s',
        transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Outer ring — spinning gradient border */}
      <div className="relative w-14 h-14 max-md:w-12 max-md:h-12">
        {/* Spinning gradient ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from ${hovering ? '0deg' : '0deg'}, #ffa9f9, #fff7ad, #ffa9f9)`,
            animation: hovering || clicking ? 'spin 2s linear infinite' : 'spin 6s linear infinite',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Glow pulse */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-500"
          style={{
            boxShadow: clicking
              ? '0 0 30px rgba(255,169,249,0.5), 0 0 60px rgba(255,247,173,0.3)'
              : hovering
                ? '0 0 20px rgba(255,169,249,0.3), 0 0 40px rgba(255,247,173,0.15)'
                : '0 0 10px rgba(255,169,249,0.1)',
          }}
        />

        {/* Inner circle */}
        <div
          className="absolute inset-[2px] rounded-full flex items-center justify-center transition-all duration-500"
          style={{
            background: hovering
              ? 'linear-gradient(135deg, rgba(255,169,249,0.12), rgba(255,247,173,0.08))'
              : 'rgba(26,26,26,0.9)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Arrow */}
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            className="transition-all duration-500"
            style={{
              transform: clicking ? 'translateY(-4px) scale(1.15)' : hovering ? 'translateY(-2px)' : 'translateY(0)',
            }}
          >
            <defs>
              <linearGradient id="scrollTopGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ffa9f9" />
                <stop offset="100%" stopColor="#fff7ad" />
              </linearGradient>
            </defs>
            <path d="M12 19V5M5 12l7-7 7 7" stroke="url(#scrollTopGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Click ripple effect */}
        {clicking && (
          <div className="absolute inset-0 rounded-full animate-ping"
            style={{ border: '1px solid rgba(255,169,249,0.3)' }} />
        )}
      </div>
    </button>
  );
}
