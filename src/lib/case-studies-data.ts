// Vaka çalışmaları / portfolyo.
// Route: /calismalarimiz  ve  /calismalarimiz/[slug]
//
// ÖNEMLİ: Buradaki içerik gerçek müşteri projelerine dayanır. Uydurma metrik EKLENMEZ.
// Müşterinin kendi ifadesi `quote` alanında, alıntı olarak verilir; ölçülebilir rakam
// paylaşılmak istenirse müşteriden yazılı onay alındıktan sonra `results` alanına eklenir.

export interface CaseStudy {
  slug: string;
  /** Müşteri / marka adı */
  brand: string;
  /** Kart ve H1 başlığı */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Kart üzerindeki kısa tanım */
  summary: string;
  /** Hizmet etiketi — kartlarda filtre/rozet olarak görünür */
  category: string;
  /** Projede kullanılan teknoloji / yaklaşım etiketleri */
  tags: string[];
  /** Yıl — belirsizse boş bırakılabilir */
  year?: string;
  /** Müşterinin çözmek istediği problem */
  challenge: string;
  /** Yaptığımız iş — maddeler */
  approach: string[];
  /** Sonuçlar — SADECE müşterinin teyit ettiği ifadeler. Rakam uydurulmaz. */
  outcome: string;
  /** Müşteri yorumu (Testimonials ile aynı kaynak) */
  quote?: { text: string; name: string; role: string };
  /** İlgili hizmet sayfası iç linki */
  serviceHref: string;
  serviceLabel: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'gmsgarage-oto-galeri-yonetim-paneli',
    brand: 'GmsGarage',
    title: 'GmsGarage — Oto Galeri Web Sitesi ve Yönetim Paneli',
    metaTitle: 'GmsGarage Vaka Çalışması: Oto Galeri Yönetim Paneli | BERACORE',
    metaDescription:
      'Oto galeri için geliştirilen özel yönetim paneli ve kurumsal web sitesi. Araç stoğu, müşteri görüşmeleri ve finans takibi tek ekranda. BERACORE vaka çalışması.',
    summary:
      'Araç stoğu, müşteri görüşmeleri ve finans takibini tek ekrana taşıyan özel yönetim paneli ve hızlı, SEO altyapılı kurumsal web sitesi.',
    category: 'Web & Özel Yazılım',
    tags: ['Özel Yazılım', 'Yönetim Paneli', 'Kurumsal Web', 'SEO Altyapısı'],
    challenge:
      'Oto galeri işletmeciliğinde araç stoğu, müşteri görüşmeleri ve finans takibi genellikle birbirinden kopuk araçlarla — tablolar, not defterleri ve telefon kayıtlarıyla — yürütülür. Bu dağınıklık hem zaman kaybı üretir hem de hangi aracın hangi müşteriyle konuşulduğunun izini kaybettirir. GmsGarage’ın ihtiyacı, işletmenin tamamını tek ekrandan görebileceği bir sistem ve bu sistemle uyumlu, arama motorlarında bulunabilen modern bir web sitesiydi.',
    approach: [
      'Galeri iş akışının uçtan uca çıkarılması: araç girişinden satış kapanışına kadar tüm adımların haritalanması',
      'Araç stok yönetimi: envanter kaydı, durum takibi ve görsel yönetimi',
      'Müşteri görüşme takibi: hangi müşterinin hangi araçla ilgilendiğinin kayıt altına alınması',
      'Finans takibi: alım-satım ve gider kalemlerinin tek ekranda izlenmesi',
      'Kurumsal web sitesi: mobil öncelikli, hızlı ve SEO altyapısı baştan kurulmuş yapı',
      'Web sitesindeki araç listelerinin panelle bağlanması — çift veri girişinin ortadan kaldırılması',
      'İletişim formu ve dönüşüm noktalarının ölçülebilir biçimde kurgulanması',
    ],
    outcome:
      'İşletme, daha önce farklı araçlara dağılmış olan üç ayrı süreci — stok, müşteri ve finans — tek panelden yönetir hale geldi. Web sitesi tarafında ise organik trafikten gelen iletişim formu dönüşümlerinde artış müşteri tarafından teyit edildi.',
    quote: {
      text:
        'Galeriye özel geliştirilen yönetim paneli sayesinde araç stoğumuzu, müşteri görüşmelerini ve finans takibini tek ekrandan yönetiyoruz. Modern ve hızlı web sitemiz üzerinden gelen organik trafik ile iletişim formu dönüşümleri ciddi oranda arttı. BERACORE’un süreç boyunca gösterdiği şeffaflık ve hızlı iletişim fark yarattı.',
      name: 'Ertuğrul Atalay',
      role: 'Kurucu, GmsGarage',
    },
    serviceHref: '/hizmetler/software/ozel-yazilim',
    serviceLabel: 'Özel Yazılım hizmetimiz',
  },

  {
    slug: 'arovela-e-ticaret-ve-dijital-pazarlama',
    brand: 'Arovela',
    title: 'Arovela — E-Ticaret Altyapısı ve Dijital Pazarlama',
    metaTitle: 'Arovela Vaka Çalışması: E-Ticaret ve Dijital Pazarlama | BERACORE',
    metaDescription:
      'Sıfırdan kurgulanan e-ticaret altyapısı ve baştan yapılandırılan dijital pazarlama süreci. Ölçülebilir kampanya yönetimi. BERACORE vaka çalışması.',
    summary:
      'Sıfırdan kurulan e-ticaret altyapısı ve baştan yapılandırılan dijital pazarlama süreci; her kampanyanın getirisinin ölçülebildiği bir yapı.',
    category: 'E-Ticaret & Pazarlama',
    tags: ['E-Ticaret Yazılım', 'Ödeme Entegrasyonu', 'Dijital Pazarlama', 'Dönüşüm Optimizasyonu'],
    challenge:
      'Yeni bir e-ticaret markasının önündeki iki sorun aynı anda çözülmek zorundaydı: satışın teknik olarak sorunsuz gerçekleşeceği bir altyapı ve o altyapıya doğru kitleyi getirecek bir pazarlama kurgusu. Bu ikisi ayrı ayrı ele alındığında sık görülen sonuç şudur: ya trafik gelir ama site satışa çeviremez, ya da site hazırdır fakat kimse ulaşamaz. Arovela’da hedef, ikisini tek bir plan içinde kurmaktı.',
    approach: [
      'E-ticaret altyapısının sıfırdan kurgulanması: ürün, stok ve sipariş yapısının tasarlanması',
      'Ödeme akışının kurulumu ve güvenli ödeme deneyimi',
      'Sepet ve ödeme adımlarının terk oranını düşürecek biçimde sadeleştirilmesi',
      'Mobil öncelikli ürün ve kategori sayfası tasarımı',
      'Dijital pazarlama süreçlerinin baştan yapılandırılması',
      'Ölçümleme kurulumu: hangi kampanyanın ne getirdiğinin izlenebilmesi',
      'Kampanya sonuçlarına göre yinelemeli iyileştirme döngüsü',
    ],
    outcome:
      'Lansman sonrası ilk üç aylık dönemde satış büyümesi ve sepet terk oranında düşüş müşteri tarafından teyit edildi. Kurulan ölçümleme yapısı sayesinde kampanya getirileri tahmine değil veriye dayanarak değerlendirilebiliyor.',
    quote: {
      text:
        'E-ticaret altyapımızı sıfırdan kurgulayıp dijital pazarlama süreçlerimizi baştan yapılandırdık. Lansmanın ardından ilk üç ayda satışlarımız gözle görülür biçimde büyüdü, sepet terk oranımız belirgin şekilde düştü. Veri odaklı yaklaşımları sayesinde her kampanyanın getirisini net olarak ölçebiliyoruz.',
      name: 'Enes Çağlar',
      role: 'Kurucu Ortak, Arovela',
    },
    serviceHref: '/hizmetler/ecommerce/e-ticaret-yazilim',
    serviceLabel: 'E-Ticaret Yazılım hizmetimiz',
  },

  {
    slug: 'kriptomall-mobil-uygulama-ui-ux',
    brand: 'KriptoMall',
    title: 'KriptoMall — Mobil Uygulama ve UI/UX Geliştirme',
    metaTitle: 'KriptoMall Vaka Çalışması: Mobil Uygulama ve UI/UX | BERACORE',
    metaDescription:
      'Mobil uygulama ve web platformu için yeniden kurgulanan kullanıcı yolculuğu ve disiplinli tasarım sistemi. BERACORE vaka çalışması.',
    summary:
      'Mobil uygulama ve web platformunun kullanıcı yolculuğunun sıfırdan kurgulanması ve yeni özelliklerin hızlı yayınlanmasını sağlayan tasarım sistemi.',
    category: 'Mobil & UI/UX',
    tags: ['UI/UX Tasarım', 'Mobil Uygulama', 'Tasarım Sistemi', 'Kullanıcı Yolculuğu'],
    challenge:
      'Hem mobil uygulaması hem web platformu olan ürünlerde en sık görülen sorun, iki yüzeyin zamanla birbirinden ayrışmasıdır: aynı işlem iki platformda farklı akıyor, her yeni özellik sıfırdan tasarlanıyor ve kullanıcı tutarsız bir deneyimle karşılaşıyor. KriptoMall’da hedef, kullanıcı yolculuğunu yeniden kurgulamak ve bunu tek seferlik bir tasarım işi olarak değil, sürdürülebilir bir sisteme dönüştürmekti.',
    approach: [
      'Mevcut kullanıcı yolculuğunun çözümlenmesi ve sürtünme noktalarının tespiti',
      'Kritik akışların (kayıt, işlem, gezinme) sıfırdan yeniden kurgulanması',
      'Mobil ve web yüzeylerinin tutarlı bir deneyimde birleştirilmesi',
      'Tasarım sistemi kurulumu: bileşen kütüphanesi, tipografi ve renk ölçeği',
      'Yeni özelliklerin sistemden türetilebilmesi için tasarım-geliştirme ortak dili',
      'Erişilebilirlik ve mobil kullanılabilirlik gözetimi',
    ],
    outcome:
      'Mobil aktif kullanıcı oranında artış müşteri tarafından teyit edildi. Kurulan tasarım sistemi sayesinde yeni özellikler daha hızlı ve platformlar arasında tutarlı biçimde yayınlanabiliyor.',
    quote: {
      text:
        'Mobil uygulamamızın ve web platformumuzun UI/UX tasarımını BERACORE üstlendi. Kullanıcı yolculuğunu sıfırdan yeniden kurguladılar; mobil aktif kullanıcı oranımız belirgin şekilde arttı. Disiplinli tasarım sistemleri sayesinde yeni özellikleri çok daha hızlı ve tutarlı şekilde yayınlıyoruz.',
      name: 'Ürün Ekibi',
      role: 'Ürün & Teknoloji, KriptoMall',
    },
    serviceHref: '/hizmetler/design/ui-ux-tasarim',
    serviceLabel: 'UI/UX Tasarım hizmetimiz',
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
