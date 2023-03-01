import { defineConfig } from 'tinacms';

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main';
const clientId = process.env.TINA_CLIENT_ID || 'dc844836-6c1e-4dc0-a9df-64ebe536212b';
const tinaToken = process.env.TINA_TOKEN || '1aa43ea3439008ca83a0afe90949b3669ab23672';

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
        name: 'imageAccueil',
        label: 'Catégories Accueil',
        path: 'src/content/imageAccueil',
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
            options: ['charpente', 'ossature', 'rénovation', 'escalier'],
          },
        ],
      },
      {
        name: 'realisation',
        label: 'Realisations',
        path: 'src/content/realisation',
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
            options: ['charpente', 'ossature', 'rénovation', 'escalier'],
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
