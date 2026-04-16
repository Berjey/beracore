'use client';

import { useEffect, useRef } from 'react';

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(devicePixelRatio, 2);

    let w = 0, h = 0;
    function resize() {
      if (!canvas) return;
      w = window.innerWidth * dpr;
      h = window.innerHeight * dpr;
      canvas.width = w;
      canvas.height = h;
      // Re-place stars on resize
      for (const s of stars) {
        s.baseX = Math.random() * w;
        s.baseY = Math.random() * h;
      }
    }

    const stars: {
      baseX: number; baseY: number;
      r: number; phase: number; twinkleSpeed: number;
      orbitRadius: number; orbitSpeed: number; orbitPhase: number;
    }[] = [];

    for (let i = 0; i < 700; i++) {
      stars.push({
        baseX: 0, baseY: 0,
        r: Math.random() * 1.5 + 0.3,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 1.5 + 0.5,
        // Each star orbits a small circle around its base position
        orbitRadius: Math.random() * 25 + 5,
        orbitSpeed: (Math.random() * 0.4 + 0.1) * (Math.random() > 0.5 ? 1 : -1),
        orbitPhase: Math.random() * Math.PI * 2,
      });
    }

    resize();

    let raf: number;
    let t = 0;
    function draw() {
      raf = requestAnimationFrame(draw);
      t += 0.016; // ~60fps real-time
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        // Twinkle: pulsing brightness
        const twinkle = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.phase));

        // Orbit: each star moves in a small circle
        const x = s.baseX + Math.cos(t * s.orbitSpeed + s.orbitPhase) * s.orbitRadius;
        const y = s.baseY + Math.sin(t * s.orbitSpeed * 0.8 + s.orbitPhase) * s.orbitRadius * 0.7;

        ctx.beginPath();
        ctx.arc(x, y, s.r * (0.8 + twinkle * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,252,248,${twinkle * 0.55})`;
        ctx.fill();
      }
    }
    draw();

    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
