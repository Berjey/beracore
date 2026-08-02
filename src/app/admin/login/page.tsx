import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
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
    cikis: 'Oturumunuz kapatıldı.',
  };
  const mesaj = sp.hata ? mesajlar[sp.hata] : null;

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16" style={{ background: '#0f0d16' }}>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-body text-[0.68rem] font-semibold tracking-[0.4em] uppercase text-accent2/60">
            BERACORE
          </p>
          <h1 className="mt-3 font-heading text-[1.6rem] font-semibold text-white">Yönetim Paneli</h1>
        </div>

        {mesaj && (
          <p
            role="alert"
            className={`mb-5 rounded-xl border px-4 py-3 font-body text-[0.85rem] ${
              sp.hata === 'cikis'
                ? 'border-white/15 bg-white/[0.04] text-white/70'
                : 'border-red-400/30 bg-red-400/[0.08] text-red-200'
            }`}
          >
            {mesaj}
          </p>
        )}

        <form action="/admin/giris" method="post" className="space-y-4">
          <input type="hidden" name="devam" value={sp.devam ?? ''} />
          <div>
            <label htmlFor="email" className="block font-body text-[0.75rem] font-semibold tracking-wider uppercase text-white/50 mb-2">
              E-posta
            </label>
            <input
              id="email" name="email" type="email" required autoComplete="username" autoFocus
              className="w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.92rem] text-white outline-none transition-colors focus:border-accent/60"
            />
          </div>
          <div>
            <label htmlFor="parola" className="block font-body text-[0.75rem] font-semibold tracking-wider uppercase text-white/50 mb-2">
              Parola
            </label>
            <input
              id="parola" name="parola" type="password" required autoComplete="current-password"
              className="w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.92rem] text-white outline-none transition-colors focus:border-accent/60"
            />
          </div>
          <button
            type="submit"
            className="w-full min-h-[44px] rounded-xl px-6 py-3 font-body text-[0.88rem] font-semibold text-black transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #fff7ad, #ffa9f9)' }}
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </main>
  );
}
