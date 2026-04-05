import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.github/**',
      'types.generated.d.ts',
      'public/admin/**',
      'tina/__generated__/**',
      '.tina/__generated__/**',
    ],
  },
  js.configs.recommended,
  // TypeScript uniquement sur les fichiers .ts/.tsx (pas les .astro)
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: config.files ?? ['**/*.ts', '**/*.tsx'],
  })),
  // Astro après TypeScript pour que son parser prime sur les .astro
  ...eslintPluginAstro.configs.recommended,
  {
    ...jsxA11y.flatConfigs.recommended,
    files: ['**/*.{js,jsx,ts,tsx}'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  {
    files: ['**/*.js', '**/*.astro'],
    rules: {
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
];
