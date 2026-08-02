/**
 * Bir blog yazısını kaydeder ve etkilenen sayfaları yeniden ürettirir.
 *
 * Server Action DEĞİL, klasik form POST + rota işleyicisi — panelin genelindeki
 * kalıp. `(korumali)` grubunun DIŞINDA olduğu için yetkiyi kendisi doğrular.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { SESSION_COOKIE, readSession } from '@/lib/auth';
import { getIcerik, guncelleIcerik } from '@/lib/db/content-admin';
import { metniBloklara } from '@/lib/icerik-bicim';
import { logActivity } from '@/lib/db/activity';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Gövde sınırı: en uzun yazı ~14 KB. 200 KB, tek alanın veritabanını
// şişirmesini engellerken meşru içeriğe fazlasıyla yer bırakır.
const GOVDE_SINIRI = 200_000;

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

  const geri = (q: string) => NextResponse.redirect(mutlakUrl(req, `/admin/icerik/${id}?${q}`), { status: 303 });

  // CSRF: çapraz köken POST reddedilir (SameSite=Lax'in yanında ikinci katman).
  const origin = req.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.get('host')) return geri('hata=origin');
    } catch {
      return geri('hata=origin');
    }
  }

  const mevcut = getIcerik(id);
  if (!mevcut) return NextResponse.redirect(mutlakUrl(req, '/admin/icerik?hata=bulunamadi'), { status: 303 });

  const form = await req.formData();

  // SSS alanları `sss_soru_0`, `sss_cevap_0`, ... biçiminde gelir. Sabit sayıda
  // alan var ama sayıyı buradan varsaymak yerine formda ne varsa o okunur.
  const sss: { soru: string; cevap: string }[] = [];
  for (let i = 0; form.has(`sss_soru_${i}`); i++) {
    sss.push({ soru: metin(form.get(`sss_soru_${i}`), 500), cevap: metin(form.get(`sss_cevap_${i}`), 3000) });
  }

  const sonuc = guncelleIcerik(
    id,
    {
      baslik: metin(form.get('baslik'), 300),
      meta_title: metin(form.get('meta_title'), 300),
      meta_description: metin(form.get('meta_description'), 500),
      ozet: metin(form.get('ozet'), 1000),
      govde: metniBloklara(metin(form.get('govde'), GOVDE_SINIRI)),
      kategori: metin(form.get('kategori'), 80),
      okuma_dakika: Number(metin(form.get('okuma_dakika'), 5)) || 0,
      ilgili_hizmet_etiket: metin(form.get('ilgili_hizmet_etiket'), 200),
      ilgili_hizmet_href: metin(form.get('ilgili_hizmet_href'), 300),
      yayin_tarihi: metin(form.get('yayin_tarihi'), 10),
      guncelleme_tarihi: metin(form.get('guncelleme_tarihi'), 10),
      durum: metin(form.get('durum'), 20),
      sss,
    },
    oturum.email
  );

  if (!sonuc.ok) return geri(`hata=${encodeURIComponent(sonuc.hata ?? 'kaydedilemedi')}`);

  logActivity({
    actor: oturum.email,
    action: 'icerik.guncellendi',
    entityType: 'content_pages',
    entityId: String(id),
    // İçeriğin KENDİSİ günlüğe yazılmaz — tam metin zaten `content_versions`'ta.
    detail: { slug: mevcut.slug, durum: metin(form.get('durum'), 20) },
    ip: istemciIp(req),
  });

  // Yazı sayfası + liste + sitemap etkilenir. Ayrıca "ilgili yazılar" grafiği
  // tüm yazıları kapsadığı için bir yazının başlığı değişince başka sayfalardaki
  // kart metni de değişir → düzen düzeyinde tazeleme doğru olan.
  revalidatePath('/', 'layout');

  return geri('kayit=tamam');
}
