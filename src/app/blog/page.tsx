import { Metadata } from 'next';
import { toSummary, type BlogPost } from '@/lib/blog-data';
// İçerik veritabanından okunur; tablo boşsa/okunamazsa koddaki içeriğe düşer.
import { getSortedPosts, getUsedCategories } from '@/lib/db/content';
import BlogHome from '@/components/blog/BlogHome';
import ScrollProgress from '@/components/ScrollProgress';
import { SITE_URL, ogImages, twitterImages } from '@/lib/seo';

const BLOG_SECTIONS = [
  { label: 'Giriş', sel: '#blog-hero' },
  { label: 'Son Yazılar', sel: '#blog-liste' },
  { label: 'Popüler', sel: '#blog-populer' },
  { label: 'İletişim', sel: '#blog-iletisim' },
];

export const metadata: Metadata = {
  title: 'Blog | BERACORE — Dijital Deneyim ve Teknoloji',
  description:
    'Yapay zeka, web tasarımı, e-ticaret, yazılım ve dijital pazarlama üzerine uygulanabilir rehberler ve içgörüler. BERACORE blogu.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Blog | BERACORE',
    description: 'Dijital deneyim, yapay zeka ve teknoloji üzerine uygulanabilir rehberler.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'BERACORE',
    url: `${SITE_URL}/blog`,
    images: ogImages('BERACORE Blog'),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | BERACORE',
    description: 'Dijital deneyim, yapay zeka ve teknoloji üzerine uygulanabilir rehberler.',
    images: twitterImages,
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

  // Client bileşenine YALNIZCA özet geçilir — yazı gövdeleri (content/faq) RSC
  // payload'una girmesin. Ayrıntı: BlogPostSummary tanımındaki not.
  const postSummaries = posts.map(toSummary);
  const pickSummaries = picks.map(toSummary);

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'BERACORE Blog',
    url: `${SITE_URL}/blog`,
    inLanguage: 'tr-TR',
    publisher: { '@type': 'Organization', name: 'BERACORE', url: SITE_URL },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt,
      ...(p.updatedAt ? { dateModified: p.updatedAt } : {}),
      author: { '@type': 'Organization', name: p.author },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ScrollProgress sections={BLOG_SECTIONS} />
      <BlogHome posts={postSummaries} categories={categories} picks={pickSummaries} />
    </>
  );
}
