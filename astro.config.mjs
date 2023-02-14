import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import compress from 'astro-compress';
import NetlifyCMS from 'astro-netlify-cms';

import { SITE } from './src/config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const whenExternalScripts = (items = []) =>
  SITE.googleAnalyticsId ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  site: SITE.origin,
  base: SITE.basePathname,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',

  output: 'static',

  markdown: {
    // remarkPlugins: [readingTimeRemarkPlugin],
  },

  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    sitemap(),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
    mdx(),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      css: true,
      html: {
        removeAttributeQuotes: false,
      },
      img: false,
      js: true,
      svg: false,

      logger: 1,
    }),

    NetlifyCMS({
      previewStyles: ['https://fonts.googleapis.com/css2?family=Roboto&display=swap', '/src/assets/styles/cms.css'],
      config: {
        // Use Netlify’s “Git Gateway” authentication and target our default branch
        backend: {
          name: 'git-gateway',
          branch: 'main',
        },
        // Configure where our media assets are stored & served from
        media_folder: '/public/images',
        public_folder: '/public/images',
        // Configure the content collections
        collections: [
          {
            name: 'imageAccueil',
            label: 'Images accueil',
            label_singular: 'image',
            folder: 'src/content/imageAccueil',
            create: true,
            delete: true,
            fields: [
              {
                name: 'image',
                widget: 'image',
                label: 'Image principale',
                required: true,
              },
              {
                name: 'description',
                widget: 'string',
                label: 'Description',
                required: true,
              },
            ],
          },
          {
            name: 'posts',
            label: 'Posts',
            label_singular: 'Post',
            folder: 'src/content/post',
            create: true,
            delete: true,
            fields: [
              {
                name: 'title',
                widget: 'string',
                label: 'Titre',
                required: true,
              },
              {
                name: 'image',
                widget: 'image',
                label: 'Image principale',
                required: true,
              },
              {
                name: 'description',
                widget: 'string',
                label: 'Description',
                required: true,
              },
              {
                name: 'body',
                widget: 'markdown',
                label: 'body',
              },
              {
                name: 'tags',
                widget: 'select',
                label: 'Tags',
                multiple: true,
                min: 1,
                options: ['charpente', 'nouveau', 'rénovation'],
              },
              {
                name: 'publishDate',
                widget: 'datetime',
                format: 'DD MMM YYYY',
                date_format: 'DD MMM YYYY',
                time_format: false,
                label: 'Publish Date',
              },
              {
                name: 'accueil',
                widget: 'boolean',
                label: 'Afficher page accueil',
                required: false,
              },
            ],
          },
        ],
      },
    }),
  ],

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
