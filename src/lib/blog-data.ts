// Blog içerik veri modeli.
// Yeni yazı eklemek için: bu diziye yeni bir BlogPost nesnesi ekleyin.
// content bloklarını sırayla render ederiz; SEO için tüm içerik SSR HTML'de yer alır.

export type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  /** ISO tarih — yazının yayın tarihi */
  publishedAt: string;
  /** ISO tarih — son güncelleme (yoksa publishedAt kullanılır) */
  updatedAt?: string;
  author: string;
  category: string;
  /** Tahmini okuma süresi (dakika) */
  readingMinutes: number;
  /** İlgili hizmete iç link (huni girişi) */
  relatedService?: { label: string; href: string };
  content: ContentBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'ai-chatbot-nedir',
    title: 'AI Chatbot Nedir, İşletmenize Ne Kazandırır?',
    metaTitle: 'AI Chatbot Nedir? İşletmeye Faydaları ve Maliyeti | BERACORE',
    metaDescription:
      'AI chatbot nedir, nasıl çalışır ve işletmenize ne kazandırır? Müşteri hizmetlerinde %60 maliyet tasarrufu, 7/24 destek ve entegrasyon detayları BERACORE blogunda.',
    excerpt:
      'Yapay zeka destekli chatbotlar müşteri hizmetlerini kökten değiştiriyor. Bu rehberde AI chatbotun ne olduğunu, nasıl çalıştığını ve işletmenize nasıl değer kattığını anlatıyoruz.',
    publishedAt: '2026-07-24',
    author: 'BERACORE',
    category: 'Yapay Zeka',
    readingMinutes: 6,
    relatedService: { label: 'AI Chatbot & Asistan hizmetimiz', href: '/hizmetler/ai/ai-chatbot-asistan' },
    content: [
      { type: 'p', text: 'Müşterileriniz artık yanıt için saatlerce beklemek istemiyor. AI chatbot, işletmenizin bu beklentiyi 7/24 karşılamasını sağlayan yapay zeka teknolojisidir. Bu yazıda AI chatbotun ne olduğunu, nasıl çalıştığını ve işletmenize somut olarak ne kazandırdığını açıklıyoruz.' },
      { type: 'h2', text: 'AI Chatbot Nedir?' },
      { type: 'p', text: 'AI chatbot; doğal dil işleme (NLP) teknolojisi kullanarak müşterilerinizle metin veya ses aracılığıyla insan benzeri iletişim kuran yapay zeka yazılımıdır. Klasik, kural tabanlı botların aksine, AI chatbot soruların bağlamını anlar, önceki mesajları hatırlar ve her etkileşimde öğrenerek yanıt kalitesini artırır.' },
      { type: 'h2', text: 'AI Chatbot Nasıl Çalışır?' },
      { type: 'p', text: 'Süreç dört temel adımdan oluşur: kullanıcının mesajı alınır, NLP ile niyet (intent) ve bağlam çözümlenir, uygun yanıt üretilir ve gerekiyorsa CRM/ERP gibi sistemlerden veri çekilerek kişiselleştirilir. Modern chatbotlar büyük dil modelleri sayesinde önceden tanımlanmamış soruları bile yanıtlayabilir.' },
      { type: 'h2', text: 'İşletmenize Kazandırdıkları' },
      { type: 'ul', items: [
        'Müşteri hizmetleri maliyetlerinde %60’a varan tasarruf',
        '7/24 kesintisiz, anında yanıt ile artan müşteri memnuniyeti',
        'Aynı anda binlerce görüşmeyi yönetebilme kapasitesi',
        'Çok dilli destek ile küresel erişim',
        'Toplanan verilerle müşteri içgörüsü ve satış fırsatı tespiti',
      ] },
      { type: 'h2', text: 'Hangi İşletmeler İçin Uygundur?' },
      { type: 'p', text: 'E-ticaret, finans, sağlık, eğitim, lojistik ve hizmet sektörleri başta olmak üzere, tekrarlayan müşteri sorularıyla uğraşan her işletme AI chatbottan fayda sağlar. Özellikle sipariş takibi, randevu yönetimi ve ilk kademe destek gibi süreçlerde geri dönüş çok hızlıdır.' },
      { type: 'h2', text: 'Maliyet ve Geri Dönüş' },
      { type: 'p', text: 'Chatbot geliştirme maliyeti; senaryo karmaşıklığı, entegrasyon sayısı ve dil desteğine göre değişir. Basit senaryolar 4 haftada devreye alınırken, CRM entegrasyonlu kapsamlı projeler 8-12 hafta sürebilir. Müşterilerimiz genellikle ilk 3 ay içinde yatırımın geri dönüşünü elde eder.' },
      { type: 'quote', text: 'Doğru kurgulanmış bir AI chatbot, maliyeti düşürmenin ötesinde, müşteri deneyimini rakiplerinizden ayrıştıran bir stratejik varlıktır.' },
      { type: 'h2', text: 'Sonuç' },
      { type: 'p', text: 'AI chatbot, müşteri hizmetlerini otomatikleştirmenin ötesinde işletmenize ölçeklenebilir bir rekabet avantajı sağlar. İşletmenize özel bir chatbot çözümünün nasıl kurgulanacağını konuşmak isterseniz, ekibimizle iletişime geçebilirsiniz.' },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

// En yeni yazı üstte
export function getSortedPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}
