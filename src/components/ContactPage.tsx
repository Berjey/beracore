'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollText from '@/components/ScrollText';
import { services } from '@/lib/services-data';

gsap.registerPlugin(ScrollTrigger);

type ContactMethod = {
  key: string;
  label: string;
  value: string;
  href: string;
  copyValue?: string;
  iconPath: string;
  detail: string;
};

const METHODS: ContactMethod[] = [
  {
    key: 'mail',
    label: 'E-posta',
    value: 'info@beracore.com',
    href: 'mailto:info@beracore.com',
    copyValue: 'info@beracore.com',
    iconPath: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
    detail: '24 saat içinde yanıt',
  },
  {
    key: 'phone',
    label: 'Telefon',
    value: '0850 302 69 50',
    href: 'tel:+908503026950',
    copyValue: '+908503026950',
    iconPath: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
    detail: 'Hafta içi 09:00 — 18:00',
  },
  {
    key: 'office',
    label: 'Stüdyo',
    value: 'İstanbul, Türkiye',
    href: '',
    iconPath: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    detail: 'Görüşme randevu ile',
  },
];

const QUICK_STATS = [
  { value: '< 4 sa.', label: 'İlk geri dönüş' },
  { value: '48 sa.', label: 'Detaylı teklif' },
  { value: '0 ₺', label: 'Keşif görüşmesi' },
  { value: 'NDA', label: 'İsteğe bağlı' },
];

const BUDGETS = [
  '₺50K — ₺150K',
  '₺150K — ₺400K',
  '₺400K — ₺1M',
  '₺1M +',
  'Kararsızım',
];

const TIMELINES = [
  'Hemen başlamalıyım',
  '1 ay içinde',
  '1 — 3 ay',
  '3+ ay',
  'Esnek',
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Talebiniz bize ulaşır',
    time: '0 saat',
    desc: 'Formu gönderdiğiniz anda çekirdek ekibimize düşer; proje uzmanımız dosyanızı açar.',
    iconPath: 'M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z',
  },
  {
    step: '02',
    title: 'Keşif görüşmesi',
    time: '24 saat',
    desc: '30 dakikalık ücretsiz keşif görüşmesinde hedefinizi, kısıtlarınızı ve beklentilerinizi dinliyoruz.',
    iconPath: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  },
  {
    step: '03',
    title: 'Detaylı teklif',
    time: '48 saat',
    desc: 'Kapsam, süreç, ekip yapısı, yatırım ve teslim takvimini içeren bağlayıcı bir teklif hazırlıyoruz.',
    iconPath: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  },
  {
    step: '04',
    title: 'Projeye başlangıç',
    time: '1 hafta',
    desc: 'Sözleşme imzası sonrası kick-off toplantısı; tüm kanallarınız açılır, ilk sprint başlar.',
    iconPath: 'M5 12h14 M12 5l7 7-7 7',
  },
];

const FAQ = [
  {
    q: 'Keşif görüşmesi gerçekten ücretsiz mi?',
    a: 'Evet, tamamen ücretsiz ve bağlayıcı değildir. 30 dakikalık çağrıda ihtiyaçlarınızı dinler, stratejik yönlendirme yaparız. İşimizi üstlenmek zorunda değilsiniz; çıkan teklifi değerlendirip kararınızı daha sonra da verebilirsiniz.',
  },
  {
    q: 'Teklif almak için hangi bilgileri hazırlamalıyım?',
    a: 'Net bir brief şart değil. Hedefinizi bir iki cümleyle anlatmanız yeterli; ihtiyacınızı formun adımlarında beraber netleştiririz. Mevcut marka dokümanı, referans örnekler veya kısmi brief elinizde varsa süreci hızlandırır.',
  },
  {
    q: 'NDA (gizlilik sözleşmesi) imzalıyor musunuz?',
    a: 'Evet. Talep ederseniz keşif görüşmesinden önce karşılıklı gizlilik sözleşmesi imzalıyoruz. Hassas finansal veri, özgün fikir ya da patent öncesi çalışmalar için bu standart pratiğimizdir.',
  },
  {
    q: 'Proje süresince nasıl iletişim kuracağız?',
    a: 'Her projeye ayrılmış bir Slack / WhatsApp kanalı, haftalık ilerleme görüşmesi ve canlı proje panosu (Notion / Linear) sağlıyoruz. Karar sürecinizde tam şeffaflıkla yanınızdayız.',
  },
  {
    q: 'Sadece belirli hizmetlerinizi alabilir miyim?',
    a: 'Elbette. Hizmetlerimiz modüler. Tek başına UI/UX, sadece dijital pazarlama ya da yalnızca blockchain entegrasyonu olarak çalışabiliriz. Uçtan uca tek paket şart değil.',
  },
];

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const [selectedService, setSelectedService] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedTimeline, setSelectedTimeline] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', message: '',
  });
  const [copied, setCopied] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // ========== GSAP MASTER EFFECT ==========
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let ctx: gsap.Context | null = null;

    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // ===== HERO intro timeline =====
        const heroTl = gsap.timeline({ delay: 0.15 });
        heroTl
          .fromTo('.ct-hero-label',
            { y: 20, opacity: 0, letterSpacing: '0.8em' },
            { y: 0, opacity: 1, letterSpacing: '0.5em', duration: 0.9, ease: 'power3.out' })
          .fromTo('.ct-char-main',
            { y: 60, opacity: 0, rotationX: -80 },
            { y: 0, opacity: 1, rotationX: 0, duration: 0.8, stagger: 0.035, ease: 'power3.out' },
            '-=0.3')
          .fromTo('.ct-char-accent',
            { y: 60, opacity: 0, rotationX: -80 },
            { y: 0, opacity: 1, rotationX: 0, duration: 0.8, stagger: 0.035, ease: 'power3.out' },
            '-=0.5')
          .fromTo('.ct-accent-glow',
            { opacity: 0, scale: 0.4 },
            { opacity: 0.45, scale: 1, duration: 1.3, ease: 'power2.out' },
            '-=0.6')
          .fromTo('.ct-hero-desc',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out' },
            '-=0.4')
          .fromTo('.ct-hero-line',
            { scaleX: 0 },
            { scaleX: 1, duration: 1.4, ease: 'power2.out' },
            '-=0.6')
          .fromTo('.ct-qstat',
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.08 },
            '-=0.9');

        // Orbital rings
        gsap.to('.ct-orbit-1', { rotation: 360, duration: 80, repeat: -1, ease: 'none' });
        gsap.to('.ct-orbit-2', { rotation: -360, duration: 110, repeat: -1, ease: 'none' });
        gsap.to('.ct-orbit-3', { rotation: 360, duration: 150, repeat: -1, ease: 'none' });

        // Floating orbs
        gsap.to('.ct-orb', {
          y: '+=24', duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut',
          stagger: { each: 0.4, from: 'random' },
        });

        // Core breathing
        gsap.to('.ct-core', {
          scale: 1.55, opacity: 0.7, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.4,
        });
        gsap.to('.ct-accent-glow', {
          opacity: 0.6, scale: 1.15, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2,
        });

        // ===== HERO scroll exit =====
        gsap.to('.ct-hero', {
          y: -80, scale: 0.92, opacity: 0, filter: 'blur(6px)',
          scrollTrigger: { trigger: '.ct-hero-section', start: 'top top', end: 'bottom 40%', scrub: 0.5 },
        });
        gsap.to('.ct-hero-line', {
          opacity: 0, scaleX: 0.3,
          scrollTrigger: { trigger: '.ct-hero-section', start: 'top top', end: 'bottom 40%', scrub: 0.5 },
        });
        gsap.to('.ct-hero-orbits', {
          scale: 1.6, opacity: 0.3, rotate: 20,
          scrollTrigger: { trigger: '.ct-hero-section', start: 'top top', end: 'bottom top', scrub: 0.8 },
        });
        gsap.to('.ct-core', {
          scale: 0, opacity: 0,
          scrollTrigger: { trigger: '.ct-hero-section', start: 'top top', end: 'bottom 50%', scrub: 0.4 },
        });
        container.querySelectorAll<HTMLElement>('.ct-orb').forEach((orb, i) => {
          const speed = 1.2 + (i % 5) * 0.5;
          gsap.to(orb, {
            y: -600 * speed, opacity: 0,
            scrollTrigger: { trigger: '.ct-hero-section', start: 'top top', end: 'bottom top', scrub: 0.3 },
          });
        });
        gsap.to('.ct-hero-ambient', {
          scale: 1.4, opacity: 0.4,
          scrollTrigger: { trigger: '.ct-hero-section', start: 'top top', end: 'bottom 50%', scrub: 0.6 },
        });

        // ===== METHODS =====
        gsap.fromTo('.ct-methods-head',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.ct-methods', start: 'top 85%', toggleActions: 'play none none reverse' } });
        container.querySelectorAll<HTMLElement>('.ct-method').forEach((card, i) => {
          gsap.fromTo(card,
            { opacity: 0, y: 60, scale: 0.92, rotationX: -12, rotationY: i === 0 ? -8 : i === 2 ? 8 : 0 },
            {
              opacity: 1, y: 0, scale: 1, rotationX: 0, rotationY: 0, ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 88%', end: 'top 55%', scrub: 0.5 },
            });
        });

        // ===== FORM =====
        gsap.fromTo('.ct-form-head',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.ct-form-section', start: 'top 85%', toggleActions: 'play none none reverse' } });
        gsap.fromTo('.ct-form-step',
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.15,
            scrollTrigger: { trigger: '.ct-form-section', start: 'top 75%', toggleActions: 'play none none reverse' },
          });

        // Progress line on form
        gsap.fromTo('.ct-form-progress',
          { scaleY: 0 },
          {
            scaleY: 1, ease: 'none',
            scrollTrigger: { trigger: '.ct-form-progress-wrap', start: 'top 70%', end: 'bottom 60%', scrub: 0.3 },
          });

        // ===== PROCESS TIMELINE =====
        gsap.fromTo('.ct-process-head',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.ct-process', start: 'top 85%', toggleActions: 'play none none reverse' } });
        gsap.fromTo('.ct-process-line',
          { scaleY: 0 },
          {
            scaleY: 1, ease: 'none',
            scrollTrigger: { trigger: '.ct-process', start: 'top 70%', end: 'bottom 60%', scrub: 0.3 },
          });
        container.querySelectorAll<HTMLElement>('.ct-process-step').forEach((el, idx) => {
          const isLeft = idx % 2 === 0;
          gsap.fromTo(el,
            { opacity: 0, x: isLeft ? -60 : 60, y: 30 },
            {
              opacity: 1, x: 0, y: 0, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 55%', scrub: 0.5 },
            });
        });
        container.querySelectorAll<HTMLElement>('.ct-process-dot').forEach((el) => {
          gsap.fromTo(el,
            { scale: 0 },
            {
              scale: 1, ease: 'back.out(2)',
              scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 55%', scrub: 0.3 },
            });
        });

        // ===== FAQ =====
        gsap.fromTo('.ct-faq-head',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.ct-faq', start: 'top 85%', toggleActions: 'play none none reverse' } });
        gsap.fromTo('.ct-faq-item',
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08,
            scrollTrigger: { trigger: '.ct-faq', start: 'top 80%', toggleActions: 'play none none reverse' },
          });

        // ===== CTA =====
        gsap.fromTo('.ct-cta-inner',
          { y: 40, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: '.ct-cta', start: 'top 85%', toggleActions: 'play none none reverse' } });

        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, container);
    }, 400);

    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  // ========== Hover tilt for method cards ==========
  const handleTilt = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -8;
    const ry = ((x / rect.width) - 0.5) * 10;
    gsap.to(card, { rotationX: rx, rotationY: ry, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  };
  const handleTiltLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
  };

  // ========== Magnetic submit button ==========
  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = submitBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.22, y: y * 0.22, duration: 0.4, ease: 'power2.out' });
  };
  const handleMagneticLeave = () => {
    if (!submitBtnRef.current) return;
    gsap.to(submitBtnRef.current, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.4)' });
  };

  // ========== Copy handler ==========
  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* noop */
    }
  };

  // ========== Form submit ==========
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Teklif Talebi${selectedService ? ` — ${selectedService}` : ''}`);
    const body = encodeURIComponent(
      `Ad Soyad: ${formData.name}\n` +
      `E-posta: ${formData.email}\n` +
      `Telefon: ${formData.phone}\n` +
      `Şirket: ${formData.company}\n` +
      `Hizmet: ${selectedService || 'Belirtilmedi'}\n` +
      `Bütçe: ${selectedBudget || 'Belirtilmedi'}\n` +
      `Takvim: ${selectedTimeline || 'Belirtilmedi'}\n\n` +
      `Proje Detayları:\n${formData.message}`
    );
    window.location.href = `mailto:info@beracore.com?subject=${subject}&body=${body}`;
  };

  return (
    <div ref={containerRef}>
      {/* ========== HERO ========== */}
      <section className="ct-hero-section relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 overflow-hidden">
        {/* Ambient glow */}
        <div
          className="ct-hero-ambient pointer-events-none absolute inset-0 -z-30"
          style={{
            background:
              'radial-gradient(900px 500px at 50% 35%, rgba(255,169,249,0.09), transparent 60%), radial-gradient(700px 400px at 70% 70%, rgba(255,247,173,0.05), transparent 60%)',
          }}
        />

        {/* Orbital rings */}
        <div className="ct-hero-orbits pointer-events-none absolute inset-0 -z-20 flex items-center justify-center">
          {/* Core */}
          <div
            className="ct-core absolute rounded-full"
            style={{
              width: 8, height: 8,
              background: 'radial-gradient(circle, #ffffff 0%, #ffa9f9 50%, transparent 80%)',
              boxShadow: '0 0 24px rgba(255,169,249,0.8), 0 0 60px rgba(255,247,173,0.4)',
            }}
            aria-hidden="true"
          />

          {/* Ring 1 */}
          <div className="ct-orbit-1 absolute max-md:!w-[360px] max-md:!h-[360px]" style={{ width: 480, height: 480 }}>
            <div className="w-full h-full rounded-full" style={{ border: '1px solid rgba(255,247,173,0.14)' }} />
            {[0, 120, 240].map((angle) => (
              <div key={angle} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }} aria-hidden="true">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                  style={{ background: '#fff7ad', boxShadow: '0 0 10px #fff7ad, 0 0 20px rgba(255,247,173,0.6)' }} />
              </div>
            ))}
          </div>

          {/* Ring 2 */}
          <div className="ct-orbit-2 absolute max-md:!w-[520px] max-md:!h-[520px]" style={{ width: 700, height: 700 }}>
            <div className="w-full h-full rounded-full" style={{ border: '1px dashed rgba(255,169,249,0.12)' }} />
            {[60, 180, 300].map((angle) => (
              <div key={angle} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }} aria-hidden="true">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ background: '#ffa9f9', boxShadow: '0 0 8px #ffa9f9, 0 0 18px rgba(255,169,249,0.6)' }} />
              </div>
            ))}
          </div>

          {/* Ring 3 */}
          <div className="ct-orbit-3 absolute max-md:!w-[720px] max-md:!h-[720px]" style={{ width: 950, height: 950 }}>
            <div className="w-full h-full rounded-full"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, rgba(255,169,249,0.18) 45deg, transparent 90deg, transparent 270deg, rgba(255,247,173,0.14) 315deg, transparent 360deg)',
                WebkitMask:
                  'radial-gradient(circle, transparent 99%, #000 100%), radial-gradient(circle, #000 99.5%, transparent 100%)',
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
                padding: '1px',
              }} />
          </div>
        </div>

        {/* Floating orbs */}
        <div className="ct-hero-orbs pointer-events-none absolute inset-0 -z-10">
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
            <span key={i} className="ct-orb absolute rounded-full"
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

        {/* Hero content */}
        <div className="ct-hero relative max-w-4xl mx-auto">
          <span className="ct-hero-label inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/70 mb-7">
            İletişim
          </span>

          <h1 className="font-body text-[clamp(2.4rem,6vw,4.6rem)] font-light leading-[1.05] tracking-tight mb-8" style={{ perspective: '1000px' }}>
            <span className="inline-block text-t1 mr-[0.3em]">
              {Array.from('Dijitalin').map((ch, i) => (
                <span key={i} className="ct-char-main inline-block" style={{ willChange: 'transform, opacity' }}>{ch}</span>
              ))}
            </span>
            <span className="relative inline-block font-semibold">
              <span className="ct-accent-glow pointer-events-none absolute inset-0 -z-10 blur-[40px]"
                style={{ background: 'linear-gradient(135deg, #ffa9f9, #fff7ad)', borderRadius: '50%' }}
                aria-hidden="true" />
              {Array.from('Eşiğindesiniz.').map((ch, i) => (
                <span key={i} className="ct-char-accent inline-block"
                  style={{
                    background: 'linear-gradient(135deg, #ffa9f9, #fff7ad)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent', color: 'transparent',
                    willChange: 'transform, opacity',
                  }}>
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </span>
          </h1>

          <p className="ct-hero-desc font-body text-[clamp(1rem,1.8vw,1.15rem)] text-t2 font-light leading-[1.8] max-w-2xl mx-auto">
            Fikrinizi <span className="text-t1 font-medium">48 saat içinde</span> somut bir teklife dönüştürüyoruz.
            Keşif görüşmesi ücretsiz, tamamen bağlayıcı değildir — sadece dinlemek için yanınızdayız.
          </p>

          {/* Quick stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {QUICK_STATS.map((s, i) => {
              const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
              return (
                <div key={s.label} className="ct-qstat text-center">
                  <div className="font-heading font-bold text-[clamp(1.1rem,2.2vw,1.55rem)] gradient-text leading-none mb-1.5">
                    {s.value}
                  </div>
                  <div className="font-body text-[0.65rem] font-semibold tracking-[0.2em] uppercase"
                    style={{ color: `${accent}aa` }}>
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ct-hero-line mt-14 h-px w-full max-w-md origin-center"
          style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), var(--color-accent2), transparent)' }} />
      </section>

      {/* ========== CONTACT METHODS ========== */}
      <section className="ct-methods relative py-24 px-6 max-md:py-16">
        <div className="max-w-[1100px] mx-auto">
          <div className="ct-methods-head text-center mb-14 max-md:mb-10">
            <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent/60 mb-4">
              Doğrudan Kanallar
            </span>
            <h2 className="font-body text-[clamp(1.8rem,3.8vw,2.6rem)] font-light tracking-tight leading-[1.2]">
              <ScrollText before="Üç tıkla " accent="bize ulaşın." />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: '1400px' }}>
            {METHODS.map((m, i) => {
              const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
              const Wrapper: React.ElementType = m.href ? 'a' : 'div';
              return (
                <Wrapper
                  key={m.key}
                  {...(m.href ? { href: m.href } : {})}
                  onMouseMove={handleTilt}
                  onMouseLeave={handleTiltLeave}
                  className="ct-method group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-400 hover:border-white/[0.18] hover:bg-white/[0.035] cursor-pointer max-md:p-6"
                  style={{ '--accent': accent, transformStyle: 'preserve-3d' } as React.CSSProperties}
                >
                  {/* Accent border glow hover */}
                  <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: `0 0 0 1px ${accent} inset, 0 0 24px ${accent}44, 0 0 50px ${accent}1a` }}
                    aria-hidden="true" />

                  {/* Cursor radial */}
                  <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(280px circle at var(--mx) var(--my), ${accent}14, transparent 70%)` }}
                    aria-hidden="true" />

                  {/* Corner brackets */}
                  {([
                    ['top-2.5 left-2.5', 'TL'],
                    ['top-2.5 right-2.5', 'TR'],
                    ['bottom-2.5 left-2.5', 'BL'],
                    ['bottom-2.5 right-2.5', 'BR'],
                  ] as const).map(([pos, key]) => (
                    <span key={key} aria-hidden="true"
                      className={`pointer-events-none absolute w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out ${pos}`}
                      style={{
                        ...(key.startsWith('T') && { borderTop: `1.5px solid ${accent}` }),
                        ...(key.startsWith('B') && { borderBottom: `1.5px solid ${accent}` }),
                        ...(key.endsWith('L') && { borderLeft: `1.5px solid ${accent}` }),
                        ...(key.endsWith('R') && { borderRight: `1.5px solid ${accent}` }),
                        [`border${key.startsWith('T') ? 'Top' : 'Bottom'}${key.endsWith('L') ? 'Left' : 'Right'}Radius`]: '8px',
                        filter: `drop-shadow(0 0 6px ${accent}88)`,
                      }} />
                  ))}

                  <div className="relative flex flex-col items-start gap-4">
                    {/* Icon */}
                    <div className="inline-flex w-12 h-12 rounded-xl items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6"
                      style={{ background: `${accent}14`, boxShadow: `0 0 0 1px ${accent}30 inset, 0 0 24px ${accent}22` }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d={m.iconPath} />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <div className="font-body text-[0.65rem] font-semibold tracking-[0.3em] uppercase mb-2" style={{ color: `${accent}99` }}>
                        {m.label}
                      </div>
                      <div className="font-heading text-[1.15rem] font-semibold text-t1 mb-1.5 transition-colors duration-400 group-hover:text-[color:var(--accent)]">
                        {m.value}
                      </div>
                      <div className="font-body text-[0.78rem] text-t3 font-light">
                        {m.detail}
                      </div>
                    </div>

                    {/* Footer row: copy + arrow */}
                    <div className="w-full pt-4 mt-2 flex items-center justify-between border-t transition-colors duration-400"
                      style={{ borderColor: `${accent}1a` }}>
                      {m.copyValue ? (
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCopy(m.copyValue!, m.key); }}
                          className="font-body text-[0.7rem] font-semibold tracking-[0.15em] uppercase transition-colors duration-400 hover:text-t1"
                          style={{ color: `${accent}aa` }}>
                          {copied === m.key ? 'Kopyalandı ✓' : 'Kopyala'}
                        </button>
                      ) : (
                        <span className="font-body text-[0.7rem] font-semibold tracking-[0.15em] uppercase" style={{ color: `${accent}aa` }}>
                          Randevu İle
                        </span>
                      )}

                      {m.href && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-400 ease-out group-hover:translate-x-1 group-hover:scale-110"
                          style={{ background: `${accent}14`, boxShadow: `0 0 0 1px ${accent}33 inset` }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== FORM (multi-step in one view) ========== */}
      <section className="ct-form-section relative py-28 px-6 border-t border-b border-border overflow-hidden max-md:py-20"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(255,169,249,0.025) 50%, transparent)' }}>
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(900px 400px at 50% 50%, rgba(255,169,249,0.05), transparent 70%)' }} />

        <div className="max-w-[980px] mx-auto">
          <div className="ct-form-head text-center mb-14 max-md:mb-10">
            <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
              Teklif Formu
            </span>
            <h2 className="font-body text-[clamp(1.8rem,3.8vw,2.6rem)] font-light tracking-tight leading-[1.2] mb-5">
              <ScrollText before="Hikâyenizi " accent="anlatın." />
            </h2>
            <p className="font-body text-[0.95rem] text-t2 font-light max-w-xl mx-auto leading-relaxed">
              4 adım, 2 dakika. Formu doldurun; 4 saat içinde sizinle iletişime geçelim.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative grid grid-cols-[auto,1fr] gap-6 max-md:grid-cols-1 max-md:gap-4">
            {/* Step progress rail (vertical on desktop) */}
            <div className="ct-form-progress-wrap relative max-md:hidden">
              <div className="absolute left-[22px] top-2 bottom-2 w-px bg-white/[0.06]" />
              <div
                className="ct-form-progress absolute left-[22px] top-2 bottom-2 w-px origin-top"
                style={{ background: 'linear-gradient(180deg, #ffa9f9, #fff7ad)' }}
              />
              <div className="relative flex flex-col gap-[280px] pt-2 max-lg:gap-[320px]">
                {['01', '02', '03', '04'].map((n, i) => {
                  const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
                  return (
                    <div key={n} className="relative flex items-center">
                      <span className="w-11 h-11 rounded-full flex items-center justify-center font-heading text-[0.78rem] font-bold border relative z-10"
                        style={{
                          background: 'var(--color-bg)',
                          color: accent,
                          borderColor: `${accent}44`,
                          boxShadow: `0 0 0 3px rgba(26,26,26,1), 0 0 18px ${accent}44`,
                        }}>
                        {n}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Steps content */}
            <div className="flex flex-col gap-10">
              {/* Step 01 — Kim konuşuyor */}
              <div className="ct-form-step">
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-heading text-[0.72rem] font-bold tracking-[0.2em] uppercase text-accent md:hidden">01 /</span>
                  <h3 className="font-heading text-[1.15rem] font-semibold text-t1">Sizi tanıyalım</h3>
                  <span className="font-body text-[0.7rem] text-t3 font-light">Zorunlu alanlar *</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldInput type="text" placeholder="Ad Soyad *" required value={formData.name}
                    onChange={(v) => setFormData(p => ({ ...p, name: v }))} />
                  <FieldInput type="email" placeholder="E-posta *" required value={formData.email}
                    onChange={(v) => setFormData(p => ({ ...p, email: v }))} />
                  <FieldInput type="tel" placeholder="Telefon" value={formData.phone}
                    onChange={(v) => setFormData(p => ({ ...p, phone: v }))} />
                  <FieldInput type="text" placeholder="Şirket Adı" value={formData.company}
                    onChange={(v) => setFormData(p => ({ ...p, company: v }))} />
                </div>
              </div>

              {/* Step 02 — Hizmet */}
              <div className="ct-form-step">
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-heading text-[0.72rem] font-bold tracking-[0.2em] uppercase text-accent2 md:hidden">02 /</span>
                  <h3 className="font-heading text-[1.15rem] font-semibold text-t1">İlgilendiğiniz hizmet</h3>
                  <span className="font-body text-[0.7rem] text-t3 font-light">Birden fazla olabilir</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {services.map((svc) => {
                    const active = selectedService === svc.title;
                    return (
                      <button
                        key={svc.key}
                        type="button"
                        onClick={() => setSelectedService(active ? '' : svc.title)}
                        className={`px-4 py-2.5 rounded-xl font-body text-[0.82rem] font-medium border transition-all duration-300
                          ${active
                            ? 'border-accent/40 bg-accent/10 text-accent -translate-y-0.5'
                            : 'border-white/[0.08] bg-white/[0.02] text-t2 hover:border-accent/20 hover:text-t1 hover:-translate-y-0.5'}`}>
                        {svc.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 03 — Bütçe + Takvim */}
              <div className="ct-form-step grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-baseline gap-3 mb-5">
                    <span className="font-heading text-[0.72rem] font-bold tracking-[0.2em] uppercase text-accent md:hidden">03 /</span>
                    <h3 className="font-heading text-[1.05rem] font-semibold text-t1">Öngörülen Bütçe</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {BUDGETS.map((b) => {
                      const active = selectedBudget === b;
                      return (
                        <button key={b} type="button" onClick={() => setSelectedBudget(active ? '' : b)}
                          className={`px-3.5 py-2 rounded-lg font-body text-[0.78rem] font-medium border transition-all duration-300
                            ${active
                              ? 'border-accent/40 bg-accent/10 text-accent'
                              : 'border-white/[0.08] bg-white/[0.02] text-t2 hover:border-accent/20 hover:text-t1'}`}>
                          {b}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-3 mb-5">
                    <h3 className="font-heading text-[1.05rem] font-semibold text-t1">Zaman Çizelgesi</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TIMELINES.map((t) => {
                      const active = selectedTimeline === t;
                      return (
                        <button key={t} type="button" onClick={() => setSelectedTimeline(active ? '' : t)}
                          className={`px-3.5 py-2 rounded-lg font-body text-[0.78rem] font-medium border transition-all duration-300
                            ${active
                              ? 'border-accent2/40 bg-accent2/10 text-accent2'
                              : 'border-white/[0.08] bg-white/[0.02] text-t2 hover:border-accent2/20 hover:text-t1'}`}>
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 04 — Detay */}
              <div className="ct-form-step">
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-heading text-[0.72rem] font-bold tracking-[0.2em] uppercase text-accent2 md:hidden">04 /</span>
                  <h3 className="font-heading text-[1.15rem] font-semibold text-t1">Projeniz hakkında</h3>
                  <span className="font-body text-[0.7rem] text-t3 font-light">Zorunlu *</span>
                </div>
                <FieldTextarea
                  placeholder="Kısaca hedefinizi, mevcut durumu ve beklentilerinizi paylaşın. Detaylı teklif için referans bağlantılar varsa ekleyebilirsiniz."
                  required
                  value={formData.message}
                  onChange={(v) => setFormData(p => ({ ...p, message: v }))}
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  ref={submitBtnRef}
                  type="submit"
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  className="group relative w-full py-5 rounded-2xl font-body text-[0.9rem] font-semibold tracking-[0.15em] uppercase
                    bg-gradient-to-r from-accent to-accent2 text-bg overflow-hidden transition-shadow duration-500
                    hover:shadow-[0_16px_48px_rgba(255,169,249,0.28)]">
                  <span className="relative z-10 inline-flex items-center justify-center gap-3">
                    Teklif Talebini Gönder
                    <svg className="transition-transform duration-400 group-hover:translate-x-1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                  {/* Shimmer */}
                  <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)' }} />
                </button>

                <p className="mt-5 text-center font-body text-[0.78rem] text-t3 font-light">
                  veya doğrudan{' '}
                  <a href="mailto:info@beracore.com" className="text-accent hover:underline">info@beracore.com</a>
                  {' '}adresine yazın · Verileriniz yalnızca teklif sürecinde kullanılır.
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ========== PROCESS TIMELINE ========== */}
      <section className="ct-process relative py-28 px-6 overflow-hidden max-md:py-20">
        <div className="max-w-[1100px] mx-auto">
          <div className="ct-process-head text-center mb-16 max-md:mb-12">
            <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent/60 mb-4">
              Süreç
            </span>
            <h2 className="font-body text-[clamp(1.8rem,3.8vw,2.6rem)] font-light tracking-tight leading-[1.2] mb-5">
              <ScrollText before="Formu gönderdikten " accent="sonra." />
            </h2>
            <p className="font-body text-[0.95rem] text-t2 font-light max-w-xl mx-auto leading-relaxed">
              Şeffaf, hızlı ve baskısız. İlk temas ile proje başlangıcı arasında neler olduğunu önceden bilin.
            </p>
          </div>

          <div className="relative">
            {/* Vertical center line */}
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px bg-white/[0.05] max-md:hidden" />
            <div
              className="ct-process-line pointer-events-none absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px origin-top max-md:hidden"
              style={{ background: 'linear-gradient(180deg, transparent, #ffa9f9, #fff7ad, transparent)' }}
            />

            <div className="relative space-y-14 max-md:space-y-10">
              {PROCESS_STEPS.map((s, i) => {
                const isLeft = i % 2 === 0;
                const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
                return (
                  <div key={s.step} className="ct-process-step relative grid grid-cols-[1fr,auto,1fr] gap-6 max-md:grid-cols-1 max-md:gap-4">
                    {/* Left / card (desktop alternates) */}
                    <div className={`${isLeft ? 'md:order-1' : 'md:order-3'} max-md:order-2`}>
                      <div className="relative p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.15] transition-all duration-400 max-md:p-5"
                        style={{ '--accent': accent } as React.CSSProperties}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: `${accent}14`, boxShadow: `0 0 0 1px ${accent}30 inset` }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                              <path d={s.iconPath} />
                            </svg>
                          </div>
                          <div>
                            <div className="font-body text-[0.65rem] font-semibold tracking-[0.25em] uppercase" style={{ color: `${accent}aa` }}>
                              Adım {s.step} · {s.time}
                            </div>
                            <h3 className="font-heading text-[1.1rem] font-semibold text-t1 mt-0.5">{s.title}</h3>
                          </div>
                        </div>
                        <p className="font-body text-[0.9rem] text-t2 font-light leading-[1.7]">{s.desc}</p>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="order-2 md:order-2 relative w-11 flex justify-center max-md:hidden">
                      <span className="ct-process-dot absolute top-6 w-4 h-4 rounded-full"
                        style={{
                          background: `radial-gradient(circle, ${accent} 0%, ${accent}66 60%, transparent 100%)`,
                          boxShadow: `0 0 0 3px rgba(26,26,26,1), 0 0 18px ${accent}88`,
                        }} />
                    </div>

                    {/* Empty balance side */}
                    <div className={`${isLeft ? 'md:order-3' : 'md:order-1'} max-md:hidden`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="ct-faq relative py-28 px-6 border-t border-border max-md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="ct-faq-head text-center mb-14 max-md:mb-10">
            <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
              Sık Sorulanlar
            </span>
            <h2 className="font-body text-[clamp(1.8rem,3.8vw,2.6rem)] font-light tracking-tight leading-[1.2]">
              <ScrollText before="Teklif öncesi " accent="akıldakiler." />
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ.map((item, i) => {
              const open = openFaq === i;
              const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
              return (
                <div key={item.q}
                  className="ct-faq-item group relative rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden transition-all duration-400"
                  style={{
                    borderColor: open ? `${accent}30` : undefined,
                    background: open ? `linear-gradient(180deg, ${accent}08, transparent)` : undefined,
                  }}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 p-6 text-left max-md:p-5">
                    <span className="font-heading text-[1rem] font-semibold text-t1 pr-4 max-md:text-[0.95rem]">
                      {item.q}
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
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="ct-cta relative py-28 px-6 overflow-hidden max-md:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,169,249,0.06) 0%, transparent 60%)' }} />

        <div className="ct-cta-inner max-w-3xl mx-auto text-center">
          <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent/60 mb-4">
            Henüz Hazır Değil Misiniz?
          </span>
          <h2 className="font-body text-[clamp(1.8rem,4vw,2.8rem)] font-light tracking-tight leading-[1.2] mb-6">
            <span className="text-t1">Önce </span>
            <span className="gradient-text font-semibold">hizmetleri keşfedin</span>
            <span className="text-t1">.</span>
          </h2>
          <p className="font-body text-[1rem] text-t2 font-light mb-10 leading-[1.8] max-md:text-[0.9rem]">
            İhtiyacınız netleşmediyse, hizmet sayfalarımızda alt başlıklar ve örnek kullanım senaryolarıyla
            birlikte ayrıntılı bilgi bulabilirsiniz.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto mb-10">
            {services.map((svc, i) => {
              const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
              return (
                <Link key={svc.key} href={`/hizmetler/${svc.key}/${svc.subServices[0].slug}`}
                  className="group flex items-center gap-2.5 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.015] hover:border-accent/20 hover:bg-white/[0.03] transition-all duration-400">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 transition-transform duration-400 group-hover:scale-150"
                    style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
                  <span className="font-body text-[0.82rem] font-medium text-t1 group-hover:text-accent transition-colors text-left">
                    {svc.title}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/hakkimizda"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-body text-[0.85rem] font-semibold tracking-[0.12em] uppercase border border-white/10 text-t1 transition-all duration-500 hover:-translate-y-1 hover:border-accent/30 hover:text-accent">
              Biz Kimiz
            </Link>
            <a href="mailto:info@beracore.com"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-body text-[0.85rem] font-semibold tracking-[0.12em] uppercase border border-white/10 text-t1 transition-all duration-500 hover:-translate-y-1 hover:border-accent2/30 hover:text-accent2">
              info@beracore.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ======== Reusable inputs (with inline focus animation) ========
function FieldInput({
  type, placeholder, required, value, onChange,
}: {
  type: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative group">
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-5 py-4 rounded-xl font-body text-[0.9rem] text-t1 bg-white/[0.03] border border-white/[0.08] placeholder:text-t3/60
          focus:border-accent/40 focus:bg-white/[0.05] focus:outline-none transition-all duration-300"
      />
      <span className="pointer-events-none absolute left-5 right-5 bottom-[11px] h-px origin-left scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out"
        style={{ background: 'linear-gradient(90deg, #ffa9f9, #fff7ad)' }} />
    </div>
  );
}

function FieldTextarea({
  placeholder, required, value, onChange,
}: {
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative group">
      <textarea
        placeholder={placeholder}
        required={required}
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-5 py-4 rounded-xl font-body text-[0.9rem] text-t1 bg-white/[0.03] border border-white/[0.08] placeholder:text-t3/60 resize-none
          focus:border-accent/40 focus:bg-white/[0.05] focus:outline-none transition-all duration-300"
      />
      <span className="pointer-events-none absolute left-5 right-5 bottom-[11px] h-px origin-left scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out"
        style={{ background: 'linear-gradient(90deg, #ffa9f9, #fff7ad)' }} />
    </div>
  );
}
