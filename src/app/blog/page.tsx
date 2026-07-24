import { Metadata } from 'next';
import Link from 'next/link';
import { getSortedPosts } from '@/lib/blog-data';

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

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}

export default function BlogIndexPage() {
  const posts = getSortedPosts();

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

      <article className="relative pt-36 pb-28 px-6 max-md:pt-28 max-md:pb-20">
        <div className="max-w-4xl mx-auto">
          <header className="mb-16 max-md:mb-12">
            <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
              Blog
            </span>
            <h1 className="font-heading text-[clamp(2.2rem,6vw,4rem)] font-semibold tracking-tight leading-[1.05] mb-6">
              <span className="gradient-text">İçgörüler ve Rehberler</span>
            </h1>
            <p className="font-body text-[1.15rem] text-t2 font-light leading-relaxed max-w-2xl">
              Yapay zeka, web, e-ticaret, yazılım ve dijital pazarlama üzerine uygulanabilir bilgiler.
            </p>
          </header>

          {posts.length === 0 ? (
            <p className="font-body text-t3">Yakında ilk yazılarımızla buradayız.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {posts.map((post, i) => {
                const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.035]"
                    style={{ '--accent': accent } as React.CSSProperties}
                  >
                    <div className="flex items-center gap-3 mb-3 font-body text-[0.72rem] text-t3">
                      <span className="px-2.5 py-1 rounded-full border border-white/[0.08] text-accent2/80">{post.category}</span>
                      <span>{formatDate(post.publishedAt)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.readingMinutes} dk okuma</span>
                    </div>
                    <h2 className="font-body text-[1.35rem] font-semibold text-t1 mb-3 group-hover:text-[color:var(--accent)] transition-colors duration-300">
                      {post.title}
                    </h2>
                    <p className="font-body text-[0.92rem] text-t3 font-light leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1.5 font-body text-[0.75rem] font-semibold tracking-wider uppercase text-accent/50 group-hover:text-[color:var(--accent)] transition-all duration-300 group-hover:gap-2.5">
                      Yazıyı Oku
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </article>
    </>
  );
}
