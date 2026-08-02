/**
 * Şirket ayarlarını kaydeder ve etkilenen sayfaları yeniden ürettirir.
 *
 * Server Action DEĞİL, klasik form POST + rota işleyicisi — panelin genelindeki
 * kalıp (gerekçesi `admin/giris/route.ts`'te). Panel JavaScript kapalıyken de çalışır.
 *
 * NOT: Bu rota `(korumali)` grubunun DIŞINDA olduğu için düzenin oturum kontrolünü
 * miras almaz; yetkiyi kendisi doğrular.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { SESSION_COOKIE, readSession } from '@/lib/auth';
import { listAyarlar, setAyar } from '@/lib/db/settings';
import { logActivity } from '@/lib/db/activity';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function mutlakUrl(req: NextRequest, yol: string): URL {
  // Hedef `Host` başlığından kurulur, `req.url`'den DEĞİL: req.url isteğin gerçek
  // ana makinesini taşımayabiliyor ve farklı host'a giden yönlendirmede çerez
  // gönderilmediği için sonsuz giriş döngüsü oluşuyordu.
  const proto = req.headers.get('x-forwarded-proto') ?? new URL(req.url).protocol.replace(':', '');
  const host = req.headers.get('host') ?? new URL(req.url).host;
  return new URL(yol, `${proto}://${host}`);
}

function istemciIp(req: NextRequest): string {
  // `x-real-ip` nginx tarafından yazılır ve istemci uyduramaz; XFF'in İLK değeri
  // sahtelenebilir, bu yüzden SON değer kullanılır (api/contact ile aynı kalıp).
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  const xff = req.headers.get('x-forwarded-for');
  if (!xff) return '';
  const parcalar = xff.split(',');
  return parcalar[parcalar.length - 1].trim();
}

export async function POST(req: NextRequest) {
  const oturum = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!oturum) {
    return NextResponse.redirect(mutlakUrl(req, '/admin/login'), { status: 303 });
  }

  // CSRF: çapraz köken POST reddedilir (SameSite=Lax'in yanında ikinci katman).
  const origin = req.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.get('host')) {
        return NextResponse.redirect(mutlakUrl(req, '/admin/ayarlar?hata=origin'), { status: 303 });
      }
    } catch {
      return NextResponse.redirect(mutlakUrl(req, '/admin/ayarlar?hata=origin'), { status: 303 });
    }
  }

  const form = await req.formData();

  // Yalnızca veritabanında TANIMLI anahtarlar yazılır. Form alan adları
  // kullanıcıdan gelir; allowlist olmadan uydurma anahtar eklenebilirdi.
  const izinli = new Set(listAyarlar().map((a) => a.anahtar));

  const degisenler: string[] = [];
  const mevcut = new Map(listAyarlar().map((a) => [a.anahtar, a.deger]));

  for (const [anahtar, ham] of form.entries()) {
    if (!izinli.has(anahtar) || typeof ham !== 'string') continue;

    // Satır sonları korunur (liste ve uzun metin tipleri için), baş/son boşluk atılır.
    // Uzunluk sınırı: tek bir alanın veritabanını şişirmesini engeller.
    const deger = ham.replace(/\r\n/g, '\n').trim().slice(0, 4000);
    if (deger === mevcut.get(anahtar)) continue;

    setAyar(anahtar, deger);
    degisenler.push(anahtar);
  }

  if (degisenler.length) {
    logActivity({
      actor: oturum.email,
      action: 'sirket-ayari.guncellendi',
      entityType: 'company_settings',
      entityId: degisenler.join(','),
      // Değerlerin KENDİSİ günlüğe yazılmaz: alanlar arasında vergi/MERSİS gibi
      // bilgiler var ve denetim günlüğü hangi alanın değiştiğini bilmek için yeterli.
      detail: { alanlar: degisenler },
      ip: istemciIp(req),
    });

    // Şirket bilgisi KÖK DÜZENDE okunuyor → tüm sayfaları etkiler.
    // `'layout'` tipi, bu düzeni paylaşan tüm rotaların önbelleğini geçersiz kılar;
    // tek tek sayfa listelemek eksik kalırdı (119 statik sayfa var).
    revalidatePath('/', 'layout');
  }

  return NextResponse.redirect(mutlakUrl(req, '/admin/ayarlar?kayit=tamam'), { status: 303 });
}
