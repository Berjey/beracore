import Link from 'next/link';
import { listLeads, countByStatus, LEAD_DURUMLARI, DURUM_ETIKET, type LeadDurum } from '@/lib/db/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DURUM_RENK: Record<LeadDurum, string> = {
  yeni: 'border-accent/40 bg-accent/[0.10] text-accent',
  okundu: 'border-white/15 bg-white/[0.04] text-white/60',
  iletisimde: 'border-sky-400/30 bg-sky-400/[0.08] text-sky-200',
  teklif: 'border-accent2/40 bg-accent2/[0.08] text-accent2',
  kazanildi: 'border-emerald-400/30 bg-emerald-400/[0.08] text-emerald-200',
  kaybedildi: 'border-white/10 bg-white/[0.02] text-white/35',
};

function tarih(s: string): string {
  // SQLite datetime('now') UTC üretir; Türkiye saatine çevrilerek gösterilir.
  const d = new Date(s.replace(' ', 'T') + 'Z');
  return d.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default async function AdminInbox({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string }>;
}) {
  const { durum } = await searchParams;
  const leads = listLeads(durum);
  const sayilar = countByStatus();
  const toplam = Object.values(sayilar).reduce((a, b) => a + b, 0);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-[1.5rem] font-semibold text-white">Gelen Kutusu</h1>
        <p className="font-body text-[0.82rem] text-white/40">
          {toplam} talep{sayilar.yeni ? ` · ${sayilar.yeni} yeni` : ''}
        </p>
      </div>

      {/* Durum filtresi */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin"
          className={`rounded-full border px-4 py-1.5 font-body text-[0.8rem] transition-colors ${
            !durum ? 'border-white/30 bg-white/[0.06] text-white' : 'border-white/10 text-white/50 hover:border-white/25'
          }`}
        >
          Tümü ({toplam})
        </Link>
        {LEAD_DURUMLARI.map((d) => (
          <Link
            key={d}
            href={`/admin?durum=${d}`}
            className={`rounded-full border px-4 py-1.5 font-body text-[0.8rem] transition-colors ${
              durum === d ? 'border-white/30 bg-white/[0.06] text-white' : 'border-white/10 text-white/50 hover:border-white/25'
            }`}
          >
            {DURUM_ETIKET[d]} ({sayilar[d] ?? 0})
          </Link>
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] px-6 py-16 text-center">
          <p className="font-body text-[0.95rem] text-white/60">
            {durum ? 'Bu durumda talep yok.' : 'Henüz talep gelmedi.'}
          </p>
          {!durum && (
            <p className="mt-2 font-body text-[0.82rem] text-white/35">
              İletişim formundan gelen her talep otomatik olarak buraya düşer.
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                {['Tarih', 'Ad Soyad', 'Hizmet', 'Bütçe', 'Durum', ''].map((h) => (
                  <th key={h} className="px-4 py-3 font-body text-[0.7rem] font-semibold uppercase tracking-wider text-white/40">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-4 py-3 font-body text-[0.8rem] text-white/50">{tarih(l.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/lead/${l.id}`} className="font-body text-[0.9rem] font-medium text-white hover:text-accent">
                      {l.name}
                    </Link>
                    <span className="block font-body text-[0.76rem] text-white/35">{l.email}</span>
                  </td>
                  <td className="px-4 py-3 font-body text-[0.82rem] text-white/60">{l.service || '—'}</td>
                  <td className="px-4 py-3 font-body text-[0.82rem] text-white/60">{l.budget || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full border px-3 py-1 font-body text-[0.72rem] font-medium ${DURUM_RENK[l.status] ?? DURUM_RENK.okundu}`}>
                      {DURUM_ETIKET[l.status] ?? l.status}
                    </span>
                    {/* E-posta gitmediyse gözden kaçmasın: kayıt duruyor ama bildirim ulaşmamış. */}
                    {!l.mail_sent && (
                      <span className="ml-2 inline-block rounded-full border border-amber-400/30 bg-amber-400/[0.08] px-2 py-1 font-body text-[0.68rem] text-amber-200" title="Kayıt alındı ancak bildirim e-postası gönderilemedi">
                        mail ✕
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/lead/${l.id}`} className="inline-flex min-h-[24px] items-center font-body text-[0.78rem] text-accent/70 hover:text-accent">
                      Aç →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
