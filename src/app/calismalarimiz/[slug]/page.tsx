import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { caseStudies, getCaseStudyBySlug } from '@/lib/case-studies-data';

const BASE_URL = 'https://beracore.com';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return {};

  const url = `${BASE_URL}/calismalarimiz/${slug}`;
  return {
    title: study.metaTitle,
    description: study.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: study.metaTitle,
      description: study.metaDescription,
      type: 'article',
      locale: 'tr_TR',
      siteName: 'BERACORE',
      url,
      images: [{ url: '/beracore-bg.png', width: 600, height: 392, alt: study.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: study.metaTitle,
      description: study.metaDescription,
      images: ['/beracore-bg.png'],
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  const url = `${BASE_URL}/calismalarimiz/${slug}`;
  const others = caseStudies.filter((c) => c.slug !== slug);

  const caseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: study.title,
    description: study.metaDescription,
    about: study.category,
    author: { '@type': 'Organization', name: 'BERACORE', url: BASE_URL },
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
      { '@type': 'ListItem', position: 2, name: 'Çalışmalarımız', item: `${BASE_URL}/calismalarimiz` },
      { '@type': 'ListItem', position: 3, name: study.brand, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <article className="relative pt-36 pb-28 px-6 max-md:pt-28 max-md:pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-body text-[0.78rem] text-t3">
              <li><Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/calismalarimiz" className="hover:text-accent transition-colors">Çalışmalarımız</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-t1">{study.brand}</li>
            </ol>
          </nav>

          {/* Hero */}
          <header className="mb-14 max-md:mb-10">
            <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
              {study.category}
            </span>
            <h1 className="font-heading text-[clamp(2rem,5.5vw,3.4rem)] font-semibold tracking-tight leading-[1.08] mb-6">
              <span className="gradient-text">{study.title}</span>
            </h1>
            <p className="font-body text-[1.15rem] max-md:text-[1.02rem] text-t2 font-light leading-relaxed">
              {study.summary}
            </p>
            <div className="flex flex-wrap gap-2 mt-7">
              {study.tags.map((t) => (
                <span key={t} className="font-body text-[0.75rem] text-t3 px-3 py-1 rounded-full border border-white/[0.08]">
                  {t}
                </span>
              ))}
            </div>
          </header>

          {/* Problem */}
          <section className="mb-12">
            <h2 className="font-body text-[clamp(1.35rem,3vw,1.85rem)] font-semibold text-t1 tracking-tight mb-3">
              Zorluk
            </h2>
            <p className="font-body text-[1.02rem] text-t2 font-light leading-[1.8]">{study.challenge}</p>
          </section>

          {/* Yaklaşım */}
          <section className="mb-12">
            <h2 className="font-body text-[clamp(1.35rem,3vw,1.85rem)] font-semibold text-t1 tracking-tight mb-5">
              Yaptığımız İş
            </h2>
            <ul className="space-y-3">
              {study.approach.map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-body text-[1rem] text-t2 font-light leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Sonuç */}
          <section className="mb-12 p-8 rounded-2xl border border-white/[0.07] bg-white/[0.015]">
            <h2 className="font-body text-[1.15rem] font-semibold text-t1 mb-4">Sonuç</h2>
            <p className="font-body text-[1rem] text-t2 font-light leading-[1.8]">{study.outcome}</p>
          </section>

          {/* Müşteri yorumu */}
          {study.quote && (
            <figure className="mb-14 pl-6 border-l-2 border-accent/40">
              <blockquote className="font-body text-[1.08rem] max-md:text-[1rem] text-t1 font-light italic leading-relaxed">
                “{study.quote.text}”
              </blockquote>
              <figcaption className="mt-4 font-body text-[0.85rem] text-t3">
                <span className="text-t2 font-medium">{study.quote.name}</span> · {study.quote.role}
              </figcaption>
            </figure>
          )}

          {/* İlgili hizmet */}
          <section className="mb-16">
            <Link
              href={study.serviceHref}
              className="group inline-flex items-center gap-2 font-body text-[0.85rem] font-semibold text-accent hover:text-accent2 transition-colors"
            >
              {study.serviceLabel}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </section>

          {/* CTA */}
          <section className="text-center">
            <p className="font-body text-[1.1rem] text-t2 font-light mb-6">
              Benzer bir ihtiyacınız mı var? Ücretsiz keşif görüşmesiyle başlayalım.
            </p>
            <Link
              href="/iletisim"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-body text-[0.9rem] font-semibold tracking-wider uppercase bg-gradient-to-r from-accent to-accent2 text-bg transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(255,169,249,0.3)]"
            >
              Ücretsiz Teklif Al
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-400 group-hover:translate-x-1" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </section>

          {/* Diğer çalışmalar */}
          {others.length > 0 && (
            <section className="mt-16 pt-10 border-t border-white/[0.06]">
              <h2 className="font-body text-[1.05rem] font-light text-t2 mb-5">Diğer çalışmalarımız</h2>
              <div className="flex flex-wrap gap-3">
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/calismalarimiz/${o.slug}`}
                    className="font-body text-[0.85rem] text-t2 px-4 py-2 rounded-full border border-white/[0.08] hover:border-accent/40 hover:text-accent transition-all duration-300"
                  >
                    {o.brand}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
