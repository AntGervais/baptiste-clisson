# Charpente Bois Debout

Site web vitrine pour **Charpente Bois Debout**, entreprise de charpenterie traditionnelle située à Saulgé (86), spécialisée dans la charpente traditionnelle, les structures bois, les escaliers sur mesure et la restauration de bâti ancien.

**Site en production** : [charpenteboisdebout.fr](https://charpenteboisdebout.fr)

## Stack Technique

### Framework & Build

- **[Astro 7.x](https://astro.build/)** (`^7.0.2`) - Framework moderne pour sites statiques haute performance
  - Génération de sites statiques (SSG)
  - Islands Architecture pour hydratation partielle
  - Chargement de polices Google natif via l'API Astro Fonts
  - Support MDX natif
  - Propulsé par **Vite 8** (bundler Rolldown) pour des builds plus rapides
  - Pipeline Markdown par défaut **Sätteri** (GFM + SmartyPants) — aucun plugin remark/rehype utilisé

### Styling

- **[Tailwind CSS 4.x](https://tailwindcss.com/)** (`^4.2.2`) - Framework CSS utility-first
  - Intégration via le plugin Vite `@tailwindcss/vite` (plus de `tailwind.config.cjs`)
  - Plugin typography pour le contenu markdown
  - Configuration CSS-first

### Polices

- **Buenard** (Google Fonts, 400 / 700) — titres
- **Satisfy** (Google Fonts, 400) — textes d'accroche
- Chargées nativement par Astro sans dépendance externe

### Gestion de Contenu

- **[TinaCMS 3.x](https://tina.io/)** (`tinacms ^3.7.1`) - Headless CMS git-based
  - Interface d'édition visuelle accessible via `/admin`
  - Contenu stocké en Markdown dans `src/content/`
  - Schéma défini dans `tina/config.ts`
  - Directive Astro personnalisée `astro-tina-directive` pour l'édition visuelle en contexte
  - Deux collections principales :
    - `accueil_categories` : Catégories de services affichées sur la page d'accueil
    - `realisations` : Portfolio des projets réalisés

### Bibliothèques JavaScript

- **[Swiper 12.x](https://swiperjs.com/)** (`^12.1.3`) - Carousels tactiles modernes
  - Galeries d'images
  - Carrousel de réalisations
  - Navigation entre catégories
- **[PhotoSwipe 5.x](https://photoswipe.com/)** (`^5.4.4`) - Lightbox responsive pour galeries d'images, avec `photoswipe-dynamic-caption-plugin`
- **[React 19.x](https://react.dev/)** (`^19.2.4`) - Pour l'interface d'administration TinaCMS

### Icônes

- **[astro-icon](https://github.com/natemoo-re/astro-icon)** (`^1.1.5`) avec les collections Iconify :
  - `@iconify-json/ri` (Remix Icons)
  - `@iconify-json/tabler` (Tabler Icons)

### SEO & Analytics

- **[@astrolib/seo](https://www.npmjs.com/package/@astrolib/seo)** (`^0.3.1`) - Meta tags, Open Graph, Twitter Cards
- **[@astrolib/analytics](https://www.npmjs.com/package/@astrolib/analytics)** (`^0.3.0`) - Analytics (Google Analytics via Partytown)
- **[@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** (`^3.7.2`) - Sitemap généré automatiquement
- **[@astrojs/partytown](https://docs.astro.build/en/guides/integrations-guide/partytown/)** (`^2.1.6`) - Scripts analytics exécutés en Web Worker

### Optimisation

- **Sharp** (`0.33.5`) - Traitement et optimisation des images (build-time)
- **Vite 8 / Rolldown** - Bundling et minification JS/CSS en production (minify `esbuild`, target ES2020)

### Outils de Développement

- **pnpm** `10.33.0` - Gestionnaire de paquets rapide et efficace
- **TypeScript** (`^6.0.2`) - Typage statique
- **ESLint** (`^9.39.4`) - Linter JavaScript/TypeScript/Astro (flat config `eslint.config.js`)
  - `typescript-eslint` `^8.58.0` - Intégration TypeScript
  - `eslint-plugin-astro` `^1.6.0` - Support des fichiers `.astro`
  - `eslint-plugin-jsx-a11y` `^6.10.2` - Accessibilité JSX
- **Prettier** (`^3.8.1`) - Formateur de code (avec plugins Astro et Tailwind)

## Prérequis

- **Node.js** `>=22.12.0`
- **pnpm** `10.x`

```bash
# Installer pnpm si nécessaire
npm install -g pnpm@10
```

## Installation

```bash
# Cloner le repository
git clone [url-du-repo]
cd baptiste-clisson

# Installer les dépendances
pnpm install
```

## Commandes

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Démarre le serveur de développement avec TinaCMS sur `localhost:4321` |
| `pnpm start` | Démarre le serveur Astro uniquement (sans TinaCMS) |
| `pnpm build` | Build Astro uniquement (`astro build` → `./dist/`) |
| `pnpm build:prod` | Build complet : TinaCMS (`tina:build`) puis Astro |
| `pnpm preview` | Prévisualise le build de production localement |
| `pnpm format` | Formate le code avec Prettier |
| `pnpm lint:eslint` | Analyse le code avec ESLint |

## Architecture du Projet

```
baptiste-clisson/
├── astro-tina-directive/     # Directive Astro personnalisée pour TinaCMS
├── tina/                     # Configuration TinaCMS
│   ├── config.ts            # Schéma des collections
│   └── __generated__/       # Fichiers générés par TinaCMS
├── public/
│   ├── admin/               # Interface TinaCMS (généré)
│   └── images/              # Assets statiques et uploads TinaCMS
│       └── realisations/    # Images des projets
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── base.css     # Styles globaux + Tailwind
│   ├── components/
│   │   ├── common/          # Composants partagés
│   │   ├── contact/         # Formulaire de contact
│   │   ├── photoswipe/      # Intégration PhotoSwipe
│   │   ├── realisations/    # Composants portfolio
│   │   ├── review/          # Avis clients
│   │   └── widgets/         # Sections de page (Header, Footer, Hero…)
│   ├── content/             # Contenu Markdown géré par TinaCMS
│   │   ├── accueil_categories/  # Catégories page d'accueil
│   │   └── realisations/        # Portfolio projets
│   ├── layouts/
│   │   ├── BaseLayout.astro     # Layout principal avec SEO
│   │   ├── MarkdownLayout.astro # Layout pour contenu markdown
│   │   └── PageLayout.astro     # Layout pages standards
│   ├── pages/
│   │   ├── [...realisations]/   # Routes dynamiques portfolio
│   │   │   ├── index.astro          # Liste des réalisations
│   │   │   ├── [...page].astro      # Pagination
│   │   │   └── [tag]/[...page].astro # Filtrage par tag
│   │   ├── index.astro          # Page d'accueil
│   │   ├── charpente-renovation.astro
│   │   ├── escaliers.astro
│   │   ├── extension-ossature.astro
│   │   ├── mentions-legales.astro
│   │   └── 404.astro
│   ├── functions/           # Fonctions Netlify
│   ├── types.ts             # Types TypeScript
│   ├── utils/               # Fonctions utilitaires
│   ├── config.mjs           # Configuration du site
│   └── data.js              # Données navigation & footer
├── astro.config.mjs         # Configuration Astro
├── netlify.toml             # Configuration Netlify
└── package.json
```

## Système de Réalisations (Portfolio)

Le portfolio fonctionne avec un système de collections Astro + TinaCMS :

1. **Création de contenu** : Via l'interface TinaCMS (`/admin`), créer une nouvelle réalisation
2. **Stockage** : Fichier Markdown généré dans `src/content/realisations/`
3. **Frontmatter** : Métadonnées (titre, date, tags, images, description)
4. **Affichage** : Pages dynamiques générées automatiquement
5. **Filtrage** : Par tags, avec pagination automatique

### Schéma d'une Réalisation

```markdown
---
title: "Titre du projet"
publishDate: 2024-01-15T00:00:00.000Z
image: /images/realisations/projet/principale.jpg
tags:
  - charpente
  - restauration
category: charpente
excerpt: "Description courte du projet"
images:
  - image: /images/realisations/projet/photo1.jpg
  - image: /images/realisations/projet/photo2.jpg
---

Description détaillée du projet en Markdown...
```

## Gestion du Contenu avec TinaCMS

### Accès à l'interface d'administration

1. Lancer le serveur de développement : `pnpm dev`
2. Accéder à `http://localhost:4321/admin`
3. Se connecter (authentification Git)

### Édition de contenu

- **Mode visuel** : Édition directe sur les pages du site via la directive `tina:`
- **Mode formulaire** : Édition via formulaires structurés
- **Sauvegarde** : Commits Git automatiques

### Collections disponibles

- **Accueil Categories** : Services affichés sur la page d'accueil
- **Realisations** : Projets du portfolio avec galeries d'images

## Déploiement

### Netlify (Production Actuelle)

Le site est automatiquement déployé sur Netlify à chaque push sur `main`.

**Configuration** : `netlify.toml`
- Build command : `pnpm build:prod`
- Publish directory : `dist`
- Node version : 24
- `NODE_OPTIONS="--max-old-space-size=4096"` pour les builds volumineux
- Variables d'environnement à configurer dans l'UI Netlify : `TINA_CLIENT_ID`, `TINA_TOKEN`, `TINA_BRANCH` (optionnel)

**URL de production** : https://charpenteboisdebout.fr

### Déploiement Manuel

```bash
# Build complet (TinaCMS + Astro)
pnpm build:prod

# Le dossier dist/ contient le site statique prêt à déployer
```

## Performance & SEO

- **Images optimisées** : Compression automatique avec Sharp
- **Minification** : esbuild via Vite 8 / Rolldown (JS/CSS) en production
- **Lazy loading** : Images et composants chargés à la demande
- **Sitemap** : Généré automatiquement via `@astrojs/sitemap`
- **Meta tags** : Open Graph et Twitter Cards via `@astrolib/seo`
- **Analytics** : Google Analytics via Partytown (Web Worker)

## Développement

### Structure des Composants

- **Widgets** : Grandes sections réutilisables (Hero, Features, CallToAction)
- **Common** : Petits composants partagés (Boutons, Images, MetaTags)
- **Spécifiques** : Composants métier (Realisations, Contact, Reviews)

### Conventions

- **Nommage** : PascalCase pour les composants Astro
- **Styles** : Classes Tailwind en priorité, CSS custom minimal
- **Images** : Toujours optimisées via le composant Image d'Astro
- **Alias** : `~/*` pointe vers `src/*`
- **Types** : Interfaces TypeScript dans `src/types.ts`

### Ajout d'une Nouvelle Page

1. Créer un fichier `.astro` dans `src/pages/`
2. Utiliser un layout existant (`PageLayout`, `BaseLayout`)
3. Ajouter la route dans `src/data.js` si nécessaire
4. Le routing est automatique basé sur le nom de fichier

## Variables d'Environnement

Aucune variable d'environnement n'est requise pour le développement local.

Pour la production, configurer dans Netlify :
- `TINA_CLIENT_ID` — ID client TinaCloud
- `TINA_TOKEN` — Token d'accès TinaCloud
- `TINA_BRANCH` — Branche Git (optionnel, défaut : `main`)
- `GOOGLE_ANALYTICS_ID` — ID Google Analytics (si activé dans `config.mjs`)

## Support & Maintenance

- **Framework** : Basé sur le template AstroWind
- **Auteur original** : onWidget
- **Adaptation** : Personnalisée pour Charpente Bois Debout

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE.md](./LICENSE.md) pour plus de détails.

---

Construit avec passion pour un artisan passionné par le bois et les savoir-faire traditionnels.
