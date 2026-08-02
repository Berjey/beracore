import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPosts, getPostBySlug } from '@/lib/db/content';
import { getRelatedPosts } from '@/lib/related-posts';
import { cityPages } from '@/lib/city-pages-data';
import BlogArticle from '@/components/BlogArticle';
import { SITE_URL, OG_IMAGE_ABSOLUTE, ogImages, twitterImages } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${slug}`;
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
      images: ogImages(post.title),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
      images: twitterImages,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${slug}`;

  // İlgili yazılar: alaka + iç link eşitliği + tazelik (bkz. lib/related-posts.ts).
  // Yalnızca özet döner — yazı gövdeleri client payload'una girmez.
  // Liste geçilir: grafik veritabanındaki GÜNCEL yazı kümesine göre kurulmalı.
  const relatedPosts = getRelatedPosts(slug, getBlogPosts());

  // Bu yazıya bağlı şehir sayfası varsa bağlamsal iç link (yerel SEO).
  // Birden çok şehir aynı yazıya bağlı olabilir; ilk eşleşen (İstanbul) kullanılır.
  const cityMatch = cityPages.find((c) => c.blogHref === `/blog/${slug}`);
  const cityLink = cityMatch ? { href: `/${cityMatch.citySlug}/${cityMatch.slug}`, title: cityMatch.title } : null;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    image: OG_IMAGE_ABSOLUTE,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: 'tr-TR',
    articleSection: post.category,
    author: { '@type': 'Organization', name: post.author, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'BERACORE',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/beracore.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  const faqJsonLd = post.faq && post.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <BlogArticle post={post} relatedPosts={relatedPosts} cityLink={cityLink} />
    </>
  );
}
