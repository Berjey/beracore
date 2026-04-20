import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  // Honeypot — silently accept to avoid spammer feedback
  if (body.hp && body.hp.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const phone = (body.phone ?? '').trim();
  const company = (body.company ?? '').trim();
  const service = (body.service ?? '').trim();
  const budget = (body.budget ?? '').trim();
  const timeline = (body.timeline ?? '').trim();
  const message = (body.message ?? '').trim();
  const consent = Boolean(body.consent);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = 'Ad Soyad en az 2 karakter olmalı.';
  if (!EMAIL_RE.test(email)) errors.email = 'Geçerli bir e-posta adresi girin.';
  if (message.length < 10) errors.message = 'Mesaj en az 10 karakter olmalı.';
  if (!consent) errors.consent = 'KVKK aydınlatma metnini onaylamalısınız.';
  if (name.length > 120 || email.length > 160 || phone.length > 40 || company.length > 140 || message.length > 4000) {
    return NextResponse.json({ ok: false, error: 'payload_too_large' }, { status: 413 });
  }
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, fields: errors }, { status: 422 });
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
    return NextResponse.json(
      { ok: false, error: 'mail_not_configured' },
      { status: 500 }
    );
  }

  const port = Number(SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: SMTP_SECURE ? SMTP_SECURE === 'true' : port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const subject = `Yeni Teklif Talebi — ${name}${service ? ` · ${service}` : ''}`;
  const text =
    `Yeni teklif talebi BERACORE.com üzerinden alındı.\n\n` +
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
    <div style="font-size:11px; letter-spacing:0.3em; text-transform:uppercase; color:#ffa9f9; font-weight:600;">BERACORE · Yeni Talep</div>
    <h1 style="margin:8px 0 0; font-size:22px; font-weight:600;">${esc(name)}</h1>
    <div style="color:#c0bdb8; font-size:14px;">${esc(email)}${phone ? ' · ' + esc(phone) : ''}</div>
  </div>
  <table style="width:100%; border-collapse:collapse; font-size:14px;">
    ${[
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
    await transporter.sendMail({
      from: SMTP_FROM,
      to: SMTP_TO,
      replyTo: email,
      subject,
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] send failed', err);
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
  }
}
