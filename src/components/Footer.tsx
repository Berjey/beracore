'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services } from '@/lib/services-data';

gsap.registerPlugin(ScrollTrigger);

const KURUMSAL = [
  { label: 'Ana Sayfa', id: '__home' },
  { label: 'Hakkımızda', id: '__about' },
  { label: 'Hizmetler', id: 'services' },
  { label: 'Süreç', id: 'process' },
  { label: 'İletişim', id: 'iletisim' },
];

const YASAL = [
  { label: 'Gizlilik Politikası', href: '/gizlilik-politikasi' },
  { label: 'KVKK Aydınlatma Metni', href: '/kvkk' },
  { label: 'Çerez Politikası', href: '/cerez-politikasi' },
  { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
];

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/beracore', icon: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/beracore', icon: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z' },
  { label: 'X', href: 'https://x.com/beracore', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { label: 'GitHub', href: 'https://github.com/beracore', icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z' },
];

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        gsap.fromTo('.ft-line', { scaleX: 0 }, {
          scaleX: 1,
          scrollTrigger: { trigger: footer, start: 'top 95%', end: 'top 55%', scrub: 0.12 },
        });
        gsap.fromTo('.ft-col', { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.03,
          scrollTrigger: { trigger: footer, start: 'top 85%', end: 'top 35%', scrub: 0.15 },
        });
      }, footer);
    }, 400);
    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  const handleNav = useCallback((id: string) => {
    if (id === '__home') { if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); else router.push('/'); return; }
    if (id === '__about') { router.push('/hakkimizda'); return; }
    if (pathname === '/') { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
    else { router.push(`/#${id}`); }
  }, [pathname, router]);

  return (
    <footer ref={footerRef} className="relative pt-24 pb-8 px-10 max-md:px-5 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--color-bg) 0%, rgba(255,169,249,0.06) 40%, rgba(255,247,173,0.04) 100%)' }}>
      <div className="ft-line absolute top-0 left-0 right-0 h-[2px] origin-center"
        style={{ background: 'linear-gradient(90deg, transparent 5%, #ffa9f9 30%, #fff7ad 70%, transparent 95%)' }} />
      <div className="max-w-6xl mx-auto relative z-[1]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="ft-col lg:col-span-1">
            <Link href="/" className="inline-block mb-5"><Image src="/beracore.png" alt="BERACORE" width={58} height={38} className="h-8 w-auto drop-shadow-[0_0_14px_rgba(255,169,249,0.3)]" /></Link>
            <p className="font-body text-[0.85rem] text-t1/70 font-light leading-relaxed mb-6">Yaratıcı tasarım, güçlü mühendislik ve modern teknolojilerle markanız için unutulmaz dijital deneyimler.</p>
            <div className="space-y-3">
              <a href="mailto:info@beracore.com" className="flex items-center gap-2.5 font-body text-[0.85rem] text-t1 font-medium hover:text-accent transition-colors duration-300">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffa9f9" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></svg>
                info@beracore.com</a>
              <a href="tel:+908503026950" className="flex items-center gap-2.5 font-body text-[0.85rem] text-t1 font-medium hover:text-accent transition-colors duration-300">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff7ad" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                0850 302 69 50</a>
            </div>
          </div>
          <div className="ft-col">
            <h4 className="font-body text-[0.72rem] font-bold tracking-[0.3em] uppercase mb-5 gradient-text">Hizmetler</h4>
            <ul className="space-y-3">
              {services.map((svc) => (<li key={svc.key}><Link href={`/hizmetler/${svc.key}/${svc.subServices[0].slug}`} className="font-body text-[0.85rem] text-t1/80 hover:text-accent transition-all duration-300 inline-flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent group-hover:scale-150 transition-all duration-300" />{svc.title}</Link></li>))}
            </ul>
          </div>
          <div className="ft-col">
            <h4 className="font-body text-[0.72rem] font-bold tracking-[0.3em] uppercase mb-5 gradient-text">Kurumsal</h4>
            <ul className="space-y-3">
              {KURUMSAL.map((item) => (<li key={item.id}><button onClick={() => handleNav(item.id)} className="font-body text-[0.85rem] text-t1/80 hover:text-accent transition-all duration-300 inline-flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-accent2/40 group-hover:bg-accent2 group-hover:scale-150 transition-all duration-300" />{item.label}</button></li>))}
            </ul>
            <h4 className="font-body text-[0.72rem] font-bold tracking-[0.3em] uppercase mb-4 mt-8 gradient-text-reverse">Yasal</h4>
            <ul className="space-y-2.5">
              {YASAL.map((item) => (<li key={item.href}><Link href={item.href} className="font-body text-[0.8rem] text-t2 hover:text-t1 transition-colors duration-300">{item.label}</Link></li>))}
            </ul>
          </div>
          <div className="ft-col">
            <h4 className="font-body text-[0.72rem] font-bold tracking-[0.3em] uppercase mb-5 gradient-text">Bizi Takip Edin</h4>
            <div className="flex gap-3 mb-8">
              {SOCIALS.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}
                  className="group relative w-11 h-11 rounded-xl flex items-center justify-center border border-accent/15 bg-white/[0.03] transition-all duration-400 hover:border-accent/40 hover:bg-accent/[0.08] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,169,249,0.15)]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-t1/70 group-hover:text-accent transition-colors duration-300"><path d={social.icon} /></svg>
                </a>
              ))}
            </div>
            <div className="p-5 rounded-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, rgba(255,169,249,0.08), rgba(255,247,173,0.05))' }}>
              <div className="absolute inset-0 rounded-2xl border border-accent/15" />
              <p className="font-body text-[0.85rem] text-t1 font-light mb-4 relative">Projenizi konuşalım — keşif görüşmesi ücretsiz.</p>
              <a href="mailto:info@beracore.com" className="relative inline-flex items-center gap-2 w-full justify-center px-5 py-3 rounded-xl font-body text-[0.78rem] font-bold tracking-wider uppercase bg-gradient-to-r from-accent to-accent2 text-bg transition-all duration-400 hover:shadow-[0_8px_24px_rgba(255,169,249,0.25)] hover:scale-[1.02]">
                Teklif Al <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="h-px w-full mb-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,169,249,0.15), rgba(255,247,173,0.1), transparent)' }} />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="font-body text-[0.75rem] text-t2">© {new Date().getFullYear()} BERACORE. Tüm hakları saklıdır.</p>
          <p className="font-body text-[0.7rem] text-t2/70">İstanbul, Türkiye</p>
        </div>
      </div>
    </footer>
  );
}
