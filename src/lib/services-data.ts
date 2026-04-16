export interface SubService {
  title: string;
  image: string;  // emoji or icon placeholder — will be replaced with real images later
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
      { title: 'AI Chatbot & Asistan', image: '🤖' },
      { title: 'Süreç Otomasyonu', image: '⚙️' },
      { title: 'AI Veri Analizi', image: '📊' },
      { title: 'Özel AI Çözümleri', image: '🧠' },
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
      { title: 'Kripto Para Borsası Yazılımı', image: '💰' },
      { title: 'Akıllı Kontrat Geliştirme', image: '📜' },
      { title: 'DeFi & Token Çözümleri', image: '🔗' },
      { title: 'Ödeme Altyapısı', image: '💳' },
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
      { title: 'Web Yazılım', image: '🌐' },
      { title: 'Mobil Uygulama', image: '📱' },
      { title: 'Özel Yazılım', image: '🛠️' },
      { title: 'API & Entegrasyon', image: '🔌' },
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
      { title: 'Web Tasarım', image: '🎨' },
      { title: 'UI/UX Tasarım', image: '✨' },
      { title: 'Marka Kimliği', image: '🏷️' },
      { title: 'Grafik Tasarım', image: '🖼️' },
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
      { title: 'E-Ticaret Yazılım', image: '🛒' },
      { title: 'Pazaryeri Entegrasyonu', image: '🏪' },
      { title: 'Ödeme Sistemleri', image: '💎' },
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
      { title: 'SEO', image: '🔍' },
      { title: 'Sosyal Medya Yönetimi', image: '📣' },
      { title: 'Google & Meta Reklamları', image: '📈' },
      { title: 'İçerik Pazarlama', image: '✍️' },
    ],
  },
];
