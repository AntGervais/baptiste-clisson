import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import { SITE } from './src/config.mjs';
import tinaDirective from './astro-tina-directive/register.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const whenExternalScripts = (items = []) => SITE.googleAnalyticsId ? Array.isArray(items) ? items.map(item => item()) : [items()] : [];

// https://astro.build/config
export default defineConfig({
  site: SITE.origin,
  base: SITE.basePathname,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',
  output: 'static',
  markdown: {
    // remarkPlugins: [readingTimeRemarkPlugin],
  },
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }),
  sitemap(),
  ...whenExternalScripts(() => partytown({
    config: {
      forward: ['dataLayer.push']
    }
  })),
  react(),
  tinaDirective()],
  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src')
      }
    },
    build: {
      target: 'es2020',
      minify: 'esbuild',
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: {
            'swiper': ['swiper'],
            'photoswipe': ['photoswipe', 'photoswipe-dynamic-caption-plugin'],
            'react-vendor': ['react', 'react-dom'],
            'tinacms': ['tinacms']
          }
        }
      }
    }
  }
});
