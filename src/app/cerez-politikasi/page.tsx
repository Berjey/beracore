import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Starfield from '@/components/Starfield';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import LegalLayout from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Çerez Politikası | BERACORE',
  description:
    'BERACORE web sitesinde kullanılan çerezler, türleri, amaçları ve kullanıcı tercihlerinin yönetimi hakkında bilgiler.',
  alternates: { canonical: 'https://beracore.com/cerez-politikasi' },
};

const sections = [
  {
    title: 'Çerez Nedir?',
    body: 'Çerezler (cookies); ziyaret ettiğiniz web sitesi tarafından tarayıcınıza yerleştirilen küçük metin dosyalarıdır. Web sitesinin doğru çalışmasını, tercihlerinizin hatırlanmasını ve kullanım deneyiminin iyileştirilmesini sağlarlar.',
  },
  {
    title: 'Kullandığımız Çerez Türleri',
    body: [
      'Zorunlu çerezler: Web sitesinin temel işlevlerinin çalışması için gereklidir; devre dışı bırakılamaz.',
      'İşlevsel çerezler: Dil, tema ve oturum gibi kullanıcı tercihlerinin hatırlanmasını sağlar.',
      'Performans ve analitik çerezler: Ziyaretçi davranışlarını anonim olarak analiz ederek site performansını iyileştirmeye yardımcı olur.',
      'Pazarlama çerezleri: Açık rızanızla, ilginizi çekebilecek içerik ve kampanyaları sunmak amacıyla kullanılır.',
    ],
  },
  {
    title: 'Çerezlerin Saklanma Süresi',
    body: 'Çerezler, oturum çerezleri ve kalıcı çerezler olarak iki ana grupta saklanır. Oturum çerezleri tarayıcınızı kapattığınızda silinir; kalıcı çerezler ise belirlenen süre boyunca cihazınızda kalır veya siz temizleyene kadar saklanır.',
  },
  {
    title: 'Üçüncü Taraf Çerezleri',
    body: 'Web sitemizde analitik, performans ölçümü ve içerik entegrasyonu amacıyla Google Analytics gibi üçüncü taraf hizmetleri kullanılabilir. Bu hizmetler, kendi gizlilik politikalarına tabidir ve ilgili hizmet sağlayıcının web sitesinden incelenebilir.',
  },
  {
    title: 'Çerez Tercihlerinin Yönetimi',
    body: [
      'Tarayıcı ayarlarınızdan çerezleri silebilir, engelleyebilir veya belirli sitelere özel izin verebilirsiniz.',
      'Zorunlu olmayan çerezleri devre dışı bırakmanız, web sitesinin bazı özelliklerinin beklenmedik şekilde çalışmasına yol açabilir.',
      'Açık rıza kapsamındaki pazarlama ve analitik çerezleri, ilgili çerez bildirimimiz üzerinden reddedebilir veya daha sonra tarayıcı ayarlarınızdan güncelleyebilirsiniz.',
    ],
  },
  {
    title: 'Değişiklikler',
    body: 'Bu çerez politikası; hizmet ve teknoloji güncellemelerine bağlı olarak dönem dönem revize edilebilir. Güncel politika her zaman bu sayfada yayımlanır; önemli değişikliklerde kullanıcılarımızı ayrıca bilgilendiririz.',
  },
  {
    title: 'İletişim',
    body: 'Çerez uygulamalarımıza ilişkin sorularınız veya talepleriniz için info@beracore.com adresi üzerinden bize ulaşabilirsiniz.',
  },
];

export default function CerezPolitikasiPage() {
  return (
    <>
      <Starfield />
      <CustomCursor />
      <Navbar />
      <LegalLayout
        title="Çerez Politikası"
        accent="Yasal"
        intro="Web sitemizde kullandığımız çerezler, türleri, amaçları ve tercihlerinizi nasıl yönetebileceğiniz hakkında şeffaf bir özet."
        lastUpdated="Nisan 2026"
        sections={sections}
      />
      <Footer />
      <ScrollToTop />
    </>
  );
}
