import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Starfield from '@/components/Starfield';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import LegalLayout from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | BERACORE',
  description:
    'BERACORE gizlilik politikası: Kişisel verilerinizin toplanma, işlenme ve korunma esaslarına ilişkin bilgilendirme.',
  alternates: { canonical: 'https://beracore.com/gizlilik-politikasi' },
};

const sections = [
  {
    title: 'Genel Bilgilendirme',
    body: 'BERACORE ("biz", "şirket"), kullanıcılarının ve ziyaretçilerinin gizliliğine önem verir. İşbu Gizlilik Politikası; web sitemiz, hizmetlerimiz ve dijital platformlarımız aracılığıyla topladığımız kişisel verilerin nasıl işlendiğini, korunduğunu ve kimlerle paylaşıldığını açıklar.',
  },
  {
    title: 'Toplanan Kişisel Veriler',
    body: [
      'Kimlik ve iletişim verileri: ad, soyad, e-posta adresi, telefon numarası, şirket bilgisi.',
      'Teknik veriler: IP adresi, tarayıcı türü, ziyaret edilen sayfalar, cihaz bilgisi.',
      'Form ve mesaj verileri: teklif talep formu, iletişim formu ve müşteri destek mesajları aracılığıyla ilettiğiniz içerikler.',
      'Çerez tabanlı veriler: oturum, tercih ve analitik amaçlı çerez verileri (detay için Çerez Politikamıza bakınız).',
    ],
  },
  {
    title: 'Verilerin İşlenme Amaçları',
    body: [
      'Taleplerinize yanıt vermek ve teklif süreçlerini yürütmek.',
      'Sözleşme ilişkisini kurmak, sürdürmek ve yükümlülüklerimizi yerine getirmek.',
      'Web sitemizin performansını, güvenliğini ve kullanıcı deneyimini iyileştirmek.',
      'Yasal yükümlülüklerimizi karşılamak ve olası hukuki uyuşmazlıklarda savunmamızı sağlamak.',
    ],
  },
  {
    title: 'Verilerin Paylaşımı',
    body: 'Kişisel verileriniz; yalnızca hizmetin ifası için gerekli olan hallerde ve yürürlükteki mevzuatın gerektirdiği kapsamda bulut hizmet sağlayıcıları, altyapı ortakları, hukuki danışmanlar ve resmi kurumlarla sınırlı olarak paylaşılabilir. Rızanız olmaksızın üçüncü taraflarla ticari amaçla paylaşılmaz veya satılmaz.',
  },
  {
    title: 'Veri Saklama Süresi',
    body: 'Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve yürürlükteki mevzuatın öngördüğü zamanaşımı sürelerince saklanır. Amaç ortadan kalktığında verileriniz silinir, yok edilir veya anonim hale getirilir.',
  },
  {
    title: 'Veri Güvenliği',
    body: 'BERACORE; kişisel verilerin yetkisiz erişim, ifşa, değiştirme veya imha riskine karşı uygun teknik ve idari tedbirleri alır. Güncel şifreleme protokolleri, erişim yönetimi, düzenli güvenlik denetimleri ve sızma testleri standart operasyonumuzdur.',
  },
  {
    title: 'Haklarınız',
    body: 'KVKK ve ilgili mevzuat kapsamında; verilerinizin işlenip işlenmediğini öğrenme, işlenen verilere erişme, düzeltme, silme, aktarımın engellenmesi ve otomatik karar alma süreçlerine itiraz etme haklarına sahipsiniz. Detaylı bilgi için KVKK Aydınlatma Metni sayfamızı inceleyebilirsiniz.',
  },
  {
    title: 'İletişim',
    body: 'Gizlilik politikamıza ilişkin sorularınız için info@beracore.com adresi üzerinden bizimle iletişime geçebilirsiniz. Bu politika, ihtiyaç halinde güncellenebilir; güncel versiyon her zaman bu sayfada yayımlanır.',
  },
];

export default function GizlilikPolitikasiPage() {
  return (
    <>
      <Starfield />
      <CustomCursor />
      <Navbar />
      <LegalLayout
        title="Gizlilik Politikası"
        accent="Yasal"
        intro="Kişisel verilerinizin gizliliğine ve güvenliğine verdiğimiz önem doğrultusunda; hangi verileri topladığımızı, nasıl işlediğimizi ve haklarınızı şeffaf biçimde açıklıyoruz."
        lastUpdated="Nisan 2026"
        sections={sections}
      />
      <Footer />
      <ScrollToTop />
    </>
  );
}
