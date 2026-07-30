import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import MotionGuard from '@/components/MotionGuard';
import CookieConsent from '@/components/CookieConsent';
import WhatsAppCta from '@/components/WhatsAppCta';
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
  metadataBase: new URL('https://beracore.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://beracore.com',
    title: 'BERACORE — Digital Experience Studio',
    description: 'Yaratıcı tasarım, güçlü mühendislik ve modern teknolojilerle markanız için unutulmaz dijital deneyimler.',
    siteName: 'BERACORE',
    images: [
      {
        url: '/beracore-bg.png',
        width: 600,
        height: 392,
        alt: 'BERACORE — Digital Experience Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BERACORE — Digital Experience Studio',
    description: 'Yaratıcı tasarım, güçlü mühendislik ve modern teknolojilerle markanız için unutulmaz dijital deneyimler.',
    images: ['/beracore-bg.png'],
  },
  // NOT: theme-color / color-scheme yalnızca `viewport` export'unda tanımlanır.
  // Burada tekrar verilirse Next aynı meta etiketini iki kez basar.
};

// Sosyal profiller — Footer'daki SOCIALS ile aynı.
// Google, sameAs ile marka kimliğini doğrular — dış sinyal olarak SEO'ya katkı sağlar.
// NOT: Bu profillerin GERÇEKTEN açık ve sitene link veriyor olması gerekir. Hesaplar henüz
// açılmadı → boş bırakıldı (var olmayan profile sameAs vermek doğrulanamaz sinyal olur).
// Hesaplar `beracore` kullanıcı adıyla açılınca aşağıdaki satırları geri aç.
const socialProfiles: string[] = [
  // 'https://instagram.com/beracore',
  // 'https://linkedin.com/company/beracore',
  // 'https://x.com/beracore',
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://beracore.com/#business',
  name: 'BERACORE',
  alternateName: 'Beracore Digital Experience Studio',
  url: 'https://beracore.com',
  description:
    'Yaratıcı tasarım, güçlü mühendislik ve modern teknolojilerle markanız için unutulmaz dijital deneyimler üreten dijital deneyim stüdyosu.',
  image: 'https://beracore.com/beracore-bg.png',
  logo: 'https://beracore.com/beracore.png',
  email: 'info@beracore.com',
  telephone: '+905539862306',
  priceRange: '₺₺₺',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'İstanbul',
    addressRegion: 'İstanbul',
    addressCountry: 'TR',
  },
  areaServed: [
    { '@type': 'City', name: 'İstanbul' },
    { '@type': 'Country', name: 'Türkiye' },
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
  ...(socialProfiles.length ? { sameAs: socialProfiles } : {}),
};

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BERACORE',
  url: 'https://beracore.com',
  inLanguage: 'tr-TR',
  publisher: { '@type': 'Organization', name: 'BERACORE', url: 'https://beracore.com' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
        {children}
        <WhatsAppCta />
        <CookieConsent />
      </body>
    </html>
  );
}
