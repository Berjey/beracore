/**
 * Bir şehir sayfasını kaydeder ve etkilenen sayfaları yeniden ürettirir.
 *
 * Server Action DEĞİL, klasik form POST + rota işleyicisi — panelin genelindeki
 * kalıp. `(korumali)` grubunun DIŞINDA olduğu için yetkiyi kendisi doğrular.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { SESSION_COOKIE, readSession } from '@/lib/auth';
import { getIcerik, guncelleSehir, type SehirYuku } from '@/lib/db/content-admin';
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

  const geri = (q: string) => NextResponse.redirect(mutlakUrl(req, `/admin/sehirler/${id}?${q}`), { status: 303 });

  const origin = req.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.get('host')) return geri('hata=origin');
    } catch {
      return geri('hata=origin');
    }
  }

  const mevcut = getIcerik(id);
  if (!mevcut || mevcut.tip !== 'sehir') {
    return NextResponse.redirect(mutlakUrl(req, '/admin/sehirler?hata=bulunamadi'), { status: 303 });
  }

  const form = await req.formData();

  // Başlığı boş olan bölüm ATILIR — silme yolu bu. Metni dolu ama başlığı boş
  // bir bölüm sayfada başlıksız paragraf olarak çıkardı.
  const sections: { h2: string; body: string }[] = [];
  for (let i = 0; form.has(`bolum_h2_${i}`); i++) {
    const h2 = metin(form.get(`bolum_h2_${i}`), 300);
    const body = metin(form.get(`bolum_body_${i}`), 8000);
    if (h2 && body) sections.push({ h2, body });
  }

  const sss: { soru: string; cevap: string }[] = [];
  for (let i = 0; form.has(`sss_soru_${i}`); i++) {
    sss.push({ soru: metin(form.get(`sss_soru_${i}`), 500), cevap: metin(form.get(`sss_cevap_${i}`), 3000) });
  }

  // `citySlug` ve `city` formda YOK; yazma katmanı onları mevcut kayıttan alır.
  // Rota bu iki alandan türüyor, panelden değiştirilmesi URL'i kırardı.
  const yuk = {
    citySlug: '',
    city: '',
    keyword: metin(form.get('keyword'), 200),
    intro: metin(form.get('intro'), 5000),
    sections,
    bullets: {
      title: metin(form.get('bullets_title'), 300),
      items: metin(form.get('bullets_items'), 5000).split('\n').map((s) => s.trim()).filter(Boolean),
    },
    serviceHref: metin(form.get('serviceHref'), 300),
    serviceLabel: metin(form.get('serviceLabel'), 200),
    blogHref: metin(form.get('blogHref'), 300),
    blogLabel: metin(form.get('blogLabel'), 200),
  } satisfies SehirYuku;

  const sonuc = guncelleSehir(
    id,
    {
      baslik: metin(form.get('baslik'), 300),
      meta_title: metin(form.get('meta_title'), 300),
      meta_description: metin(form.get('meta_description'), 500),
      durum: metin(form.get('durum'), 20),
      guncelleme_tarihi: metin(form.get('guncelleme_tarihi'), 10),
      yuk,
      sss,
    },
    oturum.email
  );

  if (!sonuc.ok) return geri(`hata=${encodeURIComponent(sonuc.hata ?? 'kaydedilemedi')}`);

  logActivity({
    actor: oturum.email,
    action: 'sehir.guncellendi',
    entityType: 'content_pages',
    entityId: String(id),
    detail: { slug: mevcut.slug, bolum: sections.length, sss: sss.filter((f) => f.soru && f.cevap).length },
    ip: istemciIp(req),
  });

  // Şehir sayfası + aynı şehrin diğer sayfalarındaki çapraz linkler + sitemap etkilenir.
  revalidatePath('/', 'layout');

  return geri('kayit=tamam');
}
