'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const STORAGE_KEY = 'beracore-cookie-consent'; // 'accepted' | 'rejected'

/**
 * KVKK/GDPR çerez onayı + Google Analytics.
 * - NEXT_PUBLIC_GA_ID tanımlı DEĞİLSE: hiçbir şey render edilmez (izleme çerezi yok, banner yok).
 * - Tanımlıysa: kullanıcı "Kabul Et" demeden GA YÜKLENMEZ (onay öncesi çerez set edilmez).
 */
export default function CookieConsent() {
  const [decision, setDecision] = useState<'accepted' | 'rejected' | 'pending' | null>(null);

  useEffect(() => {
    if (!GA_ID) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    setDecision(stored === 'accepted' || stored === 'rejected' ? stored : 'pending');
  }, []);

  // GA yapılandırılmamış → tamamen pasif
  if (!GA_ID || decision === null) return null;

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setDecision('accepted');
  };
  const reject = () => {
    localStorage.setItem(STORAGE_KEY, 'rejected');
    setDecision('rejected');
  };

  return (
    <>
      {/* Onay verildiyse GA yükle */}
      {decision === 'accepted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {/* Onay bekliyorsa banner */}
      {decision === 'pending' && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Çerez tercihi"
          className="fixed bottom-4 left-4 right-4 z-[9500] mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#15131c]/95 backdrop-blur-md p-5 shadow-2xl max-md:bottom-3 max-md:left-3 max-md:right-3"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-body text-[0.85rem] leading-relaxed text-white/75">
              Deneyiminizi iyileştirmek için çerezler kullanıyoruz. Detaylar için{' '}
              <Link href="/cerez-politikasi" className="text-accent underline underline-offset-2">
                Çerez Politikası
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                onClick={reject}
                className="rounded-lg border border-white/20 px-4 py-2 font-body text-[0.8rem] font-medium text-white/80 transition-colors hover:border-white/40"
              >
                Reddet
              </button>
              <button
                onClick={accept}
                className="rounded-lg px-5 py-2 font-body text-[0.8rem] font-semibold text-black transition-transform hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #fff7ad, #ffa9f9)' }}
              >
                Kabul Et
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
