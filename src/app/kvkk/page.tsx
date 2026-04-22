import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Starfield from '@/components/Starfield';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import LegalLayout from '@/components/LegalLayout';
import { kvkkMeta, kvkkSections } from '@/lib/kvkk-data';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni | BERACORE',
  description:
    '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında BERACORE Aydınlatma Metni.',
  alternates: { canonical: 'https://beracore.com/kvkk' },
};

export default function KvkkPage() {
  return (
    <>
      <Starfield />
      <CustomCursor />
      <Navbar />
      <LegalLayout
        title={kvkkMeta.title}
        accent={kvkkMeta.accent}
        intro={kvkkMeta.intro}
        lastUpdated={kvkkMeta.lastUpdated}
        sections={kvkkSections}
      />
      <Footer />
      <ScrollToTop />
    </>
  );
}
