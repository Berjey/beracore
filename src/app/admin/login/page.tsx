import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { SESSION_COOKIE, readSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Yönetim Girişi | BERACORE',
  // Panel arama motorlarında ASLA görünmemeli.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Form, Server Action değil `/admin/giris` rota işleyicisine POST eder.
 * Gerekçesi o dosyada: Server Action içinde kurulan oturum çerezi tarayıcı
 * tarafından saklanmıyordu.
 *
 * Sayfa BİLEREK tamamen sunucu bileşenidir — tek bir satır istemci JS'i yok.
 * Ekran süslemesi (zemin ışıması, kenarlık gradyanı) saf CSS ile yapılır;
 * böylece giriş ekranı JavaScript kapalıyken de birebir aynı çalışır.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string; devam?: string }>;
}) {
  const sp = await searchParams;

  // Zaten girişliyse panele al.
  if (readSession((await cookies()).get(SESSION_COOKIE)?.value)) redirect(sp.devam || '/admin');

  const mesajlar: Record<string, string> = {
    kimlik: 'E-posta veya parola hatalı.',
    kilit: 'Çok fazla başarısız deneme. 15 dakika sonra tekrar deneyin.',
    origin: 'Güvenlik doğrulaması başarısız. Sayfayı yenileyip tekrar deneyin.',
    yapilandirma: 'Sunucu yapılandırması eksik. Yöneticiyle iletişime geçin.',
    cikis: 'Oturumunuz güvenle kapatıldı.',
  };
  const mesaj = sp.hata ? mesajlar[sp.hata] : null;
  const bilgi = sp.hata === 'cikis';

  const alanClass =
    'w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.92rem] ' +
    'text-white placeholder:text-white/35 outline-none transition-colors ' +
    'hover:border-white/20 focus:border-accent/60 focus:bg-white/[0.05]';

  const etiketClass =
    'block font-body text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-white/55 mb-2';

  return (
    <main
      className="panel-alan relative min-h-screen overflow-hidden flex items-center justify-center px-6 py-16"
      style={{ background: '#0f0d16' }}
    >
      {/* Zemin ışıması — iki geniş radyal gradyan. Sabit, animasyonsuz ve
          `pointer-events-none`: dikkat dağıtmaz, tıklamayı engellemez. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60rem 32rem at 50% -10%, rgba(255,169,249,0.10), transparent 70%), ' +
            'radial-gradient(45rem 28rem at 85% 110%, rgba(255,247,173,0.06), transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-[24rem]">
        <div className="mb-9 flex flex-col items-center text-center">
          <Image
            src="/beracore.png"
            alt="BERACORE"
            width={600}
            height={392}
            priority
            className="h-9 w-auto drop-shadow-[0_0_22px_rgba(255,169,249,0.35)]"
          />
          <span
            aria-hidden="true"
            className="mt-6 block h-px w-14"
            style={{ background: 'linear-gradient(90deg, transparent, #ffa9f9, transparent)' }}
          />
          <h1 className="mt-6 font-heading text-[1.5rem] font-semibold tracking-tight text-white">
            Yönetim Paneli
          </h1>
          <p className="mt-2 font-body text-[0.85rem] text-white/55">
            Devam etmek için yetkili hesabınızla giriş yapın.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-7 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] backdrop-blur-sm max-sm:p-6">
          {mesaj && (
            <p
              role="alert"
              className={`mb-6 rounded-xl border px-4 py-3 font-body text-[0.85rem] leading-relaxed ${
                bilgi
                  ? 'border-white/15 bg-white/[0.04] text-white/70'
                  : 'border-red-400/30 bg-red-400/[0.08] text-red-200'
              }`}
            >
              {mesaj}
            </p>
          )}

          <form action="/admin/giris" method="post" className="space-y-5">
            <input type="hidden" name="devam" value={sp.devam ?? ''} />

            <div>
              <label htmlFor="email" className={etiketClass}>
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                autoFocus
                placeholder="ornek@beracore.com"
                className={alanClass}
              />
            </div>

            <div>
              <label htmlFor="parola" className={etiketClass}>
                Parola
              </label>
              <input
                id="parola"
                name="parola"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={alanClass}
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] rounded-xl px-6 py-3 font-body text-[0.88rem] font-semibold tracking-wide text-black shadow-[0_10px_30px_-12px_rgba(255,169,249,0.6)] transition-transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #fff7ad, #ffa9f9)' }}
            >
              Giriş Yap
            </button>
          </form>
        </div>

        {/* Sönük görünen bu iki satır bilerek /50 alfada: #0f0d16 üzerinde ~5:1 kontrast
            (WCAG AA). Daha da soluklaştırmayın — 0,72rem metin okunmaz hale gelir. */}
        <div className="mt-7 flex items-center justify-center gap-2.5 font-body text-[0.72rem] text-white/50">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2.5 4.5 5.8v5.3c0 4.4 3.2 8.5 7.5 10.4 4.3-1.9 7.5-6 7.5-10.4V5.8L12 2.5Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          <span>Bu alan korumalıdır; giriş denemeleri kaydedilir.</span>
        </div>

        <p className="mt-3 text-center font-body text-[0.72rem] text-white/50">
          <Link href="/" className="transition-colors hover:text-white/80">
            beracore.com&apos;a dön
          </Link>
        </p>
      </div>
    </main>
  );
}
