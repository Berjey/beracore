/**
 * `node --import` ile yüklenir; test-loader.mjs kancasını kayda geçirir.
 * Ayrı dosya olması gerekir çünkü `register()` kancayı kendi thread'inde çalıştırır.
 */
import { register } from 'node:module';

register('./test-loader.mjs', import.meta.url);
