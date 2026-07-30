'use client';

import { useEffect, useState } from 'react';
import { clearCookieDecision, readCookieDecision, type CookieDecision } from '@/lib/cookie-consent';

/**
 * Çerez Politikası sayfasındaki "tercihi sıfırla" kontrolü.
 *
 * Neden gerekli: politika metni kullanıcının onayını geri alabileceğini söylüyor,
 * ancak karar bir kez kaydedildikten sonra banner bir daha görünmediği için tek
 * yol tarayıcı depolamasını elle temizlemekti. KVKK/GDPR açısından onayın verildiği
 * kadar kolay geri alınabilmesi gerekir.
 *
 * Sıfırlama sonrası sayfa yenilenir: onay öncesinde yüklenmiş gtag betiği çalışmayı
 * ancak yeni bir sayfa yüklemesiyle bırakır — "iptal ettim ama izleme sürüyor"
 * durumunu bırakmamak için bilinçli tercih.
 */
export default function CookiePreferenceReset() {
  const [decision, setDecision] = useState<CookieDecision | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDecision(readCookieDecision());
    setMounted(true);
  }, []);

  // Analytics yapılandırılmamışsa ya da hiç karar kaydedilmemişse gösterilecek bir şey yok.
  if (!mounted || !process.env.NEXT_PUBLIC_GA_ID || !decision) return null;

  const label = decision === 'accepted' ? 'Kabul edildi' : 'Reddedildi';

  return (
    <section className="mt-12 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 max-md:p-5">
      <h2 className="font-heading text-[1.05rem] font-bold text-t1 mb-2">Çerez Tercihiniz</h2>
      <p className="font-body text-[0.88rem] text-t2 font-light leading-[1.75] mb-4">
        Bu tarayıcıdaki mevcut tercihiniz:{' '}
        <span className="font-medium text-t1">{label}</span>. Tercihinizi sıfırlayarak
        çerez bildirimini yeniden görebilir ve kararınızı değiştirebilirsiniz.
      </p>
      <button
        type="button"
        onClick={() => {
          clearCookieDecision();
          window.location.reload();
        }}
        className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/[0.06] px-5 py-2.5 font-body text-[0.8rem] font-semibold text-accent transition-colors duration-300 hover:border-accent/60 hover:bg-accent/[0.12]"
      >
        Çerez tercihimi sıfırla
      </button>
    </section>
  );
}
