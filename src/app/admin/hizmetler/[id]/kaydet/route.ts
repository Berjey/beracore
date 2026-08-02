/**
 * Bir hizmet kategorisini veya alt hizmeti kaydeder.
 *
 * Server Action DEĞİL, klasik form POST + rota işleyicisi — panelin genelindeki
 * kalıp. `(korumali)` grubunun DIŞINDA olduğu için yetkiyi kendisi doğrular.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { SESSION_COOKIE, readSession } from '@/lib/auth';
import { getIcerik, guncelleKategori, guncelleAltHizmet } from '@/lib/db/content-admin';
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

const satirlar = (v: FormDataEntryValue | null, sinir = 8000): string[] =>
  metin(v, sinir).split('\n').map((s) => s.trim()).filter(Boolean);

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: hamId } = await params;
  const id = Number(hamId);

  const oturum = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!oturum) return NextResponse.redirect(mutlakUrl(req, '/admin/login'), { status: 303 });

  const geri = (q: string) => NextResponse.redirect(mutlakUrl(req, `/admin/hizmetler/${id}?${q}`), { status: 303 });

  const origin = req.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.get('host')) return geri('hata=origin');
    } catch {
      return geri('hata=origin');
    }
  }

  const mevcut = getIcerik(id);
  if (!mevcut || (mevcut.tip !== 'hizmet' && mevcut.tip !== 'hizmet-alt')) {
    return NextResponse.redirect(mutlakUrl(req, '/admin/hizmetler?hata=bulunamadi'), { status: 303 });
  }

  const form = await req.formData();

  const sss: { soru: string; cevap: string }[] = [];
  for (let i = 0; form.has(`sss_soru_${i}`); i++) {
    sss.push({ soru: metin(form.get(`sss_soru_${i}`), 500), cevap: metin(form.get(`sss_cevap_${i}`), 3000) });
  }

  // Tip formdan DEĞİL veritabanından okunur; form alanı yalnızca gösterim içindir.
  const sonuc = mevcut.tip === 'hizmet'
    ? guncelleKategori(id, {
        baslik: metin(form.get('baslik'), 200),
        ozet: metin(form.get('ozet'), 1000),
        subtitle: metin(form.get('subtitle'), 200),
        overview: (() => {
          const liste: { h2: string; body: string }[] = [];
          for (let i = 0; form.has(`ov_h2_${i}`); i++) {
            const h2 = metin(form.get(`ov_h2_${i}`), 300);
            const body = metin(form.get(`ov_body_${i}`), 8000);
            if (h2 && body) liste.push({ h2, body });
          }
          return liste;
        })(),
        durum: metin(form.get('durum'), 20),
        sss,
      }, oturum.email)
    : guncelleAltHizmet(id, {
        baslik: metin(form.get('baslik'), 200),
        meta_title: metin(form.get('meta_title'), 300),
        meta_description: metin(form.get('meta_description'), 500),
        ozet: metin(form.get('ozet'), 1000),
        longDescription: metin(form.get('longDescription'), 8000),
        features: satirlar(form.get('features')),
        process: satirlar(form.get('process')),
        benefits: satirlar(form.get('benefits')),
        // `değer | etiket` satırları. Ayıracı olmayan satır atılır — yarım bir
        // kutu, etiketi olmayan bir sayı olarak sayfaya çıkardı.
        stats: satirlar(form.get('stats'), 2000)
          .map((s) => {
            const [deger, ...kalan] = s.split('|');
            return { value: deger.trim(), label: kalan.join('|').trim() };
          })
          .filter((s) => s.value && s.label),
        durum: metin(form.get('durum'), 20),
        sss,
      }, oturum.email);

  if (!sonuc.ok) return geri(`hata=${encodeURIComponent(sonuc.hata ?? 'kaydedilemedi')}`);

  logActivity({
    actor: oturum.email,
    action: mevcut.tip === 'hizmet' ? 'hizmet-kategori.guncellendi' : 'hizmet.guncellendi',
    entityType: 'content_pages',
    entityId: String(id),
    detail: { slug: mevcut.slug, durum: metin(form.get('durum'), 20) },
    ip: istemciIp(req),
  });

  // Hizmet başlıkları menüde, alt bilgide ve ana sayfada görünüyor → tüm site.
  revalidatePath('/', 'layout');

  return geri('kayit=tamam');
}
