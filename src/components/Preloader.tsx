'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100000] flex items-center justify-center flex-col gap-8 bg-bg transition-all duration-700 ${
        done ? 'opacity-0 invisible pointer-events-none' : ''
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {/* Soft glow */}
      <div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,169,249,0.08), rgba(255,247,173,0.03) 40%, transparent 65%)',
          transform: 'translate(-50%, -50%)',
          animation: 'coreGlow 4s ease-in-out infinite',
          filter: 'blur(25px)',
        }}
      />

      <div className="relative flex items-center justify-center">
        <Image
          src="/beracore-bg.png"
          alt="BERACORE"
          width={380}
          height={248}
          priority
          className="w-[clamp(220px,28vw,340px)] h-auto drop-shadow-[0_0_40px_rgba(255,169,249,0.25)] opacity-0 scale-[0.94]"
          style={{ animation: 'preLogoIn 1s cubic-bezier(0.16,1,0.3,1) 0.2s forwards' }}
        />
      </div>

      <div
        className="w-8 h-8 relative opacity-0"
        style={{ animation: 'fi 0.5s ease 1s forwards' }}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full block"
          style={{ animation: 'preSpin 1.4s linear infinite' }}
        >
          <defs>
            <linearGradient id="preGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffa9f9" />
              <stop offset="100%" stopColor="#fff7ad" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
          <circle
            cx="20" cy="20" r="17"
            fill="none" stroke="url(#preGrad)" strokeWidth="1.5"
            strokeLinecap="round" strokeDasharray="60 100"
            style={{ animation: 'preArc 1.6s ease-in-out infinite' }}
          />
        </svg>
      </div>
    </div>
  );
}
