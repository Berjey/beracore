import type { MetadataRoute } from 'next';
import { services } from '@/lib/services-data';
import { blogPosts } from '@/lib/blog-data';
import { cityPages } from '@/lib/city-pages-data';

const BASE_URL = 'https://beracore.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    // Sondaki eğik çizgi yok — canonical etiketi de `https://beracore.com` üretiyor,
    // ikisinin birebir eşleşmesi gerekir.
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/hakkimizda`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/iletisim`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/kvkk`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/gizlilik-politikasi`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/cerez-politikasi`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/kullanim-kosullari`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const serviceEntries: MetadataRoute.Sitemap = [];
  services.forEach((service) => {
    // Kategori hub sayfası
    serviceEntries.push({
      url: `${BASE_URL}/hizmetler/${service.key}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
    // Alt hizmet sayfaları
    service.subServices.forEach((sub) => {
      serviceEntries.push({
        url: `${BASE_URL}/hizmetler/${service.key}/${sub.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  });

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const cityEntries: MetadataRoute.Sitemap = cityPages.map((p) => ({
    url: `${BASE_URL}/istanbul/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticEntries, ...serviceEntries, ...blogEntries, ...cityEntries];
}
