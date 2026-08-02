/**
 * Müşteri referansını günceller.
 *
 * Server Action DEĞİL, klasik form POST + rota işleyicisi — panelin genelindeki
 * kalıp. `(korumali)` grubunun DIŞINDA olduğu için yetkiyi kendisi doğrular.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { SESSION_COOKIE, readSession } from '@/lib/auth';
import { getReferans, guncelleReferans } from '@/lib/db/testimonials';
import { logActivity } from '@/lib/db/activity';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function mutlakUrl(req: NextRequest, yol: string): URL {
  const proto = req.headers.get('x-forwarded-proto') ?? new URL(req.url).protocol.replace(':', '');
  const host = req.headers.get('host') ?? new URL(req.url).host;
  return new URL(yol, `${proto}://${host}`);
}

function istemciIp(req: NextRequest): string {
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  const xff = req.headers.get('x-forwarded-for');
  if (!xff) return '';
  const p = xff.split(',');
  return p[p.length - 1].trim();
}

const metin = (v: FormDataEntryValue | null, sinir = 1000): string =>
  typeof v === 'string' ? v.replace(/\r\n/g, '\n').trim().slice(0, sinir) : '';

export async function POST(req: NextRequest) {
  const oturum = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!oturum) return NextResponse.redirect(mutlakUrl(req, '/admin/login'), { status: 303 });

  const geri = (q: string) => NextResponse.redirect(mutlakUrl(req, `/admin/referanslar?${q}`), { status: 303 });

  const origin = req.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.get('host')) return geri('hata=origin');
    } catch {
      return geri('hata=origin');
    }
  }

  const form = await req.formData();
  const id = Number(metin(form.get('id'), 12));
  const mevcut = getReferans(id);
  if (!mevcut) return geri('hata=bulunamadi');

  const sonuc = guncelleReferans(id, {
    marka: metin(form.get('marka'), 120),
    kisi: metin(form.get('kisi'), 120),
    unvan: metin(form.get('unvan'), 120),
    kategori: metin(form.get('kategori'), 120),
    proje: metin(form.get('proje'), 200),
    metin: metin(form.get('metin'), 4000),
    // İşaretlenmemiş onay kutusu form verisine HİÇ gelmez — yokluğu "hayır"dır.
    yayin_izni: form.get('yayin_izni') !== null,
    izin_kaynagi: metin(form.get('izin_kaynagi'), 300),
    izin_tarihi: metin(form.get('izin_tarihi'), 10),
    dogrulandi: form.get('dogrulandi') !== null,
    durum: metin(form.get('durum'), 20),
  });

  if (!sonuc.ok) return geri(`hata=${encodeURIComponent(sonuc.hata ?? 'kaydedilemedi')}`);

  logActivity({
    actor: oturum.email,
    action: 'referans.guncellendi',
    entityType: 'testimonials',
    entityId: String(id),
    // İzin durumu günlüğe YAZILIR: "bu referans ne zaman, kim tarafından ve hangi
    // izne dayanarak yayına alındı" sorusunun ikinci kaydı.
    detail: {
      marka: metin(form.get('marka'), 120),
      durum: metin(form.get('durum'), 20),
      izin: form.get('yayin_izni') !== null,
    },
    ip: istemciIp(req),
  });

  revalidatePath('/', 'layout');
  return geri('kayit=tamam');
}
