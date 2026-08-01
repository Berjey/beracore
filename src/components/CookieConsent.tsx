'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { readCookieDecision, writeCookieDecision } from '@/lib/cookie-consent';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * KVKK/GDPR çerez onayı + Google Analytics.
 * - NEXT_PUBLIC_GA_ID tanımlı DEĞİLSE: hiçbir şey render edilmez (izleme çerezi yok, banner yok).
 * - Tanımlıysa: kullanıcı "Kabul Et" demeden GA YÜKLENMEZ (onay öncesi çerez set edilmez).
 */
export default function CookieConsent() {
  const [decision, setDecision] = useState<'accepted' | 'rejected' | 'pending' | null>(null);

  useEffect(() => {
    if (!GA_ID) return;
    setDecision(readCookieDecision() ?? 'pending');
  }, []);

  // GA yapılandırılmamış → tamamen pasif (banner da GA da yok)
  if (!GA_ID) return null;

  /** Kararı hem depolamaya hem <html data-cc> özniteliğine yazar.
   *  Öznitelik CSS'i sürdüğü için band aynı karede gizlenir — React state'i
   *  yalnızca GA'nın yüklenmesini kontrol eder. */
  const karar = (v: 'accepted' | 'rejected') => {
    writeCookieDecision(v);
    document.documentElement.dataset.cc = v;
    setDecision(v);
  };
  const accept = () => karar('accepted');
  const reject = () => karar('rejected');

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

      {/* Band KOŞULSUZ render edilir (SSR HTML'inde yer alır); görünürlüğünü
          globals.css'teki `.cc-banner` + `html[data-cc]` çifti belirler.
          Koşullu render'a DÖNÜLMEMELİ: band hidrasyondan sonra belirdiğinde
          sayfanın en büyük metin bloğu olarak LCP öğesi oluyor ve ana sayfada
          LCP'yi 5,8 sn'ye çıkarıyordu. */}
      <div
        // role="dialog" + aria-live birlikte tutarsızdı (diyalog odak yönetimi
        // bekler, canlı bölge ise duyurulur). Banner odağı çalmadığı için doğru
        // semantik: nazikçe duyurulan bir bölge.
        role="region"
        aria-live="polite"
        aria-label="Çerez tercihi"
        className="cc-banner fixed bottom-4 left-4 right-4 z-[9500] mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#15131c]/95 backdrop-blur-md p-5 shadow-2xl max-md:bottom-3 max-md:left-3 max-md:right-3"
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
    </>
  );
}
