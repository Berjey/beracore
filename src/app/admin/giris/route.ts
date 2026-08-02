/**
 * Giriş işlemi — KLASİK FORM POST (Server Action DEĞİL).
 *
 * NEDEN ROTA İŞLEYİCİSİ: Giriş önce bir Server Action olarak yazılmıştı; `cookies().set()`
 * ardından `redirect()` çağrıldığında Next `Set-Cookie` başlığını yanıtta gönderiyor ama
 * tarayıcı çerezi SAKLAMIYORDU. Kontrol deneyiyle doğrulandı: aynı tarayıcı oturumunda bir
 * rota işleyicisinin kurduğu çerez sorunsuz saklanırken, Server Action'ınki saklanmıyordu.
 * Sonuç: giriş hep başarılı görünüyor, sonraki her istek yeniden login'e düşüyordu.
 *
 * Yan faydası: form `action="/admin/giris" method="post"` olduğu için JavaScript kapalıyken
 * de çalışır ve davranışı düz HTTP ile test edilebilir.
 */
import { NextResponse, type NextRequest } from 'next/server';
import {
  SESSION_COOKIE, createSession, verifyPassword, isLocked, recordAttempt, pruneSessions,
} from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function istemciIp(req: NextRequest): string {
  return (
    req.headers.get('x-real-ip')?.trim() ||
    req.headers.get('x-forwarded-for')?.split(',').pop()?.trim() ||
    'unknown'
  );
}

/**
 * Yönlendirme hedefini isteğin GERÇEK `Host` başlığından kurar.
 *
 * `new URL(yol, req.url)` KULLANILMAZ: Next `req.url`'i her zaman isteğin gerçek
 * ana makinesiyle üretmiyor — yerelde `127.0.0.1:3000`'e yapılan POST'a
 * `http://localhost:3000/...` hedefli bir yönlendirme dönüyordu. Çerez `127.0.0.1`
 * için kurulduğundan tarayıcı `localhost`'a giderken onu GÖNDERMİYOR ve kullanıcı
 * sonsuza dek giriş sayfasına düşüyordu. Host başlığı üretimde nginx tarafından
 * yazılır (`proxy_set_header Host $host`), bu yüzden güvenilirdir.
 */
function mutlakUrl(req: NextRequest, yol: string): URL {
  const proto = req.headers.get('x-forwarded-proto') ?? new URL(req.url).protocol.replace(':', '');
  const host = req.headers.get('host') ?? new URL(req.url).host;
  return new URL(yol, `${proto}://${host}`);
}

const hataylaDon = (req: NextRequest, kod: string) =>
  NextResponse.redirect(mutlakUrl(req, `/admin/login?hata=${kod}`), { status: 303 });

export async function POST(req: NextRequest) {
  // CSRF: tarayıcıdan gelen çapraz köken POST'unu reddet. SameSite=Lax çerezle
  // birlikte ikinci katman.
  const origin = req.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.get('host')) return hataylaDon(req, 'origin');
    } catch {
      return hataylaDon(req, 'origin');
    }
  }

  const ip = istemciIp(req);
  if (isLocked(ip)) return hataylaDon(req, 'kilit');

  const form = await req.formData();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const parola = String(form.get('parola') ?? '');
  const devam = String(form.get('devam') ?? '');

  const beklenenEmail = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
  const hash = (process.env.ADMIN_PASSWORD_HASH ?? '').trim();

  if (!beklenenEmail || !hash) {
    console.error('[admin] ADMIN_EMAIL / ADMIN_PASSWORD_HASH tanımlı değil');
    return hataylaDon(req, 'yapilandirma');
  }

  // E-posta yanlış olsa bile parola doğrulaması ÇALIŞTIRILIR: aksi halde yanıt
  // süresi farkı "bu e-posta kayıtlı mı" bilgisini sızdırır.
  const emailOk = email === beklenenEmail;
  const parolaOk = verifyPassword(parola, hash);

  if (!emailOk || !parolaOk) {
    recordAttempt(ip, email, false);
    return hataylaDon(req, 'kimlik');
  }

  recordAttempt(ip, email, true);
  pruneSessions();

  const cerez = createSession(email, ip, req.headers.get('user-agent') ?? '');

  // Açık yönlendirme engeli: yalnızca site içi /admin yolları kabul edilir.
  const hedef = devam.startsWith('/admin') && !devam.startsWith('//') ? devam : '/admin';
  const res = NextResponse.redirect(mutlakUrl(req, hedef), { status: 303 });

  // `Secure`, isteğin GERÇEK protokolünden türetilir (NODE_ENV'den değil): üretimde
  // nginx `X-Forwarded-Proto` yazar. Yerelde düz http'de Secure bir çerez tarayıcı
  // tarafından sessizce atılırdı.
  const https =
    req.headers.get('x-forwarded-proto') === 'https' || new URL(req.url).protocol === 'https:';

  res.cookies.set(SESSION_COOKIE, cerez, {
    httpOnly: true,
    secure: https,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
