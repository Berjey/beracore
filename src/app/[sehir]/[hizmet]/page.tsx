import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cityPages, getCityPage } from '@/lib/city-pages-data';
import ScrollProgress from '@/components/ScrollProgress';

const BASE_URL = 'https://beracore.com';

const CITY_SECTIONS = [
  { label: 'Giriş', sel: '#city-giris' },
  { label: 'Detaylar', sel: '#city-detay' },
  { label: 'Öne Çıkanlar', sel: '#city-ozet' },
  { label: 'SSS', sel: '#city-sss' },
  { label: 'İletişim', sel: '#city-cta' },
];

interface Props {
  params: Promise<{ sehir: string; hizmet: string }>;
}

export function generateStaticParams() {
  return cityPages.map((p) => ({ sehir: p.citySlug, hizmet: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sehir, hizmet } = await params;
  const page = getCityPage(sehir, hizmet);
  if (!page) return {};

  const url = `${BASE_URL}/${sehir}/${hizmet}`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: 'website',
      locale: 'tr_TR',
      siteName: 'BERACORE',
      url,
      images: [{ url: '/beracore-bg.png', width: 600, height: 392, alt: page.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
      images: ['/beracore-bg.png'],
    },
  };
}

export default async function CityServicePage({ params }: Props) {
  const { sehir, hizmet } = await params;
  const page = getCityPage(sehir, hizmet);
  if (!page) notFound();

  const url = `${BASE_URL}/${sehir}/${hizmet}`;
  const others = cityPages.filter((p) => p.citySlug === sehir && p.slug !== hizmet);

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.title,
    description: page.metaDescription,
    serviceType: page.keyword,
    provider: {
      '@type': 'ProfessionalService',
      name: 'BERACORE',
      url: BASE_URL,
      telephone: '+905539862306',
      areaServed: { '@type': 'City', name: page.city },
      address: { '@type': 'PostalAddress', addressLocality: page.city, addressCountry: 'TR' },
    },
    areaServed: { '@type': 'City', name: page.city },
    url,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: page.title, item: url },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ScrollProgress sections={CITY_SECTIONS} />

      <article className="relative pt-36 pb-28 px-6 max-md:pt-28 max-md:pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-body text-[0.78rem] text-t3">
              <li><Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-t1">{page.title}</li>
            </ol>
          </nav>

          {/* Hero */}
          <header id="city-giris" className="mb-14 max-md:mb-10">
            <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
              {page.city} · Hizmet Bölgesi
            </span>
            <h1 className="font-heading text-[clamp(2.2rem,6vw,3.8rem)] font-semibold tracking-tight leading-[1.05] mb-6">
              <span className="gradient-text">{page.title}</span>
            </h1>
            <p className="font-body text-[1.15rem] max-md:text-[1.02rem] text-t2 font-light leading-relaxed">
              {page.intro}
            </p>
          </header>

          {/* Sections */}
          <div id="city-detay" className="space-y-10">
            {page.sections.map((s, i) => (
              <section key={i}>
                <h2 className="font-body text-[clamp(1.35rem,3vw,1.85rem)] font-semibold text-t1 tracking-tight mb-3">{s.h2}</h2>
                <p className="font-body text-[1.02rem] text-t2 font-light leading-[1.8]">{s.body}</p>
              </section>
            ))}
          </div>

          {/* Bullets */}
          <section id="city-ozet" className="mt-12 p-8 rounded-2xl border border-white/[0.07] bg-white/[0.015]">
            <h2 className="font-body text-[1.15rem] font-semibold text-t1 mb-5">{page.bullets.title}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {page.bullets.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-body text-[0.95rem] text-t2 font-light leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* İç linkler — hizmet + blog */}
          <section className="mt-10 flex flex-wrap gap-4">
            <Link href={page.serviceHref} className="group inline-flex items-center gap-2 font-body text-[0.85rem] font-semibold text-accent hover:text-accent2 transition-colors">
              {page.serviceLabel}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <span className="text-t3" aria-hidden="true">·</span>
            <Link href={page.blogHref} className="group inline-flex items-center gap-2 font-body text-[0.85rem] font-semibold text-t2 hover:text-accent transition-colors">
              {page.blogLabel}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </section>

          {/* SSS */}
          <section id="city-sss" className="mt-16" aria-label="Sıkça Sorulan Sorular">
            <h2 className="font-body text-[clamp(1.35rem,3vw,1.85rem)] font-semibold text-t1 tracking-tight mb-6">Sıkça Sorulan Sorular</h2>
            <div className="space-y-3">
              {page.faq.map((item, i) => (
                <details key={i} className="group rounded-2xl border border-white/[0.07] bg-white/[0.015] overflow-hidden transition-colors duration-300 hover:border-white/[0.15]">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 font-body text-[1rem] font-semibold text-t1">
                    <span>{item.question}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffa9f9" strokeWidth="2" strokeLinecap="round" className="shrink-0 transition-transform duration-300 group-open:rotate-45"><path d="M12 5v14M5 12h14" /></svg>
                  </summary>
                  <div className="px-6 pb-5 -mt-1 font-body text-[0.95rem] text-t2 font-light leading-relaxed">{item.answer}</div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section id="city-cta" className="mt-16 text-center">
            <p className="font-body text-[1.1rem] text-t2 font-light mb-6">
              {page.city}’daki projeniz için ücretsiz keşif görüşmesi yapalım.
            </p>
            <Link href="/iletisim" className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-body text-[0.9rem] font-semibold tracking-wider uppercase bg-gradient-to-r from-accent to-accent2 text-bg transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(255,169,249,0.3)]">
              Ücretsiz Teklif Al
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-400 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </section>

          {/* Aynı şehirdeki diğer hizmetler — iç link ağı */}
          {others.length > 0 && (
            <section className="mt-16 pt-10 border-t border-white/[0.06]">
              <h2 className="font-body text-[1.05rem] font-light text-t2 mb-5">{page.city}’daki diğer hizmetlerimiz</h2>
              <div className="flex flex-wrap gap-3">
                {others.map((o) => (
                  <Link key={o.slug} href={`/${o.citySlug}/${o.slug}`} className="font-body text-[0.85rem] text-t2 px-4 py-2 rounded-full border border-white/[0.08] hover:border-accent/40 hover:text-accent transition-all duration-300">
                    {o.title}
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
