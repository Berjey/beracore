/**
 * Özellik bayrakları — yarım modülleri KAPALI olarak canlıya almayı mümkün kılar.
 *
 * Neden var: program 24 modül ve 9 faz. Her modülü "tamamen bitene kadar" ayrı
 * dalda bekletmek uzun yaşayan dallar üretir; birleştirme acısı ve gözden kaçan
 * regresyon demektir. Bayrakla kod ana dala girer, kullanıcıya kapalı kalır.
 *
 * Varsayılan DAİMA kapalıdır: bayrak kaydı yoksa özellik yok sayılır. Böylece
 * migration çalışmamış bir ortamda yarım modül kazara açılmaz.
 */
import { getDb } from './index';

export interface FeatureFlag {
  anahtar: string;
  acik: number;
  aciklama: string;
  faz: string;
  updated_at: string;
}

/**
 * Bayrak açık mı? Kayıt yoksa `false`.
 *
 * NOT: Sonuç önbelleğe ALINMAZ. `dynamic = 'force-dynamic'` olan panel
 * sayfalarında her istek DB'ye gider — SQLite yerel dosya, maliyeti mikrosaniye.
 * Önbellek, bayrağı kapattıktan sonra özelliğin açık kalmasına yol açardı;
 * bayrağın tek işi anında kapatabilmek olduğu için bu takas yanlış olurdu.
 */
export function flagAcik(anahtar: string): boolean {
  const satir = getDb()
    .prepare('SELECT acik FROM feature_flags WHERE anahtar = ?')
    .get(anahtar) as { acik: number } | undefined;
  return satir?.acik === 1;
}

export function listFlags(): FeatureFlag[] {
  return getDb()
    .prepare('SELECT * FROM feature_flags ORDER BY faz, anahtar')
    .all() as unknown as FeatureFlag[];
}

/** Bayrağı oluşturur veya günceller (panelden yönetim için). */
export function setFlag(anahtar: string, acik: boolean, aciklama = '', faz = ''): void {
  getDb()
    .prepare(
      `INSERT INTO feature_flags (anahtar, acik, aciklama, faz, updated_at)
       VALUES (?, ?, ?, ?, datetime('now'))
       ON CONFLICT(anahtar) DO UPDATE SET
         acik = excluded.acik,
         aciklama = CASE WHEN excluded.aciklama = '' THEN feature_flags.aciklama ELSE excluded.aciklama END,
         faz = CASE WHEN excluded.faz = '' THEN feature_flags.faz ELSE excluded.faz END,
         updated_at = datetime('now')`,
    )
    .run(anahtar, acik ? 1 : 0, aciklama, faz);
}
