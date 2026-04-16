'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export default function Manifesto() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const total = wrapper.offsetHeight - window.innerHeight;
    const p = Math.max(0, Math.min(1, -rect.top / total));
    setProgress(p);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const p1 = Math.max(0, Math.min(1, progress / 0.22));
  const p2 = Math.max(0, Math.min(1, (progress - 0.18) / 0.22));
  const p3 = Math.max(0, Math.min(1, (progress - 0.40) / 0.20));
  const p4 = Math.max(0, Math.min(1, (progress - 0.60) / 0.25));
  const dP = Math.max(0, Math.min(1, (progress - 0.52) / 0.12));

  return (
    <div ref={wrapperRef} id="manifesto" className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex items-center px-8 overflow-hidden max-md:px-5">
        <div className="max-w-5xl mx-auto w-full relative z-[1] text-center">
          <div className="mb-3 min-h-[1.1em]">
            <h2 className="font-heading text-[clamp(3rem,8vw,6.5rem)] font-bold tracking-[-0.03em] leading-[0.95] text-t1">
              <Typewriter text="Dijitalin" progress={p1} />
            </h2>
          </div>
          <div className="mb-3 min-h-[1.1em]">
            <h2 className="font-heading text-[clamp(3rem,8vw,6.5rem)] font-bold tracking-[-0.03em] leading-[0.95]">
              <TypewriterAccent before="" accent="Çekirdeği" progress={p2} accentClass="gradient-text" />
            </h2>
          </div>
          <div className="mb-10 pt-4 min-h-[1.1em]">
            <h3 className="font-heading text-[clamp(1.5rem,4vw,3rem)] font-bold tracking-[-0.02em] leading-[1.1]">
              <TypewriterAccent before="Markanızın " accent="Temeli" progress={p3} className="text-t3" accentClass="gradient-text-reverse" />
            </h3>
          </div>
          <div
            ref={dividerRef}
            className="h-px w-full max-w-lg mx-auto origin-center mb-10"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--color-accent), var(--color-accent2), transparent)',
              transform: `scaleX(${dP})`,
            }}
          />
          <div className="min-h-[3em]">
            <p className="text-[clamp(1rem,1.8vw,1.15rem)] leading-[1.8] text-t2 max-w-2xl mx-auto">
              <Typewriter
                text="Strateji, tasarım ve mühendislik — her projenin çekirdeğinde bu üçlü var. BERACORE olarak dijital dünyanın karmaşıklığını, markanız için güçlü ve unutulmaz deneyimlere dönüştürüyoruz."
                progress={p4}
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Typewriter({ text, progress, className }: { text: string; progress: number; className?: string }) {
  const n = Math.floor(progress * text.length);
  const show = text.slice(0, n);
  const typing = progress > 0 && progress < 1;
  return (
    <span className={className}>
      {show}
      {typing && <span className="inline-block w-[2px] h-[0.85em] bg-accent ml-[1px] animate-pulse align-middle" />}
    </span>
  );
}

function TypewriterAccent({
  before, accent, progress, className, accentClass,
}: {
  before: string; accent: string; progress: number; className?: string; accentClass: string;
}) {
  const full = before + accent;
  const n = Math.floor(progress * full.length);
  const typing = progress > 0 && progress < 1;
  const showBefore = full.slice(0, Math.min(n, before.length));
  const showAccent = n > before.length ? full.slice(before.length, n) : '';
  return (
    <span className={className}>
      {showBefore}
      {showAccent && <span className={accentClass}>{showAccent}</span>}
      {typing && <span className="inline-block w-[2px] h-[0.85em] bg-accent ml-[1px] animate-pulse align-middle" />}
    </span>
  );
}
