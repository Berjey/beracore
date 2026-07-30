import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';

// `eslint-config-next` hâlâ eslintrc biçiminde yayınlanıyor; ESLint 9'un flat
// config'ine FlatCompat ile köprülenir (Next'in kendi önerdiği yol).
const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'next-env.d.ts',
      'public/**',
    ],
  },

  // Next.js kuralları: react-hooks, jsx-a11y ve core-web-vitals dahil.
  ...compat.extends('next/core-web-vitals'),

  // TypeScript kuralları — tip bilgisi GEREKTİRMEYEN set. Tip doğruluğu ayrıca
  // `npm run build` (tsc) tarafından zaten kontrol ediliyor; burada tekrarlanmaz.
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx,mjs}'],
    rules: {
      // Kullanılmayan değişken = ölü kod. `_` önekli argümanlar bilinçli atlamadır.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      // Üretim kodunda debug çıktısı bırakılmaz; uyarı/hata kanalları serbest.
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
    },
  },

  {
    // Build/deploy araçları Node tarafında çalışır; konsola yazmaları işlevleri.
    files: ['scripts/**/*.mjs', 'tests/**/*.ts'],
    rules: { 'no-console': 'off' },
  },
];

export default config;
