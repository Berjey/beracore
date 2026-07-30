import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Starfield from '@/components/Starfield';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollProgress from '@/components/ScrollProgress';
import ContactPage from '@/components/ContactPage';
import { ogImages, twitterImages } from '@/lib/seo';

const CONTACT_SECTIONS = [
  { label: 'Giriş', sel: '.ct-hero-section' },
  { label: 'Kanallar', sel: '.ct-methods' },
  { label: 'Teklif', sel: '#teklif' },
  { label: 'Süreç', sel: '.ct-process' },
  { label: 'SSS', sel: '.ct-faq' },
];

export const metadata: Metadata = {
  title: 'İletişim | BERACORE — Digital Experience Studio',
  description: 'BERACORE ile projenizi konuşalım. Ücretsiz keşif görüşmesi ve teklif için iletişime geçin. Yapay zeka, blockchain, yazılım, tasarım ve dijital pazarlama.',
  openGraph: {
    title: 'İletişim | BERACORE',
    description: 'Projeniz için ücretsiz keşif görüşmesi ve teklif alın. BERACORE ile iletişime geçin.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'BERACORE',
    url: 'https://beracore.com/iletisim',
    images: ogImages('BERACORE İletişim'),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'İletişim | BERACORE',
    description: 'Projeniz için ücretsiz keşif görüşmesi ve teklif alın. BERACORE ile iletişime geçin.',
    images: twitterImages,
  },
  alternates: { canonical: 'https://beracore.com/iletisim' },
};

export default function IletisimPage() {
  return (
    <>
      <Starfield />
      <CustomCursor />
      <Navbar />
      <ScrollProgress sections={CONTACT_SECTIONS} />
      <main id="main" className="relative z-[1]">
        <ContactPage />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
