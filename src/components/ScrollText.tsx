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
 *
 * Performans: state olarak float progress DEĞİL, integer harf sayısı tutulur.
 * Böylece re-render yalnızca yeni bir harf çıkıp/silinince olur (her scroll
 * frame'inde değil). Scroll handler rAF ile throttle edilir.
 */
export default function ScrollText({
  before = '',
  accent = '',
  className,
  accentClass = 'gradient-text font-semibold',
}: ScrollTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const full = before + accent;
  const fullLen = full.length;
  const [count, setCount] = useState(0);
  const ticking = useRef(false);
  const lastN = useRef(-1);

  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      ticking.current = false;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.40;
      const p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      const n = Math.floor(p * fullLen);
      if (n !== lastN.current) {
        lastN.current = n;
        setCount(n); // integer → aynı değerde React re-render'ı atlar
      }
    });
  }, [fullLen]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const showBefore = full.slice(0, Math.min(count, before.length));
  const showAccent = count > before.length ? full.slice(before.length, count) : '';
  const typing = count > 0 && count < fullLen;

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
