import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Starfield from '@/components/Starfield';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ContactPage from '@/components/ContactPage';

export const metadata: Metadata = {
  title: 'Teklif Al | BERACORE — Digital Experience Studio',
  description: 'BERACORE ile projenizi konuşalım. Ücretsiz keşif görüşmesi ve teklif almak için bizimle iletişime geçin. Yapay zeka, blockchain, yazılım, tasarım ve dijital pazarlama.',
  alternates: { canonical: 'https://beracore.com/teklif-al' },
};

export default function TeklifAlPage() {
  return (
    <>
      <Starfield />
      <CustomCursor />
      <Navbar />
      <main className="relative z-[1]">
        <ContactPage />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
