/**
 * Bir hukuki metnin YENİ SÜRÜMÜNÜ yayınlar (denetim bulgusu A-11).
 *
 * Diğer içerik rotalarından farkı: yürürlük tarihi ve değişiklik notu zorunlu,
 * ve revizyon kaydı ziyaretçiye de gösteriliyor.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { SESSION_COOKIE, readSession } from '@/lib/auth';
import { getIcerik, guncelleYasal } from '@/lib/db/content-admin';
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

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: hamId } = await params;
  const id = Number(hamId);

  const oturum = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!oturum) return NextResponse.redirect(mutlakUrl(req, '/admin/login'), { status: 303 });

  const geri = (q: string) => NextResponse.redirect(mutlakUrl(req, `/admin/yasal/${id}?${q}`), { status: 303 });

  const origin = req.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.get('host')) return geri('hata=origin');
    } catch {
      return geri('hata=origin');
    }
  }

  const mevcut = getIcerik(id);
  if (!mevcut || mevcut.tip !== 'yasal') {
    return NextResponse.redirect(mutlakUrl(req, '/admin/yasal?hata=bulunamadi'), { status: 303 });
  }

  const form = await req.formData();

  const sections: { title: string; body: string | string[] }[] = [];
  for (let i = 0; form.has(`bolum_baslik_${i}`); i++) {
    const title = metin(form.get(`bolum_baslik_${i}`), 300);
    const ham = metin(form.get(`bolum_metin_${i}`), 12000);
    if (!title || !ham) continue;

    // Liste mi paragraf mı, satır sayısından DEĞİL onay kutusundan belirlenir:
    // tek maddelik bir liste, satır sayısına bakan bir kural yüzünden sessizce
    // paragrafa dönüşürdü ve işaretleme (ul/li) kaybolurdu.
    const listeMi = form.get(`bolum_liste_${i}`) !== null;
    const body = listeMi
      ? ham.split('\n').map((s) => s.trim()).filter(Boolean)
      : ham.replace(/\n+/g, ' ').trim();

    if (Array.isArray(body) ? body.length > 0 : body.length > 0) sections.push({ title, body });
  }

  const sonuc = guncelleYasal(
    id,
    {
      baslik: metin(form.get('baslik'), 200),
      meta_title: metin(form.get('meta_title'), 300),
      meta_description: metin(form.get('meta_description'), 500),
      intro: metin(form.get('intro'), 2000),
      accent: metin(form.get('accent'), 100),
      lastUpdated: metin(form.get('lastUpdated'), 60),
      yururluk: metin(form.get('yururluk'), 10),
      sections,
      degisiklik_notu: metin(form.get('degisiklik_notu'), 500),
      durum: metin(form.get('durum'), 20),
    },
    oturum.email
  );

  if (!sonuc.ok) return geri(`hata=${encodeURIComponent(sonuc.hata ?? 'kaydedilemedi')}`);

  logActivity({
    actor: oturum.email,
    action: 'yasal.yeni-surum',
    entityType: 'content_pages',
    entityId: String(id),
    // Hukuki metinde denetim günlüğü, revizyon kaydının İKİNCİ kopyasıdır:
    // `content_versions` silinemez ama bu günlük de bağımsız olarak tutulur.
    detail: {
      slug: mevcut.slug,
      yururluk: metin(form.get('yururluk'), 10),
      not: metin(form.get('degisiklik_notu'), 500),
    },
    ip: istemciIp(req),
  });

  revalidatePath('/', 'layout');

  return geri('kayit=tamam');
}
