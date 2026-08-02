/**
 * Tek bir şirket metriğini günceller ve etkilenen sayfaları yeniden ürettirir.
 *
 * Server Action DEĞİL, klasik form POST + rota işleyicisi — panelin genelindeki
 * kalıp (gerekçesi `admin/giris/route.ts`'te).
 *
 * NOT: Bu rota `(korumali)` grubunun DIŞINDA olduğu için düzenin oturum
 * kontrolünü miras almaz; yetkiyi kendisi doğrular.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { SESSION_COOKIE, readSession } from '@/lib/auth';
import { guncelleMetrik, listMetrikler } from '@/lib/db/metrics';
import { logActivity } from '@/lib/db/activity';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function mutlakUrl(req: NextRequest, yol: string): URL {
  // Hedef `Host` başlığından kurulur, `req.url`'den DEĞİL — gerekçe
  // `admin/ayarlar/kaydet/route.ts`'te (sonsuz giriş döngüsüne yol açmıştı).
  const proto = req.headers.get('x-forwarded-proto') ?? new URL(req.url).protocol.replace(':', '');
  const host = req.headers.get('host') ?? new URL(req.url).host;
  return new URL(yol, `${proto}://${host}`);
}

function istemciIp(req: NextRequest): string {
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  const xff = req.headers.get('x-forwarded-for');
  if (!xff) return '';
  const parcalar = xff.split(',');
  return parcalar[parcalar.length - 1].trim();
}

const metin = (v: FormDataEntryValue | null, sinir = 500): string =>
  typeof v === 'string' ? v.replace(/\r\n/g, '\n').trim().slice(0, sinir) : '';

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
        return NextResponse.redirect(mutlakUrl(req, '/admin/metrikler?hata=origin'), { status: 303 });
      }
    } catch {
      return NextResponse.redirect(mutlakUrl(req, '/admin/metrikler?hata=origin'), { status: 303 });
    }
  }

  const form = await req.formData();
  const anahtar = metin(form.get('anahtar'), 80);

  // Yalnızca veritabanında TANIMLI metrik güncellenebilir. Metrik EKLEME/SİLME
  // bilerek panelde yok: her metriğin ne ölçtüğü migration'da tanımlıdır, panelden
  // serbestçe uydurulabilseydi kanıt kuralı anlamını yitirirdi.
  const izinli = new Set(listMetrikler().map((m) => m.anahtar));
  if (!izinli.has(anahtar)) {
    return NextResponse.redirect(mutlakUrl(req, '/admin/metrikler?hata=bulunamadi'), { status: 303 });
  }

  const sonuc = guncelleMetrik(anahtar, {
    deger: Number(metin(form.get('deger'), 12)),
    olcum_yontemi: metin(form.get('olcum_yontemi'), 1000),
    veri_kaynagi: metin(form.get('veri_kaynagi'), 500),
    kanit_url: metin(form.get('kanit_url'), 500),
    son_dogrulama: metin(form.get('son_dogrulama'), 20),
    durum: metin(form.get('durum'), 20),
    // İşaretlenmemiş onay kutusu form verisine HİÇ gelmez — yokluğu "kapalı"dır.
    ana_sayfa: form.get('ana_sayfa') !== null,
    hakkimizda: form.get('hakkimizda') !== null,
  });

  if (!sonuc.ok) {
    return NextResponse.redirect(
      mutlakUrl(req, `/admin/metrikler?hata=${encodeURIComponent(sonuc.hata ?? 'bilinmeyen')}`),
      { status: 303 }
    );
  }

  logActivity({
    actor: oturum.email,
    action: 'metrik.guncellendi',
    entityType: 'company_metrics',
    entityId: anahtar,
    // Durum ve değer günlüğe YAZILIR: "bu sayı ne zaman, kim tarafından yayına
    // alındı" sorusunun cevabı kanıt zincirinin parçasıdır.
    detail: { durum: metin(form.get('durum'), 20), deger: metin(form.get('deger'), 12) },
    ip: istemciIp(req),
  });

  // Metrikler kök düzende okunuyor → tüm sayfaları etkiler.
  revalidatePath('/', 'layout');

  return NextResponse.redirect(mutlakUrl(req, '/admin/metrikler?kayit=tamam'), { status: 303 });
}
