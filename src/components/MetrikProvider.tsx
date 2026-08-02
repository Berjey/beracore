'use client';

import { createContext, useContext } from 'react';
import { METRIK_VARSAYILAN, type Metrik } from '@/lib/metrikler';

/**
 * Yayındaki metrikleri istemci bileşenlerine taşıyan bağlam.
 *
 * Gerekçesi `SirketProvider` ile aynı: `Stats` ve `AboutPage` istemci bileşeni,
 * veritabanı katmanı sunucuya ait. Ayrı bir sağlayıcı tutulmasının sebebi ise
 * ikisinin ömrünün farklı olması — şirket bilgisi her sayfada, metrikler yalnızca
 * iki yüzeyde kullanılır ve iki ayrı yüzey listesi taşır.
 */
interface MetrikSeti {
  anaSayfa: Metrik[];
  hakkimizda: Metrik[];
}

const BOS: MetrikSeti = { anaSayfa: METRIK_VARSAYILAN, hakkimizda: METRIK_VARSAYILAN };

const MetrikContext = createContext<MetrikSeti>(BOS);

export default function MetrikProvider({
  metrikler,
  children,
}: {
  metrikler: MetrikSeti;
  children: React.ReactNode;
}) {
  return <MetrikContext.Provider value={metrikler}>{children}</MetrikContext.Provider>;
}

/**
 * Sağlayıcı yoksa BOŞ döner — şirket bilgisinin tersine burada varsayılan
 * "sus"tur. Kanıtlanmamış bir sayının bir yapılandırma hatası yüzünden ekrana
 * gelmesi, bölümün hiç görünmemesinden daha kötüdür.
 */
export function useMetrikler(yuzey: 'anaSayfa' | 'hakkimizda'): Metrik[] {
  return useContext(MetrikContext)[yuzey];
}
