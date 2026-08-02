'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Kalıcı WhatsApp iletişim butonu — her sayfada görünür.
// Sağ altta ScrollToTop olduğu için sol altta konumlanır.
const PHONE = '905539862306';
const MESSAGE = 'Merhaba, BERACORE ile bir projem hakkında görüşmek istiyorum.';
const HREF = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

export default function WhatsAppCta() {
  const pathname = usePathname();
  const [hovering, setHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Yönetim paneli bir müşteri yüzeyi değil: kendi kendine WhatsApp yazmanın anlamı yok
  // ve panelin üstünü kapatıyor. Kök düzende olduğu için burada eleniyor.
  const panelde = pathname?.startsWith('/admin') ?? false;

  // İlk ekranda dikkat dağıtmamak için kısa bir gecikmeyle belirir.
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 1200);
    return () => clearTimeout(t);
  }, []);

  if (panelde) return null;

  return (
    <a
      href={HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geçin"
      className="fixed bottom-8 left-8 z-[8000] flex items-center gap-3 max-md:bottom-5 max-md:left-5"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
        // visibility: belirmeden önce Tab sırasında ve erişilebilirlik ağacında yer almasın.
        visibility: mounted ? 'visible' : 'hidden',
        transitionProperty: 'opacity, transform, visibility',
        transitionDuration: '0.5s',
        transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div className="relative w-14 h-14 max-md:w-12 max-md:h-12 shrink-0">
        {/* Dönen gradyan halka — ScrollToTop ile aynı dil */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #25D366, #a7f3d0, #25D366)',
            animation: hovering ? 'spin 2s linear infinite' : 'spin 6s linear infinite',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Parlama */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-500"
          style={{
            boxShadow: hovering
              ? '0 0 20px rgba(37,211,102,0.35), 0 0 40px rgba(37,211,102,0.15)'
              : '0 0 10px rgba(37,211,102,0.12)',
          }}
        />

        {/* İç daire */}
        <div
          className="absolute inset-[2px] rounded-full flex items-center justify-center transition-all duration-500"
          style={{
            background: hovering
              ? 'linear-gradient(135deg, rgba(37,211,102,0.14), rgba(167,243,208,0.08))'
              : 'rgba(26,26,26,0.9)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="#25D366"
            className="transition-transform duration-500"
            style={{ transform: hovering ? 'scale(1.1)' : 'scale(1)' }}
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.886-9.885 9.886m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.548 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
          </svg>
        </div>
      </div>

      {/* Masaüstünde hover ile açılan etiket */}
      <span
        className="hidden md:block whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-white transition-all duration-500"
        style={{
          background: 'rgba(26,26,26,0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(37,211,102,0.3)',
          opacity: hovering ? 1 : 0,
          transform: hovering ? 'translateX(0)' : 'translateX(-10px)',
          pointerEvents: 'none',
        }}
      >
        WhatsApp&apos;tan yazın
      </span>
    </a>
  );
}
