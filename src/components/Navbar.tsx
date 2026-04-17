'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/lib/services-data';

const NAV_LINKS = [
  { label: 'Ana Sayfa', id: '__home' },
  { label: 'Hakkımızda', id: '__about' },
  { label: 'Hizmetler', id: 'services' },
  { label: 'Neden Biz', id: 'why-us' },
  { label: 'Süreç', id: 'process' },
  { label: 'Referanslar', id: 'referanslar' },
  { label: 'SSS', id: 'faq' },
  { label: 'İletişim', id: 'iletisim' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hizmetlerOpen, setHizmetlerOpen] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const hizmetlerTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let tick = false;
    const onScroll = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => { setScrolled(window.scrollY > 60); tick = false; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Sayfa geçiş loading — navigating bitince kapat
  useEffect(() => {
    if (navigating) {
      const timer = setTimeout(() => setNavigating(false), 3000); // fallback
      return () => clearTimeout(timer);
    }
  }, [navigating]);
  useEffect(() => { setNavigating(false); }, [pathname]);

  const handleNav = useCallback((id: string) => {
    setMobileOpen(false);

    // Ana Sayfa
    if (id === '__home') {
      if (pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setNavigating(true);
        router.push('/');
      }
      return;
    }

    // Hakkımızda
    if (id === '__about') {
      if (pathname === '/hakkimizda') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setNavigating(true);
        router.push('/hakkimizda');
      }
      return;
    }

    // Anasayfa section'ları
    if (pathname === '/') {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setNavigating(true);
      router.push(`/#${id}`);
    }
  }, [pathname, router]);

  const openHizmetler = () => {
    if (hizmetlerTimeout.current) clearTimeout(hizmetlerTimeout.current);
    setHizmetlerOpen(true);
  };
  const closeHizmetler = () => {
    hizmetlerTimeout.current = setTimeout(() => setHizmetlerOpen(false), 200);
  };

  return (
    <>
      {/* ===== Sayfa Geçiş Loading ===== */}
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-bg"
        style={{
          opacity: navigating ? 1 : 0,
          visibility: navigating ? 'visible' : 'hidden',
          pointerEvents: navigating ? 'all' : 'none',
          transitionProperty: 'opacity, visibility',
          transitionDuration: navigating ? '0.15s' : '0.35s',
        }}
        aria-hidden={!navigating}
      >
        <div className="flex flex-col items-center gap-4">
          <Image src="/beracore.png" alt="BERACORE" width={58} height={38}
            className="h-10 w-auto drop-shadow-[0_0_20px_rgba(255,169,249,0.3)] animate-pulse" />
          <div className="w-8 h-8">
            <svg viewBox="0 0 40 40" className="w-full h-full" style={{ animation: 'preSpin 1.2s linear infinite' }}>
              <defs><linearGradient id="navLoadGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ffa9f9" /><stop offset="100%" stopColor="#fff7ad" /></linearGradient></defs>
              <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
              <circle cx="20" cy="20" r="17" fill="none" stroke="url(#navLoadGrad)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="60 100" style={{ animation: 'preArc 1.4s ease-in-out infinite' }} />
            </svg>
          </div>
        </div>
      </div>

      <nav
        aria-label="Ana navigasyon"
        className={`fixed top-0 left-0 right-0 z-[9000] h-16 flex items-center justify-between px-10 transition-all duration-500 border-b border-transparent
          ${scrolled ? 'bg-bg/80 backdrop-blur-[20px] border-b-border' : ''}
          max-md:px-5 max-md:h-14`}
      >
        {/* Logo */}
        <button onClick={() => handleNav('__home')} className="inline-flex items-center leading-none shrink-0" aria-label="BERACORE — Ana sayfa">
          <Image
            src="/beracore.png" alt="BERACORE" width={58} height={38} priority
            className="h-9 w-auto block drop-shadow-[0_0_18px_rgba(255,169,249,0.2)] transition-all duration-400 hover:drop-shadow-[0_0_28px_rgba(255,169,249,0.4)] hover:scale-[1.03] max-md:h-7"
            style={{ animation: 'logoSlide 1s cubic-bezier(0.16,1,0.3,1) 0.15s both' }}
          />
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            link.label === 'Hizmetler' ? (
              <div key={link.id} className="relative" onMouseEnter={openHizmetler} onMouseLeave={closeHizmetler}>
                <button
                  onClick={() => handleNav(link.id)}
                  className="relative px-3 py-2 font-body text-[0.75rem] font-medium tracking-wide text-t1 transition-all duration-300 hover:text-accent group"
                >
                  <span>{link.label}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    className={`inline-block ml-1 transition-transform duration-300 ${hizmetlerOpen ? 'rotate-180' : ''}`}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-accent to-accent2 group-hover:w-3/4 transition-all duration-400" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-300"
                  style={{ opacity: hizmetlerOpen ? 1 : 0, transform: hizmetlerOpen ? 'translateY(0)' : 'translateY(-8px)', pointerEvents: hizmetlerOpen ? 'auto' : 'none' }}>
                  <div className="w-[280px] p-3 rounded-2xl bg-bg/95 backdrop-blur-[24px] border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
                    {services.map((svc, i) => (
                      <Link key={svc.key} href={`/hizmetler/${svc.key}/${svc.subServices[0].slug}`} onClick={() => setHizmetlerOpen(false)}
                        className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/[0.04]">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 group-hover:scale-150"
                          style={{ background: i % 2 === 0 ? '#ffa9f9' : '#fff7ad', boxShadow: `0 0 6px ${i % 2 === 0 ? 'rgba(255,169,249,0.3)' : 'rgba(255,247,173,0.3)'}` }} />
                        <div>
                          <span className="font-body text-[0.8rem] font-medium text-t1 group-hover:text-accent transition-colors duration-300">{svc.title}</span>
                          <span className="block font-body text-[0.65rem] text-t3 font-light">{svc.subtitle}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className="relative px-3 py-2 font-body text-[0.75rem] font-medium tracking-wide text-t1 transition-all duration-300 hover:text-accent group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-accent to-accent2 group-hover:w-3/4 transition-all duration-400" />
              </button>
            )
          ))}

          {/* CTA — Teklif Al sayfasına yönlendir */}
          <Link
            href="/teklif-al"
            className="ml-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-[0.72rem] font-semibold tracking-[0.1em] uppercase transition-all duration-400
              bg-gradient-to-r from-accent to-accent2 text-bg
              hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(255,169,249,0.25)] hover:scale-[1.02]"
          >
            Teklif Al
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={mobileOpen}
        >
          <span className={`block w-5 h-[1.5px] bg-t1 transition-all duration-400 ${mobileOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-t1 transition-all duration-400 ${mobileOpen ? 'opacity-0 scale-0' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-t1 transition-all duration-400 ${mobileOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
        </button>
      </nav>

      {/* ===== Mobile Menu ===== */}
      <div className={`fixed inset-0 z-[8999] md:hidden transition-all duration-500 ${mobileOpen ? 'visible' : 'invisible pointer-events-none'}`}
        style={{ background: 'rgba(26,26,26,0.97)' }}>
        <div className="flex flex-col items-center justify-center h-full gap-2 px-8">
          {NAV_LINKS.map((link, i) => (
            <button key={link.id} onClick={() => handleNav(link.id)}
              className="font-body text-[1.3rem] font-light text-t1 py-2.5 transition-all duration-500 hover:text-accent"
              style={{ opacity: mobileOpen ? 1 : 0, transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)', transitionDelay: mobileOpen ? `${150 + i * 60}ms` : '0ms' }}>
              {link.label}
            </button>
          ))}
          <Link href="/teklif-al" onClick={() => setMobileOpen(false)}
            className="mt-6 inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-body text-sm font-semibold tracking-wider uppercase bg-gradient-to-r from-accent to-accent2 text-bg transition-all duration-500"
            style={{ opacity: mobileOpen ? 1 : 0, transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)', transitionDelay: mobileOpen ? '700ms' : '0ms' }}>
            Teklif Al
          </Link>
        </div>
      </div>
    </>
  );
}
