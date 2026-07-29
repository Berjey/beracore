import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Starfield from '@/components/Starfield';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollProgress from '@/components/ScrollProgress';
import AboutPage from '@/components/AboutPage';

const ABOUT_SECTIONS = [
  { label: 'Giriş', sel: '.ab-hero-section' },
  { label: 'Hikâye', sel: '.ab-story' },
  { label: 'Rakamlar', sel: '.ab-stats' },
  { label: 'Değerler', sel: '.ab-values' },
  { label: 'Yolculuk', sel: '.ab-timeline' },
  { label: 'Uzmanlık', sel: '.ab-services' },
  { label: 'İletişim', sel: '.ab-cta' },
];

export const metadata: Metadata = {
  title: 'Hakkımızda | BERACORE — Digital Experience Studio',
  description:
    'BERACORE: Yapay zeka, blockchain, yazılım, tasarım ve dijital pazarlamada uzman ekiple dijital dönüşüm çözümleri sunan İstanbul merkezli dijital stüdyo.',
  openGraph: {
    title: 'Hakkımızda | BERACORE',
    description: 'Yaratıcı tasarım, güçlü mühendislik ve modern teknolojilerle dijital deneyimler üreten BERACORE ekibini tanıyın.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'BERACORE',
    url: 'https://beracore.com/hakkimizda',
    images: [{ url: '/beracore-bg.png', width: 600, height: 392, alt: 'BERACORE Hakkında' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hakkımızda | BERACORE',
    description: 'Yaratıcı tasarım, güçlü mühendislik ve modern teknolojilerle dijital deneyimler üreten BERACORE ekibini tanıyın.',
    images: ['/beracore-bg.png'],
  },
  alternates: { canonical: 'https://beracore.com/hakkimizda' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'BERACORE Hakkında',
  description: 'BERACORE — Dijital deneyim stüdyosu. Yapay zeka, blockchain, yazılım ve tasarım alanlarında uzman ekip.',
  url: 'https://beracore.com/hakkimizda',
  mainEntity: {
    '@type': 'Organization',
    name: 'BERACORE',
    url: 'https://beracore.com',
    foundingDate: '2019',
    numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 10, maxValue: 50 },
    address: { '@type': 'PostalAddress', addressLocality: 'İstanbul', addressCountry: 'TR' },
  },
};

export default function HakkimizdaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Starfield />
      <CustomCursor />
      <Navbar />
      <ScrollProgress sections={ABOUT_SECTIONS} />
      <main id="main" className="relative z-[1]">
        <AboutPage />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
