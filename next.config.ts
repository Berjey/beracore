import type { NextConfig } from 'next';

// Content-Security-Policy — site tamamen self-hosted (harici script/font/görsel yok).
// script/style 'unsafe-inline': inline JSON-LD, GSAP inline stilleri ve Next hydration
// için gerekli; nonce yerine bunu kullanıyoruz ki sayfalar statik (SSG) kalsın.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value: csp }],
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
