import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BERACORE — Digital Experience Studio',
    short_name: 'BERACORE',
    description:
      'Yapay zeka, blockchain, yazılım, tasarım ve dijital pazarlama alanlarında dijital deneyimler üreten stüdyo.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0d16',
    theme_color: '#0f0d16',
    lang: 'tr',
    dir: 'ltr',
    categories: ['business', 'technology', 'productivity'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
