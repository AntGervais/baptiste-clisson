// .tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";
var clientId = process.env.TINA_CLIENT_ID || "dc844836-6c1e-4dc0-a9df-64ebe536212b";
var tinaToken = process.env.TINA_TOKEN || "1aa43ea3439008ca83a0afe90949b3669ab23672";
var config_default = defineConfig({
  clientId,
  // Get this from tina.io
  token: tinaToken,
  // Get this from tina.io
  branch,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "accueil_categories",
        label: "Cat\xE9gories Accueil",
        path: "src/content/accueil_categories",
        fields: [
          {
            type: "image",
            name: "image",
            label: "Image couverture",
            required: true
          },
          {
            type: "string",
            name: "title",
            label: "Titre",
            isTitle: true,
            required: true
          },
          {
            type: "rich-text",
            name: "description",
            label: "Description",
            isBody: true,
            required: true
          },
          {
            type: "string",
            name: "tag",
            label: "Tag",
            required: true,
            options: ["charpente", "restauration", "escalier"]
          }
        ]
      },
      {
        name: "realisations",
        label: "Realisations",
        path: "src/content/realisations",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Titre",
            isTitle: true,
            required: true
          },
          {
            type: "image",
            name: "image",
            label: "Image principale",
            required: true
          },
          {
            type: "string",
            name: "accroche",
            label: "Accroche"
          },
          {
            type: "string",
            name: "folder",
            label: "Nom du dossier des images : Media Manager -> /realisations"
          },
          {
            type: "rich-text",
            name: "description",
            label: "Description",
            isBody: true
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            options: ["charpente", "restauration", "escalier"]
          },
          {
            name: "publishDate",
            type: "datetime",
            label: "Publish Date",
            ui: {
              dateFormat: "DD MMM YYYY"
            }
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
