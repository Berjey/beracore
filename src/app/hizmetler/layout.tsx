import Navbar from '@/components/Navbar';
import Starfield from '@/components/Starfield';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function HizmetlerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Starfield />
      <CustomCursor />
      <Navbar />
      <main className="relative z-[1]">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
