# Guide de mise en place de Cloudinary pour TinaCMS

Ce guide vous explique comment configurer **Cloudinary** sur votre projet. Cela permettra à TinaCMS d'envoyer les images directement sur les serveurs de Cloudinary (au lieu de votre dépôt Git), où elles seront automatiquement compressées, redimensionnées et optimisées.

## 1. Création du compte Cloudinary

1.  Allez sur [cloudinary.com](https://cloudinary.com/) et créez un compte gratuit ("Sign Up for Free").
2.  Une fois connecté, vous arriverez sur le **Dashboard**.
3.  Notez les informations suivantes (en haut à gauche) :
    *   **Cloud Name**
    *   **API Key**
    *   **API Secret**

## 2. Installation du module

Ouvrez votre terminal dans le dossier du projet et lancez la commande suivante pour installer l'adaptateur Cloudinary pour Tina :

```bash
pnpm add tinacms-cloudinary
```

## 3. Configuration des variables d'environnement

Créez (ou modifiez) le fichier `.env` à la racine de votre projet et ajoutez-y vos clés Cloudinary.
**Attention :** Ne committez jamais ce fichier `.env` sur GitHub s'il n'est pas ignoré (il devrait être dans `.gitignore`).

```env
# .env
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

*Remarque : Si vous déployez sur Netlify ou Vercel, vous devrez également ajouter ces variables dans l'interface d'administration de l'hébergeur.*

## 4. Modification de la configuration Tina

Ouvrez le fichier `tina/config.ts` et modifiez-le pour utiliser le `TinaCloudCloudinaryMediaStore`.

Voici les changements à effectuer :

### A. Ajouter les imports

Tout en haut du fichier `tina/config.ts` :

```typescript
import { defineConfig } from 'tinacms';
// Ajoutez cet import :
import { TinaCloudCloudinaryMediaStore } from 'tinacms-cloudinary';
```

### B. Mettre à jour la configuration `media`

Cherchez la section `media` dans `defineConfig` et remplacez-la par ceci :

```typescript
  media: {
    // On remplace 'tina' par 'loadCustomStore'
    loadCustomStore: async () => {
      const pack = await import("tinacms-cloudinary");
      return pack.TinaCloudCloudinaryMediaStore;
    },
  },
```

## 5. Vérification

1.  Relancez votre serveur de développement : `pnpm dev`.
2.  Allez dans l'admin TinaCMS (`/admin`).
3.  Essayez d'uploader une image dans le "Media Manager".
4.  Si tout fonctionne, l'image devrait apparaître et être hébergée sur Cloudinary (vous pouvez vérifier l'URL de l'image, elle commencera par `res.cloudinary.com`).

## Avantages obtenus

*   **Compression automatique** : Cloudinary convertit automatiquement les images en WebP/AVIF et réduit leur poids sans perte visible.
*   **Redimensionnement** : Vous pouvez demander des tailles spécifiques.
*   **Dépôt Git léger** : Les images ne sont plus stockées dans votre code, ce qui garde votre projet Git rapide et propre.
