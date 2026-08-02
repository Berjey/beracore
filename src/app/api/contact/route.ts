import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { insertLead } from '@/lib/db/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { FORM_LIMITS } from '@/lib/form-limits';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Alan sınırları TEK KAYNAKTAN gelir (bulgu A-10). Burada sabit yazıldığı sürece
// istemcideki `maxLength` değerleriyle ayrışması an meselesiydi — nitekim ayrışmıştı
// (mesaj: sunucu 4000, istemci 2000).
const LIMITS = FORM_LIMITS;

// ---- Basit hız sınırı ----
// PM2 tek süreç (fork) çalıştığı için bellek içi sayaç yeterli.
// Amaç: form üzerinden SMTP kotasını tüketen otomatik gönderimleri engellemek.
const RATE_LIMIT = 5; // pencere başına izin verilen istek
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 dakika
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Bellek sızıntısını önle: pencere dışı kalan IP'leri ara sıra temizle
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > RATE_LIMIT;
}

/**
 * İstemci IP'si — hız sınırı anahtarı.
 *
 * Uygulama 127.0.0.1'e bağlıdır (`next start -H 127.0.0.1`), yani tüm trafik nginx'ten
 * geçer. Sunucudaki nginx yapılandırması (sites-available/beracore.com) şu iki başlığı
 * kendisi yazar:
 *     proxy_set_header X-Real-IP $remote_addr;                    → gelen değeri EZER
 *     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; → gerçek IP'yi SONA ekler
 *
 * Bu yüzden sıralama önemli: X-Real-IP birincil kaynaktır (istemci uyduramaz), XFF'te de
 * yalnızca SON değer güvenilirdir. Önceki kod XFF'in İLK değerini kullanıyordu; istemci
 * `X-Forwarded-For: <rastgele>` göndererek her istekte yeni bir kova açıp hız sınırını
 * atlayabiliyordu.
 */
function clientIp(req: Request): string {
  const real = req.headers.get('x-real-ip')?.trim();
  if (real) return real;
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) {
    const parts = fwd.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return 'unknown';
}

/**
 * Kimlik doğrulaması olmayan ve e-posta gönderen bir uç nokta olduğu için,
 * tarayıcıdan gelen çapraz köken (cross-origin) POST'ları reddet. Origin başlığı
 * hiç yoksa (tarayıcı dışı istemci) hız sınırı devrededir.
 */
function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  const host = req.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  consent?: boolean;
  hp?: string;
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)
  );

/** E-posta başlıklarına (Subject) girecek değerlerden satır sonu/kontrol karakterlerini
 *  temizler — başlık enjeksiyonuna karşı. */
const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim();

/** Müşteriye gösterilen ve e-postada yer alan talep referansı.
 *  İstemcide üretilmez: gösterilen numaranın gerçekten bir kaydı olması gerekir. */
function makeRef(): string {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rnd = crypto.getRandomValues(new Uint32Array(1))[0] % 10000;
  return `BRC-${stamp}-${String(rnd).padStart(4, '0')}`;
}

// Transporter tek kez kurulur ve havuzlanır — her istekte yeni SMTP bağlantısı açmaz.
let transporter: Transporter | null = null;
function getTransporter(cfg: {
  host: string; port: number; secure: boolean; user: string; pass: string;
}): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: { user: cfg.user, pass: cfg.pass },
      pool: true,
      maxConnections: 2,
      // Zaman aşımları: SMTP takılırsa istek süresiz beklemesin.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }
  return transporter;
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: 'forbidden_origin' }, { status: 403 });
  }

  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited', message: 'Çok fazla deneme yaptınız. Lütfen birkaç dakika sonra tekrar deneyin.' },
      { status: 429 }
    );
  }

  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  // Honeypot — silently accept to avoid spammer feedback
  if (typeof body.hp === 'string' && body.hp.trim().length > 0) {
    return NextResponse.json({ ok: true, ref: makeRef() });
  }

  // Beklenmeyen tipler (dizi/nesne/sayı) string'e zorlanmadan reddedilsin.
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const name = str(body.name);
  const email = str(body.email);
  const phone = str(body.phone);
  const company = str(body.company);
  const service = str(body.service);
  const budget = str(body.budget);
  const timeline = str(body.timeline);
  const message = str(body.message);
  const consent = body.consent === true;

  if (
    name.length > LIMITS.name || email.length > LIMITS.email || phone.length > LIMITS.phone ||
    company.length > LIMITS.company || message.length > LIMITS.message ||
    service.length > 120 || budget.length > 60 || timeline.length > 60
  ) {
    return NextResponse.json(
      { ok: false, error: 'payload_too_large', message: 'Girdiğiniz metin çok uzun. Lütfen kısaltıp tekrar deneyin.' },
      { status: 413 }
    );
  }

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = 'Ad Soyad en az 2 karakter olmalı.';
  if (!EMAIL_RE.test(email)) errors.email = 'Geçerli bir e-posta adresi girin.';
  if (message.length < 10) errors.message = 'Mesaj en az 10 karakter olmalı.';
  if (!consent) errors.consent = 'KVKK aydınlatma metnini onaylamalısınız.';
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, fields: errors }, { status: 422 });
  }

  const ref = makeRef();

  // ── Kalıcılık, HER ŞEYDEN ÖNCE ────────────────────────────────────────────
  // Kayıt bilinçli olarak SMTP kontrolünden de ÖNCE alınır. Aksi halde e-posta
  // yapılandırması bozulduğu anda (yanlış şifre, süresi dolmuş hesap, sağlayıcı
  // arızası) gelen her talep sessizce kaybolurdu — panelin var olma sebebi tam
  // olarak bunu önlemek. DB yazımı BAŞARISIZ olsa bile akış devam eder; form
  // veritabanına bağımlı hale getirilmez (eski davranış aynen korunur).
  let kaydedildi = false;
  try {
    insertLead({
      ref, name, email, phone, company, service, budget, timeline, message,
      ip: clientIp(req),
      userAgent: req.headers.get('user-agent') ?? '',
      mailSent: false,
    });
    kaydedildi = true;
  } catch (err) {
    console.error('[contact] lead kaydedilemedi (e-posta akisi etkilenmedi)', err);
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
    SMTP_TO,
    SMTP_SECURE,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM || !SMTP_TO) {
    console.error('[contact] SMTP env vars missing');
    // Talep kaydedildiyse müşteri kaybolmadı → ziyaretçiye hata gösterme.
    if (kaydedildi) return NextResponse.json({ ok: true, ref });
    return NextResponse.json({ ok: false, error: 'mail_not_configured' }, { status: 500 });
  }

  const port = Number(SMTP_PORT);
  const mailer = getTransporter({
    host: SMTP_HOST,
    port,
    secure: SMTP_SECURE ? SMTP_SECURE === 'true' : port === 465,
    user: SMTP_USER,
    pass: SMTP_PASS,
  });

  const subject = oneLine(`[${ref}] Yeni Teklif Talebi — ${name}${service ? ` · ${service}` : ''}`);
  const text =
    `Yeni teklif talebi BERACORE.com üzerinden alındı.\n\n` +
    `Referans : ${ref}\n` +
    `Ad Soyad : ${name}\n` +
    `E-posta  : ${email}\n` +
    `Telefon  : ${phone || '—'}\n` +
    `Şirket   : ${company || '—'}\n` +
    `Hizmet   : ${service || 'Belirtilmedi'}\n` +
    `Bütçe    : ${budget || 'Belirtilmedi'}\n` +
    `Takvim   : ${timeline || 'Belirtilmedi'}\n` +
    `KVKK     : ${consent ? 'Onaylandı' : 'Onaylanmadı'}\n\n` +
    `Mesaj:\n${message}\n`;

  const html = `
<div style="font-family: Inter, Arial, sans-serif; background:#1a1a1a; color:#f2f0ed; padding:32px; max-width:640px; margin:0 auto; border-radius:16px;">
  <div style="border-bottom:1px solid rgba(255,169,249,0.2); padding-bottom:16px; margin-bottom:24px;">
    <div style="font-size:11px; letter-spacing:0.3em; text-transform:uppercase; color:#ffa9f9; font-weight:600;">BERACORE · Yeni Talep · ${esc(ref)}</div>
    <h1 style="margin:8px 0 0; font-size:22px; font-weight:600;">${esc(name)}</h1>
    <div style="color:#c0bdb8; font-size:14px;">${esc(email)}${phone ? ' · ' + esc(phone) : ''}</div>
  </div>
  <table style="width:100%; border-collapse:collapse; font-size:14px;">
    ${[
      ['Referans', ref],
      ['Şirket', company || '—'],
      ['İlgilendiği Hizmet', service || 'Belirtilmedi'],
      ['Öngörülen Bütçe', budget || 'Belirtilmedi'],
      ['Zaman Çizelgesi', timeline || 'Belirtilmedi'],
      ['KVKK Onayı', consent ? 'Onaylandı' : 'Onaylanmadı'],
    ].map(([k, v]) => `
      <tr>
        <td style="padding:10px 0; color:#8a8784; width:38%; vertical-align:top;">${esc(k)}</td>
        <td style="padding:10px 0; color:#f2f0ed;">${esc(v)}</td>
      </tr>`).join('')}
  </table>
  <div style="margin-top:24px; padding-top:20px; border-top:1px solid rgba(255,247,173,0.15);">
    <div style="font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:#fff7ad; font-weight:600; margin-bottom:8px;">Mesaj</div>
    <div style="color:#f2f0ed; line-height:1.8; white-space:pre-wrap;">${esc(message)}</div>
  </div>
  <div style="margin-top:28px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.06); font-size:11px; color:#8a8784;">
    beracore.com/iletisim üzerinden gönderildi · ${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}
  </div>
</div>`;

  try {
    await mailer.sendMail({
      from: SMTP_FROM,
      to: SMTP_TO,
      replyTo: email,
      subject,
      text,
      html,
    });
    if (kaydedildi) {
      try {
        const { getDb } = await import('@/lib/db');
        getDb().prepare('UPDATE leads SET mail_sent = 1 WHERE ref = ?').run(ref);
      } catch {
        /* bayrak güncellenemedi — kayıt duruyor, panelde "mail gitmedi" görünür */
      }
    }
    return NextResponse.json({ ok: true, ref });
  } catch (err) {
    console.error('[contact] send failed', err);
    // Kayıt alındıysa talep GERÇEKTEN elimizde: ziyaretçiye hata gösterip onu
    // rakibe göndermek yanlış olur. Panelde `mail_sent = 0` olarak işaretli kalır,
    // yani gözden kaçmaz. Yalnızca hem DB hem e-posta başarısızsa hata döneriz.
    if (kaydedildi) return NextResponse.json({ ok: true, ref });
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
  }
}
