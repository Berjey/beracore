import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // `/_next/` BİLEREK engellenmez: Googlebot sayfayı render etmek için JS/CSS
        // varlıklarına erişmek zorundadır. Engellenirse "kaynaklar bloklandı" uyarısı
        // çıkar ve render edilen içerik eksik değerlendirilir.
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://beracore.com/sitemap.xml',
    host: SITE_URL,
  };
}
