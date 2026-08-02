import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Starfield from '@/components/Starfield';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import LegalLayout from '@/components/LegalLayout';
// Icerik veritabanindan okunur; tablo bossa/okunamazsa koddaki metne duser.
import { getLegalDoc, getRevizyonlar } from '@/lib/db/content';
import { getSirket } from '@/lib/db/settings';
import { notFound } from 'next/navigation';

const SLUG = 'gizlilik-politikasi';
// Metinlerde gecen adres; merkezi ayardaki degerle degistirilir.
const ESKI_EPOSTA = 'info@beracore.com';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | BERACORE',
  description:
    'BERACORE gizlilik politikası: Kişisel verilerinizin toplanma, işlenme ve korunma esaslarına ilişkin bilgilendirme.',
  alternates: { canonical: 'https://beracore.com/gizlilik-politikasi' },
};

export default function GizlilikPolitikasiPage() {
  const dokuman = getLegalDoc(SLUG);
  if (!dokuman) notFound();

  // Iletisim adresi metinlerin ICINDE gecer. Merkezi ayardan gelmesi icin
  // tohumda `{{eposta}}` yer tutucusu YOK — mevcut metin birebir korunuyor;
  // bunun yerine adres, metinde gecen sabit deger ile degistiriliyor.
  // Boylece panelden e-posta degisince hukuki metinler de guncellenir (A-08).
  const eposta = getSirket().email;
  const bolumler = dokuman.sections.map((b) => ({
    ...b,
    body: Array.isArray(b.body)
      ? b.body.map((x) => x.replaceAll(ESKI_EPOSTA, eposta))
      : b.body.replaceAll(ESKI_EPOSTA, eposta),
  }));

  return (
    <>
      <Starfield />
      <CustomCursor />
      <Navbar />
      <LegalLayout
        title={dokuman.title}
        accent={dokuman.accent}
        intro={dokuman.intro}
        lastUpdated={dokuman.lastUpdated}
        sections={bolumler}
        revizyonlar={getRevizyonlar(SLUG)}
      />
      <Footer />
      <ScrollToTop />
    </>
  );
}
