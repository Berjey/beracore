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
      { type: 'p', text: 'AI chatbot, müşteri hizmetlerini otomatikleştirmenin ötesinde işletmenize ölçeklenebilir bir rekabet avantajı sağlar. İşletmenize özel bir chatbot çözümünün nasıl kurgulanacağını konuşmak isterseniz ekibimizle iletişime geçebilirsiniz.' },
    ],
  },

  {
    slug: 'rpa-surec-otomasyonu-nedir',
    title: 'RPA ile Süreç Otomasyonu: Hangi İşler Otomatikleştirilebilir?',
    metaTitle: 'RPA Süreç Otomasyonu Nedir? Hangi İşler Otomatikleşir | BERACORE',
    metaDescription:
      'RPA (robotik süreç otomasyonu) nedir, hangi iş süreçleri otomatikleştirilebilir ve ne kadar tasarruf sağlar? Uygulanabilir örnekler ve devreye alma süreci BERACORE blogunda.',
    excerpt:
      'Fatura işleme, veri girişi, raporlama… Çalışanlarınızın saatlerini yiyen tekrarlayan işler RPA ile dakikalara iniyor. Hangi süreçlerin otomatikleştirilebileceğini ve nereden başlanacağını anlatıyoruz.',
    publishedAt: '2026-07-21',
    author: 'BERACORE',
    category: 'Yapay Zeka',
    readingMinutes: 7,
    relatedService: { label: 'Süreç Otomasyonu hizmetimiz', href: '/hizmetler/ai/surec-otomasyonu' },
    content: [
      { type: 'p', text: 'Ekibiniz zamanının ne kadarını kopyala-yapıştır, form doldurma ve rapor hazırlama gibi tekrarlayan işlere harcıyor? RPA (Robotik Süreç Otomasyonu), bu görevleri yazılım robotlarına devrederek çalışanlarınızı katma değerli işlere yönlendirir. Bu yazıda RPA’nın ne olduğunu ve işletmenizde hangi süreçlerin otomatikleştirilebileceğini açıklıyoruz.' },
      { type: 'h2', text: 'RPA (Robotik Süreç Otomasyonu) Nedir?' },
      { type: 'p', text: 'RPA, kural tabanlı ve tekrarlayan dijital görevleri, tıpkı bir insanın yaptığı gibi ekran üzerinde gerçekleştiren yazılım robotlarıdır. Bu botlar veri girer, sistemler arası veri taşır, e-posta gönderir ve raporlar oluşturur — üstelik hata yapmadan ve yorulmadan. Yapay zeka ile birleştiğinde (IPA), belge okuma ve karar verme gibi daha karmaşık görevleri de üstlenebilir.' },
      { type: 'h2', text: 'Hangi İş Süreçleri Otomatikleştirilebilir?' },
      { type: 'p', text: 'Genel kural şudur: yüksek hacimli, kurallı ve tekrarlayan her süreç otomasyona adaydır. En yaygın örnekler:' },
      { type: 'ul', items: [
        'Fatura işleme ve muhasebe kayıtları',
        'Sipariş yönetimi ve stok güncelleme',
        'Sistemler arası veri aktarımı (ERP ↔ CRM)',
        'Periyodik raporlama ve dashboard güncelleme',
        'Yeni çalışan/müşteri onboarding işlemleri',
        'E-posta yanıtlama ve form doldurma',
      ] },
      { type: 'h2', text: 'RPA İşletmeye Ne Kazandırır?' },
      { type: 'p', text: 'Doğru uygulanan bir RPA projesi operasyonel maliyetlerde %40-70 düşüş sağlar, insan hatasını neredeyse sıfıra indirir ve süreçleri günlerden dakikalara çeker. Belki de en önemlisi: çalışanlarınız monoton işlerden kurtulup analiz, strateji ve müşteri ilişkileri gibi yaratıcı alanlara odaklanır.' },
      { type: 'h2', text: 'Nereden Başlamalı?' },
      { type: 'p', text: 'En doğru başlangıç, tek bir yüksek hacimli süreci pilot olarak seçmektir. Süreç haritalanır, otomasyon potansiyeli ölçülür, bot geliştirilir ve küçük ölçekte test edilir. Başarı kanıtlandıktan sonra otomasyon kademeli olarak diğer süreçlere yayılır. Bu yaklaşım hem riski düşürür hem de hızlı bir kazanım (quick win) ile ekibin güvenini kazanır.' },
      { type: 'quote', text: 'Otomasyonun amacı insanların yerini almak değil; onları makinelerin daha iyi yaptığı işlerden kurtarıp gerçekten değer kattıkları yere taşımaktır.' },
      { type: 'h2', text: 'Sonuç' },
      { type: 'p', text: 'RPA, dijital dönüşümün en hızlı geri dönüş sağlayan adımlarından biridir. Hangi süreçlerinizin otomatikleştirilebileceğini birlikte değerlendirmek için ücretsiz keşif görüşmesi talep edebilirsiniz.' },
    ],
  },

  {
    slug: 'e-ticaret-sitesi-kurma-maliyeti',
    title: 'E-Ticaret Sitesi Kurma Maliyeti 2026: Neye Ne Kadar Bütçe Ayırmalı?',
    metaTitle: 'E-Ticaret Sitesi Kurma Maliyeti 2026 — Fiyat Rehberi | BERACORE',
    metaDescription:
      'E-ticaret sitesi kurma maliyeti 2026’da neye göre değişir? Hazır platform mu özel yazılım mı, hangi kalemlere bütçe ayrılır? Şeffaf fiyat rehberi BERACORE blogunda.',
    excerpt:
      '“E-ticaret sitesi ne kadara mal olur?” sorusunun tek bir yanıtı yok. Maliyeti belirleyen kalemleri, hazır platform ile özel yazılım farkını ve gizli masrafları şeffafça anlatıyoruz.',
    publishedAt: '2026-07-17',
    author: 'BERACORE',
    category: 'E-Ticaret',
    readingMinutes: 8,
    relatedService: { label: 'E-Ticaret Yazılım hizmetimiz', href: '/hizmetler/ecommerce/e-ticaret-yazilim' },
    content: [
      { type: 'p', text: 'E-ticarete başlarken en çok sorulan soru şudur: “Bir e-ticaret sitesi kurmak ne kadara mal olur?” Gerçek şu ki maliyet, kitaptaki bir fiyattan çok bir yapılandırmaya benzer — neye ihtiyacınız olduğuna göre şekillenir. Bu yazıda 2026 itibarıyla e-ticaret maliyetini belirleyen kalemleri şeffafça açıklıyoruz.' },
      { type: 'h2', text: 'Maliyeti Belirleyen Ana Kalemler' },
      { type: 'ul', items: [
        'Yazılım/platform: hazır abonelik mi, özel geliştirme mi',
        'Tasarım: hazır tema mı, markaya özel UI/UX mü',
        'Entegrasyonlar: ödeme, kargo, muhasebe, pazaryeri',
        'Alan adı ve hosting/sunucu altyapısı',
        'Bakım, güvenlik ve sürekli geliştirme',
        'Dijital pazarlama ve SEO (sürekli gider)',
      ] },
      { type: 'h2', text: 'Hazır Platform mu, Özel Yazılım mı?' },
      { type: 'p', text: 'Hazır platformlar (kiralık e-ticaret çözümleri) düşük başlangıç maliyeti ve hızlı kurulum sunar; küçük ölçekli ve standart iş modelleri için idealdir. Ancak büyüdükçe komisyonlar, kısıtlı özelleştirme ve “platforma kilitlenme” gibi sınırlar ortaya çıkar. Özel yazılım ise başlangıçta daha yüksek yatırım gerektirir; buna karşılık tam kontrol, sınırsız özelleştirme ve uzun vadede daha düşük işletme maliyeti sağlar.' },
      { type: 'h2', text: 'Gözden Kaçan Gizli Maliyetler' },
      { type: 'p', text: 'Birçok işletme yalnızca kurulum maliyetine odaklanır ama asıl bütçe zamanla ortaya çıkar: ödeme geçidi komisyonları, kargo entegrasyonu, SSL ve güvenlik, performans için CDN, ve en önemlisi trafik getirmek için SEO ve reklam bütçesi. En güzel site bile ziyaretçi gelmezse satış yapmaz.' },
      { type: 'h2', text: 'Doğru Bütçelemenin Yolu' },
      { type: 'p', text: 'Maliyeti minimize etmenin yolu ucuza kaçmak değil, önceliklendirmektir. İlk aşamada satışa doğrudan etki eden kalemlere (hızlı ve güvenli altyapı, sorunsuz ödeme, mobil uyumlu tasarım) yatırım yapın; “nice-to-have” özellikleri gelir geldikçe ekleyin. Ölçeklenebilir bir mimari, ileride sıfırdan başlamanızı önler.' },
      { type: 'quote', text: 'E-ticarette en pahalı seçenek, birkaç yıl sonra baştan yazmak zorunda kaldığınız ucuz siteler olur.' },
      { type: 'h2', text: 'Sonuç' },
      { type: 'p', text: 'E-ticaret maliyeti, iş modelinize ve büyüme hedeflerinize göre net bir kapsamla belirlenmelidir. Projenize özel şeffaf bir maliyet analizi için bizimle iletişime geçin; ücretsiz keşif görüşmesinde ihtiyaçlarınızı birlikte önceliklendirelim.' },
    ],
  },

  {
    slug: 'kurumsal-web-sitesi-yaptirma-rehberi',
    title: 'Kurumsal Web Sitesi Yaptırırken Dikkat Edilmesi Gereken 10 Nokta',
    metaTitle: 'Kurumsal Web Sitesi Yaptırma Rehberi — 10 Kritik Nokta | BERACORE',
    metaDescription:
      'Kurumsal web sitesi yaptırırken nelere dikkat etmeli? Hız, SEO, mobil uyum, güvenlik ve dönüşüm odaklı 10 kritik noktayı içeren pratik rehber BERACORE blogunda.',
    excerpt:
      'Kurumsal web sitesi yalnızca bir “dijital kartvizit” değil, en çalışkan satış temsilcinizdir. Doğru yaptırmak için hız, SEO, mobil uyum ve dönüşüm dâhil 10 kritik noktayı sıraladık.',
    publishedAt: '2026-07-13',
    author: 'BERACORE',
    category: 'Web Tasarım',
    readingMinutes: 7,
    relatedService: { label: 'Web Tasarım hizmetimiz', href: '/hizmetler/design/web-tasarim' },
    content: [
      { type: 'p', text: 'Kurumsal web siteniz, çoğu zaman potansiyel müşterinizin markanızla ilk teması olur. İyi tasarlanmış bir site güven verir ve satışa dönüşür; kötü bir site ise ziyaretçiyi saniyeler içinde rakibinize gönderir. İşte kurumsal web sitesi yaptırırken göz ardı edilmemesi gereken 10 kritik nokta.' },
      { type: 'h2', text: '1. Hız ve Performans' },
      { type: 'p', text: 'Sayfa 3 saniyede açılmıyorsa ziyaretçinin büyük kısmını kaybedersiniz. Hız aynı zamanda Google sıralamasında doğrudan bir sıralama faktörüdür. Core Web Vitals metriklerini karşılayan bir altyapı şarttır.' },
      { type: 'h2', text: '2. Mobil Uyumluluk' },
      { type: 'p', text: 'Trafiğin çoğunluğu mobilden geliyor ve Google “mobile-first” indeksleme kullanıyor. Site her ekran boyutunda kusursuz çalışmalı.' },
      { type: 'h2', text: '3. SEO Altyapısı' },
      { type: 'p', text: 'Semantik HTML, doğru başlık hiyerarşisi, meta etiketleri, yapısal veri (schema) ve temiz URL yapısı en baştan kurulmalı. SEO sonradan “eklenen” değil, temele işlenen bir şeydir.' },
      { type: 'h2', text: '4. Dönüşüm Odaklı Tasarım' },
      { type: 'p', text: 'Her sayfanın net bir amacı ve belirgin bir eylem çağrısı (CTA) olmalı. Ziyaretçiyi teklif almaya, aramaya veya form doldurmaya yönlendirmeyen tasarım güzel ama işlevsizdir.' },
      { type: 'h2', text: '5–10. Diğer Kritik Noktalar' },
      { type: 'ul', items: [
        '5. Güvenlik: SSL, güncel altyapı ve düzenli yedekleme',
        '6. Erişilebilirlik (a11y): herkesin kullanabildiği bir site',
        '7. Marka tutarlılığı: renk, tipografi ve ton bütünlüğü',
        '8. Ölçeklenebilirlik: büyümeye hazır bir mimari',
        '9. İçerik yönetimi: kolay güncellenebilir yapı',
        '10. Analitik: Search Console ve ölçümleme entegrasyonu',
      ] },
      { type: 'quote', text: 'İyi bir kurumsal site pahalı görünmek için değil, güven vermek ve iş getirmek için tasarlanır.' },
      { type: 'h2', text: 'Sonuç' },
      { type: 'p', text: 'Kurumsal web sitesi, doğru yapıldığında yıllarca çalışan bir yatırımdır. Markanıza özel, hızlı, SEO uyumlu ve dönüşüm odaklı bir site için ekibimizle görüşebilirsiniz.' },
    ],
  },

  {
    slug: 'ui-ux-tasarim-neden-onemli',
    title: 'UI/UX Tasarımı Neden Önemli? Dönüşüm ve Kullanıcı Deneyimi İlişkisi',
    metaTitle: 'UI/UX Tasarımı Neden Önemli? Dönüşüme Etkisi | BERACORE',
    metaDescription:
      'UI/UX tasarımı nedir, aralarındaki fark nedir ve dönüşüm oranını nasıl artırır? İyi kullanıcı deneyiminin satışa etkisini örneklerle anlatan rehber BERACORE blogunda.',
    excerpt:
      'Kullanıcılar güzel arayüzleri sever ama iyi deneyimlere para öder. UI ile UX arasındaki farkı ve iyi tasarımın dönüşüm oranınıza doğrudan etkisini bu yazıda ele alıyoruz.',
    publishedAt: '2026-07-09',
    author: 'BERACORE',
    category: 'Tasarım',
    readingMinutes: 6,
    relatedService: { label: 'UI/UX Tasarım hizmetimiz', href: '/hizmetler/design/ui-ux-tasarim' },
    content: [
      { type: 'p', text: 'Bir ürün ne kadar güçlü olursa olsun, kullanıcı onu kolayca kullanamıyorsa değeri görünmez kalır. UI/UX tasarımı, tam olarak bu görünmezliği ortadan kaldırır: kullanıcının aradığını zahmetsizce bulmasını ve keyifle geri gelmesini sağlar. Peki UI ile UX arasındaki fark nedir ve neden dönüşüm için bu kadar kritik?' },
      { type: 'h2', text: 'UI ve UX Arasındaki Fark' },
      { type: 'p', text: 'UI (User Interface / Kullanıcı Arayüzü), ürünün görsel katmanıdır: renkler, tipografi, butonlar, düzen. UX (User Experience / Kullanıcı Deneyimi) ise kullanıcının ürünle etkileşiminin bütünüdür: ne kadar hızlı hedefe ulaştığı, ne kadar az düşündüğü, ne hissettiği. Kısaca UI ürünün nasıl göründüğü, UX ise nasıl çalıştığıdır.' },
      { type: 'h2', text: 'İyi UX Dönüşümü Nasıl Artırır?' },
      { type: 'p', text: 'Kullanıcı bir formda kayboluyorsa, ödeme adımı karmaşıksa ya da aradığı bilgiye üç tıkla ulaşamıyorsa, siteyi terk eder. İyi tasarlanmış bir deneyim sürtünmeyi (friction) azaltır; bu da doğrudan daha fazla tamamlanan işlem, daha fazla form ve daha fazla satış demektir. Küçük bir akış iyileştirmesi bile dönüşüm oranını gözle görülür biçimde yükseltebilir.' },
      { type: 'h2', text: 'İyi Tasarımın Ölçülebilir Getirileri' },
      { type: 'ul', items: [
        'Daha yüksek dönüşüm oranı ve daha düşük sepet terk oranı',
        'Azalan destek talepleri (kullanıcı kendi başına yol alır)',
        'Artan müşteri memnuniyeti ve marka sadakati',
        'Daha uzun sitede kalma süresi ve daha iyi SEO sinyalleri',
      ] },
      { type: 'quote', text: 'Kullanıcı arayüzü ilk izlenimi kazandırır; kullanıcı deneyimi ise müşteriyi elde tutar.' },
      { type: 'h2', text: 'Sonuç' },
      { type: 'p', text: 'UI/UX tasarımı bir “estetik lüks” değil, doğrudan gelire etki eden bir yatırımdır. Ürününüzün ya da web sitenizin dönüşümünü artıracak bir deneyim tasarımı için ekibimizle tanışabilirsiniz.' },
    ],
  },

  {
    slug: 'seo-nedir-google-ilk-sayfaya-cikma',
    title: 'SEO Nedir ve Google’da İlk Sayfaya Nasıl Çıkılır?',
    metaTitle: 'SEO Nedir? Google’da İlk Sayfaya Çıkma Rehberi | BERACORE',
    metaDescription:
      'SEO nedir ve Google’da ilk sayfaya nasıl çıkılır? Teknik SEO, içerik, yerel SEO ve backlink stratejisini adım adım anlatan uygulanabilir rehber BERACORE blogunda.',
    excerpt:
      'Google’ın ilk sayfası dijital dünyanın en değerli gayrimenkulüdür. SEO’nun ne olduğunu ve arama sonuçlarında üst sıralara çıkmak için hangi adımların atılması gerektiğini anlatıyoruz.',
    publishedAt: '2026-07-05',
    author: 'BERACORE',
    category: 'Dijital Pazarlama',
    readingMinutes: 9,
    relatedService: { label: 'SEO hizmetimiz', href: '/hizmetler/marketing/seo' },
    content: [
      { type: 'p', text: 'İnsanların %90’ından fazlası Google’ın ilk sayfasının ötesine geçmez. Yani ikinci sayfa, çoğu zaman görünmez olmakla eşdeğerdir. SEO (Arama Motoru Optimizasyonu), tam olarak bu ilk sayfaya çıkmanın ve orada kalmanın bilimidir. Bu rehberde SEO’nun ne olduğunu ve üst sıralara çıkmak için izlenmesi gereken yolu açıklıyoruz.' },
      { type: 'h2', text: 'SEO Nedir?' },
      { type: 'p', text: 'SEO; web sitenizi, kullanıcıların aradığı kelimelerde arama sonuçlarında daha üst sırada çıkacak şekilde optimize etme çalışmalarının bütünüdür. Reklamdan farkı, tıklama başına ödeme yapmamanız ve etkisinin uzun vadeli, kalıcı olmasıdır. İyi bir SEO çalışması size sürekli ve “ücretsiz” organik trafik kazandırır.' },
      { type: 'h2', text: 'SEO’nun Üç Temel Ayağı' },
      { type: 'ul', items: [
        'Teknik SEO: hız, mobil uyum, indekslenebilirlik, yapısal veri',
        'İçerik / On-Page SEO: doğru anahtar kelime ve kullanıcı niyetine uygun içerik',
        'Off-Page SEO: backlink, marka otoritesi ve güven sinyalleri',
      ] },
      { type: 'h2', text: 'İlk Sayfaya Çıkmak İçin Adım Adım' },
      { type: 'h3', text: '1. Anahtar Kelime ve Niyet Analizi' },
      { type: 'p', text: 'Hedef kitlenizin gerçekte hangi kelimelerle arama yaptığını belirleyin. Yeni siteler için rekabeti düşük, niyeti yüksek uzun kuyruk (long-tail) kelimeler en hızlı kazanımı sağlar.' },
      { type: 'h3', text: '2. Teknik Temeli Sağlamlaştırın' },
      { type: 'p', text: 'Site hızlı, mobil uyumlu ve taranabilir olmalı; sitemap ve robots.txt doğru yapılandırılmalı; her sayfada tekil ve açıklayıcı meta etiketleri bulunmalı.' },
      { type: 'h3', text: '3. Kaliteli, Niyet Odaklı İçerik Üretin' },
      { type: 'p', text: 'Google, kullanıcının sorusunu en iyi yanıtlayan içeriği ödüllendirir. İçeriğiniz özgün, derinlikli ve gerçekten yardımcı olmalı. Düzenli blog yazıları topikal otorite kazandırır.' },
      { type: 'h3', text: '4. Yerel SEO ve Google Business Profile' },
      { type: 'p', text: 'Belirli bir bölgeye hizmet veriyorsanız, Google Business Profile oluşturmak ve NAP (isim-adres-telefon) tutarlılığını sağlamak yerel aramalarda öne çıkmanın en güçlü yoludur.' },
      { type: 'h3', text: '5. Otorite ve Backlink İnşa Edin' },
      { type: 'p', text: 'Diğer güvenilir sitelerden alınan bağlantılar, Google’a sitenizin güvenilir olduğunu söyler. Kaliteli içerik, sektör dizinleri ve iş birlikleri doğal backlink kazandırır.' },
      { type: 'quote', text: 'SEO bir sprint değil, bileşik faiz gibi çalışan bir maratondur; erken başlayan ve tutarlı olan kazanır.' },
      { type: 'h2', text: 'Ne Kadar Sürede Sonuç Alınır?' },
      { type: 'p', text: 'Uzun kuyruk ve yerel kelimelerde ilk sonuçlar genellikle 1-3 ayda görülür. Rekabetçi ana kelimelerde ilk sayfa ise içerik ve backlink birikimiyle 6-12 ayı bulabilir. Sabır ve süreklilik, SEO’nun en belirleyici iki faktörüdür.' },
      { type: 'h2', text: 'Sonuç' },
      { type: 'p', text: 'İlk sayfaya çıkmak tek seferlik bir iş değil, sürekli bir strateji gerektirir. Siteniz için uçtan uca bir SEO yol haritası ve uygulaması istiyorsanız, ekibimizle iletişime geçebilirsiniz.' },
    ],
  },

  {
    slug: 'mobil-uygulama-gelistirme-maliyeti',
    title: 'Mobil Uygulama Geliştirme Maliyeti ve Süreci: Bilmeniz Gerekenler',
    metaTitle: 'Mobil Uygulama Geliştirme Maliyeti 2026 — Süreç Rehberi | BERACORE',
    metaDescription:
      'Mobil uygulama geliştirme maliyeti neye göre değişir, native mi cross-platform mu, süreç nasıl işler? Bütçenizi doğru planlamanız için pratik rehber BERACORE blogunda.',
    excerpt:
      'Mobil uygulama fikriniz var ama maliyeti ve süreci kafanızı mı karıştırıyor? Native ile cross-platform farkını, maliyeti belirleyen kalemleri ve geliştirme sürecini netleştiriyoruz.',
    publishedAt: '2026-07-01',
    author: 'BERACORE',
    category: 'Yazılım Geliştirme',
    readingMinutes: 7,
    relatedService: { label: 'Mobil Uygulama Geliştirme hizmetimiz', href: '/hizmetler/software/mobil-uygulama' },
    content: [
      { type: 'p', text: 'Mobil uygulama geliştirmenin maliyeti, tıpkı bir ev inşa etmek gibi, büyüklüğüne ve özelliklerine göre değişir. “Ne kadar tutar?” sorusuna dürüst yanıt vermek için önce hangi kalemlerin bütçeyi belirlediğini anlamak gerekir. Bu yazıda mobil uygulama maliyetini ve sürecini şeffafça ele alıyoruz.' },
      { type: 'h2', text: 'Maliyeti Belirleyen Faktörler' },
      { type: 'ul', items: [
        'Platform: yalnızca iOS, yalnızca Android ya da her ikisi',
        'Native mi cross-platform mu geliştirme yaklaşımı',
        'Özellik sayısı ve karmaşıklığı (giriş, ödeme, harita, bildirim…)',
        'Backend ve API altyapısı',
        'Tasarım (UI/UX) derinliği',
        'Yayın sonrası bakım, güncelleme ve destek',
      ] },
      { type: 'h2', text: 'Native mi, Cross-Platform mı?' },
      { type: 'p', text: 'Native geliştirme (Swift/Kotlin) her platform için ayrı kod yazar; en yüksek performansı ve platforma özel deneyimi sunar ama maliyeti artırır. Cross-platform (React Native, Flutter) ise tek kod tabanıyla iki platforma birden çıkar; bu da geliştirme süresini ve maliyetini önemli ölçüde düşürür. Çoğu iş uygulaması için cross-platform mükemmel bir denge sunar.' },
      { type: 'h2', text: 'Geliştirme Süreci Nasıl İşler?' },
      { type: 'p', text: 'Sağlıklı bir mobil proje şu aşamalardan geçer: keşif ve gereksinim analizi, UI/UX tasarımı, geliştirme (sprint’ler halinde), test ve kalite kontrol, mağaza yayını (App Store / Google Play) ve yayın sonrası bakım. MVP (minimum uygulanabilir ürün) yaklaşımıyla önce çekirdek özelliklerle çıkmak, hem riski hem maliyeti azaltır.' },
      { type: 'quote', text: 'En başarılı uygulamalar her özelliği ilk günden içeren değil, doğru çekirdekle çıkıp kullanıcı geri bildirimiyle büyüyenlerdir.' },
      { type: 'h2', text: 'Bütçeyi Doğru Planlamak' },
      { type: 'p', text: 'Maliyeti kontrol etmenin en iyi yolu kapsamı net tanımlamak ve önceliklendirmektir. “Olmazsa olmaz” özelliklerle başlayın, kullanıcıdan gelen gerçek talebe göre geliştirin. Ayrıca yayın maliyetinin yanında sürekli bakım ve güncelleme bütçesini de baştan hesaba katın.' },
      { type: 'h2', text: 'Sonuç' },
      { type: 'p', text: 'Mobil uygulama, doğru planlandığında güçlü bir büyüme kanalıdır. Fikrinize özel bir maliyet ve yol haritası çıkarmak için ekibimizle ücretsiz keşif görüşmesi yapabilirsiniz.' },
    ],
  },

  {
    slug: 'akilli-kontrat-nedir',
    title: 'Akıllı Kontrat (Smart Contract) Nedir ve Nasıl Çalışır?',
    metaTitle: 'Akıllı Kontrat (Smart Contract) Nedir, Nasıl Çalışır? | BERACORE',
    metaDescription:
      'Akıllı kontrat (smart contract) nedir, nasıl çalışır ve hangi alanlarda kullanılır? Blockchain tabanlı sözleşmelerin avantajları ve iş dünyasındaki uygulamaları BERACORE blogunda.',
    excerpt:
      'Aracıya gerek kalmadan, koşullar sağlandığında kendi kendine çalışan sözleşmeler artık gerçek. Akıllı kontratların ne olduğunu, nasıl işlediğini ve nerelerde kullanıldığını anlatıyoruz.',
    publishedAt: '2026-06-27',
    author: 'BERACORE',
    category: 'Blockchain',
    readingMinutes: 6,
    relatedService: { label: 'Akıllı Kontrat Geliştirme hizmetimiz', href: '/hizmetler/blockchain/akilli-kontrat-gelistirme' },
    content: [
      { type: 'p', text: 'Bir sözleşmenin koşulları yerine geldiğinde ödemenin otomatik yapıldığını, üstelik hiçbir aracıya güvenmeniz gerekmediğini düşünün. Akıllı kontratlar (smart contracts) tam olarak bunu mümkün kılıyor. Bu yazıda akıllı kontratın ne olduğunu, nasıl çalıştığını ve iş dünyasında nerelerde kullanıldığını açıklıyoruz.' },
      { type: 'h2', text: 'Akıllı Kontrat Nedir?' },
      { type: 'p', text: 'Akıllı kontrat, blockchain üzerinde çalışan ve önceden tanımlanmış kurallar sağlandığında otomatik olarak yürütülen bir yazılım kodudur. “Eğer X olursa, Y’yi yap” mantığıyla işler ve bir kez blockchain’e yazıldığında değiştirilemez. Bu da onu şeffaf, güvenilir ve manipülasyona kapalı hale getirir.' },
      { type: 'h2', text: 'Nasıl Çalışır?' },
      { type: 'p', text: 'Kontratın koşulları kodla tanımlanır ve blockchain ağına yüklenir. Belirlenen koşul gerçekleştiğinde (örneğin bir ödeme yapıldığında), kontrat kendi kendine tetiklenir ve sonucu uygular — fon transferi, kayıt güncelleme veya bir hakkın devri gibi. Tüm süreç ağdaki düğümler tarafından doğrulandığı için üçüncü bir tarafa ihtiyaç kalmaz.' },
      { type: 'h2', text: 'Avantajları' },
      { type: 'ul', items: [
        'Aracı maliyetlerinin ortadan kalkması',
        'Şeffaflık ve değiştirilemezlik (immutability)',
        'Otomatik ve anlık yürütme',
        'İnsan hatası ve güven sorununun azalması',
      ] },
      { type: 'h2', text: 'Kullanım Alanları' },
      { type: 'p', text: 'Akıllı kontratlar; DeFi (merkeziyetsiz finans), tedarik zinciri takibi, dijital kimlik, sigorta tazminat süreçleri, gayrimenkul devri ve token/NFT çözümleri gibi geniş bir yelpazede kullanılır. Aracıların ve manuel onay süreçlerinin bulunduğu her alan, akıllı kontratlarla verimli hale getirilebilir.' },
      { type: 'quote', text: 'Akıllı kontratlar, “güven” kelimesini bir kişiye değil, herkesin doğrulayabildiği bir koda taşır.' },
      { type: 'h2', text: 'Sonuç' },
      { type: 'p', text: 'Doğru tasarlanmış bir akıllı kontrat, süreçlerinizi hem güvenli hem de otomatik hale getirir. Ancak güvenlik açıklarına karşı titiz bir geliştirme ve denetim şarttır. Projeniz için akıllı kontrat çözümlerini konuşmak isterseniz ekibimizle iletişime geçebilirsiniz.' },
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
