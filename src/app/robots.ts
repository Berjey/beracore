import type { MetadataRoute } from 'next';

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
    host: 'https://beracore.com',
  };
}
