import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { services } from '@/lib/services-data';
import ScrollProgress from '@/components/ScrollProgress';
import { SITE_URL, ogImages, twitterImages } from '@/lib/seo';

const CATEGORY_SECTIONS = [
  { label: 'Giriş', sel: '#cat-giris' },
  { label: 'Hizmetler', sel: '#cat-liste' },
  { label: 'Diğer', sel: '#cat-diger' },
  { label: 'İletişim', sel: '#cat-cta' },
];

interface Props {
  params: Promise<{ serviceKey: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({ serviceKey: service.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceKey } = await params;
  const service = services.find((s) => s.key === serviceKey);
  if (!service) return {};

  const title = `${service.title} Hizmetleri | BERACORE`;
  const description = service.description.slice(0, 155);
  const url = `https://beracore.com/hizmetler/${serviceKey}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'tr_TR',
      siteName: 'BERACORE',
      url,
      images: ogImages(service.title),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: twitterImages,
    },
  };
}

export default async function ServiceCategoryPage({ params }: Props) {
  const { serviceKey } = await params;
  const service = services.find((s) => s.key === serviceKey);
  if (!service) notFound();

  const url = `https://beracore.com/hizmetler/${serviceKey}`;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Hizmetler', item: 'https://beracore.com/#services' },
      { '@type': 'ListItem', position: 3, name: service.title, item: url },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${service.title} Hizmetleri`,
    itemListElement: service.subServices.map((sub, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: sub.title,
      url: `${url}/${sub.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <ScrollProgress sections={CATEGORY_SECTIONS} />

      <article className="relative pt-36 pb-28 px-6 max-md:pt-28 max-md:pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 font-body text-[0.78rem] text-t3">
              <li><Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/#services" className="hover:text-accent transition-colors">Hizmetler</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-t1">{service.title}</li>
            </ol>
          </nav>

          {/* Hero */}
          <header id="cat-giris" className="mb-16 max-md:mb-12">
            <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
              Hizmet Kategorisi
            </span>
            <h1 className="font-heading text-[clamp(2.2rem,6vw,4rem)] font-semibold tracking-tight leading-[1.05] mb-6">
              <span className="gradient-text">{service.title}</span>
            </h1>
            <p className="font-body text-[1.15rem] text-t2 font-light leading-relaxed max-w-3xl">
              {service.description}
            </p>
          </header>

          {/* Alt hizmet grid */}
          <section id="cat-liste" aria-label={`${service.title} alt hizmetleri`}>
            <h2 className="font-body text-[clamp(1.4rem,3vw,2rem)] font-light tracking-tight mb-8">
              {service.title} kapsamındaki hizmetlerimiz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {service.subServices.map((sub, i) => {
                const accent = i % 2 === 0 ? '#ffa9f9' : '#fff7ad';
                return (
                  <Link
                    key={sub.slug}
                    href={`/hizmetler/${service.key}/${sub.slug}`}
                    className="group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.035]"
                    style={{ '--accent': accent } as React.CSSProperties}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl leading-none mt-0.5" aria-hidden="true">{sub.image}</span>
                      <div className="relative flex-1">
                        <h3 className="font-body text-[1.1rem] font-semibold text-t1 mb-2 group-hover:text-[color:var(--accent)] transition-colors duration-300">
                          {sub.title}
                        </h3>
                        <p className="font-body text-[0.88rem] text-t3 font-light leading-relaxed mb-4">
                          {sub.description}
                        </p>
                        <span className="inline-flex items-center gap-1.5 font-body text-[0.75rem] font-semibold tracking-wider uppercase text-accent/50 group-hover:text-[color:var(--accent)] transition-all duration-300 group-hover:gap-2.5">
                          Detaylı Bilgi
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Diğer kategoriler — iç link ağı */}
          <section id="cat-diger" aria-label="Diğer hizmet kategorileri" className="mt-20">
            <h2 className="font-body text-[1.1rem] font-light text-t2 mb-5">Diğer hizmet kategorileri</h2>
            <div className="flex flex-wrap gap-3">
              {services.filter((s) => s.key !== service.key).map((s) => (
                <Link
                  key={s.key}
                  href={`/hizmetler/${s.key}`}
                  className="font-body text-[0.85rem] text-t2 px-4 py-2 rounded-full border border-white/[0.08] hover:border-accent/40 hover:text-accent transition-all duration-300"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section id="cat-cta" className="mt-20 text-center">
            <p className="font-body text-[1.1rem] text-t2 font-light mb-8">
              {service.title} projeniz için uzman ekibimizle tanışın.
            </p>
            <Link
              href="/iletisim"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-body text-[0.9rem] font-semibold tracking-wider uppercase bg-gradient-to-r from-accent to-accent2 text-bg transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(255,169,249,0.3)]"
            >
              Ücretsiz Teklif Al
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-400 group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </section>
        </div>
      </article>
    </>
  );
}
