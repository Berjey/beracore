import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable persistent cache to prevent stale module errors
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
