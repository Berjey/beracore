/**
 * Yeni müşteri referansı ekler — HER ZAMAN izinsiz ve taslak olarak.
 *
 * Ekleme formunda "yayınla" seçeneği bilerek yok: izin sorusu bir onay kutusuna
 * indirgenmemeli, yayına almak ayrı ve bilinçli bir ikinci adım olmalı.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, readSession } from '@/lib/auth';
import { ekleReferans } from '@/lib/db/testimonials';
import { logActivity } from '@/lib/db/activity';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function mutlakUrl(req: NextRequest, yol: string): URL {
  const proto = req.headers.get('x-forwarded-proto') ?? new URL(req.url).protocol.replace(':', '');
  const host = req.headers.get('host') ?? new URL(req.url).host;
  return new URL(yol, `${proto}://${host}`);
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
  const sonuc = ekleReferans(metin(form.get('marka'), 120), metin(form.get('metin'), 4000));
  if (!sonuc.ok) return geri(`hata=${encodeURIComponent(sonuc.hata ?? 'kaydedilemedi')}`);

  logActivity({
    actor: oturum.email,
    action: 'referans.eklendi',
    entityType: 'testimonials',
    entityId: String(sonuc.id ?? ''),
    detail: { marka: metin(form.get('marka'), 120) },
    ip: '',
  });

  // Taslak olarak eklendiği için public sayfa ETKİLENMEZ; tazeleme gereksiz.
  return geri('kayit=tamam');
}
