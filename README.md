# Charpente Bois Debout

Site web vitrine pour **Charpente Bois Debout**, entreprise de charpenterie traditionnelle située à Saulgé (86), spécialisée dans la charpente traditionnelle, les structures bois, les escaliers sur mesure et la restauration de bâti ancien.

🌐 **Site en production** : [charpenteboisdebout.fr](https://charpenteboisdebout.fr)

## Stack Technique

### Framework & Build

- **[Astro 5.x](https://astro.build/)** (v5.15.0) - Framework moderne pour sites statiques haute performance
  - Génération de sites statiques (SSG)
  - Rendu côté serveur (SSR) optionnel
  - Islands Architecture pour hydratation partielle
  - Support MDX natif

### Styling

- **[Tailwind CSS](https://tailwindcss.com/)** (v3.3.2) - Framework CSS utility-first
  - Configuration personnalisée (`tailwind.config.cjs`)
  - Plugin typography pour le contenu markdown
  - Thème personnalisé avec variables de couleurs

### Gestion de Contenu

- **[TinaCMS](https://tina.io/)** (v2.9.3) - Headless CMS git-based
  - Interface d'édition visuelle accessible via `/admin`
  - Contenu stocké en Markdown dans `src/content/`
  - Schéma défini dans `.tina/config.ts`
  - Deux collections principales :
    - `accueil_categories` : Catégories de services affichées sur la page d'accueil
    - `realisations` : Portfolio des projets réalisés

### Bibliothèques JavaScript

- **[Swiper](https://swiperjs.com/)** (v9.3.2) - Carousels tactiles modernes
  - Galeries d'images
  - Carrousel de réalisations
  - Navigation entre catégories
- **[PhotoSwipe](https://photoswipe.com/)** (v5.3.7) - Lightbox responsive pour galeries d'images
- **[AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)** (v2.3.4) - Animations au scroll
- **[React](https://react.dev/)** (v18.2.0) - Pour l'interface d'administration TinaCMS

### Optimisation

- **Sharp** (v0.33.5) - Traitement et optimisation des images
- **astro-compress** (v2.2.8) - Minification CSS/HTML/JS en production
- **Partytown** (v2.1.4) - Exécution des scripts analytics en Web Worker

### Outils de Développement

- **pnpm** (8.x+) - Gestionnaire de paquets rapide et efficace
- **TypeScript** (v5.6.3) - Typage statique
- **ESLint** (v8.41.0) - Linter JavaScript/TypeScript
- **Prettier** (v2.8.8) - Formateur de code

## Prérequis

- **Node.js** 18.x (voir `.node-version`)
- **pnpm** 8.x ou supérieur

```bash
# Installer pnpm si nécessaire
npm install -g pnpm

# Utiliser la bonne version de Node (avec nvm)
nvm use
```

## Installation

```bash
# Cloner le repository
git clone [url-du-repo]

# Installer les dépendances
pnpm install
```

## Commandes

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Démarre le serveur de développement avec TinaCMS sur `localhost:3000` |
| `pnpm start` | Démarre le serveur Astro uniquement (sans TinaCMS) |
| `pnpm build` | Build de production (TinaCMS + site statique dans `./dist/`) |
| `pnpm preview` | Prévisualise le build de production localement |
| `pnpm format` | Formate le code avec Prettier |
| `pnpm lint:eslint` | Analyse le code avec ESLint |
| `pnpm subfont` | Optimise les polices (à exécuter après le build) |

## Architecture du Projet

```
baptiste-clisson/
├── .tina/                    # Configuration TinaCMS
│   └── config.ts            # Schéma des collections
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
│   │   └── widgets/         # Sections de page (Header, Footer, Hero)
│   ├── content/             # Contenu Markdown géré par TinaCMS
│   │   ├── accueil_categories/  # Catégories page d'accueil
│   │   ├── realisations/        # Portfolio projets
│   │   └── config.ts            # Configuration collections Astro
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
│   │   └── contact.astro        # Page contact
│   ├── types.ts             # Types TypeScript
│   ├── utils/               # Fonctions utilitaires
│   │   ├── realisations.ts  # Logique portfolio
│   │   └── images.ts        # Traitement images
│   ├── config.mjs           # Configuration du site
│   └── data.js              # Données navigation & footer
├── astro.config.mjs         # Configuration Astro
├── netlify.toml             # Configuration Netlify
├── tailwind.config.cjs      # Configuration Tailwind
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
2. Accéder à `http://localhost:3000/admin`
3. Se connecter (authentification Git)

### Édition de contenu

- **Mode visuel** : Édition directe sur les pages du site
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
- Variables d'environnement : `TINA_CLIENT_ID`, `TINA_TOKEN`, `TINA_BRANCH` (optionnel)

**URL de production** : https://charpenteboisdebout.fr

### Déploiement Manuel

```bash
# Build de production
pnpm build

# Le dossier dist/ contient le site statique prêt à déployer
```

## Performance & SEO

- **Lighthouse Score** : 95+ sur tous les critères
- **Images optimisées** : Compression automatique avec Sharp
- **CSS minimal** : Purge Tailwind en production
- **Lazy loading** : Images et composants chargés à la demande
- **Sitemap** : Généré automatiquement
- **Meta tags** : Open Graph et Twitter Cards
- **Schema.org** : Données structurées pour le SEO

## Développement

### Structure des Composants

- **Widgets** : Grandes sections réutilisables (Hero, Features, CallToAction)
- **Common** : Petits composants partagés (Boutons, Images, MetaTags)
- **Spécifiques** : Composants métier (Realisations, Contact, Reviews)

### Conventions

- **Nommage** : PascalCase pour les composants Astro
- **Styles** : Classes Tailwind en priorité, CSS custom minimal
- **Images** : Toujours optimisées via le composant Image d'Astro
- **Types** : Interfaces TypeScript dans `src/types.ts`

### Ajout d'une Nouvelle Page

1. Créer un fichier `.astro` dans `src/pages/`
2. Utiliser un layout existant (`PageLayout`, `BaseLayout`)
3. Ajouter la route dans `src/data.js` si nécessaire
4. Le routing est automatique basé sur le nom de fichier

## Variables d'Environnement

Aucune variable d'environnement n'est requise pour le développement local.

Pour la production, configurer dans Netlify :
- Authentification TinaCMS (optionnel en production)
- Google Analytics ID (si activé dans `config.mjs`)

## Support & Maintenance

- **Framework** : Basé sur le template AstroWind
- **Auteur original** : onWidget
- **Adaptation** : Personnalisée pour Charpente Bois Debout

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE.md](./LICENSE.md) pour plus de détails.

---

Construit avec passion pour un artisan passionné par le bois et les savoir-faire traditionnels.
