'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface SPSection {
  /** Görsel etiket (lg+ ekranlarda görünür) */
  label: string;
  /** CSS seçici — bölümün DOM'daki konumu (id / class / [data-*]) */
  sel: string;
}

// Varsayılan: anasayfa ana bölümleri (Navbar/section id'leriyle eşleşir).
const HOME_SECTIONS: SPSection[] = [
  { label: 'Ana Sayfa', sel: '#hero' },
  { label: 'Çekirdek', sel: '#manifesto' },
  { label: 'Hizmetler', sel: '#services' },
  { label: 'Neden Biz', sel: '#why-us' },
  { label: 'Süreç', sel: '#process' },
  { label: 'Referanslar', sel: '#referanslar' },
  { label: 'SSS', sel: '#faq' },
  { label: 'İletişim', sel: '#iletisim' },
];

/**
 * Sağ kenarda dikey bölüm göstergesi + scroll ilerlemesi.
 * - Hangi bölümde olduğunu vurgular (aktif nokta + etiket).
 * - Dikey çizgi, toplam scroll ilerlemesiyle gradient olarak dolar.
 * - Noktaya tıklayınca ilgili bölüme yumuşak kayar.
 * Yalnızca lg+ ekranlarda etiket görünür (mobilde noktalar kalır, içerik kalabalıklaşmaz).
 *
 * Her sayfa kendi `sections` listesini verir (selector tabanlı → mevcut class/id/[data-*]
 * çapalarını referans alır, ekstra işaretleme gerekmez). Prop verilmezse anasayfa varsayılanı.
 */
export default function ScrollProgress({ sections = HOME_SECTIONS }: { sections?: SPSection[] }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  // Yalnızca DOM'da GERÇEKTEN bulunan bölümler gösterilir. Böylece hiçbir noktaya
  // tıklandığında "hiçbir şey olmaması" mümkün değil (ör. iletişim formu başarı
  // ekranına geçtiğinde tüm bölümler DOM'dan kalkıyor, göstergesi ise kalıyordu).
  const [found, setFound] = useState<SPSection[]>([]);
  const resolved = useRef<{ s: SPSection; el: Element }[]>([]);
  const ticking = useRef(false);

  // Bölüm elemanlarını BİR KEZ çöz. Öncesinde her scroll karesinde her bölüm için
  // querySelector çalışıyordu (8 sorgu × ~60fps) — gereksiz DOM işi.
  const resolve = useCallback(() => {
    const next: { s: SPSection; el: Element }[] = [];
    for (const s of sections) {
      const el = document.querySelector(s.sel);
      if (el) next.push({ s, el });
    }
    resolved.current = next;
    setFound((prev) => {
      const same = prev.length === next.length && prev.every((p, i) => p.sel === next[i].s.sel);
      return same ? prev : next.map((n) => n.s);
    });
  }, [sections]);

  const onScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      ticking.current = false;
      // Önbellek bayatladıysa (bölüm DOM'dan çıktı ya da eksik bölüm sonradan geldi)
      // yeniden çöz. Her şey yerindeyken bu kontrol tek bir boolean okumasıdır.
      if (
        resolved.current.length !== sections.length ||
        resolved.current.some((r) => !r.el.isConnected)
      ) {
        resolve();
      }
      const list = resolved.current;
      const vh = window.innerHeight;
      const line = vh * 0.42; // viewport'un %42'sini geçen son bölüm = aktif
      let idx = 0;
      for (let i = 0; i < list.length; i++) {
        if (list[i].el.getBoundingClientRect().top <= line) idx = i;
      }
      setActive(idx);
      const doc = document.documentElement;
      const max = doc.scrollHeight - vh;
      setProgress(max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0);
    });
  }, [sections, resolve]);

  useEffect(() => {
    resolve();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [onScroll, resolve]);

  const go = (sel: string) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  // Hiçbir bölüm bulunamadıysa gösterge hiç render edilmez (ölü kontrol kalmaz).
  if (found.length === 0) return null;

  return (
    <nav
      aria-label="Sayfa bölümleri"
      className="fixed right-2 lg:right-5 xl:right-6 top-1/2 -translate-y-1/2 z-40 print:hidden"
    >
      <div className="relative flex flex-col gap-1 items-end">
        {/* Taban çizgi */}
        <span
          aria-hidden="true"
          className="absolute right-[6px] top-[15px] bottom-[15px] w-px bg-white/10"
        />
        {/* İlerleme dolgusu */}
        <span
          aria-hidden="true"
          className="absolute right-[6px] top-[15px] w-px"
          style={{
            height: `calc((100% - 30px) * ${progress})`,
            background: 'linear-gradient(180deg, var(--color-accent), var(--color-accent2))',
          }}
        />
        {found.map((s, i) => {
          const isActive = i === active;
          const passed = i <= active;
          return (
            <button
              key={s.sel}
              type="button"
              onClick={() => go(s.sel)}
              aria-current={isActive ? 'location' : undefined}
              aria-label={`${s.label} bölümüne git`}
              className="group relative flex flex-row-reverse items-center gap-3 h-[30px] cursor-pointer bg-transparent border-0 py-0 pr-0 pl-4"
            >
              <span
                className={`relative z-[1] block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-3 h-3 shadow-[0_0_12px_rgba(255,169,249,0.7)]'
                    : 'w-[9px] h-[9px] group-hover:scale-125'
                }`}
                style={{
                  marginRight: isActive ? '0px' : '1.5px',
                  background: passed
                    ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent2))'
                    : 'transparent',
                  border: passed ? 'none' : '1.5px solid rgba(255,255,255,0.28)',
                }}
              />
              {/* Etiketler yalnızca lg+ ekranlarda — mobilde dar ekranda içeriğe binmesin, noktalar kalır */}
              <span
                className={`hidden lg:inline-block font-heading text-[0.7rem] font-semibold tracking-[0.14em] uppercase whitespace-nowrap text-right transition-all duration-300 ${
                  isActive
                    ? 'opacity-100 translate-x-0 gradient-text'
                    : 'opacity-0 translate-x-1 text-t3 group-hover:opacity-100 group-hover:translate-x-0'
                }`}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
