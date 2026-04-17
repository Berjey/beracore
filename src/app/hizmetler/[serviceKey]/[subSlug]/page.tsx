import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { services } from '@/lib/services-data';
import ServicePage from '@/components/ServicePage';

interface Props {
  params: Promise<{ serviceKey: string; subSlug: string }>;
}

export async function generateStaticParams() {
  const params: { serviceKey: string; subSlug: string }[] = [];
  for (const service of services) {
    for (const sub of service.subServices) {
      params.push({ serviceKey: service.key, subSlug: sub.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceKey, subSlug } = await params;
  const service = services.find(s => s.key === serviceKey);
  const sub = service?.subServices.find(ss => ss.slug === subSlug);
  if (!service || !sub) return {};

  return {
    title: sub.metaTitle,
    description: sub.metaDescription,
    openGraph: {
      title: sub.metaTitle,
      description: sub.metaDescription,
      type: 'website',
      locale: 'tr_TR',
      siteName: 'BERACORE',
      url: `https://beracore.com/hizmetler/${serviceKey}/${subSlug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: sub.metaTitle,
      description: sub.metaDescription,
    },
    alternates: {
      canonical: `https://beracore.com/hizmetler/${serviceKey}/${subSlug}`,
    },
  };
}

export default async function SubServicePage({ params }: Props) {
  const { serviceKey, subSlug } = await params;
  const service = services.find(s => s.key === serviceKey);
  const sub = service?.subServices.find(ss => ss.slug === subSlug);
  if (!service || !sub) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: sub.title,
    description: sub.description,
    provider: { '@type': 'Organization', name: 'BERACORE', url: 'https://beracore.com' },
    areaServed: { '@type': 'Country', name: 'Turkey' },
    url: `https://beracore.com/hizmetler/${serviceKey}/${subSlug}`,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: sub.faq.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://beracore.com' },
      { '@type': 'ListItem', position: 2, name: service.title, item: `https://beracore.com/#services` },
      { '@type': 'ListItem', position: 3, name: sub.title, item: `https://beracore.com/hizmetler/${serviceKey}/${subSlug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ServicePage serviceKey={serviceKey} subSlug={subSlug} />
    </>
  );
}
