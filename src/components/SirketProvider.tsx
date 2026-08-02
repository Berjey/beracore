'use client';

import { createContext, useContext } from 'react';
import { SIRKET_VARSAYILAN, type SirketBilgisi } from '@/lib/sirket';

/**
 * Şirket bilgisini istemci bileşenlerine taşıyan bağlam (context).
 *
 * NEDEN PROP DEĞİL DE CONTEXT:
 * `src/app/page.tsx` bir İSTEMCİ bileşenidir (`'use client'`). Ona `getSirket()`
 * sonucunu prop olarak geçirmek için sayfanın kendisinin sunucu bileşeni olması
 * gerekirdi; doğrudan import etmek ise `node:sqlite`'ı tarayıcı paketine sokar ve
 * derlemeyi kırar (fiilen kırdı). Kök düzen sunucu tarafında BİR KEZ okur, değeri
 * bu sağlayıcıyla ağaca verir; istemci bileşenleri `useSirket()` ile alır.
 *
 * Yan fayda: prop zinciri yok. Yeni bir bileşen iletişim bilgisine ihtiyaç
 * duyduğunda araya giren her katmanı değiştirmek gerekmez — bilgi 6+ dosyada
 * kopyalandığı için (bulgu A-08) bu tekrar ayrışma riskini azaltır.
 */
const SirketContext = createContext<SirketBilgisi>(SIRKET_VARSAYILAN);

export default function SirketProvider({
  sirket,
  children,
}: {
  sirket: SirketBilgisi;
  children: React.ReactNode;
}) {
  return <SirketContext.Provider value={sirket}>{children}</SirketContext.Provider>;
}

/**
 * Sağlayıcı yoksa kod varsayılanları döner — `createContext` varsayılanı bu.
 * Bilerek: bir bileşen yanlışlıkla sağlayıcı dışında render edilse bile site
 * boş telefon numarası göstermek yerine doğru olanı gösterir.
 */
export function useSirket(): SirketBilgisi {
  return useContext(SirketContext);
}
