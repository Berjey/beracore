'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services } from '@/lib/services-data';
import { createSubScene, type SubShapeAPI } from '@/lib/sub-shapes';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  serviceKey: string;
  subSlug: string;
}

export default function ServicePage({ serviceKey, subSlug }: Props) {
  const router = useRouter();
  const service = services.find(s => s.key === serviceKey);
  const initialIndex = service?.subServices.findIndex(ss => ss.slug === subSlug) ?? 0;
  const [subIndex, setSubIndex] = useState(initialIndex);
  const [subChanging, setSubChanging] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [shapeClicked, setShapeClicked] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);
  const gsapCtx = useRef<gsap.Context | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeRef = useRef<SubShapeAPI | null>(null);

  const sub = service?.subServices[subIndex];

  // URL değiştiğinde (related service link) state'i senkronize et
  useEffect(() => {
    if (!service) return;
    const idx = service.subServices.findIndex(ss => ss.slug === subSlug);
    if (idx >= 0 && idx !== subIndex) {
      setSubIndex(idx);
      setOpenFaq(null);
    }
  }, [subSlug, service, subIndex]);

  // Init 3D wireframe shape (eski tarz: her alt hizmete özel şekil)
  useEffect(() => {
    const c = canvasRef.current;
    if (!c || shapeRef.current) return;
    const api = createSubScene(c);
    shapeRef.current = api;
    if (service && sub) api.setShape(sub.icon, service.color);
    return () => { api.dispose(); shapeRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Morph on sub change
  useEffect(() => {
    if (shapeRef.current && sub && service) {
      shapeRef.current.setShape(sub.icon, service.color);
    }
  }, [subIndex, sub, service]);

  // GSAP Scroll Animations — her section'a sinematik geçiş
  useEffect(() => {
    if (gsapCtx.current) gsapCtx.current.revert();

    const timer = setTimeout(() => {
      const container = detailRef.current;
      if (!container) return;

      gsapCtx.current = gsap.context(() => {
        // Stats kartları — aşağıdan yukarı stagger
        gsap.fromTo('[data-sp="stats"] > div > div', { y: 50, opacity: 0, scale: 0.95 }, {
          y: 0, opacity: 1, scale: 1, stagger: 0.1,
          scrollTrigger: { trigger: '[data-sp="stats"]', start: 'top 88%', end: 'top 42%', scrub: 0.15 },
        });

        // Overview — fade up
        gsap.fromTo('[data-sp="overview"] > div', { y: 60, opacity: 0 }, {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: '[data-sp="overview"]', start: 'top 80%', end: 'top 50%', scrub: 0.15 },
        });

        // Features — başlık + kartlar stagger
        gsap.fromTo('[data-sp="features"] .sp-head', { y: 40, opacity: 0 }, {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: '[data-sp="features"]', start: 'top 88%', end: 'top 42%', scrub: 0.15 },
        });
        gsap.fromTo('[data-sp="features"] .sp-card', { y: 40, opacity: 0, scale: 0.97 }, {
          y: 0, opacity: 1, scale: 1, stagger: 0.06,
          scrollTrigger: { trigger: '[data-sp="features"] .sp-card', start: 'top 92%', end: 'top 48%', scrub: 0.15 },
        });

        // Process — başlık + çizgi büyümesi + adımlar soldan
        gsap.fromTo('[data-sp="process"] .sp-head', { y: 40, opacity: 0 }, {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: '[data-sp="process"]', start: 'top 88%', end: 'top 42%', scrub: 0.15 },
        });
        gsap.fromTo('[data-sp="process"] .sp-line', { scaleY: 0 }, {
          scaleY: 1,
          scrollTrigger: { trigger: '[data-sp="process"]', start: 'top 55%', end: 'bottom 75%', scrub: 0.1 },
        });
        gsap.fromTo('[data-sp="process"] .sp-step', { x: -50, opacity: 0 }, {
          x: 0, opacity: 1, stagger: 0.12,
          scrollTrigger: { trigger: '[data-sp="process"] .sp-step', start: 'top 90%', end: 'top 45%', scrub: 0.15 },
        });

        // Benefits — başlık + kartlar sağdan
        gsap.fromTo('[data-sp="benefits"] .sp-head', { y: 40, opacity: 0 }, {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: '[data-sp="benefits"]', start: 'top 88%', end: 'top 42%', scrub: 0.15 },
        });
        gsap.fromTo('[data-sp="benefits"] .sp-card', { x: 40, opacity: 0 }, {
          x: 0, opacity: 1, stagger: 0.1,
          scrollTrigger: { trigger: '[data-sp="benefits"] .sp-card', start: 'top 92%', end: 'top 48%', scrub: 0.15 },
        });

        // FAQ — başlık + items stagger
        gsap.fromTo('[data-sp="faq"] .sp-head', { y: 40, opacity: 0 }, {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: '[data-sp="faq"]', start: 'top 88%', end: 'top 42%', scrub: 0.15 },
        });
        gsap.fromTo('[data-sp="faq"] .sp-item', { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.08,
          scrollTrigger: { trigger: '[data-sp="faq"] .sp-item', start: 'top 92%', end: 'top 48%', scrub: 0.15 },
        });

        // Related — kartlar scale up
        gsap.fromTo('[data-sp="related"] .sp-head', { y: 40, opacity: 0 }, {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: '[data-sp="related"]', start: 'top 88%', end: 'top 42%', scrub: 0.15 },
        });
        gsap.fromTo('[data-sp="related"] .sp-card', { y: 50, opacity: 0, scale: 0.95 }, {
          y: 0, opacity: 1, scale: 1, stagger: 0.08,
          scrollTrigger: { trigger: '[data-sp="related"] .sp-card', start: 'top 92%', end: 'top 48%', scrub: 0.15 },
        });

        // CTA — scale from center
        gsap.fromTo('[data-sp="cta"] > div', { y: 50, opacity: 0, scale: 0.96 }, {
          y: 0, opacity: 1, scale: 1,
          scrollTrigger: { trigger: '[data-sp="cta"]', start: 'top 88%', end: 'top 42%', scrub: 0.15 },
        });
      }, container);
    }, 800);

    return () => {
      clearTimeout(timer);
      if (gsapCtx.current) gsapCtx.current.revert();
    };
  }, [subIndex]);

  const goTo = useCallback((index: number) => {
    if (!service) return;
    const newIdx = (index + service.subServices.length) % service.subServices.length;
    if (newIdx === subIndex) return;
    setSubChanging(true);
    setSubIndex(newIdx);
    setOpenFaq(null);
    setShapeClicked(false);
    router.replace(`/hizmetler/${service.key}/${service.subServices[newIdx].slug}`, { scroll: false });
    setTimeout(() => setSubChanging(false), 80);
  }, [service, subIndex, router]);

  // Sinematik şekil tıklama → detaya scroll
  const handleShapeClick = useCallback(() => {
    if (shapeClicked) return;
    setShapeClicked(true);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => setShapeClicked(false), 1000);
    }, 700);
  }, [shapeClicked]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(subIndex + 1);
      if (e.key === 'ArrowLeft') goTo(subIndex - 1);
      if (e.key === 'Enter') handleShapeClick();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [goTo, subIndex, handleShapeClick]);

  if (!service || !sub) return null;

  const otherSubs = service.subServices.filter((_, i) => i !== subIndex);
  const toggleFaq = (i: number) => setOpenFaq(prev => prev === i ? null : i);

  return (
    <article>

      {/* ===== HERO: Shape + Navigation ===== */}
      <section className="min-h-[92vh] flex flex-col items-center justify-center px-6 pt-28 pb-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(255,169,249,0.06) 0%, rgba(255,247,173,0.02) 30%, transparent 65%)' }} />

        {/* Geri butonu */}
        <Link
          href="/#services"
          className="group inline-flex items-center gap-2.5 mb-8 px-6 py-2.5 rounded-xl font-body text-[0.78rem] font-medium
            border border-white/[0.08] text-t1 transition-all duration-400
            hover:border-accent/30 hover:text-accent hover:-translate-x-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            className="transition-transform duration-300 group-hover:-translate-x-0.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Tüm Hizmetler
        </Link>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 font-body text-[0.8rem] text-t2">
            <li><Link href="/" className="hover:text-accent transition-colors duration-300">Ana Sayfa</Link></li>
            <li className="opacity-40">/</li>
            <li><Link href="/#services" className="hover:text-accent transition-colors duration-300">{service.title}</Link></li>
            <li className="opacity-40">/</li>
            <li><span className="text-accent">{sub.title}</span></li>
          </ol>
        </nav>

        {/* Category */}
        <span className="font-body text-[0.72rem] font-semibold tracking-[0.5em] uppercase text-accent2/50 mb-2">
          {service.title}
        </span>

        {/* Shape + Arrows */}
        <div className="flex items-center justify-center gap-10 max-md:gap-3">
          {/* Left arrow */}
          <button
            onClick={() => goTo(subIndex - 1)}
            className="group relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden shrink-0
              border border-accent/20 hover:border-accent/50 hover:scale-110 active:scale-95
              max-md:w-11 max-md:h-11"
            style={{ transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            aria-label="Önceki alt hizmet"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-accent2/[0.04] to-transparent group-hover:from-accent/[0.15] transition-all duration-500" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5">
              <defs><linearGradient id="saL" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ffa9f9" /><stop offset="100%" stopColor="#fff7ad" /></linearGradient></defs>
              <path d="M15 6l-6 6 6 6" stroke="url(#saL)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity" />
            </svg>
          </button>

          {/* 3D Shape — sinematik tıklama */}
          <div
            className="relative flex items-center justify-center cursor-pointer"
            onClick={handleShapeClick}
          >
            {/* Glow flash on click */}
            <div className="absolute rounded-full -z-10 transition-all duration-700"
              style={{
                width: shapeClicked ? '350px' : '200px',
                height: shapeClicked ? '350px' : '200px',
                background: `radial-gradient(circle, rgba(255,169,249,${shapeClicked ? '0.2' : '0.04'}) 0%, rgba(255,247,173,${shapeClicked ? '0.1' : '0.02'}) 40%, transparent 70%)`,
                filter: `blur(${shapeClicked ? '40px' : '50px'})`,
              }} />
            <canvas
              ref={canvasRef}
              className="relative w-[480px] h-[480px] max-md:w-[300px] max-md:h-[300px]"
              style={{
                transform: shapeClicked ? 'scale(1.1)' : 'scale(1)',
                filter: shapeClicked ? 'brightness(1.25)' : 'brightness(1)',
                transitionProperty: 'transform, filter',
                transitionDuration: '0.7s',
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
            {/* Hint */}
            {!shapeClicked && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-pulse">
                <span className="text-[0.6rem] font-body text-t3/60 tracking-wider uppercase">Detay için tıkla</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent/40">
                  <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => goTo(subIndex + 1)}
            className="group relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden shrink-0
              border border-accent/20 hover:border-accent/50 hover:scale-110 active:scale-95
              max-md:w-11 max-md:h-11"
            style={{ transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            aria-label="Sonraki alt hizmet"
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-accent/[0.08] via-accent2/[0.04] to-transparent group-hover:from-accent/[0.15] transition-all duration-500" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">
              <defs><linearGradient id="saR" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ffa9f9" /><stop offset="100%" stopColor="#fff7ad" /></linearGradient></defs>
              <path d="M9 6l6 6-6 6" stroke="url(#saR)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity" />
            </svg>
          </button>
        </div>

        {/* Title button */}
        <div className="text-center mb-3 -mt-2">
          <button
            onClick={handleShapeClick}
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-body text-[clamp(1rem,2.2vw,1.25rem)] font-bold tracking-wide overflow-hidden
              border border-accent/25 transition-all duration-500
              hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_8px_32px_rgba(255,169,249,0.2)]
              max-md:px-7 max-md:py-3"
            style={{ background: 'linear-gradient(135deg, rgba(255,169,249,0.1), rgba(255,247,173,0.06))' }}
          >
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: 'linear-gradient(135deg, #ffa9f9, #fff7ad)', boxShadow: '0 0 14px rgba(255,169,249,0.6)' }} />
            <span className="gradient-text">{sub.title}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffa9f9" strokeWidth="2" strokeLinecap="round"
              className="opacity-50 group-hover:opacity-100 transition-opacity">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </button>
        </div>

        {/* Description */}
        <p className="text-center font-body text-[clamp(0.95rem,1.8vw,1.15rem)] text-t2 font-light tracking-wide max-w-2xl mb-8"
          style={{ opacity: subChanging ? 0 : 1, transitionProperty: 'opacity', transitionDuration: '0.3s' }}>
          {sub.description}
        </p>

        {/* Dots */}
        <div className="flex justify-center gap-3 mb-6">
          {service.subServices.map((ss, i) => (
            <button
              key={ss.slug}
              onClick={() => goTo(i)}
              className="transition-all duration-400"
              style={{
                width: i === subIndex ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === subIndex ? 'linear-gradient(90deg, #ffa9f9, #fff7ad)' : 'rgba(255,255,255,0.08)',
                boxShadow: i === subIndex ? '0 0 12px rgba(255,169,249,0.3)' : 'none',
              }}
              aria-label={ss.title}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-30">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffa9f9" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ===== DETAIL CONTENT ===== */}
      <div ref={detailRef} className="scroll-mt-8" style={{
        opacity: subChanging ? 0 : 1,
        transitionProperty: 'opacity',
        transitionDuration: '0.25s',
      }}>

        {/* Section divider */}
        <div className="flex justify-center py-4">
          <div className="w-full max-w-md h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), var(--color-accent2), transparent)' }} />
        </div>

        {/* ===== STATS ===== */}
        <section data-sp="stats" className="py-20 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {sub.stats.map((stat, i) => (
              <div key={i} className="relative text-center p-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden group hover:border-accent/15 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="font-body text-[clamp(2.2rem,5vw,3.5rem)] font-bold gradient-text mb-2 leading-none">{stat.value}</div>
                  <div className="font-body text-[0.82rem] text-t3 tracking-wide font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== OVERVIEW ===== */}
        <section data-sp="overview" className="py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-accent/40" />
              <span className="font-body text-[0.7rem] font-semibold tracking-[0.4em] uppercase text-accent/60">Detaylı Bakış</span>
              <div className="w-8 h-px bg-accent/40" />
            </div>
            <h2 className="font-body text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold mb-10">
              <span className="gradient-text">{sub.title}</span>
              <span className="text-t1"> Hizmetleri</span>
            </h2>
            <p className="font-body text-[clamp(1.05rem,2vw,1.2rem)] text-t2 font-light leading-[1.9]">
              {sub.longDescription}
            </p>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section data-sp="features" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="sp-head text-center mb-14">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-8 h-px bg-accent2/40" />
                <span className="font-body text-[0.7rem] font-semibold tracking-[0.4em] uppercase text-accent2/60">Yetenekler</span>
                <div className="w-8 h-px bg-accent2/40" />
              </div>
              <h2 className="font-body text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold">
                <span className="gradient-text">Özellikler & Kapsamı</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sub.features.map((feat, i) => (
                <div key={feat}
                  className="sp-card group relative p-7 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden
                    hover:border-accent/20 transition-all duration-500 hover:-translate-y-0.5">
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-accent2/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center gap-4">
                    <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: i % 2 === 0 ? 'rgba(255,169,249,0.08)' : 'rgba(255,247,173,0.08)' }}>
                      <div className="w-2 h-2 rounded-full"
                        style={{ background: i % 2 === 0 ? '#ffa9f9' : '#fff7ad', boxShadow: `0 0 8px ${i % 2 === 0 ? 'rgba(255,169,249,0.4)' : 'rgba(255,247,173,0.4)'}` }} />
                    </div>
                    <span className="font-body text-[0.95rem] text-t1 font-medium">{feat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PROCESS ===== */}
        <section data-sp="process" className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="sp-head text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-8 h-px bg-accent/40" />
                <span className="font-body text-[0.7rem] font-semibold tracking-[0.4em] uppercase text-accent/60">Süreç</span>
                <div className="w-8 h-px bg-accent/40" />
              </div>
              <h2 className="font-body text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold">
                <span className="gradient-text">Çalışma Sürecimiz</span>
              </h2>
            </div>
            <div className="relative">
              {/* Connecting gradient line */}
              <div className="sp-line absolute left-7 top-7 bottom-7 w-px max-md:left-6 origin-top"
                style={{ background: 'linear-gradient(to bottom, var(--color-accent), var(--color-accent2), transparent)' }} />
              <div className="space-y-10">
                {sub.process.map((step, i) => (
                  <div key={step} className="sp-step flex items-start gap-7 group relative">
                    <div className="shrink-0 w-14 h-14 rounded-2xl border border-accent/25 bg-bg flex items-center justify-center z-10
                      group-hover:border-accent/60 group-hover:shadow-[0_0_20px_rgba(255,169,249,0.1)] transition-all duration-500
                      max-md:w-12 max-md:h-12">
                      <span className="font-body text-lg font-bold gradient-text">{i + 1}</span>
                    </div>
                    <div className="pt-3 pb-1">
                      <p className="font-body text-[1.08rem] text-t1 font-light leading-relaxed group-hover:text-t1 transition-colors">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== BENEFITS ===== */}
        <section data-sp="benefits" className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="sp-head text-center mb-14">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-8 h-px bg-accent2/40" />
                <span className="font-body text-[0.7rem] font-semibold tracking-[0.4em] uppercase text-accent2/60">Avantajlar</span>
                <div className="w-8 h-px bg-accent2/40" />
              </div>
              <h2 className="font-body text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold">
                <span className="gradient-text">Neden BERACORE?</span>
              </h2>
            </div>
            <div className="space-y-5">
              {sub.benefits.map((benefit, i) => (
                <div key={benefit} className="sp-card group relative flex items-start gap-5 p-7 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden
                  hover:border-accent/15 transition-all duration-500">
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                    style={{ background: `linear-gradient(to bottom, ${i % 2 === 0 ? '#ffa9f9' : '#fff7ad'}, transparent)` }} />
                  <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mt-0.5"
                    style={{ background: i % 2 === 0 ? 'rgba(255,169,249,0.08)' : 'rgba(255,247,173,0.08)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5L20 7" stroke={i % 2 === 0 ? '#ffa9f9' : '#fff7ad'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="font-body text-[1.08rem] text-t1 font-light leading-relaxed pt-2.5">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section divider */}
        <div className="flex justify-center py-4">
          <div className="w-full max-w-xs h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), var(--color-accent2), transparent)' }} />
        </div>

        {/* ===== FAQ ===== */}
        <section data-sp="faq" className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="sp-head text-center mb-14">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-8 h-px bg-accent/40" />
                <span className="font-body text-[0.7rem] font-semibold tracking-[0.4em] uppercase text-accent/60">SSS</span>
                <div className="w-8 h-px bg-accent/40" />
              </div>
              <h2 className="font-body text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold">
                <span className="gradient-text">Sıkça Sorulan Sorular</span>
              </h2>
            </div>
            <div className="space-y-4">
              {sub.faq.map((item, i) => (
                <div key={i}
                  className="sp-item relative border rounded-2xl overflow-hidden transition-all duration-400"
                  style={{
                    borderColor: openFaq === i ? 'rgba(255,169,249,0.2)' : 'rgba(255,255,255,0.06)',
                    background: openFaq === i ? 'rgba(255,169,249,0.02)' : 'rgba(255,255,255,0.01)',
                  }}>
                  {/* Active accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full transition-opacity duration-400"
                    style={{ background: 'linear-gradient(to bottom, #ffa9f9, #fff7ad)', opacity: openFaq === i ? 1 : 0 }} />
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full flex items-center justify-between p-7 text-left font-body transition-colors duration-300"
                    aria-expanded={openFaq === i}
                  >
                    <span className="text-[1.02rem] font-medium pr-4" style={{ color: openFaq === i ? 'var(--color-accent)' : 'var(--color-t1)' }}>
                      {item.question}
                    </span>
                    <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-400"
                      style={{ background: openFaq === i ? 'rgba(255,169,249,0.1)' : 'transparent' }}>
                      <svg
                        className="w-4 h-4 transition-transform duration-400"
                        style={{ color: openFaq === i ? '#ffa9f9' : 'var(--color-t3)', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)' }}
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </button>
                  <div className="overflow-hidden transition-all duration-500"
                    style={{ maxHeight: openFaq === i ? '300px' : '0', opacity: openFaq === i ? 1 : 0 }}>
                    <p className="px-7 pb-7 font-body text-[0.98rem] text-t2 font-light leading-[1.85]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== RELATED — Aynı Kategori ===== */}
        {otherSubs.length > 0 && (
          <section data-sp="related" className="py-24 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="sp-head text-center mb-14">
                <div className="inline-flex items-center gap-2 mb-6">
                  <div className="w-8 h-px bg-accent2/40" />
                  <span className="font-body text-[0.7rem] font-semibold tracking-[0.4em] uppercase text-accent2/60">Keşfet</span>
                  <div className="w-8 h-px bg-accent2/40" />
                </div>
                <h2 className="font-body text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold">
                  <span className="gradient-text">Diğer {service.title} Hizmetlerimiz</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {otherSubs.map((other, i) => (
                  <Link
                    key={other.slug}
                    href={`/hizmetler/${service.key}/${other.slug}`}
                    className="sp-card group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden
                      hover:border-accent/20 transition-all duration-500 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-accent2/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-2 h-2 rounded-full"
                          style={{ background: i % 2 === 0 ? '#ffa9f9' : '#fff7ad', boxShadow: `0 0 6px ${i % 2 === 0 ? 'rgba(255,169,249,0.4)' : 'rgba(255,247,173,0.4)'}` }} />
                        <h3 className="font-body text-[1.05rem] font-semibold text-t1 group-hover:text-accent transition-colors duration-300">
                          {other.title}
                        </h3>
                      </div>
                      <p className="font-body text-[0.85rem] text-t3 font-light leading-relaxed line-clamp-2 mb-5">
                        {other.description}
                      </p>
                      <span className="inline-flex items-center gap-1.5 font-body text-[0.75rem] font-semibold tracking-wider uppercase text-accent/50 group-hover:text-accent transition-all duration-300 group-hover:gap-2.5">
                        Detaylı Bilgi
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}


        {/* ===== CTA ===== */}
        <section data-sp="cta" className="py-28 px-6 text-center relative">
          <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(255,169,249,0.05) 0%, rgba(255,247,173,0.02) 30%, transparent 65%)' }} />
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-accent/40" />
              <span className="font-body text-[0.7rem] font-semibold tracking-[0.4em] uppercase text-accent/60">İletişim</span>
              <div className="w-8 h-px bg-accent/40" />
            </div>
            <h2 className="font-body text-[clamp(1.8rem,4vw,2.8rem)] font-semibold mb-6">
              <span className="gradient-text">Projenizi Hayata Geçirelim</span>
            </h2>
            <p className="font-body text-[1.1rem] text-t2 font-light mb-12 leading-relaxed">
              {sub.title} ihtiyaçlarınız için uzman ekibimizle tanışın.
            </p>
            <a href="mailto:info@beracore.com"
              className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-body text-[0.9rem] font-semibold tracking-wider uppercase overflow-hidden
                bg-gradient-to-r from-accent to-accent2 text-bg transition-all duration-500
                hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(255,169,249,0.3)] hover:scale-[1.02]">
              <span className="relative z-10 flex items-center gap-3">
                Ücretsiz Teklif Al
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </span>
            </a>
            <p className="mt-8 font-body text-[0.82rem] text-t3">
              veya <a href="tel:+908503026950" className="text-accent hover:text-accent2 transition-colors duration-300 font-medium">0850 302 69 50</a> numarasından bizi arayın
            </p>
          </div>
        </section>

      </div>
    </article>
  );
}
