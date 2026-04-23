'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollText from '@/components/ScrollText';
import { services } from '@/lib/services-data';
import { kvkkMeta, kvkkSections } from '@/lib/kvkk-data';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// DATA
// ============================================================

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
    detail: 'Aynı gün içinde yanıt',
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
  { value: 'Aynı gün', label: 'İlk geri dönüş' },
  { value: '3 — 5 gün', label: 'Detaylı teklif' },
  { value: 'Ücretsiz', label: 'Keşif görüşmesi' },
  { value: 'Talep üzerine', label: 'NDA sözleşmesi' },
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
    time: 'Aynı gün',
    desc: 'Formu gönderdiğiniz anda çekirdek ekibimize düşer; proje uzmanımız dosyanızı açar ve ilk değerlendirmeyi yapar.',
    iconPath: 'M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z',
  },
  {
    step: '02',
    title: 'Keşif görüşmesi',
    time: '1 — 2 gün',
    desc: '30 dakikalık ücretsiz online keşif görüşmesinde hedefinizi, kısıtlarınızı ve beklentilerinizi dinliyoruz.',
    iconPath: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  },
  {
    step: '03',
    title: 'Detaylı teklif',
    time: '3 — 5 gün',
    desc: 'Kapsam, süreç, ekip yapısı, yatırım ve teslim takvimini içeren bağlayıcı bir teklif hazırlıyoruz.',
    iconPath: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  },
  {
    step: '04',
    title: 'Projeye başlangıç',
    time: '1 — 2 hafta',
    desc: 'Sözleşme imzası sonrası kick-off toplantısı; iletişim kanallarınız açılır, ekip atanır ve ilk sprint başlar.',
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  consent: boolean;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;
type SubmitState = 'idle' | 'loading' | 'success' | 'error';

const INITIAL_FORM: FormState = {
  name: '', email: '', phone: '', company: '',
  service: '', budget: '', timeline: '',
  message: '', consent: false,
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState<string>('');
  const [copied, setCopied] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // KVKK modal — aynı sayfada açılan onay akışı
  const [kvkkOpen, setKvkkOpen] = useState(false);
  const [kvkkReadEnd, setKvkkReadEnd] = useState(false);
  const kvkkScrollRef = useRef<HTMLDivElement>(null);

  // ----- Helpers -----
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }));
  };

  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    if (form.name.trim().length < 2) e.name = 'Ad Soyad en az 2 karakter olmalı.';
    if (!EMAIL_RE.test(form.email.trim())) e.email = 'Geçerli bir e-posta adresi girin.';
    if (form.message.trim().length < 10) e.message = 'Mesaj en az 10 karakter olmalı.';
    if (!form.consent) e.consent = 'KVKK aydınlatma metnini onaylamalısınız.';
    return e;
  };

  // ----- Submit -----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitState === 'loading') return;

    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) {
      // Scroll to first error
      const firstKey = Object.keys(v)[0];
      const el = containerRef.current?.querySelector<HTMLElement>(`[data-field="${firstKey}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Shake submit
      gsap.fromTo(submitBtnRef.current, { x: 0 },
        { x: 0, duration: 0.4, keyframes: [{ x: -8 }, { x: 8 }, { x: -6 }, { x: 6 }, { x: 0 }] });
      return;
    }

    setSubmitState('loading');
    setSubmitError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim(),
          service: form.service,
          budget: form.budget,
          timeline: form.timeline,
          message: form.message.trim(),
          consent: form.consent,
          hp: '',
        }),
      });

      if (res.ok) {
        setSubmitState('success');
        return;
      }

      const data: { error?: string; fields?: FieldErrors } = await res.json().catch(() => ({}));
      if (res.status === 422 && data.fields) {
        setErrors(data.fields);
        setSubmitState('idle');
        return;
      }
      const msg =
        data.error === 'mail_not_configured'
          ? 'Mail sunucusu henüz yapılandırılmadı. Lütfen info@beracore.com adresine yazın.'
          : 'Talep gönderilemedi. Birkaç saniye sonra tekrar deneyin ya da info@beracore.com adresine yazın.';
      setSubmitError(msg);
      setSubmitState('error');
    } catch {
      setSubmitError('Bağlantı hatası. İnternet bağlantınızı kontrol edip tekrar deneyin.');
      setSubmitState('error');
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitState('idle');
    setSubmitError('');
  };

  // ----- Copy to clipboard with fallback -----
  const handleCopy = async (value: string, key: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch { /* noop */ }
  };

  // ----- Tilt + magnetic -----
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

  // ============================================================
  // GSAP MASTER TIMELINE
  // ============================================================
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let ctx: gsap.Context | null = null;

    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // ===== HERO =====
        const heroTl = gsap.timeline({ delay: 0.05 });
        heroTl
          .fromTo('.ct-hero-label',
            { y: 14, opacity: 0, letterSpacing: '0.7em' },
            { y: 0, opacity: 1, letterSpacing: '0.5em', duration: 0.5, ease: 'power3.out' })
          .fromTo('.ct-char-main',
            { y: 40, opacity: 0, rotationX: -60 },
            { y: 0, opacity: 1, rotationX: 0, duration: 0.5, stagger: 0.02, ease: 'power3.out' },
            '-=0.25')
          .fromTo('.ct-char-accent',
            { y: 40, opacity: 0, rotationX: -60 },
            { y: 0, opacity: 1, rotationX: 0, duration: 0.5, stagger: 0.02, ease: 'power3.out' },
            '-=0.35')
          .fromTo('.ct-accent-glow',
            { opacity: 0, scale: 0.5 },
            { opacity: 0.45, scale: 1, duration: 0.8, ease: 'power2.out' },
            '-=0.45')
          .fromTo('.ct-hero-desc',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' },
            '-=0.35')
          .fromTo('.ct-hero-line',
            { scaleX: 0 },
            { scaleX: 1, duration: 0.9, ease: 'power2.out' },
            '-=0.45')
          .fromTo('.ct-qstat',
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.05 },
            '-=0.7');

        gsap.to('.ct-orbit-1', { rotation: 360, duration: 80, repeat: -1, ease: 'none' });
        gsap.to('.ct-orbit-2', { rotation: -360, duration: 110, repeat: -1, ease: 'none' });
        gsap.to('.ct-orbit-3', { rotation: 360, duration: 150, repeat: -1, ease: 'none' });
        gsap.to('.ct-orb', {
          y: '+=24', duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut',
          stagger: { each: 0.4, from: 'random' },
        });
        gsap.to('.ct-core', {
          scale: 1.55, opacity: 0.7, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.4,
        });
        gsap.to('.ct-accent-glow', {
          opacity: 0.6, scale: 1.15, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2,
        });

        // Hero exit
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
        gsap.fromTo('.ct-form-card',
          { y: 50, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '.ct-form-section', start: 'top 75%', toggleActions: 'play none none reverse' } });
        gsap.fromTo('.ct-form-step',
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12,
            scrollTrigger: { trigger: '.ct-form-section', start: 'top 70%', toggleActions: 'play none none reverse' },
          });

        // ===== PROCESS =====
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
        container.querySelectorAll<HTMLElement>('.ct-process-step').forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, x: 40, y: 20 },
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

  // ----- KVKK modal — body scroll lock + ESC + scroll-to-end tracking -----
  useEffect(() => {
    if (!kvkkOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setKvkkOpen(false);
    };
    window.addEventListener('keydown', onKey);

    // Küçük metinlerde scroll gerekmeyebilir → ilk render'da bitişi işaretle
    const el = kvkkScrollRef.current;
    if (el && el.scrollHeight - el.clientHeight <= 8) {
      setKvkkReadEnd(true);
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [kvkkOpen]);

  const openKvkk = () => {
    setKvkkReadEnd(false);
    setKvkkOpen(true);
    requestAnimationFrame(() => {
      if (kvkkScrollRef.current) kvkkScrollRef.current.scrollTop = 0;
    });
  };

  const handleKvkkScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 24) {
      setKvkkReadEnd(true);
    }
  };

  const acceptKvkk = () => {
    set('consent', true);
    setKvkkOpen(false);
  };

  // Progress counter (completed fields in core steps)
  const completed = [
    form.name.trim().length >= 2,
    EMAIL_RE.test(form.email.trim()),
    form.service.length > 0,
    form.message.trim().length >= 10,
  ].filter(Boolean).length;

  // Form başarıyla gönderildiğinde tüm sayfayı kaplayan success ekranı göster.
  // Hero, methods, form, process, FAQ, CTA section'ları gizlenir.
  if (submitState === 'success') {
    return <SuccessState name={form.name} onReset={resetForm} />;
  }

  return (
    <>
    <div ref={containerRef}>
      {/* ========================================================
          HERO
          ======================================================== */}
      <section className="ct-hero-section relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 overflow-hidden">
        <div
          className="ct-hero-ambient pointer-events-none absolute inset-0 -z-30"
          style={{
            background:
              'radial-gradient(900px 500px at 50% 35%, rgba(255,169,249,0.09), transparent 60%), radial-gradient(700px 400px at 70% 70%, rgba(255,247,173,0.05), transparent 60%)',
          }}
        />

        <div className="ct-hero-orbits pointer-events-none absolute inset-0 -z-20 flex items-center justify-center">
          <div className="ct-core absolute rounded-full"
            style={{
              width: 8, height: 8,
              background: 'radial-gradient(circle, #ffffff 0%, #ffa9f9 50%, transparent 80%)',
              boxShadow: '0 0 24px rgba(255,169,249,0.8), 0 0 60px rgba(255,247,173,0.4)',
            }} aria-hidden="true" />

          <div className="ct-orbit-1 absolute max-md:!w-[360px] max-md:!h-[360px]" style={{ width: 480, height: 480 }}>
            <div className="w-full h-full rounded-full" style={{ border: '1px solid rgba(255,247,173,0.14)' }} />
            {[0, 120, 240].map((angle) => (
              <div key={angle} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }} aria-hidden="true">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                  style={{ background: '#fff7ad', boxShadow: '0 0 10px #fff7ad, 0 0 20px rgba(255,247,173,0.6)' }} />
              </div>
            ))}
          </div>
          <div className="ct-orbit-2 absolute max-md:!w-[520px] max-md:!h-[520px]" style={{ width: 700, height: 700 }}>
            <div className="w-full h-full rounded-full" style={{ border: '1px dashed rgba(255,169,249,0.12)' }} />
            {[60, 180, 300].map((angle) => (
              <div key={angle} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }} aria-hidden="true">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ background: '#ffa9f9', boxShadow: '0 0 8px #ffa9f9, 0 0 18px rgba(255,169,249,0.6)' }} />
              </div>
            ))}
          </div>
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
            Fikrinizi <span className="text-t1 font-medium">birkaç gün içinde</span> somut bir teklife dönüştürüyoruz.
            Keşif görüşmesi ücretsiz, tamamen bağlayıcı değildir — sadece dinlemek için yanınızdayız.
          </p>

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

      {/* ========================================================
          CONTACT METHODS
          ======================================================== */}
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
              return (
                <div
                  key={m.key}
                  onMouseMove={handleTilt}
                  onMouseLeave={handleTiltLeave}
                  className="ct-method group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-400 hover:border-white/[0.18] hover:bg-white/[0.035] max-md:p-6"
                  style={{ '--accent': accent, transformStyle: 'preserve-3d' } as React.CSSProperties}
                >
                  <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: `0 0 0 1px ${accent} inset, 0 0 24px ${accent}44, 0 0 50px ${accent}1a` }}
                    aria-hidden="true" />
                  <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(280px circle at var(--mx) var(--my), ${accent}14, transparent 70%)` }}
                    aria-hidden="true" />

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
                    <div className="inline-flex w-12 h-12 rounded-xl items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6"
                      style={{ background: `${accent}14`, boxShadow: `0 0 0 1px ${accent}30 inset, 0 0 24px ${accent}22` }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d={m.iconPath} />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0 w-full">
                      <div className="font-body text-[0.65rem] font-semibold tracking-[0.3em] uppercase mb-2" style={{ color: `${accent}99` }}>
                        {m.label}
                      </div>
                      {m.href ? (
                        <a href={m.href}
                          className="font-heading text-[1.1rem] font-semibold text-t1 mb-1.5 transition-colors duration-400 hover:text-[color:var(--accent)] block truncate">
                          {m.value}
                        </a>
                      ) : (
                        <div className="font-heading text-[1.1rem] font-semibold text-t1 mb-1.5">
                          {m.value}
                        </div>
                      )}
                      <div className="font-body text-[0.78rem] text-t3 font-light">
                        {m.detail}
                      </div>
                    </div>

                    <div className="w-full pt-4 mt-2 flex items-center justify-between border-t transition-colors duration-400"
                      style={{ borderColor: `${accent}1a` }}>
                      {m.copyValue ? (
                        <button
                          type="button"
                          onClick={() => handleCopy(m.copyValue!, m.key)}
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
                        <a href={m.href}
                          aria-label={`${m.label} aç`}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-400 ease-out hover:translate-x-1 hover:scale-110"
                          style={{ background: `${accent}14`, boxShadow: `0 0 0 1px ${accent}33 inset` }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          FORM — consolidated card
          ======================================================== */}
      <section className="ct-form-section relative py-28 px-6 border-t border-b border-border overflow-hidden max-md:py-20"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(255,169,249,0.025) 50%, transparent)' }}>
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(900px 400px at 50% 50%, rgba(255,169,249,0.05), transparent 70%)' }} />

        <div className="max-w-[880px] mx-auto">
          <div className="ct-form-head text-center mb-12 max-md:mb-10">
            <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
              Teklif Formu
            </span>
            <h2 className="font-body text-[clamp(1.8rem,3.8vw,2.6rem)] font-light tracking-tight leading-[1.2] mb-5">
              <ScrollText before="Hikâyenizi " accent="anlatın." />
            </h2>
            <p className="font-body text-[0.95rem] text-t2 font-light max-w-xl mx-auto leading-relaxed">
              4 alanı doldurun, 2 dakika sürer. Talebiniz aynı gün içinde ekibimize ulaşır.
            </p>
          </div>

          {/* Form Card — gradient border */}
          <div
            className="ct-form-card relative rounded-3xl p-[1.5px] overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,169,249,0.55) 0%, rgba(255,247,173,0.35) 30%, rgba(255,169,249,0.15) 55%, rgba(255,247,173,0.45) 100%)',
            }}
          >
            <div
              className="relative rounded-[calc(1.5rem-1.5px)] overflow-hidden"
              style={{
                background:
                  'linear-gradient(180deg, rgba(28,28,28,0.98), rgba(22,22,22,0.98))',
              }}
            >
            {/* Corner glow */}
            <span className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-60 blur-[80px]"
              style={{ background: 'radial-gradient(circle, rgba(255,169,249,0.18), transparent 70%)' }} aria-hidden="true" />
            <span className="pointer-events-none absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-50 blur-[80px]"
              style={{ background: 'radial-gradient(circle, rgba(255,247,173,0.14), transparent 70%)' }} aria-hidden="true" />

            {/* Form — success durumu component'in en üstünde yakalanıp
                tüm sayfayı kaplıyor, buraya hiç ulaşmaz */}
            <form onSubmit={handleSubmit} className="relative p-10 max-md:p-6" noValidate>
                {/* Progress summary */}
                <div className="mb-10 flex items-center justify-between gap-4 flex-wrap max-md:mb-8">
                  <div className="flex items-center gap-3">
                    <span className="font-body text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-t3">
                      İlerleme
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2, 3].map((i) => (
                        <span key={i}
                          className="w-6 h-1 rounded-full transition-all duration-500"
                          style={{
                            background: i < completed
                              ? 'linear-gradient(90deg, #ffa9f9, #fff7ad)'
                              : 'rgba(255,255,255,0.08)',
                            boxShadow: i < completed ? '0 0 8px rgba(255,169,249,0.5)' : 'none',
                          }} />
                      ))}
                    </div>
                    <span className="font-heading text-[0.78rem] font-bold gradient-text">
                      {completed}/4
                    </span>
                  </div>
                  <span className="font-body text-[0.7rem] text-t3 font-light">
                    * işaretli alanlar zorunlu
                  </span>
                </div>

                {/* Honeypot */}
                <div className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
                  <label>
                    Leave empty
                    <input type="text" name="hp" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                {/* Step 01 — İletişim */}
                <FormStep index={0} title="Sizi Tanıyalım" hint="Zorunlu alanlar *">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-md:gap-4">
                    <FloatingInput
                      id="f-name"
                      label="Ad Soyad"
                      type="text"
                      required
                      value={form.name}
                      onChange={(v) => set('name', v)}
                      error={errors.name}
                      autoComplete="name"
                    />
                    <FloatingInput
                      id="f-email"
                      label="E-posta"
                      type="email"
                      required
                      value={form.email}
                      onChange={(v) => set('email', v)}
                      error={errors.email}
                      autoComplete="email"
                    />
                    <FloatingInput
                      id="f-phone"
                      label="Telefon"
                      type="tel"
                      value={form.phone}
                      onChange={(v) => set('phone', v)}
                      error={errors.phone}
                      autoComplete="tel"
                    />
                    <FloatingInput
                      id="f-company"
                      label="Şirket Adı"
                      type="text"
                      value={form.company}
                      onChange={(v) => set('company', v)}
                      error={errors.company}
                      autoComplete="organization"
                    />
                  </div>
                </FormStep>

                {/* Step 02 — Hizmet */}
                <FormStep index={1} title="İlgilendiğiniz Hizmet" hint="Bir tanesini seçin">
                  <div className="flex flex-wrap gap-2" data-field="service">
                    {services.map((svc) => {
                      const active = form.service === svc.title;
                      return (
                        <button
                          key={svc.key}
                          type="button"
                          onClick={() => set('service', active ? '' : svc.title)}
                          className={`px-4 py-2.5 rounded-xl font-body text-[0.82rem] font-medium border transition-all duration-300
                            ${active
                              ? 'border-accent/40 bg-accent/10 text-accent -translate-y-0.5 shadow-[0_4px_16px_rgba(255,169,249,0.15)]'
                              : 'border-white/[0.08] bg-white/[0.02] text-t2 hover:border-accent/20 hover:text-t1 hover:-translate-y-0.5'}`}>
                          {svc.title}
                        </button>
                      );
                    })}
                  </div>
                </FormStep>

                {/* Step 03 — Bütçe + Takvim */}
                <FormStep index={2} title="Bütçe ve Zaman Çizelgesi" hint="Yaklaşık değerler yeterli">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-md:gap-5">
                    <div>
                      <div className="font-body text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-t3 mb-3">
                        Öngörülen Bütçe
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {BUDGETS.map((b) => {
                          const active = form.budget === b;
                          return (
                            <button key={b} type="button" onClick={() => set('budget', active ? '' : b)}
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
                      <div className="font-body text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-t3 mb-3">
                        Zaman Çizelgesi
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {TIMELINES.map((t) => {
                          const active = form.timeline === t;
                          return (
                            <button key={t} type="button" onClick={() => set('timeline', active ? '' : t)}
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
                </FormStep>

                {/* Step 04 — Detay */}
                <FormStep index={3} title="Projeniz Hakkında" hint="Zorunlu *" last>
                  <FloatingTextarea
                    id="f-message"
                    label="Proje Detayları"
                    placeholder="Kısaca hedefinizi, mevcut durumu ve beklentilerinizi paylaşın. Referans bağlantılar varsa ekleyebilirsiniz."
                    required
                    value={form.message}
                    onChange={(v) => set('message', v)}
                    error={errors.message}
                    maxLength={2000}
                  />
                </FormStep>

                {/* KVKK consent */}
                <div className="mt-6 pl-[64px] max-md:pl-0" data-field="consent">
                  <div className="flex items-start gap-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <span className="relative mt-0.5 shrink-0">
                        <input
                          type="checkbox"
                          checked={form.consent}
                          onChange={(e) => set('consent', e.target.checked)}
                          className="peer sr-only"
                        />
                        <span className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300
                          ${form.consent ? 'border-accent bg-accent/20' : errors.consent ? 'border-red-400/60 bg-red-500/5' : 'border-white/15 bg-white/[0.02] group-hover:border-accent/40'}`}>
                          {form.consent && (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffa9f9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                      </span>
                      <span className="font-body text-[0.8rem] text-t2 leading-relaxed font-light max-md:text-[0.78rem]">
                        Paylaştığım bilgilerin yalnızca teklif süreci için kullanılmasına onay veriyorum.
                      </span>
                    </label>
                  </div>
                  <div className="mt-2 ml-8">
                    <button
                      type="button"
                      onClick={openKvkk}
                      className="font-body text-[0.78rem] text-accent hover:underline underline-offset-2 cursor-pointer inline-flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                      KVKK aydınlatma metnini oku
                    </button>
                  </div>
                  {errors.consent && (
                    <p className="mt-2 ml-8 font-body text-[0.75rem] text-red-400/90">{errors.consent}</p>
                  )}
                </div>

                {/* Error banner */}
                {submitState === 'error' && submitError && (
                  <div className="mt-6 mx-auto max-w-md p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                    <div className="flex items-start gap-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <p className="font-body text-[0.85rem] text-red-300 leading-relaxed">{submitError}</p>
                    </div>
                  </div>
                )}

                {/* Submit — ortalanmış + sade */}
                <div className="mt-10 flex flex-col items-center">
                  <button
                    ref={submitBtnRef}
                    type="submit"
                    disabled={submitState === 'loading'}
                    className="group relative inline-flex items-center justify-center gap-2.5 px-10 py-3.5 rounded-xl font-body text-[0.78rem] font-semibold tracking-[0.15em] uppercase
                      bg-gradient-to-r from-accent to-accent2 text-bg transition-shadow duration-300
                      hover:shadow-[0_8px_24px_rgba(255,169,249,0.22)] disabled:opacity-70 disabled:cursor-not-allowed">
                    {submitState === 'loading' ? (
                      <>
                        <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="rgba(26,26,26,0.25)" strokeWidth="3" />
                          <path d="M22 12a10 10 0 01-10 10" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Gönderiliyor…
                      </>
                    ) : (
                      <>
                        Teklif Talebini Gönder
                        <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="mt-5 text-center font-body text-[0.76rem] text-t3 font-light max-w-md">
                    veya doğrudan{' '}
                    <a href="mailto:info@beracore.com" className="text-accent hover:underline">info@beracore.com</a>
                    {' '}adresine yazın · Verileriniz yalnızca teklif sürecinde kullanılır.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PROCESS TIMELINE
          ======================================================== */}
      <section className="ct-process relative py-28 px-6 overflow-hidden max-md:py-20">
        <div className="max-w-[880px] mx-auto">
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
            <div className="pointer-events-none absolute left-[22px] top-4 bottom-4 w-px bg-white/[0.05]" />
            <div
              className="ct-process-line pointer-events-none absolute left-[22px] top-4 bottom-4 w-px origin-top"
              style={{ background: 'linear-gradient(180deg, transparent, #ffa9f9, #fff7ad, transparent)' }}
            />

            <div className="relative space-y-10 max-md:space-y-7" style={{ perspective: '1400px' }}>
              {PROCESS_STEPS.map((s, i) => {
                const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
                return (
                  <div key={s.step} className="ct-process-step relative grid grid-cols-[auto,1fr] gap-6 max-md:gap-4">
                    <div className="relative flex justify-center w-11 shrink-0 pt-5">
                      <span
                        className="ct-process-dot relative z-10 w-4 h-4 rounded-full"
                        style={{
                          background: `radial-gradient(circle, ${accent} 0%, ${accent}66 60%, transparent 100%)`,
                          boxShadow: `0 0 0 4px var(--color-bg), 0 0 18px ${accent}88`,
                        }} />
                    </div>

                    <article
                      onMouseMove={handleTilt}
                      onMouseLeave={handleTiltLeave}
                      className="ct-process-card group relative p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-400 hover:border-white/[0.18] hover:bg-white/[0.035] cursor-default max-md:p-5 min-w-0"
                      style={{ '--accent': accent, transformStyle: 'preserve-3d' } as React.CSSProperties}>
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

                      <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6"
                            style={{ background: `${accent}14`, boxShadow: `0 0 0 1px ${accent}30 inset, 0 0 20px ${accent}22` }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                              <path d={s.iconPath} />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <div className="font-body text-[0.65rem] font-semibold tracking-[0.25em] uppercase" style={{ color: `${accent}aa` }}>
                              Adım {s.step} · {s.time}
                            </div>
                            <h3 className="font-heading text-[1.1rem] font-semibold text-t1 mt-0.5 transition-colors duration-400 group-hover:text-[color:var(--accent)] max-md:text-[1rem]">
                              {s.title}
                            </h3>
                          </div>
                        </div>
                        <p className="font-body text-[0.9rem] text-t2 font-light leading-[1.7] max-md:text-[0.85rem]">{s.desc}</p>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FAQ
          ======================================================== */}
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

      {/* ========================================================
          CTA
          ======================================================== */}
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

    {/* ============================================================
        KVKK MODAL — aynı sayfada scroll-gated onay akışı
        Kurumsal kimlik: #1a1a1a taban + pembe/sarı ambient glow,
        gradient ayraçlar, numaralı bölümler, dönüşümlü vurgu noktaları
        ============================================================ */}
    {kvkkOpen && (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="kvkk-modal-title"
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 max-md:p-2"
        onClick={(e) => { if (e.target === e.currentTarget) setKvkkOpen(false); }}
      >
        {/* backdrop — sitedeki derin ton + hafif bulanıklık */}
        <div className="absolute inset-0 bg-[rgba(10,10,10,0.72)] backdrop-blur-md" />

        {/* panel */}
        <div
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-white/[0.08] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
          style={{ background: 'var(--color-bg)' }}
        >
          {/* panel ambient glow — LegalLayout ile aynı ruh */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-0"
            style={{
              background:
                'radial-gradient(700px 360px at 20% 0%, rgba(255,169,249,0.09), transparent 60%), radial-gradient(600px 320px at 100% 100%, rgba(255,247,173,0.06), transparent 60%)',
            }}
          />

          {/* header */}
          <div className="relative flex items-start justify-between gap-4 px-8 pt-7 pb-6 shrink-0 max-md:px-5 max-md:pt-6 max-md:pb-5">
            <div className="min-w-0">
              <span className="inline-block font-body text-[0.68rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-3">
                {kvkkMeta.accent}
              </span>
              <h3
                id="kvkk-modal-title"
                className="font-heading text-[clamp(1.4rem,2.6vw,1.85rem)] font-bold tracking-tight leading-[1.15] gradient-text"
              >
                {kvkkMeta.title}
              </h3>
              <div className="mt-3 inline-flex items-center gap-2 font-body text-[0.72rem] text-t3 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-accent2/60" aria-hidden="true" />
                Son güncelleme: {kvkkMeta.lastUpdated}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setKvkkOpen(false)}
              aria-label="Kapat"
              className="shrink-0 w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-t2 hover:text-accent hover:border-accent/30 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ayraç — pembe → sarı → transparent */}
          <div
            aria-hidden="true"
            className="relative h-px w-full shrink-0"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,169,249,0.25), rgba(255,247,173,0.2), transparent)',
            }}
          />

          {/* scrollable body */}
          <div
            ref={kvkkScrollRef}
            onScroll={handleKvkkScroll}
            className="kvkk-scroll relative flex-1 overflow-y-auto px-8 py-7 max-md:px-5 max-md:py-6"
          >
            <p className="font-body text-[0.92rem] text-t2 font-light leading-[1.85] mb-9 max-md:text-[0.88rem] max-md:mb-7">
              {kvkkMeta.intro}
            </p>

            <div className="space-y-9 max-md:space-y-7">
              {kvkkSections.map((s, i) => {
                const dot = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
                return (
                  <section key={i}>
                    <h4 className="font-heading text-[1.08rem] font-bold text-t1 mb-3 leading-snug max-md:text-[1rem]">
                      <span
                        className="font-body text-[0.7rem] font-semibold tracking-[0.2em] mr-2.5 align-middle"
                        style={{ color: dot }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {s.title}
                    </h4>
                    {Array.isArray(s.body) ? (
                      <ul className="space-y-2 pl-1">
                        {s.body.map((item, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2.5 font-body text-[0.88rem] text-t2 font-light leading-[1.75] max-md:text-[0.84rem]"
                          >
                            <span
                              aria-hidden="true"
                              className="shrink-0 mt-[0.6em] w-1 h-1 rounded-full"
                              style={{ background: dot }}
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-body text-[0.88rem] text-t2 font-light leading-[1.8] max-md:text-[0.84rem]">
                        {s.body}
                      </p>
                    )}
                  </section>
                );
              })}
            </div>

            {/* metin sonu — gradient ayraç + etiket */}
            <div className="mt-10 mb-1 flex items-center gap-3 max-md:mt-8">
              <span
                aria-hidden="true"
                className="flex-1 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,247,173,0.25))',
                }}
              />
              <span className="font-body text-[0.68rem] font-semibold tracking-[0.3em] uppercase text-accent2/70">
                Metin Sonu
              </span>
              <span
                aria-hidden="true"
                className="flex-1 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(255,247,173,0.25), transparent)',
                }}
              />
            </div>
          </div>

          {/* footer ayraç — üstten pembe fade */}
          <div
            aria-hidden="true"
            className="relative h-px w-full shrink-0"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,169,249,0.22), rgba(255,247,173,0.18), transparent)',
            }}
          />

          {/* footer */}
          <div className="relative px-8 py-5 shrink-0 flex items-center justify-between gap-4 flex-wrap bg-white/[0.015] max-md:px-5 max-md:py-4">
            <p
              className={`font-body text-[0.78rem] leading-relaxed flex items-center gap-2 transition-colors duration-300 max-md:text-[0.74rem] ${
                kvkkReadEnd ? 'text-accent2' : 'text-t3'
              }`}
            >
              {kvkkReadEnd ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Metni sonuna kadar okudunuz.
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                  Onaylamak için metni sonuna kadar kaydırın.
                </>
              )}
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setKvkkOpen(false)}
                className="px-5 py-2.5 rounded-xl font-body text-[0.78rem] font-medium border border-white/[0.08] bg-white/[0.02] text-t2 hover:border-white/20 hover:text-t1 transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={acceptKvkk}
                disabled={!kvkkReadEnd}
                className="px-5 py-2.5 rounded-xl font-body text-[0.78rem] font-semibold tracking-[0.08em] uppercase bg-gradient-to-r from-accent to-accent2 text-bg transition-all duration-300 hover:shadow-[0_8px_24px_rgba(255,169,249,0.25)] disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                Okudum ve Onaylıyorum
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

// ============================================================
// SUCCESS STATE — tam sayfa (diğer section'ları gizler)
// ============================================================
function SuccessState({ name, onReset }: { name: string; onReset: () => void }) {
  const firstName = name ? name.trim().split(/\s+/)[0] : '';
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-28 overflow-hidden max-md:py-20">
      {/* Arka plan ambient glow — kurumsal kimlik */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1200px 650px at 50% 20%, rgba(255,169,249,0.09), transparent 60%), radial-gradient(900px 520px at 50% 85%, rgba(255,247,173,0.06), transparent 60%)',
        }}
      />

      {/* Kutlama ışık noktaları */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {[
          { t: '14%', l: '12%', s: 3, c: '#ffa9f9' },
          { t: '22%', l: '86%', s: 2.2, c: '#fff7ad' },
          { t: '42%', l: '8%', s: 1.8, c: '#fff7ad' },
          { t: '52%', l: '92%', s: 2, c: '#ffa9f9' },
          { t: '74%', l: '16%', s: 2.4, c: '#fff7ad' },
          { t: '82%', l: '82%', s: 2, c: '#ffa9f9' },
        ].map((o, i) => (
          <span key={i} className="absolute rounded-full animate-pulse"
            style={{
              top: o.t, left: o.l,
              width: `${o.s * 4}px`, height: `${o.s * 4}px`,
              background: o.c,
              boxShadow: `0 0 16px ${o.c}`,
              animationDelay: `${i * 0.35}s`,
            }} />
        ))}
      </div>

      <div className="relative max-w-2xl w-full text-center">
        {/* Check badge */}
        <div
          className="inline-flex w-28 h-28 rounded-full items-center justify-center mb-8 max-md:w-24 max-md:h-24"
          style={{
            background:
              'radial-gradient(circle, rgba(255,169,249,0.28) 0%, rgba(255,247,173,0.12) 50%, transparent 72%)',
            boxShadow:
              '0 0 0 1px rgba(255,169,249,0.35), 0 0 60px rgba(255,169,249,0.3)',
          }}
        >
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="url(#gradcheckFull)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="max-md:w-10 max-md:h-10">
            <defs>
              <linearGradient id="gradcheckFull" x1="0" y1="0" x2="24" y2="24">
                <stop offset="0" stopColor="#ffa9f9" />
                <stop offset="1" stopColor="#fff7ad" />
              </linearGradient>
            </defs>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <span className="inline-block font-body text-[0.75rem] font-semibold tracking-[0.5em] uppercase text-accent2/70 mb-5 max-md:text-[0.7rem] max-md:tracking-[0.4em]">
          Talep Alındı
        </span>

        <h1 className="font-body text-[clamp(2rem,4.5vw,3.2rem)] font-light tracking-tight leading-[1.15] mb-6 max-md:mb-5">
          <span className="text-t1">Teşekkürler{firstName ? `, ${firstName}` : ''} — </span>
          <span className="gradient-text font-semibold">ulaştık.</span>
        </h1>

        <p className="font-body text-[1rem] text-t2 font-light max-w-lg mx-auto leading-[1.8] mb-10 max-md:text-[0.92rem] max-md:mb-8">
          Talebiniz ekibimize düştü. <span className="text-t1 font-medium">Aynı gün içinde</span> size özel bir mesajla döneceğiz.
          Lütfen e-posta kutunuzu ve <span className="text-t1">spam klasörünüzü</span> kontrol edin.
        </p>

        {/* Sonraki adımlar — şeffaf zaman çizelgesi */}
        <div className="mb-10 max-md:mb-8">
          <div className="font-body text-[0.68rem] font-semibold tracking-[0.3em] uppercase text-t3 mb-4">
            Sonraki Adımlar
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 font-body text-[0.85rem] text-t2 font-light max-md:text-[0.8rem] max-md:gap-x-4">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
              Talep dosyası açılır (0-2 saat)
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent2" aria-hidden="true" />
              Proje uzmanı atanır (aynı gün)
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
              Keşif görüşmesi daveti (1-2 gün)
            </span>
          </div>
        </div>

        {/* Gradient ayraç — kurumsal kimlik */}
        <div
          aria-hidden="true"
          className="h-px w-full max-w-md mx-auto mb-10 max-md:mb-8"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,169,249,0.3), rgba(255,247,173,0.25), transparent)',
          }}
        />

        {/* Navigasyon */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-body text-[0.8rem] font-semibold tracking-[0.12em] uppercase border border-white/10 bg-white/[0.02] text-t1 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent max-md:text-[0.74rem] max-md:px-5 max-md:py-3"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12l9-9 9 9" /><path d="M5 10v11h14V10" />
            </svg>
            Ana Sayfa
          </Link>
          <Link
            href="/hakkimizda"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-body text-[0.8rem] font-semibold tracking-[0.12em] uppercase border border-white/10 bg-white/[0.02] text-t1 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent2/40 hover:text-accent2 max-md:text-[0.74rem] max-md:px-5 max-md:py-3"
          >
            Biz Kimiz
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-body text-[0.8rem] font-semibold tracking-[0.12em] uppercase bg-gradient-to-r from-accent to-accent2 text-bg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,169,249,0.3)] max-md:text-[0.74rem] max-md:px-5 max-md:py-3"
          >
            Yeni Talep Gönder
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Acil durum maili */}
        <p className="mt-10 font-body text-[0.78rem] text-t3 font-light max-md:text-[0.74rem] max-md:mt-8">
          Aciliyet durumunda{' '}
          <a href="mailto:info@beracore.com" className="text-accent hover:underline">
            info@beracore.com
          </a>
          {' '}adresine doğrudan yazabilirsiniz.
        </p>
      </div>
    </section>
  );
}

// ============================================================
// FORM STEP WITH NUMBERED BADGE
// ============================================================
function FormStep({
  index, title, hint, last, children,
}: {
  index: number;
  title: string;
  hint?: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  const accent = index % 2 === 0 ? '#ffa9f9' : '#fff7ad';
  const num = String(index + 1).padStart(2, '0');
  return (
    <div className="ct-form-step grid grid-cols-[auto,1fr] gap-5 mb-8 max-md:gap-4 max-md:mb-6 last:mb-0">
      <div className="relative flex flex-col items-center">
        <span
          className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center font-heading text-[0.78rem] font-bold border shrink-0"
          style={{
            background: 'var(--color-bg)',
            color: accent,
            borderColor: `${accent}44`,
            boxShadow: `0 0 0 3px var(--color-bg), 0 0 18px ${accent}44`,
          }}>
          {num}
        </span>
        {!last && (
          <span
            aria-hidden="true"
            className="flex-1 w-px mt-2 mb-[-2rem]"
            style={{ background: `linear-gradient(180deg, ${accent}44, transparent)` }} />
        )}
      </div>
      <div className="pt-1.5 min-w-0">
        <div className="flex items-baseline gap-3 mb-5 flex-wrap">
          <h3 className="font-heading text-[1.35rem] font-bold tracking-tight gradient-text leading-none max-md:text-[1.15rem]">
            {title}
          </h3>
          {hint && (
            <span className="font-body text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-t3">{hint}</span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

// ============================================================
// FLOATING LABEL INPUT
// ============================================================
function FloatingInput({
  id, label, type, value, onChange, required, error, autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}) {
  const hasValue = value.length > 0;
  const field = id.replace(/^f-/, '');
  return (
    <div className="relative" data-field={field}>
      <div className={`relative rounded-xl border transition-all duration-300
        ${error ? 'border-red-400/50 bg-red-500/[0.02]' : 'border-white/[0.08] bg-white/[0.03] focus-within:border-accent/40 focus-within:bg-white/[0.05]'}`}>
        <input
          id={id}
          type={type}
          value={value}
          required={required}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className="peer w-full px-5 pt-6 pb-2 bg-transparent font-body text-[0.9rem] text-t1 outline-none"
        />
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-5 font-body transition-all duration-200 ease-out
            ${hasValue
              ? 'top-2 text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-t3'
              : 'top-1/2 -translate-y-1/2 text-[0.9rem] text-t3/70'}
            peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:tracking-[0.2em] peer-focus:uppercase peer-focus:text-accent`}>
          {label}{required ? ' *' : ''}
        </label>
        <span className="pointer-events-none absolute left-5 right-5 bottom-[9px] h-px origin-left scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 ease-out"
          style={{ background: 'linear-gradient(90deg, #ffa9f9, #fff7ad)' }} />
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 font-body text-[0.75rem] text-red-400/90">{error}</p>
      )}
    </div>
  );
}

// ============================================================
// FLOATING LABEL TEXTAREA (kısa label üstte, uzun placeholder içeride)
// ============================================================
function FloatingTextarea({
  id, label, placeholder, value, onChange, required, error, maxLength,
}: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
  maxLength?: number;
}) {
  const field = id.replace(/^f-/, '');
  return (
    <div className="relative" data-field={field}>
      <div className={`relative rounded-xl border transition-all duration-300
        ${error ? 'border-red-400/50 bg-red-500/[0.02]' : 'border-white/[0.08] bg-white/[0.03] focus-within:border-accent/40 focus-within:bg-white/[0.05]'}`}>
        <label
          htmlFor={id}
          className="block px-5 pt-3 pb-1 font-body text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-t3 peer-focus:text-accent">
          {label}{required ? ' *' : ''}
        </label>
        <textarea
          id={id}
          rows={6}
          required={required}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className="peer w-full px-5 pb-4 pt-1 bg-transparent font-body text-[0.9rem] text-t1 outline-none resize-none placeholder:text-t3/55 placeholder:font-light"
        />
        {maxLength && (
          <span className="absolute bottom-2.5 right-4 font-body text-[0.68rem] text-t3/70 tabular-nums pointer-events-none">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 font-body text-[0.75rem] text-red-400/90">{error}</p>
      )}
    </div>
  );
}
