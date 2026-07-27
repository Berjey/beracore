// Şehir bazlı yerel SEO iniş sayfaları.
// Her sayfa GERÇEK ve özgün içerik taşır (doorway/ince sayfa değil).
// Route: /istanbul/[slug]  — örn. /istanbul/web-tasarim
// Yeni sayfa eklemek için diziye bir CityPage nesnesi ekleyin.

export interface CityPage {
  /** /istanbul/[slug] altındaki slug */
  slug: string;
  /** Şehir adı (görünen) */
  city: string;
  /** Sayfa H1 */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Hedef ana anahtar kelime (schema/görünürlük için) */
  keyword: string;
  intro: string;
  sections: { h2: string; body: string }[];
  bullets: { title: string; items: string[] };
  /** İlgili hizmet sayfası iç linki */
  serviceHref: string;
  serviceLabel: string;
  /** İlgili blog yazısı iç linki */
  blogHref: string;
  blogLabel: string;
  faq: { question: string; answer: string }[];
}

const CITY = 'İstanbul';

export const cityPages: CityPage[] = [
  {
    slug: 'web-tasarim',
    city: CITY,
    title: 'İstanbul Web Tasarım',
    metaTitle: 'İstanbul Web Tasarım Ajansı — Kurumsal Web Sitesi | BERACORE',
    metaDescription:
      'İstanbul’da kurumsal web tasarım hizmeti. Hızlı, mobil uyumlu, SEO altyapılı ve dönüşüm odaklı web siteleri. İstanbul merkezli dijital stüdyo BERACORE.',
    keyword: 'istanbul web tasarım',
    intro: 'İstanbul’da markanızı hak ettiği gibi temsil eden bir web sitesi mi arıyorsunuz? BERACORE, İstanbul merkezli bir dijital deneyim stüdyosu olarak; hızlı, mobil uyumlu, SEO altyapısı en baştan kurulmuş ve ziyaretçiyi müşteriye çeviren kurumsal web siteleri tasarlar. Şablon değil, markanıza özel.',
    sections: [
      { h2: 'İstanbul’da Neden Profesyonel Web Tasarım?', body: 'İstanbul, Türkiye’nin en yoğun rekabetin yaşandığı pazarıdır. Potansiyel müşteriniz sizi ararken karşısına çıkan ilk şey web sitenizdir; yavaş, mobilde bozulan veya güven vermeyen bir site, müşteriyi saniyeler içinde rakibinize gönderir. Profesyonel bir web tasarım, bu ilk izlenimi güvene ve satışa çevirir.' },
      { h2: 'Nasıl Çalışıyoruz?', body: 'Süreci keşif görüşmesiyle başlatıyoruz: hedeflerinizi, kitlenizi ve rakiplerinizi dinliyoruz. Ardından markanıza özel UI/UX tasarımı, hızlı ve güvenli bir teknik altyapı ve SEO uyumlu bir yapı kuruyoruz. Site tesliminde eğitim veriyor, sonrasında bakım ve geliştirme desteği sunuyoruz.' },
      { h2: 'Sadece Güzel Değil, İş Yapan Site', body: 'İyi bir kurumsal site estetik olmanın ötesinde ölçülebilir sonuç üretir: hızlı açılır (Core Web Vitals), her ekranda kusursuz çalışır, Google’da bulunur ve ziyaretçiyi teklif almaya yönlendirir. Biz siteyi bir vitrin değil, en çalışkan satış temsilciniz olarak kurguluyoruz.' },
    ],
    bullets: {
      title: 'İstanbul web tasarım hizmetimize dahil olanlar',
      items: [
        'Markaya özel UI/UX tasarımı (şablon değil)',
        'Mobil öncelikli, tüm cihazlarda kusursuz görünüm',
        'Hızlı ve güvenli teknik altyapı (Core Web Vitals uyumlu)',
        'SEO altyapısı ve yapısal veri en baştan',
        'İçerik yönetimi ve kolay güncelleme',
        'Teslim sonrası bakım ve geliştirme desteği',
      ],
    },
    serviceHref: '/hizmetler/design/web-tasarim',
    serviceLabel: 'Web Tasarım hizmetimizin detayları',
    blogHref: '/blog/kurumsal-web-sitesi-yaptirma-rehberi',
    blogLabel: 'Kurumsal Web Sitesi Yaptırma Rehberi',
    faq: [
      { question: 'İstanbul’da web tasarım fiyatları ne kadar?', answer: 'Fiyat; sayfa sayısı, özel tasarım derinliği, işlevsellik ve entegrasyonlara göre değişir. Basit kurumsal sitelerden kapsamlı özel projelere kadar geniş bir aralık vardır. Net fiyat, ücretsiz keşif görüşmesi ve ihtiyaç analizinden sonra belirlenir.' },
      { question: 'Yüz yüze görüşebilir miyiz?', answer: 'İstanbul merkezli çalışıyoruz; projeleri çoğunlukla online yürütsek de İstanbul içinde gerektiğinde yüz yüze görüşme planlanabilir. Süreci şeffaf yönetiyor, her aşamada bilgilendirme yapıyoruz.' },
      { question: 'Mevcut siteme yeni tasarım yapabilir misiniz?', answer: 'Evet. Mevcut sitenizi yenileyebilir, SEO değerinizi koruyarak (301 yönlendirmeler ve yapı bütünlüğüyle) modern, hızlı ve dönüşüm odaklı bir tasarıma taşıyabiliriz.' },
    ],
  },
  {
    slug: 'yazilim',
    city: CITY,
    title: 'İstanbul Yazılım Firması',
    metaTitle: 'İstanbul Yazılım Firması — Özel Yazılım Geliştirme | BERACORE',
    metaDescription:
      'İstanbul’da özel yazılım geliştirme: web, mobil, API ve kurumsal sistemler. İşletmenize özel, ölçeklenebilir yazılım çözümleri için İstanbul merkezli BERACORE.',
    keyword: 'istanbul yazılım firması',
    intro: 'İşletmenize özel bir yazılıma mı ihtiyacınız var? BERACORE, İstanbul merkezli bir yazılım ve dijital deneyim stüdyosu olarak; web uygulamaları, mobil uygulamalar, API entegrasyonları ve kurumsal sistemler geliştirir. Hazır kalıplar değil, sizin süreçlerinize göre tasarlanan ölçeklenebilir çözümler.',
    sections: [
      { h2: 'Doğru Yazılım Ortağı Neden Önemli?', body: 'Yazılım projelerinin çoğu teknik yetersizlikten değil, iletişim ve süreç eksikliğinden başarısız olur. Doğru ortak; işinizi anlar, şeffaf çalışır, gerçekçi takvim verir ve teslimden sonra da yanınızda olur. Biz projeyi kendi işimiz gibi sahipleniyoruz.' },
      { h2: 'Neler Geliştiriyoruz?', body: 'Kurumsal web uygulamaları ve yönetim panelleri, iOS/Android mobil uygulamalar, sistemler arası API entegrasyonları, e-ticaret altyapıları ve yapay zeka destekli çözümler. Modern, sürdürülebilir ve büyümenize uygun teknolojilerle çalışıyoruz.' },
      { h2: 'Çevik ve Şeffaf Süreç', body: 'Projeleri sprint’ler halinde, her aşamada geri bildirim alarak yürütüyoruz. MVP (çekirdek özellikli ilk sürüm) yaklaşımıyla erken değer üretiyor, yanlış yöne aylarca ilerleme riskini ortadan kaldırıyoruz.' },
    ],
    bullets: {
      title: 'İstanbul yazılım geliştirme hizmetlerimiz',
      items: [
        'Özel web yazılımı ve kurumsal yönetim panelleri',
        'iOS & Android mobil uygulama geliştirme',
        'API entegrasyonu ve sistemler arası veri akışı',
        'E-ticaret ve ödeme altyapıları',
        'Yapay zeka & otomasyon çözümleri',
        'Teslim sonrası bakım, güncelleme ve destek',
      ],
    },
    serviceHref: '/hizmetler/software/ozel-yazilim',
    serviceLabel: 'Özel Yazılım Geliştirme hizmetimiz',
    blogHref: '/blog/ozel-yazilim-mi-hazir-cozum-mu',
    blogLabel: 'Özel Yazılım mı, Hazır Çözüm mü?',
    faq: [
      { question: 'İstanbul’daki yazılım firmaları arasında sizi ne ayırıyor?', answer: 'Disiplinlerarası bir ekip olarak yazılımı tasarım, SEO ve pazarlama ile bütünsel ele alıyoruz. Yalnızca kod yazmıyor; işinizi büyütecek, ölçeklenebilir ve sürdürülebilir çözümler kuruyoruz. Şeffaf süreç ve teslim sonrası destek standartımız.' },
      { question: 'Özel yazılım ne kadar sürede teslim edilir?', answer: 'Kapsama bağlıdır. MVP yaklaşımıyla birkaç ayda kullanılabilir bir ürün çıkarılabilir; kapsamlı sistemler daha uzun sürebilir. Çevik geliştirmeyle erken ve sürekli değer üretiriz.' },
      { question: 'Mevcut sistemimi geliştirebilir misiniz?', answer: 'Evet. Mevcut yazılımınızı devralıp geliştirebilir, yeni modüller ekleyebilir veya sistemler arası entegrasyonlar kurabiliriz. Önce mevcut yapının teknik değerlendirmesini yapıyoruz.' },
    ],
  },
  {
    slug: 'e-ticaret',
    city: CITY,
    title: 'İstanbul E-Ticaret Çözümleri',
    metaTitle: 'İstanbul E-Ticaret Çözümleri — Site ve Entegrasyon | BERACORE',
    metaDescription:
      'İstanbul’da e-ticaret sitesi kurulumu, pazaryeri entegrasyonu ve ödeme sistemleri. Satışa hazır, ölçeklenebilir e-ticaret altyapıları — İstanbul merkezli BERACORE.',
    keyword: 'istanbul e-ticaret',
    intro: 'İstanbul’da online satışa geçmek ya da mevcut e-ticaretinizi büyütmek mi istiyorsunuz? BERACORE; satışa hazır e-ticaret siteleri, Trendyol/Hepsiburada/N11/Amazon pazaryeri entegrasyonları ve güvenli ödeme altyapıları kurar. Sadece site değil, satan bir sistem.',
    sections: [
      { h2: 'Sadece Site Değil, Satış Sistemi', body: 'Başarılı e-ticaret; güzel bir vitrinden fazlasıdır. Hızlı açılan, mobilde kusursuz, güvenli ödeme sunan ve ziyaretçiyi satın almaya yönlendiren bir sistem gerekir. Biz e-ticaretinizi dönüşüm ve operasyon verimliliği gözeterek kuruyoruz.' },
      { h2: 'Çok Kanallı Satış ve Entegrasyon', body: 'Kendi siteniz komisyonsuz satış ve müşteri verisine sahiplik sağlarken, pazaryerleri hacim getirir. İkisini aynı stok havuzundan besleyen bir entegrasyonla; stok tutarsızlığını, aşırı satışı ve elle yönetim yükünü ortadan kaldırıyoruz.' },
      { h2: 'Güvenli ve Dönüşüm Odaklı Ödeme', body: 'Müşteriler en çok ödeme adımında vazgeçer. Sanal POS, taksit, 3D Secure ve sürtünmesiz bir ödeme akışıyla sepet terk oranını düşürüyor, mevcut trafiğinizden daha fazla satış çıkarıyoruz.' },
    ],
    bullets: {
      title: 'İstanbul e-ticaret hizmetlerimiz',
      items: [
        'Satışa hazır, özel e-ticaret sitesi kurulumu',
        'Trendyol, Hepsiburada, N11, Amazon pazaryeri entegrasyonu',
        'Sanal POS ve güvenli ödeme sistemleri (taksit, 3D Secure)',
        'Stok, sipariş ve kargo yönetimi otomasyonu',
        'Mobil uyumlu, dönüşüm odaklı tasarım',
        'SEO altyapısı ve pazarlama entegrasyonları',
      ],
    },
    serviceHref: '/hizmetler/ecommerce/e-ticaret-yazilim',
    serviceLabel: 'E-Ticaret Yazılım hizmetimiz',
    blogHref: '/blog/e-ticaret-sitesi-kurma-maliyeti',
    blogLabel: 'E-Ticaret Sitesi Kurma Maliyeti 2026',
    faq: [
      { question: 'İstanbul’da e-ticaret sitesi kurmak ne kadar sürer?', answer: 'Hazır altyapıyla birkaç günde temel bir mağaza açılabilir; markaya özel tasarım ve entegrasyonlar içeren kapsamlı bir e-ticaret sitesi birkaç haftadan birkaç aya kadar sürebilir. Kapsam, keşif görüşmesinde netleşir.' },
      { question: 'Pazaryerlerine de entegre eder misiniz?', answer: 'Evet. Kendi sitenizi ve Trendyol, Hepsiburada, N11, Amazon gibi pazaryerlerini aynı stok havuzundan yöneten entegrasyonlar kuruyoruz; böylece stok her kanalda anında güncellenir.' },
      { question: 'Mevcut e-ticaret sitemi taşıyabilir misiniz?', answer: 'Evet. Mevcut ürün, müşteri ve sipariş verilerinizi koruyarak (migration) ve SEO değerinizi kaybetmeden yeni bir altyapıya taşıyabiliriz.' },
    ],
  },
  {
    slug: 'dijital-pazarlama',
    city: CITY,
    title: 'İstanbul Dijital Pazarlama Ajansı',
    metaTitle: 'İstanbul Dijital Pazarlama Ajansı — SEO, Reklam | BERACORE',
    metaDescription:
      'İstanbul’da dijital pazarlama: SEO, Google & Meta reklamları, sosyal medya ve içerik pazarlama. Ölçülebilir büyüme için İstanbul merkezli dijital ajans BERACORE.',
    keyword: 'istanbul dijital pazarlama ajansı',
    intro: 'İstanbul’da işletmenizi online büyütecek bir dijital pazarlama ortağı mı arıyorsunuz? BERACORE; SEO, Google ve Meta reklamları, sosyal medya yönetimi ve içerik pazarlamayı ölçülebilir bir strateji içinde birleştirir. Gösteriş değil, sonuç odaklı çalışıyoruz.',
    sections: [
      { h2: 'Ölçülebilir Büyüme', body: 'Dijital pazarlamada asıl mesele harcadığınız bütçe değil, o bütçenin getirisidir. Her kampanyayı dönüşüm takibiyle kuruyor, hangi kanalın gerçekten müşteri getirdiğini ölçüyor ve bütçeyi kazanan kanallara yönlendiriyoruz.' },
      { h2: 'Bütünsel Yaklaşım', body: 'SEO uzun vadeli kalıcı trafik, reklam anlık görünürlük, sosyal medya marka gücü, içerik ise otorite inşa eder. Biz bu kanalları ayrı ayrı değil, birbirini besleyen tek bir strateji içinde yönetiyoruz.' },
      { h2: 'Yerel ve Sektörel Odak', body: 'İstanbul’daki rekabette öne çıkmak, kitlenizi ve rakiplerinizi doğru okumakla başlar. Sektörünüze ve hedef bölgenize uygun anahtar kelime ve kampanya stratejileriyle doğru müşteriye ulaşıyoruz.' },
    ],
    bullets: {
      title: 'İstanbul dijital pazarlama hizmetlerimiz',
      items: [
        'SEO — arama motorlarında kalıcı üst sıralar',
        'Google & Meta (Instagram/Facebook) reklam yönetimi',
        'Sosyal medya yönetimi ve içerik üretimi',
        'İçerik pazarlama ve blog stratejisi',
        'Dönüşüm takibi ve performans raporlama',
        'Yerel SEO ve Google görünürlüğü',
      ],
    },
    serviceHref: '/hizmetler/marketing/seo',
    serviceLabel: 'Dijital Pazarlama hizmetlerimiz',
    blogHref: '/blog/seo-nedir-google-ilk-sayfaya-cikma',
    blogLabel: 'SEO Nedir, Google’da İlk Sayfaya Nasıl Çıkılır?',
    faq: [
      { question: 'Dijital pazarlamadan ne kadar sürede sonuç alırım?', answer: 'Reklam anlık trafik getirir; SEO ve içerik ise 3-6 ayda anlamlı sonuç vermeye başlayıp zamanla bileşik büyür. İdeal strateji, hızlı sonuç için reklamı kalıcı büyüme için SEO/içerikle birlikte yürütmektir.' },
      { question: 'Sadece SEO veya sadece reklam alabilir miyim?', answer: 'Evet. Hizmetleri ihtiyacınıza göre ayrı ayrı da sunuyoruz. Ancak çoğu işletme için, kanalları birbirini besleyecek şekilde birlikte kurgulamak daha yüksek getiri sağlar.' },
      { question: 'Raporlama nasıl oluyor?', answer: 'Şeffaf çalışıyoruz. Dönüşüm takibi kurup, hangi kanalın ne kadar müşteri ve gelir getirdiğini düzenli raporlarla paylaşıyoruz; kararları veriye dayanarak birlikte alıyoruz.' },
    ],
  },
  {
    slug: 'seo',
    city: CITY,
    title: 'İstanbul SEO Ajansı',
    metaTitle: 'İstanbul SEO Ajansı — Google’da İlk Sayfa | BERACORE',
    metaDescription:
      'İstanbul’da SEO hizmeti: teknik SEO, içerik, yerel SEO ve backlink. Google’da kalıcı üst sıralar için İstanbul merkezli SEO ajansı BERACORE.',
    keyword: 'istanbul seo ajansı',
    intro: 'İstanbul’da Google’da üst sıralara çıkmak ve oradan kalıcı organik trafik almak mı istiyorsunuz? BERACORE, SEO’yu teknik altyapı, içerik ve otorite inşasını birleştiren bütünsel bir strateji olarak yürütür. Kısa vadeli hileler değil, sürdürülebilir sıralamalar.',
    sections: [
      { h2: 'SEO Bir Maraton, Sprint Değil', body: 'Kalıcı SEO başarısı bileşik faiz gibi çalışır: erken başlayan ve tutarlı olan kazanır. Uzun kuyruk ve yerel kelimelerde 1-3 ayda ilk sonuçlar alınırken, rekabetçi kelimelerde ilk sayfa içerik ve backlink birikimiyle gelir. Gerçekçi bir takvimle ve şeffaf çalışıyoruz.' },
      { h2: 'Üç Ayaklı SEO', body: 'Teknik SEO (hız, mobil uyum, indekslenebilirlik, yapısal veri), içerik/on-page SEO (doğru anahtar kelime ve kullanıcı niyetine uygun içerik) ve off-page SEO (backlink, marka otoritesi). Üçünü birlikte kurmadan kalıcı sonuç alınmaz.' },
      { h2: 'Yerel SEO ile İstanbul’da Öne Çıkın', body: 'İstanbul’daki müşteriler "yakınımdaki" ve şehir bazlı aramalar yapar. Google İşletme Profili optimizasyonu, NAP tutarlılığı ve şehir bazlı içerikle yerel aramalarda öne çıkmanızı sağlıyoruz.' },
    ],
    bullets: {
      title: 'İstanbul SEO hizmetimiz kapsamı',
      items: [
        'Teknik SEO denetimi ve iyileştirmesi',
        'Anahtar kelime ve kullanıcı niyeti analizi',
        'İçerik/on-page SEO ve blog stratejisi',
        'Yerel SEO ve Google İşletme Profili optimizasyonu',
        'Backlink ve otorite inşası',
        'Search Console takibi ve düzenli raporlama',
      ],
    },
    serviceHref: '/hizmetler/marketing/seo',
    serviceLabel: 'SEO hizmetimizin detayları',
    blogHref: '/blog/seo-ajansi-nasil-secilir',
    blogLabel: 'SEO Ajansı Nasıl Seçilir?',
    faq: [
      { question: 'İstanbul’da SEO ne kadar sürede sonuç verir?', answer: 'Uzun kuyruk ve yerel kelimelerde 1-3 ay, rekabetçi ana kelimelerde 6-12 ay tipik bir aralıktır. SEO bileşik büyüyen bir yatırımdır; erken başlamak ve tutarlılık en belirleyici iki faktördür.' },
      { question: 'SEO garantisi veriyor musunuz?', answer: 'Hiçbir dürüst SEO ajansı "1 numara garantisi" veremez; çünkü sıralama Google’ın algoritmasına bağlıdır. Bizim garantimiz şeffaf çalışma, doğru yöntem ve ölçülebilir ilerlemedir. "Garantili ilk sıra" vaat edenlerden uzak durmanızı öneririz.' },
      { question: 'Mevcut sitem için SEO yapılabilir mi?', answer: 'Evet. Önce teknik SEO denetimi yapıp mevcut sorunları tespit ediyor, sonra içerik ve otorite çalışmasıyla sıralamanızı kademeli olarak yükseltiyoruz.' },
    ],
  },
  {
    slug: 'mobil-uygulama',
    city: CITY,
    title: 'İstanbul Mobil Uygulama Geliştirme',
    metaTitle: 'İstanbul Mobil Uygulama Geliştirme — iOS & Android | BERACORE',
    metaDescription:
      'İstanbul’da mobil uygulama geliştirme: iOS, Android ve cross-platform. Fikirden mağaza yayınına kadar uçtan uca mobil çözümler için İstanbul merkezli BERACORE.',
    keyword: 'istanbul mobil uygulama',
    intro: 'İstanbul’da bir mobil uygulama fikrinizi hayata geçirmek mi istiyorsunuz? BERACORE; iOS, Android ve cross-platform mobil uygulamaları fikirden mağaza yayınına kadar uçtan uca geliştirir. Hızlı, kullanıcı dostu ve büyümeye hazır uygulamalar.',
    sections: [
      { h2: 'Doğru Yaklaşım: Önce Çekirdek', body: 'En başarılı uygulamalar her özelliği ilk günden içeren değil, doğru çekirdekle çıkıp kullanıcı geri bildirimiyle büyüyenlerdir. MVP yaklaşımıyla önce değeri kanıtlıyor, sonra veriye dayanarak geliştiriyoruz. Bu, hem riski hem maliyeti düşürür.' },
      { h2: 'Native mi, Cross-Platform mı?', body: 'Yüksek performans ve platforma özel deneyim gerekiyorsa native (Swift/Kotlin); bütçe ve süre önemliyse tek kod tabanıyla iki platforma çıkan cross-platform (React Native, Flutter) uygundur. Doğru seçimi ihtiyacınıza göre birlikte belirliyoruz.' },
      { h2: 'Uçtan Uca Süreç', body: 'Keşif ve gereksinim analizi, UI/UX tasarımı, geliştirme, test, App Store/Google Play yayını ve yayın sonrası bakım. Uygulamanızı yalnızca geliştirip bırakmıyor, büyümesi için yanınızda kalıyoruz.' },
    ],
    bullets: {
      title: 'İstanbul mobil uygulama hizmetlerimiz',
      items: [
        'iOS ve Android native uygulama geliştirme',
        'Cross-platform (React Native, Flutter) geliştirme',
        'UI/UX tasarımı ve kullanıcı deneyimi',
        'Backend ve API altyapısı',
        'App Store & Google Play yayın süreci',
        'Yayın sonrası bakım, güncelleme ve destek',
      ],
    },
    serviceHref: '/hizmetler/software/mobil-uygulama',
    serviceLabel: 'Mobil Uygulama Geliştirme hizmetimiz',
    blogHref: '/blog/mobil-uygulama-gelistirme-maliyeti',
    blogLabel: 'Mobil Uygulama Geliştirme Maliyeti',
    faq: [
      { question: 'İstanbul’da mobil uygulama geliştirme maliyeti nedir?', answer: 'Maliyet; platform (iOS/Android/ikisi), native mi cross-platform mu, özellik sayısı ve backend ihtiyacına göre değişir. MVP yaklaşımıyla çekirdek özelliklerle başlayıp bütçeyi kontrol altında tutmak mümkündür. Net rakam keşif görüşmesinde belirlenir.' },
      { question: 'Hem iOS hem Android yapmalı mıyım?', answer: 'Şart değil. Hedef kitlenizin ağırlıklı kullandığı platformla başlayabilirsiniz. Ancak cross-platform geliştirme, tek kod tabanıyla iki platforma birden çıkmayı ekonomik hale getirir.' },
      { question: 'Uygulamayı mağazalarda yayınlıyor musunuz?', answer: 'Evet. App Store ve Google Play yayın süreçlerini uçtan uca yönetiyor, gerekli hesap ve sertifika ayarlarında size yardımcı oluyoruz. Yayın sonrası güncelleme desteği de sağlıyoruz.' },
    ],
  },
];

export function getCityPageBySlug(slug: string): CityPage | undefined {
  return cityPages.find((p) => p.slug === slug);
}

/**
 * Bir hizmet sayfasına karşılık gelen şehir sayfalarını döndürür.
 * Hizmet sayfalarından şehir sayfalarına iç link vermek için kullanılır —
 * aksi halde şehir sayfaları hiç iç link almaz ve Google tarafından
 * yalnızca sitemap üzerinden keşfedilir (zayıf sinyal).
 */
export function getCityPagesByServiceHref(serviceHref: string): CityPage[] {
  return cityPages.filter((p) => p.serviceHref === serviceHref);
}
