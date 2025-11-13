import { defineConfig } from 'tinacms';

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main';
const clientId = process.env.TINA_CLIENT_ID || '3f6b5893-f77a-4f93-a595-ec18a27e0dfc';
const tinaToken = process.env.TINA_TOKEN || '6dc1d18b8713af2268f297e9e41d0e52dc169596';

export default defineConfig({
  clientId: clientId, // Get this from tina.io
  token: tinaToken, // Get this from tina.io
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
            name: 'folder',
            label: 'Nom du dossier des images : Media Manager -> /realisations',
          },
          {
            type: 'rich-text',
            name: 'description',
            label: 'Description',
            isBody: true,
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
