'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services } from '@/lib/services-data';
import { createSubScene, type SubShapeAPI } from '@/lib/sub-shapes';
import ScrollText from '@/components/ScrollText';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  serviceKey: string;
  subSlug: string;
}

export default function ServicePage({ serviceKey, subSlug }: Props) {
  const service = services.find(s => s.key === serviceKey);
  const initialIndex = service?.subServices.findIndex(ss => ss.slug === subSlug) ?? 0;
  const [subIndex, setSubIndex] = useState(initialIndex);
  const [subChanging, setSubChanging] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [shapeClicked, setShapeClicked] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const gsapCtx = useRef<gsap.Context | null>(null);
  const transitionLock = useRef(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeRef = useRef<SubShapeAPI | null>(null);
  const lastSubIconRef = useRef<string | null>(null);
  // Sadece DIŞ subSlug değişimlerini (tarayıcı geri/ileri, doğrudan URL) state'e aktarmak için.
  // İç goTo() → setSubIndex + router.replace döngüsünde geri-resetleme yarışını engeller.
  const prevSubSlugRef = useRef<string>(subSlug);

  const sub = service?.subServices[subIndex];

  // URL değiştiğinde state senkronize et — SADECE dış kaynaklı subSlug değişimleri için.
  // İç (goTo → router.replace) tetiklenmiş değişimler prevSubSlugRef eşleşince no-op olur.
  useEffect(() => {
    if (!service) return;
    if (prevSubSlugRef.current === subSlug) return;  // iç değişim veya ilk mount
    prevSubSlugRef.current = subSlug;
    const idx = service.subServices.findIndex(ss => ss.slug === subSlug);
    if (idx >= 0) {
      setSubIndex(idx);
      setOpenFaq(null);
    }
  }, [subSlug, service]);

  // Init 3D wireframe shape (Strict Mode güvenli: fake unmount'ta dispose etmez)
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    // Strict Mode re-mount — mevcut API'yi koru, yeniden init etme
    if (shapeRef.current) return;

    const api = createSubScene(c);
    shapeRef.current = api;
    if (service && sub) {
      api.setShape(sub.icon, service.color);
      lastSubIconRef.current = sub.icon;
    }

    return () => {
      // Strict Mode cleanup DOM'u sökmez — canvas hâlâ bağlıysa dispose'u atla.
      // Sadece gerçek unmount'ta (route değişimi, canvas DOM'dan çıktı) dispose et.
      queueMicrotask(() => {
        if (!c.isConnected) {
          api.dispose();
          if (shapeRef.current === api) {
            shapeRef.current = null;
            lastSubIconRef.current = null;
          }
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Morph on sub change — aynı ikon için self-morph'u engelle
  useEffect(() => {
    if (!shapeRef.current || !sub || !service) return;
    if (lastSubIconRef.current === sub.icon) return;
    lastSubIconRef.current = sub.icon;
    shapeRef.current.setShape(sub.icon, service.color);
  }, [subIndex, sub, service]);

  // ======================================================
  // HERO intro timeline (sadece mount'ta, sub değişiminde değil)
  // ======================================================
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    let ctx: gsap.Context | null = null;

    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.05 });
        tl
          .fromTo('.sp-hero-back', { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' })
          .fromTo('.sp-hero-breadcrumb', { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.25')
          .fromTo('.sp-hero-category', { y: 16, opacity: 0, letterSpacing: '0.6em' },
            { y: 0, opacity: 1, letterSpacing: '0.42em', duration: 0.5, ease: 'power3.out' }, '-=0.2')
          .fromTo('.sp-shape-wrap', { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3')
          .fromTo('.sp-hero-arrow', { opacity: 0, x: (i) => i === 0 ? -20 : 20 },
            { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, '-=0.4')
          .fromTo('.sp-hero-title', { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
          .fromTo('.sp-hero-desc', { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.35')
          .fromTo('.sp-hero-dots', { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.3');

        // Orbital halkalar
        gsap.to('.sp-orbit-1', { rotation: 360, duration: 80, repeat: -1, ease: 'none' });
        gsap.to('.sp-orbit-2', { rotation: -360, duration: 110, repeat: -1, ease: 'none' });
        gsap.to('.sp-orbit-3', { rotation: 360, duration: 150, repeat: -1, ease: 'none' });
        gsap.to('.sp-orb', {
          y: '+=20', duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut',
          stagger: { each: 0.4, from: 'random' },
        });
        gsap.to('.sp-core', {
          scale: 1.55, opacity: 0.7, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut',
        });

        // Scroll-driven hero exit
        gsap.to('.sp-hero-content', {
          y: -60, scale: 0.95, opacity: 0, filter: 'blur(4px)',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 40%', scrub: 0.5 },
        });
        gsap.to('.sp-hero-orbits', {
          scale: 1.4, opacity: 0.35,
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 },
        });
        hero.querySelectorAll<HTMLElement>('.sp-orb').forEach((orb, i) => {
          const speed = 1.0 + (i % 4) * 0.4;
          gsap.to(orb, {
            y: -500 * speed, opacity: 0,
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.3 },
          });
        });
      }, hero);
    }, 150);

    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  // ======================================================
  // DETAIL scroll animations (sub değişiminde yenilenir)
  // ======================================================
  useEffect(() => {
    if (gsapCtx.current) gsapCtx.current.revert();

    const timer = setTimeout(() => {
      const container = detailRef.current;
      if (!container) return;

      gsapCtx.current = gsap.context(() => {
        // STATS — başlık + kart girişi
        gsap.fromTo('[data-sp="stats"] .sp-head', { y: 40, opacity: 0 }, {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: '[data-sp="stats"]', start: 'top 88%', end: 'top 42%', scrub: 0.3 },
        });
        gsap.fromTo('[data-sp="stats"] .sp-stat', { y: 50, opacity: 0, scale: 0.95 }, {
          y: 0, opacity: 1, scale: 1, stagger: 0.1,
          scrollTrigger: { trigger: '[data-sp="stats"]', start: 'top 88%', end: 'top 42%', scrub: 0.3 },
        });

        // OVERVIEW — sıralı stagger girişi (overline → title → mark → body → footer)
        gsap.fromTo(
          '[data-sp="overview"] .sp-ov-over, [data-sp="overview"] .sp-ov-title, [data-sp="overview"] .sp-ov-mark, [data-sp="overview"] .sp-ov-body, [data-sp="overview"] .sp-ov-footer',
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.06,
            scrollTrigger: { trigger: '[data-sp="overview"]', start: 'top 88%', end: 'top 42%', scrub: 0.3 },
          });

        // FEATURES — başlık + 3D kart girişi
        gsap.fromTo('[data-sp="features"] .sp-head', { y: 40, opacity: 0 }, {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: '[data-sp="features"]', start: 'top 88%', end: 'top 42%', scrub: 0.3 },
        });
        container.querySelectorAll<HTMLElement>('[data-sp="features"] .sp-card').forEach((card, i) => {
          const isEven = i % 2 === 0;
          gsap.fromTo(card,
            { opacity: 0, y: 50, scale: 0.94, rotationX: -10, rotationY: isEven ? -6 : 6 },
            {
              opacity: 1, y: 0, scale: 1, rotationX: 0, rotationY: 0, ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 92%', end: 'top 55%', scrub: 0.5 },
            });
        });

        // PROCESS
        gsap.fromTo('[data-sp="process"] .sp-head', { y: 40, opacity: 0 }, {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: '[data-sp="process"]', start: 'top 88%', end: 'top 42%', scrub: 0.3 },
        });
        gsap.fromTo('[data-sp="process"] .sp-line', { scaleY: 0 }, {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: '[data-sp="process"]', start: 'top 70%', end: 'bottom 60%', scrub: 0.3 },
        });
        container.querySelectorAll<HTMLElement>('[data-sp="process"] .sp-step').forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, x: 40, y: 20 },
            {
              opacity: 1, x: 0, y: 0, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 55%', scrub: 0.5 },
            });
        });
        container.querySelectorAll<HTMLElement>('[data-sp="process"] .sp-step-dot').forEach((el) => {
          gsap.fromTo(el,
            { scale: 0 },
            {
              scale: 1, ease: 'back.out(2)',
              scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 55%', scrub: 0.3 },
            });
        });

        // BENEFITS
        gsap.fromTo('[data-sp="benefits"] .sp-head', { y: 40, opacity: 0 }, {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: '[data-sp="benefits"]', start: 'top 88%', end: 'top 42%', scrub: 0.3 },
        });
        container.querySelectorAll<HTMLElement>('[data-sp="benefits"] .sp-card').forEach((card, i) => {
          const isLeft = i % 2 === 0;
          gsap.fromTo(card,
            { opacity: 0, y: 40, x: isLeft ? -30 : 30, rotationX: -8 },
            {
              opacity: 1, y: 0, x: 0, rotationX: 0, ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 90%', end: 'top 55%', scrub: 0.5 },
            });
        });

        // FAQ
        gsap.fromTo('[data-sp="faq"] .sp-head', { y: 40, opacity: 0 }, {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: '[data-sp="faq"]', start: 'top 88%', end: 'top 42%', scrub: 0.3 },
        });
        gsap.fromTo('[data-sp="faq"] .sp-item', { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.08,
          scrollTrigger: { trigger: '[data-sp="faq"] .sp-item', start: 'top 92%', end: 'top 48%', scrub: 0.3 },
        });

        // RELATED
        gsap.fromTo('[data-sp="related"] .sp-head', { y: 40, opacity: 0 }, {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: '[data-sp="related"]', start: 'top 88%', end: 'top 42%', scrub: 0.3 },
        });
        container.querySelectorAll<HTMLElement>('[data-sp="related"] .sp-card').forEach((card, i) => {
          gsap.fromTo(card,
            { opacity: 0, y: 50, scale: 0.95, rotationY: i === 0 ? -6 : i === 2 ? 6 : 0 },
            {
              opacity: 1, y: 0, scale: 1, rotationY: 0, ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 92%', end: 'top 50%', scrub: 0.5 },
            });
        });

        // CTA
        gsap.fromTo('[data-sp="cta"] > div', { y: 50, opacity: 0, scale: 0.96 }, {
          y: 0, opacity: 1, scale: 1,
          scrollTrigger: { trigger: '[data-sp="cta"]', start: 'top 88%', end: 'top 42%', scrub: 0.3 },
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, container);
    }, 150);

    return () => {
      clearTimeout(timer);
      if (gsapCtx.current) gsapCtx.current.revert();
    };
  }, [subIndex]);

  // ======================================================
  // Hover tilt — kartlar için
  // ======================================================
  const handleTilt = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -6;
    const ry = ((x / rect.width) - 0.5) * 8;
    gsap.to(card, { rotationX: rx, rotationY: ry, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  };
  const handleTiltLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
  };

  // Alt hizmetler arası sinematik geçiş — tek timeline, iç içe rAF yok.
  // Absolute zaman pozisyonları: exit (0→0.35) → swap (0.4) → enter (0.5→1.05).
  const goTo = useCallback((index: number) => {
    if (!service || transitionLock.current) return;
    const len = service.subServices.length;
    const newIdx = (index + len) % len;
    if (newIdx === subIndex) return;

    transitionLock.current = true;
    setSubChanging(true);

    // Yön — wrap-around'da kısa yolu seç
    const rawDiff = newIdx - subIndex;
    const dir = Math.abs(rawDiff) > len / 2 ? -Math.sign(rawDiff) : Math.sign(rawDiff);
    const slide = 36;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        // Inline transform'ları temizle — idle ve hover'a engel olmasın
        gsap.set(['.sp-hero-category', '.sp-hero-title', '.sp-hero-desc', '.sp-hero-dots button'],
          { clearProps: 'transform,opacity' });
        setSubChanging(false);
        transitionLock.current = false;
      },
    });

    // ---- EXIT (0 → 0.30s) ----
    tl.to('.sp-hero-category', { opacity: 0, y: -8, duration: 0.22, ease: 'power2.in' }, 0)
      .to('.sp-hero-title',    { opacity: 0, y: -10, x: dir * slide, duration: 0.28, ease: 'power2.in' }, 0)
      .to('.sp-hero-desc',     { opacity: 0, y: -8, duration: 0.25, ease: 'power2.in' }, 0.03);

    // ---- SWAP (0.32s) — state + URL (Next.js navigation YOK) + shape anında değişir ----
    tl.call(() => {
      const newSlug = service.subServices[newIdx].slug;
      const newUrl = `/hizmetler/${service.key}/${newSlug}`;
      // history.replaceState — URL çubuğunu günceller ama Next.js'i tetiklemez.
      // Dolayısıyla ServicePage unmount/remount olmaz, canvas ve Three.js sahnesi
      // aynı instance'ta kalır. router.replace() sub-route değişiminde sayfayı
      // baştan mount ettiği için flicker yaratıyordu.
      if (typeof window !== 'undefined') {
        window.history.replaceState(window.history.state, '', newUrl);
      }
      prevSubSlugRef.current = newSlug;
      setSubIndex(newIdx);
      setOpenFaq(null);
      setShapeClicked(false);
    }, [], 0.32);

    // ---- ENTER (0.42 → 0.92s) — yeni içerik zıt yönden gelir ----
    tl.fromTo('.sp-hero-category',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out' }, 0.45)
      .fromTo('.sp-hero-title',
        { opacity: 0, x: -dir * slide, y: 10 },
        { opacity: 1, x: 0, y: 0, duration: 0.48, ease: 'power3.out' }, 0.45)
      .fromTo('.sp-hero-desc',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.42, ease: 'power3.out' }, 0.52)
      .fromTo('.sp-hero-dots button',
        { scale: 0.8, opacity: 0.6 },
        { scale: 1, opacity: 1, duration: 0.3, stagger: 0.03, ease: 'power2.out' }, 0.58);
  }, [service, subIndex]);

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

      {/* ================================================
          HERO — sinematik şekil + orbital dekor + intro
          ================================================ */}
      <section ref={heroRef} className="sp-hero-section relative min-h-[92vh] flex flex-col items-center justify-center px-6 pt-28 pb-12 overflow-hidden">
        {/* Ambient glow */}
        <div className="sp-hero-ambient pointer-events-none absolute inset-0 -z-30"
          style={{
            background:
              'radial-gradient(900px 500px at 50% 35%, rgba(255,169,249,0.08), transparent 60%), radial-gradient(700px 400px at 70% 70%, rgba(255,247,173,0.05), transparent 60%)',
          }} />

        {/* Orbital rings */}
        <div className="sp-hero-orbits pointer-events-none absolute inset-0 -z-20 flex items-center justify-center">
          <div className="sp-core absolute rounded-full"
            style={{
              width: 6, height: 6,
              background: 'radial-gradient(circle, #ffffff 0%, #ffa9f9 50%, transparent 80%)',
              boxShadow: '0 0 20px rgba(255,169,249,0.8), 0 0 50px rgba(255,247,173,0.4)',
              opacity: 0.6,
            }} aria-hidden="true" />

          <div className="sp-orbit-1 absolute max-md:!w-[360px] max-md:!h-[360px]" style={{ width: 520, height: 520 }}>
            <div className="w-full h-full rounded-full" style={{ border: '1px solid rgba(255,247,173,0.12)' }} />
            {[0, 120, 240].map((angle) => (
              <div key={angle} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }} aria-hidden="true">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                  style={{ background: '#fff7ad', boxShadow: '0 0 10px #fff7ad, 0 0 20px rgba(255,247,173,0.6)' }} />
              </div>
            ))}
          </div>

          <div className="sp-orbit-2 absolute max-md:!w-[520px] max-md:!h-[520px]" style={{ width: 740, height: 740 }}>
            <div className="w-full h-full rounded-full" style={{ border: '1px dashed rgba(255,169,249,0.1)' }} />
            {[60, 180, 300].map((angle) => (
              <div key={angle} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }} aria-hidden="true">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ background: '#ffa9f9', boxShadow: '0 0 8px #ffa9f9, 0 0 18px rgba(255,169,249,0.6)' }} />
              </div>
            ))}
          </div>

          <div className="sp-orbit-3 absolute max-md:!w-[720px] max-md:!h-[720px]" style={{ width: 980, height: 980 }}>
            <div className="w-full h-full rounded-full"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, rgba(255,169,249,0.16) 45deg, transparent 90deg, transparent 270deg, rgba(255,247,173,0.12) 315deg, transparent 360deg)',
                WebkitMask:
                  'radial-gradient(circle, transparent 99%, #000 100%), radial-gradient(circle, #000 99.5%, transparent 100%)',
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
                padding: '1px',
              }} />
          </div>
        </div>

        {/* Floating orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {[
            { t: '14%', l: '10%', s: 1.5, c: '#ffa9f9', o: 0.55, b: 8 },
            { t: '22%', l: '86%', s: 2,   c: '#fff7ad', o: 0.6, b: 10 },
            { t: '36%', l: '8%',  s: 1,   c: '#ffa9f9', o: 0.5, b: 6 },
            { t: '48%', l: '92%', s: 1.5, c: '#fff7ad', o: 0.55, b: 10 },
            { t: '64%', l: '6%',  s: 2,   c: '#ffa9f9', o: 0.55, b: 12 },
            { t: '72%', l: '78%', s: 1.5, c: '#fff7ad', o: 0.55, b: 10 },
            { t: '82%', l: '32%', s: 1,   c: '#ffa9f9', o: 0.5, b: 6 },
            { t: '88%', l: '58%', s: 1.5, c: '#fff7ad', o: 0.5, b: 8 },
          ].map((orb, i) => (
            <span key={i} className="sp-orb absolute rounded-full"
              style={{
                top: orb.t, left: orb.l,
                width: `${orb.s * 4}px`, height: `${orb.s * 4}px`,
                background: orb.c,
                boxShadow: `0 0 ${orb.b}px ${orb.c}${Math.round(orb.o * 200).toString(16).padStart(2, '0').slice(-2)}`,
                opacity: orb.o,
              }}
              aria-hidden="true" />
          ))}
        </div>

        <div className="sp-hero-content relative flex flex-col items-center w-full">
          {/* Geri butonu */}
          <Link
            href="/#services"
            className="sp-hero-back group inline-flex items-center gap-2.5 mb-8 px-6 py-2.5 rounded-xl font-body text-[0.78rem] font-medium
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
          <nav aria-label="Breadcrumb" className="sp-hero-breadcrumb mb-6">
            <ol className="flex items-center gap-2 font-body text-[0.8rem] text-t2">
              <li><Link href="/" className="hover:text-accent transition-colors duration-300">Ana Sayfa</Link></li>
              <li className="opacity-40">/</li>
              <li><Link href="/#services" className="hover:text-accent transition-colors duration-300">{service.title}</Link></li>
              <li className="opacity-40">/</li>
              <li><span className="text-accent">{sub.title}</span></li>
            </ol>
          </nav>

          {/* Category */}
          <span className="sp-hero-category inline-block font-body text-[0.66rem] font-semibold tracking-[0.42em] uppercase text-accent2/60 mb-2">
            {service.title}
          </span>

          {/* Shape + Arrows */}
          <div className="flex items-center justify-center gap-10 max-md:gap-3">
            <button
              onClick={() => goTo(subIndex - 1)}
              className="sp-hero-arrow group relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden shrink-0
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

            <div
              className="sp-shape-wrap relative flex items-center justify-center cursor-pointer"
              onClick={handleShapeClick}
            >
              <div className="absolute rounded-full -z-10 transition-all duration-700"
                style={{
                  width: shapeClicked ? '350px' : '200px',
                  height: shapeClicked ? '350px' : '200px',
                  background: `radial-gradient(circle, rgba(255,169,249,${shapeClicked ? '0.2' : '0.04'}) 0%, rgba(255,247,173,${shapeClicked ? '0.1' : '0.02'}) 40%, transparent 70%)`,
                  filter: `blur(${shapeClicked ? '40px' : '50px'})`,
                }} />
              <canvas
                ref={canvasRef}
                className="relative w-[360px] h-[360px] max-md:w-[260px] max-md:h-[260px]"
                style={{
                  transform: shapeClicked ? 'scale(1.08)' : 'scale(1)',
                  filter: shapeClicked ? 'brightness(1.2)' : 'brightness(1)',
                  transitionProperty: 'transform, filter',
                  transitionDuration: '0.7s',
                  transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />
              {!shapeClicked && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-pulse">
                  <span className="text-[0.6rem] font-body text-t3/60 tracking-wider uppercase">Detay için tıkla</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent/40">
                    <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>

            <button
              onClick={() => goTo(subIndex + 1)}
              className="sp-hero-arrow group relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden shrink-0
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
          <div className="sp-hero-title text-center mb-3 -mt-2">
            <button
              onClick={handleShapeClick}
              className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-body text-[clamp(0.82rem,1.25vw,0.95rem)] font-semibold tracking-wide overflow-hidden
                border border-accent/25 transition-all duration-500
                hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_6px_22px_rgba(255,169,249,0.18)]
                max-md:px-5 max-md:py-2"
              style={{ background: 'linear-gradient(135deg, rgba(255,169,249,0.09), rgba(255,247,173,0.05))' }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'linear-gradient(135deg, #ffa9f9, #fff7ad)', boxShadow: '0 0 10px rgba(255,169,249,0.55)' }} />
              <span className="gradient-text">{sub.title}</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffa9f9" strokeWidth="2" strokeLinecap="round"
                className="opacity-50 group-hover:opacity-100 transition-opacity">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </button>
          </div>

          {/* Description — sabit yükseklik: alt hizmet geçişlerinde Y ofseti kaymasın */}
          <div className="w-full max-w-2xl min-h-[4.5rem] max-md:min-h-[5.5rem] mb-8 flex items-start justify-center">
            <p className="sp-hero-desc text-center font-body text-[clamp(0.88rem,1.4vw,1.02rem)] text-t2 font-light tracking-wide leading-relaxed">
              {sub.description}
            </p>
          </div>

          {/* Dots */}
          <div className="sp-hero-dots flex justify-center gap-3 mb-6">
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
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-30 pointer-events-none">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffa9f9" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ================================================
          DETAIL CONTENT
          ================================================ */}
      <div ref={detailRef} className="scroll-mt-8" style={{
        opacity: subChanging ? 0 : 1,
        transitionProperty: 'opacity',
        transitionDuration: '0.4s',
      }}>

        {/* Section divider */}
        <div className="flex justify-center py-4">
          <div className="w-full max-w-md h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), var(--color-accent2), transparent)' }} />
        </div>

        {/* ===== STATS ===== */}
        <section data-sp="stats" className="py-28 px-6 max-md:py-20">
          <div className="max-w-5xl mx-auto">
            {/* Section heading */}
            <div className="sp-head text-center mb-14 max-md:mb-10">
              <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
                Rakamlarla
              </span>
              <h2 className="font-body text-[clamp(1.8rem,3.8vw,2.6rem)] font-light tracking-tight leading-[1.2]">
                <ScrollText before="Somut " accent="sonuçlar." />
              </h2>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-md:gap-4" style={{ perspective: '1400px' }}>
              {sub.stats.map((stat, i) => {
                const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
                return (
                  <div key={i}
                    onMouseMove={handleTilt}
                    onMouseLeave={handleTiltLeave}
                    className="sp-stat group relative text-center px-6 py-10 max-md:px-4 max-md:py-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden transition-all duration-400 hover:border-white/[0.18] hover:bg-white/[0.035]"
                    style={{ '--accent': accent, transformStyle: 'preserve-3d' } as React.CSSProperties}>

                    {/* Top accent bar — daima görünür, hover'da genişler */}
                    <span aria-hidden="true"
                      className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-500"
                      style={{
                        width: '2.75rem',
                        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                        opacity: 0.55,
                      }} />
                    <span aria-hidden="true"
                      className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
                      style={{
                        width: '6rem',
                        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                        filter: `drop-shadow(0 0 6px ${accent}aa)`,
                      }} />

                    {/* Corner brackets — hover */}
                    {([
                      ['top-2.5 left-2.5', 'TL'],
                      ['top-2.5 right-2.5', 'TR'],
                      ['bottom-2.5 left-2.5', 'BL'],
                      ['bottom-2.5 right-2.5', 'BR'],
                    ] as const).map(([pos, key]) => (
                      <span key={key} aria-hidden="true"
                        className={`pointer-events-none absolute w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out ${pos}`}
                        style={{
                          ...(key.startsWith('T') && { borderTop: `1.5px solid ${accent}` }),
                          ...(key.startsWith('B') && { borderBottom: `1.5px solid ${accent}` }),
                          ...(key.endsWith('L') && { borderLeft: `1.5px solid ${accent}` }),
                          ...(key.endsWith('R') && { borderRight: `1.5px solid ${accent}` }),
                          [`border${key.startsWith('T') ? 'Top' : 'Bottom'}${key.endsWith('L') ? 'Left' : 'Right'}Radius`]: '6px',
                          filter: `drop-shadow(0 0 4px ${accent}88)`,
                        }} />
                    ))}

                    {/* Hover glow */}
                    <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ boxShadow: `0 0 0 1px ${accent} inset, 0 0 24px ${accent}44, 0 0 50px ${accent}1a` }}
                      aria-hidden="true" />
                    <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(260px circle at var(--mx) var(--my), ${accent}14, transparent 70%)` }}
                      aria-hidden="true" />

                    {/* Content */}
                    <div className="relative flex flex-col items-center">
                      {/* Value */}
                      <div className="font-body text-[clamp(1.9rem,4.2vw,2.9rem)] font-bold gradient-text leading-[1] tracking-[-0.02em]">
                        {stat.value}
                      </div>

                      {/* Divider — hover'da genişler */}
                      <span aria-hidden="true"
                        className="block h-px mt-4 mb-3.5 w-7 group-hover:w-14 transition-all duration-500"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`,
                        }} />

                      {/* Label — uppercase tracked */}
                      <div className="font-body text-[0.7rem] tracking-[0.2em] font-semibold uppercase text-t3 transition-colors duration-400 group-hover:text-[color:var(--accent)]">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== OVERVIEW ===== */}
        <section data-sp="overview" className="relative py-28 px-6 max-md:py-20 overflow-hidden">
          {/* Background — yumuşak glow + orbital halkalar */}
          <div className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center">
            <div className="absolute w-[800px] h-[800px] rounded-full max-md:w-[500px] max-md:h-[500px]"
              style={{
                background: 'radial-gradient(circle, rgba(255,169,249,0.045) 0%, rgba(255,247,173,0.02) 42%, transparent 72%)',
                filter: 'blur(50px)',
              }} />
            <div className="absolute w-[720px] h-[720px] rounded-full max-md:w-[460px] max-md:h-[460px]"
              style={{ border: '1px dashed rgba(255,169,249,0.07)' }} />
            <div className="absolute w-[560px] h-[560px] rounded-full max-md:w-[360px] max-md:h-[360px]"
              style={{ border: '1px solid rgba(255,247,173,0.05)' }} />
            {/* Floating dots */}
            {[
              { t: '18%', l: '14%', s: 1.5, c: '#ffa9f9', o: 0.5 },
              { t: '32%', l: '86%', s: 1,   c: '#fff7ad', o: 0.55 },
              { t: '68%', l: '10%', s: 1,   c: '#fff7ad', o: 0.45 },
              { t: '78%', l: '88%', s: 1.5, c: '#ffa9f9', o: 0.5 },
            ].map((d, i) => (
              <span key={i} aria-hidden="true" className="absolute rounded-full"
                style={{
                  top: d.t, left: d.l,
                  width: `${d.s * 4}px`, height: `${d.s * 4}px`,
                  background: d.c,
                  boxShadow: `0 0 10px ${d.c}88`,
                  opacity: d.o,
                }} />
            ))}
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Overline — yan çizgili */}
            <div className="sp-ov-over flex items-center justify-center gap-4 mb-7 max-md:mb-5">
              <span aria-hidden="true" className="block h-px w-12 max-md:w-8"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,169,249,0.45))' }} />
              <span className="font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent/70">
                Detaylı Bakış
              </span>
              <span aria-hidden="true" className="block h-px w-12 max-md:w-8"
                style={{ background: 'linear-gradient(-90deg, transparent, rgba(255,169,249,0.45))' }} />
            </div>

            {/* Heading */}
            <h2 className="sp-ov-title font-body text-[clamp(1.95rem,4vw,2.8rem)] font-light tracking-tight leading-[1.18] text-center mb-10 max-md:mb-8">
              <ScrollText before={`${sub.title} `} accent="Hizmetleri." />
            </h2>

            {/* Diamond marker ayırıcı */}
            <div className="sp-ov-mark flex items-center justify-center gap-3 mb-12 max-md:mb-10">
              <span aria-hidden="true" className="block h-px w-24 max-md:w-14"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,169,249,0.35))' }} />
              <span aria-hidden="true" className="relative block w-2 h-2 rotate-45"
                style={{
                  background: 'linear-gradient(135deg, #ffa9f9, #fff7ad)',
                  boxShadow: '0 0 14px rgba(255,169,249,0.75), 0 0 30px rgba(255,247,173,0.35)',
                }} />
              <span aria-hidden="true" className="block h-px w-24 max-md:w-14"
                style={{ background: 'linear-gradient(-90deg, transparent, rgba(255,169,249,0.35))' }} />
            </div>

            {/* Paragraph — köşe parantezli çerçeve */}
            <div className="sp-ov-body relative max-w-3xl mx-auto px-10 py-10 max-md:px-5 max-md:py-7">
              {/* Corner brackets */}
              {([
                ['top-0 left-0',    'TL'],
                ['top-0 right-0',   'TR'],
                ['bottom-0 left-0', 'BL'],
                ['bottom-0 right-0','BR'],
              ] as const).map(([pos, key]) => (
                <span key={key} aria-hidden="true"
                  className={`pointer-events-none absolute w-5 h-5 max-md:w-4 max-md:h-4 ${pos}`}
                  style={{
                    ...(key.startsWith('T') && { borderTop: '1px solid rgba(255,169,249,0.35)' }),
                    ...(key.startsWith('B') && { borderBottom: '1px solid rgba(255,169,249,0.35)' }),
                    ...(key.endsWith('L')   && { borderLeft: '1px solid rgba(255,169,249,0.35)' }),
                    ...(key.endsWith('R')   && { borderRight: '1px solid rgba(255,169,249,0.35)' }),
                    [`border${key.startsWith('T') ? 'Top' : 'Bottom'}${key.endsWith('L') ? 'Left' : 'Right'}Radius`]: '6px',
                    filter: 'drop-shadow(0 0 4px rgba(255,169,249,0.35))',
                  }} />
              ))}
              <p className="font-body text-[clamp(1rem,1.6vw,1.12rem)] text-t2 font-light leading-[1.95] text-center">
                {sub.longDescription}
              </p>
            </div>

            {/* Footer — ince accent bar */}
            <div className="sp-ov-footer mt-12 flex items-center justify-center gap-3 max-md:mt-10">
              <span aria-hidden="true" className="block w-1 h-1 rounded-full"
                style={{ background: '#ffa9f9', boxShadow: '0 0 6px rgba(255,169,249,0.6)' }} />
              <span aria-hidden="true" className="block h-px w-56 max-w-[60vw]"
                style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), var(--color-accent2), transparent)' }} />
              <span aria-hidden="true" className="block w-1 h-1 rounded-full"
                style={{ background: '#fff7ad', boxShadow: '0 0 6px rgba(255,247,173,0.6)' }} />
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section data-sp="features" className="py-28 px-6 max-md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="sp-head text-center mb-16 max-md:mb-12">
              <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
                Yetenekler
              </span>
              <h2 className="font-body text-[clamp(1.8rem,3.8vw,2.6rem)] font-light tracking-tight leading-[1.2]">
                <ScrollText before="Özellikler " accent="& Kapsamı." />
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" style={{ perspective: '1400px' }}>
              {sub.features.map((feat, i) => {
                const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
                const num = String(i + 1).padStart(2, '0');
                return (
                  <div key={feat}
                    onMouseMove={handleTilt}
                    onMouseLeave={handleTiltLeave}
                    className="sp-card group relative px-7 pt-7 pb-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden transition-all duration-400 hover:border-white/[0.18] hover:bg-white/[0.035]"
                    style={{ '--accent': accent, transformStyle: 'preserve-3d' } as React.CSSProperties}>

                    {/* Top-left accent bar — daima görünür, hover'da genişler */}
                    <span aria-hidden="true"
                      className="pointer-events-none absolute top-0 left-5 h-[2px] w-10 group-hover:w-20 rounded-b-full transition-all duration-500"
                      style={{
                        background: `linear-gradient(90deg, ${accent}, transparent)`,
                        opacity: 0.55,
                        boxShadow: `0 0 8px ${accent}88`,
                      }} />

                    {/* Feature index — mono tarz, top-right */}
                    <span aria-hidden="true"
                      className="absolute top-5 right-6 font-body text-[0.62rem] font-semibold tracking-[0.25em] text-t3/45 transition-colors duration-400 group-hover:text-[color:var(--accent)]">
                      F.{num}
                    </span>

                    {/* Hover glow */}
                    <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ boxShadow: `0 0 0 1px ${accent} inset, 0 0 24px ${accent}44, 0 0 50px ${accent}1a` }}
                      aria-hidden="true" />
                    <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(260px circle at var(--mx) var(--my), ${accent}14, transparent 70%)` }}
                      aria-hidden="true" />

                    {/* Content */}
                    <div className="relative flex items-start gap-4 pr-10 pt-1">
                      {/* Altıgen glyph ikon */}
                      <div className="shrink-0 relative w-10 h-10 flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-[8deg]">
                        <svg width="40" height="40" viewBox="0 0 40 40" className="absolute inset-0" aria-hidden="true">
                          <polygon
                            points="20,3 34.5,11.5 34.5,28.5 20,37 5.5,28.5 5.5,11.5"
                            fill={`${accent}12`}
                            stroke={`${accent}66`}
                            strokeWidth="1"
                            style={{ filter: `drop-shadow(0 0 3px ${accent}55)` }} />
                        </svg>
                        <span className="relative w-[7px] h-[7px] rounded-full transition-all duration-500 group-hover:scale-[1.6]"
                          style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
                      </div>

                      {/* Feature text */}
                      <span className="relative font-body text-[0.95rem] text-t1 font-medium leading-snug transition-colors duration-400 group-hover:text-[color:var(--accent)]">
                        {feat}
                      </span>
                    </div>

                    {/* Bottom progress bar — hover'da sağa dolar */}
                    <span aria-hidden="true"
                      className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out"
                      style={{
                        background: `linear-gradient(90deg, ${accent}, ${accent}55, transparent)`,
                        boxShadow: `0 0 6px ${accent}66`,
                      }} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== PROCESS ===== */}
        <section data-sp="process" className="py-28 px-6 max-md:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="sp-head text-center mb-16 max-md:mb-12">
              <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent/60 mb-4">
                Süreç
              </span>
              <h2 className="font-body text-[clamp(1.8rem,3.8vw,2.6rem)] font-light tracking-tight leading-[1.2]">
                <ScrollText before="Çalışma " accent="sürecimiz." />
              </h2>
            </div>
            <div className="relative" style={{ perspective: '1400px' }}>
              {/* Connecting gradient line */}
              <div className="sp-line absolute left-7 top-7 bottom-7 w-px max-md:left-6 origin-top"
                style={{ background: 'linear-gradient(to bottom, var(--color-accent), var(--color-accent2), transparent)' }} />
              <div className="space-y-7">
                {sub.process.map((step, i) => {
                  const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
                  const num = String(i + 1).padStart(2, '0');
                  const total = String(sub.process.length).padStart(2, '0');
                  return (
                    <div key={step} className="sp-step group/step relative grid grid-cols-[auto,1fr] gap-6 max-md:gap-4">
                      {/* Left rail — numbered badge */}
                      <div className="relative flex justify-center w-14 max-md:w-12 shrink-0">
                        {/* Pulse ring — hover'da belirir */}
                        <span aria-hidden="true"
                          className="absolute inset-0 m-auto w-14 h-14 max-md:w-12 max-md:h-12 rounded-2xl opacity-0 group-hover/step:opacity-100 transition-opacity duration-500"
                          style={{ border: `1px solid ${accent}`, filter: `drop-shadow(0 0 10px ${accent}aa)` }} />
                        {/* Main badge */}
                        <span className="sp-step-dot relative z-10 w-14 h-14 max-md:w-12 max-md:h-12 rounded-2xl bg-bg flex items-center justify-center transition-all duration-500"
                          style={{
                            border: `1px solid ${accent}55`,
                            boxShadow: `0 0 0 3px var(--color-bg), 0 0 20px ${accent}44`,
                          }}>
                          <span className="font-body text-[1.05rem] font-bold gradient-text leading-none">{num}</span>
                        </span>
                        {/* Horizontal connector — dot → card bridge */}
                        <span aria-hidden="true"
                          className="absolute top-7 max-md:top-6 left-full w-6 max-md:w-4 h-px transition-all duration-500 group-hover/step:w-8 max-md:group-hover/step:w-6"
                          style={{ background: `linear-gradient(90deg, ${accent}cc, transparent)`, boxShadow: `0 0 4px ${accent}88` }} />
                      </div>

                      {/* Card */}
                      <article
                        onMouseMove={handleTilt}
                        onMouseLeave={handleTiltLeave}
                        className="sp-step-card group relative px-7 pt-5 pb-6 max-md:px-5 max-md:pt-4 max-md:pb-5 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden transition-all duration-400 hover:border-white/[0.18] hover:bg-white/[0.035] min-w-0"
                        style={{ '--accent': accent, transformStyle: 'preserve-3d' } as React.CSSProperties}>

                        {/* Left accent bar — daima görünür, hover'da boyca yükselir */}
                        <span aria-hidden="true"
                          className="pointer-events-none absolute top-5 left-0 w-[2px] h-10 group-hover:h-[calc(100%-2.5rem)] rounded-r-full transition-all duration-700"
                          style={{
                            background: `linear-gradient(180deg, ${accent}, transparent)`,
                            opacity: 0.6,
                            boxShadow: `0 0 6px ${accent}88`,
                          }} />

                        {/* Meta row — aşama label + counter */}
                        <div className="relative flex items-center justify-between mb-3">
                          <span className="font-body text-[0.62rem] font-semibold tracking-[0.28em] uppercase text-t3/55 transition-colors duration-400 group-hover:text-[color:var(--accent)]">
                            Aşama {num}
                          </span>
                          <span className="font-body text-[0.6rem] font-semibold tracking-[0.2em] text-t3/35">
                            {num} / {total}
                          </span>
                        </div>

                        {/* Hover glow */}
                        <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ boxShadow: `0 0 0 1px ${accent} inset, 0 0 24px ${accent}44` }}
                          aria-hidden="true" />
                        <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ background: `radial-gradient(260px circle at var(--mx) var(--my), ${accent}14, transparent 70%)` }}
                          aria-hidden="true" />

                        {/* Step description */}
                        <p className="relative font-body text-[1rem] text-t1 font-light leading-relaxed transition-colors duration-400 group-hover:text-[color:var(--accent)]">
                          {step}
                        </p>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ===== BENEFITS ===== */}
        <section data-sp="benefits" className="py-28 px-6 max-md:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="sp-head text-center mb-16 max-md:mb-12">
              <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
                Avantajlar
              </span>
              <h2 className="font-body text-[clamp(1.8rem,3.8vw,2.6rem)] font-light tracking-tight leading-[1.2]">
                <ScrollText before="Neden " accent="BERACORE?" />
              </h2>
            </div>
            <div className="space-y-5" style={{ perspective: '1400px' }}>
              {sub.benefits.map((benefit, i) => {
                const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
                return (
                  <div key={benefit}
                    onMouseMove={handleTilt}
                    onMouseLeave={handleTiltLeave}
                    className="sp-card group relative flex items-start gap-5 p-7 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden transition-all duration-400 hover:border-white/[0.18] hover:bg-white/[0.035]"
                    style={{ '--accent': accent, transformStyle: 'preserve-3d' } as React.CSSProperties}>
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                      style={{ background: `linear-gradient(to bottom, ${accent}, transparent)` }} />
                    <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ boxShadow: `0 0 0 1px ${accent} inset, 0 0 24px ${accent}44` }}
                      aria-hidden="true" />
                    <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(300px circle at var(--mx) var(--my), ${accent}14, transparent 70%)` }}
                      aria-hidden="true" />
                    <div className="relative shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mt-0.5 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6"
                      style={{ background: `${accent}14`, boxShadow: `0 0 0 1px ${accent}30 inset` }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L20 7" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="relative font-body text-[1.05rem] text-t1 font-light leading-relaxed pt-2.5 transition-colors duration-400 group-hover:text-[color:var(--accent)]">
                      {benefit}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section divider */}
        <div className="flex justify-center py-4">
          <div className="w-full max-w-xs h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), var(--color-accent2), transparent)' }} />
        </div>

        {/* ===== FAQ ===== */}
        <section data-sp="faq" className="py-28 px-6 max-md:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="sp-head text-center mb-14 max-md:mb-10">
              <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent/60 mb-4">
                Sık Sorulanlar
              </span>
              <h2 className="font-body text-[clamp(1.8rem,3.8vw,2.6rem)] font-light tracking-tight leading-[1.2]">
                <ScrollText before="Sıkça sorulan " accent="sorular." />
              </h2>
            </div>
            <div className="space-y-3">
              {sub.faq.map((item, i) => {
                const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
                const open = openFaq === i;
                return (
                  <div key={i}
                    className="sp-item relative border rounded-2xl overflow-hidden transition-all duration-400"
                    style={{
                      borderColor: open ? `${accent}30` : 'rgba(255,255,255,0.06)',
                      background: open ? `linear-gradient(180deg, ${accent}08, transparent)` : 'rgba(255,255,255,0.01)',
                    }}>
                    {/* Active accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full transition-opacity duration-400"
                      style={{ background: `linear-gradient(to bottom, ${accent}, ${accent}00)`, opacity: open ? 1 : 0 }} />
                    <button
                      onClick={() => toggleFaq(i)}
                      className="w-full flex items-center justify-between gap-4 p-6 text-left max-md:p-5"
                      aria-expanded={open}>
                      <span className="font-heading text-[1rem] font-semibold pr-4 max-md:text-[0.95rem]"
                        style={{ color: open ? accent : 'var(--color-t1)' }}>
                        {item.question}
                      </span>
                      <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-400"
                        style={{
                          background: open ? `${accent}1c` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${open ? `${accent}55` : 'rgba(255,255,255,0.08)'}`,
                        }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                          stroke={open ? accent : '#c0bdb8'} strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"
                          className="transition-transform duration-400"
                          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0)' }}>
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                    <div className="grid transition-[grid-template-rows] duration-500 ease-out"
                      style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 font-body text-[0.92rem] text-t2 font-light leading-[1.8] max-md:px-5 max-md:pb-5">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== RELATED ===== */}
        {otherSubs.length > 0 && (
          <section data-sp="related" className="py-28 px-6 max-md:py-20">
            <div className="max-w-5xl mx-auto">
              <div className="sp-head text-center mb-16 max-md:mb-12">
                <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
                  Keşfet
                </span>
                <h2 className="font-body text-[clamp(1.8rem,3.8vw,2.6rem)] font-light tracking-tight leading-[1.2]">
                  <ScrollText before={`Diğer ${service.title} `} accent="hizmetlerimiz." />
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ perspective: '1400px' }}>
                {otherSubs.map((other, i) => {
                  const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
                  return (
                    <Link
                      key={other.slug}
                      href={`/hizmetler/${service.key}/${other.slug}`}
                      onMouseMove={handleTilt}
                      onMouseLeave={handleTiltLeave}
                      className="sp-card group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden transition-all duration-400 hover:border-white/[0.18] hover:bg-white/[0.035]"
                      style={{ '--accent': accent, transformStyle: 'preserve-3d' } as React.CSSProperties}>
                      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ boxShadow: `0 0 0 1px ${accent} inset, 0 0 24px ${accent}44, 0 0 50px ${accent}1a` }}
                        aria-hidden="true" />
                      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: `radial-gradient(280px circle at var(--mx) var(--my), ${accent}14, transparent 70%)` }}
                        aria-hidden="true" />
                      <div className="relative">
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="w-2 h-2 rounded-full"
                            style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
                          <h3 className="font-body text-[1.05rem] font-semibold text-t1 group-hover:text-[color:var(--accent)] transition-colors duration-300">
                            {other.title}
                          </h3>
                        </div>
                        <p className="font-body text-[0.85rem] text-t3 font-light leading-relaxed line-clamp-2 mb-5">
                          {other.description}
                        </p>
                        <span className="inline-flex items-center gap-1.5 font-body text-[0.75rem] font-semibold tracking-wider uppercase text-accent/50 group-hover:text-[color:var(--accent)] transition-all duration-300 group-hover:gap-2.5">
                          Detaylı Bilgi
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ===== CTA ===== */}
        <section data-sp="cta" className="py-28 px-6 text-center relative max-md:py-20">
          <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(255,169,249,0.05) 0%, rgba(255,247,173,0.02) 30%, transparent 65%)' }} />
          <div className="max-w-2xl mx-auto">
            <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent/60 mb-4">
              İletişim
            </span>
            <h2 className="font-body text-[clamp(1.8rem,4vw,2.8rem)] font-light tracking-tight leading-[1.2] mb-6">
              <ScrollText before="Projenizi hayata " accent="geçirelim." />
            </h2>
            <p className="font-body text-[1.1rem] text-t2 font-light mb-12 leading-relaxed">
              {sub.title} ihtiyaçlarınız için uzman ekibimizle tanışın.
            </p>
            <Link href="/iletisim"
              className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-body text-[0.9rem] font-semibold tracking-wider uppercase
                bg-gradient-to-r from-accent to-accent2 text-bg transition-all duration-500
                hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(255,169,249,0.3)]">
              Ücretsiz Teklif Al
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                className="transition-transform duration-400 group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <p className="mt-8 font-body text-[0.82rem] text-t3">
              veya <a href="tel:+908503026950" className="text-accent hover:text-accent2 transition-colors duration-300 font-medium">0850 302 69 50</a> numarasından bizi arayın
            </p>
          </div>
        </section>

      </div>
    </article>
  );
}
