import { Metadata } from 'next';
import { getSortedPosts, getUsedCategories, type BlogPost } from '@/lib/blog-data';
import BlogHome from '@/components/blog/BlogHome';
import ScrollProgress from '@/components/ScrollProgress';

const BLOG_SECTIONS = [
  { label: 'Giriş', sel: '#blog-hero' },
  { label: 'Son Yazılar', sel: '#blog-liste' },
  { label: 'Popüler', sel: '#blog-populer' },
  { label: 'İletişim', sel: '#blog-iletisim' },
];

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
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | BERACORE',
    description: 'Dijital deneyim, yapay zeka ve teknoloji üzerine uygulanabilir rehberler.',
    images: ['/beracore-bg.png'],
  },
};

export default function BlogIndexPage() {
  const posts = getSortedPosts();
  const categories = getUsedCategories();

  // "Popüler Konular" — analitik-güdümlü popülerlik verisi henüz yok; bunun yerine
  // her kategoriden en yeni yazı seçilir (konu çeşitliliği + huni kapsaması).
  // Not: admin/CRM fazında GA4 verisiyle gerçek popülerliğe bağlanabilir.
  const picks = categories
    .map((c) => posts.find((p) => p.category === c.name))
    .filter((p): p is BlogPost => Boolean(p))
    .slice(0, 6);

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
      ...(p.updatedAt ? { dateModified: p.updatedAt } : {}),
      author: { '@type': 'Organization', name: p.author },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ScrollProgress sections={BLOG_SECTIONS} />
      <BlogHome posts={posts} categories={categories} picks={picks} />
    </>
  );
}
