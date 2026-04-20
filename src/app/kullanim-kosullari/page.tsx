import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Starfield from '@/components/Starfield';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import LegalLayout from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları | BERACORE',
  description:
    'BERACORE web sitesi ve hizmetlerinin kullanımına ilişkin koşullar, tarafların hak ve yükümlülükleri.',
  alternates: { canonical: 'https://beracore.com/kullanim-kosullari' },
};

const sections = [
  {
    title: 'Kapsam',
    body: 'İşbu Kullanım Koşulları; beracore.com alan adı altında sunulan web sitesi ve tüm dijital hizmetlerin kullanımını düzenler. Siteyi ziyaret ederek veya hizmetlerimizi kullanarak bu koşulları okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan edersiniz.',
  },
  {
    title: 'Hizmetlerin Kullanımı',
    body: [
      'Siteyi yalnızca yürürlükteki mevzuata uygun ve iyi niyet kuralları çerçevesinde kullanabilirsiniz.',
      'Sitenin güvenliğini, bütünlüğünü veya erişilebilirliğini tehdit edecek faaliyetlerde bulunulamaz.',
      'Otomatik araçlarla (bot, scraper, crawler) veri toplamak veya site işleyişini manipüle etmek yasaktır.',
      'Sahte kimlik, yanıltıcı bilgi ya da başkasına ait bilgilerin izinsiz kullanımı kabul edilemez.',
    ],
  },
  {
    title: 'Fikri Mülkiyet Hakları',
    body: 'Web sitesi üzerindeki tüm içerik, marka, logo, metin, görsel, yazılım ve tasarım unsurları BERACORE\'a veya ilgili lisans sahiplerine aittir; 5846 sayılı Fikir ve Sanat Eserleri Kanunu ve ilgili mevzuat kapsamında korunur. İzinsiz kopyalama, çoğaltma, dağıtma veya türev çalışma üretme yasaktır.',
  },
  {
    title: 'Müşteri Projeleri ve Teslim',
    body: 'Müşterilerimiz adına gerçekleştirdiğimiz projelerde; sözleşmede aksi belirtilmediği sürece, teslim edilen kaynak kod, tasarım varlıkları ve dokümantasyonun fikri mülkiyet hakları ödemenin tamamlanmasının ardından ilgili müşteriye devredilir. Açık kaynak bileşenler ve üçüncü taraf lisansları kendi şartlarına tabidir.',
  },
  {
    title: 'Sorumluluğun Sınırlandırılması',
    body: 'Web sitesi ve içeriği "olduğu gibi" sunulmaktadır. BERACORE; sitenin kesintisiz, hatasız veya belirli bir amaca uygunluğunu garanti etmez. Site kullanımından doğabilecek doğrudan, dolaylı, arızi veya sonuç niteliğindeki zararlardan, yürürlükteki mevzuatın izin verdiği azami ölçüde, sorumlu tutulamaz.',
  },
  {
    title: 'Üçüncü Taraf Bağlantıları',
    body: 'Sitemizde üçüncü taraf web sitelerine yönlendiren bağlantılar yer alabilir. BERACORE; bu sitelerin içerik, politika veya uygulamalarından sorumlu değildir ve söz konusu sitelerin kendi kullanım koşullarına tabi olunduğunu hatırlatır.',
  },
  {
    title: 'Değişiklikler',
    body: 'BERACORE; işbu Kullanım Koşulları\'nı önceden haber vermeksizin tek taraflı olarak güncelleme hakkını saklı tutar. Güncellenmiş koşullar bu sayfada yayımlandığı anda yürürlüğe girer; siteyi kullanmaya devam etmeniz güncel koşulları kabul ettiğiniz anlamına gelir.',
  },
  {
    title: 'Uygulanacak Hukuk ve Yetkili Mahkeme',
    body: 'Bu koşulların yorumu ve uygulanmasında Türkiye Cumhuriyeti mevzuatı geçerlidir. Kullanım Koşulları\'ndan doğabilecek uyuşmazlıkların çözümünde İstanbul Merkez (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir.',
  },
  {
    title: 'İletişim',
    body: 'Kullanım Koşulları\'na ilişkin sorularınızı info@beracore.com adresine iletebilirsiniz.',
  },
];

export default function KullanimKosullariPage() {
  return (
    <>
      <Starfield />
      <CustomCursor />
      <Navbar />
      <LegalLayout
        title="Kullanım Koşulları"
        accent="Yasal"
        intro="BERACORE web sitesi ve dijital hizmetlerinin kullanımına ilişkin hak, yükümlülük ve sorumlulukları düzenleyen metindir. Lütfen dikkatle inceleyiniz."
        lastUpdated="Nisan 2026"
        sections={sections}
      />
      <Footer />
      <ScrollToTop />
    </>
  );
}
