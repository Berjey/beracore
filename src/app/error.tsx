'use client';

// Rota seviyesi hata sınırı. Bir client bileşeni çalışma zamanında hata atarsa
// Next.js varsayılan (stilsiz, İngilizce) ekranı yerine bu sayfa gösterilir.
// not-found.tsx ile aynı tasarım dilini kullanır.

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sunucu loglarında iz bırakır; kullanıcıya teknik detay gösterilmez.
    console.error('[error-boundary]', error);
  }, [error]);

  return (
    <main
      id="main"
      className="relative z-[1] min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      style={{ background: '#0f0d16' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div
          className="w-[520px] h-[520px] max-md:w-[340px] max-md:h-[340px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,169,249,0.10) 0%, rgba(255,247,173,0.05) 45%, transparent 72%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <p className="font-heading text-[clamp(3rem,12vw,6rem)] font-bold leading-none gradient-text">
        Bir şeyler ters gitti
      </p>
      <h1 className="mt-4 font-heading text-[clamp(1.2rem,3.5vw,1.8rem)] font-semibold text-white">
        Beklenmeyen bir hata oluştu
      </h1>
      <p className="mt-4 max-w-md font-body text-[0.95rem] leading-relaxed text-white/60">
        Sorun bize iletildi. Sayfayı yeniden denemeyi veya ana sayfaya dönmeyi
        deneyebilirsiniz. Acil bir konu için doğrudan iletişime geçebilirsiniz.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={reset}
          className="px-7 py-3 min-h-[44px] rounded-xl font-body text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #fff7ad, #ffa9f9)' }}
        >
          Yeniden Dene
        </button>
        <Link
          href="/"
          className="px-7 py-3 min-h-[44px] inline-flex items-center rounded-xl font-body text-sm font-semibold text-white border border-white/20 transition-colors hover:border-white/50"
        >
          Ana Sayfa
        </Link>
        <Link
          href="/iletisim"
          className="px-7 py-3 min-h-[44px] inline-flex items-center rounded-xl font-body text-sm font-semibold text-white border border-white/20 transition-colors hover:border-white/50"
        >
          İletişim
        </Link>
      </div>

      {error.digest && (
        <p className="mt-10 font-body text-[0.7rem] tracking-wider text-white/30">
          Hata referansı: {error.digest}
        </p>
      )}
    </main>
  );
}
