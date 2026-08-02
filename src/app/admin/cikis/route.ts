/**
 * Çıkış. Oturum DB'den SİLİNİR — yalnızca çerezi temizlemek yetmez, çünkü
 * çerezin bir kopyası saklanmışsa süresi dolana kadar geçerli kalırdı.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, destroySession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  destroySession(req.cookies.get(SESSION_COOKIE)?.value);

  // Hedef, isteğin gerçek Host başlığından kurulur — `req.url` her zaman doğru
  // ana makineyi taşımıyor (bkz. admin/giris/route.ts açıklaması).
  const proto = req.headers.get('x-forwarded-proto') ?? new URL(req.url).protocol.replace(':', '');
  const host = req.headers.get('host') ?? new URL(req.url).host;
  const res = NextResponse.redirect(new URL('/admin/login?hata=cikis', `${proto}://${host}`));
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
