'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services } from '@/lib/services-data';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE = [
  { year: '2019', title: 'Kuruluş', desc: 'BERACORE, İstanbul\'da dijital deneyim stüdyosu olarak kuruldu. İlk projelerle web tasarım ve yazılım geliştirme alanında hizmet vermeye başladık.' },
  { year: '2020', title: 'Büyüme', desc: 'Ekibimizi genişlettik, mobil uygulama ve e-ticaret çözümlerini portföyümüze ekledik. İlk kurumsal müşterilerimizle çalışmaya başladık.' },
  { year: '2021', title: 'Blockchain', desc: 'Blockchain ve fintech alanına giriş yaptık. İlk kripto para borsası ve akıllı kontrat projelerimizi hayata geçirdik.' },
  { year: '2022', title: 'AI Entegrasyonu', desc: 'Yapay zeka ve otomasyon hizmetlerini eklemeye başladık. Chatbot, veri analizi ve süreç otomasyonu çözümleri geliştirdik.' },
  { year: '2023', title: 'Uluslararası', desc: 'Uluslararası projelere imza attık. Dijital pazarlama ve marka kimliği hizmetlerimizi genişlettik.' },
  { year: '2024', title: 'Full-Stack Studio', desc: 'AI, blockchain, yazılım, tasarım, e-ticaret ve pazarlama — 6 ana alanda 23 hizmetle uçtan uca dijital çözümler sunuyoruz.' },
];

const VALUES = [
  { icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', title: 'İnovasyon', desc: 'En yeni teknolojileri takip ediyor, projelerinize entegre ediyoruz.' },
  { icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', title: 'İş Birliği', desc: 'Her projeyi ortaklık ruhuyla yürütüyor, başarıyı birlikte inşa ediyoruz.' },
  { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Güvenilirlik', desc: 'Şeffaf süreçler, zamanında teslimat ve en yüksek güvenlik standartları.' },
  { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Performans', desc: 'Her projede hız, ölçeklenebilirlik ve optimizasyonu ön planda tutuyoruz.' },
];

const STATS = [
  { value: '120+', label: 'Tamamlanan Proje' },
  { value: '50+', label: 'Mutlu Müşteri' },
  { value: '6', label: 'Hizmet Alanı' },
  { value: '23', label: 'Alt Hizmet' },
  { value: '%98', label: 'Memnuniyet' },
  { value: '7/24', label: 'Destek' },
];

const TEAM = [
  { name: 'Berk Alanel', role: 'Kurucu & CEO', desc: 'Full-stack geliştirici, blockchain mühendisi. 6+ yıl dijital proje deneyimi.' },
  { name: 'Teknik Ekip', role: 'Yazılım & Mühendislik', desc: 'React, Node.js, Solidity, Flutter, Python uzmanlarından oluşan çekirdek geliştirme ekibi.' },
  { name: 'Tasarım Ekibi', role: 'UI/UX & Marka', desc: 'Figma, motion design ve marka stratejisi konularında uzman yaratıcı ekip.' },
  { name: 'Pazarlama Ekibi', role: 'Dijital Pazarlama', desc: 'SEO, Google Ads, sosyal medya ve içerik stratejisi alanlarında deneyimli uzmanlar.' },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTimeline, setActiveTimeline] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
    ctx = gsap.context(() => {

      // Hero
      gsap.fromTo('.ab-hero-label', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3,
      });
      gsap.fromTo('.ab-hero-title', { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.5,
      });
      gsap.fromTo('.ab-hero-desc', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8,
      });
      gsap.fromTo('.ab-hero-line', { scaleX: 0 }, {
        scaleX: 1, duration: 1.5, ease: 'power2.out', delay: 1.1,
      });

      // Story
      gsap.fromTo('.ab-story-head', { y: 50, opacity: 0 }, {
        y: 0, opacity: 1,
        scrollTrigger: { trigger: '.ab-story', start: 'top 88%', end: 'top 42%', scrub: 0.15 },
      });
      gsap.fromTo('.ab-story-text', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1,
        scrollTrigger: { trigger: '.ab-story', start: 'top 85%', end: 'top 42%', scrub: 0.15 },
      });

      // Stats
      container.querySelectorAll('.ab-stat').forEach((el, i) => {
        gsap.fromTo(el, { y: 40, opacity: 0, scale: 0.92 }, {
          y: 0, opacity: 1, scale: 1,
          scrollTrigger: { trigger: '.ab-stats', start: `top ${80 - i * 3}%`, end: `top ${55 - i * 3}%`, scrub: 0.12 },
        });
      });

      // Values
      gsap.fromTo('.ab-values-head', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1,
        scrollTrigger: { trigger: '.ab-values', start: 'top 88%', end: 'top 42%', scrub: 0.15 },
      });
      container.querySelectorAll('.ab-value-card').forEach((card, i) => {
        gsap.fromTo(card, { x: i % 2 === 0 ? -40 : 40, y: 30, opacity: 0 }, {
          x: 0, y: 0, opacity: 1,
          scrollTrigger: { trigger: card, start: 'top 92%', end: 'top 48%', scrub: 0.15 },
        });
      });

      // Timeline
      gsap.fromTo('.ab-tl-head', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1,
        scrollTrigger: { trigger: '.ab-timeline', start: 'top 88%', end: 'top 42%', scrub: 0.15 },
      });
      gsap.fromTo('.ab-tl-line', { scaleY: 0 }, {
        scaleY: 1,
        scrollTrigger: { trigger: '.ab-timeline', start: 'top 55%', end: 'bottom 75%', scrub: 0.1 },
      });
      container.querySelectorAll('.ab-tl-item').forEach((item, i) => {
        gsap.fromTo(item, { x: i % 2 === 0 ? -60 : 60, opacity: 0 }, {
          x: 0, opacity: 1,
          scrollTrigger: { trigger: item, start: 'top 90%', end: 'top 45%', scrub: 0.15 },
          onStart: () => setActiveTimeline(i),
        });
      });

      // Team
      gsap.fromTo('.ab-team-head', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1,
        scrollTrigger: { trigger: '.ab-team', start: 'top 88%', end: 'top 42%', scrub: 0.15 },
      });
      container.querySelectorAll('.ab-team-card').forEach((card, i) => {
        gsap.fromTo(card, { y: 50, opacity: 0, scale: 0.95 }, {
          y: 0, opacity: 1, scale: 1,
          scrollTrigger: { trigger: card, start: 'top 92%', end: 'top 48%', scrub: 0.15 },
          delay: i * 0.05,
        });
      });

      // CTA
      gsap.fromTo('.ab-cta-inner', { y: 50, opacity: 0, scale: 0.96 }, {
        y: 0, opacity: 1, scale: 1,
        scrollTrigger: { trigger: '.ab-cta', start: 'top 88%', end: 'top 42%', scrub: 0.15 },
      });

    }, container);
    }, 800);

    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  return (
    <div ref={containerRef}>

      {/* ===== HERO ===== */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(255,169,249,0.06) 0%, rgba(255,247,173,0.02) 35%, transparent 65%)' }} />

        <span className="ab-hero-label font-body text-[0.75rem] font-semibold tracking-[0.5em] uppercase text-accent2/50 mb-6 opacity-0">
          Bizi Tanıyın
        </span>

        <h1 className="ab-hero-title font-body text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.08] mb-8 max-w-4xl opacity-0">
          <span className="text-t1">Dijitalin </span>
          <span className="gradient-text">Çekirdeğindeyiz</span>
        </h1>

        <p className="ab-hero-desc font-body text-[clamp(1rem,2vw,1.2rem)] text-t2 font-light leading-relaxed max-w-2xl mb-12 opacity-0">
          BERACORE olarak yapay zeka, blockchain, yazılım geliştirme, tasarım ve dijital pazarlama alanlarında
          markanızı geleceğe taşıyoruz. Strateji, estetik ve mühendisliği bir araya getiren multidisipliner ekibiz.
        </p>

        <div className="ab-hero-line h-px w-full max-w-md origin-center"
          style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), var(--color-accent2), transparent)' }} />
      </section>

      {/* ===== STORY ===== */}
      <section className="ab-story py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="ab-story-head mb-10">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-accent/40" />
              <span className="font-body text-[0.7rem] font-semibold tracking-[0.4em] uppercase text-accent/60">Hikayemiz</span>
              <div className="w-8 h-px bg-accent/40" />
            </div>
            <h2 className="font-body text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold">
              <span className="gradient-text">Nereden Geldik?</span>
            </h2>
          </div>
          <div className="ab-story-text space-y-6">
            <p className="font-body text-[clamp(1rem,1.8vw,1.12rem)] text-t2 font-light leading-[1.9]">
              2019 yılında İstanbul&apos;da kurulan BERACORE, dijital dünyada fark yaratan projeler üretme vizyonuyla yola çıktı.
              İlk günden itibaren &ldquo;kalıpların dışında düşünmek&rdquo; felsefemiz oldu — her projeye özgün bir bakış açısı, her müşteriye özel bir çözüm.
            </p>
            <p className="font-body text-[clamp(1rem,1.8vw,1.12rem)] text-t2 font-light leading-[1.9]">
              Bugün yapay zeka, blockchain, web ve mobil yazılım, UI/UX tasarım, e-ticaret ve dijital pazarlama alanlarında
              120&apos;den fazla başarılı projeye imza attık. Küçük startup&apos;lardan kurumsal şirketlere kadar geniş bir yelpazede,
              müşterilerimizin dijital dönüşüm yolculuğunda güvenilir ortakları olduk.
            </p>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="ab-stats py-20 px-6"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(255,169,249,0.03), transparent)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="ab-stat relative text-center p-6 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden group hover:border-accent/15 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="font-body text-[clamp(1.8rem,3.5vw,2.5rem)] font-bold gradient-text mb-1 leading-none">{stat.value}</div>
                <div className="font-body text-[0.72rem] text-t2 tracking-wide font-medium uppercase">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="ab-values py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="ab-values-head text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-accent2/40" />
              <span className="font-body text-[0.7rem] font-semibold tracking-[0.4em] uppercase text-accent2/60">Değerlerimiz</span>
              <div className="w-8 h-px bg-accent2/40" />
            </div>
            <h2 className="font-body text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold">
              <span className="gradient-text">Bizi Biz Yapan</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <div key={v.title} className="ab-value-card group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden
                hover:border-accent/20 transition-all duration-500 hover:-translate-y-1">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                  style={{ background: `linear-gradient(to bottom, ${i % 2 === 0 ? '#ffa9f9' : '#fff7ad'}, transparent)` }} />
                <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-accent2/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: i % 2 === 0 ? 'rgba(255,169,249,0.08)' : 'rgba(255,247,173,0.08)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={i % 2 === 0 ? '#ffa9f9' : '#fff7ad'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={v.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-body text-[1.1rem] font-semibold text-t1 mb-2 group-hover:text-accent transition-colors duration-300">{v.title}</h3>
                    <p className="font-body text-[0.9rem] text-t2 font-light leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="ab-timeline py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="ab-tl-head text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-accent/40" />
              <span className="font-body text-[0.7rem] font-semibold tracking-[0.4em] uppercase text-accent/60">Yolculuk</span>
              <div className="w-8 h-px bg-accent/40" />
            </div>
            <h2 className="font-body text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold">
              <span className="gradient-text">Zaman Çizelgemiz</span>
            </h2>
          </div>

          <div className="relative">
            <div className="ab-tl-line absolute left-8 top-0 bottom-0 w-px origin-top max-md:left-5"
              style={{ background: 'linear-gradient(180deg, var(--color-accent), var(--color-accent2), transparent)' }} />

            <div className="space-y-14">
              {TIMELINE.map((item, i) => (
                <div key={item.year} className="ab-tl-item flex gap-8 items-start pl-20 relative max-md:pl-14 max-md:gap-5">
                  <div className={`absolute left-[26px] top-1 w-4 h-4 rounded-full border-2 transition-all duration-500 max-md:left-[14px]
                    ${activeTimeline >= i
                      ? 'border-accent bg-accent/20 shadow-[0_0_14px_rgba(255,169,249,0.4)]'
                      : 'border-white/20 bg-transparent'}`}
                  />
                  <div>
                    <span className="inline-block px-3 py-1 rounded-lg font-body text-[0.7rem] font-bold tracking-wider mb-2"
                      style={{ background: i % 2 === 0 ? 'rgba(255,169,249,0.1)' : 'rgba(255,247,173,0.1)', color: i % 2 === 0 ? '#ffa9f9' : '#fff7ad' }}>
                      {item.year}
                    </span>
                    <h3 className="font-body text-[1.15rem] font-semibold text-t1 mb-2">{item.title}</h3>
                    <p className="font-body text-[0.9rem] text-t2 font-light leading-relaxed max-w-lg">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section className="ab-team py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="ab-team-head text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-accent2/40" />
              <span className="font-body text-[0.7rem] font-semibold tracking-[0.4em] uppercase text-accent2/60">Ekip</span>
              <div className="w-8 h-px bg-accent2/40" />
            </div>
            <h2 className="font-body text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold">
              <span className="gradient-text">Arkasındaki Ekip</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <div key={member.name} className="ab-team-card group relative p-7 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden text-center
                hover:border-accent/20 transition-all duration-500 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-[1.2rem] font-bold"
                    style={{ background: i % 2 === 0 ? 'rgba(255,169,249,0.1)' : 'rgba(255,247,173,0.1)', color: i % 2 === 0 ? '#ffa9f9' : '#fff7ad' }}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="font-body text-[1rem] font-semibold text-t1 mb-1 group-hover:text-accent transition-colors duration-300">{member.name}</h3>
                  <span className="font-body text-[0.72rem] font-medium tracking-wider uppercase gradient-text block mb-3">{member.role}</span>
                  <p className="font-body text-[0.82rem] text-t2 font-light leading-relaxed">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TECH & SERVICES ===== */}
      <section className="py-28 px-6"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(255,169,249,0.03), transparent)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-accent/40" />
              <span className="font-body text-[0.7rem] font-semibold tracking-[0.4em] uppercase text-accent/60">Uzmanlık</span>
              <div className="w-8 h-px bg-accent/40" />
            </div>
            <h2 className="font-body text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold">
              <span className="gradient-text">Hizmet Alanlarımız</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc, i) => (
              <Link
                key={svc.key}
                href={`/hizmetler/${svc.key}/${svc.subServices[0].slug}`}
                className="group relative p-7 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden
                  hover:border-accent/20 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-accent2/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <h3 className="font-body text-[1.1rem] font-semibold gradient-text mb-2">{svc.title}</h3>
                  <p className="font-body text-[0.82rem] text-t2 font-light mb-3">{svc.subtitle}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {svc.subServices.slice(0, 3).map((ss) => (
                      <span key={ss.slug} className="px-2 py-0.5 rounded-md font-body text-[0.62rem] text-t2/70 border border-white/[0.05] bg-white/[0.02]">
                        {ss.title}
                      </span>
                    ))}
                    {svc.subServices.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md font-body text-[0.62rem] text-accent/50">+{svc.subServices.length - 3}</span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-body text-[0.73rem] font-semibold tracking-wider uppercase text-accent/50 group-hover:text-accent transition-all duration-300 group-hover:gap-2.5">
                    Keşfet
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="ab-cta py-28 px-6 relative">
        <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(255,169,249,0.05) 0%, transparent 60%)' }} />
        <div className="ab-cta-inner max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-px bg-accent/40" />
            <span className="font-body text-[0.7rem] font-semibold tracking-[0.4em] uppercase text-accent/60">Birlikte Çalışalım</span>
            <div className="w-8 h-px bg-accent/40" />
          </div>
          <h2 className="font-body text-[clamp(1.8rem,4vw,2.8rem)] font-semibold mb-6">
            <span className="gradient-text">Projenizi Konuşalım</span>
          </h2>
          <p className="font-body text-[1.1rem] text-t2 font-light mb-12 leading-relaxed">
            Dijital dönüşüm yolculuğunuzda BERACORE ekibi yanınızda. İlk adımı atın — keşif görüşmesi ücretsiz.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a href="mailto:info@beracore.com"
              className="inline-flex items-center gap-3 px-11 py-5 rounded-2xl font-body text-[0.9rem] font-semibold tracking-wider uppercase
                bg-gradient-to-r from-accent to-accent2 text-bg transition-all duration-500
                hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(255,169,249,0.25)] hover:scale-[1.02]">
              Teklif Al
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a href="tel:+908503026950"
              className="inline-flex items-center gap-2 px-8 py-5 rounded-2xl font-body text-[0.9rem] font-semibold tracking-wider uppercase
                border border-white/10 text-t1 transition-all duration-500
                hover:-translate-y-1 hover:border-accent/30 hover:text-accent">
              0850 302 69 50
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
