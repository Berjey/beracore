import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLead, listNotes, LEAD_DURUMLARI, DURUM_ETIKET } from '@/lib/db/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function tarih(s: string): string {
  return new Date(s.replace(' ', 'T') + 'Z').toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default async function LeadDetay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId) || leadId < 1) notFound();

  const lead = getLead(leadId);
  if (!lead) notFound();
  const notlar = listNotes(leadId);

  const alanlar: [string, string][] = [
    ['Referans', lead.ref],
    ['E-posta', lead.email],
    ['Telefon', lead.phone || '—'],
    ['Şirket', lead.company || '—'],
    ['Hizmet', lead.service || '—'],
    ['Bütçe', lead.budget || '—'],
    ['Zaman Çizelgesi', lead.timeline || '—'],
    ['Kaynak', lead.source],
    ['Geliş Tarihi', tarih(lead.created_at)],
  ];

  return (
    <>
      <Link href="/admin" className="mb-6 inline-flex min-h-[24px] items-center font-body text-[0.82rem] text-white/50 hover:text-white">
        ← Gelen Kutusu
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-[1.6rem] font-semibold text-white">{lead.name}</h1>
          <p className="mt-1 font-body text-[0.85rem] text-white/40">{lead.ref}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={`mailto:${lead.email}?subject=${encodeURIComponent(`[${lead.ref}] BERACORE — Teklif talebiniz hk.`)}`}
            className="inline-flex min-h-[40px] items-center rounded-xl px-5 py-2.5 font-body text-[0.82rem] font-semibold text-black transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #fff7ad, #ffa9f9)' }}
          >
            E-posta Yaz
          </a>
          {lead.phone && (
            <a
              href={`tel:${lead.phone.replace(/\s/g, '')}`}
              className="inline-flex min-h-[40px] items-center rounded-xl border border-white/15 px-5 py-2.5 font-body text-[0.82rem] font-medium text-white/80 transition-colors hover:border-white/35"
            >
              Ara
            </a>
          )}
        </div>
      </div>

      {!lead.mail_sent && (
        <p role="alert" className="mb-6 rounded-xl border border-amber-400/30 bg-amber-400/[0.08] px-4 py-3 font-body text-[0.84rem] text-amber-200">
          Bu talebin bildirim e-postası gönderilemedi. Kayıt güvende, ancak e-posta kutunuzda görünmeyecek.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6">
            <h2 className="mb-4 font-body text-[0.72rem] font-semibold uppercase tracking-wider text-white/40">Mesaj</h2>
            <p className="whitespace-pre-wrap font-body text-[0.92rem] leading-[1.8] text-white/80">{lead.message}</p>
          </section>

          <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6">
            <h2 className="mb-4 font-body text-[0.72rem] font-semibold uppercase tracking-wider text-white/40">Notlar</h2>
            <form action={`/admin/lead/${leadId}/islem`} method="post" className="mb-5">
              <textarea
                name="not" rows={3} required maxLength={5000}
                placeholder="Görüşme notu, sonraki adım…"
                className="w-full resize-y rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-body text-[0.88rem] text-white outline-none transition-colors focus:border-accent/60"
              />
              <button
                type="submit"
                className="mt-3 min-h-[40px] rounded-xl border border-accent/30 bg-accent/[0.08] px-5 py-2 font-body text-[0.8rem] font-semibold text-accent transition-colors hover:border-accent/60"
              >
                Not Ekle
              </button>
            </form>
            {notlar.length === 0 ? (
              <p className="font-body text-[0.84rem] text-white/35">Henüz not yok.</p>
            ) : (
              <ul className="space-y-3">
                {notlar.map((n) => (
                  <li key={n.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                    <p className="whitespace-pre-wrap font-body text-[0.87rem] leading-[1.7] text-white/75">{n.body}</p>
                    <p className="mt-2 font-body text-[0.72rem] text-white/30">{tarih(n.created_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6">
            <h2 className="mb-4 font-body text-[0.72rem] font-semibold uppercase tracking-wider text-white/40">Durum</h2>
            <form action={`/admin/lead/${leadId}/islem`} method="post" className="flex flex-wrap gap-2">
              {LEAD_DURUMLARI.map((d) => (
                <button
                  key={d} name="durum" value={d} type="submit"
                  className={`min-h-[32px] rounded-full border px-3.5 py-1.5 font-body text-[0.78rem] transition-colors ${
                    lead.status === d
                      ? 'border-accent/50 bg-accent/[0.12] text-accent'
                      : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
                  }`}
                >
                  {DURUM_ETIKET[d]}
                </button>
              ))}
            </form>
          </section>

          <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6">
            <h2 className="mb-4 font-body text-[0.72rem] font-semibold uppercase tracking-wider text-white/40">Bilgiler</h2>
            <dl className="space-y-3">
              {alanlar.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="shrink-0 font-body text-[0.8rem] text-white/40">{k}</dt>
                  <dd className="break-all text-right font-body text-[0.84rem] text-white/80">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </>
  );
}
