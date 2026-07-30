import type { MetadataRoute } from 'next';
import { services } from '@/lib/services-data';
import { blogPosts } from '@/lib/blog-data';
import { cityPages } from '@/lib/city-pages-data';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    // Sondaki eğik çizgi yok — canonical etiketi de `https://beracore.com` üretiyor,
    // ikisinin birebir eşleşmesi gerekir.
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/hakkimizda`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/iletisim`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/kvkk`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/gizlilik-politikasi`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/cerez-politikasi`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/kullanim-kosullari`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const serviceEntries: MetadataRoute.Sitemap = [];
  services.forEach((service) => {
    // Kategori hub sayfası
    serviceEntries.push({
      url: `${SITE_URL}/hizmetler/${service.key}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
    // Alt hizmet sayfaları
    service.subServices.forEach((sub) => {
      serviceEntries.push({
        url: `${SITE_URL}/hizmetler/${service.key}/${sub.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  });

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const cityEntries: MetadataRoute.Sitemap = cityPages.map((p) => ({
    url: `${SITE_URL}/${p.citySlug}/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticEntries, ...serviceEntries, ...blogEntries, ...cityEntries];
}
