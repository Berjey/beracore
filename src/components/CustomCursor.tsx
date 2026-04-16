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

    const onMove = (e: MouseEvent) => {
      cpx = e.clientX;
      cpy = e.clientY;
      dot.style.left = cpx + 'px';
      dot.style.top = cpy + 'px';
    };
    document.addEventListener('mousemove', onMove, { passive: true });

    let animId: number;
    const loop = () => {
      crx += (cpx - crx) * 0.15;
      cry += (cpy - cry) * 0.15;
      ring.style.left = crx + 'px';
      ring.style.top = cry + 'px';
      animId = requestAnimationFrame(loop);
    };
    loop();

    const hov = () => { ring.classList.add('h'); dot.classList.add('h'); };
    const out = () => { ring.classList.remove('h'); dot.classList.remove('h'); };

    const bind = () => {
      document.querySelectorAll('a,button,[role="button"]').forEach((el) => {
        el.addEventListener('mouseenter', hov);
        el.addEventListener('mouseleave', out);
      });
    };
    bind();
    const mo = new MutationObserver(bind);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-7 h-7 rounded-full pointer-events-none z-[2147483647]
          border border-accent/50 -translate-x-1/2 -translate-y-1/2 will-change-transform
          transition-[width,height,background,border-color] duration-300
          [&.h]:w-12 [&.h]:h-12 [&.h]:bg-accent/8 [&.h]:border-accent/80
          max-md:hidden"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-1 h-1 bg-accent2 rounded-full pointer-events-none z-[2147483647]
          -translate-x-1/2 -translate-y-1/2 will-change-transform transition-opacity duration-200
          [&.h]:opacity-0
          max-md:hidden"
      />
    </>
  );
}
