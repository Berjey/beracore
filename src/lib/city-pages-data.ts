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
 * Son değişiklik: 2 Ağu 2026 — 24 sayfanın tamamına şehir+hizmet özgü 2 bölüm ve 2 SSS eklendi.
 * Şehir metinlerinde anlamlı bir değişiklik yapınca BURAYI güncelleyin.
 */
export const CITY_CONTENT_UPDATED = '2026-08-02';

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
      // ek-bolum
      { h2: 'İstanbul’da Rekabet Sadece Fiyatta Değil', body: 'İstanbul, aynı hizmeti veren yüzlerce firmanın aynı anahtar kelimelerde yarıştığı bir pazar. Bu yoğunlukta ziyaretçi, sitenize girdikten sonraki ilk saniyelerde kalıp kalmayacağına karar veriyor. Yavaş açılan, mobilde bozulan veya ne yaptığınızı ilk ekranda anlatamayan bir site, reklamla getirdiğiniz trafiği de boşa harcar. İstanbul’daki müşteri profili genellikle karşılaştırma yaparak ilerler: üç dört siteyi yan yana açar, hangisi daha net ve daha güvenilir görünüyorsa ondan teklif ister. Bu yüzden İstanbul için tasarladığımız sitelerde önceliğimiz süsleme değil, netlik ve hızdır.' },
      // ek-bolum
      { h2: 'Fiyatı Belirleyen Gerçek Faktörler', body: 'Web tasarım tekliflerinin birbirinden çok farklı çıkmasının sebebi genelde kapsam farkıdır. Fiyatı belirleyen başlıca kalemler şunlardır: sayfa sayısı ve içerik hacmi, tasarımın şablondan mı sıfırdan mı üretileceği, çok dilli yapı ihtiyacı, form ve entegrasyon sayısı, içerik yönetim ihtiyacı ve teslim sonrası bakım kapsamı. Teklifleri karşılaştırırken toplam rakamdan önce bu kalemlerin listelenip listelenmediğine bakın. İçeriğin kim tarafından yazılacağı da sıkça atlanan ve süreci uzatan bir maddedir; baştan netleştirilmesi hem bütçeyi hem takvimi korur.' },
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
      { question: 'İstanbul’da web tasarım için ajans seçerken nelere dikkat etmeliyim?', answer: 'Portfolyodaki sitelerin bugün hâlâ yayında ve hızlı olup olmadığına bakın — teslim edildiği gün güzel görünen ama iki yıl sonra bakımsız kalan çok sayıda proje var. Kaynak kodun ve alan adının size devredilip devredilmeyeceğini yazılı olarak sorun. Ayrıca teslim sonrası desteğin kapsamı ve süresi sözleşmede yer almalı.' },
      { question: 'Sitem yayına girdikten sonra kendim güncelleyebilir miyim?', answer: 'Evet. Sitelerinizi, teknik bilgi gerektirmeden metin ve görsel güncellemesi yapabileceğiniz bir yönetim yapısıyla teslim ediyoruz. Teslimde kısa bir kullanım eğitimi veriyoruz; yapısal değişiklikler için de destek sağlıyoruz.' },
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
      // ek-bolum
      { h2: 'İstanbul’da Yazılım İhtiyacı Nereden Doğuyor', body: 'İstanbul’daki işletmelerde özel yazılım ihtiyacı genellikle büyümenin bir yan etkisi olarak ortaya çıkar: sipariş sayısı artar, ekip büyür ve Excel tablolarıyla yürüyen süreç kendi ağırlığı altında çatlamaya başlar. Farklı departmanların ayrı ayrı tuttuğu kayıtlar birbirini tutmaz, aynı veri birkaç kez elle girilir, hata oranı yükselir. Bu noktada asıl ihtiyaç yeni bir program değil, mevcut süreçlerin tek bir yerde ve tutarlı biçimde akmasıdır. Projeye başlamadan önce hangi verinin nerede üretildiğini ve kimin kullandığını çıkarmak, yazılan koddan daha belirleyicidir.' },
      // ek-bolum
      { h2: 'Ekip Modeli ve Bütçe Planlaması', body: 'İstanbul’da yazılım projeleri için üç yaygın model vardır: sabit kapsamlı proje bütçesi, aylık ekip tahsisi ve hibrit yaklaşım. Kapsamı net, sınırları belli işler için sabit bütçe öngörülebilirlik sağlar. Kapsamın süreç içinde şekilleneceği ürün geliştirmelerinde ise aylık model daha gerçekçidir; sabit bütçeyle başlayan böyle projeler genellikle ek taleplerle yeniden pazarlığa döner. Hangi modeli seçerseniz seçin, bakım ve güncelleme maliyetini ilk yıl bütçesine dahil edin — yazılımın ömür boyu maliyetinin önemli bir kısmı teslimden sonra oluşur.' },
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
      { question: 'Yazılım projesine başlamadan önce ne hazırlamalıyız?', answer: 'En değerli hazırlık, mevcut sürecin yazılı hâlidir: hangi adım kimin sorumluluğunda, hangi bilgi nereden geliyor, hangi noktada tıkanıyor. Bunu birlikte de çıkarabiliriz, ancak siz hazırladığınızda süreç belirgin biçimde hızlanır. Ayrıca mevcut sistemlerinizin (muhasebe, ERP, e-ticaret) erişim bilgileri ve API desteği olup olmadığı erkenden netleşmelidir.' },
      { question: 'Proje bittikten sonra başka bir ekiple devam edebilir miyiz?', answer: 'Evet, ve bunu mümkün kılacak şekilde çalışıyoruz. Kaynak kod sizin deponuza aktarılır, teknoloji seçimi geliştirici bulunabilirliği gözetilerek yapılır, kurulum ve mimari dokümante edilir. Bizimle devam etmeniz tercih olmalı, teknik bir mecburiyet değil.' },
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
      // ek-bolum
      { h2: 'İstanbul’da Lojistik Avantajı, Rekabet Dezavantajı', body: 'İstanbul’da e-ticaret yapmanın en büyük avantajı operasyoneldir: kargo firmalarının yoğun şube ağı, aynı gün teslimat imkânı ve tedarikçiye fiziksel yakınlık. Aynı şehirde faaliyet gösteren satıcı sayısının fazlalığı ise fiyat rekabetini sertleştirir. Bu tabloda kalıcı olmanın yolu en ucuz olmaktan değil, teslimat hızını ve satış sonrası deneyimi öne çıkarmaktan geçer. Ürün sayfasında net teslimat süresi belirtmek, iade koşullarını açıkça yazmak ve sipariş sonrası bilgilendirmeyi otomatikleştirmek, dönüşüm oranına doğrudan yansıyan ve rakiplerin çoğunun ihmal ettiği detaylardır.' },
      // ek-bolum
      { h2: 'Altyapı Seçimi ve Taşıma Riski', body: 'Yeni başlayan satıcılar genellikle kiralık paket sistemlerle yola çıkar; bu, ilk aşama için makul bir karardır. Sorun, ciro büyüdükçe komisyon ve abonelik yükünün artması ve özelleştirme sınırlarına çarpılmasıdır. Altyapı değiştirmek teknik olarak mümkündür ancak yanlış yapılırsa arama motoru görünürlüğünü ciddi biçimde zedeler: eski ürün ve kategori adreslerinin yenilerine kalıcı yönlendirmeyle bağlanması, sayfa başlıklarının korunması ve site haritasının güncellenmesi şarttır. Taşıma kararını ertelemek yerine, hangi eşikte taşınacağınızı baştan belirlemenizi öneririz.' },
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
      { question: 'Hem kendi sitemde hem pazaryerinde satış yapabilir miyim?', answer: 'Evet ve çoğu satıcı için doğru kurgu budur. Kritik nokta stok ve fiyatın tek merkezden yönetilmesidir; aksi hâlde aynı ürünün iki kanalda satılması iptal ve müşteri memnuniyetsizliği üretir. Entegrasyon kurulduğunda stok tüm kanallarda eşzamanlı güncellenir.' },
      { question: 'E-ticaret sitem için sanal POS başvurusu ne kadar sürer?', answer: 'Belgeler eksiksizse genellikle birkaç iş günü sürer. Başvuruların en sık reddedilme sebebi teknik değil içeriktir: mesafeli satış sözleşmesi, iade ve iptal koşulları, teslimat bilgileri ve iletişim sayfasının sitede yayında olması gerekir. Bu sayfaları başvuru öncesi hazırlıyoruz.' },
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
      // ek-bolum
      { h2: 'İstanbul’da Reklam Maliyeti ve Hedefleme', body: 'İstanbul, Türkiye’de tıklama başı maliyetin en yüksek olduğu pazarlardan biridir; aynı anahtar kelimeye çok sayıda firma teklif verir. Bu koşulda geniş hedefleme ile başlamak bütçeyi hızla tüketir ve öğrenilecek veri bırakmaz. Daha verimli yaklaşım, satın alma niyeti yüksek dar bir kelime grubuyla başlamak, dönüşüm verisi biriktikten sonra kapsamı genişletmektir. İlçe bazlı hedefleme, hizmet bölgesi sınırlı işletmeler için bütçeyi belirgin şekilde korur. Reklamın gerçek maliyeti tıklama fiyatı değil, bir müşteri edinmenin toplam bedelidir — bu ölçülmeden bütçe artırmak riskli bir tercihtir.' },
      // ek-bolum
      { h2: 'Ölçüm Kurulmadan Harcama Yapılmaz', body: 'Pazarlama bütçesinin değerlendirilebilmesi için hangi kanaldan gelen ziyaretçinin ne yaptığının izlenmesi gerekir: form dolduran kaç kişi, bunların kaçı gerçek talep, hangi sayfa dönüşüm üretiyor. Analitik ve dönüşüm takibi kurulmadan yapılan harcamada elinizde yalnızca tıklama sayısı kalır ve bu sayı tek başına hiçbir şey ifade etmez. Çalışmaya bu altyapıyı kurarak başlıyoruz; ilk ayın en değerli çıktısı genellikle kampanya değil, artık neyin işe yaradığını görebiliyor olmanızdır.' },
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
      { question: 'Aylık ne kadar reklam bütçesi ayırmalıyım?', answer: 'Sektöre göre tıklama maliyetleri çok değiştiği için tek bir rakam vermek doğru olmaz. Sağlıklı yol, dar kapsamlı ve ölçülebilir bir bütçeyle başlamak, tıklama başı maliyet ile dönüşüm oranı verisi oluştuktan sonra bilinçli artırmaktır. Veri olmadan yapılan yüksek bütçeli başlangıçlar pahalı bir öğrenme sürecine dönüşür.' },
      { question: 'Sonuçları nasıl raporluyorsunuz?', answer: 'Sıralama tablosu yerine işinize dokunan sayıları paylaşıyoruz: hangi sorgulardan geldiğiniz, hangi sayfaların çalıştığı, form dönüşümleri ve müşteri edinme maliyeti. Neyin çalışmadığını da aynı açıklıkla raporluyoruz; ancak bu şekilde bütçe doğru yere kaydırılabilir.' },
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
      // ek-bolum
      { h2: 'İstanbul Sorgularında Rekabetin Yapısı', body: '“İstanbul + hizmet” kalıbındaki sorgularda ilk sıraları genellikle uzun yıllardır yayında olan, güçlü bağlantı profiline sahip siteler tutar. Yeni bir alan adının bu sorgularda kısa sürede öne geçmesi gerçekçi bir hedef değildir. Buna karşılık aynı pazarda çok sayıda düşük rekabetli uzun kuyruk sorgu vardır: belirli bir sektöre, ilçeye veya çok net bir ihtiyaca yönelen aramalar. Bu sorgular daha az arama hacmine sahiptir ama satın alma niyeti belirgin biçimde yüksektir. İstanbul için kurduğumuz strateji, önce bu sorgularda görünür olmak ve otoriteyi buradan biriktirmektir.' },
      // ek-bolum
      { h2: 'Teknik SEO Görünürlüğün Zeminidir', body: 'İçerik ne kadar iyi olursa olsun, arama motoru sayfayı tarayamıyor veya değerlendiremiyorsa sıralama oluşmaz. Bu yüzden çalışmaya teknik zeminden başlıyoruz: iç bağlantı yapısının her sayfaya ulaşması, site haritasının doğru ve güvenilir olması, canonical etiketlerin tutarlılığı, yapısal veri, sayfa hızı ve mobil kullanılabilirlik. Bu katman düzeltilmeden yapılan içerik yatırımı, karşılığını tam olarak vermez. Teknik denetimi ölçümle yapıyor, bulguları tahminle değil veriyle raporluyoruz.' },
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
      { question: 'SEO çalışmasının ilk sonuçlarını ne zaman görürüm?', answer: 'Teknik düzeltmelerin etkisi haftalar içinde görülebilir. İçerik ve otorite çalışmalarının sıralamaya yansıması genellikle 4-6 ayı bulur; yeni bir alan adında bu süre daha uzun olabilir. Düşük rekabetli uzun kuyruk sorgularda ilk hareketler daha erken başlar.' },
      { question: 'Garantili ilk sayfa sözü veriyor musunuz?', answer: 'Hayır. Sıralamayı belirleyen algoritmalar üçüncü bir tarafa aittir ve garanti veren hiçbir ajansın bunu kontrol etme imkânı yoktur. Verdiğimiz taahhüt yöntem ve şeffaflık üzerinedir: ne yaptığımızı, neden yaptığımızı ve hangi ölçümlerin değiştiğini düzenli olarak paylaşırız.' },
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
      // ek-bolum
      { h2: 'Uygulama Gerçekten Gerekli mi?', body: 'Mobil uygulama, mobil uyumlu bir web sitesinin yerine geçen bir şey değildir; farklı bir ihtiyaca cevap verir. Kullanıcı hizmetinizi düzenli olarak, tekrar tekrar kullanıyorsa; bildirim göndermeniz, cihaz özelliklerine (kamera, konum, çevrimdışı çalışma) erişmeniz gerekiyorsa uygulama anlamlıdır. Buna karşılık yılda birkaç kez ziyaret edilen bir hizmet için uygulama, indirilme engeline takılır ve yatırımı geri dönmez. İstanbul’da özellikle kurye, servis, randevu ve saha operasyonu içeren işlerde uygulama somut verim üretir. Bu soruyu birlikte dürüstçe cevaplıyor, gerekmediğini düşünüyorsak bunu söylüyoruz.' },
      // ek-bolum
      { h2: 'Platform Seçimi ve Mağaza Süreci', body: 'iOS ve Android için ayrı ayrı geliştirme en yüksek performansı verir ancak maliyeti ve bakım yükünü artırır. Çapraz platform yaklaşımı tek kod tabanıyla iki mağazaya çıkmayı sağlar ve çoğu iş uygulaması için yeterlidir. Karar, uygulamanın cihaz donanımını ne kadar yoğun kullandığına göre verilir. Ayrıca mağaza yayın süreci teknik geliştirmeden bağımsız bir takvim gerektirir: App Store inceleme süreci gün alabilir ve reddedilme durumunda düzeltme döngüsü yaşanır. Bu süreyi projeye baştan dahil ediyoruz ki yayın tarihi sürpriz olmasın.' },
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
      { question: 'Mobil uygulama geliştirme ne kadar sürer?', answer: 'Sınırlı kapsamlı bir uygulama 8-12 hafta içinde mağazaya çıkabilir. Kullanıcı hesabı, ödeme, bildirim ve arka uç entegrasyonu içeren uygulamalar 3-6 ay sürer. Mağaza inceleme süreci bu takvimin dışında ayrıca hesaplanmalıdır.' },
      { question: 'Uygulama yayınlandıktan sonra güncelleme gerekir mi?', answer: 'Evet. iOS ve Android her yıl yeni sürüm çıkarır ve mağazalar belirli bir süre sonra güncellenmeyen uygulamaları kısıtlayabilir. Ayrıca kullanılan kütüphaneler güvenlik güncellemesi alır. Düzenli bakım, uygulamanın mağazada kalması için teknik bir gerekliliktir.' },
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
      // ek-bolum
      { h2: 'Ankara’da Kurumsal Ciddiyet Beklentisi', body: 'Ankara’daki iş ilişkilerinin önemli bir bölümü kamu kurumları, savunma sanayii tedarikçileri, dernekler ve teknokent firmalarıyla yürür. Bu kitle bir web sitesinde gösterişten çok kurumsal ciddiyet ve doğrulanabilirlik arar: kimlik bilgileri açık, referans ve yetkinlik alanları net, iletişim kanalları eksiksiz. Ankara için tasarladığımız sitelerde bu beklentiyi merkeze alıyoruz. Kurumsal alıcı, sizi genellikle bir toplantı öncesi kısa süreliğine inceler; o kısa incelemede ne yaptığınızın ve kurumsal olarak kim olduğunuzun anlaşılması, animasyondan çok daha belirleyicidir.' },
      // ek-bolum
      { h2: 'İhale ve Tedarikçi Değerlendirmesine Hazır Site', body: 'Kamu ve büyük kurum tedarik süreçlerinde firmalar çoğu zaman web sitesi üzerinden ön elemeye tabi tutulur. Bu süreçte aranan bilgiler bellidir: faaliyet alanları, kurumsal künye, kapasite ve yetkinlik açıklamaları, iletişim ve yasal bilgiler. Sitede bu bilgilerin bulunmaması ya da güncel olmaması, teknik yeterliliği olan bir firmanın bile listeden düşmesine yol açabilir. Ankara odaklı projelerde bu içerik yapısını en baştan planlıyor, ayrıca dokümanların (katalog, sertifika, tanıtım dosyası) kolay bulunabildiği bir düzen kuruyoruz.' },
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
      { question: 'Ankara’da yüz yüze görüşme yapabilir miyiz?', answer: 'Süreçlerimizi çoğunlukla çevrim içi yürütüyoruz ve bu Ankara projelerinde de sorunsuz işliyor. Kapsamın gerektirdiği durumlarda görüşme planlanabilir; ancak uzaktan çalışma modeli hem takvimi hızlandırıyor hem maliyeti düşürüyor.' },
      { question: 'Kurumsal kimlik dosyalarımız var, siteye uyarlar mısınız?', answer: 'Evet. Mevcut marka kılavuzunuz varsa tasarım ona sadık kalır. Kılavuz yoksa mevcut logo ve renklerden yola çıkarak dijital ortam için tutarlı bir kullanım düzeni oluştururuz; bu, farklı yerlerde farklı görünen kurumsal kimlik sorununu ortadan kaldırır.' },
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
      // ek-bolum
      { h2: 'Teknokent ve Ar-Ge Ekosistemi', body: 'Ankara, üniversite teknokentleri ve Ar-Ge merkezleriyle Türkiye’nin en yoğun teknoloji üretim bölgelerinden biridir. Buradaki yazılım ihtiyacı çoğu zaman standart bir ürünle karşılanamaz: proje bazlı çalışan ekipler, kendi süreçlerine özgü takip sistemleri, laboratuvar ve test verilerinin yönetimi, proje bütçe ve raporlama akışları gibi ihtiyaçlar doğar. Bu tür projelerde başarıyı belirleyen şey teknoloji seçimi değil, sürecin doğru anlaşılmasıdır. Yazılıma başlamadan önce süreci sahada izlemek, sonradan yapılacak büyük değişikliklerin önüne geçer.' },
      // ek-bolum
      { h2: 'Kurumsal Entegrasyon ve Veri Güvenliği', body: 'Kamu ve savunma ekosistemine tedarik veren firmalarda veri güvenliği bir tercih değil, sözleşme gereğidir. Kurduğumuz sistemlerde verinin nerede tutulduğu, kimin eriştiği ve kayıtların ne kadar süreyle saklandığı en baştan tanımlanır. Yetkilendirme rol bazlı kurulur, kritik işlemler iz kaydı bırakır. Ayrıca yurt içinde barındırma gerekliliği olan projelerde altyapı buna göre planlanır. Bu gereksinimlerin proje sonunda değil başında konuşulması, sonradan yeniden yazılacak bir mimarinin maliyetinden çok daha ucuzdur.' },
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
      { question: 'Verilerimiz yurt içinde barındırılabilir mi?', answer: 'Evet. Sunucu ve veri tabanı altyapısı Türkiye’de bulunan sağlayıcılarda kurulabilir. Bu gereksinim projenin başında belirtilmelidir; çünkü barındırma tercihi mimariyi ve bazı servis seçimlerini doğrudan etkiler.' },
      { question: 'Ar-Ge projelerine uygun dokümantasyon sağlıyor musunuz?', answer: 'Teknik dokümantasyonu (mimari, kurulum, API tanımları, sürüm notları) standart olarak teslim ediyoruz. Destek programlarına yönelik idari belgeler bizim uzmanlık alanımız değildir; ancak gerekli teknik içeriği bu belgelerde kullanılabilecek biçimde hazırlıyoruz.' },
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
      // ek-bolum
      { h2: 'Ankara’da B2B Ağırlıklı Satış Yapısı', body: 'Ankara’daki e-ticaret ihtiyacı, tüketiciye yönelik perakendeden çok kurumsal ve toptan satış tarafında yoğunlaşır. Bu modelin gereksinimleri farklıdır: müşteriye özel fiyat listeleri, bayi ve cari hesap yönetimi, teklif ve sipariş onay akışları, vadeli ödeme ve kurumsal fatura süreçleri. Standart perakende odaklı hazır altyapılar bu ihtiyaçların önemli bir kısmını karşılamaz ve firmalar kısa sürede elle takip edilen paralel bir sisteme geri döner. Ankara projelerinde bu ayrımı en baştan yapıyor, altyapıyı satış modelinize göre seçiyoruz.' },
      // ek-bolum
      { h2: 'Kamu Alımları ve Katalog Yönetimi', body: 'Kamuya ve büyük kurumlara satış yapan firmalar için ürün kataloğunun güncel, eksiksiz ve karşılaştırılabilir olması kritik öneme sahiptir. Teknik özelliklerin standart bir düzende sunulması, doküman ve sertifikaların ürünle ilişkilendirilmesi, fiyat ve stok bilgisinin güvenilir olması alım kararını doğrudan etkiler. Kurduğumuz sistemlerde katalog verisinin tek bir kaynaktan yönetilmesine öncelik veriyoruz; aynı ürünün farklı yerlerde farklı bilgiyle görünmesi, kurumsal alıcı nezdinde en hızlı güven kaybettiren durumdur.' },
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
      { question: 'Bayi ve kurumsal müşterilerime özel fiyat gösterebilir miyim?', answer: 'Evet. Müşteri grubuna göre farklı fiyat listeleri, iskonto oranları ve ödeme koşulları tanımlanabilir. Giriş yapan kurumsal müşteri kendi fiyatını görür; ziyaretçiye ise liste fiyatı veya yalnızca teklif isteme seçeneği gösterilebilir.' },
      { question: 'Muhasebe programımızla entegre olur mu?', answer: 'Yaygın kullanılan ön muhasebe ve ERP programlarının çoğu entegrasyon arayüzü sunar; bu durumda sipariş, cari ve stok akışı otomatikleştirilebilir. Arayüz sunmayan sistemlerde alternatif yöntemler değerlendirilir. Projeye başlamadan önce mevcut programınızın entegrasyon kabiliyetini inceliyoruz.' },
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
      // ek-bolum
      { h2: 'Ankara’da Karar Süreci Daha Uzundur', body: 'Ankara’da hizmet alımı çoğu zaman tek bir kişinin ani kararıyla değil, birden fazla kişinin dahil olduğu bir değerlendirmeyle sonuçlanır. Bu, pazarlama yaklaşımını doğrudan etkiler: hemen satış bekleyen kampanyalar yerine, güven ve yetkinlik inşa eden içeriklerin ağırlığı artar. Referans niteliğinde açıklamalar, teknik yeterlilik anlatan içerikler ve karşılaştırma yapmayı kolaylaştıran kaynaklar burada daha iyi çalışır. Ölçüm yaparken de tek göstergenin anlık satış olmaması gerekir; teklif talebi ve iletişime geçme oranları daha anlamlı sinyaller verir.' },
      // ek-bolum
      { h2: 'Bölgesel Hedefleme ve Bütçe Verimliliği', body: 'Hizmet bölgesi Ankara ile sınırlı bir işletme için ülke geneline reklam vermek, bütçenin önemli bir kısmının hiç müşteriye dönüşmeyecek tıklamalara gitmesi demektir. Coğrafi hedeflemenin şehir hatta ilçe düzeyinde daraltılması, aynı bütçeyle çok daha fazla nitelikli ziyaretçi getirir. Buna ek olarak, arama sorgularının bölgesel karşılıklarının içerikte doğal biçimde yer alması organik tarafta da karşılığını bulur. Bölgesel kurgu, küçük bütçelerin en verimli kullanıldığı yaklaşımdır.' },
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
      { question: 'Küçük bütçeyle dijital pazarlama yapılabilir mi?', answer: 'Yapılabilir, ancak hedefin dar tutulması şarttır. Küçük bütçeyi geniş kitleye yaymak sonuç üretmez. Bölgesel hedefleme, satın alma niyeti yüksek dar bir kelime grubu ve tek bir net dönüşüm hedefiyle çalışıldığında sınırlı bütçeler de ölçülebilir sonuç verir.' },
      { question: 'Sosyal medya yönetimi de yapıyor musunuz?', answer: 'Evet, içerik planı ve düzenli paylaşım yönetimi hizmet kapsamımızdadır. Beklenti yönetimi açısından şunu belirtelim: kurumsal hizmetlerde sosyal medyanın katkısı doğrudan satıştan çok bilinirlik ve hatırlanabilirlik üzerinedir ve etkisi zaman içinde ortaya çıkar.' },
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
      // ek-bolum
      { h2: 'Ankara Sorgularında Kazanılabilir Alan', body: 'Ankara odaklı aramalarda rekabet İstanbul kadar yoğun değildir; bu, yeni siteler için gerçek bir fırsat anlamına gelir. Özellikle sektöre ve ihtiyaca özgü uzun kuyruk sorgularda, doğru kurgulanmış içerikle görünürlük kazanmak daha kısa sürede mümkün olabilir. Buna karşılık Ankara’da arama hacimleri de daha düşüktür; bu yüzden strateji, az sayıda yüksek hacimli kelimeye değil, çok sayıda niyeti net sorguya yayılmalıdır. Bu yaklaşım hem daha erken sonuç verir hem gelen trafiğin talebe dönüşme oranını yükseltir.' },
      // ek-bolum
      { h2: 'Yerel Sinyaller ve Kurumsal Görünürlük', body: 'Yerel aramalarda sıralamayı etkileyen unsurların bir kısmı site dışındadır: işletme bilgilerinin farklı platformlarda birebir aynı yazılması, sektörel dizinlerde yer alma ve kurumsal profillerin tutarlılığı. Aynı firmanın adının, adresinin veya telefonunun yerden yere farklı görünmesi, arama motorlarının kimliği doğrulamasını zorlaştırır. Çalışmalarımızda site içi optimizasyonun yanında bu tutarlılığı da denetliyoruz; çünkü teknik olarak kusursuz bir site, dış sinyaller eksik olduğunda yerel sorgularda hak ettiği yeri alamaz.' },
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
      { question: 'Ankara için ayrı bir sayfa yapmak gerekli mi?', answer: 'Hizmet bölgeniz belirli bir şehri kapsıyorsa, o şehre özgü gerçek içerik taşıyan bir sayfa yararlıdır. Ancak yalnızca şehir adı değiştirilerek çoğaltılan sayfalar arama motorları tarafından değersiz bulunur ve fayda getirmez. Sayfanın o şehre dair gerçekten bilgi vermesi gerekir.' },
      { question: 'Mevcut sitemin SEO durumunu inceleyebilir misiniz?', answer: 'Evet. Teknik denetimle başlıyoruz: taranabilirlik, iç bağlantı yapısı, site haritası, meta bilgiler, yapısal veri, sayfa hızı ve mobil kullanılabilirlik ölçülüyor. Bulguları öncelik sırasına konmuş bir liste hâlinde paylaşıyoruz; hangi maddenin ne kadar etkisi olduğu da belirtiliyor.' },
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
      // ek-bolum
      { h2: 'Kurumsal ve Saha Odaklı Uygulamalar', body: 'Ankara’da mobil uygulama ihtiyacı sıklıkla tüketiciye yönelik değil, kurum içi verimlilik amaçlı doğar: saha ekiplerinin veri girişi, denetim ve kontrol formları, personel takibi, stok ve demirbaş sayımı gibi süreçler. Bu uygulamalarda başarı kriteri indirilme sayısı değil, sahadaki işin ne kadar hızlandığıdır. Tasarım da buna göre kurulur: az sayıda ekran, büyük dokunma alanları, zayıf bağlantıda çalışabilme ve çevrimdışı kayıt. Kurum içi uygulamalar mağaza yerine kurumsal dağıtım yöntemleriyle de yayınlanabilir; bu, inceleme süreçlerini ortadan kaldırır.' },
      // ek-bolum
      { h2: 'Çevrimdışı Çalışma ve Veri Senkronizasyonu', body: 'Saha uygulamalarının en sık karşılaştığı sorun, bağlantının olmadığı ortamlarda veri kaybıdır. Bunu önlemek için uygulamayı çevrimdışı çalışacak biçimde kuruyoruz: kayıtlar cihazda tutulur, bağlantı geldiğinde sunucuya aktarılır ve çakışma durumları tanımlı bir kurala göre çözülür. Bu yapı ilk bakışta görünmez ama sahada uygulamanın kullanılabilir olup olmamasını belirleyen asıl unsurdur. Çevrimdışı gereksinimin projenin başında belirtilmesi önemlidir, çünkü sonradan eklenmesi mimariyi değiştirir.' },
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
      { question: 'Uygulamayı mağazaya çıkarmadan kurum içinde dağıtabilir miyiz?', answer: 'Evet. Kurum içi kullanım için mağaza dışı dağıtım yöntemleri mevcuttur; bu yöntemde uygulama yalnızca sizin belirlediğiniz cihazlara kurulur ve mağaza inceleme süreci beklenmez. Kurumsal geliştirici hesabı gereksinimleri konusunda yönlendirme sağlıyoruz.' },
      { question: 'Uygulama internet olmadan çalışır mı?', answer: 'Gereksinim olarak belirtilirse evet. Veriler cihazda saklanır ve bağlantı sağlandığında sunucuyla eşitlenir. Bu yapının baştan planlanması gerekir; sonradan eklenmesi genellikle uygulamanın veri katmanının yeniden yazılmasını gerektirir.' },
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
      // ek-bolum
      { h2: 'İhracatçı Firmalar İçin Çok Dilli Yapı', body: 'İzmir’in ekonomik kimliğinde ihracat belirleyici bir yer tutar; Ege Bölgesi’nden yurt dışına satış yapan çok sayıda üretici ve ticaret firması bulunur. Bu firmalar için web sitesi yalnızca yerel bir tanıtım aracı değil, yurt dışındaki alıcının firmayı ilk değerlendirdiği yerdir. Bu nedenle çok dilli yapı sonradan eklenen bir çeviri katmanı olarak değil, en baştan planlanmış bir mimari olarak kurulmalıdır: her dilin kendi adresi, doğru dil etiketleri ve arama motorlarının hangi içeriğin hangi kitleye ait olduğunu anlayabileceği bir düzen.' },
      // ek-bolum
      { h2: 'Ürün ve Kapasite Anlatımı', body: 'Üretici firmalarda alıcının aradığı bilgi nettir: ne üretiyorsunuz, hangi standartlarda, hangi kapasiteyle ve hangi sertifikalara sahipsiniz. Bu bilgiler sitede dağınık veya eksik olduğunda, teknik olarak yeterli bir firma bile değerlendirme dışı kalabilir. İzmir projelerinde ürün ve kapasite anlatımını yapılandırılmış biçimde kuruyoruz: teknik özellikler karşılaştırılabilir bir düzende, belgeler kolay erişilir, iletişim adımı ise mümkün olduğunca kısa. Yurt dışı alıcının zaman ayırma eşiği düşüktür; bilgiye ulaşmak için fazla adım gerektiren siteler hızla terk edilir.' },
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
      { question: 'Sitemiz kaç dilde olabilir?', answer: 'Teknik bir sınır yok; ihtiyaca göre iki, üç veya daha fazla dil kurgulanabilir. Önemli olan her dilin kendi adresine sahip olması ve dil etiketlerinin doğru tanımlanmasıdır. Otomatik çeviri yerine gerçek çeviri öneriyoruz; makine çevirisi kurumsal alıcı nezdinde güven kaybı yaratabiliyor.' },
      { question: 'Yurt dışından açıldığında sitemiz hızlı çalışır mı?', answer: 'Bu, barındırma ve dağıtım yapılandırmasıyla doğrudan ilgilidir. Yurt dışı ziyaretçi ağırlığı olan projelerde içerik dağıtım ağı kullanarak sayfaların ziyaretçiye en yakın noktadan sunulmasını sağlıyoruz; böylece coğrafi mesafeden kaynaklanan gecikme belirgin ölçüde azalıyor.' },
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
      // ek-bolum
      { h2: 'Üretim ve Tarım İşletmelerinde Süreç Yazılımı', body: 'İzmir ve çevresinde gıda işleme, tarımsal üretim, ambalaj ve makine imalatı yapan çok sayıda işletme faaliyet gösterir. Bu işletmelerde yazılım ihtiyacı genellikle üretim planlama, parti ve lot takibi, kalite kontrol kayıtları ve sevkiyat yönetimi çevresinde şekillenir. İzlenebilirlik özellikle gıda tarafında yasal bir gereklilik hâline geldiği için, kayıtların elle tutulduğu sistemler hem risk hem iş yükü üretir. Bu tür projelerde yazılımın sahadaki gerçek akışa uyması, kâğıt üzerindeki ideal sürece uymasından çok daha önemlidir.' },
      // ek-bolum
      { h2: 'İhracat Operasyonunun Yazılımla Yönetimi', body: 'İhracat yapan firmalarda operasyon; sipariş, üretim, sevkiyat, gümrük belgeleri ve tahsilat gibi birbirine bağlı adımlardan oluşur. Bu adımların ayrı ayrı dosyalarda takip edildiği durumlarda en sık yaşanan sorun, hangi siparişin hangi aşamada olduğunun anlık olarak bilinememesidir. Kurduğumuz sistemlerde amaç, tüm sürecin tek ekrandan izlenebilmesi ve belge akışının siparişe bağlı biçimde yürümesidir. Böylece hem müşteriye verilen bilgi güvenilir hâle gelir hem ekip içindeki bilgi arama süresi ortadan kalkar.' },
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
      { question: 'Üretim sürecimize özel yazılım yapılabilir mi?', answer: 'Evet, ve bu tür projelerde en kritik aşama süreci yerinde anlamaktır. Üretim akışını, istisnaları ve kimin hangi kaydı ne zaman girdiğini birlikte çıkarıyoruz. Hazır bir modülü zorlamak yerine sizin akışınıza uyan bir yapı kurmak, kullanım oranını doğrudan etkiliyor.' },
      { question: 'Mevcut ERP’mizle birlikte çalışabilir mi?', answer: 'Çoğu durumda evet. ERP’yi değiştirmeden, onun yanında çalışan ve eksik kalan süreçleri tamamlayan sistemler kurmak yaygın bir yaklaşımdır. Entegrasyon ERP’nin sunduğu arayüzler üzerinden yapılır; arayüz yoksa alternatif yöntemler değerlendirilir.' },
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
      // ek-bolum
      { h2: 'Üreticiden Tüketiciye Satış Fırsatı', body: 'Ege Bölgesi’nde zeytinyağı, gıda, tekstil ve el yapımı ürün üreten çok sayıda işletme, uzun yıllar yalnızca toptan kanaldan satış yaptı. Kendi markasıyla doğrudan tüketiciye satış, bu üreticiler için marjı belirgin biçimde artıran bir fırsattır. Ancak model değişikliği yalnızca site kurmakla tamamlanmaz: ürün anlatımı, görsel kalitesi, kargo süreci ve müşteri iletişimi toptan satıştan tamamen farklı bir yetkinlik gerektirir. Bu geçişi planlarken operasyonel tarafın hazır olması, sitenin kendisinden daha belirleyicidir.' },
      // ek-bolum
      { h2: 'Yurt Dışına Satış ve E-İhracat', body: 'İzmir’deki üreticiler için doğal bir sonraki adım e-ihracattır. Teknik olarak çok dilli ve çok para birimli bir altyapı kurmak mümkündür; asıl planlanması gereken taraf operasyondur: uluslararası kargo maliyetleri ve süreleri, gümrük belgeleri, iade süreçlerinin nasıl yürüyeceği ve hangi ülkelere satış yapılacağı. Bu kararlar altyapı seçimini de etkiler. E-ihracata başlarken kapsamı dar tutup az sayıda ülkeyle deneyim kazanmak, aynı anda her yere açılmaya çalışmaktan çok daha sağlıklı bir yol.' },
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
      { question: 'Yurt dışına satış için altyapı farklı mı olmalı?', answer: 'Çok dilli içerik, farklı para birimleri, uluslararası ödeme yöntemleri ve ülkeye göre değişen kargo/vergi kuralları gerekir. Bunlar teknik olarak çözülebilir; kritik olan hangi ülkelere satış yapacağınızın baştan netleşmesidir, çünkü bu karar altyapı ve entegrasyon seçimlerini belirler.' },
      { question: 'Ürün fotoğraflarını siz mi hazırlıyorsunuz?', answer: 'Fotoğraf çekimi doğrudan hizmetimiz değil, ancak e-ticarette görsel kalitesinin dönüşüme etkisi çok yüksek olduğu için gereksinimleri net biçimde tanımlıyor ve yönlendirme yapıyoruz. Mevcut görselleriniz varsa web için optimize ederek kullanıyoruz.' },
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
      // ek-bolum
      { h2: 'Yerel Pazar ve Turizm Sezonu', body: 'İzmir ekonomisinde turizm ve sezonluk hareketlilik belirgin bir rol oynar; konaklama, yeme-içme, etkinlik ve hizmet sektörlerinde talep yıl içinde dalgalanır. Bu yapıda pazarlama bütçesini yıl boyunca sabit tutmak verimli değildir. Talebin yükseldiği dönemlerden önce görünürlüğü artırmak, düşük sezonda ise bütçeyi kalıcı görünürlük çalışmalarına kaydırmak daha iyi sonuç verir. Sezonluk işlerde arama hacminin ne zaman yükseldiğini veriye bakarak belirlemek, tahminle hareket etmekten belirgin biçimde daha isabetlidir.' },
      // ek-bolum
      { h2: 'İhracatçı İçin Yurt Dışı Hedefleme', body: 'Yurt dışı alıcıya ulaşmak isteyen İzmirli üreticiler için dijital pazarlama, yurt içi kurgudan farklı çalışır. Hedef kitlenin dili, arama alışkanlıkları ve kullandığı platformlar değişir; profesyonel ağlar ve sektörel platformlar arama reklamlarından daha etkili olabilir. Ayrıca yurt dışı kitlede karar süreci uzundur ve ilk temas genellikle satışla değil bilgi talebiyle sonuçlanır. Bu yüzden başarı ölçütünün doğru seçilmesi gerekir: nitelikli teklif talebi sayısı, anlık satıştan çok daha anlamlı bir göstergedir.' },
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
      { question: 'Sezonluk işletme için reklam ne zaman başlamalı?', answer: 'Talebin yükseleceği dönemden birkaç hafta önce başlamak, hem maliyeti hem öğrenme süresini optimize eder. Kampanyalar veri biriktirdikçe verimli hâle geldiği için sezonun tam ortasında başlamak, en pahalı dönemde en verimsiz aşamayı yaşamak anlamına gelir.' },
      { question: 'Yurt dışı müşteriye ulaşmak için hangi kanal daha uygun?', answer: 'Sektöre göre değişir. Sanayi ve üretim tarafında profesyonel ağlar ile sektörel platformlar genellikle daha nitelikli temas üretir; tüketiciye yönelik ürünlerde ise arama ve görsel odaklı platformlar öne çıkar. Doğru kanalı belirlemek için önce hedef ülkelerin netleşmesi gerekir.' },
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
      // ek-bolum
      { h2: 'Yerel ve Uluslararası SEO Birlikte Kurgulanmalı', body: 'İzmir’deki birçok firma hem yerel pazara hem yurt dışına hitap eder. Bu iki hedefin SEO gereksinimleri farklıdır ve aynı sayfayla karşılanmaya çalışıldığında ikisi de zayıf kalır. Doğru yaklaşım, dile ve pazara göre ayrılmış bir yapı kurmak, her hedef için ayrı anahtar kelime kümesi ve içerik planı oluşturmaktır. Ayrıca dil etiketlerinin doğru tanımlanması, arama motorlarının hangi içeriği hangi ülkedeki kullanıcıya göstereceğini belirler; bu teknik detay ihracatçı sitelerinde en sık atlanan ve en çok kayıp yaratan noktalardan biridir.' },
      // ek-bolum
      { h2: 'Sektörel İçerikle Otorite Kurmak', body: 'Üretim ve ihracat yapan firmalarda en iyi çalışan içerik türü, ürünün teknik gerçekliğini anlatan içeriklerdir: standartlar, kullanım alanları, kalite kriterleri, seçim rehberleri. Bu içerikler hem arama sonuçlarında niyeti net sorguları karşılar hem de siteye gelen alıcının teknik yeterliliğinize dair güven geliştirmesini sağlar. Genel tanıtım metinleri yerine sektörünüzün gerçek sorularını cevaplayan içerikler, uzun vadede hem sıralamada hem teklif dönüşümünde daha iyi sonuç verir.' },
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
      { question: 'Çok dilli sitede SEO nasıl kurgulanır?', answer: 'Her dilin kendi adresinde yayınlanması, dil ve bölge etiketlerinin doğru tanımlanması ve içeriğin gerçekten çevrilmiş olması gerekir. Aynı içeriği tek sayfada birden fazla dilde sunmak veya otomatik çeviri kullanmak, arama motorlarının içeriği doğru sınıflandırmasını engeller.' },
      { question: 'Yurt dışında sıralamaya girmek yurt içinden daha mı zor?', answer: 'Zorluk hedef pazarın rekabetine bağlıdır; bazı ülkelerde rekabet Türkiye’den düşüktür. Belirleyici unsur, hedef dilde gerçekten değerli içerik üretilmesi ve o pazardan gelen sinyallerdir. Türkçe içeriğin çevirisiyle yetinen siteler genellikle beklediği sonucu alamaz.' },
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
      // ek-bolum
      { h2: 'Saha, Depo ve Sevkiyat Uygulamaları', body: 'İzmir’deki üretici ve ihracatçı firmalarda mobil uygulama ihtiyacı genellikle depo ve sevkiyat operasyonundan doğar: barkod ile mal kabul, raf ve sayım işlemleri, sevkiyat kontrolü ve araç takibi. Bu uygulamaların değeri arayüz güzelliğinde değil, işlem hızındadır. Depoda çalışan bir kullanıcı aynı işlemi günde yüzlerce kez tekrarlar; her adımda kazanılan birkaç saniye gün sonunda ciddi bir fark üretir. Bu yüzden tasarımı gerçek kullanım koşullarına göre yapıyoruz: tek elle kullanım, büyük hedef alanları ve minimum ekran geçişi.' },
      // ek-bolum
      { h2: 'Donanım Entegrasyonu', body: 'Depo ve saha uygulamalarında çoğu zaman yalnızca telefon değil, barkod okuyucu veya el terminali gibi donanımlar da devrededir. Bu cihazların uygulamayla uyumlu çalışması, projenin en sık gözden kaçan teknik gereksinimidir. Kullanılacak donanımın modeli ve çalışma biçimi proje başında netleşmelidir; çünkü bazı cihazlar standart yöntemlerle çalışırken bazıları üreticiye özel entegrasyon gerektirir. Bu netlik sağlanmadan başlanan projelerde, geliştirme bittikten sonra sahada çalışmayan bir uygulamayla karşılaşma riski vardır.' },
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
      { question: 'Barkod okuyucu ile çalışan uygulama yapabilir misiniz?', answer: 'Evet. Telefon kamerasıyla barkod okuma veya harici okuyucu/el terminali entegrasyonu mümkündür. Hangi yöntemin uygun olduğu işlem hacmine ve çalışma ortamına göre belirlenir; yoğun ve sürekli okuma yapılan ortamlarda özel donanım genellikle daha verimlidir.' },
      { question: 'Uygulama mevcut stok sistemimize bağlanabilir mi?', answer: 'Sisteminiz entegrasyon arayüzü sunuyorsa doğrudan bağlanabilir ve veriler anlık olarak eşitlenir. Arayüz bulunmayan sistemlerde ara bir katman kurmak gerekebilir. Projeye başlamadan önce mevcut sisteminizin bu açıdan incelenmesi gerekir.' },
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
      // ek-bolum
      { h2: 'Sanayi Firmaları İçin Site Ne İşe Yarar', body: 'Bursa’da otomotiv yan sanayi, tekstil ve makine imalatı yapan çok sayıda firma bulunur ve bu firmaların önemli bir kısmı satışını doğrudan tüketiciye değil, kurumsal alıcıya yapar. Böyle bir yapıda web sitesinin görevi çevrim içi satış yapmak değil, potansiyel iş ortağına yeterliliği kanıtlamaktır. Alıcı firma tedarikçi ararken sizi büyük ihtimalle önce internetten inceler; ürün gruplarınız, üretim kapasiteniz, kalite belgeleriniz ve iletişim bilgileriniz o incelemede net görünmelidir. Sitenin işlevi burada bir dijital tanıtım dosyası olmaktır.' },
      // ek-bolum
      { h2: 'Teknik İçeriğin Doğru Sunumu', body: 'Sanayi sitelerinde en sık görülen eksik, ürün bilgisinin PDF kataloglara hapsedilmesidir. Bu dosyalar arama motorları tarafından tam olarak değerlendirilemez ve ziyaretçi için de ek bir adım oluşturur. Ürün ve kapasite bilgisinin site içinde, karşılaştırılabilir ve aranabilir biçimde yer alması hem görünürlüğü artırır hem alıcının işini kolaylaştırır. Katalog elbette indirilebilir kalmalı, ancak bilginin tek kaynağı olmamalıdır. Bursa projelerinde bu yapıyı kurup teknik içeriği aranabilir hâle getiriyoruz.' },
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
      { question: 'Ürün kataloğumuz PDF olarak var, siteye nasıl aktarılır?', answer: 'Katalogdaki bilgiyi yapılandırılmış içeriğe dönüştürüyoruz: ürün grupları, teknik özellikler ve kullanım alanları site içinde aranabilir sayfalar hâline geliyor. PDF de indirilebilir olarak kalıyor. Bu dönüşüm hem arama motoru görünürlüğü hem kullanıcı deneyimi için belirgin fark yaratıyor.' },
      { question: 'İngilizce sayfa da gerekli mi?', answer: 'Yurt dışı alıcıya satış yapıyor veya yapmayı planlıyorsanız gereklidir. Bursa’daki yan sanayi firmalarının önemli bir kısmı ihracat yapmaktadır ve yabancı alıcı için İngilizce içerik ilk değerlendirme aşamasında belirleyici olabilir. Çok dilli yapıyı en baştan kurmak sonradan eklemekten daha ekonomiktir.' },
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
      // ek-bolum
      { h2: 'İmalatta Üretim Takibi ve İzlenebilirlik', body: 'Bursa’daki imalat firmalarında yazılım ihtiyacı çoğunlukla üretim sahasından doğar: iş emri takibi, makine ve vardiya bazlı üretim kayıtları, fire ve duruş nedenleri, kalite kontrol sonuçları. Bu veriler kâğıt üzerinde tutulduğunda ay sonunda ancak toplu bir rapora dönüşür ve o noktada müdahale şansı kalmaz. Sahadan anlık veri toplayan bir sistem, sorunları oluştuğu gün görünür kılar. Bu tür projelerde en kritik başarı faktörü, sahadaki operatörün veri girişini kolay bulmasıdır; karmaşık bir arayüz kısa sürede kullanılmaz hâle gelir.' },
      // ek-bolum
      { h2: 'Otomotiv Tedarik Zincirinin Gereksinimleri', body: 'Otomotiv yan sanayinde ana sanayi firmalarının tedarikçilerine yönelik belgelendirme ve izlenebilirlik beklentileri yüksektir. Parti bazlı izlenebilirlik, ölçüm kayıtlarının saklanması ve geriye dönük sorgulanabilirlik çoğu zaman sözleşme gereğidir. Bu gereksinimler yazılımın veri modelini doğrudan etkiler ve sonradan eklenmesi zordur. Projeye başlarken hangi kayıtların ne kadar süreyle ve hangi ayrıntıda saklanacağının netleşmesi, ilerleyen aşamada yeniden yazılacak bir yapının maliyetinden çok daha ucuzdur.' },
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
      { question: 'Üretim sahasından veri toplamak için ne gerekiyor?', answer: 'Saha koşullarına uygun bir arayüz ve doğru giriş yöntemi gerekir: dokunmatik terminal, barkod okuma veya makineden doğrudan veri alma gibi seçenekler değerlendirilir. Ortam koşulları ve operatörün çalışma biçimi bu seçimi belirler; en doğru karar için süreci yerinde incelemeyi tercih ediyoruz.' },
      { question: 'Mevcut muhasebe/ERP sistemimizle çakışır mı?', answer: 'Hayır, amaç onun yerini almak değil eksik kalan tarafı tamamlamaktır. Üretim takibi çoğu standart ERP paketinde yüzeysel kalır; sahaya özel bir çözüm ERP’ye entegre çalışarak veri tekrarını önler ve iki sistemin tutarlı kalmasını sağlar.' },
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
      // ek-bolum
      { h2: 'Üreticiden Markaya Geçiş', body: 'Bursa’da uzun yıllar fason üretim yapan çok sayıda tekstil ve mobilya firması, kendi markasıyla doğrudan satışa yönelmektedir. Bu geçiş, marjı belirgin biçimde artıran ancak yeni yetkinlikler gerektiren bir dönüşümdür: ürün fotoğrafı, açıklama yazımı, tekil müşteriye kargo, iade yönetimi ve müşteri iletişimi. Toptan işleyen bir operasyon bu süreçlere hazır değildir. Bu nedenle e-ticarete geçişi teknik bir kurulum olarak değil, operasyonel bir dönüşüm olarak planlamak gerekir; sitenin kendisi bu dönüşümün yalnızca bir parçasıdır.' },
      // ek-bolum
      { h2: 'B2B ve B2C Kanalların Birlikte Yönetimi', body: 'Hem bayilere hem son tüketiciye satan firmalarda en sık yaşanan sorun, iki kanalın birbirini bozmasıdır: bayi fiyatının son tüketiciye görünmesi ya da aynı stoktan iki kanala eşzamanlı satış yapılması. Doğru kurgu, tek bir stok ve ürün kaynağı üzerinde çalışan, ancak müşteri grubuna göre farklı fiyat ve koşul gösteren bir yapıdır. Bu ayrım altyapı seçiminde en baştan gözetilmelidir; sonradan eklenmeye çalışıldığında genellikle elle takip edilen paralel bir sisteme dönülür ve verim kaybedilir.' },
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
      { question: 'Hem bayilerime hem son tüketiciye aynı siteden satabilir miyim?', answer: 'Evet. Bayi girişi yapan kullanıcı kendi fiyatını ve ödeme koşullarını görürken, ziyaretçiye perakende fiyat gösterilir. Stok tek kaynaktan yönetilir; böylece iki kanalın birbirini bozması engellenir.' },
      { question: 'Fason üretimden kendi markama geçerken neye dikkat etmeliyim?', answer: 'Teknik kurulumdan önce operasyonun hazır olması gerekir: tekil sipariş paketleme, kargo anlaşması, iade süreci ve müşteri iletişimi. Ayrıca ürün görselleri ve açıklamaları toptan satıştan çok farklı bir kaliteyi gerektirir. Dar bir ürün grubuyla başlayıp süreci oturtmak, tüm kataloğu aynı anda açmaktan daha sağlıklıdır.' },
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
      // ek-bolum
      { h2: 'B2B Pazarlamada Farklı Kurallar', body: 'Bursa’daki sanayi firmalarının hedef kitlesi çoğunlukla başka firmalardır ve bu, pazarlamanın işleyişini kökten değiştirir. Alıcı sayısı sınırlıdır, karar süreci uzundur ve satın alma tek kişinin inisiyatifiyle gerçekleşmez. Bu koşulda geniş kitleye yayılan kampanyalar verimsizdir; doğru yaklaşım dar ve nitelikli bir kitleye ulaşmaktır. Teknik yeterliliği anlatan içerikler, ürün ve uygulama örnekleri, sektörel platformlarda görünürlük bu kitlede arama reklamlarından daha iyi çalışabilir. Başarı ölçütü de anlık satış değil, nitelikli teklif talebi olmalıdır.' },
      // ek-bolum
      { h2: 'Fuar ve Dijitalin Birlikte Çalışması', body: 'Sanayi firmaları için fuarlar hâlâ en önemli iş geliştirme kanallarından biridir ve dijital çalışma bunun alternatifi değil, tamamlayıcısıdır. Fuar öncesi görünürlük artırmak, fuarda tanışılan firmaların sonrasında sizi araştırdığında karşılarına güçlü bir dijital varlık çıkmasını sağlamak ve fuar sonrası iletişimi sistemli yürütmek, fuar yatırımının getirisini doğrudan artırır. Fuar takvimini bilen bir dijital plan, yıl boyunca sabit tempoda yürüyen bir plandan belirgin biçimde daha verimlidir.' },
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
      { question: 'Sanayi firması için dijital pazarlama gerçekten işe yarar mı?', answer: 'Beklenti doğru kurulduğunda evet. Amaç doğrudan çevrim içi satış değil, alıcı firma sizi araştırdığında güçlü ve yeterli görünmenizdir. Kurumsal alıcıların neredeyse tamamı tedarikçiyi internetten inceler; bu incelemede zayıf kalmak, fuarda kurulan teması bile boşa çıkarabilir.' },
      { question: 'Hangi kanaldan başlamalıyız?', answer: 'Genellikle en verimli başlangıç, mevcut sitenin arama görünürlüğünü ve içeriğini güçlendirmektir; çünkü alıcı sizi ararken ilk oraya bakar. Ardından sektörel platformlar ve profesyonel ağlar gelir. Geniş kitleye yönelik reklam, B2B işlerde genellikle en son değerlendirilecek kanaldır.' },
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
      // ek-bolum
      { h2: 'Sanayi Sorgularında Niyet Nettir', body: 'Sanayi ve imalat alanındaki aramalar genellikle çok spesifiktir: belirli bir parça, standart, malzeme veya kapasite aranır. Bu sorguların arama hacmi düşüktür ancak arayan kişi genellikle satın alma yetkisine sahip ve ihtiyacı nettir. Bu yüzden Bursa’daki sanayi firmaları için doğru strateji, yüksek hacimli genel kelimeleri kovalamak değil, ürün ve uygulama düzeyinde çok sayıda spesifik sorguyu karşılamaktır. Bu yaklaşım daha az trafik getirir ama gelen trafiğin teklif talebine dönüşme oranı belirgin biçimde yüksektir.' },
      // ek-bolum
      { h2: 'Ürün Sayfaları Görünürlüğün Motorudur', body: 'Sanayi sitelerinde en çok ihmal edilen alan ürün sayfalarıdır; çoğu firma tüm bilgiyi tek bir “Ürünler” sayfasında toplar. Oysa her ürün grubunun kendi sayfasına sahip olması, o gruba özgü sorgularda görünmenin ön koşuludur. Teknik özelliklerin yapılandırılmış biçimde verilmesi, kullanım alanlarının açıklanması ve sık sorulan teknik soruların cevaplanması hem arama motoru için hem alıcı için değer üretir. Bu yapının kurulması, çoğu durumda yeni içerik üretmekten daha hızlı sonuç verir.' },
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
      { question: 'Ürünlerimiz çok teknik, SEO içeriği yazabilir misiniz?', answer: 'Teknik doğruluk sizden, yapı ve arama uyumu bizden. Ürün bilgisini ve teknik detayları siz sağlarsınız; biz bunu arama sorgularıyla eşleşen, okunabilir ve yapılandırılmış içeriğe dönüştürürüz. Teknik içerikte doğruluğu uydurmak yerine kaynağa dayanmak esastır.' },
      { question: 'Sadece Bursa’da değil Türkiye genelinde görünmek istiyoruz, mümkün mü?', answer: 'Evet. Şehir odaklı sayfalar yerel sorguları karşılarken, ürün ve uygulama odaklı içerikler coğrafyadan bağımsız sorgularda görünür. İkisi birbirini dışlamaz; sağlıklı yapı her ikisini birlikte kurgular.' },
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
      // ek-bolum
      { h2: 'Fabrika İçi Uygulamalar', body: 'Bursa’daki imalat firmalarında mobil uygulama ihtiyacı genellikle üretim sahasından doğar: iş emri görüntüleme, üretim adımı bildirimi, arıza ve duruş kaydı, bakım kontrol listeleri. Bu uygulamalarda kullanıcı, ofis çalışanından farklı koşullarda çalışır: eldivenle, gürültülü ortamda, kısa sürede. Tasarımın bu gerçeğe uyması gerekir; masaüstü mantığıyla kurgulanmış bir arayüz sahada kullanılmaz ve proje kısa sürede terk edilir. Uygulamayı tasarlamadan önce sahayı görmeyi ve gerçek kullanıcıyla konuşmayı tercih ediyoruz.' },
      // ek-bolum
      { h2: 'Bakım ve Kalite Süreçlerinin Dijitalleşmesi', body: 'Periyodik bakım ve kalite kontrol süreçleri hâlâ birçok tesiste kâğıt formlarla yürür. Bu formların dijitalleşmesi yalnızca kâğıt tasarrufu değil; kayıtların anında erişilebilir, geriye dönük sorgulanabilir ve fotoğrafla belgelenebilir olması anlamına gelir. Denetim ve belgelendirme süreçlerinde bu erişilebilirlik ciddi zaman kazandırır. Ayrıca eksik doldurulan formlar sistem tarafından engellenebildiği için veri kalitesi kâğıda göre belirgin biçimde yükselir.' },
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
      { question: 'Sahada internet zayıf, uygulama çalışır mı?', answer: 'Çevrimdışı çalışacak biçimde tasarlanırsa evet. Kayıtlar cihazda tutulur, bağlantı sağlandığında sunucuya aktarılır. Fabrika ortamlarında bu gereksinim çok yaygın olduğu için projeyi baştan bu varsayımla planlıyoruz.' },
      { question: 'Kaç kullanıcıya kadar ölçeklenebilir?', answer: 'Kullanıcı sayısı genellikle sınırlayıcı bir etken olmaz; mimari baştan doğru kurulduğunda vardiya bazlı yüzlerce kullanıcı sorunsuz desteklenir. Belirleyici olan kullanıcı sayısından çok, saniyede işlenen kayıt hacmi ve raporlama yüküdür; bu ihtiyaç proje başında ölçülür.' },
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
