import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blogPosts, getPostBySlug, type ContentBlock } from '@/lib/blog-data';

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

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}

function renderBlock(block: ContentBlock, i: number) {
  switch (block.type) {
    case 'h2':
      return <h2 key={i} className="font-body text-[clamp(1.4rem,3vw,1.9rem)] font-semibold text-t1 tracking-tight mt-12 mb-4">{block.text}</h2>;
    case 'h3':
      return <h3 key={i} className="font-body text-[1.2rem] font-semibold text-t1 mt-8 mb-3">{block.text}</h3>;
    case 'p':
      return <p key={i} className="font-body text-[1.02rem] text-t2 font-light leading-[1.8] mb-5">{block.text}</p>;
    case 'ul':
      return (
        <ul key={i} className="mb-6 space-y-2.5">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 font-body text-[1rem] text-t2 font-light leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <blockquote key={i} className="my-8 pl-6 border-l-2 border-accent/50 font-body text-[1.1rem] text-t1 font-light italic leading-relaxed">
          {block.text}
        </blockquote>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${BASE_URL}/blog/${slug}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    image: `${BASE_URL}/beracore-bg.png`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: 'tr-TR',
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

      <article className="relative pt-36 pb-28 px-6 max-md:pt-28 max-md:pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-body text-[0.78rem] text-t3">
              <li><Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
            </ol>
          </nav>

          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5 font-body text-[0.75rem] text-t3">
              <span className="px-2.5 py-1 rounded-full border border-white/[0.08] text-accent2/80">{post.category}</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} dk okuma</span>
            </div>
            <h1 className="font-heading text-[clamp(1.9rem,5vw,3rem)] font-semibold tracking-tight leading-[1.1]">
              {post.title}
            </h1>
          </header>

          <div className="blog-content">
            {post.content.map(renderBlock)}
          </div>

          {/* İlgili hizmet — huni girişi / iç link */}
          {post.relatedService && (
            <div className="mt-14 p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] text-center">
              <p className="font-body text-[1rem] text-t2 font-light mb-5">
                Bu konuda profesyonel destek mi arıyorsunuz?
              </p>
              <Link
                href={post.relatedService.href}
                className="group inline-flex items-center gap-2 font-body text-[0.85rem] font-semibold tracking-wider uppercase text-accent hover:text-accent2 transition-colors duration-300"
              >
                {post.relatedService.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/blog" className="font-body text-[0.82rem] text-t3 hover:text-accent transition-colors">
              ← Tüm yazılar
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
