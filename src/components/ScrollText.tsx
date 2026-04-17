'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollTextProps {
  /** Normal metin kısmı */
  before?: string;
  /** Gradient renkli vurgulanan kısım */
  accent?: string;
  /** CSS sınıfı (dış wrapper) */
  className?: string;
  /** Accent kısmı için CSS sınıfı */
  accentClass?: string;
}

/**
 * Manifesto tarzı scroll-driven typewriter başlık.
 * Scroll aşağı → harf harf yazılır. Scroll yukarı → harf harf silinir.
 */
export default function ScrollText({
  before = '',
  accent = '',
  className,
  accentClass = 'gradient-text font-semibold',
}: ScrollTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // Yazma başlangıcı: element viewport'un %85'inde
    // Yazma bitişi: element viewport'un %40'ında
    const start = vh * 0.85;
    const end = vh * 0.40;
    const p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
    setProgress(p);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const full = before + accent;
  const n = Math.floor(progress * full.length);
  const typing = progress > 0 && progress < 1;

  const showBefore = full.slice(0, Math.min(n, before.length));
  const showAccent = n > before.length ? full.slice(before.length, n) : '';

  return (
    <span ref={ref} className={className}>
      {showBefore}
      {showAccent && <span className={accentClass}>{showAccent}</span>}
      {typing && (
        <span className="inline-block w-[2px] h-[0.75em] bg-accent ml-[2px] animate-pulse align-middle" />
      )}
    </span>
  );
}
