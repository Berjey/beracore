import type { NextConfig } from 'next';

// Content-Security-Policy — site tamamen self-hosted (harici script/font/görsel yok).
// script/style 'unsafe-inline': inline JSON-LD, GSAP inline stilleri ve Next hydration
// için gerekli; nonce yerine bunu kullanıyoruz ki sayfalar statik (SSG) kalsın.
// GA yapılandırılmışsa (NEXT_PUBLIC_GA_ID) CSP'ye yalnızca gerekli Google alan adlarını ekle.
// ID yoksa CSP tam sıkı kalır (harici hiçbir origin'e izin verilmez).
const ga = process.env.NEXT_PUBLIC_GA_ID
  ? { script: ' https://www.googletagmanager.com', conn: ' https://www.google-analytics.com https://www.googletagmanager.com', img: ' https://www.google-analytics.com https://www.googletagmanager.com' }
  : { script: '', conn: '', img: '' };

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${ga.script}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${ga.img}`,
  "font-src 'self' data:",
  `connect-src 'self'${ga.conn}`,
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join('; ');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // X-Powered-By: Next.js ifşasını kaldır
  // Deploy sırasında build çıktısı ÇALIŞAN sunucunun `.next` dizininin üzerine
  // yazılırsa, o an sayfa isteyen ziyaretçi eski manifest'e göre artık var olmayan
  // chunk'ları ister ve 500 alır. server-deploy.sh bu değişkeni `.next-build` yapıp
  // derlemeyi ayrı dizinde bitirir, sonra tek bir `mv` ile takas eder.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          // Köken izolasyonu (Lighthouse "Best Practices"): başka origin'lerin
          // window referansıyla bu sekmeye erişmesini engeller. Sitede OAuth/ödeme
          // popup akışı yok, dış bağlantılar zaten rel="noopener" ile açılıyor.
          // NOT: HSTS / X-Content-Type-Options / X-Frame-Options / Referrer-Policy /
          // Permissions-Policy başlıkları VPS'te nginx tarafından ekleniyor
          // (sites-available/beracore.com) — burada tekrar edilmez, çift başlık olmasın.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable persistent cache to prevent stale module errors
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
