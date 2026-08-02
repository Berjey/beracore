import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { SITE_URL, OG_IMAGE_ABSOLUTE, ogImages, twitterImages } from '@/lib/seo';
import { COOKIE_CONSENT_KEY } from '@/lib/cookie-consent';
import { postalAddress, whatsappHref, type SirketBilgisi } from '@/lib/sirket';
import { getSirket } from '@/lib/db/settings';
import { getMetrikler } from '@/lib/db/metrics';
import MotionGuard from '@/components/MotionGuard';
import CookieConsent from '@/components/CookieConsent';
import WhatsAppCta from '@/components/WhatsAppCta';
import SirketProvider from '@/components/SirketProvider';
import MetrikProvider from '@/components/MetrikProvider';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  // Sayfanın gerçek zemin rengiyle AYNI olmalı (globals.css --color-bg) —
  // aksi halde mobil tarayıcı çubuğu ile sayfa arasında renk kopması olur.
  themeColor: '#1a1a1a',
  colorScheme: 'dark',
};

// `weight` verilmez → next/font DEĞİŞKEN (variable) fontu indirir: iki aile için
// 9 ayrı statik dosya yerine subset başına tek dosya. Tüm ağırlıklar (100–900)
// kullanılabilir kalır, toplam font yükü ve istek sayısı belirgin şekilde düşer.
// Build zamanında okunur; yoksa çerez bandı da GA da hiç render edilmez.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BERACORE — Digital Experience Studio',
  description:
    'BERACORE — Yaratıcı tasarım, güçlü mühendislik ve modern teknolojilerle markanız için unutulmaz dijital deneyimler üreten dijital deneyim stüdyosu.',
  keywords:
    'web tasarım, ui ux, yazılım geliştirme, e-ticaret, seo, dijital pazarlama, beracore, dijital ajans, istanbul',
  authors: [{ name: 'BERACORE' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  // Google Search Console doğrulaması artık HTML dosya yöntemiyle yapılıyor (iş hesabı
  // berkealanelbusiness): public/googleb8ca659074d30ada.html — bu dosya SİLİNMEMELİ.
  // Eski hesabın (kemalberkealanel) meta token'ı 28 Tem 2026'da mülk devrinde kaldırıldı.
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: SITE_URL,
    title: 'BERACORE — Digital Experience Studio',
    description: 'Yaratıcı tasarım, güçlü mühendislik ve modern teknolojilerle markanız için unutulmaz dijital deneyimler.',
    siteName: 'BERACORE',
    images: ogImages('BERACORE — Digital Experience Studio'),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BERACORE — Digital Experience Studio',
    description: 'Yaratıcı tasarım, güçlü mühendislik ve modern teknolojilerle markanız için unutulmaz dijital deneyimler.',
    images: twitterImages,
  },
  // NOT: theme-color / color-scheme yalnızca `viewport` export'unda tanımlanır.
  // Burada tekrar verilirse Next aynı meta etiketini iki kez basar.
};

/**
 * Yapısal veri artık merkezi şirket ayarlarından üretilir (denetim bulgusu A-08).
 * E-posta, telefon ve adres burada SABİT YAZILMAZ — panelden değiştirilince
 * JSON-LD, Footer, iletişim sayfası ve WhatsApp butonu birlikte güncellenir.
 *
 * `sameAs` yalnızca gerçek sosyal profil girildiğinde üretilir; boş bir dizi
 * yayınlamak arama motoruna bilgi vermez, yalnızca gürültü olur (A-18).
 */
function organizationLd(s: SirketBilgisi) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#business`,
    name: s.ad,
    alternateName: 'Beracore Digital Experience Studio',
    url: SITE_URL,
    description:
      'Yaratıcı tasarım, güçlü mühendislik ve modern teknolojilerle markanız için unutulmaz dijital deneyimler üreten dijital deneyim stüdyosu.',
    image: OG_IMAGE_ABSOLUTE,
    logo: `${SITE_URL}/beracore.png`,
    email: s.email,
    telephone: s.telefonE164,
    priceRange: '₺₺₺',
    address: postalAddress(s),
    areaServed: [
      { '@type': 'City', name: s.sehir },
      { '@type': 'Country', name: s.ulke },
    ],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.0082,
      longitude: 28.9784,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    knowsLanguage: ['tr', 'en'],
    ...(s.sosyal.length ? { sameAs: s.sosyal } : {}),
  };
}

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BERACORE',
  url: SITE_URL,
  inLanguage: 'tr-TR',
  publisher: { '@type': 'Organization', name: 'BERACORE', url: SITE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Sunucu bileşeni olduğu için veritabanını burada okuyabiliriz; istemci
  // bileşenlerine (WhatsAppCta) hazır değer prop olarak geçirilir.
  // `getSirket()` veritabanı okunamazsa kod varsayılanlarına düşer — panelin
  // bir sorunu sitenin derlenmesini veya açılmasını engellemez.
  const sirket = getSirket();
  // Yalnızca `durum = 'yayinda'` olan metrikler döner; kanıtı olmayan sayı
  // buraya hiç ulaşmaz (bkz. src/lib/db/metrics.ts).
  const metrikler = {
    anaSayfa: getMetrikler('ana_sayfa'),
    hakkimizda: getMetrikler('hakkimizda'),
  };
  return (
    // color-scheme + inline koyu zemin: tarayıcı CSS gelmeden önce kök zemini KOYU boyar →
    // tam sayfa yenilemede beyaz flash (saydam canvas'ta "beyaz kare" olarak görünen) engellenir.
    <html
      lang="tr"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      style={{ colorScheme: 'dark', backgroundColor: '#1a1a1a' }}
    >
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23fff7ad'/%3E%3Cstop offset='100%25' stop-color='%23ffa9f9'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='7' fill='%230f0d16'/%3E%3Ccircle cx='16' cy='16' r='8' fill='none' stroke='url(%23g)' stroke-width='2.6'/%3E%3Ccircle cx='16' cy='16' r='2.2' fill='url(%23g)'/%3E%3C/svg%3E"
        />
        {/* Yenilemede sayfa başa döner — senkron çalışır, hydration beklemez.
            scrollRestoration='manual' tarayıcının eski konumu geri yüklemesini kapatır,
            bu yüzden ayrı bir scrollTo/beforeunload gerekmez.
            `beforeunload` BİLEREK kullanılmıyor: kayıtlı bir beforeunload dinleyicisi
            sayfayı back/forward cache (bfcache) dışına çıkarır → geri dönüşte tam yeniden
            yükleme olur (Lighthouse "bfcache" uyarısı). pageshow ise bfcache'ten
            geri dönüldüğünde konumu sıfırlar. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
              window.addEventListener('pageshow', function(e) { if (e.persisted) window.scrollTo(0, 0); });
            `,
          }}
        />
        {/* Çerez kararını İLK BOYAMADAN ÖNCE senkron olarak oku ve <html data-cc="..."> yaz.
            Neden: banner daha önce yalnızca hidrasyondan sonra mount oluyordu; sayfanın en
            büyük metin bloğu olduğu için LCP öğesi haline geliyor ve ana sayfada LCP'yi
            2,6 sn'den 5,8 sn'ye taşıyordu (4x CPU kısıtlı mobil ölçüm). Artık banner SSR
            HTML'inde yer alır, görünürlüğünü bu öznitelik belirler → LCP ≈ FCP.
            Kararı olan ziyaretçide banner hiç boyanmaz, yanıp sönme (flash) olmaz. */}
        {GA_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html:
                `try{var v=localStorage.getItem(${JSON.stringify(COOKIE_CONSENT_KEY)});` +
                `document.documentElement.dataset.cc=(v==='accepted'||v==='rejected')?v:'pending'}` +
                `catch(e){document.documentElement.dataset.cc='pending'}`,
            }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd(sirket)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body className="cursor-custom" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-5 focus:py-3 focus:rounded-lg focus:bg-white focus:text-black focus:font-semibold focus:shadow-lg"
        >
          Ana içeriğe atla
        </a>
        <MotionGuard />
        {/* Şirket bilgisi sunucuda BİR KEZ okunur, ağaca bağlamla verilir.
            İstemci bileşenleri `useSirket()` ile alır — veritabanı modülünü
            import etmeleri gerekmez (ederlerse `node:sqlite` tarayıcı paketine sızar). */}
        <SirketProvider sirket={sirket}>
          <MetrikProvider metrikler={metrikler}>{children}</MetrikProvider>
        </SirketProvider>
        <WhatsAppCta href={whatsappHref(sirket)} />
        <CookieConsent />
      </body>
    </html>
  );
}
