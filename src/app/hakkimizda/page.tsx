import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Starfield from '@/components/Starfield';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import { getSirket } from '@/lib/db/settings';
import { postalAddress, type SirketBilgisi } from '@/lib/sirket';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollProgress from '@/components/ScrollProgress';
import AboutPage from '@/components/AboutPage';
import { SITE_URL, ogImages, twitterImages } from '@/lib/seo';

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
    images: ogImages('BERACORE Hakkında'),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hakkımızda | BERACORE',
    description: 'Yaratıcı tasarım, güçlü mühendislik ve modern teknolojilerle dijital deneyimler üreten BERACORE ekibini tanıyın.',
    images: twitterImages,
  },
  alternates: { canonical: 'https://beracore.com/hakkimizda' },
};

function aboutLd(sirket: SirketBilgisi) {
  return {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'BERACORE Hakkında',
  description: 'BERACORE — Dijital deneyim stüdyosu. Yapay zeka, blockchain, yazılım ve tasarım alanlarında uzman ekip.',
  url: 'https://beracore.com/hakkimizda',
  mainEntity: {
    '@type': 'Organization',
    name: 'BERACORE',
    url: SITE_URL,
    // 2 Agu 2026 duzeltmesi (bulgu A-07): burada `foundingDate: '2019'` ve
    // `numberOfEmployees: 10-50` yaziyordu. Ikisi de sitenin GORUNEN icerigiyle
    // celisiyordu — zaman cizelgesi (AboutPage TIMELINE) ve ana sayfa sayaci
    // kurulusu 2024, ekibi "5+" olarak gosteriyor. Google yapisal veriyi okur;
    // gorunen sayfayla celisen bir iddia hem yanlis hem guven kaybettiricidir.
    // `numberOfEmployees` tamamen kaldirildi: kanitlanmamis bir sayiyi yapisal
    // veride yayinlamak, sayfada yayinlamaktan daha risklidir (makine okur, alintilar).
    foundingDate: '2024',
    address: postalAddress(sirket),
  },
  };
}

export default function HakkimizdaPage() {
  const sirket = getSirket();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutLd(sirket)) }} />
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
