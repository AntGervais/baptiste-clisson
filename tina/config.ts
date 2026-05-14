import { defineConfig } from 'tinacms';

const branch = process.env.TINA_BRANCH || process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main';
const clientId = process.env.TINA_CLIENT_ID || process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '';
const tinaToken = process.env.TINA_TOKEN || '';
const isCiBuild = Boolean(process.env.CI || process.env.NETLIFY);

const requireEnv = (name: string, value: string) => {
  if (isCiBuild && !value) {
    throw new Error(`Missing required Tina environment variable: ${name}`);
  }
};

requireEnv('TINA_CLIENT_ID', clientId);
requireEnv('TINA_TOKEN', tinaToken);

const normalizeSegment = (segment: string) =>
  segment
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const withTrailingSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);

const toSlug = (relativePath: string) =>
  relativePath
    .replace(/\.(md|mdx)$/, '')
    .split('/')
    .flatMap((segment) => { const s = normalizeSegment(segment); return s ? [s] : []; })
    .join('/');

export default defineConfig({
  clientId,
  token: tinaToken,
  branch,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'accueil_categories',
        label: 'Catégories Accueil',
        path: 'src/content/accueil_categories',
        ui: {
          router({ document }) {
            const slug = toSlug(document._sys.relativePath);
            return withTrailingSlash(`/demo/${slug}`);
          },
        },
        fields: [
          {
            type: 'image',
            name: 'image',
            label: 'Image couverture',
            required: true,
          },
          {
            type: 'string',
            name: 'title',
            label: 'Titre',
            isTitle: true,
            required: true,
          },
          {
            type: 'rich-text',
            name: 'description',
            label: 'Description',
            isBody: true,
            required: true,
          },
          {
            type: 'string',
            name: 'tag',
            label: 'Tag',
            required: true,
            options: ['charpente', 'restauration', 'escalier'],
          },
        ],
      },
      {
        name: 'realisations',
        label: 'Realisations',
        path: 'src/content/realisations',
        ui: {
          router({ document }) {
            const slug = toSlug(document._sys.relativePath);
            return withTrailingSlash(`/${slug}`);
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Titre',
            isTitle: true,
            required: true,
          },
          {
            type: 'image',
            name: 'image',
            label: 'Image principale',
            required: true,
          },
          {
            type: 'string',
            name: 'accroche',
            label: 'Accroche',
          },
          {
            type: 'string',
            name: 'location',
            label: 'Ville / Lieu',
          },
          {
            type: 'rich-text',
            name: 'description',
            label: 'Description',
            isBody: true,
          },
          {
            type: 'image',
            name: 'gallery',
            label: 'Galerie d\'images',
            list: true,
            description: 'Sélectionnez les images à afficher dans le slider',
          },
          {
            type: 'string',
            name: 'tags',
            label: 'Tags',
            list: true,
            options: ['charpente', 'restauration', 'escalier'],
          },
          {
            name: 'publishDate',
            type: 'datetime',
            label: 'Publish Date',
            ui: {
              dateFormat: 'DD MMM YYYY',
            },
          },
        ],
      },
    ],
  },
});
