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
 *
 * ÖNEMLİ — metnin TAMAMI her zaman DOM'da bulunur; henüz yazılmamış kısım
 * `opacity:0` ile görünmez kalır. Bunun üç faydası var:
 *   1. SEO — sunucu HTML'inde başlık boş değil (eskiden `<h2><span></span></h2>` üretiliyordu).
 *   2. Erişilebilirlik — h1/h2'nin erişilebilir adı ilk andan itibaren tam metin.
 *   3. CLS — nihai genişlik/yükseklik baştan ayrılır, yazarken satır kaymaz.
 * prefers-reduced-motion açıkken animasyon hiç çalışmaz, metin doğrudan görünür.
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
    // Hareket kısıtlıysa: metni tam göster, scroll dinleyicisi kurma.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(fullLen);
      return;
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, fullLen]);

  const beforeShown = before.slice(0, Math.min(count, before.length));
  const beforeRest = before.slice(beforeShown.length);
  const accentShown = accent.slice(0, Math.max(0, count - before.length));
  const accentRest = accent.slice(accentShown.length);
  const typing = count > 0 && count < fullLen;
  // Yazılmamış kısım: yerini korur (CLS yok) ama görünmez.
  const hidden = { opacity: 0 } as const;
  // İmleç: genişliği 0 olan bir kapsayıcı içinde konumlanır → metni kaydırmaz.
  const caret = typing ? (
    <span aria-hidden="true" className="relative inline-block w-0 align-middle">
      <span className="absolute left-[1px] top-1/2 -translate-y-1/2 block w-[2px] h-[0.75em] bg-accent animate-pulse" />
    </span>
  ) : null;

  return (
    <span ref={ref} className={className}>
      {beforeShown}
      {count <= before.length && caret}
      {beforeRest && <span style={hidden}>{beforeRest}</span>}
      {accentShown && <span className={accentClass}>{accentShown}</span>}
      {count > before.length && caret}
      {accentRest && <span className={accentClass} style={hidden}>{accentRest}</span>}
    </span>
  );
}
