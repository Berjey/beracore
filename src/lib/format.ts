// Ortak tarih biçimlendirme — blog kartları (blog/util) ve yazı sayfası
// (BlogArticle) tek kaynaktan kullanır (tekrar yok).

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

/** ISO tarih (YYYY-MM-DD) → "3 Temmuz 2026" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${parseInt(d, 10)} ${MONTHS[parseInt(m, 10) - 1]} ${y}`;
}
