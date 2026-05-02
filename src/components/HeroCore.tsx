'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createCoreScene, type CoreSceneAPI } from '@/lib/core-scene';

gsap.registerPlugin(ScrollTrigger);

interface HeroCoreProps {
  onReady: () => void;
}

export default function HeroCore({ onReady }: HeroCoreProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<CoreSceneAPI | null>(null);
  const readyFired = useRef(false);

  const fireReady = useCallback(() => {
    if (readyFired.current) return;
    readyFired.current = true;
    onReady();
  }, [onReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const api = createCoreScene(canvas);
    sceneRef.current = api;
    requestAnimationFrame(() => setTimeout(fireReady, 300));
    const timer = setTimeout(fireReady, 4000);
    return () => { clearTimeout(timer); api.dispose(); };
  }, [fireReady]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
      onUpdate: (self) => {
        sceneRef.current?.setScrollProgress(self.progress);
      },
    });
    return () => { trigger.kill(); };
  }, []);

  // Scroll → fade out logo/tagline
  useEffect(() => {
    const overlay = overlayRef.current;
    const section = sectionRef.current;
    if (!overlay || !section) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top top', end: '25% top', scrub: 0.3 },
    });
    tl.to(overlay, { opacity: 0, y: -60, ease: 'none' });
    return () => { tl.kill(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="BERACORE — The Core"
      className="relative w-full h-[150vh]"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* 3D Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />

        {/* Logo + tagline */}
        <div
          ref={overlayRef}
          className="relative z-[3] text-center pointer-events-none select-none flex flex-col items-center gap-5 mt-[28vh]"
        >
          <h1
            className="font-heading text-[clamp(2.2rem,7vw,5rem)] font-bold tracking-[-0.03em] leading-none opacity-0"
            style={{ animation: 'fi 1.2s ease 0.5s forwards' }}
          >
            <span className="text-t1">BERA</span><span className="gradient-text">CORE</span>
          </h1>
          <p
            className="font-heading text-[clamp(0.75rem,1.5vw,1rem)] font-semibold tracking-[0.4em] uppercase opacity-0"
            style={{ animation: 'fi 1.2s ease 1.2s forwards' }}
          >
            <span className="gradient-text-reverse">Digital Experience Studio</span>
          </p>
        </div>
      </div>
    </section>
  );
}
