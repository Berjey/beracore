/**
 * Test çalıştırıcısı için modül çözümleme kancası.
 *
 * NEDEN VAR: Projede `@/lib/...` yol takma adı kullanılıyor (tsconfig `paths`).
 * Node bu takma adı bilmez ve `.ts` uzantısını da kendiliğinden eklemez.
 * Bu kanca ikisini de çözer, böylece testler kaynak dosyaları PROJEDEKİ
 * import biçimiyle (yani üretimdeki haliyle) içe alabilir.
 *
 * NOT: `.tsx` (JSX) kapsam dışıdır — Node'un tip soyma (type stripping)
 * özelliği JSX'i dönüştürmez. Testler saf mantık/veri modüllerini hedefler;
 * bileşen render testi gerekirse ayrı bir iş olarak jsdom+derleyici gerekir.
 */

import { existsSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve as resolvePath } from 'node:path';

const ROOT = resolvePath(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');

/** Yolun var olan bir DOSYA olup olmadığı (dizin ise false). */
function dosyaMi(p) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

/**
 * Uzantısız yolu gerçek dosyaya bağlar (`.ts`, `.tsx`, `/index.ts`).
 *
 * Dizin kontrolü ZORUNLU: `@/lib/db` gibi bir takma ad var olan bir DİZİNE denk
 * gelir. Yalnızca `existsSync` bakılırsa yol olduğu gibi döndürülür ve Node
 * `ERR_UNSUPPORTED_DIR_IMPORT` verir — Next'in paketleyicisi bunu kendisi
 * çözdüğü için hata sadece testlerde görülür.
 */
function withExtension(absPath) {
  if (dosyaMi(absPath)) return absPath;
  for (const candidate of [`${absPath}.ts`, `${absPath}.tsx`, join(absPath, 'index.ts')]) {
    if (existsSync(candidate)) return candidate;
  }
  return absPath;
}

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const target = withExtension(join(SRC, specifier.slice(2)));
    return nextResolve(pathToFileURL(target).href, context);
  }
  // Uzantısız göreli import (kaynak dosyalar arası) — aynı şekilde tamamla.
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\.[a-z]+$/i.test(specifier)) {
    const parentPath = context.parentURL ? dirname(fileURLToPath(context.parentURL)) : ROOT;
    const target = withExtension(resolvePath(parentPath, specifier));
    return nextResolve(pathToFileURL(target).href, context);
  }
  return nextResolve(specifier, context);
}
