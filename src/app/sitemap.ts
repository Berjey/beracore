import type { MetadataRoute } from 'next';
import { services } from '@/lib/services-data';
// Sitemap de veritabanindan okur: panelden eklenen bir yazi sitemap'e
// girmezse arama motoru onu gec kesfeder.
import { getBlogPosts, getCityPages, getCityLastMod } from '@/lib/db/content';
import { CITY_CONTENT_UPDATED } from '@/lib/city-pages-data';
import { SITE_URL } from '@/lib/seo';

/**
 * `lastmod` KURALI — build zamanı (`new Date()`) ASLA kullanılmaz.
 *
 * Eskiden 62 giriş `now` yazıyordu; içerik değişmese bile her deploy tüm siteyi
 * "bugün güncellendi" ilan ediyordu. Google'ın belgelenmiş davranışı: lastmod
 * güvenilmez bulunursa yok sayılır (hatta sitemap genelinde). 24 Tem 2026 GSC
 * durumu 9 dizinde / 36 "Discovered - currently not indexed" iken, tarama
 * önceliklendirmesini etkileyebilecek bu sinyali boşa harcamak pahalıya geliyordu.
 *
 * Kural: bir girişin GERÇEK bir içerik tarihi varsa yazılır; yoksa `lastModified`
 * HİÇ verilmez. Google eksik lastmod'da kendi sinyallerine döner — yanlış tarih
 * vermekten kesinlikle daha iyidir.
 *   • blog     → post.updatedAt ?? post.publishedAt (gerçek, yazı başına)
 *   • şehir    → CITY_CONTENT_UPDATED (elle güncellenen sabit)
 *   • statik + hizmet → tarih yok (bu sayfaların içerik tarihi takip edilmiyor)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    // Sondaki eğik çizgi yok — canonical etiketi de `https://beracore.com` üretiyor,
    // ikisinin birebir eşleşmesi gerekir.
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/hakkimizda`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/iletisim`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/kvkk`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/gizlilik-politikasi`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/cerez-politikasi`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/kullanim-kosullari`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const serviceEntries: MetadataRoute.Sitemap = [];
  services.forEach((service) => {
    // Kategori hub sayfası
    serviceEntries.push({
      url: `${SITE_URL}/hizmetler/${service.key}`,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
    // Alt hizmet sayfaları
    service.subServices.forEach((sub) => {
      serviceEntries.push({
        url: `${SITE_URL}/hizmetler/${service.key}/${sub.slug}`,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  });

  const blogEntries: MetadataRoute.Sitemap = getBlogPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // `lastmod` artık SAYFA BAŞINA. Önceden 24 sayfa elle yönetilen tek bir sabiti
  // paylaşıyordu; bir şehri düzenleyince diğer 23'ü de "güncellendi" görünüyordu.
  // İçerik panele taşındığı için her sayfa kendi tarihini taşıyabilir; veritabanı
  // okunamazsa eski sabite düşülür.
  const cityEntries: MetadataRoute.Sitemap = getCityPages().map((p) => ({
    url: `${SITE_URL}/${p.citySlug}/${p.slug}`,
    lastModified: getCityLastMod(p.citySlug, p.slug) ?? CITY_CONTENT_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticEntries, ...serviceEntries, ...blogEntries, ...cityEntries];
}
