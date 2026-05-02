import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import ScrollReset from '@/components/ScrollReset';
import MotionGuard from '@/components/MotionGuard';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0f0d16',
  colorScheme: 'dark',
};

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
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
  robots: 'index,follow',
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
  other: {
    'theme-color': '#0f0d16',
    'color-scheme': 'dark',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BERACORE',
  alternateName: 'Beracore Digital Experience Studio',
  url: 'https://beracore.com',
  description:
    'Yaratıcı tasarım, güçlü mühendislik ve modern teknolojilerle markanız için unutulmaz dijital deneyimler üreten dijital deneyim stüdyosu.',
  email: 'info@beracore.com',
  telephone: '+908503026950',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'İstanbul',
    addressCountry: 'TR',
  },
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23fff7ad'/%3E%3Cstop offset='100%25' stop-color='%23ffa9f9'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='7' fill='%230f0d16'/%3E%3Ccircle cx='16' cy='16' r='8' fill='none' stroke='url(%23g)' stroke-width='2.6'/%3E%3Ccircle cx='16' cy='16' r='2.2' fill='url(%23g)'/%3E%3C/svg%3E"
        />
        {/* Scroll to top on refresh — senkron çalışır, hydration beklemez */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
              window.addEventListener('beforeunload', function() { window.scrollTo(0, 0); });
              window.addEventListener('pageshow', function(e) { if (e.persisted) window.scrollTo(0, 0); });
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="cursor-custom" suppressHydrationWarning>
        <MotionGuard />
        <ScrollReset />
        {children}
      </body>
    </html>
  );
}
