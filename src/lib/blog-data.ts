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
    category: 'Tasarım',
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

  {
    slug: 'veri-analizi-nedir-isletmeye-faydasi',
    title: 'Veri Analizi Nedir ve İşletmenize Nasıl Rekabet Avantajı Sağlar?',
    metaTitle: 'Veri Analizi Nedir? İşletmeye Faydaları ve Kullanımı | BERACORE',
    metaDescription:
      'Veri analizi nedir, hangi verilerden içgörü çıkarılır ve tahmine dayalı analitik işletmenize ne kazandırır? Veriye dayalı karar almanın yolları BERACORE blogunda.',
    excerpt:
      'İşletmeler her gün devasa veri üretiyor ama çoğu bu veriyi kullanmadan çöpe atıyor. Veri analizinin ne olduğunu ve doğru okunan verinin nasıl rekabet avantajına dönüştüğünü anlatıyoruz.',
    publishedAt: '2026-06-23',
    author: 'BERACORE',
    category: 'Yapay Zeka',
    readingMinutes: 7,
    relatedService: { label: 'AI Veri Analizi hizmetimiz', href: '/hizmetler/ai/ai-veri-analizi' },
    content: [
      { type: 'p', text: 'Her işletme veri üretir: satışlar, ziyaretçiler, siparişler, müşteri davranışları. Ama fark, bu veriyi anlamlı kararlara çevirebilenlerle çeviremeyenler arasında oluşuyor. Veri analizi, tam olarak bu dönüşümü sağlar. Bu yazıda veri analizinin ne olduğunu ve işletmenize nasıl somut avantaj kattığını açıklıyoruz.' },
      { type: 'h2', text: 'Veri Analizi Nedir?' },
      { type: 'p', text: 'Veri analizi; ham verinin toplanması, temizlenmesi, işlenmesi ve içinden anlamlı örüntülerin çıkarılması sürecidir. Amaç, geçmişte ne olduğunu anlamak (betimsel analiz), neden olduğunu çözmek (teşhis) ve gelecekte ne olacağını tahmin etmektir (tahmine dayalı analiz).' },
      { type: 'h2', text: 'Hangi Veriler Analiz Edilir?' },
      { type: 'ul', items: [
        'Satış ve gelir verileri',
        'Web sitesi ve uygulama analitiği (ziyaretçi davranışı)',
        'Müşteri (CRM) ve sipariş verileri',
        'Sosyal medya ve pazarlama performansı',
        'Stok, tedarik ve operasyon verileri',
      ] },
      { type: 'h2', text: 'Tahmine Dayalı Analitik: Geleceği Görmek' },
      { type: 'p', text: 'Modern veri analizinin en güçlü yanı, makine öğrenmesiyle geleceği tahmin edebilmesidir. Hangi müşterinin ayrılma riski taşıdığını, hangi ürünün ne zaman tükeneceğini veya satışların gelecek çeyrekte nasıl seyredeceğini önceden görmek, işletmeye proaktif hareket etme gücü verir.' },
      { type: 'h2', text: 'İşletmeye Sağladığı Avantajlar' },
      { type: 'p', text: 'Veriye dayalı karar alan işletmeler, sezgiyle hareket edenlere göre daha az risk alır ve fırsatları daha erken yakalar. Gerçek zamanlı dashboard’lar sayesinde yöneticiler işin nabzını anlık tutar; maliyetler optimize edilir, pazarlama bütçesi doğru kanala yönlendirilir ve müşteri memnuniyeti artar.' },
      { type: 'quote', text: 'Veri, doğru sorularla buluştuğunda bir maliyet kalemi olmaktan çıkıp işletmenin en değerli varlığına dönüşür.' },
      { type: 'h2', text: 'Sonuç' },
      { type: 'p', text: 'Verilerinizin içinde keşfedilmeyi bekleyen fırsatlar var. İşletmenize özel bir veri analizi ve dashboard çözümü için ekibimizle iletişime geçebilirsiniz.' },
    ],
  },

  {
    slug: 'ozel-yazilim-mi-hazir-cozum-mu',
    title: 'Özel Yazılım mı, Hazır Çözüm mü? İşletmeniz İçin Doğru Seçim',
    metaTitle: 'Özel Yazılım mı Hazır Yazılım mı? Karşılaştırma | BERACORE',
    metaDescription:
      'Özel yazılım mı hazır çözüm mü daha mantıklı? Maliyet, esneklik, ölçeklenebilirlik ve uzun vadeli sahip olma maliyeti açısından karşılaştırma BERACORE blogunda.',
    excerpt:
      'Hazır bir paket mi almalı, yoksa işletmenize özel yazılım mı geliştirtmeli? İki yaklaşımı maliyet, esneklik ve uzun vadeli getiri açısından karşılaştırıp doğru kararı vermenize yardımcı oluyoruz.',
    publishedAt: '2026-06-19',
    author: 'BERACORE',
    category: 'Yazılım Geliştirme',
    readingMinutes: 7,
    relatedService: { label: 'Özel Yazılım Geliştirme hizmetimiz', href: '/hizmetler/software/ozel-yazilim' },
    content: [
      { type: 'p', text: 'Büyüyen her işletme bir noktada bu kararla karşılaşır: hazır bir yazılım paketi mi almalı, yoksa ihtiyaca özel bir yazılım mı geliştirtmeli? İkisinin de yeri var ama yanlış seçim, hem para hem zaman kaybettirir. Bu yazıda iki yaklaşımı objektif biçimde karşılaştırıyoruz.' },
      { type: 'h2', text: 'Hazır Çözümün Artıları ve Eksileri' },
      { type: 'p', text: 'Hazır (paket) yazılımlar düşük başlangıç maliyeti ve hızlı kuruluma sahiptir; standart ihtiyaçlar için idealdir. Ancak iş süreçlerinizi yazılıma uydurmak zorunda kalırsınız, özelleştirme sınırlıdır, aylık abonelikler zamanla birikir ve “sağlayıcıya bağımlılık” riski taşırsınız.' },
      { type: 'h2', text: 'Özel Yazılımın Artıları ve Eksileri' },
      { type: 'p', text: 'Özel yazılım tam olarak sizin süreçlerinize göre tasarlanır; sınırsız özelleştirilebilir, rakiplerinizde olmayan özellikler sunar ve işletmeyle birlikte ölçeklenir. Başlangıç maliyeti ve geliştirme süresi daha yüksektir; buna karşılık uzun vadede abonelik maliyeti olmaz ve yazılım tamamen size ait olur.' },
      { type: 'h2', text: 'Hangisi Sizin İçin Doğru?' },
      { type: 'ul', items: [
        'Standart, yaygın bir ihtiyacınız varsa ve hızlı başlamak istiyorsanız → hazır çözüm',
        'Kendine özgü, rekabet avantajı yaratan süreçleriniz varsa → özel yazılım',
        'Hızla büyüyorsanız ve ileride kilitlenmek istemiyorsanız → özel yazılım',
        'Bütçeniz kısıtlı ve ihtiyaç geçiciyse → hazır çözümle başlayıp sonra geçiş',
      ] },
      { type: 'quote', text: 'Hazır çözüm sizi yazılıma uydurur; özel yazılım ise yazılımı işinize uydurur. Doğru soru “hangisi ucuz?” değil, “hangisi işimi büyütür?” olmalıdır.' },
      { type: 'h2', text: 'Sonuç' },
      { type: 'p', text: 'Doğru karar, işletmenizin bugünkü ihtiyacına değil, 3-5 yıl sonraki hedefine bakarak verilir. Süreçlerinizi birlikte değerlendirip hangi yaklaşımın size uygun olduğunu netleştirmek için bizimle iletişime geçebilirsiniz.' },
    ],
  },

  {
    slug: 'pazaryeri-entegrasyonu-nedir',
    title: 'Pazaryeri Entegrasyonu Nedir? Trendyol, Hepsiburada ve Amazon Yönetimi',
    metaTitle: 'Pazaryeri Entegrasyonu Nedir? Nasıl Yapılır | BERACORE',
    metaDescription:
      'Pazaryeri entegrasyonu nedir, Trendyol/Hepsiburada/Amazon gibi platformları tek panelden nasıl yönetirsiniz? Stok ve sipariş senkronizasyonunun faydaları BERACORE blogunda.',
    excerpt:
      'Birden fazla pazaryerinde satış yapmak büyük fırsat ama stok ve siparişleri ayrı ayrı yönetmek kâbusa dönebilir. Pazaryeri entegrasyonunun bu karmaşayı nasıl çözdüğünü anlatıyoruz.',
    publishedAt: '2026-06-15',
    author: 'BERACORE',
    category: 'E-Ticaret',
    readingMinutes: 6,
    relatedService: { label: 'Pazaryeri Entegrasyonu hizmetimiz', href: '/hizmetler/ecommerce/pazaryeri-entegrasyonu' },
    content: [
      { type: 'p', text: 'Trendyol, Hepsiburada, Amazon, N11… Her yeni pazaryeri yeni bir satış kanalı demek. Ama aynı zamanda yeni bir panel, yeni bir stok listesi ve yeni bir sipariş kuyruğu demek. Pazaryeri entegrasyonu, tüm bu kanalları tek bir yerden yönetmenizi sağlayarak bu karmaşayı ortadan kaldırır.' },
      { type: 'h2', text: 'Pazaryeri Entegrasyonu Nedir?' },
      { type: 'p', text: 'Pazaryeri entegrasyonu; farklı e-ticaret platformlarındaki ürün, stok, fiyat ve siparişlerinizi tek bir merkezi sistemle senkronize eden yazılım çözümüdür. Bir kanalda satış olduğunda stok tüm kanallarda otomatik güncellenir; tüm siparişler tek panelde toplanır.' },
      { type: 'h2', text: 'Neden Gereklidir?' },
      { type: 'ul', items: [
        'Stok tutarsızlığı ve “satılan ürünü tekrar satma” hatasının önlenmesi',
        'Tüm siparişlerin tek panelden yönetimi (zaman tasarrufu)',
        'Fiyat ve ürün bilgisini tek yerden toplu güncelleme',
        'Yeni pazaryerlerine hızlı açılma imkânı',
        'İnsan hatasının azalması ve operasyonel verimlilik',
      ] },
      { type: 'h2', text: 'Nasıl Çalışır?' },
      { type: 'p', text: 'Entegrasyon, pazaryerlerinin API’leri üzerinden gerçek zamanlı çalışır. Ürünlerinizi merkezi sistemden pazaryerlerine gönderir, gelen siparişleri otomatik çeker ve kargo/fatura süreçlerini tetikler. Böylece kaç kanalda satarsanız satın, tek bir kontrol noktanız olur.' },
      { type: 'quote', text: 'Çok kanallı satışta başarının sırrı daha fazla panel açmak değil, hepsini tek bir beyinden yönetmektir.' },
      { type: 'h2', text: 'Sonuç' },
      { type: 'p', text: 'Doğru bir pazaryeri entegrasyonu, satışlarınızı katlanırken operasyon yükünüzü sabit tutar. İşletmenize uygun bir entegrasyon çözümü için ekibimizle iletişime geçebilirsiniz.' },
    ],
  },

  {
    slug: 'sosyal-medya-yonetimi-neden-onemli',
    title: 'Sosyal Medya Yönetimi Neden Önemli? İşletmeler İçin Rehber',
    metaTitle: 'Sosyal Medya Yönetimi Neden Önemli? Faydaları | BERACORE',
    metaDescription:
      'Sosyal medya yönetimi nedir, neden önemlidir ve işletmenize ne kazandırır? Marka bilinirliği, topluluk ve satışa etkisiyle profesyonel yönetimin farkı BERACORE blogunda.',
    excerpt:
      'Sosyal medyada var olmak yetmiyor; düzenli, stratejik ve markaya uygun bir yönetim gerekiyor. Profesyonel sosyal medya yönetiminin işletmenize neden değer kattığını anlatıyoruz.',
    publishedAt: '2026-06-11',
    author: 'BERACORE',
    category: 'Dijital Pazarlama',
    readingMinutes: 6,
    relatedService: { label: 'Sosyal Medya Yönetimi hizmetimiz', href: '/hizmetler/marketing/sosyal-medya-yonetimi' },
    content: [
      { type: 'p', text: 'Müşterileriniz günün önemli bir kısmını sosyal medyada geçiriyor. Markanız orada yoksa ya da düzensiz, plansız bir şekilde varsa, potansiyel müşterilerinizi rakiplerinize kaptırıyorsunuz demektir. Sosyal medya yönetimi, bu görünürlüğü stratejiye ve satışa çeviren disiplindir.' },
      { type: 'h2', text: 'Sosyal Medya Yönetimi Nedir?' },
      { type: 'p', text: 'Sosyal medya yönetimi; içerik planlama, tasarım, düzenli paylaşım, topluluk yönetimi (yorum/mesaj yanıtlama) ve performans ölçümünü kapsayan bütünsel bir süreçtir. Amaç yalnızca “paylaşım yapmak” değil, marka etrafında sadık bir kitle inşa etmektir.' },
      { type: 'h2', text: 'İşletmeye Faydaları' },
      { type: 'ul', items: [
        'Marka bilinirliği ve akılda kalıcılık',
        'Hedef kitleyle doğrudan ve güvene dayalı iletişim',
        'Web sitesine ve satışa nitelikli trafik',
        'Müşteri geri bildirimiyle ürün/hizmet geliştirme',
        'Rakiplerden farklılaşan güçlü bir marka sesi',
      ] },
      { type: 'h2', text: 'Profesyonel Yönetimin Farkı' },
      { type: 'p', text: 'Rastgele paylaşımlarla profesyonel yönetim arasındaki fark, tutarlılık ve stratejidir. Doğru platform seçimi, hedef kitleye uygun içerik takvimi, markaya özel görsel dil ve verilerle sürekli optimizasyon; “beğeni toplayan” bir hesabı “müşteri kazandıran” bir kanala dönüştürür.' },
      { type: 'quote', text: 'Sosyal medyada tutarlılık, tek bir viral içerikten çok daha değerlidir; markalar sprint’le değil, ritimle büyür.' },
      { type: 'h2', text: 'Sonuç' },
      { type: 'p', text: 'Sosyal medya, doğru yönetildiğinde markanızın en güçlü büyüme kanallarından biri olur. İşletmenize özel bir sosyal medya stratejisi için ekibimizle iletişime geçebilirsiniz.' },
    ],
  },

  {
    slug: 'google-ads-reklam-vermek',
    title: 'Google ve Meta Reklamları: Doğru Bütçeyle Nasıl Sonuç Alınır?',
    metaTitle: 'Google Reklam Vermek: Maliyet ve Getiri Rehberi | BERACORE',
    metaDescription:
      'Google Ads ve Meta reklamları nasıl çalışır, bütçe nasıl belirlenir ve reklamdan nasıl verim alınır? Reklam yatırımınızı doğru yönetmenin yolları BERACORE blogunda.',
    excerpt:
      'Reklam vermek kolay, verimli reklam vermek ise ustalık ister. Google ve Meta reklamlarının nasıl çalıştığını, bütçenizi nasıl planlamanız gerektiğini ve boşa para harcamamanın yollarını anlatıyoruz.',
    publishedAt: '2026-06-07',
    author: 'BERACORE',
    category: 'Dijital Pazarlama',
    readingMinutes: 7,
    relatedService: { label: 'Google & Meta Reklamları hizmetimiz', href: '/hizmetler/marketing/google-meta-reklamlari' },
    content: [
      { type: 'p', text: 'SEO uzun vadeli bir yatırımken, reklam anında sonuç getirir — ama yanlış kurulursa bütçenizi hızla eritir. Google ve Meta (Instagram/Facebook) reklamları doğru yönetildiğinde ölçülebilir ve ölçeklenebilir bir satış kanalıdır. İşte temel prensipler.' },
      { type: 'h2', text: 'Google Ads ve Meta Reklamları Arasındaki Fark' },
      { type: 'p', text: 'Google Ads, aktif olarak bir şey arayan kullanıcıyı yakalar — yani niyet yüksektir (“istanbul web tasarım” arayan biri gibi). Meta reklamları ise henüz aramayan ama ilgi alanına göre hedeflenebilen geniş bir kitleye ulaşır. En iyi sonuç, çoğu zaman ikisinin doğru dengesiyle gelir.' },
      { type: 'h2', text: 'Bütçe Nasıl Belirlenir?' },
      { type: 'p', text: 'Doğru başlangıç, küçük bir test bütçesiyle birden fazla reklam ve hedef kitleyi denemek, sonra kazananlara bütçe kaydırmaktır. Önemli olan harcanan tutar değil, edinme başına maliyet (CPA) ve reklam harcamasının getirisidir (ROAS). Ölçmeden yapılan reklam, karanlıkta atış yapmaktır.' },
      { type: 'h2', text: 'Boşa Para Harcamamanın Yolları' },
      { type: 'ul', items: [
        'Dönüşüm takibini (conversion tracking) mutlaka kurun',
        'Reklamı doğru bir açılış sayfasına (landing page) yönlendirin',
        'Hedef kitleyi daraltın; herkese reklam kimseye reklamdır',
        'A/B testleriyle sürekli iyileştirin',
        'Negatif anahtar kelimelerle alakasız tıklamaları engelleyin',
      ] },
      { type: 'quote', text: 'Reklamda başarı, en çok harcayanın değil, her lirayı en iyi ölçen ve optimize edenin oyunudur.' },
      { type: 'h2', text: 'Sonuç' },
      { type: 'p', text: 'Doğru kurgulanmış bir reklam kampanyası, yatırdığınız her lirayı ölçülebilir gelire çevirir. Reklam bütçenizden maksimum verim almak için ekibimizle iletişime geçebilirsiniz.' },
    ],
  },

  {
    slug: 'marka-kimligi-nedir-neden-onemli',
    title: 'Marka Kimliği Nedir ve Neden İşletmenizin Geleceğini Belirler?',
    metaTitle: 'Marka Kimliği Nedir? Neden Önemli | BERACORE',
    metaDescription:
      'Marka kimliği nedir, logodan ibaret mi ve işletmeniz için neden kritik? Güçlü marka kimliğinin güven, sadakat ve fiyatlandırmaya etkisi BERACORE blogunda.',
    excerpt:
      'Marka kimliği bir logodan çok daha fazlasıdır; müşterinizin markanızı hissetme biçimidir. Güçlü bir marka kimliğinin neden rekabetin en güçlü silahı olduğunu anlatıyoruz.',
    publishedAt: '2026-06-03',
    author: 'BERACORE',
    category: 'Tasarım',
    readingMinutes: 6,
    relatedService: { label: 'Marka Kimliği hizmetimiz', href: '/hizmetler/design/marka-kimligi' },
    content: [
      { type: 'p', text: 'İnsanlar ürün satın almaz, marka satın alır. Aynı kalitede iki ürün arasından birini seçtiren şey çoğu zaman fiyat değil, hissedilen güven ve aidiyettir. İşte marka kimliği tam olarak bu hissi inşa eder. Peki marka kimliği gerçekten nedir?' },
      { type: 'h2', text: 'Marka Kimliği Nedir?' },
      { type: 'p', text: 'Marka kimliği; logonuz, renk paletiniz, tipografiniz, konuşma tonunuz ve markanızın verdiği genel hissin toplamıdır. Kısacası markanızın “kişiliği”dir. Görsel öğeler bu kimliğin yalnızca dış yüzüdür; asıl kimlik, müşterinin zihninde bıraktığı izlenimdir.' },
      { type: 'h2', text: 'Neden Bu Kadar Önemli?' },
      { type: 'ul', items: [
        'Güven: Tutarlı ve profesyonel bir kimlik güven verir',
        'Farklılaşma: Rakiplerden ayrışmanızı sağlar',
        'Fiyatlandırma gücü: Güçlü markalar daha yüksek fiyat talep edebilir',
        'Sadakat: Müşteriler ilişki kurdukları markalara geri döner',
        'Tanınırlık: Tutarlı kimlik akılda kalır',
      ] },
      { type: 'h2', text: 'Tutarlılığın Gücü' },
      { type: 'p', text: 'Bir marka kimliğinin değeri tutarlılıkta gizlidir. Web sitenizden sosyal medyanıza, kartvizitinizden faturanıza kadar her temas noktasında aynı görsel dil ve ton kullanıldığında, marka zihinlerde sağlam bir yer edinir. Dağınık bir kimlik ise en iyi ürünü bile amatör gösterir.' },
      { type: 'quote', text: 'Marka, siz odada yokken insanların sizin hakkınızda söylediği şeydir. Marka kimliği ise o cümleyi bilinçli olarak yazma sanatıdır.' },
      { type: 'h2', text: 'Sonuç' },
      { type: 'p', text: 'Güçlü bir marka kimliği, bir maliyet değil işletmenizin en değerli uzun vadeli yatırımıdır. Markanızı baştan konumlandırmak ya da yenilemek için ekibimizle iletişime geçebilirsiniz.' },
    ],
  },

  {
    slug: 'api-entegrasyonu-nedir',
    title: 'API Entegrasyonu Nedir ve İşletmeniz İçin Neden Önemli?',
    metaTitle: 'API Entegrasyonu Nedir? Nasıl Çalışır | BERACORE',
    metaDescription:
      'API entegrasyonu nedir, sistemler birbiriyle nasıl konuşur ve işletmenize ne kazandırır? Otomasyon, veri akışı ve verimlilik açısından API’lerin rolü BERACORE blogunda.',
    excerpt:
      'Kullandığınız yazılımlar birbiriyle konuşmuyorsa, ekibiniz aynı veriyi defalarca elle giriyordur. API entegrasyonunun bu kopuklukları nasıl çözdüğünü sade bir dille anlatıyoruz.',
    publishedAt: '2026-05-30',
    author: 'BERACORE',
    category: 'Yazılım Geliştirme',
    readingMinutes: 6,
    relatedService: { label: 'API Entegrasyon hizmetimiz', href: '/hizmetler/software/api-entegrasyon' },
    content: [
      { type: 'p', text: 'İşletmenizde muhasebe programı, e-ticaret sitesi, CRM ve kargo sistemi ayrı ayrı çalışıyor ve veriler bir sistemden diğerine elle taşınıyorsa; hem zaman kaybediyor hem de hata riski taşıyorsunuz. API entegrasyonu, bu sistemlerin birbiriyle otomatik konuşmasını sağlar.' },
      { type: 'h2', text: 'API Nedir?' },
      { type: 'p', text: 'API (Application Programming Interface), iki yazılımın birbiriyle veri alışverişi yapmasını sağlayan bir “ortak dil” veya köprüdür. Bir restoranda garson gibidir: siz (bir sistem) sipariş verirsiniz, garson (API) bunu mutfağa (başka bir sistem) iletir ve sonucu geri getirir.' },
      { type: 'h2', text: 'API Entegrasyonu İşletmeye Ne Kazandırır?' },
      { type: 'ul', items: [
        'Sistemler arası otomatik veri akışı (elle giriş biter)',
        'İnsan hatasının ve mükerrer kaydın ortadan kalkması',
        'Gerçek zamanlı ve tutarlı bilgi (stok, sipariş, ödeme)',
        'Zaman tasarrufu ve operasyonel verimlilik',
        'Yeni araçları mevcut altyapıya hızlı ekleyebilme',
      ] },
      { type: 'h2', text: 'Yaygın Entegrasyon Örnekleri' },
      { type: 'p', text: 'E-ticaret sitesinin muhasebe yazılımıyla, CRM’in e-posta pazarlama aracıyla, sipariş sisteminin kargo firmasıyla veya ödeme geçidinin bankayla entegrasyonu en sık karşılaşılan senaryolardır. Doğru entegrasyon, farklı araçları tek ve akıcı bir sisteme dönüştürür.' },
      { type: 'quote', text: 'Modern bir işletmenin gücü, kullandığı araçların sayısında değil, o araçların birbiriyle ne kadar iyi konuştuğundadır.' },
      { type: 'h2', text: 'Sonuç' },
      { type: 'p', text: 'API entegrasyonu, dağınık sistemleri tek bir verimli bütüne çevirerek işletmenize hız ve doğruluk kazandırır. Sistemlerinizi birbirine bağlamak için ekibimizle iletişime geçebilirsiniz.' },
    ],
  },
];

// Kategori meta — renkler site hizmet paletiyle birebir aynı.
export interface CategoryMeta {
  name: string;
  color: string;
  /** İlgili hizmet kategorisi (iç link) */
  serviceKey?: string;
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  'Yapay Zeka': { name: 'Yapay Zeka', color: '#a78bfa', serviceKey: 'ai' },
  'Blockchain': { name: 'Blockchain', color: '#7dd3fc', serviceKey: 'blockchain' },
  'Yazılım Geliştirme': { name: 'Yazılım Geliştirme', color: '#f0abfc', serviceKey: 'software' },
  'Tasarım': { name: 'Tasarım', color: '#fda4af', serviceKey: 'design' },
  'E-Ticaret': { name: 'E-Ticaret', color: '#6ee7b7', serviceKey: 'ecommerce' },
  'Dijital Pazarlama': { name: 'Dijital Pazarlama', color: '#fde68a', serviceKey: 'marketing' },
};

export function getCategoryColor(category: string): string {
  return CATEGORY_META[category]?.color ?? '#ffa9f9';
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

// En yeni yazı üstte
export function getSortedPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

// İçerikte bulunan kategorileri, CATEGORY_META sırasına göre döndürür (yazısı olanlar).
export function getUsedCategories(): CategoryMeta[] {
  const used = new Set(blogPosts.map((p) => p.category));
  return Object.values(CATEGORY_META).filter((c) => used.has(c.name));
}
