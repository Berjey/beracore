export interface SubService {
  title: string;
  image: string;
  icon: string;
  description: string;
  features: string[];
}

export interface Service {
  key: string;
  title: string;
  subtitle: string;
  color: string;
  glowColor: string;
  shape: 'sphere' | 'cube' | 'octahedron' | 'torus' | 'diamond' | 'ring';
  description: string;
  subServices: SubService[];
}

export const services: Service[] = [
  {
    key: 'ai',
    title: 'Yapay Zeka & Otomasyon',
    subtitle: 'Geleceği bugünden inşa edin',
    color: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.15)',
    shape: 'octahedron',
    description: 'İş süreçlerinizi yapay zeka ile dönüştürüyor, akıllı otomasyon çözümleriyle verimliliğinizi katlanarak artırıyoruz.',
    subServices: [
      { title: 'AI Chatbot & Asistan', image: '🤖', icon: 'chatbot', description: 'Müşteri hizmetlerini 7/24 yapay zeka destekli chatbot ve sanal asistanlarla otomatikleştirin. Doğal dil işleme ile insan benzeri etkileşimler sunun.', features: ['Doğal Dil İşleme (NLP)', 'Çok dilli destek', 'CRM entegrasyonu', 'Öğrenen algoritma'] },
      { title: 'Süreç Otomasyonu', image: '⚙️', icon: 'gear', description: 'Tekrarlayan iş süreçlerini RPA ve AI ile otomatikleştirerek operasyonel verimliliğinizi artırın. İnsan hatasını minimize edin.', features: ['RPA entegrasyonu', 'İş akışı tasarımı', 'Raporlama & analitik', 'API otomasyon'] },
      { title: 'AI Veri Analizi', image: '📊', icon: 'chart', description: 'Büyük veri setlerinden anlamlı içgörüler çıkarın. Tahmine dayalı analitik ile geleceğe yönelik kararlar alın.', features: ['Tahmine dayalı analitik', 'Gerçek zamanlı dashboard', 'Veri görselleştirme', 'Makine öğrenmesi modelleri'] },
      { title: 'Özel AI Çözümleri', image: '🧠', icon: 'brain', description: 'İşletmenize özel yapay zeka modelleri ve çözümleri geliştiriyoruz. Sektörünüze uygun, ölçeklenebilir AI altyapısı.', features: ['Özel model eğitimi', 'Görüntü & ses işleme', 'Öneri sistemleri', 'Anomali tespiti'] },
    ],
  },
  {
    key: 'blockchain',
    title: 'Blockchain & Fintech',
    subtitle: 'Finansın yeni mimarisi',
    color: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.15)',
    shape: 'cube',
    description: 'Kripto para borsası, akıllı kontrat ve merkeziyetsiz finans çözümleriyle dijital finansın altyapısını kuruyoruz.',
    subServices: [
      { title: 'Kripto Para Borsası Yazılımı', image: '💰', icon: 'coin', description: 'Güvenli, yüksek performanslı ve ölçeklenebilir kripto para borsası platformları geliştiriyoruz. Spot, futures ve marjin işlem desteği.', features: ['Yüksek frekanslı trade engine', 'Soğuk/sıcak cüzdan sistemi', 'KYC/AML entegrasyonu', 'Likidite yönetimi'] },
      { title: 'Akıllı Kontrat Geliştirme', image: '📜', icon: 'contract', description: 'Ethereum, Solana ve diğer blockchain ağlarında güvenli akıllı kontratlar yazıyoruz. Denetlenmiş ve optimize edilmiş kod.', features: ['Solidity & Rust', 'Güvenlik denetimi', 'Gas optimizasyonu', 'Upgradeable kontratlar'] },
      { title: 'DeFi & Token Çözümleri', image: '🔗', icon: 'chain', description: 'Merkeziyetsiz finans protokolleri ve token ekonomileri tasarlıyoruz. Staking, yield farming ve likidite havuzları.', features: ['Token oluşturma (ERC-20/721)', 'DEX entegrasyonu', 'Staking & farming', 'DAO yönetişim'] },
      { title: 'Ödeme Altyapısı', image: '💳', icon: 'creditcard', description: 'Kripto ve fiat ödeme altyapıları kuruyoruz. PCI DSS uyumlu, güvenli ve hızlı ödeme çözümleri.', features: ['Kripto ödeme gateway', 'Fiat on/off ramp', 'PCI DSS uyumluluk', 'Multi-currency destek'] },
    ],
  },
  {
    key: 'software',
    title: 'Yazılım Geliştirme',
    subtitle: 'Güçlü altyapı, temiz kod',
    color: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.15)',
    shape: 'sphere',
    description: 'Modern teknolojilerle ölçeklenebilir, güvenli ve yüksek performanslı yazılım çözümleri geliştiriyoruz.',
    subServices: [
      { title: 'Web Yazılım', image: '🌐', icon: 'globe', description: 'Modern web teknolojileriyle hızlı, güvenli ve SEO uyumlu web uygulamaları geliştiriyoruz. React, Next.js ve Node.js altyapısı.', features: ['React / Next.js', 'Node.js & Express', 'PostgreSQL & MongoDB', 'CI/CD pipeline'] },
      { title: 'Mobil Uygulama', image: '📱', icon: 'mobile', description: 'iOS ve Android için native ve cross-platform mobil uygulamalar geliştiriyoruz. Performans odaklı, kullanıcı dostu tasarım.', features: ['React Native / Flutter', 'Native iOS & Android', 'Push bildirimler', 'Offline mod desteği'] },
      { title: 'Özel Yazılım', image: '🛠️', icon: 'wrench', description: 'İşletmenizin benzersiz ihtiyaçlarına özel yazılım çözümleri tasarlıyor ve geliştiriyoruz. ERP, CRM ve iş zekası.', features: ['ERP sistemleri', 'CRM çözümleri', 'İş zekası (BI)', 'Microservice mimari'] },
      { title: 'API & Entegrasyon', image: '🔌', icon: 'plug', description: 'Sistemlerinizi birbirine bağlayan güçlü API\'ler ve entegrasyonlar geliştiriyoruz. RESTful ve GraphQL.', features: ['RESTful API tasarımı', 'GraphQL', '3. parti entegrasyonlar', 'Webhook & event-driven'] },
    ],
  },
  {
    key: 'design',
    title: 'Tasarım',
    subtitle: 'Estetik kod ile buluşuyor',
    color: '#ffa9f9',
    glowColor: 'rgba(255, 169, 249, 0.15)',
    shape: 'diamond',
    description: 'Kullanıcı odaklı tasarım anlayışıyla markanızın dijital yüzünü kusursuz şekilde oluşturuyoruz.',
    subServices: [
      { title: 'Web Tasarım', image: '🎨', icon: 'palette', description: 'Markanızı dijitalde en iyi şekilde temsil eden, modern ve responsive web tasarımları oluşturuyoruz.', features: ['Responsive tasarım', 'Motion & animasyon', 'Figma prototyping', 'Design system'] },
      { title: 'UI/UX Tasarım', image: '✨', icon: 'layout', description: 'Kullanıcı araştırması ve testleriyle desteklenen, dönüşüm odaklı arayüz ve deneyim tasarımları sunuyoruz.', features: ['Kullanıcı araştırması', 'Wireframe & prototype', 'A/B test tasarımı', 'Accessibility (WCAG)'] },
      { title: 'Marka Kimliği', image: '🏷️', icon: 'badge', description: 'Logo, renk paleti, tipografi ve marka rehberinden oluşan kapsamlı marka kimliği paketleri hazırlıyoruz.', features: ['Logo tasarımı', 'Renk & tipografi', 'Marka rehberi', 'Sosyal medya kiti'] },
      { title: 'Grafik Tasarım', image: '🖼️', icon: 'frame', description: 'Dijital ve basılı ortamlar için etkileyici görsel tasarımlar üretiyoruz. Banner, afiş ve sunum tasarımı.', features: ['Sosyal medya görselleri', 'Banner & reklam', 'Sunum tasarımı', 'İnfografik'] },
    ],
  },
  {
    key: 'ecommerce',
    title: 'E-Ticaret',
    subtitle: 'Satışın dijital gücü',
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.15)',
    shape: 'torus',
    description: 'Satışlarınızı artıran, operasyonlarınızı kolaylaştıran güçlü e-ticaret platformları kuruyoruz.',
    subServices: [
      { title: 'E-Ticaret Yazılım', image: '🛒', icon: 'cart', description: 'Özel e-ticaret platformları ve mağaza yazılımları geliştiriyoruz. Yüksek trafik ve ölçeklenebilirlik odaklı.', features: ['Özel mağaza yazılımı', 'Stok & sipariş yönetimi', 'Çoklu dil & para birimi', 'Mobil uyumlu'] },
      { title: 'Pazaryeri Entegrasyonu', image: '🏪', icon: 'store', description: 'Trendyol, Hepsiburada, Amazon ve diğer pazaryerlerine entegrasyon sağlıyoruz. Tek panelden çoklu kanal yönetimi.', features: ['Trendyol & Hepsiburada', 'Amazon & Etsy', 'Stok senkronizasyonu', 'Otomatik fiyatlandırma'] },
      { title: 'Ödeme Sistemleri', image: '💎', icon: 'diamond', description: 'Güvenli ve hızlı ödeme entegrasyonları kuruyoruz. Tüm popüler ödeme yöntemlerini destekliyoruz.', features: ['iyzico & Stripe', 'Sanal POS entegrasyonu', 'Taksitli ödeme', 'Abonelik yönetimi'] },
    ],
  },
  {
    key: 'marketing',
    title: 'Dijital Pazarlama',
    subtitle: 'Doğru kitleye, doğru zamanda',
    color: '#fff7ad',
    glowColor: 'rgba(255, 247, 173, 0.15)',
    shape: 'ring',
    description: 'Veriye dayalı stratejilerle markanızı hedef kitlenize ulaştırıyor, sürdürülebilir büyüme sağlıyoruz.',
    subServices: [
      { title: 'SEO', image: '🔍', icon: 'search', description: 'Arama motorlarında üst sıralara çıkmanızı sağlıyoruz. Teknik SEO, içerik stratejisi ve backlink çalışması.', features: ['Teknik SEO denetimi', 'Anahtar kelime stratejisi', 'İçerik optimizasyonu', 'Backlink çalışması'] },
      { title: 'Sosyal Medya Yönetimi', image: '📣', icon: 'megaphone', description: 'Sosyal medya hesaplarınızı profesyonelce yönetiyoruz. İçerik planı, paylaşım takvimi ve topluluk yönetimi.', features: ['İçerik planı & takvim', 'Görsel & video üretimi', 'Topluluk yönetimi', 'Performans raporlama'] },
      { title: 'Google & Meta Reklamları', image: '📈', icon: 'trending', description: 'Google Ads ve Meta (Facebook/Instagram) reklamlarıyla hedef kitlenize ulaşın. ROI odaklı kampanya yönetimi.', features: ['Google Ads yönetimi', 'Meta Ads kampanyaları', 'Remarketing stratejileri', 'A/B test & optimizasyon'] },
      { title: 'İçerik Pazarlama', image: '✍️', icon: 'pen', description: 'Blog, makale, video ve infografik ile markanızın otoritesini artırın. SEO uyumlu içerik stratejisi.', features: ['Blog & makale yazımı', 'Video içerik', 'E-mail pazarlama', 'İçerik takvimi'] },
    ],
  },
];
