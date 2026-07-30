import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sayfa Bulunamadı (404) | BERACORE',
  description: 'Aradığınız sayfa bulunamadı. BERACORE ana sayfasına veya hizmetlerimize göz atın.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="relative z-[1] min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden bg-bg"
    >
      {/* Arka plan glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div
          className="w-[520px] h-[520px] max-md:w-[340px] max-md:h-[340px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,169,249,0.10) 0%, rgba(255,247,173,0.05) 45%, transparent 72%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <p className="font-heading text-[clamp(4.5rem,18vw,10rem)] font-bold leading-none gradient-text">
        404
      </p>
      <h1 className="mt-4 font-heading text-[clamp(1.4rem,4vw,2.2rem)] font-semibold text-white">
        Sayfa Bulunamadı
      </h1>
      <p className="mt-4 max-w-md font-body text-[0.95rem] leading-relaxed text-white/60">
        Aradığınız sayfa taşınmış veya hiç var olmamış olabilir. Aşağıdaki bağlantılardan
        devam edebilirsiniz.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="px-7 py-3 rounded-xl font-body text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #fff7ad, #ffa9f9)' }}
        >
          Ana Sayfa
        </Link>
        <Link
          href="/iletisim"
          className="px-7 py-3 rounded-xl font-body text-sm font-semibold text-white border border-white/20 transition-colors hover:border-white/50"
        >
          İletişim
        </Link>
      </div>

      {/* Popüler hizmetler */}
      <nav aria-label="Popüler hizmetler" className="mt-12">
        <p className="font-body text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-white/40 mb-4">
          Popüler Hizmetler
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 max-w-lg">
          {[
            ['Web Yazılım', '/hizmetler/software/web-yazilim'],
            ['AI Chatbot', '/hizmetler/ai/ai-chatbot-asistan'],
            ['SEO', '/hizmetler/marketing/seo'],
            ['E-Ticaret', '/hizmetler/ecommerce/e-ticaret-yazilim'],
            ['UI/UX Tasarım', '/hizmetler/design/ui-ux-tasarim'],
          ].map(([label, href]) => (
            <li key={href}>
              <Link
                href={href}
                className="font-body text-sm text-white/70 underline-offset-4 hover:text-white hover:underline"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
