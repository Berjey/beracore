// Şehir bazlı yerel SEO iniş sayfaları.
// Her sayfa GERÇEK ve özgün içerik taşır (doorway/ince sayfa değil):
// her şehrin kendi ekonomik kimliği (Ankara: kurumsal/kamu/savunma/teknokent,
// İzmir: ihracat/üretici, Bursa: sanayi/imalat) intro ve ilk bölümde işlenir.
// Route: /[sehir]/[slug]  — örn. /istanbul/web-tasarim, /ankara/yazilim
// Yeni sayfa eklemek için diziye bir CityPage nesnesi ekleyin.

export interface CityPage {
  /** /[sehir]/[slug] altındaki şehir segmenti — örn. 'istanbul', 'ankara' */
  citySlug: string;
  /** /[sehir]/[slug] altındaki hizmet slug'ı */
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

/**
 * Şehir sayfası içeriğinin SON GERÇEK değişiklik tarihi (sitemap `lastmod` kaynağı).
 *
 * ELLE güncellenir — `new Date()` KULLANILMAZ. Sebep: sitemap eskiden build zamanını
 * yazıyordu, yani içerik hiç değişmese de her deploy'da 62 sayfa "bugün güncellendi"
 * diyordu. Google, güvenilmez bulduğu lastmod'u tamamen yok sayar; tam da sayfaların
 * "Discovered - currently not indexed" durumunda olduğu bir dönemde tarama
 * önceliklendirmesinde işimize yarayacak tek sinyali harcıyorduk.
 *
 * Bu tarih: 4 şehir × 6 hizmet yayılımının tamamlandığı gün (Ankara/İzmir/Bursa).
 * Şehir metinlerinde anlamlı bir değişiklik yapınca BURAYI güncelleyin.
 */
export const CITY_CONTENT_UPDATED = '2026-07-28';

const CITY = 'İstanbul';

export const cityPages: CityPage[] = [
  {
    slug: 'web-tasarim',
    citySlug: 'istanbul',
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
    citySlug: 'istanbul',
    city: CITY,
    title: 'İstanbul Yazılım Firması',
    metaTitle: 'İstanbul Yazılım Firması — Özel Geliştirme | BERACORE',
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
    citySlug: 'istanbul',
    city: CITY,
    title: 'İstanbul E-Ticaret Çözümleri',
    metaTitle: 'İstanbul E-Ticaret Çözümleri — Site Kurulumu | BERACORE',
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
    citySlug: 'istanbul',
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
    citySlug: 'istanbul',
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
    citySlug: 'istanbul',
    city: CITY,
    title: 'İstanbul Mobil Uygulama Geliştirme',
    metaTitle: 'İstanbul Mobil Uygulama — iOS & Android | BERACORE',
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

  // ===================== ANKARA =====================
  // Kimlik: başkent — kamu kurumları, savunma sanayii ekosistemi, teknokentler
  // (ODTÜ Teknokent, Bilkent Cyberpark), üniversiteler; kurumsal ciddiyet ve güven.
  {
    citySlug: 'ankara',
    city: 'Ankara',
    slug: 'web-tasarim',
    title: 'Ankara Web Tasarım',
    metaTitle: 'Ankara Web Tasarım Ajansı — Kurumsal Site | BERACORE',
    metaDescription:
      'Ankara’da kurumsal web tasarım: hızlı, mobil uyumlu, SEO altyapılı ve güven veren siteler. Başkentin kurum ve firmalarına özel dijital stüdyo BERACORE.',
    keyword: 'ankara web tasarım',
    intro: 'Ankara’da kurumların, danışmanlık ofislerinin ve teknoloji firmalarının ortak beklentisi aynıdır: ciddiyet ve güven veren bir web sitesi. Başkentin iş kültürü gösterişten çok kurumsallığı önemser. BERACORE, Ankara’daki markalar için hızlı, mobil uyumlu, SEO altyapısı en baştan kurulmuş ve ziyaretçiyi müşteriye çeviren kurumsal web siteleri tasarlar — şablon değil, kuruma özel.',
    sections: [
      { h2: 'Başkentte Web Sitesi Neden Farklı Kurgulanmalı?', body: 'Ankara’da karar alıcılar; kamu kurumları, üniversiteler, savunma sanayii ve teknokent ekosistemiyle iç içe çalışan, güvenilirliği önce web sitenizden okuyan bir kitledir. Amatör görünen bir site bu kitlede daha ilk saniyede güven kaybettirir. Başkente uygun bir kurumsal site sade, hızlı, erişilebilir ve içerik olarak yetkin olmalıdır.' },
      { h2: 'Nasıl Çalışıyoruz?', body: 'Süreci keşif görüşmesiyle başlatıyoruz: kurumunuzu, hedef kitlenizi ve rakiplerinizi dinliyoruz. Ardından markanıza özel UI/UX, hızlı ve güvenli bir teknik altyapı ve SEO uyumlu bir yapı kuruyoruz. Teslimde eğitim veriyor, sonrasında bakım ve geliştirme desteği sunuyoruz.' },
      { h2: 'Sadece Görünen Değil, İş Yapan Site', body: 'İyi bir kurumsal site estetiğin ötesinde ölçülebilir sonuç üretir: hızlı açılır, her cihazda kusursuz çalışır, Google’da bulunur ve ziyaretçiyi teklif almaya yönlendirir. Siteyi bir vitrin olarak değil, en çalışkan temsilciniz olarak kurguluyoruz.' },
    ],
    bullets: {
      title: 'Ankara web tasarım hizmetimize dahil olanlar',
      items: [
        'Kuruma özel UI/UX tasarımı (şablon değil)',
        'Mobil öncelikli, tüm cihazlarda kusursuz görünüm',
        'Hızlı ve güvenli teknik altyapı (Core Web Vitals uyumlu)',
        'SEO altyapısı ve yapısal veri en baştan',
        'Erişilebilirlik ve kolay içerik yönetimi',
        'Teslim sonrası bakım ve geliştirme desteği',
      ],
    },
    serviceHref: '/hizmetler/design/web-tasarim',
    serviceLabel: 'Web Tasarım hizmetimizin detayları',
    blogHref: '/blog/kurumsal-web-sitesi-yaptirma-rehberi',
    blogLabel: 'Kurumsal Web Sitesi Yaptırma Rehberi',
    faq: [
      { question: 'Ankara’da web tasarım fiyatları ne kadar?', answer: 'Fiyat; sayfa sayısı, özel tasarım derinliği, işlevsellik ve entegrasyonlara göre değişir. Net fiyat, ücretsiz keşif görüşmesi ve ihtiyaç analizinden sonra belirlenir.' },
      { question: 'Ankara dışından da çalışıyor musunuz?', answer: 'Evet. Süreci çoğunlukla online yürütüyoruz; Ankara’daki ve Türkiye’nin her yerindeki kurumlarla şeffaf ve düzenli bilgilendirmeyle çalışıyoruz.' },
      { question: 'Mevcut kurumsal sitemi yenileyebilir misiniz?', answer: 'Evet. Mevcut sitenizi, SEO değerinizi koruyarak (301 yönlendirmeler ve yapı bütünlüğüyle) modern, hızlı ve dönüşüm odaklı bir tasarıma taşıyabiliriz.' },
    ],
  },
  {
    citySlug: 'ankara',
    city: 'Ankara',
    slug: 'yazilim',
    title: 'Ankara Yazılım Firması',
    metaTitle: 'Ankara Yazılım Firması — Özel Yazılım Geliştirme | BERACORE',
    metaDescription:
      'Ankara’da özel yazılım geliştirme: web, mobil, API ve kurumsal sistemler. Başkentin kurum ve firmalarına özel, ölçeklenebilir çözümler için BERACORE.',
    keyword: 'ankara yazılım firması',
    intro: 'Ankara; kamu kurumları, savunma sanayii ekosistemi, teknokentler ve üniversitelerin yoğunlaştığı, yazılıma talebin yüksek olduğu bir şehir. Kurumunuza özel bir yazılıma ihtiyacınız varsa BERACORE; web uygulamaları, mobil uygulamalar, API entegrasyonları ve kurumsal sistemler geliştirir. Hazır kalıplar değil, süreçlerinize göre tasarlanan ölçeklenebilir çözümler.',
    sections: [
      { h2: 'Doğru Yazılım Ortağı Neden Önemli?', body: 'Yazılım projelerinin çoğu teknik yetersizlikten değil, iletişim ve süreç eksikliğinden başarısız olur. Doğru ortak işinizi anlar, şeffaf çalışır, gerçekçi takvim verir ve teslimden sonra da yanınızdadır. Özellikle kurumsal ve denetime tabi işlerin yoğun olduğu başkentte bu disiplin belirleyicidir.' },
      { h2: 'Neler Geliştiriyoruz?', body: 'Kurumsal web uygulamaları ve yönetim panelleri, iOS/Android mobil uygulamalar, sistemler arası API entegrasyonları, e-ticaret altyapıları ve yapay zeka destekli çözümler. Modern, sürdürülebilir ve büyümeye uygun teknolojilerle çalışıyoruz.' },
      { h2: 'Çevik ve Şeffaf Süreç', body: 'Projeleri sprint’ler halinde, her aşamada geri bildirim alarak yürütüyoruz. MVP (çekirdek özellikli ilk sürüm) yaklaşımıyla erken değer üretiyor, yanlış yöne aylarca ilerleme riskini ortadan kaldırıyoruz.' },
    ],
    bullets: {
      title: 'Ankara yazılım geliştirme hizmetlerimiz',
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
      { question: 'Ankara’daki yazılım firmaları arasında sizi ne ayırıyor?', answer: 'Yazılımı tasarım, SEO ve pazarlamayla bütünsel ele alıyoruz. Yalnızca kod yazmıyor; ölçeklenebilir ve sürdürülebilir çözümler kuruyoruz. Şeffaf süreç ve teslim sonrası destek standartımızdır.' },
      { question: 'Özel yazılım ne kadar sürede teslim edilir?', answer: 'Kapsama bağlıdır. MVP yaklaşımıyla birkaç ayda kullanılabilir bir ürün çıkarılabilir; kapsamlı sistemler daha uzun sürebilir. Çevik geliştirmeyle erken ve sürekli değer üretiriz.' },
      { question: 'Mevcut sistemimi geliştirebilir misiniz?', answer: 'Evet. Mevcut yazılımınızı devralıp geliştirebilir, yeni modüller ekleyebilir veya sistemler arası entegrasyonlar kurabiliriz. Önce mevcut yapının teknik değerlendirmesini yapıyoruz.' },
    ],
  },
  {
    citySlug: 'ankara',
    city: 'Ankara',
    slug: 'e-ticaret',
    title: 'Ankara E-Ticaret Çözümleri',
    metaTitle: 'Ankara E-Ticaret Çözümleri — Site, Entegrasyon | BERACORE',
    metaDescription:
      'Ankara’da e-ticaret sitesi kurulumu, pazaryeri entegrasyonu ve ödeme sistemleri. Satışa hazır, ölçeklenebilir e-ticaret altyapıları için BERACORE.',
    keyword: 'ankara e-ticaret',
    intro: 'Ankara’nın güçlü iç pazarı ve büyüyen yerel markaları, e-ticareti bir tercih olmaktan çıkarıp zorunluluğa dönüştürdü. İster kendi ürününü üreten bir marka, ister perakendeci olun; BERACORE satışa hazır e-ticaret siteleri, Trendyol/Hepsiburada/N11/Amazon entegrasyonları ve güvenli ödeme altyapıları kurar. Amacımız site açmak değil, satan bir sistem kurmaktır.',
    sections: [
      { h2: 'Sadece Site Değil, Satış Sistemi', body: 'Başarılı e-ticaret güzel bir vitrinden fazlasıdır. Hızlı açılan, mobilde kusursuz, güvenli ödeme sunan ve ziyaretçiyi satın almaya yönlendiren bir sistem gerekir. E-ticaretinizi dönüşüm oranı ve operasyon verimliliğini gözeterek kuruyoruz.' },
      { h2: 'Çok Kanallı Satış ve Entegrasyon', body: 'Kendi siteniz komisyonsuz satış ve müşteri verisine sahiplik sağlarken, pazaryerleri hacim getirir. İkisini tek bir stok havuzundan besleyen bir entegrasyonla stok tutarsızlığını, aşırı satışı ve elle yönetim yükünü ortadan kaldırıyoruz.' },
      { h2: 'Güvenli ve Dönüşüm Odaklı Ödeme', body: 'Müşteriler en çok ödeme adımında vazgeçer. Sanal POS, taksit, 3D Secure ve sürtünmesiz bir ödeme akışıyla sepet terk oranını düşürüyor, mevcut trafiğinizden daha fazla satış çıkarıyoruz.' },
    ],
    bullets: {
      title: 'Ankara e-ticaret hizmetlerimiz',
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
      { question: 'Ankara’da e-ticaret sitesi kurmak ne kadar sürer?', answer: 'Hazır altyapıyla birkaç günde temel bir mağaza açılabilir; markaya özel tasarım ve entegrasyonlar içeren kapsamlı bir e-ticaret sitesi birkaç haftadan birkaç aya kadar sürebilir. Kapsam, keşif görüşmesinde netleşir.' },
      { question: 'Pazaryerlerine de entegre eder misiniz?', answer: 'Evet. Kendi sitenizi ve Trendyol, Hepsiburada, N11, Amazon gibi pazaryerlerini aynı stok havuzundan yöneten entegrasyonlar kuruyoruz; böylece stok her kanalda anında güncellenir.' },
      { question: 'Mevcut e-ticaret sitemi taşıyabilir misiniz?', answer: 'Evet. Mevcut ürün, müşteri ve sipariş verilerinizi koruyarak (migration) ve SEO değerinizi kaybetmeden yeni bir altyapıya taşıyabiliriz.' },
    ],
  },
  {
    citySlug: 'ankara',
    city: 'Ankara',
    slug: 'dijital-pazarlama',
    title: 'Ankara Dijital Pazarlama Ajansı',
    metaTitle: 'Ankara Dijital Pazarlama Ajansı — SEO, Reklam | BERACORE',
    metaDescription:
      'Ankara’da dijital pazarlama: SEO, Google & Meta reklamları, sosyal medya ve içerik. Ölçülebilir büyüme için başkentin dijital ajansı BERACORE.',
    keyword: 'ankara dijital pazarlama ajansı',
    intro: 'Ankara’da işletmenizi online büyütecek bir dijital pazarlama ortağı mı arıyorsunuz? Başkentin rekabeti; doğru kitleye, doğru mesajla ve ölçülebilir biçimde ulaşmayı gerektirir. BERACORE; SEO, Google ve Meta reklamları, sosyal medya yönetimi ve içerik pazarlamayı tek bir strateji içinde birleştirir. Gösteriş değil, sonuç odaklı çalışıyoruz.',
    sections: [
      { h2: 'Ölçülebilir Büyüme', body: 'Dijital pazarlamada asıl mesele harcanan bütçe değil, o bütçenin getirisidir. Her kampanyayı dönüşüm takibiyle kuruyor, hangi kanalın gerçekten müşteri getirdiğini ölçüyor ve bütçeyi kazanan kanallara yönlendiriyoruz.' },
      { h2: 'Bütünsel Yaklaşım', body: 'SEO uzun vadeli kalıcı trafik, reklam anlık görünürlük, sosyal medya marka gücü, içerik ise otorite inşa eder. Bu kanalları ayrı ayrı değil, birbirini besleyen tek bir strateji içinde yönetiyoruz.' },
      { h2: 'Yerel ve Sektörel Odak', body: 'Ankara’daki rekabette öne çıkmak, kitlenizi ve rakiplerinizi doğru okumakla başlar. Sektörünüze ve hedef bölgenize uygun anahtar kelime ve kampanya stratejileriyle doğru müşteriye ulaşıyoruz.' },
    ],
    bullets: {
      title: 'Ankara dijital pazarlama hizmetlerimiz',
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
      { question: 'Sadece SEO veya sadece reklam alabilir miyim?', answer: 'Evet. Hizmetleri ihtiyacınıza göre ayrı ayrı da sunuyoruz. Ancak çoğu işletme için kanalları birbirini besleyecek şekilde birlikte kurgulamak daha yüksek getiri sağlar.' },
      { question: 'Raporlama nasıl oluyor?', answer: 'Şeffaf çalışıyoruz. Dönüşüm takibi kurup hangi kanalın ne kadar müşteri ve gelir getirdiğini düzenli raporlarla paylaşıyoruz; kararları veriye dayanarak birlikte alıyoruz.' },
    ],
  },
  {
    citySlug: 'ankara',
    city: 'Ankara',
    slug: 'seo',
    title: 'Ankara SEO Ajansı',
    metaTitle: 'Ankara SEO Ajansı — Google’da İlk Sayfa | BERACORE',
    metaDescription:
      'Ankara’da SEO hizmeti: teknik SEO, içerik, yerel SEO ve backlink. Google’da kalıcı üst sıralar için başkentin SEO ajansı BERACORE.',
    keyword: 'ankara seo ajansı',
    intro: 'Ankara’da Google’da üst sıralara çıkmak ve oradan kalıcı organik trafik almak mı istiyorsunuz? BERACORE, SEO’yu teknik altyapı, içerik ve otorite inşasını birleştiren bütünsel bir strateji olarak yürütür. Kısa vadeli hileler değil, sürdürülebilir sıralamalar.',
    sections: [
      { h2: 'SEO Bir Maraton, Sprint Değil', body: 'Kalıcı SEO başarısı bileşik faiz gibi çalışır: erken başlayan ve tutarlı olan kazanır. Uzun kuyruk ve yerel kelimelerde 1-3 ayda ilk sonuçlar alınırken, rekabetçi kelimelerde ilk sayfa içerik ve backlink birikimiyle gelir. Gerçekçi bir takvimle ve şeffaf çalışıyoruz.' },
      { h2: 'Üç Ayaklı SEO', body: 'Teknik SEO (hız, mobil uyum, indekslenebilirlik, yapısal veri), içerik/on-page SEO (doğru anahtar kelime ve kullanıcı niyetine uygun içerik) ve off-page SEO (backlink, marka otoritesi). Üçünü birlikte kurmadan kalıcı sonuç alınmaz.' },
      { h2: 'Yerel SEO ile Ankara’da Öne Çıkın', body: 'Ankara’daki müşteriler "yakınımdaki" ve şehir bazlı aramalar yapar. Google İşletme Profili optimizasyonu, NAP tutarlılığı ve şehir bazlı içerikle yerel aramalarda öne çıkmanızı sağlıyoruz.' },
    ],
    bullets: {
      title: 'Ankara SEO hizmetimizin kapsamı',
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
      { question: 'Ankara’da SEO ne kadar sürede sonuç verir?', answer: 'Uzun kuyruk ve yerel kelimelerde 1-3 ay, rekabetçi ana kelimelerde 6-12 ay tipik bir aralıktır. SEO bileşik büyüyen bir yatırımdır; erken başlamak ve tutarlılık en belirleyici iki faktördür.' },
      { question: 'SEO garantisi veriyor musunuz?', answer: 'Hiçbir dürüst SEO ajansı "1 numara garantisi" veremez; çünkü sıralama Google’ın algoritmasına bağlıdır. Bizim garantimiz şeffaf çalışma, doğru yöntem ve ölçülebilir ilerlemedir.' },
      { question: 'Mevcut sitem için SEO yapılabilir mi?', answer: 'Evet. Önce teknik SEO denetimi yapıp mevcut sorunları tespit ediyor, sonra içerik ve otorite çalışmasıyla sıralamanızı kademeli olarak yükseltiyoruz.' },
    ],
  },
  {
    citySlug: 'ankara',
    city: 'Ankara',
    slug: 'mobil-uygulama',
    title: 'Ankara Mobil Uygulama Geliştirme',
    metaTitle: 'Ankara Mobil Uygulama Geliştirme — iOS, Android | BERACORE',
    metaDescription:
      'Ankara’da mobil uygulama geliştirme: iOS, Android ve cross-platform. Fikirden mağaza yayınına uçtan uca mobil çözümler için BERACORE.',
    keyword: 'ankara mobil uygulama',
    intro: 'Ankara’da bir mobil uygulama fikrinizi hayata geçirmek mi istiyorsunuz? İster bir girişim, ister kurumsal bir iç uygulama olsun; BERACORE iOS, Android ve cross-platform uygulamaları fikirden mağaza yayınına kadar uçtan uca geliştirir. Hızlı, kullanıcı dostu ve büyümeye hazır uygulamalar.',
    sections: [
      { h2: 'Doğru Yaklaşım: Önce Çekirdek', body: 'En başarılı uygulamalar her özelliği ilk günden içeren değil, doğru çekirdekle çıkıp kullanıcı geri bildirimiyle büyüyenlerdir. MVP yaklaşımıyla önce değeri kanıtlıyor, sonra veriye dayanarak geliştiriyoruz. Bu hem riski hem maliyeti düşürür.' },
      { h2: 'Native mi, Cross-Platform mı?', body: 'Yüksek performans ve platforma özel deneyim gerekiyorsa native (Swift/Kotlin); bütçe ve süre önemliyse tek kod tabanıyla iki platforma çıkan cross-platform (React Native, Flutter) uygundur. Doğru seçimi ihtiyacınıza göre birlikte belirliyoruz.' },
      { h2: 'Uçtan Uca Süreç', body: 'Keşif ve gereksinim analizi, UI/UX tasarımı, geliştirme, test, App Store/Google Play yayını ve yayın sonrası bakım. Uygulamanızı yalnızca geliştirip bırakmıyor, büyümesi için yanınızda kalıyoruz.' },
    ],
    bullets: {
      title: 'Ankara mobil uygulama hizmetlerimiz',
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
      { question: 'Ankara’da mobil uygulama geliştirme maliyeti nedir?', answer: 'Maliyet; platform (iOS/Android/ikisi), native mi cross-platform mu, özellik sayısı ve backend ihtiyacına göre değişir. MVP yaklaşımıyla çekirdek özelliklerle başlayıp bütçeyi kontrol altında tutmak mümkündür. Net rakam keşif görüşmesinde belirlenir.' },
      { question: 'Hem iOS hem Android yapmalı mıyım?', answer: 'Şart değil. Hedef kitlenizin ağırlıklı kullandığı platformla başlayabilirsiniz. Ancak cross-platform geliştirme, tek kod tabanıyla iki platforma birden çıkmayı ekonomik hale getirir.' },
      { question: 'Uygulamayı mağazalarda yayınlıyor musunuz?', answer: 'Evet. App Store ve Google Play yayın süreçlerini uçtan uca yönetiyor, gerekli hesap ve sertifika ayarlarında size yardımcı oluyoruz. Yayın sonrası güncelleme desteği de sağlıyoruz.' },
    ],
  },

  // ===================== İZMİR =====================
  // Kimlik: Ege'nin ticaret ve ihracat merkezi — liman, serbest bölge, tarım-gıda,
  // tekstil-konfeksiyon, turizm; üretici/ihracatçı KOBİ ve uluslararası pazar odağı.
  {
    citySlug: 'izmir',
    city: 'İzmir',
    slug: 'web-tasarim',
    title: 'İzmir Web Tasarım',
    metaTitle: 'İzmir Web Tasarım Ajansı — Kurumsal Site | BERACORE',
    metaDescription:
      'İzmir’de kurumsal web tasarım: hızlı, mobil uyumlu, SEO altyapılı ve çok dilli siteler. Ege’nin üretici ve ihracatçı markalarına özel stüdyo BERACORE.',
    keyword: 'izmir web tasarım',
    intro: 'İzmir’de üreten, satan ve giderek daha çok ihracata açılan markaların web sitesinden beklentisi net: hem yerel müşteriye hem de yurt dışındaki alıcıya güven vermek. BERACORE, İzmir’deki firmalar için hızlı, mobil uyumlu, gerektiğinde çok dilli ve SEO altyapısı baştan kurulmuş kurumsal web siteleri tasarlar — şablon değil, markaya özel.',
    sections: [
      { h2: 'İhracata Açık Bir Şehirde Web Sitesi', body: 'İzmir’in ekonomisi ticaret, üretim ve ihracatla şekillenir; müşterinizin bir kısmı yurt dışındadır. Bu yüzden web siteniz yalnızca yerel değil, uluslararası alıcıya da hitap edebilmeli: çok dilli yapı, hızlı yükleme ve güven veren bir kurumsal görünüm rekabette fark yaratır.' },
      { h2: 'Nasıl Çalışıyoruz?', body: 'Süreci keşif görüşmesiyle başlatıyoruz: hedeflerinizi, pazarınızı ve rakiplerinizi dinliyoruz. Ardından markanıza özel UI/UX, hızlı ve güvenli bir altyapı ve SEO uyumlu bir yapı kuruyoruz. Teslimde eğitim veriyor, sonrasında bakım ve geliştirme desteği sunuyoruz.' },
      { h2: 'Sadece Güzel Değil, İş Yapan Site', body: 'İyi bir kurumsal site estetiğin ötesinde ölçülebilir sonuç üretir: hızlı açılır, her cihazda kusursuz çalışır, Google’da bulunur ve ziyaretçiyi teklife yönlendirir. Siteyi bir vitrin değil, en çalışkan satış temsilciniz olarak kurguluyoruz.' },
    ],
    bullets: {
      title: 'İzmir web tasarım hizmetimize dahil olanlar',
      items: [
        'Markaya özel UI/UX tasarımı (şablon değil)',
        'Mobil öncelikli, tüm cihazlarda kusursuz görünüm',
        'Çok dilli yapı seçeneği (ihracat için)',
        'Hızlı ve güvenli teknik altyapı (Core Web Vitals uyumlu)',
        'SEO altyapısı ve yapısal veri en baştan',
        'Teslim sonrası bakım ve geliştirme desteği',
      ],
    },
    serviceHref: '/hizmetler/design/web-tasarim',
    serviceLabel: 'Web Tasarım hizmetimizin detayları',
    blogHref: '/blog/kurumsal-web-sitesi-yaptirma-rehberi',
    blogLabel: 'Kurumsal Web Sitesi Yaptırma Rehberi',
    faq: [
      { question: 'İzmir’de web tasarım fiyatları ne kadar?', answer: 'Fiyat; sayfa sayısı, özel tasarım derinliği, çok dillilik ve entegrasyonlara göre değişir. Net fiyat, ücretsiz keşif görüşmesi ve ihtiyaç analizinden sonra belirlenir.' },
      { question: 'Çok dilli (ihracat için) site yapıyor musunuz?', answer: 'Evet. İhracata yönelik markalar için çok dilli, doğru dil yönlendirmesi ve uluslararası SEO altyapısına sahip siteler kuruyoruz; yurt dışı alıcıya da hitap eden bir yapı sağlıyoruz.' },
      { question: 'Mevcut siteme yeni tasarım yapabilir misiniz?', answer: 'Evet. Mevcut sitenizi, SEO değerinizi koruyarak (301 yönlendirmeler ve yapı bütünlüğüyle) modern, hızlı ve dönüşüm odaklı bir tasarıma taşıyabiliriz.' },
    ],
  },
  {
    citySlug: 'izmir',
    city: 'İzmir',
    slug: 'yazilim',
    title: 'İzmir Yazılım Firması',
    metaTitle: 'İzmir Yazılım Firması — Özel Yazılım Geliştirme | BERACORE',
    metaDescription:
      'İzmir’de özel yazılım geliştirme: web, mobil, API ve kurumsal sistemler. Ege’nin üretici ve ihracatçı firmalarına özel ölçeklenebilir çözümler — BERACORE.',
    keyword: 'izmir yazılım firması',
    intro: 'İzmir; üretim, ticaret ve ihracatın yoğunlaştığı, iş süreçlerini dijitalleştirmeye ihtiyaç duyan firmalarla dolu bir şehir. İşletmenize özel bir yazılıma ihtiyacınız varsa BERACORE; web uygulamaları, mobil uygulamalar, API entegrasyonları ve kurumsal sistemler geliştirir. Hazır kalıplar değil, süreçlerinize göre tasarlanan ölçeklenebilir çözümler.',
    sections: [
      { h2: 'Üretim ve Ticareti Dijitalleştirmek', body: 'İzmir’deki firmaların çoğu; stok, sipariş, üretim ve ihracat süreçlerini hâlâ dağınık araçlarla yönetiyor. Doğru yazılım bu süreçleri tek bir sistemde birleştirir, hatayı azaltır ve büyümenin önünü açar. İşinizi anlayan, şeffaf çalışan bir ortakla bu dönüşüm çok daha güvenli ilerler.' },
      { h2: 'Neler Geliştiriyoruz?', body: 'Kurumsal web uygulamaları ve yönetim panelleri, iOS/Android mobil uygulamalar, sistemler arası API entegrasyonları, e-ticaret altyapıları ve yapay zeka destekli çözümler. Modern, sürdürülebilir ve büyümeye uygun teknolojilerle çalışıyoruz.' },
      { h2: 'Çevik ve Şeffaf Süreç', body: 'Projeleri sprint’ler halinde, her aşamada geri bildirim alarak yürütüyoruz. MVP yaklaşımıyla erken değer üretiyor, yanlış yöne aylarca ilerleme riskini ortadan kaldırıyoruz.' },
    ],
    bullets: {
      title: 'İzmir yazılım geliştirme hizmetlerimiz',
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
      { question: 'İzmir’deki yazılım firmaları arasında sizi ne ayırıyor?', answer: 'Yazılımı tasarım, SEO ve pazarlamayla bütünsel ele alıyoruz. Yalnızca kod yazmıyor; işinizi büyütecek ölçeklenebilir ve sürdürülebilir çözümler kuruyoruz. Şeffaf süreç ve teslim sonrası destek standartımızdır.' },
      { question: 'Özel yazılım ne kadar sürede teslim edilir?', answer: 'Kapsama bağlıdır. MVP yaklaşımıyla birkaç ayda kullanılabilir bir ürün çıkarılabilir; kapsamlı sistemler daha uzun sürebilir. Çevik geliştirmeyle erken ve sürekli değer üretiriz.' },
      { question: 'Mevcut sistemimi geliştirebilir misiniz?', answer: 'Evet. Mevcut yazılımınızı devralıp geliştirebilir, yeni modüller ekleyebilir veya sistemler arası entegrasyonlar kurabiliriz. Önce mevcut yapının teknik değerlendirmesini yapıyoruz.' },
    ],
  },
  {
    citySlug: 'izmir',
    city: 'İzmir',
    slug: 'e-ticaret',
    title: 'İzmir E-Ticaret Çözümleri',
    metaTitle: 'İzmir E-Ticaret Çözümleri — Site, Entegrasyon | BERACORE',
    metaDescription:
      'İzmir’de e-ticaret sitesi kurulumu, pazaryeri entegrasyonu ve ödeme sistemleri. Üretici ve ihracatçı markalar için satan e-ticaret altyapıları — BERACORE.',
    keyword: 'izmir e-ticaret',
    intro: 'İzmir’de üreten markalar için e-ticaret, aracıyı aradan çıkarıp doğrudan tüketiciye ulaşmanın en güçlü yolu. İster yerel pazara, ister yurt dışına satın; BERACORE satışa hazır e-ticaret siteleri, Trendyol/Hepsiburada/N11/Amazon entegrasyonları ve güvenli ödeme altyapıları kurar. Sadece site değil, satan bir sistem.',
    sections: [
      { h2: 'Üreticiden Tüketiciye Doğrudan Satış', body: 'Ege’nin üretici markaları için e-ticaret; ürünü aracısız, daha yüksek kârla ve kendi markanızla satmanın kapısıdır. Doğru kurulmuş bir mağaza, ürününüzü yalnızca sergilemez; hızlı, güvenli ve dönüşüm odaklı bir satış deneyimi sunar.' },
      { h2: 'Çok Kanallı Satış ve Entegrasyon', body: 'Kendi siteniz komisyonsuz satış ve müşteri verisine sahiplik sağlarken, pazaryerleri hacim getirir. İkisini tek bir stok havuzundan besleyen bir entegrasyonla stok tutarsızlığını, aşırı satışı ve elle yönetim yükünü ortadan kaldırıyoruz.' },
      { h2: 'Güvenli ve Dönüşüm Odaklı Ödeme', body: 'Müşteriler en çok ödeme adımında vazgeçer. Sanal POS, taksit, 3D Secure ve sürtünmesiz bir ödeme akışıyla sepet terk oranını düşürüyor, mevcut trafiğinizden daha fazla satış çıkarıyoruz.' },
    ],
    bullets: {
      title: 'İzmir e-ticaret hizmetlerimiz',
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
      { question: 'İzmir’de e-ticaret sitesi kurmak ne kadar sürer?', answer: 'Hazır altyapıyla birkaç günde temel bir mağaza açılabilir; markaya özel tasarım ve entegrasyonlar içeren kapsamlı bir e-ticaret sitesi birkaç haftadan birkaç aya kadar sürebilir. Kapsam, keşif görüşmesinde netleşir.' },
      { question: 'Pazaryerlerine de entegre eder misiniz?', answer: 'Evet. Kendi sitenizi ve Trendyol, Hepsiburada, N11, Amazon gibi pazaryerlerini aynı stok havuzundan yöneten entegrasyonlar kuruyoruz; böylece stok her kanalda anında güncellenir.' },
      { question: 'Mevcut e-ticaret sitemi taşıyabilir misiniz?', answer: 'Evet. Mevcut ürün, müşteri ve sipariş verilerinizi koruyarak (migration) ve SEO değerinizi kaybetmeden yeni bir altyapıya taşıyabiliriz.' },
    ],
  },
  {
    citySlug: 'izmir',
    city: 'İzmir',
    slug: 'dijital-pazarlama',
    title: 'İzmir Dijital Pazarlama Ajansı',
    metaTitle: 'İzmir Dijital Pazarlama Ajansı — SEO, Reklam | BERACORE',
    metaDescription:
      'İzmir’de dijital pazarlama: SEO, Google & Meta reklamları, sosyal medya ve içerik. Ölçülebilir büyüme için Ege’nin dijital ajansı BERACORE.',
    keyword: 'izmir dijital pazarlama ajansı',
    intro: 'İzmir’de işletmenizi online büyütecek bir dijital pazarlama ortağı mı arıyorsunuz? Ege’nin dinamik ticaret ortamında öne çıkmak; doğru kitleye, doğru mesajla ve ölçülebilir biçimde ulaşmayı gerektirir. BERACORE; SEO, Google ve Meta reklamları, sosyal medya yönetimi ve içerik pazarlamayı tek bir strateji içinde birleştirir. Gösteriş değil, sonuç odaklı çalışıyoruz.',
    sections: [
      { h2: 'Ölçülebilir Büyüme', body: 'Dijital pazarlamada asıl mesele harcanan bütçe değil, o bütçenin getirisidir. Her kampanyayı dönüşüm takibiyle kuruyor, hangi kanalın gerçekten müşteri getirdiğini ölçüyor ve bütçeyi kazanan kanallara yönlendiriyoruz.' },
      { h2: 'Yerel ve İhracat Odaklı Pazarlama', body: 'İzmir’deki markaların bir kısmı yerel pazara, bir kısmı yurt dışına satar. Her iki hedef için de doğru kanal ve mesaj farklıdır; yerelde bölgesel görünürlük, ihracatta uluslararası kitleye ulaşan kampanyalar kurgularız.' },
      { h2: 'Bütünsel Yaklaşım', body: 'SEO uzun vadeli kalıcı trafik, reklam anlık görünürlük, sosyal medya marka gücü, içerik ise otorite inşa eder. Bu kanalları ayrı ayrı değil, birbirini besleyen tek bir strateji içinde yönetiyoruz.' },
    ],
    bullets: {
      title: 'İzmir dijital pazarlama hizmetlerimiz',
      items: [
        'SEO — arama motorlarında kalıcı üst sıralar',
        'Google & Meta (Instagram/Facebook) reklam yönetimi',
        'Sosyal medya yönetimi ve içerik üretimi',
        'İçerik pazarlama ve blog stratejisi',
        'Dönüşüm takibi ve performans raporlama',
        'Yerel ve uluslararası SEO görünürlüğü',
      ],
    },
    serviceHref: '/hizmetler/marketing/seo',
    serviceLabel: 'Dijital Pazarlama hizmetlerimiz',
    blogHref: '/blog/seo-nedir-google-ilk-sayfaya-cikma',
    blogLabel: 'SEO Nedir, Google’da İlk Sayfaya Nasıl Çıkılır?',
    faq: [
      { question: 'Dijital pazarlamadan ne kadar sürede sonuç alırım?', answer: 'Reklam anlık trafik getirir; SEO ve içerik ise 3-6 ayda anlamlı sonuç vermeye başlayıp zamanla bileşik büyür. İdeal strateji, hızlı sonuç için reklamı kalıcı büyüme için SEO/içerikle birlikte yürütmektir.' },
      { question: 'İhracata yönelik dijital pazarlama yapıyor musunuz?', answer: 'Evet. Yurt dışı hedefli markalar için uluslararası SEO, çok dilli içerik ve hedef ülkeye yönelik reklam kampanyaları kurguluyoruz; doğru kitleye doğru dilde ulaşmayı sağlıyoruz.' },
      { question: 'Raporlama nasıl oluyor?', answer: 'Şeffaf çalışıyoruz. Dönüşüm takibi kurup hangi kanalın ne kadar müşteri ve gelir getirdiğini düzenli raporlarla paylaşıyoruz; kararları veriye dayanarak birlikte alıyoruz.' },
    ],
  },
  {
    citySlug: 'izmir',
    city: 'İzmir',
    slug: 'seo',
    title: 'İzmir SEO Ajansı',
    metaTitle: 'İzmir SEO Ajansı — Google’da İlk Sayfa | BERACORE',
    metaDescription:
      'İzmir’de SEO hizmeti: teknik SEO, içerik, yerel SEO ve backlink. Google’da kalıcı üst sıralar için Ege’nin SEO ajansı BERACORE.',
    keyword: 'izmir seo ajansı',
    intro: 'İzmir’de Google’da üst sıralara çıkmak ve oradan kalıcı organik trafik almak mı istiyorsunuz? BERACORE, SEO’yu teknik altyapı, içerik ve otorite inşasını birleştiren bütünsel bir strateji olarak yürütür. Kısa vadeli hileler değil, sürdürülebilir sıralamalar.',
    sections: [
      { h2: 'SEO Bir Maraton, Sprint Değil', body: 'Kalıcı SEO başarısı bileşik faiz gibi çalışır: erken başlayan ve tutarlı olan kazanır. Uzun kuyruk ve yerel kelimelerde 1-3 ayda ilk sonuçlar alınırken, rekabetçi kelimelerde ilk sayfa içerik ve backlink birikimiyle gelir. Gerçekçi bir takvimle ve şeffaf çalışıyoruz.' },
      { h2: 'Üç Ayaklı SEO', body: 'Teknik SEO (hız, mobil uyum, indekslenebilirlik, yapısal veri), içerik/on-page SEO (doğru anahtar kelime ve kullanıcı niyetine uygun içerik) ve off-page SEO (backlink, marka otoritesi). Üçünü birlikte kurmadan kalıcı sonuç alınmaz.' },
      { h2: 'Yerel ve Uluslararası SEO', body: 'İzmir’deki müşteriler şehir bazlı ararken, ihracatçı markaların hedefi yurt dışıdır. Yerel SEO ile bölgenizde öne çıkarken, uluslararası SEO ile hedef ülkelerde de görünür olmanızı sağlıyoruz.' },
    ],
    bullets: {
      title: 'İzmir SEO hizmetimizin kapsamı',
      items: [
        'Teknik SEO denetimi ve iyileştirmesi',
        'Anahtar kelime ve kullanıcı niyeti analizi',
        'İçerik/on-page SEO ve blog stratejisi',
        'Yerel SEO ve Google İşletme Profili optimizasyonu',
        'Uluslararası SEO (ihracat hedefli markalar için)',
        'Backlink, otorite inşası ve düzenli raporlama',
      ],
    },
    serviceHref: '/hizmetler/marketing/seo',
    serviceLabel: 'SEO hizmetimizin detayları',
    blogHref: '/blog/seo-ajansi-nasil-secilir',
    blogLabel: 'SEO Ajansı Nasıl Seçilir?',
    faq: [
      { question: 'İzmir’de SEO ne kadar sürede sonuç verir?', answer: 'Uzun kuyruk ve yerel kelimelerde 1-3 ay, rekabetçi ana kelimelerde 6-12 ay tipik bir aralıktır. SEO bileşik büyüyen bir yatırımdır; erken başlamak ve tutarlılık en belirleyici iki faktördür.' },
      { question: 'SEO garantisi veriyor musunuz?', answer: 'Hiçbir dürüst SEO ajansı "1 numara garantisi" veremez; çünkü sıralama Google’ın algoritmasına bağlıdır. Bizim garantimiz şeffaf çalışma, doğru yöntem ve ölçülebilir ilerlemedir.' },
      { question: 'Mevcut sitem için SEO yapılabilir mi?', answer: 'Evet. Önce teknik SEO denetimi yapıp mevcut sorunları tespit ediyor, sonra içerik ve otorite çalışmasıyla sıralamanızı kademeli olarak yükseltiyoruz.' },
    ],
  },
  {
    citySlug: 'izmir',
    city: 'İzmir',
    slug: 'mobil-uygulama',
    title: 'İzmir Mobil Uygulama Geliştirme',
    metaTitle: 'İzmir Mobil Uygulama Geliştirme — iOS, Android | BERACORE',
    metaDescription:
      'İzmir’de mobil uygulama geliştirme: iOS, Android ve cross-platform. Fikirden mağaza yayınına uçtan uca mobil çözümler için BERACORE.',
    keyword: 'izmir mobil uygulama',
    intro: 'İzmir’de bir mobil uygulama fikrinizi hayata geçirmek mi istiyorsunuz? İster bir girişim, ister markanızın müşteriye uzanan bir kanalı olsun; BERACORE iOS, Android ve cross-platform uygulamaları fikirden mağaza yayınına kadar uçtan uca geliştirir. Hızlı, kullanıcı dostu ve büyümeye hazır uygulamalar.',
    sections: [
      { h2: 'Doğru Yaklaşım: Önce Çekirdek', body: 'En başarılı uygulamalar her özelliği ilk günden içeren değil, doğru çekirdekle çıkıp kullanıcı geri bildirimiyle büyüyenlerdir. MVP yaklaşımıyla önce değeri kanıtlıyor, sonra veriye dayanarak geliştiriyoruz. Bu hem riski hem maliyeti düşürür.' },
      { h2: 'Native mi, Cross-Platform mı?', body: 'Yüksek performans ve platforma özel deneyim gerekiyorsa native (Swift/Kotlin); bütçe ve süre önemliyse tek kod tabanıyla iki platforma çıkan cross-platform (React Native, Flutter) uygundur. Doğru seçimi ihtiyacınıza göre birlikte belirliyoruz.' },
      { h2: 'Uçtan Uca Süreç', body: 'Keşif ve gereksinim analizi, UI/UX tasarımı, geliştirme, test, App Store/Google Play yayını ve yayın sonrası bakım. Uygulamanızı yalnızca geliştirip bırakmıyor, büyümesi için yanınızda kalıyoruz.' },
    ],
    bullets: {
      title: 'İzmir mobil uygulama hizmetlerimiz',
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
      { question: 'İzmir’de mobil uygulama geliştirme maliyeti nedir?', answer: 'Maliyet; platform (iOS/Android/ikisi), native mi cross-platform mu, özellik sayısı ve backend ihtiyacına göre değişir. MVP yaklaşımıyla çekirdek özelliklerle başlayıp bütçeyi kontrol altında tutmak mümkündür. Net rakam keşif görüşmesinde belirlenir.' },
      { question: 'Hem iOS hem Android yapmalı mıyım?', answer: 'Şart değil. Hedef kitlenizin ağırlıklı kullandığı platformla başlayabilirsiniz. Ancak cross-platform geliştirme, tek kod tabanıyla iki platforma birden çıkmayı ekonomik hale getirir.' },
      { question: 'Uygulamayı mağazalarda yayınlıyor musunuz?', answer: 'Evet. App Store ve Google Play yayın süreçlerini uçtan uca yönetiyor, gerekli hesap ve sertifika ayarlarında size yardımcı oluyoruz. Yayın sonrası güncelleme desteği de sağlıyoruz.' },
    ],
  },

  // ===================== BURSA =====================
  // Kimlik: sanayi şehri — otomotiv ve yan sanayi, tekstil (ev tekstili/hazır giyim),
  // makine ve mobilya imalatı; güçlü imalatçı KOBİ tabanı, OSB'ler, B2B ve ihracat.
  {
    citySlug: 'bursa',
    city: 'Bursa',
    slug: 'web-tasarim',
    title: 'Bursa Web Tasarım',
    metaTitle: 'Bursa Web Tasarım Ajansı — Kurumsal Site | BERACORE',
    metaDescription:
      'Bursa’da kurumsal web tasarım: hızlı, mobil uyumlu, SEO altyapılı ve güven veren siteler. Sanayi ve imalat firmalarına özel dijital stüdyo BERACORE.',
    keyword: 'bursa web tasarım',
    intro: 'Bursa’da üreten, ihraç eden ve B2B çalışan firmalar için web sitesi bir vitrin değil, iş ortağına verilen ilk güven işaretidir. BERACORE, Bursa’daki sanayi ve imalat markaları için hızlı, mobil uyumlu, ürün ve kapasite anlatımı güçlü, SEO altyapısı baştan kurulmuş kurumsal web siteleri tasarlar — şablon değil, firmaya özel.',
    sections: [
      { h2: 'Sanayi Şehrinde Web Sitesi Neden Kritik?', body: 'Bursa’da alıcıların çoğu başka firmalardır; bir yan sanayi tedarikçisini, tekstil üreticisini ya da makine imalatçısını değerlendirirken önce web sitesine bakarlar. Ürün gamınızı, üretim kapasitenizi ve referanslarınızı net anlatan; hızlı ve profesyonel bir site, ihaleyi ya da siparişi kazanmanın ilk adımıdır.' },
      { h2: 'Nasıl Çalışıyoruz?', body: 'Süreci keşif görüşmesiyle başlatıyoruz: üretiminizi, hedef pazarınızı ve rakiplerinizi dinliyoruz. Ardından markanıza özel UI/UX, hızlı ve güvenli bir altyapı ve SEO uyumlu bir yapı kuruyoruz. Teslimde eğitim veriyor, sonrasında bakım ve geliştirme desteği sunuyoruz.' },
      { h2: 'Sadece Güzel Değil, İş Getiren Site', body: 'İyi bir kurumsal site estetiğin ötesinde ölçülebilir sonuç üretir: hızlı açılır, her cihazda kusursuz çalışır, Google’da bulunur ve potansiyel iş ortağını teklife yönlendirir. Siteyi bir vitrin değil, en çalışkan satış temsilciniz olarak kurguluyoruz.' },
    ],
    bullets: {
      title: 'Bursa web tasarım hizmetimize dahil olanlar',
      items: [
        'Firmaya özel UI/UX tasarımı (şablon değil)',
        'Ürün, kapasite ve referans anlatımı güçlü yapı',
        'Mobil öncelikli, tüm cihazlarda kusursuz görünüm',
        'Hızlı ve güvenli teknik altyapı (Core Web Vitals uyumlu)',
        'SEO altyapısı ve çok dilli yapı seçeneği (ihracat için)',
        'Teslim sonrası bakım ve geliştirme desteği',
      ],
    },
    serviceHref: '/hizmetler/design/web-tasarim',
    serviceLabel: 'Web Tasarım hizmetimizin detayları',
    blogHref: '/blog/kurumsal-web-sitesi-yaptirma-rehberi',
    blogLabel: 'Kurumsal Web Sitesi Yaptırma Rehberi',
    faq: [
      { question: 'Bursa’da web tasarım fiyatları ne kadar?', answer: 'Fiyat; sayfa sayısı, özel tasarım derinliği, ürün kataloğu ve entegrasyonlara göre değişir. Net fiyat, ücretsiz keşif görüşmesi ve ihtiyaç analizinden sonra belirlenir.' },
      { question: 'İhracat için çok dilli site yapıyor musunuz?', answer: 'Evet. İhracat yapan sanayi firmaları için çok dilli, uluslararası SEO altyapısına sahip ve yurt dışı alıcıya hitap eden siteler kuruyoruz.' },
      { question: 'Mevcut sitemi yenileyebilir misiniz?', answer: 'Evet. Mevcut sitenizi, SEO değerinizi koruyarak (301 yönlendirmeler ve yapı bütünlüğüyle) modern, hızlı ve dönüşüm odaklı bir tasarıma taşıyabiliriz.' },
    ],
  },
  {
    citySlug: 'bursa',
    city: 'Bursa',
    slug: 'yazilim',
    title: 'Bursa Yazılım Firması',
    metaTitle: 'Bursa Yazılım Firması — Özel Yazılım Geliştirme | BERACORE',
    metaDescription:
      'Bursa’da özel yazılım geliştirme: web, mobil, API, ERP ve üretim sistemleri. Sanayi ve imalat firmalarına özel ölçeklenebilir çözümler — BERACORE.',
    keyword: 'bursa yazılım firması',
    intro: 'Bursa; otomotiv yan sanayi, tekstil ve makine imalatının kalbi. Üretim, stok ve tedarik süreçleri karmaşıklaştıkça firmalar özel yazılıma yöneliyor. BERACORE; web uygulamaları, mobil uygulamalar, API entegrasyonları, ERP ve üretim takip sistemleri geliştirir. Hazır kalıplar değil, üretim süreçlerinize göre tasarlanan ölçeklenebilir çözümler.',
    sections: [
      { h2: 'Üretimi Yazılımla Yönetmek', body: 'Bursa’daki imalatçıların en büyük ihtiyacı; stok, sipariş, üretim planlama ve tedarik süreçlerini tek bir sistemde görebilmektir. Doğru kurgulanmış bir yazılım, dağınık tabloları ve elle takibi ortadan kaldırır; hatayı azaltır, kapasiteyi görünür kılar ve büyümeyi yönetilebilir hale getirir.' },
      { h2: 'Neler Geliştiriyoruz?', body: 'Kurumsal web uygulamaları ve yönetim panelleri, üretim ve stok takip sistemleri, iOS/Android mobil uygulamalar, sistemler arası API entegrasyonları ve ERP bağlantıları. Modern, sürdürülebilir ve büyümeye uygun teknolojilerle çalışıyoruz.' },
      { h2: 'Çevik ve Şeffaf Süreç', body: 'Projeleri sprint’ler halinde, her aşamada geri bildirim alarak yürütüyoruz. MVP yaklaşımıyla erken değer üretiyor, yanlış yöne aylarca ilerleme riskini ortadan kaldırıyoruz.' },
    ],
    bullets: {
      title: 'Bursa yazılım geliştirme hizmetlerimiz',
      items: [
        'Özel web yazılımı ve kurumsal yönetim panelleri',
        'Üretim, stok ve sipariş takip sistemleri',
        'iOS & Android mobil uygulama geliştirme',
        'API entegrasyonu ve ERP bağlantıları',
        'E-ticaret ve B2B sipariş altyapıları',
        'Teslim sonrası bakım, güncelleme ve destek',
      ],
    },
    serviceHref: '/hizmetler/software/ozel-yazilim',
    serviceLabel: 'Özel Yazılım Geliştirme hizmetimiz',
    blogHref: '/blog/ozel-yazilim-mi-hazir-cozum-mu',
    blogLabel: 'Özel Yazılım mı, Hazır Çözüm mü?',
    faq: [
      { question: 'Bursa’daki yazılım firmaları arasında sizi ne ayırıyor?', answer: 'Yazılımı tasarım, SEO ve pazarlamayla bütünsel ele alıyoruz. Üretim ve B2B süreçlerini anlayarak, yalnızca kod değil işinizi büyütecek ölçeklenebilir çözümler kuruyoruz. Şeffaf süreç ve teslim sonrası destek standartımızdır.' },
      { question: 'Üretim/stok takip sistemi geliştiriyor musunuz?', answer: 'Evet. İmalat firmaları için üretim planlama, stok ve sipariş takibini tek panelde toplayan; mevcut ERP’nizle entegre çalışabilen özel sistemler geliştiriyoruz.' },
      { question: 'Mevcut sistemimi geliştirebilir misiniz?', answer: 'Evet. Mevcut yazılımınızı devralıp geliştirebilir, yeni modüller ekleyebilir veya sistemler arası entegrasyonlar kurabiliriz. Önce mevcut yapının teknik değerlendirmesini yapıyoruz.' },
    ],
  },
  {
    citySlug: 'bursa',
    city: 'Bursa',
    slug: 'e-ticaret',
    title: 'Bursa E-Ticaret Çözümleri',
    metaTitle: 'Bursa E-Ticaret Çözümleri — Site, Entegrasyon | BERACORE',
    metaDescription:
      'Bursa’da e-ticaret sitesi kurulumu, pazaryeri entegrasyonu ve B2B/ödeme sistemleri. Üretici ve toptancı markalar için satan altyapılar — BERACORE.',
    keyword: 'bursa e-ticaret',
    intro: 'Bursa’da üreten ve toptan satan markalar için e-ticaret; hem son tüketiciye hem de bayi/toptan alıcıya aynı anda ulaşmanın yolu. BERACORE; satışa hazır e-ticaret siteleri, B2B sipariş altyapıları, Trendyol/Hepsiburada/N11/Amazon entegrasyonları ve güvenli ödeme çözümleri kurar. Sadece site değil, satan bir sistem.',
    sections: [
      { h2: 'Hem Perakende Hem B2B Satış', body: 'Bursa’nın üretici markaları çoğu zaman aynı anda hem son tüketiciye hem bayiye satar. Doğru kurulmuş bir altyapı; perakende mağazayı ve bayiye özel fiyat/sipariş panelini (B2B) tek sistemde yönetmenizi sağlar. Böylece her iki kanal da aynı stoktan, karışıklık olmadan beslenir.' },
      { h2: 'Çok Kanallı Satış ve Entegrasyon', body: 'Kendi siteniz komisyonsuz satış ve müşteri verisine sahiplik sağlarken, pazaryerleri hacim getirir. İkisini tek bir stok havuzundan besleyen bir entegrasyonla stok tutarsızlığını, aşırı satışı ve elle yönetim yükünü ortadan kaldırıyoruz.' },
      { h2: 'Güvenli ve Dönüşüm Odaklı Ödeme', body: 'Müşteriler en çok ödeme adımında vazgeçer. Sanal POS, taksit, 3D Secure ve sürtünmesiz bir ödeme akışıyla sepet terk oranını düşürüyor, mevcut trafiğinizden daha fazla satış çıkarıyoruz.' },
    ],
    bullets: {
      title: 'Bursa e-ticaret hizmetlerimiz',
      items: [
        'Satışa hazır, özel e-ticaret sitesi kurulumu',
        'B2B (bayi/toptan) sipariş ve fiyat paneli',
        'Trendyol, Hepsiburada, N11, Amazon pazaryeri entegrasyonu',
        'Sanal POS ve güvenli ödeme sistemleri (taksit, 3D Secure)',
        'Stok, sipariş ve kargo yönetimi otomasyonu',
        'SEO altyapısı ve pazarlama entegrasyonları',
      ],
    },
    serviceHref: '/hizmetler/ecommerce/e-ticaret-yazilim',
    serviceLabel: 'E-Ticaret Yazılım hizmetimiz',
    blogHref: '/blog/e-ticaret-sitesi-kurma-maliyeti',
    blogLabel: 'E-Ticaret Sitesi Kurma Maliyeti 2026',
    faq: [
      { question: 'Bursa’da e-ticaret sitesi kurmak ne kadar sürer?', answer: 'Hazır altyapıyla birkaç günde temel bir mağaza açılabilir; markaya özel tasarım, B2B paneli ve entegrasyonlar içeren kapsamlı bir e-ticaret sitesi birkaç haftadan birkaç aya kadar sürebilir. Kapsam, keşif görüşmesinde netleşir.' },
      { question: 'B2B (bayi/toptan) satış paneli kuruyor musunuz?', answer: 'Evet. Bayilerinize özel fiyat, sipariş ve cari takip sunan; perakende mağazanızla aynı stoktan beslenen B2B panelleri kuruyoruz.' },
      { question: 'Mevcut e-ticaret sitemi taşıyabilir misiniz?', answer: 'Evet. Mevcut ürün, müşteri ve sipariş verilerinizi koruyarak (migration) ve SEO değerinizi kaybetmeden yeni bir altyapıya taşıyabiliriz.' },
    ],
  },
  {
    citySlug: 'bursa',
    city: 'Bursa',
    slug: 'dijital-pazarlama',
    title: 'Bursa Dijital Pazarlama Ajansı',
    metaTitle: 'Bursa Dijital Pazarlama Ajansı — SEO, Reklam | BERACORE',
    metaDescription:
      'Bursa’da dijital pazarlama: SEO, Google & Meta reklamları, sosyal medya ve içerik. Sanayi ve B2B markaları için ölçülebilir büyüme — BERACORE.',
    keyword: 'bursa dijital pazarlama ajansı',
    intro: 'Bursa’da işletmenizi online büyütecek bir dijital pazarlama ortağı mı arıyorsunuz? Sanayi ve B2B ağırlıklı bir pazarda öne çıkmak; doğru alıcıya, doğru mesajla ve ölçülebilir biçimde ulaşmayı gerektirir. BERACORE; SEO, Google ve Meta reklamları, sosyal medya yönetimi ve içerik pazarlamayı tek bir strateji içinde birleştirir. Gösteriş değil, sonuç odaklı çalışıyoruz.',
    sections: [
      { h2: 'Ölçülebilir Büyüme', body: 'Dijital pazarlamada asıl mesele harcanan bütçe değil, o bütçenin getirisidir. Her kampanyayı dönüşüm takibiyle kuruyor, hangi kanalın gerçekten müşteri getirdiğini ölçüyor ve bütçeyi kazanan kanallara yönlendiriyoruz.' },
      { h2: 'B2B ve İhracat Odaklı Pazarlama', body: 'Bursa’daki birçok firma son tüketiciye değil, başka firmalara ve yurt dışına satar. B2B ve ihracat pazarlamasında kanal, mesaj ve içerik farklıdır; karar alıcı işletmelere ulaşan, güven ve yetkinlik anlatan kampanyalar kurgularız.' },
      { h2: 'Bütünsel Yaklaşım', body: 'SEO uzun vadeli kalıcı trafik, reklam anlık görünürlük, sosyal medya marka gücü, içerik ise otorite inşa eder. Bu kanalları ayrı ayrı değil, birbirini besleyen tek bir strateji içinde yönetiyoruz.' },
    ],
    bullets: {
      title: 'Bursa dijital pazarlama hizmetlerimiz',
      items: [
        'SEO — arama motorlarında kalıcı üst sıralar',
        'Google & Meta (Instagram/Facebook) reklam yönetimi',
        'B2B ve ihracat odaklı kampanya stratejisi',
        'Sosyal medya yönetimi ve içerik üretimi',
        'İçerik pazarlama ve blog stratejisi',
        'Dönüşüm takibi ve performans raporlama',
      ],
    },
    serviceHref: '/hizmetler/marketing/seo',
    serviceLabel: 'Dijital Pazarlama hizmetlerimiz',
    blogHref: '/blog/seo-nedir-google-ilk-sayfaya-cikma',
    blogLabel: 'SEO Nedir, Google’da İlk Sayfaya Nasıl Çıkılır?',
    faq: [
      { question: 'Dijital pazarlamadan ne kadar sürede sonuç alırım?', answer: 'Reklam anlık trafik getirir; SEO ve içerik ise 3-6 ayda anlamlı sonuç vermeye başlayıp zamanla bileşik büyür. İdeal strateji, hızlı sonuç için reklamı kalıcı büyüme için SEO/içerikle birlikte yürütmektir.' },
      { question: 'B2B/sanayi markaları için de işe yarar mı?', answer: 'Evet. B2B’de karar süreci uzundur; bu yüzden güven ve yetkinlik anlatan içerik, doğru anahtar kelimeler ve karar alıcıya ulaşan reklam kombinasyonu kurgularız. Ölçüm ve raporlama her aşamada devam eder.' },
      { question: 'Raporlama nasıl oluyor?', answer: 'Şeffaf çalışıyoruz. Dönüşüm takibi kurup hangi kanalın ne kadar müşteri ve gelir getirdiğini düzenli raporlarla paylaşıyoruz; kararları veriye dayanarak birlikte alıyoruz.' },
    ],
  },
  {
    citySlug: 'bursa',
    city: 'Bursa',
    slug: 'seo',
    title: 'Bursa SEO Ajansı',
    metaTitle: 'Bursa SEO Ajansı — Google’da İlk Sayfa | BERACORE',
    metaDescription:
      'Bursa’da SEO hizmeti: teknik SEO, içerik, yerel SEO ve backlink. Google’da kalıcı üst sıralar için sanayi şehrinin SEO ajansı BERACORE.',
    keyword: 'bursa seo ajansı',
    intro: 'Bursa’da Google’da üst sıralara çıkmak ve oradan kalıcı organik trafik almak mı istiyorsunuz? BERACORE, SEO’yu teknik altyapı, içerik ve otorite inşasını birleştiren bütünsel bir strateji olarak yürütür. Kısa vadeli hileler değil, sürdürülebilir sıralamalar.',
    sections: [
      { h2: 'SEO Bir Maraton, Sprint Değil', body: 'Kalıcı SEO başarısı bileşik faiz gibi çalışır: erken başlayan ve tutarlı olan kazanır. Uzun kuyruk ve yerel kelimelerde 1-3 ayda ilk sonuçlar alınırken, rekabetçi kelimelerde ilk sayfa içerik ve backlink birikimiyle gelir. Gerçekçi bir takvimle ve şeffaf çalışıyoruz.' },
      { h2: 'Üç Ayaklı SEO', body: 'Teknik SEO (hız, mobil uyum, indekslenebilirlik, yapısal veri), içerik/on-page SEO (doğru anahtar kelime ve kullanıcı niyetine uygun içerik) ve off-page SEO (backlink, marka otoritesi). Üçünü birlikte kurmadan kalıcı sonuç alınmaz.' },
      { h2: 'B2B ve Yerel SEO', body: 'Bursa’da bir tedarikçi ararken firmalar Google’a "bursa ... imalatı", "... yan sanayi" gibi aramalar yapar. B2B niyetli bu aramalarda ve şehir bazlı yerel sonuçlarda öne çıkmanız için içerik ve teknik altyapıyı birlikte kuruyoruz.' },
    ],
    bullets: {
      title: 'Bursa SEO hizmetimizin kapsamı',
      items: [
        'Teknik SEO denetimi ve iyileştirmesi',
        'Anahtar kelime ve kullanıcı niyeti analizi (B2B dahil)',
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
      { question: 'Bursa’da SEO ne kadar sürede sonuç verir?', answer: 'Uzun kuyruk ve yerel kelimelerde 1-3 ay, rekabetçi ana kelimelerde 6-12 ay tipik bir aralıktır. SEO bileşik büyüyen bir yatırımdır; erken başlamak ve tutarlılık en belirleyici iki faktördür.' },
      { question: 'SEO garantisi veriyor musunuz?', answer: 'Hiçbir dürüst SEO ajansı "1 numara garantisi" veremez; çünkü sıralama Google’ın algoritmasına bağlıdır. Bizim garantimiz şeffaf çalışma, doğru yöntem ve ölçülebilir ilerlemedir.' },
      { question: 'Mevcut sitem için SEO yapılabilir mi?', answer: 'Evet. Önce teknik SEO denetimi yapıp mevcut sorunları tespit ediyor, sonra içerik ve otorite çalışmasıyla sıralamanızı kademeli olarak yükseltiyoruz.' },
    ],
  },
  {
    citySlug: 'bursa',
    city: 'Bursa',
    slug: 'mobil-uygulama',
    title: 'Bursa Mobil Uygulama Geliştirme',
    metaTitle: 'Bursa Mobil Uygulama Geliştirme — iOS, Android | BERACORE',
    metaDescription:
      'Bursa’da mobil uygulama geliştirme: iOS, Android ve cross-platform. Fikirden mağaza yayınına uçtan uca mobil çözümler için BERACORE.',
    keyword: 'bursa mobil uygulama',
    intro: 'Bursa’da bir mobil uygulama fikrinizi hayata geçirmek mi istiyorsunuz? İster bir girişim, ister bayi ve saha ekibiniz için bir kurumsal uygulama olsun; BERACORE iOS, Android ve cross-platform uygulamaları fikirden mağaza yayınına kadar uçtan uca geliştirir. Hızlı, kullanıcı dostu ve büyümeye hazır uygulamalar.',
    sections: [
      { h2: 'Doğru Yaklaşım: Önce Çekirdek', body: 'En başarılı uygulamalar her özelliği ilk günden içeren değil, doğru çekirdekle çıkıp kullanıcı geri bildirimiyle büyüyenlerdir. MVP yaklaşımıyla önce değeri kanıtlıyor, sonra veriye dayanarak geliştiriyoruz. Bu hem riski hem maliyeti düşürür.' },
      { h2: 'Native mi, Cross-Platform mı?', body: 'Yüksek performans ve platforma özel deneyim gerekiyorsa native (Swift/Kotlin); bütçe ve süre önemliyse tek kod tabanıyla iki platforma çıkan cross-platform (React Native, Flutter) uygundur. Doğru seçimi ihtiyacınıza göre birlikte belirliyoruz.' },
      { h2: 'Uçtan Uca Süreç', body: 'Keşif ve gereksinim analizi, UI/UX tasarımı, geliştirme, test, App Store/Google Play yayını ve yayın sonrası bakım. Uygulamanızı yalnızca geliştirip bırakmıyor, büyümesi için yanınızda kalıyoruz.' },
    ],
    bullets: {
      title: 'Bursa mobil uygulama hizmetlerimiz',
      items: [
        'iOS ve Android native uygulama geliştirme',
        'Cross-platform (React Native, Flutter) geliştirme',
        'Bayi/saha ekibi için kurumsal uygulamalar',
        'UI/UX tasarımı ve backend/API altyapısı',
        'App Store & Google Play yayın süreci',
        'Yayın sonrası bakım, güncelleme ve destek',
      ],
    },
    serviceHref: '/hizmetler/software/mobil-uygulama',
    serviceLabel: 'Mobil Uygulama Geliştirme hizmetimiz',
    blogHref: '/blog/mobil-uygulama-gelistirme-maliyeti',
    blogLabel: 'Mobil Uygulama Geliştirme Maliyeti',
    faq: [
      { question: 'Bursa’da mobil uygulama geliştirme maliyeti nedir?', answer: 'Maliyet; platform (iOS/Android/ikisi), native mi cross-platform mu, özellik sayısı ve backend ihtiyacına göre değişir. MVP yaklaşımıyla çekirdek özelliklerle başlayıp bütçeyi kontrol altında tutmak mümkündür. Net rakam keşif görüşmesinde belirlenir.' },
      { question: 'Hem iOS hem Android yapmalı mıyım?', answer: 'Şart değil. Hedef kitlenizin ağırlıklı kullandığı platformla başlayabilirsiniz. Ancak cross-platform geliştirme, tek kod tabanıyla iki platforma birden çıkmayı ekonomik hale getirir.' },
      { question: 'Uygulamayı mağazalarda yayınlıyor musunuz?', answer: 'Evet. App Store ve Google Play yayın süreçlerini uçtan uca yönetiyor, gerekli hesap ve sertifika ayarlarında size yardımcı oluyoruz. Yayın sonrası güncelleme desteği de sağlıyoruz.' },
    ],
  },
];

// NOT: Şehir listesi ayrı bir sabitte TUTULMAZ (eskiden kullanılmayan bir
// `CITY_SLUGS` sabiti vardı, kaldırıldı). Rotalar `generateStaticParams` içinde
// doğrudan `cityPages`'ten türetilir; bilinmeyen şehir getCityPage → notFound ile
// 404 döner. Yeni şehir eklemek için sadece bu diziye CityPage eklemek yeterlidir.

export function getCityPage(citySlug: string, slug: string): CityPage | undefined {
  return cityPages.find((p) => p.citySlug === citySlug && p.slug === slug);
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
