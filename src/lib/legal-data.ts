/**
 * Hukuki metinlerin TOHUM (seed) kaynagi — saf veri, istemci guvenli.
 *
 * Faz 1.5'e kadar bu metinler uc ayri `page.tsx` dosyasinin icinde satir ici
 * dizilerdeydi; KVKK ise `kvkk-data.ts`'te. Hukuki bir metnin ne zaman yururluge
 * girdigi, kimin onayladigi ve neyin degistigi HICBIR YERDE kayitli degildi
 * (denetim bulgusu A-11) — oysa KVKK aydinlatma metninde bu bilgi, uyusmazlik
 * halinde "o tarihte hangi metin gecerliydi" sorusunun tek cevabidir.
 *
 * Artik icerik veritabaninda (`content_pages`, tip='yasal') ve her kaydetme
 * `content_versions`'a yururluk tarihi + degisiklik notu + onaylayan ile yazilir.
 * Bu dosya tohum ve GERI DUSME kaynagi olarak kalir.
 */

export type LegalSection = {
  title: string;
  body: string | string[];
};

export interface LegalDoc {
  slug: string;
  title: string;
  accent: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Sayfada gorunen serbest metin (or. "Nisan 2026"). */
  lastUpdated: string;
  /** Makine tarihi (YYYY-AA-GG) — revizyon gecmisi icin. */
  yururluk: string;
  sections: LegalSection[];
}

export const legalDocs: LegalDoc[] = [
  {
    slug: 'kvkk',
    title: 'KVKK Aydınlatma Metni',
    accent: 'Yasal — 6698 Sayılı Kanun',
    metaTitle: 'KVKK Aydınlatma Metni | BERACORE',
    metaDescription: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında BERACORE Aydınlatma Metni.',
    intro: '6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla BERACORE tarafından hazırlanan aydınlatma metnidir. Kişisel verilerinizin işlenme esaslarını ve haklarınızı bu metinde bulabilirsiniz.',
    // Gorunen "son guncelleme" metni ile makine tarihi AYRI tutulur:
    // sayfada eskiden beri "Nisan 2026" yaziyor ve tasima bunu degistirmemeli.
    // `yururluk` ise revizyon gecmisi ve surum karsilastirmasi icin gereklidir.
    lastUpdated: 'Nisan 2026',
    yururluk: '2026-04-01',
    sections: [
  {
    title: 'Veri Sorumlusu',
    body: 'İşbu aydınlatma metni; 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla BERACORE (İstanbul, Türkiye) tarafından, kişisel verilerin işlenmesine ilişkin usul ve esasları açıklamak amacıyla hazırlanmıştır.',
  },
  {
    title: 'İşlenen Kişisel Veri Kategorileri',
    body: [
      'Kimlik bilgileri (ad, soyad).',
      'İletişim bilgileri (e-posta, telefon, iletişim formu içerikleri).',
      'Müşteri işlem bilgileri (teklif talepleri, sözleşme süreçlerine ilişkin yazışmalar).',
      'İşlem güvenliği bilgileri (IP adresi, log kayıtları, oturum bilgileri).',
      'Pazarlama bilgileri (çerez, alışkanlık ve tercih verileri — açık rızanıza bağlı).',
    ],
  },
  {
    title: 'Kişisel Verilerin İşlenme Amaçları',
    body: [
      'Sunulan hizmetlerin yürütülmesi ve sözleşme ilişkisinin kurulması.',
      'Teklif, müşteri ve iş geliştirme süreçlerinin yönetimi.',
      'Yasal yükümlülüklerin yerine getirilmesi ve hukuki taleplerin takibi.',
      'Bilgi güvenliği süreçlerinin yönetimi ve yetkisiz erişimlerin önlenmesi.',
      'Ürün ve hizmet kalitesinin ölçülmesi, geliştirilmesi ve kullanıcı deneyiminin iyileştirilmesi.',
    ],
  },
  {
    title: 'İşlemenin Hukuki Sebepleri',
    body: 'Kişisel verileriniz; KVKK\'nın 5. ve 6. maddelerinde yer alan sözleşmenin kurulması ve ifası, hukuki yükümlülüğün yerine getirilmesi, meşru menfaat ve ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla açık rıza hukuki sebeplerine dayanılarak işlenmektedir.',
  },
  {
    title: 'Kişisel Verilerin Aktarımı',
    body: 'Kişisel verileriniz; hizmet alınan altyapı ve bulut sağlayıcıları, bağımsız denetim firmaları, hukuk ve mali müşavirlik hizmeti veren iş ortakları ile yasal olarak yetkili kamu kurum ve kuruluşlarına KVKK\'nın 8. ve 9. maddelerine uygun biçimde, yalnızca gerekli olduğu ölçüde aktarılabilir.',
  },
  {
    title: 'Kişisel Verilerin Toplanma Yöntemi',
    body: 'Kişisel veriler; web sitemiz üzerindeki formlar, e-posta yazışmaları, telefon görüşmeleri, sözleşme süreçleri ve çerezler aracılığıyla otomatik veya kısmen otomatik yöntemlerle toplanmaktadır.',
  },
  {
    title: 'İlgili Kişinin Hakları (KVKK Madde 11)',
    body: [
      'Kişisel verilerin işlenip işlenmediğini öğrenme.',
      'İşlenmişse buna ilişkin bilgi talep etme.',
      'Verilerin işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme.',
      'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme.',
      'Eksik veya yanlış işlenmiş olması halinde düzeltilmesini, silinmesini veya yok edilmesini isteme.',
      'İşlemenin otomatik sistemlerle yapılması sonucunda aleyhinize bir sonuç doğması halinde buna itiraz etme.',
      'Zarara uğramanız halinde zararın giderilmesini talep etme.',
    ],
  },
  {
    title: 'Başvuru Yöntemi',
    body: 'KVKK\'dan doğan haklarınızı kullanmak için kimliğinizi tevsik edici belgelerle birlikte talebinizi içeren yazılı başvurunuzu info@beracore.com adresi üzerinden veya Kurul\'un belirlediği diğer yöntemlerle iletebilirsiniz. Talepleriniz, mevzuatın öngördüğü süre içerisinde değerlendirilerek tarafınıza yanıt verilir.',
  },
],
  },
  {
    slug: 'gizlilik-politikasi',
    title: 'Gizlilik Politikası',
    accent: 'Yasal',
    metaTitle: 'Gizlilik Politikası | BERACORE',
    metaDescription: 'BERACORE gizlilik politikası: Kişisel verilerinizin toplanma, işlenme ve korunma esaslarına ilişkin bilgilendirme.',
    intro: 'Kişisel verilerinizin gizliliğine ve güvenliğine verdiğimiz önem doğrultusunda; hangi verileri topladığımızı, nasıl işlediğimizi ve haklarınızı şeffaf biçimde açıklıyoruz.',
    // Gorunen "son guncelleme" metni ile makine tarihi AYRI tutulur:
    // sayfada eskiden beri "Nisan 2026" yaziyor ve tasima bunu degistirmemeli.
    // `yururluk` ise revizyon gecmisi ve surum karsilastirmasi icin gereklidir.
    lastUpdated: 'Nisan 2026',
    yururluk: '2026-04-01',
    sections: [
  {
    title: 'Genel Bilgilendirme',
    body: 'BERACORE ("biz", "şirket"), kullanıcılarının ve ziyaretçilerinin gizliliğine önem verir. İşbu Gizlilik Politikası; web sitemiz, hizmetlerimiz ve dijital platformlarımız aracılığıyla topladığımız kişisel verilerin nasıl işlendiğini, korunduğunu ve kimlerle paylaşıldığını açıklar.',
  },
  {
    title: 'Toplanan Kişisel Veriler',
    body: [
      'Kimlik ve iletişim verileri: ad, soyad, e-posta adresi, telefon numarası, şirket bilgisi.',
      'Teknik veriler: IP adresi, tarayıcı türü, ziyaret edilen sayfalar, cihaz bilgisi.',
      'Form ve mesaj verileri: teklif talep formu, iletişim formu ve müşteri destek mesajları aracılığıyla ilettiğiniz içerikler.',
      'Çerez tabanlı veriler: oturum, tercih ve analitik amaçlı çerez verileri (detay için Çerez Politikamıza bakınız).',
    ],
  },
  {
    title: 'Verilerin İşlenme Amaçları',
    body: [
      'Taleplerinize yanıt vermek ve teklif süreçlerini yürütmek.',
      'Sözleşme ilişkisini kurmak, sürdürmek ve yükümlülüklerimizi yerine getirmek.',
      'Web sitemizin performansını, güvenliğini ve kullanıcı deneyimini iyileştirmek.',
      'Yasal yükümlülüklerimizi karşılamak ve olası hukuki uyuşmazlıklarda savunmamızı sağlamak.',
    ],
  },
  {
    title: 'Verilerin Paylaşımı',
    body: 'Kişisel verileriniz; yalnızca hizmetin ifası için gerekli olan hallerde ve yürürlükteki mevzuatın gerektirdiği kapsamda bulut hizmet sağlayıcıları, altyapı ortakları, hukuki danışmanlar ve resmi kurumlarla sınırlı olarak paylaşılabilir. Rızanız olmaksızın üçüncü taraflarla ticari amaçla paylaşılmaz veya satılmaz.',
  },
  {
    title: 'Veri Saklama Süresi',
    body: 'Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve yürürlükteki mevzuatın öngördüğü zamanaşımı sürelerince saklanır. Amaç ortadan kalktığında verileriniz silinir, yok edilir veya anonim hale getirilir.',
  },
  {
    title: 'Veri Güvenliği',
    body: 'BERACORE; kişisel verilerin yetkisiz erişim, ifşa, değiştirme veya imha riskine karşı uygun teknik ve idari tedbirleri alır. Güncel şifreleme protokolleri, erişim yönetimi, düzenli güvenlik denetimleri ve sızma testleri standart operasyonumuzdur.',
  },
  {
    title: 'Haklarınız',
    body: 'KVKK ve ilgili mevzuat kapsamında; verilerinizin işlenip işlenmediğini öğrenme, işlenen verilere erişme, düzeltme, silme, aktarımın engellenmesi ve otomatik karar alma süreçlerine itiraz etme haklarına sahipsiniz. Detaylı bilgi için KVKK Aydınlatma Metni sayfamızı inceleyebilirsiniz.',
  },
  {
    title: 'İletişim',
    body: 'Gizlilik politikamıza ilişkin sorularınız için info@beracore.com adresi üzerinden bizimle iletişime geçebilirsiniz. Bu politika, ihtiyaç halinde güncellenebilir; güncel versiyon her zaman bu sayfada yayımlanır.',
  },
],
  },
  {
    slug: 'cerez-politikasi',
    title: 'Çerez Politikası',
    accent: 'Yasal',
    metaTitle: 'Çerez Politikası | BERACORE',
    metaDescription: 'BERACORE web sitesinde kullanılan çerezler, türleri, amaçları ve kullanıcı tercihlerinin yönetimi hakkında bilgiler.',
    intro: 'Web sitemizde kullandığımız çerezler, türleri, amaçları ve tercihlerinizi nasıl yönetebileceğiniz hakkında şeffaf bir özet.',
    // Gorunen "son guncelleme" metni ile makine tarihi AYRI tutulur:
    // sayfada eskiden beri "Nisan 2026" yaziyor ve tasima bunu degistirmemeli.
    // `yururluk` ise revizyon gecmisi ve surum karsilastirmasi icin gereklidir.
    lastUpdated: 'Nisan 2026',
    yururluk: '2026-04-01',
    sections: [
  {
    title: 'Çerez Nedir?',
    body: 'Çerezler (cookies); ziyaret ettiğiniz web sitesi tarafından tarayıcınıza yerleştirilen küçük metin dosyalarıdır. Web sitesinin doğru çalışmasını, tercihlerinizin hatırlanmasını ve kullanım deneyiminin iyileştirilmesini sağlarlar.',
  },
  {
    title: 'Kullandığımız Çerez Türleri',
    body: [
      'Zorunlu çerezler: Web sitesinin temel işlevlerinin çalışması için gereklidir; devre dışı bırakılamaz.',
      'İşlevsel çerezler: Dil, tema ve oturum gibi kullanıcı tercihlerinin hatırlanmasını sağlar.',
      'Performans ve analitik çerezler: Ziyaretçi davranışlarını anonim olarak analiz ederek site performansını iyileştirmeye yardımcı olur.',
      'Pazarlama çerezleri: Açık rızanızla, ilginizi çekebilecek içerik ve kampanyaları sunmak amacıyla kullanılır.',
    ],
  },
  {
    title: 'Çerezlerin Saklanma Süresi',
    body: 'Çerezler, oturum çerezleri ve kalıcı çerezler olarak iki ana grupta saklanır. Oturum çerezleri tarayıcınızı kapattığınızda silinir; kalıcı çerezler ise belirlenen süre boyunca cihazınızda kalır veya siz temizleyene kadar saklanır.',
  },
  {
    title: 'Üçüncü Taraf Çerezleri',
    body: 'Web sitemizde analitik, performans ölçümü ve içerik entegrasyonu amacıyla Google Analytics gibi üçüncü taraf hizmetleri kullanılabilir. Bu hizmetler, kendi gizlilik politikalarına tabidir ve ilgili hizmet sağlayıcının web sitesinden incelenebilir.',
  },
  {
    title: 'Çerez Tercihlerinin Yönetimi',
    body: [
      'Tarayıcı ayarlarınızdan çerezleri silebilir, engelleyebilir veya belirli sitelere özel izin verebilirsiniz.',
      'Zorunlu olmayan çerezleri devre dışı bırakmanız, web sitesinin bazı özelliklerinin beklenmedik şekilde çalışmasına yol açabilir.',
      'Açık rıza kapsamındaki pazarlama ve analitik çerezleri, ilgili çerez bildirimimiz üzerinden reddedebilir veya daha sonra tarayıcı ayarlarınızdan güncelleyebilirsiniz.',
    ],
  },
  {
    title: 'Değişiklikler',
    body: 'Bu çerez politikası; hizmet ve teknoloji güncellemelerine bağlı olarak dönem dönem revize edilebilir. Güncel politika her zaman bu sayfada yayımlanır; önemli değişikliklerde kullanıcılarımızı ayrıca bilgilendiririz.',
  },
  {
    title: 'İletişim',
    body: 'Çerez uygulamalarımıza ilişkin sorularınız veya talepleriniz için info@beracore.com adresi üzerinden bize ulaşabilirsiniz.',
  },
],
  },
  {
    slug: 'kullanim-kosullari',
    title: 'Kullanım Koşulları',
    accent: 'Yasal',
    metaTitle: 'Kullanım Koşulları | BERACORE',
    metaDescription: 'BERACORE web sitesi ve hizmetlerinin kullanımına ilişkin koşullar, tarafların hak ve yükümlülükleri.',
    intro: 'BERACORE web sitesi ve dijital hizmetlerinin kullanımına ilişkin hak, yükümlülük ve sorumlulukları düzenleyen metindir. Lütfen dikkatle inceleyiniz.',
    // Gorunen "son guncelleme" metni ile makine tarihi AYRI tutulur:
    // sayfada eskiden beri "Nisan 2026" yaziyor ve tasima bunu degistirmemeli.
    // `yururluk` ise revizyon gecmisi ve surum karsilastirmasi icin gereklidir.
    lastUpdated: 'Nisan 2026',
    yururluk: '2026-04-01',
    sections: [
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
],
  },
];
