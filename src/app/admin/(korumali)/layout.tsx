/**
 * Panelin ASIL yetki kapısı.
 *
 * `middleware.ts` yalnızca çerez imzasını kontrol eder (edge, DB'siz). Burada
 * oturum veritabanından doğrulanır: oturum silinmişse veya süresi dolmuşsa erişim
 * ANINDA biter. İki katman bilerek ayrıdır — imza tek başına yeterli sayılsaydı,
 * çalınmış bir çerez süresi dolana kadar geçerli kalırdı ve iptal edilemezdi.
 *
 * NEDEN `(korumali)` ROTA GRUBU: Bu düzen `/admin/login`'i SARMAMALI. Daha önce
 * `src/app/admin/layout.tsx` konumundaydı ve giriş sayfasını da kapsıyordu; oturumu
 * olmayan ziyaretçi login'e yönlendiriliyor, login yine bu düzene giriyor ve yeniden
 * yönlendiriliyordu → SONSUZ YÖNLENDİRME (tarayıcı "redirect count exceeded" veriyordu).
 * Parantezli klasör adı URL'i değiştirmez; yalnızca hangi sayfaların bu düzeni
 * paylaşacağını belirler. Giriş ve çıkış rotaları bilerek grubun DIŞINDADIR.
 */
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SESSION_COOKIE, readSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const oturum = readSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!oturum) redirect('/admin/login');

  return (
    <div className="panel-alan min-h-screen" style={{ background: '#0f0d16' }}>
      <header className="border-b border-white/[0.07] bg-white/[0.015]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-heading text-[0.95rem] font-semibold text-white">
              BERACORE <span className="text-accent">Panel</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/admin" className="font-body text-[0.85rem] text-white/60 transition-colors hover:text-white">
                Gelen Kutusu
              </Link>
              <Link href="/admin/icerik" className="font-body text-[0.85rem] text-white/60 transition-colors hover:text-white">
                Blog
              </Link>
              <Link href="/admin/hizmetler" className="font-body text-[0.85rem] text-white/60 transition-colors hover:text-white">
                Hizmetler
              </Link>
              <Link href="/admin/sehirler" className="font-body text-[0.85rem] text-white/60 transition-colors hover:text-white">
                Şehirler
              </Link>
              <Link href="/admin/yasal" className="font-body text-[0.85rem] text-white/60 transition-colors hover:text-white">
                Hukuki
              </Link>
              <Link href="/admin/ayarlar" className="font-body text-[0.85rem] text-white/60 transition-colors hover:text-white">
                Şirket Ayarları
              </Link>
              <Link href="/admin/metrikler" className="font-body text-[0.85rem] text-white/60 transition-colors hover:text-white">
                Metrikler
              </Link>
              <Link href="/" className="font-body text-[0.85rem] text-white/60 transition-colors hover:text-white">
                Siteye Dön
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden font-body text-[0.78rem] text-white/40 sm:inline">{oturum.email}</span>
            <Link
              href="/admin/cikis"
              className="inline-flex min-h-[24px] items-center rounded-lg border border-white/15 px-3 py-1.5 font-body text-[0.78rem] text-white/70 transition-colors hover:border-white/35 hover:text-white"
            >
              Çıkış
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
