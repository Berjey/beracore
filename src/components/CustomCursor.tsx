'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;
    if (matchMedia('(hover: none)').matches || window.innerWidth <= 768) return;

    let crx = 0, cry = 0, cpx = 0, cpy = 0;
    let hovering = false;

    // Tek mousemove: dot'u GPU transform ile taşı + hover durumunu delegation ile belirle.
    // MutationObserver YOK — GSAP her frame DOM'u değiştirdiğinde yeniden bind gerekmez.
    const onMove = (e: MouseEvent) => {
      cpx = e.clientX;
      cpy = e.clientY;
      dot.style.transform = `translate3d(${cpx}px, ${cpy}px, 0) translate(-50%, -50%)`;

      const target = e.target as Element | null;
      const isInteractive = !!target?.closest?.('a,button,[role="button"],label,summary');
      if (isInteractive !== hovering) {
        hovering = isInteractive;
        ring.classList.toggle('h', hovering);
        dot.classList.toggle('h', hovering);
      }
    };
    document.addEventListener('mousemove', onMove, { passive: true });

    // Ring: yumuşak takip (lerp) — sadece transform, layout tetiklemez.
    let animId: number;
    const loop = () => {
      crx += (cpx - crx) * 0.15;
      cry += (cpy - cry) * 0.15;
      ring.style.transform = `translate3d(${crx}px, ${cry}px, 0) translate(-50%, -50%)`;
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-7 h-7 rounded-full pointer-events-none z-[2147483647]
          border border-accent/50 will-change-transform
          transition-[width,height,background,border-color] duration-300
          [&.h]:w-12 [&.h]:h-12 [&.h]:bg-accent/8 [&.h]:border-accent/80
          max-md:hidden"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-1 h-1 bg-accent2 rounded-full pointer-events-none z-[2147483647]
          will-change-transform transition-opacity duration-200
          [&.h]:opacity-0
          max-md:hidden"
      />
    </>
  );
}
