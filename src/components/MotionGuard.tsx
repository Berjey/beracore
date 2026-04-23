'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * prefers-reduced-motion respekti — vestibular rahatsızlığı olan
 * kullanıcılar için animasyonları devre dışı bırakır.
 *
 * CSS animasyonları/geçişleri zaten globals.css'te aynı media query
 * ile durduruluyor. Bu bileşen GSAP animasyonlarını kapsar: GSAP
 * inline style yazdığı için CSS media query'den etkilenmez.
 *
 * Strateji: globalTimeline.timeScale(1000) — tüm animasyonlar 1000x
 * hızlı (anında final state'e atlar, kullanıcı hareket görmez).
 */
export default function MotionGuard() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      gsap.globalTimeline.timeScale(media.matches ? 1000 : 1);
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  return null;
}
