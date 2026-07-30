'use client';

import { useEffect, useRef } from 'react';

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const canvas: HTMLCanvasElement = cv; // closure içinde narrowing korunsun
    const ctx = canvas.getContext('2d', { alpha: true })!;
    const dpr = Math.min(devicePixelRatio, 2);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0;

    type Star = {
      baseX: number; baseY: number;
      r: number; phase: number; twinkleSpeed: number;
      orbitRadius: number; orbitSpeed: number; orbitPhase: number;
    };
    const stars: Star[] = [];

    function seedStars() {
      // Yıldız sayısı ekran alanına göre ölçeklenir (sabit 700 yerine) — üst sınır kapalı.
      const count = Math.min(420, Math.max(120, Math.floor((window.innerWidth * window.innerHeight) / 5200)));
      stars.length = 0;
      for (let i = 0; i < count; i++) {
        stars.push({
          baseX: Math.random() * w,
          baseY: Math.random() * h,
          r: Math.random() * 1.5 + 0.3,
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 1.5 + 0.5,
          orbitRadius: Math.random() * 25 + 5,
          orbitSpeed: (Math.random() * 0.4 + 0.1) * (Math.random() > 0.5 ? 1 : -1),
          orbitPhase: Math.random() * Math.PI * 2,
        });
      }
    }

    let lastCssW = 0, lastCssH = 0;

    function resize(reseed: boolean) {
      const cssW = window.innerWidth, cssH = window.innerHeight;
      w = cssW * dpr;
      h = cssH * dpr;
      canvas.width = w;
      canvas.height = h;
      // canvas.width/height'a yazmak 2D context state'ini SIFIRLAR (fillStyle dahil).
      // Bu satır olmadan yeniden boyutlandırmadan sonra yıldızlar siyah çiziliyor ve
      // koyu zeminde tamamen kayboluyordu.
      ctx.fillStyle = 'rgb(255,252,248)';
      lastCssW = cssW;
      lastCssH = cssH;
      if (reseed) seedStars();
    }
    resize(true);

    function paint(t: number) {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const twinkle = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.phase));
        const x = s.baseX + Math.cos(t * s.orbitSpeed + s.orbitPhase) * s.orbitRadius;
        const y = s.baseY + Math.sin(t * s.orbitSpeed * 0.8 + s.orbitPhase) * s.orbitRadius * 0.7;
        ctx.globalAlpha = twinkle * 0.55;
        ctx.beginPath();
        ctx.arc(x, y, s.r * (0.8 + twinkle * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Mobilde adres çubuğu gizlenip görünürken `resize` sürekli tetiklenir ve yalnızca
    // yükseklik ~60–120px değişir. Böyle durumlarda yıldızları yeniden dağıtmak tüm
    // gökyüzünün zıplamasına yol açıyordu → yalnızca gerçek boyut değişiminde reseed.
    const HEIGHT_TOLERANCE = 140;
    let rafId = 0;
    const onResize = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const reseed =
          window.innerWidth !== lastCssW ||
          Math.abs(window.innerHeight - lastCssH) > HEIGHT_TOLERANCE;
        resize(reseed);
        if (reduced) paint(0);
      });
    };

    // Hareket kısıtlıysa: statik tek kare çiz, döngü kurma.
    if (reduced) {
      paint(0);
      window.addEventListener('resize', onResize);
      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener('resize', onResize);
      };
    }

    // ~35fps hedef: göz için farkı yok, CPU/GPU yükünü ~%40 azaltır.
    const FRAME = 1000 / 35;
    let raf = 0;
    let last = 0;
    let t = 0;
    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME) return;
      last = now;
      t += 0.028; // ~35fps gerçek zaman
      paint(t);
    }
    raf = requestAnimationFrame(loop);

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
