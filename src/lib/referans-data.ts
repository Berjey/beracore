/**
 * Musteri referanslarinin TOHUM (seed) kaynagi — saf veri, istemci guvenli.
 *
 * BU UC YORUM GERCEK MUSTERILERE AITTIR (kullanici 27 Tem 2026'da teyit etti) ve
 * zaten yayindadir. Uydurma referans EKLENMEZ — ne buraya ne de panele.
 *
 * Icerik Faz 1.4'te veritabanina tasindi; bu dosya tohum ve GERI DUSME kaynagidir.
 * Yeni referans panelden eklenir ve YAYIN IZNI olmadan yayinlanamaz.
 */

export interface Referans {
  brand: string;
  name: string;
  role: string;
  category: string;
  project: string;
  text: string;
}

export const referanslar: Referans[] = [
  {
    brand: 'GmsGarage',
    name: 'Ertuğrul Atalay',
    role: 'Kurucu',
    category: 'Web & Yönetim Paneli',
    project: 'Oto Galeri Web Sitesi ve Yönetim Paneli',
    text: 'Galeriye özel geliştirilen yönetim paneli sayesinde araç stoğumuzu, müşteri görüşmelerini ve finans takibini tek ekrandan yönetiyoruz. Modern ve hızlı web sitemiz üzerinden gelen organik trafik ile iletişim formu dönüşümleri ciddi oranda arttı. BERACORE\'un süreç boyunca gösterdiği şeffaflık ve hızlı iletişim fark yarattı.',
  },
  {
    brand: 'Arovela',
    name: 'Enes Çağlar',
    role: 'Kurucu Ortak',
    category: 'E-Ticaret & Pazarlama',
    project: 'E-Ticaret ve Dijital Pazarlama',
    text: 'E-ticaret altyapımızı sıfırdan kurgulayıp dijital pazarlama süreçlerimizi baştan yapılandırdık. Lansmanın ardından ilk üç ayda satışlarımız gözle görülür biçimde büyüdü, sepet terk oranımız belirgin şekilde düştü. Veri odaklı yaklaşımları sayesinde her kampanyanın getirisini net olarak ölçebiliyoruz.',
  },
  {
    brand: 'KriptoMall',
    name: 'Ürün Ekibi',
    role: 'Ürün & Teknoloji',
    category: 'Mobil Uygulama & UI/UX',
    project: 'Mobil Uygulama ve UI/UX Geliştirme',
    text: 'Mobil uygulamamızın ve web platformumuzun UI/UX tasarımını BERACORE üstlendi. Kullanıcı yolculuğunu sıfırdan yeniden kurguladılar; mobil aktif kullanıcı oranımız belirgin şekilde arttı. Disiplinli tasarım sistemleri sayesinde yeni özellikleri çok daha hızlı ve tutarlı şekilde yayınlıyoruz.',
  },
];
