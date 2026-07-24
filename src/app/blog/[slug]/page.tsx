import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts, getPostBySlug } from '@/lib/blog-data';
import BlogArticle from '@/components/BlogArticle';

const BASE_URL = 'https://beracore.com';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${BASE_URL}/blog/${slug}`;
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: 'article',
      locale: 'tr_TR',
      siteName: 'BERACORE',
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      images: [{ url: '/beracore-bg.png', width: 600, height: 392, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
      images: ['/beracore-bg.png'],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${BASE_URL}/blog/${slug}`;

  // İlgili yazılar: önce aynı kategori, yetmezse diğerleriyle tamamla (maks 3)
  const sameCat = blogPosts.filter((p) => p.slug !== slug && p.category === post.category);
  const others = blogPosts.filter((p) => p.slug !== slug && p.category !== post.category);
  const relatedPosts = [...sameCat, ...others].slice(0, 3);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    image: `${BASE_URL}/beracore-bg.png`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: 'tr-TR',
    articleSection: post.category,
    author: { '@type': 'Organization', name: post.author, url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'BERACORE',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/beracore.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <BlogArticle post={post} relatedPosts={relatedPosts} />
    </>
  );
}
