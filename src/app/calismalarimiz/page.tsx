import { Metadata } from 'next';
import Link from 'next/link';
import { caseStudies } from '@/lib/case-studies-data';

const BASE_URL = 'https://beracore.com';
const url = `${BASE_URL}/calismalarimiz`;

const META_TITLE = 'Çalışmalarımız — Vaka Çalışmaları ve Referans Projeler | BERACORE';
const META_DESC =
  'BERACORE’un gerçekleştirdiği projeler: oto galeri yönetim paneli, e-ticaret altyapısı, mobil uygulama ve UI/UX. Problem, yaklaşım ve sonuçlarıyla vaka çalışmaları.';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  alternates: { canonical: url },
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    type: 'website',
    locale: 'tr_TR',
    siteName: 'BERACORE',
    url,
    images: [{ url: '/beracore-bg.png', width: 600, height: 392, alt: 'BERACORE Çalışmalarımız' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: META_TITLE,
    description: META_DESC,
    images: ['/beracore-bg.png'],
  },
};

export default function CaseStudiesPage() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'BERACORE Vaka Çalışmaları',
    itemListElement: caseStudies.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.title,
      url: `${BASE_URL}/calismalarimiz/${c.slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Çalışmalarımız', item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="relative pt-36 pb-28 px-6 max-md:pt-28 max-md:pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-body text-[0.78rem] text-t3">
              <li><Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-t1">Çalışmalarımız</li>
            </ol>
          </nav>

          {/* Hero */}
          <header className="mb-16 max-md:mb-12 max-w-3xl">
            <span className="inline-block font-body text-[0.7rem] font-semibold tracking-[0.5em] uppercase text-accent2/60 mb-4">
              Vaka Çalışmaları
            </span>
            <h1 className="font-heading text-[clamp(2.2rem,6vw,3.8rem)] font-semibold tracking-tight leading-[1.05] mb-6">
              <span className="gradient-text">Çalışmalarımız</span>
            </h1>
            <p className="font-body text-[1.15rem] max-md:text-[1.02rem] text-t2 font-light leading-relaxed">
              Her projeyi bir ekran görüntüsü olarak değil, çözülmüş bir problem olarak anlatıyoruz.
              Aşağıda müşterilerimizin karşılaştığı zorluğu, izlediğimiz yolu ve ortaya çıkan sonucu bulacaksınız.
            </p>
          </header>

          {/* Kartlar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.map((c) => (
              <Link
                key={c.slug}
                href={`/calismalarimiz/${c.slug}`}
                className="group flex flex-col p-8 rounded-2xl border border-white/[0.07] bg-white/[0.015] transition-all duration-500 hover:border-accent/30 hover:-translate-y-1"
              >
                <span className="font-body text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-accent2/70 mb-4">
                  {c.category}
                </span>
                <h2 className="font-body text-[1.3rem] font-semibold text-t1 tracking-tight mb-3 group-hover:text-accent transition-colors duration-300">
                  {c.brand}
                </h2>
                <p className="font-body text-[0.95rem] text-t2 font-light leading-relaxed mb-6 grow">
                  {c.summary}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {c.tags.slice(0, 3).map((t) => (
                    <span key={t} className="font-body text-[0.75rem] text-t3 px-3 py-1 rounded-full border border-white/[0.08]">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-2 font-body text-[0.85rem] font-semibold text-accent">
                  Vaka çalışmasını oku
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <section className="mt-20 text-center">
            <p className="font-body text-[1.1rem] text-t2 font-light mb-6">
              Sıradaki proje sizinki olsun. Ücretsiz keşif görüşmesiyle başlayalım.
            </p>
            <Link
              href="/iletisim"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-body text-[0.9rem] font-semibold tracking-wider uppercase bg-gradient-to-r from-accent to-accent2 text-bg transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(255,169,249,0.3)]"
            >
              Ücretsiz Teklif Al
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-400 group-hover:translate-x-1" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </section>
        </div>
      </section>
    </>
  );
}
