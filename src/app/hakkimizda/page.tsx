import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Starfield from '@/components/Starfield';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import AboutPage from '@/components/AboutPage';

export const metadata: Metadata = {
  title: 'Hakkımızda | BERACORE — Digital Experience Studio',
  description:
    'BERACORE hakkında: Yapay zeka, blockchain, yazılım geliştirme, tasarım ve dijital pazarlama alanlarında uzman ekibimiz ile dijital dönüşüm çözümleri sunuyoruz. İstanbul merkezli dijital ajans.',
  openGraph: {
    title: 'Hakkımızda | BERACORE',
    description: 'Yaratıcı tasarım, güçlü mühendislik ve modern teknolojilerle dijital deneyimler üreten BERACORE ekibini tanıyın.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'BERACORE',
    url: 'https://beracore.com/hakkimizda',
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
      <main className="relative z-[1]">
        <AboutPage />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
