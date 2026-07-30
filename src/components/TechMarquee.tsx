'use client';

import { useEffect, useRef } from 'react';

// Satır 1 — Hizmetler
const ROW1 = [
  'Yapay Zeka Çözümleri', 'Blockchain Altyapısı', 'Web Yazılım Geliştirme',
  'Mobil Uygulama', 'UI/UX Tasarım', 'E-Ticaret Platformları',
  'SEO Optimizasyonu', 'Dijital Pazarlama', 'Kripto Para Borsası',
  'Akıllı Kontrat Geliştirme', 'DeFi Protokolleri', 'Fintech Çözümleri',
  'Kurumsal Marka Kimliği', 'RPA Süreç Otomasyonu', 'AI Veri Analizi',
  'Chatbot & Sanal Asistan', 'Token Ekonomisi', 'Ödeme Altyapısı',
];

// Satır 2 — Teknolojiler
const ROW2 = [
  'React', 'Next.js', 'Node.js', 'TypeScript', 'Solidity', 'Rust', 'Python',
  'Flutter', 'Swift', 'Kotlin', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS',
  'Docker', 'Kubernetes', 'GraphQL', 'Three.js', 'Figma', 'Ethereum',
  'Solana', 'Web3.js', 'TailwindCSS', 'NestJS', 'Stripe', 'Firebase',
];

// Satır 3 — Şirket Özellikleri & Değerler
const ROW3 = [
  'Uçtan Uca Çözüm', '7/24 Destek', 'Agile Metodoloji', 'Şeffaf Süreç',
  '%99.9 Uptime', 'PCI DSS Uyumlu', 'KVKK Uyumlu', 'ISO Standartları',
  '120+ Tamamlanan Proje', '50+ Kurumsal Müşteri', 'Microservice Mimari',
  'CI/CD Pipeline', 'Penetrasyon Testi', 'Ölçeklenebilir Altyapı',
  'Tam Kaynak Kod Sahipliği', 'Haftalık Sprint Raporları',
];

// Satır 4 — Sektörler & Uzmanlık
const ROW4 = [
  'Finans & Bankacılık', 'E-Ticaret & Perakende', 'Sağlık Teknolojileri',
  'Eğitim & EdTech', 'Lojistik & Tedarik', 'Gayrimenkul & PropTech',
  'SaaS Platformları', 'Startup MVP', 'Kurumsal ERP', 'CRM Sistemleri',
  'IoT & Edge Computing', 'Siber Güvenlik', 'Cloud Native', 'DevOps',
  'Büyük Veri & Analytics', 'Otonom Sistemler',
];

/**
 * Sürükle + momentum. Üç hata düzeltildi:
 *  1. Her satır KALICI bir rAF döngüsü çalıştırıyordu (4 satır → hiç durmayan
 *     4 döngü). Artık döngü yalnızca hareket varken çalışır, durunca kapanır.
 *  2. `onUp`/`onWheel` her çağrıda YENİ bir rAF zinciri başlatıyordu; şeritte
 *     hızlı scroll onlarca eşzamanlı zincir doğuruyordu. Tek döngü + tek bayrak.
 *  3. Momentum bitince `transform` bir anda siliniyor, şerit zıplıyordu. Ofset
 *     artık yumuşak biçimde sıfıra döner.
 * Ayrıca dokunmatikte dikey kaydırma sürükleme sayılmaz (parmak dikey inerken
 * şerit yana kaymıyor).
 */
function useMarqueeDrag(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const inner = el.querySelector<HTMLElement>('[data-marquee-inner]');
    if (!inner) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let velocity = 0;
    let offset = 0;
    let dragging = false;
    let axisLocked: 'x' | 'y' | null = null;
    let lastX = 0, lastY = 0, lastT = 0;
    let raf = 0;

    // Boşta döngüyü TAMAMEN kapatır (yalnızca rAF'ı yeniden zamanlamaz).
    const release = () => {
      raf = 0;
      velocity = 0;
      offset = 0;
      inner.style.transform = '';
      inner.style.animationPlayState = '';
    };

    const tick = () => {
      if (dragging) { raf = requestAnimationFrame(tick); return; }
      offset += velocity;
      velocity *= 0.94;   // sürtünme
      offset *= 0.9;      // ofseti yumuşakça sıfıra çek
      inner.style.transform = `translateX(${offset}px)`;
      if (Math.abs(velocity) < 0.1 && Math.abs(offset) < 0.5) { release(); return; }
      raf = requestAnimationFrame(tick);
    };
    // rAF kimlikleri 1'den başlar → 0 "çalışmıyor" anlamına gelir.
    const ensureLoop = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      axisLocked = null;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;
      velocity = 0;
      inner.style.animationPlayState = 'paused';
      el.style.cursor = 'grabbing';
      ensureLoop();
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      // İlk anlamlı hareket yönü ekseni kilitler: dikey ise sürükleme iptal
      // (dokunmatikte sayfa dikey kayarken şerit yana kaymasın).
      if (!axisLocked && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
        axisLocked = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
        if (axisLocked === 'y') { dragging = false; el.style.cursor = ''; return; }
      }

      const dt = Math.max(1, e.timeStamp - lastT);
      velocity = (dx / dt) * 16; // ~60fps'e normalize
      offset += dx;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;
      inner.style.transform = `translateX(${offset}px)`;
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      el.style.cursor = '';
      ensureLoop(); // momentum + yumuşak dönüş, sonra CSS animasyonu devralır
    };

    // Scroll velocity boost — şerit üzerinden geçerken hafif ivme.
    const onWheel = (e: WheelEvent) => {
      velocity += e.deltaY * 0.3;
      inner.style.animationPlayState = 'paused';
      ensureLoop();
    };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
    };
  }, [containerRef]);
}

function MarqueeRow({ items, duration, reverse = false }: { items: string[]; duration: number; reverse?: boolean }) {
  const rowRef = useRef<HTMLDivElement>(null);
  useMarqueeDrag(rowRef);

  const doubled = [...items, ...items];

  return (
    <div ref={rowRef} className="overflow-hidden select-none" style={{ cursor: 'grab' }}>
      <div
        data-marquee-inner
        className="flex w-max"
        style={{ animation: `marquee ${duration}s linear infinite${reverse ? ' reverse' : ''}` }}
      >
        {doubled.map((text, i) => {
          const colorIdx = i % 3;
          const color = colorIdx === 0 ? '#ffa9f9' : colorIdx === 1 ? '#fff7ad' : '#f2f0ed';
          const glow = colorIdx === 0
            ? '0 0 12px rgba(255,169,249,0.25)'
            : colorIdx === 1
              ? '0 0 12px rgba(255,247,173,0.2)'
              : 'none';

          return (
            // Şerit kesintisiz akması için iki kez basılır; ikinci kopya ekran
            // okuyucudan gizlenir (aynı 76 öğe iki kez okunmasın).
            <span key={i} aria-hidden={i >= items.length ? 'true' : undefined} className="shrink-0 flex items-center gap-4 mx-3">
              <span className="w-1 h-1 rounded-full shrink-0 opacity-30" style={{ background: color }} />
              <span
                className="font-heading text-[0.85rem] font-semibold tracking-[0.15em] uppercase whitespace-nowrap"
                style={{ color, textShadow: glow }}
              >
                {text}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <section className="py-8 overflow-hidden relative"
      style={{ background: 'linear-gradient(180deg, transparent, rgba(255,169,249,0.02), rgba(255,247,173,0.01), transparent)' }}>
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,169,249,0.15) 50%, transparent 90%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,247,173,0.12) 50%, transparent 90%)' }} />
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10"
        style={{ background: 'linear-gradient(90deg, var(--color-bg), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10"
        style={{ background: 'linear-gradient(270deg, var(--color-bg), transparent)' }} />

      <div className="mb-3">
        <MarqueeRow items={ROW1} duration={90} />
      </div>
      <div className="mb-3">
        <MarqueeRow items={ROW2} duration={80} reverse />
      </div>
      <div className="mb-3">
        <MarqueeRow items={ROW3} duration={85} />
      </div>
      <div>
        <MarqueeRow items={ROW4} duration={75} reverse />
      </div>
    </section>
  );
}
