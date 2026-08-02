import { Metadata } from 'next';
import { notFound } from 'next/navigation';
// İçerik veritabanından okunur; tablo boşsa/okunamazsa koddaki içeriğe düşer.
import { getServices, getService, getCityPages } from '@/lib/db/content';
import ServicePage from '@/components/ServicePage';
import ScrollProgress from '@/components/ScrollProgress';
import { SITE_URL, ogImages, twitterImages } from '@/lib/seo';

const SERVICE_SECTIONS = [
  { label: 'Giriş', sel: '.sp-hero-section' },
  { label: 'Rakamlar', sel: '[data-sp="stats"]' },
  { label: 'Genel Bakış', sel: '[data-sp="overview"]' },
  { label: 'Özellikler', sel: '[data-sp="features"]' },
  { label: 'Süreç', sel: '[data-sp="process"]' },
  { label: 'Faydalar', sel: '[data-sp="benefits"]' },
  { label: 'SSS', sel: '[data-sp="faq"]' },
  { label: 'İletişim', sel: '[data-sp="cta"]' },
];

interface Props {
  params: Promise<{ serviceKey: string; subSlug: string }>;
}

export async function generateStaticParams() {
  const params: { serviceKey: string; subSlug: string }[] = [];
  for (const service of getServices()) {
    for (const sub of service.subServices) {
      params.push({ serviceKey: service.key, subSlug: sub.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceKey, subSlug } = await params;
  const service = getService(serviceKey);
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
      images: ogImages(sub.title),
    },
    twitter: {
      card: 'summary_large_image',
      title: sub.metaTitle,
      description: sub.metaDescription,
      images: twitterImages,
    },
    alternates: {
      canonical: `https://beracore.com/hizmetler/${serviceKey}/${subSlug}`,
    },
  };
}

export default async function SubServicePage({ params }: Props) {
  const { serviceKey, subSlug } = await params;
  const service = getService(serviceKey);
  const sub = service?.subServices.find(ss => ss.slug === subSlug);
  if (!service || !sub) notFound();

  // Şehir bağlantıları SUNUCUDA çözülür. Önceden `ServicePage` bunu kendi içinde
  // koddaki şehir listesinden buluyordu; şehir içeriği veritabanına taşındıktan
  // sonra (Faz 1.3b) panelden değiştirilen bir bağlantı burada eski kalırdı.
  const cityLinks = getCityPages()
    .filter((c) => c.serviceHref === `/hizmetler/${serviceKey}/${subSlug}`)
    .map((c) => ({ citySlug: c.citySlug, slug: c.slug, city: c.city, title: c.title }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: sub.title,
    description: sub.description,
    provider: { '@type': 'Organization', name: 'BERACORE', url: SITE_URL },
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
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: service.title, item: `https://beracore.com/hizmetler/${serviceKey}` },
      { '@type': 'ListItem', position: 3, name: sub.title, item: `https://beracore.com/hizmetler/${serviceKey}/${subSlug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ScrollProgress sections={SERVICE_SECTIONS} />
      <ServicePage service={service} subSlug={subSlug} cityLinks={cityLinks} />
    </>
  );
}
