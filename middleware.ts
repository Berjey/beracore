/**
 * Edge middleware — `/admin/*` için UCUZ ön eleme.
 *
 * Burada YALNIZCA çerez imzası doğrulanır. Edge çalışma zamanında `node:sqlite` ve
 * `node:crypto`'nun scrypt'i yoktur, bu yüzden Web Crypto ile HMAC kontrolü yapılır.
 * ASIL yetki kontrolü `src/app/admin/layout.tsx` içinde DB'den yapılır — oturum
 * silindiğinde erişimin anında bitmesi buna bağlıdır. Middleware'in görevi imzasız
 * veya bozuk çerezle gelen istekleri DB'ye hiç gitmeden login'e yollamaktır.
 */
import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'brc_admin';

const b64url = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

async function imzaGecerli(cerez: string, secret: string): Promise<boolean> {
  const nokta = cerez.lastIndexOf('.');
  if (nokta < 1) return false;
  const id = cerez.slice(0, nokta);
  const mac = cerez.slice(nokta + 1);

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const beklenen = b64url(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(id)));

  // Sabit süreli karşılaştırma: uzunluk farkı erken çıkmaz.
  if (beklenen.length !== mac.length) return false;
  let fark = 0;
  for (let i = 0; i < beklenen.length; i++) fark |= beklenen.charCodeAt(i) ^ mac.charCodeAt(i);
  return fark === 0;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Giriş sayfası, giriş POST'u ve çıkış korunmaz — aksi halde giriş yapılamaz.
  if (pathname === '/admin/login' || pathname === '/admin/giris' || pathname === '/admin/cikis') {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    // Yapılandırma eksikse panele erişime izin verilmez (güvenli varsayılan).
    return NextResponse.redirect(new URL('/admin/login?hata=yapilandirma', req.url));
  }

  const cerez = req.cookies.get(SESSION_COOKIE)?.value;
  if (!cerez || !(await imzaGecerli(cerez, secret))) {
    const url = new URL('/admin/login', req.url);
    if (pathname !== '/admin') url.searchParams.set('devam', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
