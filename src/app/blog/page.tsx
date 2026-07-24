import { Metadata } from 'next';
import { getSortedPosts, getUsedCategories } from '@/lib/blog-data';
import BlogIndex from '@/components/BlogIndex';

const BASE_URL = 'https://beracore.com';

export const metadata: Metadata = {
  title: 'Blog | BERACORE — Dijital Deneyim ve Teknoloji',
  description:
    'Yapay zeka, web tasarımı, e-ticaret, yazılım ve dijital pazarlama üzerine uygulanabilir rehberler ve içgörüler. BERACORE blogu.',
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: 'Blog | BERACORE',
    description: 'Dijital deneyim, yapay zeka ve teknoloji üzerine uygulanabilir rehberler.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'BERACORE',
    url: `${BASE_URL}/blog`,
    images: [{ url: '/beracore-bg.png', width: 600, height: 392, alt: 'BERACORE Blog' }],
  },
};

export default function BlogIndexPage() {
  const posts = getSortedPosts();
  const categories = getUsedCategories();

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'BERACORE Blog',
    url: `${BASE_URL}/blog`,
    inLanguage: 'tr-TR',
    publisher: { '@type': 'Organization', name: 'BERACORE', url: BASE_URL },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${BASE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt,
      author: { '@type': 'Organization', name: p.author },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <BlogIndex posts={posts} categories={categories} />
    </>
  );
}
