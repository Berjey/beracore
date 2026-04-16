'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let tick = false;
    const onScroll = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 60);
        tick = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <a
        href="#hero"
        className="skip-link bg-accent text-bg px-4 py-2 rounded-md text-xs font-semibold"
      >
        İçeriğe geç
      </a>

      <nav
        aria-label="Ana navigasyon"
        className={`fixed top-0 left-0 right-0 z-[9000] h-16 flex items-center justify-between px-10 transition-all duration-500 border-b border-transparent
          ${scrolled ? 'bg-bg/80 backdrop-blur-[20px] border-b-border' : ''}
          max-md:px-5 max-md:h-14`}
      >
        <button
          onClick={() => scrollTo('hero')}
          className="inline-flex items-center leading-none"
          aria-label="BERACORE — Ana sayfa"
        >
          <Image
            src="/beracore.png"
            alt="BERACORE"
            width={58}
            height={38}
            priority
            className="h-9 w-auto block drop-shadow-[0_0_18px_rgba(255,169,249,0.2)] transition-all duration-400 hover:drop-shadow-[0_0_28px_rgba(255,169,249,0.4)] hover:scale-[1.03] max-md:h-7"
            style={{ animation: 'logoSlide 1s cubic-bezier(0.16,1,0.3,1) 0.15s both' }}
          />
        </button>

        <button
          onClick={() => scrollTo('iletisim')}
          className="font-heading text-[0.7rem] font-semibold tracking-[0.1em] uppercase px-6 py-2.5 rounded-xl transition-all duration-400
            bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.08] text-t1
            hover:border-accent/40 hover:from-accent/[0.08] hover:shadow-[0_6px_24px_rgba(255,169,249,0.12)] hover:-translate-y-px
            max-md:text-[0.6rem] max-md:px-4"
        >
          İletişim
        </button>
      </nav>
    </>
  );
}
