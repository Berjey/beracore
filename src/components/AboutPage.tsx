'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollText from '@/components/ScrollText';
import { services } from '@/lib/services-data';

gsap.registerPlugin(ScrollTrigger);

type Stat = {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  iconPath: string;
};

const STATS: Stat[] = [
  {
    value: 2024,
    suffix: '',
    label: 'Kuruluş Yılı',
    sub: 'BERACORE stüdyosu',
    iconPath: 'M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83',
  },
  {
    value: 5,
    suffix: '+',
    label: 'Uzman Ekip',
    sub: 'Disiplinlerarası çekirdek',
    iconPath: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
  },
  {
    value: 25,
    suffix: '+',
    label: 'Tamamlanan Proje',
    sub: 'Teslim edilen',
    iconPath: 'M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3',
  },
  {
    value: 15,
    suffix: '+',
    label: 'Kurumsal Müşteri',
    sub: 'Aktif iş ortağı',
    iconPath: 'M20 7h-4V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM10 4h4v3h-4V4z',
  },
];

const VALUES = [
  {
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
    title: 'Disiplin ve Hız',
    desc: 'Kurumsal kalite standartlarını, startup çevikliğiyle birleştiriyoruz. Her sprint net hedeflerle ilerler; hızdan ödün verirken kaliteden vazgeçmiyoruz.',
  },
  {
    iconPath: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    title: 'Şeffaflık',
    desc: 'Canlı proje panosu, haftalık ilerleme raporları ve açık iletişim — sürecin her adımı takip ettiğiniz, kararlarında söz sahibi olduğunuz bir ortaklık.',
  },
  {
    iconPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    title: 'Derinlik',
    desc: 'Web, mobil, blockchain, yapay zekâ, tasarım ve pazarlama alanlarının her birinde teknik derinliği olan uzmanlarla çalışıyoruz; yüzeysel değil, katmanlı çözümler üretiyoruz.',
  },
  {
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    title: 'Ortaklık Ruhu',
    desc: 'Müşteri değil, iş ortağı. Projenizi bizim projemiz gibi sahipleniyor; kısa vadeli teslimden çok, uzun vadeli değer üretimini hedefliyoruz.',
  },
];

const TIMELINE = [
  {
    period: '2024 · Q1',
    title: 'Kuruluş',
    desc: 'BERACORE, İstanbul\'da dijital deneyim stüdyosu olarak kuruldu. Kurumsallaşmış süreçlerin yavaşlığı ile bağımsız çözümlerin tutarsızlığı arasında yeni bir alternatif sunmak için yola çıktık.',
  },
  {
    period: '2024 · Q3',
    title: 'İlk Kurumsal Projeler',
    desc: 'Farklı dikeylerden kurumsal markalarla uzun soluklu iş ortaklıklarına adım attık. Otomotiv, e-ticaret, fintech ve kripto dikeylerinde ilk üretim ortamı teslimatlarımızı gerçekleştirdik.',
  },
  {
    period: '2025',
    title: 'Hizmet Yelpazesi',
    desc: 'Yapay zekâ destekli otomasyon, blockchain entegrasyonları ve UI/UX sistemleri ile hizmet yelpazemizi derinleştirdik. Disiplinlerarası çekirdek ekibimizi şekillendirdik.',
  },
  {
    period: '2026',
    title: 'Bugün',
    desc: '6 ana hizmet alanında, 15+ kurumsal müşteri ve 25+ teslim edilmiş proje. Her yeni iş ortaklığı, stüdyomuzun hikâyesine bir sayfa daha ekliyor.',
  },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // ===== HERO — sinematik giriş timeline =====
        const heroTl = gsap.timeline({ delay: 0.2 });

        heroTl
          .fromTo('.ab-hero-label',
            { y: 20, opacity: 0, letterSpacing: '0.8em' },
            { y: 0, opacity: 1, letterSpacing: '0.5em', duration: 0.9, ease: 'power3.out' }
          )
          .fromTo('.ab-char-main',
            { y: 60, opacity: 0, rotationX: -80 },
            { y: 0, opacity: 1, rotationX: 0, duration: 0.8, stagger: 0.035, ease: 'power3.out' },
            '-=0.3'
          )
          .fromTo('.ab-char-accent',
            { y: 60, opacity: 0, rotationX: -80 },
            { y: 0, opacity: 1, rotationX: 0, duration: 0.8, stagger: 0.035, ease: 'power3.out' },
            '-=0.5'
          )
          .fromTo('.ab-accent-glow',
            { opacity: 0, scale: 0.4 },
            { opacity: 0.4, scale: 1, duration: 1.2, ease: 'power2.out' },
            '-=0.6'
          )
          .fromTo('.ab-hero-desc',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out' },
            '-=0.4'
          )
          .fromTo('.ab-hero-line',
            { scaleX: 0 },
            { scaleX: 1, duration: 1.4, ease: 'power2.out' },
            '-=0.5'
          );

        // Arkaplan: sürekli dönen yörünge halkaları
        gsap.to('.ab-orbit-1', { rotation: 360, duration: 80, repeat: -1, ease: 'none' });
        gsap.to('.ab-orbit-2', { rotation: -360, duration: 110, repeat: -1, ease: 'none' });
        gsap.to('.ab-orbit-3', { rotation: 360, duration: 150, repeat: -1, ease: 'none' });

        // Yüzen accent parçacıklar
        gsap.to('.ab-orb', {
          y: '+=24',
          duration: 3.5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          stagger: { each: 0.4, from: 'random' },
        });

        // Accent kelime glow nefes alıyor (initial giriş sonrası)
        gsap.to('.ab-accent-glow', {
          opacity: 0.6,
          scale: 1.15,
          duration: 2.8,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: 2,
        });

        // Core glow nefes alır
        gsap.to('.ab-core', {
          scale: 1.6,
          opacity: 0.7,
          duration: 2.5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: 1.5,
        });

        // ===== HERO SCROLL CINEMATIC EXIT =====
        // Metin scroll ile küçülür, yukarı kayar, blurlanır
        gsap.to('.ab-hero', {
          y: -80,
          scale: 0.92,
          opacity: 0,
          filter: 'blur(6px)',
          scrollTrigger: {
            trigger: '.ab-hero-section',
            start: 'top top',
            end: 'bottom 40%',
            scrub: 0.5,
          },
        });

        // Hero line da fade out
        gsap.to('.ab-hero-line', {
          opacity: 0,
          scaleX: 0.3,
          scrollTrigger: {
            trigger: '.ab-hero-section',
            start: 'top top',
            end: 'bottom 40%',
            scrub: 0.5,
          },
        });

        // Yörünge halkaları scroll ile genişler (zoom out) ve solukalnaşır
        gsap.to('.ab-hero-orbits', {
          scale: 1.6,
          opacity: 0.3,
          rotate: 20,
          scrollTrigger: {
            trigger: '.ab-hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        });

        // Core glow erir — scale down + fade
        gsap.to('.ab-core', {
          scale: 0,
          opacity: 0,
          scrollTrigger: {
            trigger: '.ab-hero-section',
            start: 'top top',
            end: 'bottom 50%',
            scrub: 0.4,
          },
        });

        // Parçacıklar paralaks — hızlı yukarı süpürme, farklı hızlarda
        container.querySelectorAll<HTMLElement>('.ab-orb').forEach((orb, i) => {
          const speed = 1.2 + (i % 5) * 0.5; // 1.2, 1.7, 2.2, 2.7, 3.2 — çok daha agresif
          gsap.to(orb, {
            y: -600 * speed,
            opacity: 0,
            scrollTrigger: {
              trigger: '.ab-hero-section',
              start: 'top top',
              end: 'bottom top',
              scrub: 0.3,
            },
          });
        });

        // Ambient glow büyür ve solukalnaşır
        gsap.to('.ab-hero-ambient', {
          scale: 1.4,
          opacity: 0.4,
          scrollTrigger: {
            trigger: '.ab-hero-section',
            start: 'top top',
            end: 'bottom 50%',
            scrub: 0.6,
          },
        });

        // ===== STORY =====
        gsap.fromTo('.ab-story-text',
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: '.ab-story', start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        );

        // ===== STATS =====
        gsap.fromTo('.ab-stats-head',
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.ab-stats', start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
        gsap.fromTo('.ab-stat',
          { y: 60, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: '.ab-stats', start: 'top 75%', toggleActions: 'play none none reverse' },
          }
        );
        gsap.fromTo('.ab-stat-divider',
          { scaleY: 0 },
          {
            scaleY: 1, duration: 0.8, stagger: 0.12, ease: 'power2.out', delay: 0.3,
            scrollTrigger: { trigger: '.ab-stats', start: 'top 75%', toggleActions: 'play none none reverse' },
          }
        );

        // Count-up animasyonu (bir kez)
        container.querySelectorAll<HTMLElement>('.ab-stat').forEach((el) => {
          const numEl = el.querySelector<HTMLElement>('.ab-stat-num');
          if (!numEl) return;
          const target = parseInt(numEl.dataset.target || '0');
          const suffix = numEl.dataset.suffix || '';
          ScrollTrigger.create({
            trigger: el,
            start: 'top 80%',
            once: true,
            onEnter: () => {
              const obj = { n: 0 };
              // Büyük sayılar (ör. 2024) daha uzun sürede sayılsın; okunabilirlik
              const duration = target > 100 ? 2.8 : 2;
              gsap.to(obj, {
                n: target,
                duration,
                ease: 'power2.out',
                onUpdate: () => {
                  numEl.textContent = Math.round(obj.n) + suffix;
                },
              });
            },
          });
        });

        // ===== VALUES =====
        gsap.fromTo('.ab-values-head',
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.ab-values', start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
        container.querySelectorAll<HTMLElement>('.ab-value-card').forEach((card, i) => {
          const isLeft = i % 2 === 0;
          gsap.fromTo(card,
            { opacity: 0, y: 50, x: isLeft ? -40 : 40, rotationX: -10 },
            {
              opacity: 1, y: 0, x: 0, rotationX: 0, ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 88%', end: 'top 55%', scrub: 0.4 },
            }
          );
        });

        // ===== TIMELINE =====
        gsap.fromTo('.ab-timeline-head',
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.ab-timeline', start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
        gsap.fromTo('.ab-tl-line',
          { scaleY: 0 },
          {
            scaleY: 1, ease: 'none',
            scrollTrigger: { trigger: '.ab-timeline', start: 'top 70%', end: 'bottom 60%', scrub: 0.3 },
          }
        );
        container.querySelectorAll<HTMLElement>('.ab-tl-item').forEach((el, idx) => {
          const isLeft = idx % 2 === 0;
          gsap.fromTo(el,
            { opacity: 0, x: isLeft ? -60 : 60, y: 30 },
            {
              opacity: 1, x: 0, y: 0, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 55%', scrub: 0.5 },
            }
          );
        });
        container.querySelectorAll<HTMLElement>('.ab-tl-dot').forEach((el) => {
          gsap.fromTo(el,
            { scale: 0 },
            {
              scale: 1, ease: 'back.out(2)',
              scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 55%', scrub: 0.3 },
            }
          );
        });

        // ===== SERVICES =====
        gsap.fromTo('.ab-svc-head',
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.ab-services', start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
        // Her hizmet kartı scrub ile 3D giriş yapar
        container.querySelectorAll<HTMLElement>('.ab-svc-card').forEach((card, i) => {
          const isEven = i % 2 === 0;
          gsap.fromTo(card,
            {
              opacity: 0,
              y: 60,
              scale: 0.93,
              rotationX: -12,
              rotationY: isEven ? -8 : 8,
            },
            {
              opacity: 1, y: 0, scale: 1, rotationX: 0, rotationY: 0,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: `top ${90 - (i % 3) * 2}%`,
                end: `top ${55 - (i % 3) * 2}%`,
                scrub: 0.5,
              },
            }
          );
        });

        // ===== CTA =====
        gsap.fromTo('.ab-cta-inner',
          { y: 40, opacity: 0, scale: 0.96 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: '.ab-cta', start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );

        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, container);
    }, 400);

    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  // Hover handlers — kartlar için standart 3D tilt (her HTMLElement'te çalışır)
  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -8;
    const ry = ((x / rect.width) - 0.5) * 10;
    gsap.to(card, {
      rotationX: rx, rotationY: ry,
      duration: 0.4, ease: 'power2.out', overwrite: 'auto',
    });
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  };

  const handleLeave = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotationX: 0, rotationY: 0,
      duration: 0.6, ease: 'power3.out', overwrite: 'auto',
    });
  };

  // Servis ikonları — key eşlemesi
  const SERVICE_ICONS: Record<string, string> = {
    ai: 'M9.663 17h4.673 M12 3v1 M21 12h-1 M4 12H3 M7.07 7.07L6.36 6.36 M17.64 6.36l-.71.71 M8 16a5 5 0 117.07 0 M10 20h4',
    blockchain: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
    software: 'M16 18l6-6-6-6 M8 6l-6 6 6 6 M14 4l-4 16',
    design: 'M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z M11 11a2 2 0 11-4 0 2 2 0 014 0z',
    ecommerce: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0',
    marketing: 'M3 11l18-5v12L3 14v-3z M11.6 16.8a3 3 0 11-5.8-1.6',
  };

  return (
    <div ref={containerRef}>
      {/* ========== HERO ========== */}
      <section className="ab-hero-section relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 overflow-hidden">
        {/* Ambient glow */}
        <div
          className="ab-hero-ambient pointer-events-none absolute inset-0 -z-30"
          style={{
            background:
              'radial-gradient(900px 500px at 50% 35%, rgba(255,169,249,0.09), transparent 60%), radial-gradient(700px 400px at 70% 70%, rgba(255,247,173,0.05), transparent 60%)',
          }}
        />

        {/* Dönen yörünge halkaları — her biri ayrı wrapper'da, satellite içerebilir */}
        <div className="ab-hero-orbits pointer-events-none absolute inset-0 -z-20 flex items-center justify-center">
          {/* Core glow */}
          <div
            className="ab-core absolute rounded-full"
            style={{
              width: 8,
              height: 8,
              background: 'radial-gradient(circle, #ffffff 0%, #ffa9f9 50%, transparent 80%)',
              boxShadow: '0 0 24px rgba(255,169,249,0.8), 0 0 60px rgba(255,247,173,0.4)',
            }}
            aria-hidden="true"
          />

          {/* Ring 1 — en iç, ince sarı, 3 uydu (0°, 120°, 240°) */}
          <div className="ab-orbit-1 absolute max-md:!w-[360px] max-md:!h-[360px]"
            style={{ width: 480, height: 480 }}>
            <div
              className="w-full h-full rounded-full"
              style={{ border: '1px solid rgba(255,247,173,0.14)' }}
            />
            {[0, 120, 240].map((angle) => (
              <div
                key={angle}
                className="absolute inset-0"
                style={{ transform: `rotate(${angle}deg)` }}
                aria-hidden="true"
              >
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                  style={{
                    background: '#fff7ad',
                    boxShadow: '0 0 10px #fff7ad, 0 0 20px rgba(255,247,173,0.6)',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Ring 2 — kesikli, ters yön, pembe, 3 uydu (60°, 180°, 300°) */}
          <div className="ab-orbit-2 absolute max-md:!w-[520px] max-md:!h-[520px]"
            style={{ width: 700, height: 700 }}>
            <div
              className="w-full h-full rounded-full"
              style={{ border: '1px dashed rgba(255,169,249,0.12)' }}
            />
            {[60, 180, 300].map((angle) => (
              <div
                key={angle}
                className="absolute inset-0"
                style={{ transform: `rotate(${angle}deg)` }}
                aria-hidden="true"
              >
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                  style={{
                    background: '#ffa9f9',
                    boxShadow: '0 0 8px #ffa9f9, 0 0 18px rgba(255,169,249,0.6)',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Ring 3 — orta, gradient border (conic) */}
          <div className="ab-orbit-3 absolute max-md:!w-[720px] max-md:!h-[720px]"
            style={{ width: 950, height: 950 }}>
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, rgba(255,169,249,0.18) 45deg, transparent 90deg, transparent 270deg, rgba(255,247,173,0.14) 315deg, transparent 360deg)',
                WebkitMask:
                  'radial-gradient(circle, transparent 99%, #000 100%), radial-gradient(circle, #000 99.5%, transparent 100%)',
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
                padding: '1px',
              }}
            />
          </div>

          {/* Ring 4 — en dış, zayıf, 3 küçük uydu (45°, 165°, 285°) */}
          <div className="ab-orbit-4 absolute max-md:!w-[920px] max-md:!h-[920px]"
            style={{ width: 1220, height: 1220 }}>
            <div
              className="w-full h-full rounded-full"
              style={{ border: '1px solid rgba(255,255,255,0.035)' }}
            />
            {[45, 165, 285].map((angle, i) => (
              <div
                key={angle}
                className="absolute inset-0"
                style={{ transform: `rotate(${angle}deg)` }}
                aria-hidden="true"
              >
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
                  style={{
                    background: i % 2 === 0 ? '#fff7ad' : '#ffa9f9',
                    boxShadow: `0 0 6px ${i % 2 === 0 ? 'rgba(255,247,173,0.7)' : 'rgba(255,169,249,0.7)'}`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Yüzen accent parçacıklar — 12 adet, viewport'a dağıtılmış */}
        <div className="ab-hero-orbs pointer-events-none absolute inset-0 -z-10">
          {[
            { t: '12%', l: '8%',  s: 1.5, c: '#ffa9f9', o: 0.6, b: 8 },
            { t: '22%', l: '86%', s: 2,   c: '#fff7ad', o: 0.7, b: 10 },
            { t: '8%',  l: '46%', s: 1,   c: '#ffa9f9', o: 0.5, b: 6 },
            { t: '35%', l: '14%', s: 2.5, c: '#fff7ad', o: 0.65, b: 14 },
            { t: '48%', l: '92%', s: 1.5, c: '#ffa9f9', o: 0.7, b: 10 },
            { t: '62%', l: '6%',  s: 2,   c: '#ffa9f9', o: 0.55, b: 12 },
            { t: '72%', l: '78%', s: 2.5, c: '#fff7ad', o: 0.6, b: 16 },
            { t: '82%', l: '30%', s: 1,   c: '#ffa9f9', o: 0.55, b: 6 },
            { t: '88%', l: '58%', s: 1.5, c: '#fff7ad', o: 0.5, b: 8 },
            { t: '18%', l: '64%', s: 1,   c: '#fff7ad', o: 0.5, b: 6 },
            { t: '55%', l: '42%', s: 0.8, c: '#ffa9f9', o: 0.4, b: 4 },
            { t: '38%', l: '68%', s: 1,   c: '#ffa9f9', o: 0.5, b: 6 },
          ].map((orb, i) => (
            <span
              key={i}
              className="ab-orb absolute rounded-full"
              style={{
                top: orb.t,
                left: orb.l,
                width: `${orb.s * 4}px`,
                height: `${orb.s * 4}px`,
                background: orb.c,
                boxShadow: `0 0 ${orb.b}px ${orb.c}${Math.round(orb.o * 200).toString(16).padStart(2, '0').slice(-2)}`,
                opacity: orb.o,
              }}
              aria-hidden="true"
            />
          ))}
        </div>

        <div className="ab-hero relative max-w-4xl mx-auto">
          <span className="ab-hero-label inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/70 mb-7">
            Hakkımızda
          </span>

          <h1
            className="font-body text-[clamp(2.4rem,6vw,4.6rem)] font-light leading-[1.05] tracking-tight mb-8"
            style={{ perspective: '1000px' }}
          >
            <span className="inline-block text-t1 mr-[0.3em]">
              {Array.from('Dijitalin').map((ch, i) => (
                <span key={i} className="ab-char-main inline-block" style={{ willChange: 'transform, opacity' }}>
                  {ch}
                </span>
              ))}
            </span>
            <span className="relative inline-block font-semibold">
              {/* Pulsing glow behind accent */}
              <span
                className="ab-accent-glow pointer-events-none absolute inset-0 -z-10 blur-[40px]"
                style={{
                  background: 'linear-gradient(135deg, #ffa9f9, #fff7ad)',
                  borderRadius: '50%',
                }}
                aria-hidden="true"
              />
              {Array.from('Çekirdeğindeyiz').map((ch, i) => (
                <span
                  key={i}
                  className="ab-char-accent inline-block"
                  style={{
                    background: 'linear-gradient(135deg, #ffa9f9, #fff7ad)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                    willChange: 'transform, opacity',
                  }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </h1>

          <p className="ab-hero-desc font-body text-[clamp(1rem,1.8vw,1.15rem)] text-t2 font-light leading-[1.8] max-w-2xl mx-auto">
            2024&apos;te İstanbul&apos;da kurulan bir dijital deneyim stüdyosuyuz.
            Yapay zekâ, blockchain, yazılım, tasarım ve dijital pazarlama alanlarında; markanızın
            dijital geleceğini strateji, estetik ve mühendislikle birlikte şekillendiriyoruz.
          </p>
        </div>

        <div
          className="ab-hero-line mt-12 h-px w-full max-w-md origin-center"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--color-accent), var(--color-accent2), transparent)',
          }}
        />

      </section>

      {/* ========== STORY / MANİFESTO ========== */}
      <section className="ab-story py-28 px-6 max-md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="ab-story-text text-center mb-10">
            <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent/60 mb-4">
              Hikâyemiz
            </span>
            <h2 className="font-body text-[clamp(1.8rem,3.8vw,2.6rem)] font-light tracking-tight leading-[1.2]">
              <ScrollText before="Çekirdekten " accent="başladık." />
            </h2>
          </div>

          <div className="space-y-6">
            <p className="ab-story-text font-body text-[clamp(1rem,1.6vw,1.08rem)] text-t2 font-light leading-[1.9]">
              BERACORE, 2024&apos;te İstanbul&apos;da küçük ama tutkulu bir ekip tarafından kuruldu. Kurumsallaşmış
              ajansların yavaş süreçleri ile bağımsız çözümlerin tutarsızlığı arasında sıkışan markalara;
              hızlı, disiplinli ve uçtan uca bir alternatif sunmak için yola çıktık.
            </p>
            <p className="ab-story-text font-body text-[clamp(1rem,1.6vw,1.08rem)] text-t2 font-light leading-[1.9]">
              <span className="text-t1 font-medium">Küçük ekip, büyük odak.</span> 5 kişilik çekirdek
              kadromuzla her projeye tam dikkat veriyoruz. Projelerinizi biz iz bırakacağımız eserler olarak
              görüyor; kısa vadeli teslimden çok, uzun vadeli değer üretimini hedefliyoruz.
            </p>
            <p className="ab-story-text font-body text-[clamp(1rem,1.6vw,1.08rem)] text-t2 font-light leading-[1.9]">
              Bugün otomotiv, e-ticaret, fintech ve kripto dikeylerinde kurumsal müşterilerle çalışıyor;
              her yeni iş ortaklığıyla stüdyomuzun hikâyesini birlikte yazıyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section
        className="ab-stats relative py-28 px-6 border-t border-b border-border overflow-hidden max-md:py-20"
        style={{
          background:
            'linear-gradient(180deg, transparent, rgba(255,169,249,0.025) 50%, transparent)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(800px 300px at 50% 50%, rgba(255,169,249,0.06), transparent 70%)',
          }}
        />

        {/* Header */}
        <div className="ab-stats-head text-center mb-16 max-md:mb-12">
          <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
            Rakamlarla
          </span>
          <h2 className="font-body text-[clamp(1.8rem,3.5vw,2.6rem)] font-light tracking-tight leading-[1.2] max-md:text-[1.5rem]">
            <ScrollText before="Kısa yolculuk, " accent="sağlam adımlar." />
          </h2>
        </div>

        {/* Grid */}
        <div className="relative max-w-[1150px] mx-auto">
          <div className="grid grid-cols-4 gap-0 max-lg:grid-cols-2 max-md:grid-cols-1">
            {STATS.map((stat, i) => {
              const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
              return (
                <div
                  key={stat.label}
                  className="ab-stat group relative px-6 py-8 text-center transition-colors duration-500 max-md:py-6"
                  style={{ '--accent': accent } as React.CSSProperties}
                >
                  {/* Dikey ayraç (son hariç) */}
                  {i < STATS.length - 1 && (
                    <span
                      className="ab-stat-divider pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-px h-[70%] origin-center max-lg:hidden"
                      style={{
                        background:
                          'linear-gradient(180deg, transparent, rgba(255,169,249,0.18), rgba(255,247,173,0.14), transparent)',
                      }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Hover radial glow */}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(250px circle at 50% 50%, ${accent}18, transparent 70%)`,
                    }}
                    aria-hidden="true"
                  />

                  {/* İkon */}
                  <div
                    className="relative inline-flex w-11 h-11 rounded-xl items-center justify-center mb-5 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6"
                    style={{
                      background: `${accent}14`,
                      boxShadow: `0 0 0 1px ${accent}30 inset, 0 0 24px ${accent}22`,
                    }}
                  >
                    <svg
                      width="20" height="20" viewBox="0 0 24 24"
                      fill="none" stroke={accent}
                      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d={stat.iconPath} />
                    </svg>
                  </div>

                  {/* Numara (count-up) */}
                  <div
                    className="ab-stat-num font-heading font-bold leading-none tracking-tight mb-3 gradient-text"
                    style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.6rem)' }}
                    data-target={stat.value}
                    data-suffix={stat.suffix}
                  >
                    0{stat.suffix}
                  </div>

                  {/* Label */}
                  <div className="font-body text-[0.8rem] font-semibold text-t1 tracking-[0.05em] mb-1">
                    {stat.label}
                  </div>
                  <div
                    className="font-body text-[0.68rem] font-light tracking-[0.12em] uppercase transition-colors duration-500"
                    style={{ color: `${accent}99` }}
                  >
                    {stat.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== VALUES ========== */}
      <section className="ab-values py-28 px-6 max-md:py-20">
        <div className="max-w-[1100px] mx-auto">
          <div className="ab-values-head text-center mb-16 max-md:mb-12">
            <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
              Değerlerimiz
            </span>
            <h2 className="font-body text-[clamp(1.8rem,3.8vw,2.6rem)] font-light tracking-tight leading-[1.2]">
              <ScrollText before="Bizi biz " accent="yapanlar." />
            </h2>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            style={{ perspective: '1400px' }}
          >
            {VALUES.map((v, i) => {
              const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
              return (
                <article
                  key={v.title}
                  onMouseMove={handleMove}
                  onMouseLeave={handleLeave}
                  className="ab-value-card group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden cursor-default transition-all duration-400 hover:border-white/[0.18] hover:bg-white/[0.035] max-md:p-6"
                  style={{ '--accent': accent, transformStyle: 'preserve-3d' } as React.CSSProperties}
                >
                  {/* Accent border glow — hover */}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      boxShadow: `0 0 0 1px ${accent} inset, 0 0 24px ${accent}44, 0 0 50px ${accent}1a`,
                    }}
                    aria-hidden="true"
                  />
                  {/* Corner brackets */}
                  {([
                    ['top-2.5 left-2.5', '-translate-x-0.5 -translate-y-0.5', 'TL'],
                    ['top-2.5 right-2.5', 'translate-x-0.5 -translate-y-0.5', 'TR'],
                    ['bottom-2.5 left-2.5', '-translate-x-0.5 translate-y-0.5', 'BL'],
                    ['bottom-2.5 right-2.5', 'translate-x-0.5 translate-y-0.5', 'BR'],
                  ] as const).map(([pos, tf, key]) => (
                    <span
                      key={key}
                      className={`pointer-events-none absolute w-4 h-4 opacity-0 group-hover:opacity-100 ${tf} group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out ${pos}`}
                      style={{
                        ...(key.startsWith('T') && { borderTop: `1.5px solid ${accent}` }),
                        ...(key.startsWith('B') && { borderBottom: `1.5px solid ${accent}` }),
                        ...(key.endsWith('L') && { borderLeft: `1.5px solid ${accent}` }),
                        ...(key.endsWith('R') && { borderRight: `1.5px solid ${accent}` }),
                        [`border${key.startsWith('T') ? 'Top' : 'Bottom'}${key.endsWith('L') ? 'Left' : 'Right'}Radius`]: '8px',
                        filter: `drop-shadow(0 0 6px ${accent}88)`,
                      }}
                      aria-hidden="true"
                    />
                  ))}

                  <div className="relative flex gap-5 max-md:gap-4" style={{ transform: 'translateZ(20px)' }}>
                    <div
                      className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6"
                      style={{
                        background: `${accent}14`,
                        boxShadow: `0 0 0 1px ${accent}33 inset`,
                      }}
                    >
                      <svg
                        width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke={accent}
                        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                      >
                        <path d={v.iconPath} />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className="font-heading text-[1.15rem] font-bold text-t1 mb-2 transition-colors duration-400 group-hover:text-[color:var(--accent)]"
                      >
                        {v.title}
                      </h3>
                      <p className="font-body text-[0.9rem] text-t2 font-light leading-[1.75]">
                        {v.desc}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== TIMELINE ========== */}
      <section className="ab-timeline py-28 px-6 max-md:py-20">
        <div className="max-w-[1000px] mx-auto">
          <div className="ab-timeline-head text-center mb-16 max-md:mb-12">
            <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
              Yolculuk
            </span>
            <h2 className="font-body text-[clamp(1.8rem,3.8vw,2.6rem)] font-light tracking-tight leading-[1.2]">
              <ScrollText before="Bugüne " accent="nasıl geldik?" />
            </h2>
          </div>

          <div className="relative">
            <div
              className="ab-tl-line absolute top-6 bottom-6 w-px left-1/2 -translate-x-1/2 origin-top max-md:left-5 max-md:translate-x-0"
              style={{
                background:
                  'linear-gradient(180deg, var(--color-accent), var(--color-accent2) 85%, transparent)',
              }}
            />

            <ol
              className="list-none space-y-16 max-md:space-y-10"
              style={{ perspective: '1400px' }}
            >
              {TIMELINE.map((item, i) => {
                const isLeft = i % 2 === 0;
                const accent = isLeft ? '#ffa9f9' : '#fff7ad';
                return (
                  <li key={item.period} className="ab-tl-item relative">
                    <span
                      className="ab-tl-dot absolute left-1/2 -translate-x-1/2 -ml-[1px] top-6 w-3.5 h-3.5 rounded-full z-10 max-md:left-5 max-md:ml-0"
                      style={{
                        background: accent,
                        boxShadow: `0 0 0 4px #1a1a1a, 0 0 14px ${accent}bb, 0 0 32px ${accent}55`,
                      }}
                      aria-hidden="true"
                    />

                    <div
                      className={`
                        md:w-[calc(50%-2.5rem)]
                        ${isLeft ? 'md:mr-auto md:pr-0' : 'md:ml-auto md:pl-0'}
                        max-md:w-full max-md:pl-14
                      `}
                    >
                      <article
                        onMouseMove={handleMove}
                        onMouseLeave={handleLeave}
                        className="ab-tl-card group relative p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden cursor-default transition-all duration-400 hover:border-white/[0.18] hover:bg-white/[0.04]"
                        style={{
                          '--accent': accent,
                          transformStyle: 'preserve-3d',
                        } as React.CSSProperties}
                      >
                        {/* Accent border glow — hover'da 4 kenar accent rengine bürünür */}
                        <span
                          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            boxShadow: `0 0 0 1px ${accent} inset, 0 0 24px ${accent}44, 0 0 50px ${accent}1a`,
                          }}
                          aria-hidden="true"
                        />

                        {/* 4 köşe bracket'ı */}
                        {([
                          ['top-2 left-2', '-translate-x-0.5 -translate-y-0.5', 'TL'],
                          ['top-2 right-2', 'translate-x-0.5 -translate-y-0.5', 'TR'],
                          ['bottom-2 left-2', '-translate-x-0.5 translate-y-0.5', 'BL'],
                          ['bottom-2 right-2', 'translate-x-0.5 translate-y-0.5', 'BR'],
                        ] as const).map(([pos, tf, key]) => (
                          <span
                            key={key}
                            className={`pointer-events-none absolute w-3.5 h-3.5 opacity-0 group-hover:opacity-100 ${tf} group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out ${pos}`}
                            style={{
                              ...(key.startsWith('T') && { borderTop: `1.5px solid ${accent}` }),
                              ...(key.startsWith('B') && { borderBottom: `1.5px solid ${accent}` }),
                              ...(key.endsWith('L') && { borderLeft: `1.5px solid ${accent}` }),
                              ...(key.endsWith('R') && { borderRight: `1.5px solid ${accent}` }),
                              [`border${key.startsWith('T') ? 'Top' : 'Bottom'}${key.endsWith('L') ? 'Left' : 'Right'}Radius`]: '6px',
                              filter: `drop-shadow(0 0 6px ${accent}88)`,
                            }}
                            aria-hidden="true"
                          />
                        ))}

                        {/* İçerik — translateZ ile paralaks derinlik */}
                        <div className="relative" style={{ transform: 'translateZ(20px)' }}>
                          <span
                            className="inline-block font-heading text-[0.7rem] font-bold tracking-[0.22em] uppercase mb-2 px-2.5 py-1 rounded-full transition-transform duration-500 group-hover:scale-105"
                            style={{
                              color: accent,
                              background: `${accent}12`,
                              border: `1px solid ${accent}28`,
                            }}
                          >
                            {item.period}
                          </span>
                          <h3
                            className="font-heading text-xl font-bold text-t1 mb-2 transition-colors duration-400 group-hover:text-[color:var(--accent)] max-md:text-lg"
                          >
                            {item.title}
                          </h3>
                          <p className="font-body text-[0.88rem] text-t2 font-light leading-[1.8] max-md:text-[0.82rem]">
                            {item.desc}
                          </p>
                        </div>
                      </article>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* ========== SERVICES ========== */}
      <section
        className="ab-services relative py-28 px-6 border-t border-b border-border overflow-hidden max-md:py-20"
        style={{
          background:
            'linear-gradient(180deg, transparent, rgba(255,247,173,0.02), transparent)',
        }}
      >
        <div className="max-w-[1150px] mx-auto">
          <div className="ab-svc-head text-center mb-14 max-md:mb-10">
            <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
              Uzmanlık
            </span>
            <h2 className="font-body text-[clamp(1.8rem,3.8vw,2.6rem)] font-light tracking-tight leading-[1.2]">
              <ScrollText before="Hizmet " accent="alanlarımız." />
            </h2>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            style={{ perspective: '1400px' }}
          >
            {services.map((svc, i) => {
              const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
              const iconPath = SERVICE_ICONS[svc.key] ?? SERVICE_ICONS.software;
              return (
                <Link
                  key={svc.key}
                  href={`/hizmetler/${svc.key}/${svc.subServices[0].slug}`}
                  onMouseMove={handleMove}
                  onMouseLeave={handleLeave}
                  className="ab-svc-card group relative flex flex-col p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-[background,border] duration-400 hover:border-white/[0.18] hover:bg-white/[0.035] max-md:p-6"
                  style={{
                    '--accent': accent,
                    transformStyle: 'preserve-3d',
                  } as React.CSSProperties}
                >
                  {/* Accent border glow — hover 4 kenar */}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      boxShadow: `0 0 0 1px ${accent} inset, 0 0 28px ${accent}44, 0 0 60px ${accent}1a`,
                    }}
                    aria-hidden="true"
                  />

                  {/* 4 köşe bracket'ı */}
                  {([
                    ['top-2.5 left-2.5', '-translate-x-0.5 -translate-y-0.5', 'TL'],
                    ['top-2.5 right-2.5', 'translate-x-0.5 -translate-y-0.5', 'TR'],
                    ['bottom-2.5 left-2.5', '-translate-x-0.5 translate-y-0.5', 'BL'],
                    ['bottom-2.5 right-2.5', 'translate-x-0.5 translate-y-0.5', 'BR'],
                  ] as const).map(([pos, tf, key]) => (
                    <span
                      key={key}
                      className={`pointer-events-none absolute w-3.5 h-3.5 opacity-0 group-hover:opacity-100 ${tf} group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out ${pos}`}
                      style={{
                        ...(key.startsWith('T') && { borderTop: `1.5px solid ${accent}` }),
                        ...(key.startsWith('B') && { borderBottom: `1.5px solid ${accent}` }),
                        ...(key.endsWith('L') && { borderLeft: `1.5px solid ${accent}` }),
                        ...(key.endsWith('R') && { borderRight: `1.5px solid ${accent}` }),
                        [`border${key.startsWith('T') ? 'Top' : 'Bottom'}${key.endsWith('L') ? 'Left' : 'Right'}Radius`]: '6px',
                        filter: `drop-shadow(0 0 6px ${accent}88)`,
                      }}
                      aria-hidden="true"
                    />
                  ))}

                  {/* Üst accent line — hover'da belirir */}
                  <span
                    className="pointer-events-none absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                    }}
                    aria-hidden="true"
                  />

                  {/* İçerik */}
                  <div
                    className="relative flex flex-col flex-1"
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    {/* Header: ikon + hizmet sayısı */}
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6"
                        style={{
                          background: `${accent}14`,
                          boxShadow: `0 0 0 1px ${accent}33 inset, 0 0 20px ${accent}22`,
                        }}
                      >
                        <svg
                          width="22" height="22" viewBox="0 0 24 24"
                          fill="none" stroke={accent}
                          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <path d={iconPath} />
                        </svg>
                      </div>
                      <span
                        className="font-body text-[0.6rem] font-semibold tracking-[0.2em] uppercase whitespace-nowrap mt-1"
                        style={{ color: `${accent}88` }}
                      >
                        {svc.subServices.length} Alt Hizmet
                      </span>
                    </div>

                    {/* Başlık + subtitle */}
                    <h3
                      className="font-heading text-[1.25rem] font-bold text-t1 mb-2 transition-colors duration-400 group-hover:text-[color:var(--accent)] max-md:text-[1.1rem]"
                    >
                      {svc.title}
                    </h3>
                    <p className="font-body text-[0.86rem] text-t2 font-light mb-5 leading-[1.6]">
                      {svc.subtitle}
                    </p>

                    {/* Ayraç */}
                    <div
                      className="h-px w-full mb-4"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${accent}28, transparent)`,
                      }}
                    />

                    {/* Alt hizmetler — tam liste, check işaretli */}
                    <div className="flex-1 mb-5">
                      <div className="font-body text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-t3 mb-2.5">
                        Hizmet Kapsamı
                      </div>
                      <ul className="space-y-1.5">
                        {svc.subServices.map((ss) => (
                          <li
                            key={ss.slug}
                            className="flex items-center gap-2 font-body text-[0.8rem] text-t2 font-light"
                          >
                            <svg
                              width="11" height="11" viewBox="0 0 24 24"
                              fill="none" stroke={accent} strokeWidth="2.5"
                              strokeLinecap="round" strokeLinejoin="round"
                              className="shrink-0"
                              aria-hidden="true"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{ss.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div
                      className="flex items-center justify-between pt-4 mt-auto border-t transition-colors duration-400"
                      style={{ borderColor: `${accent}1a` }}
                    >
                      <span
                        className="font-body text-[0.72rem] font-semibold tracking-[0.15em] uppercase transition-colors duration-400 group-hover:text-[color:var(--accent)]"
                        style={{ color: `${accent}aa` }}
                      >
                        Detayları Keşfet
                      </span>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-400 ease-out group-hover:translate-x-1 group-hover:scale-110"
                        style={{
                          background: `${accent}14`,
                          boxShadow: `0 0 0 1px ${accent}33 inset`,
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="ab-cta relative py-28 px-6 overflow-hidden max-md:py-20">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(255,169,249,0.06) 0%, transparent 60%)',
          }}
        />
        <div className="ab-cta-inner max-w-2xl mx-auto text-center">
          <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent/60 mb-4">
            Birlikte Çalışalım
          </span>
          <h2 className="font-body text-[clamp(1.8rem,4vw,2.8rem)] font-light tracking-tight leading-[1.2] mb-6">
            <span className="text-t1">Projenizi </span>
            <span className="gradient-text font-semibold">konuşalım</span>
          </h2>
          <p className="font-body text-[1rem] text-t2 font-light mb-10 leading-[1.8] max-md:text-[0.9rem]">
            Dijital dönüşüm yolculuğunuzda size eşlik etmekten mutluluk duyarız. İlk keşif görüşmesi ücretsiz ve taahhütsüz.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-body text-[0.88rem] font-semibold tracking-[0.12em] uppercase bg-gradient-to-r from-accent to-accent2 text-bg transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(255,169,249,0.25)] hover:scale-[1.02]"
            >
              Teklif Al
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="mailto:info@beracore.com"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-body text-[0.88rem] font-semibold tracking-[0.12em] uppercase border border-white/10 text-t1 transition-all duration-500 hover:-translate-y-1 hover:border-accent/30 hover:text-accent"
            >
              info@beracore.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
