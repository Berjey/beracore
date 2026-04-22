export type KvkkSection = {
  title: string;
  body: string | string[];
};

export const kvkkMeta = {
  title: 'KVKK Aydınlatma Metni',
  accent: 'Yasal — 6698 Sayılı Kanun',
  lastUpdated: 'Nisan 2026',
  intro:
    '6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla BERACORE tarafından hazırlanan aydınlatma metnidir. Kişisel verilerinizin işlenme esaslarını ve haklarınızı bu metinde bulabilirsiniz.',
};

export const kvkkSections: KvkkSection[] = [
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
];
