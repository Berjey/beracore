'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollText from '@/components/ScrollText';
import { services } from '@/lib/services-data';

gsap.registerPlugin(ScrollTrigger);

const CONTACT_METHODS = [
  { icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6', label: 'E-posta', value: 'info@beracore.com', href: 'mailto:info@beracore.com' },
  { icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z', label: 'Telefon', value: '0850 302 69 50', href: 'tel:+908503026950' },
  { icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', label: 'Adres', value: 'İstanbul, Türkiye', href: '' },
];

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '' });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // İletişim kartları
        gsap.fromTo('.ct-card', { y: 40, opacity: 0, scale: 0.95 }, {
          y: 0, opacity: 1, scale: 1, stagger: 0.03,
          scrollTrigger: { trigger: '.ct-cards', start: 'top 85%', end: 'top 35%', scrub: 0.15 },
        });
        // Form alanı
        gsap.fromTo('.ct-form', { y: 50, opacity: 0 }, {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: '.ct-form', start: 'top 90%', end: 'top 40%', scrub: 0.15 },
        });
        // Hizmetler
        gsap.fromTo('.ct-services', { y: 40, opacity: 0 }, {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: '.ct-services', start: 'top 85%', end: 'top 35%', scrub: 0.15 },
        });
      }, container);
    }, 800);
    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Teklif Talebi${selectedService ? ` — ${selectedService}` : ''}`);
    const body = encodeURIComponent(
      `Ad Soyad: ${formData.name}\nE-posta: ${formData.email}\nTelefon: ${formData.phone}\nŞirket: ${formData.company}\nHizmet: ${selectedService || 'Belirtilmedi'}\n\nMesaj:\n${formData.message}`
    );
    window.location.href = `mailto:info@beracore.com?subject=${subject}&body=${body}`;
  };

  return (
    <div ref={containerRef}>
      {/* Hero */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 relative">
        <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(255,169,249,0.06) 0%, rgba(255,247,173,0.02) 35%, transparent 65%)' }} />
        <h1 className="font-body text-[clamp(2.4rem,5.5vw,4.2rem)] font-semibold leading-[1.08] mb-6 max-w-3xl">
          <ScrollText before="Projenizi " accent="Konuşalım" />
        </h1>
        <p className="font-body text-[clamp(1rem,2vw,1.2rem)] text-t2 font-light leading-relaxed max-w-2xl mb-8">
          Dijital dönüşüm yolculuğunuzda ilk adımı atın. Keşif görüşmesi ücretsiz ve taahhütsüzdür.
        </p>
        <div className="h-px w-full max-w-md" style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), var(--color-accent2), transparent)' }} />
      </section>

      {/* İletişim Kartları */}
      <section className="ct-cards py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {CONTACT_METHODS.map((method, i) => (
            <a key={method.label} href={method.href || undefined}
              className={`ct-card group relative p-7 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden text-center
                ${method.href ? 'hover:border-accent/20 hover:-translate-y-1 cursor-pointer' : ''} transition-all duration-500`}>
              <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{ background: i % 2 === 0 ? 'rgba(255,169,249,0.08)' : 'rgba(255,247,173,0.08)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={i % 2 === 0 ? '#ffa9f9' : '#fff7ad'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={method.icon} /></svg>
                </div>
                <div className="font-body text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-t3 mb-2">{method.label}</div>
                <div className="font-body text-[1rem] font-medium text-t1">{method.value}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-body text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold">
              <ScrollText before="Teklif " accent="Formu" />
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="ct-form space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" placeholder="Ad Soyad *" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                className="w-full px-5 py-4 rounded-xl font-body text-[0.9rem] text-t1 bg-white/[0.03] border border-white/[0.08] placeholder:text-t3/50
                  focus:border-accent/40 focus:bg-white/[0.05] focus:outline-none transition-all duration-300" />
              <input type="email" placeholder="E-posta *" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                className="w-full px-5 py-4 rounded-xl font-body text-[0.9rem] text-t1 bg-white/[0.03] border border-white/[0.08] placeholder:text-t3/50
                  focus:border-accent/40 focus:bg-white/[0.05] focus:outline-none transition-all duration-300" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="tel" placeholder="Telefon" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-5 py-4 rounded-xl font-body text-[0.9rem] text-t1 bg-white/[0.03] border border-white/[0.08] placeholder:text-t3/50
                  focus:border-accent/40 focus:bg-white/[0.05] focus:outline-none transition-all duration-300" />
              <input type="text" placeholder="Şirket Adı" value={formData.company} onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                className="w-full px-5 py-4 rounded-xl font-body text-[0.9rem] text-t1 bg-white/[0.03] border border-white/[0.08] placeholder:text-t3/50
                  focus:border-accent/40 focus:bg-white/[0.05] focus:outline-none transition-all duration-300" />
            </div>

            {/* Hizmet seçimi */}
            <div>
              <label className="block font-body text-[0.75rem] font-semibold tracking-[0.2em] uppercase text-t3 mb-3">İlgilendiğiniz Hizmet</label>
              <div className="flex flex-wrap gap-2">
                {services.map((svc) => (
                  <button key={svc.key} type="button" onClick={() => setSelectedService(selectedService === svc.title ? '' : svc.title)}
                    className={`px-4 py-2 rounded-xl font-body text-[0.78rem] font-medium border transition-all duration-300
                      ${selectedService === svc.title
                        ? 'border-accent/40 bg-accent/10 text-accent'
                        : 'border-white/[0.06] bg-white/[0.02] text-t2 hover:border-accent/20 hover:text-t1'}`}>
                    {svc.title}
                  </button>
                ))}
              </div>
            </div>

            <textarea placeholder="Projeniz hakkında kısaca bilgi verin *" required rows={5} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
              className="w-full px-5 py-4 rounded-xl font-body text-[0.9rem] text-t1 bg-white/[0.03] border border-white/[0.08] placeholder:text-t3/50 resize-none
                focus:border-accent/40 focus:bg-white/[0.05] focus:outline-none transition-all duration-300" />

            <button type="submit"
              className="w-full py-4 rounded-xl font-body text-[0.85rem] font-semibold tracking-wider uppercase
                bg-gradient-to-r from-accent to-accent2 text-bg transition-all duration-500
                hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,169,249,0.25)] hover:scale-[1.01]">
              Teklif Talebini Gönder
            </button>

            <p className="text-center font-body text-[0.75rem] text-t3">
              veya doğrudan <a href="mailto:info@beracore.com" className="text-accent hover:underline">info@beracore.com</a> adresine yazın
            </p>
          </form>
        </div>
      </section>

      {/* Hizmetler Quick Links */}
      <section className="ct-services py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-body text-[clamp(1.4rem,3vw,2rem)] font-semibold">
              <ScrollText before="Hangi alanda " accent="yardımcı olalım?" />
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc, i) => (
              <Link key={svc.key} href={`/hizmetler/${svc.key}/${svc.subServices[0].slug}`}
                className="group flex items-center gap-3 p-5 rounded-xl border border-white/[0.06] bg-white/[0.015] hover:border-accent/20 hover:bg-white/[0.03] transition-all duration-400">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: i % 2 === 0 ? '#ffa9f9' : '#fff7ad' }} />
                <div>
                  <span className="font-body text-[0.9rem] font-medium text-t1 group-hover:text-accent transition-colors">{svc.title}</span>
                  <span className="block font-body text-[0.7rem] text-t3">{svc.subtitle}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
