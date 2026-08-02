/**
 * İçerik bloklarının DÜZ METİN gösterimi — saf, istemci güvenli.
 *
 * NEDEN VAR: gövde veritabanında `ContentBlock[]` JSON'u olarak duruyor. Panelde
 * ham JSON düzenletmek, tek bir eksik virgülün yazıyı boşaltması demekti. Bunun
 * yerine Markdown'a benzeyen, kayıpsız gidip gelen basit bir biçim kullanılıyor:
 *
 *   Düz satır      → { type: 'p' }
 *   ## Başlık      → { type: 'h2' }
 *   ### Alt başlık → { type: 'h3' }
 *   - madde        → { type: 'ul', items: [...] }  (ardışık satırlar tek listede)
 *   > alıntı       → { type: 'quote' }
 *
 * Bu Markdown DEĞİLDİR ve öyle davranmaz: satır içi biçimlendirme (kalın, link)
 * yoktur. Bilinçli — mevcut render katmanı da desteklemiyor ve desteklermiş gibi
 * görünen bir editör, yazarın yazdığı `**kalın**`ın siteye düz metin çıkmasına
 * yol açardı.
 *
 * Mevcut 50 yazının tamamı bu biçime KAYIPSIZ dönüşüyor (doğrulandı: hiçbir blok
 * metni satır sonu içermiyor ve hiçbiri işaretçi öneki ile başlamıyor).
 * `tests/icerik-bicim.test.ts` her yazı için gidiş-dönüş denkliğini kilitler.
 */
import type { ContentBlock } from './blog-data';

export function bloklariMetne(bloklar: ContentBlock[]): string {
  return bloklar
    .map((b) => {
      switch (b.type) {
        case 'h2': return `## ${b.text}`;
        case 'h3': return `### ${b.text}`;
        case 'quote': return `> ${b.text}`;
        case 'ul': return b.items.map((i) => `- ${i}`).join('\n');
        default: return b.text;
      }
    })
    .join('\n\n');
}

export function metniBloklara(metin: string): ContentBlock[] {
  const bloklar: ContentBlock[] = [];
  // Boş satırlar ayırıcıdır; \r\n normalize edilir (Windows'tan yapıştırılan metin).
  const parcalar = metin.replace(/\r\n/g, '\n').split(/\n\s*\n/);

  for (const ham of parcalar) {
    const parca = ham.trim();
    if (!parca) continue;

    const satirlar = parca.split('\n').map((s) => s.trim()).filter(Boolean);

    // Liste: parçadaki TÜM satırlar "- " ile başlıyorsa. Karışık parçada liste
    // varsayımı yapmak, araya sıkışmış bir paragrafı sessizce madde yapardı.
    if (satirlar.length > 0 && satirlar.every((s) => s.startsWith('- '))) {
      bloklar.push({ type: 'ul', items: satirlar.map((s) => s.slice(2).trim()) });
      continue;
    }

    for (const satir of satirlar) {
      if (satir.startsWith('### ')) bloklar.push({ type: 'h3', text: satir.slice(4).trim() });
      else if (satir.startsWith('## ')) bloklar.push({ type: 'h2', text: satir.slice(3).trim() });
      else if (satir.startsWith('> ')) bloklar.push({ type: 'quote', text: satir.slice(2).trim() });
      else bloklar.push({ type: 'p', text: satir });
    }
  }

  return bloklar;
}
