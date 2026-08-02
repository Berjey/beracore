/**
 * Lead üzerindeki mutasyonlar: durum değiştirme ve not ekleme.
 *
 * Server Action DEĞİL, klasik form POST. Gerekçe `admin/giris/route.ts`'te
 * ayrıntılı: panelin tamamı JavaScript olmadan çalışsın ve davranışı düz HTTP ile
 * deterministik biçimde test edilebilsin istiyoruz. Panel, işin kaybolmaması için
 * var — en güvenilir mekanizmayı seçmek doğru takas.
 *
 * NOT: Bu rota `(korumali)` grubunun DIŞINDA olduğu için düzenin oturum kontrolünü
 * miras almaz; yetkiyi kendisi doğrular.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, readSession } from '@/lib/auth';
import { addNote, updateLeadStatus, getLead, LEAD_DURUMLARI, type LeadDurum } from '@/lib/db/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function mutlakUrl(req: NextRequest, yol: string): URL {
  const proto = req.headers.get('x-forwarded-proto') ?? new URL(req.url).protocol.replace(':', '');
  const host = req.headers.get('host') ?? new URL(req.url).host;
  return new URL(yol, `${proto}://${host}`);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  // Yetki: düzen sarmadığı için burada doğrulanır.
  if (!readSession(req.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.redirect(mutlakUrl(req, '/admin/login'), { status: 303 });
  }

  // CSRF: çapraz köken POST reddedilir (SameSite=Lax'in yanında ikinci katman).
  const origin = req.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.get('host')) {
        return NextResponse.redirect(mutlakUrl(req, '/admin'), { status: 303 });
      }
    } catch {
      return NextResponse.redirect(mutlakUrl(req, '/admin'), { status: 303 });
    }
  }

  const { id } = await ctx.params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId) || leadId < 1 || !getLead(leadId)) {
    return NextResponse.redirect(mutlakUrl(req, '/admin'), { status: 303 });
  }

  const form = await req.formData();

  const durum = String(form.get('durum') ?? '');
  if (durum && (LEAD_DURUMLARI as readonly string[]).includes(durum)) {
    updateLeadStatus(leadId, durum as LeadDurum);
  }

  const not = String(form.get('not') ?? '').trim();
  if (not) addNote(leadId, not.slice(0, 5000));

  return NextResponse.redirect(mutlakUrl(req, `/admin/lead/${leadId}`), { status: 303 });
}
