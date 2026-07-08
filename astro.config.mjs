import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import { SITE } from './src/config.mjs';
import tinaDirective from './astro-tina-directive/register.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const whenExternalScripts = (items = []) =>
  SITE.googleAnalyticsId ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

// https://astro.build/config
export default defineConfig({
  site: SITE.origin,
  base: SITE.basePathname,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',
  output: 'static',
  image: {
    defaultQuality: 85,
  },
  fonts: [
    {
      name: 'Buenard',
      cssVariable: '--font-buenard',
      provider: fontProviders.google(),
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['serif'],
    },
    {
      name: 'Satisfy',
      cssVariable: '--font-satisfy',
      provider: fontProviders.google(),
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['cursive'],
    },
  ],
  markdown: {
    // remarkPlugins: [readingTimeRemarkPlugin],
  },
  integrations: [
    sitemap(),
    ...whenExternalScripts(() =>
      partytown({
        config: {
          forward: ['dataLayer.push'],
        },
      })
    ),
    icon(),
    react(),
    tinaDirective(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'es2020',
      minify: 'esbuild',
    },
  },
});
