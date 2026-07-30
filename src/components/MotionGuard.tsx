'use client';

import { useEffect } from 'react';

/**
 * prefers-reduced-motion respekti — vestibular rahatsızlığı olan
 * kullanıcılar için animasyonları devre dışı bırakır.
 *
 * CSS animasyonları/geçişleri zaten globals.css'te aynı media query
 * ile durduruluyor. Bu bileşen GSAP animasyonlarını kapsar: GSAP
 * inline style yazdığı için CSS media query'den etkilenmez.
 *
 * Strateji: globalTimeline.timeScale(1000) — tüm animasyonlar 1000x
 * hızlı (anında final state'e atlar, kullanıcı hareket görmez).
 *
 * ÖNEMLİ: gsap DİNAMİK import edilir. Bu bileşen kök layout'ta olduğu için statik
 * bir `import { gsap }` satırı, gsap çekirdeğini gsap kullanmayan TÜM sayfalara
 * (blog yazıları, yasal sayfalar, şehir/kategori sayfaları) sokuyordu. Ayrıca yalnızca
 * hareket kısıtlaması AÇIKKEN yüklenir — normal kullanıcı bu kodu hiç indirmez.
 * Webpack modül kaydı paylaşıldığı için buradaki gsap, sayfaların statik olarak
 * import ettiği gsap ile AYNI singleton'dır.
 */
export default function MotionGuard() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let touched = false;
    let cancelled = false;
    const apply = () => {
      // Hiç dokunmadıysak ve hareket kısıtlaması kapalıysa yapılacak bir şey yok.
      if (!media.matches && !touched) return;
      touched = true;
      import('gsap').then(({ gsap }) => {
        if (cancelled) return;
        gsap.globalTimeline.timeScale(media.matches ? 1000 : 1);
      });
    };
    apply();
    media.addEventListener('change', apply);
    return () => {
      cancelled = true;
      media.removeEventListener('change', apply);
    };
  }, []);

  return null;
}
