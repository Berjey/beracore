import type { MetadataRoute } from 'next';
import { services } from '@/lib/services-data';

const BASE_URL = 'https://beracore.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/hakkimizda`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/iletisim`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/kvkk`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/gizlilik-politikasi`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/cerez-politikasi`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/kullanim-kosullari`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const serviceEntries: MetadataRoute.Sitemap = [];
  services.forEach((service) => {
    service.subServices.forEach((sub) => {
      serviceEntries.push({
        url: `${BASE_URL}/hizmetler/${service.key}/${sub.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  });

  return [...staticEntries, ...serviceEntries];
}
