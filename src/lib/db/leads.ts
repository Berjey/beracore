/** Lead sorguları — admin UI ve iletişim API'si burayı kullanır. */
import { getDb } from '@/lib/db';

export const LEAD_DURUMLARI = [
  'yeni',
  'okundu',
  'iletisimde',
  'teklif',
  'kazanildi',
  'kaybedildi',
] as const;
export type LeadDurum = (typeof LEAD_DURUMLARI)[number];

export const DURUM_ETIKET: Record<LeadDurum, string> = {
  yeni: 'Yeni',
  okundu: 'Okundu',
  iletisimde: 'İletişimde',
  teklif: 'Teklif Verildi',
  kazanildi: 'Kazanıldı',
  kaybedildi: 'Kaybedildi',
};

export interface Lead {
  id: number;
  ref: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  source: string;
  status: LeadDurum;
  ip: string;
  user_agent: string;
  mail_sent: number;
  created_at: string;
  updated_at: string;
}

export interface Not {
  id: number;
  entity_type: string;
  entity_id: number;
  body: string;
  created_at: string;
}

export function insertLead(v: {
  ref: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  ip: string;
  userAgent: string;
  mailSent: boolean;
}): number {
  const r = getDb()
    .prepare(
      `INSERT INTO leads (ref,name,email,phone,company,service,budget,timeline,message,ip,user_agent,mail_sent)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
    )
    .run(
      v.ref, v.name, v.email, v.phone, v.company, v.service, v.budget,
      v.timeline, v.message, v.ip.slice(0, 64), v.userAgent.slice(0, 300), v.mailSent ? 1 : 0
    );
  return Number(r.lastInsertRowid);
}

export function listLeads(durum?: string, limit = 100): Lead[] {
  const db = getDb();
  return (
    durum && (LEAD_DURUMLARI as readonly string[]).includes(durum)
      ? db.prepare('SELECT * FROM leads WHERE status = ? ORDER BY created_at DESC LIMIT ?').all(durum, limit)
      : db.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT ?').all(limit)
  ) as unknown as Lead[];
}

export function getLead(id: number): Lead | null {
  return (getDb().prepare('SELECT * FROM leads WHERE id = ?').get(id) as unknown as Lead) ?? null;
}

export function updateLeadStatus(id: number, durum: LeadDurum): void {
  getDb()
    .prepare("UPDATE leads SET status = ?, updated_at = datetime('now') WHERE id = ?")
    .run(durum, id);
}

export function countByStatus(): Record<string, number> {
  const satirlar = getDb()
    .prepare('SELECT status, COUNT(*) AS n FROM leads GROUP BY status')
    .all() as unknown as { status: string; n: number }[];
  const out: Record<string, number> = {};
  for (const s of satirlar) out[s.status] = s.n;
  return out;
}

export function listNotes(leadId: number): Not[] {
  return getDb()
    .prepare("SELECT * FROM notes WHERE entity_type = 'lead' AND entity_id = ? ORDER BY created_at DESC")
    .all(leadId) as unknown as Not[];
}

export function addNote(leadId: number, body: string): void {
  getDb()
    .prepare("INSERT INTO notes(entity_type, entity_id, body) VALUES('lead', ?, ?)")
    .run(leadId, body);
}
