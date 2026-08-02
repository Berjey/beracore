/**
 * Denetim günlüğü — kim, ne zaman, neyi değiştirdi.
 *
 * DEĞİŞTİRİLEMEZ olarak tasarlandı: bu modül bilerek yalnızca yazma ve okuma
 * sunar. `updateActivity` / `deleteActivity` YOKTUR ve eklenmemelidir —
 * silinebilen bir denetim kaydı denetim kaydı değildir.
 *
 * Kayıt tutmak, ana işlemi ASLA bozmamalıdır: günlük yazımı `try/catch` içinde
 * yutulur. Aynı ilke `api/contact/route.ts`'te lead kaydı için de uygulanıyor.
 */
import { getDb } from './index';

export interface ActivityKayit {
  id: number;
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string;
  detail: string;
  ip: string;
  at: string;
}

export interface ActivityGirdi {
  actor?: string;
  action: string;
  entityType?: string;
  entityId?: string | number;
  /** Serbest biçimli ayrıntı; JSON'a çevrilir. */
  detail?: unknown;
  ip?: string;
}

export function logActivity(girdi: ActivityGirdi): void {
  try {
    let detay = '';
    if (girdi.detail !== undefined) {
      // Döngüsel referans veya serialize edilemeyen değer günlüğü patlatmamalı.
      try {
        detay = JSON.stringify(girdi.detail) ?? '';
      } catch {
        detay = String(girdi.detail);
      }
    }

    getDb()
      .prepare(
        `INSERT INTO activity_log (actor, action, entity_type, entity_id, detail, ip)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(
        (girdi.actor ?? 'sistem').slice(0, 160),
        girdi.action.slice(0, 120),
        (girdi.entityType ?? '').slice(0, 60),
        String(girdi.entityId ?? '').slice(0, 60),
        detay.slice(0, 4000),
        (girdi.ip ?? '').slice(0, 64),
      );
  } catch (err) {
    // Günlük yazılamadıysa bile asıl işlem sürmelidir.
    console.error('[activity] kayit yazilamadi', err);
  }
}

export function listActivity(limit = 100): ActivityKayit[] {
  const n = Number.isInteger(limit) && limit > 0 && limit <= 1000 ? limit : 100;
  return getDb()
    .prepare('SELECT * FROM activity_log ORDER BY at DESC, id DESC LIMIT ?')
    .all(n) as unknown as ActivityKayit[];
}

export function listActivityForEntity(entityType: string, entityId: string | number): ActivityKayit[] {
  return getDb()
    .prepare(
      `SELECT * FROM activity_log
       WHERE entity_type = ? AND entity_id = ?
       ORDER BY at DESC, id DESC LIMIT 200`,
    )
    .all(entityType, String(entityId)) as unknown as ActivityKayit[];
}
