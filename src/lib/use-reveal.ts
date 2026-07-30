'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Scroll ile içerik açılışı — GSAP/ScrollTrigger yerine IntersectionObserver + CSS
 * (bkz. globals.css "Genel giriş / scroll reveal").
 *
 * Tasarım kararları:
 *  - Gizleme sınıfı (`rv-armed`) yalnızca JS ekler → JS çalışmazsa içerik görünür kalır.
 *  - Kap işaretlenirken viewport'ta OLAN öğelere aynı adımda `is-in` verilir; böylece
 *    ilk ekrandaki paragraflar "görünür → gizli → tekrar görünür" diye titremez.
 *  - prefers-reduced-motion veya IO yoksa hiçbir şey gizlenmez.
 *  - 2 sn güvenlik ağı: IO bir şekilde tetiklenmezse içerik gizli kalmaz.
 */
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-rv]'));
    if (els.length === 0) return;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      return;
    }

    const vh = window.innerHeight;
    root.classList.add('rv-armed');
    // Aynı senkron adımda: ekranda olanlar doğrudan açık başlar (titreme yok).
    const pending: HTMLElement[] = [];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add('is-in');
      else pending.push(el);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    pending.forEach((el) => io.observe(el));

    const safety = window.setTimeout(() => els.forEach((el) => el.classList.add('is-in')), 2000);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
      root.classList.remove('rv-armed');
    };
  }, [ref]);
}
