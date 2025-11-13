# Plan de Migration Astro 2.5.6 → 5.15

**Date :** 12 novembre 2025
**Projet :** Charpente Bois Debout
**Stratégie :** Migration incrémentale accélérée (2→3→4→5)
**Temps estimé :** 5-8 heures

---

## Table des matières

1. [État actuel du projet](#état-actuel-du-projet)
2. [Résumé des changements critiques](#résumé-des-changements-critiques)
3. [Stratégie de migration](#stratégie-de-migration)
4. [Phase 1 : Migration vers Astro 3.x](#phase-1--migration-vers-astro-3x)
5. [Phase 2 : Migration vers Astro 4.x](#phase-2--migration-vers-astro-4x)
6. [Phase 3 : Migration vers Astro 5.15](#phase-3--migration-vers-astro-515)
7. [Tests à effectuer](#tests-à-effectuer)
8. [Plan de rollback](#plan-de-rollback)
9. [Problèmes potentiels et solutions](#problèmes-potentiels-et-solutions)
10. [Checklist complète](#checklist-complète)

---

## État actuel du projet

### Versions actuelles (package.json)

**Core Astro :**
- `astro`: **2.5.6** → cible : **5.15.x**
- `@astrojs/image`: **0.13.1** → **À SUPPRIMER** (remplacé par `astro:assets`)
- `@astrojs/partytown`: **1.2.3** → cible : **5.x**
- `@astrojs/sitemap`: **1.3.2** → cible : **4.x**
- `@astrojs/tailwind`: **3.1.3** → cible : **6.x**
- `@astrojs/react`: **2.2.1** → cible : **4.x**

**Outils :**
- `sharp`: **0.31.3** → cible : **0.33.x**
- `typescript`: **4.9.5** → cible : **5.x**
- `react`: **18.2.0** (OK)

**TinaCMS :**
- `tinacms`: **1.5.6** (vérifier compatibilité)
- `@tinacms/cli`: **1.5.14** (vérifier compatibilité)

### Fonctionnalités Astro utilisées

#### Images (13 fichiers concernés)
```astro
// Pattern actuel (DEPRECATED)
import { Image, Picture } from '@astrojs/image/components';
import { getImage } from '@astrojs/image';

<Picture
  src={image}
  widths={[800, 1060]}
  aspectRatio={16 / 9}  // ← Attribut supprimé en v3
  width={1060}
/>
```

**Fichiers à modifier :**
1. `src/components/photoswipe/lightbox.astro`
2. `src/components/Logo.astro`
3. `src/components/realisations/SingleRealisation.astro`
4. `src/components/widgets/Steps.astro`
5. `src/components/widgets/Content.astro`
6. `src/components/widgets/Presentation.astro`
7. `src/components/realisations/ListItem.astro`
8. `src/components/common/MetaTags.astro`
9. `src/components/review/Reviews.astro`
10. `src/components/widgets/Category.astro`
11. `src/components/widgets/Gallery.astro`
12. `src/components/widgets/SwiperImages.astro`
13. `src/components/realisations/GridItem.astro`

#### Content Collections
```typescript
// Pattern actuel
import { getCollection } from 'astro:content';
const { Content } = await post.render();  // ← API changée en v5
```

**Fichiers concernés :**
- `src/content/config.ts`
- `src/utils/realisations.ts`

#### Composants React
```astro
<ContactForm client:visible />
<Reviews initialReviews={initialReviews} client:load />
```

---

## Résumé des changements critiques

### 🔴 BREAKING CHANGES (doivent être corrigés)

#### 1. `@astrojs/image` complètement supprimé (v3.0)
- Package retiré de l'écosystème Astro
- Remplacé par `astro:assets` intégré
- Tous les imports doivent changer
- `aspectRatio` n'existe plus
- `Picture` composant supprimé

#### 2. Content Collections API refaçonnée (v5.0)
- `.render()` méthode supprimée des entrées
- Nouvelle fonction `render()` standalone
- Ajout de `loader` property requis

#### 3. Comportement des scripts modifié (v5.0)
- Scripts ne sont plus automatiquement hoistés vers `<head>`
- Scripts conditionnels nécessitent `is:inline`

#### 4. Protection CSRF activée par défaut (v5.0)
- Peut bloquer les formulaires
- Configuration possible si problème

### 🟡 UPDATES REQUISES

- TypeScript 4.9 → 5.x
- Vite 4 → 6 (via Astro 4→5)
- Node.js : vérifier version 18+ recommandée
- Toutes les intégrations `@astrojs/*`

---

## Stratégie de migration

### Approche : 3 phases avec tests à chaque étape

Plutôt qu'une migration directe risquée ou 4 phases longues, nous ferons **3 phases condensées** avec validation complète entre chaque :

```
Phase 1: v2.5.6 → v3.x (2-3h)  [CRITIQUE: Images]
         ↓
      TESTS LOCAUX
         ↓
Phase 2: v3.x → v4.x (1-2h)    [Vite 5, TypeScript 5]
         ↓
      TESTS LOCAUX
         ↓
Phase 3: v4.x → v5.15 (2-3h)   [CRITIQUE: Content Collections, Vite 6]
         ↓
      TESTS EXHAUSTIFS
```

### Commits de sécurité

Créer un commit après chaque phase réussie :
- `git commit -m "feat: migrate to Astro 3.x - images refactored"`
- `git commit -m "feat: migrate to Astro 4.x - vite 5 + ts5"`
- `git commit -m "feat: migrate to Astro 5.15 - complete migration"`

---

## Phase 1 : Migration vers Astro 3.x

**Durée estimée :** 2-3 heures
**Objectif :** Migrer le système d'images de `@astrojs/image` vers `astro:assets`

### Étape 1.1 : Créer une branche

```bash
git checkout -b migration/astro-v5
```

### Étape 1.2 : Mettre à jour package.json

**Versions cibles pour Astro 3.x :**

```json
{
  "dependencies": {
    "astro": "^3.6.5",
    "@astrojs/partytown": "^2.1.2",
    "@astrojs/react": "^3.6.2",
    "@astrojs/sitemap": "^3.1.6",
    "@astrojs/tailwind": "^5.1.1",
    "sharp": "^0.33.5"
  },
  "devDependencies": {
    "typescript": "^5.6.3"
  }
}
```

**IMPORTANT :** Supprimer complètement la ligne `"@astrojs/image": "^0.13.1"`

### Étape 1.3 : Installer les dépendances

```bash
pnpm install
```

Vérifier les warnings de peer dependencies et résoudre si nécessaire.

### Étape 1.4 : Mettre à jour astro.config.mjs

**Avant :**
```javascript
import image from '@astrojs/image';

export default defineConfig({
  integrations: [
    // ...
    image({ serviceEntryPoint: '@astrojs/image/sharp' }),
    // ...
  ]
});
```

**Après :**
```javascript
// Supprimer l'import image
// import image from '@astrojs/image';  ← SUPPRIMER

export default defineConfig({
  integrations: [
    // ...
    // image(...),  ← SUPPRIMER cette ligne
    // ...
  ]
});
```

Astro 3+ utilise Sharp par défaut, pas besoin de configuration.

### Étape 1.5 : Migrer tous les composants images

#### Pattern de migration

**Avant (v2 avec @astrojs/image) :**
```astro
---
import { Image } from '@astrojs/image/components';
import { Picture } from '@astrojs/image/components';
import { getImage } from '@astrojs/image';
---

<Picture
  src={image}
  widths={[400, 800, 1200]}
  sizes="(max-width: 800px) 400px, 1200px"
  aspectRatio={16 / 9}
  width={1200}
  alt="Description"
/>
```

**Après (v3+ avec astro:assets) :**
```astro
---
import { Image } from 'astro:assets';
import { getImage } from 'astro:assets';
// Picture n'existe plus, utiliser Image
---

<Image
  src={image}
  widths={[400, 800, 1200]}
  sizes="(max-width: 800px) 400px, 1200px"
  width={1200}
  height={675}
  alt="Description"
/>
```

#### Calcul de height à partir de aspectRatio

Si `aspectRatio={16/9}` et `width={1200}` :
```javascript
height = width / (16/9) = 1200 / 1.777... = 675
```

Ratios courants :
- `16/9` → height = width × 0.5625
- `4/3` → height = width × 0.75
- `3/2` → height = width × 0.6667
- `1/1` → height = width

#### Fichiers à modifier (dans l'ordre)

**1. src/components/common/MetaTags.astro**
```astro
// Ligne ~4
- import { getImage } from '@astrojs/image';
+ import { getImage } from 'astro:assets';
```

**2. src/components/Logo.astro**
```astro
// Ligne ~2
- import { Image } from '@astrojs/image/components';
+ import { Image } from 'astro:assets';
```

**3. src/components/photoswipe/lightbox.astro**
```astro
// Ligne ~2
- import { Image } from '@astrojs/image/components';
+ import { Image } from 'astro:assets';

// Vérifier tous les usages de <Image> et ajouter height
```

**4. src/components/realisations/GridItem.astro**
```astro
// Ligne ~3
- import { Picture } from '@astrojs/image/components';
+ import { Image } from 'astro:assets';

// Remplacer <Picture> par <Image> et calculer height
```

**5. src/components/realisations/ListItem.astro**
```astro
// Ligne ~3
- import { Picture } from '@astrojs/image/components';
+ import { Image } from 'astro:assets';

// Remplacer <Picture> par <Image>
```

**6. src/components/realisations/SingleRealisation.astro**
```astro
// Ligne ~4
- import { Picture } from '@astrojs/image/components';
+ import { Image } from 'astro:assets';

// Exemple de transformation :
// Avant :
<Picture
  src={post.image}
  widths={[800, 1060]}
  sizes="(max-width: 1060px) 800px, 1060px"
  alt={post.title || post.accroche || ''}
  loading="eager"
  aspectRatio={16 / 9}
  width={1060}
  height={800}
/>

// Après :
<Image
  src={post.image}
  widths={[800, 1060]}
  sizes="(max-width: 1060px) 800px, 1060px"
  alt={post.title || post.accroche || ''}
  loading="eager"
  width={1060}
  height={596}
/>
```

**7-13. Autres fichiers**

Appliquer le même pattern pour :
- `src/components/review/Reviews.astro`
- `src/components/widgets/Category.astro`
- `src/components/widgets/Content.astro`
- `src/components/widgets/Gallery.astro`
- `src/components/widgets/Presentation.astro`
- `src/components/widgets/Steps.astro`
- `src/components/widgets/SwiperImages.astro`

### Étape 1.6 : Mettre à jour src/env.d.ts (si existe)

**Avant :**
```typescript
/// <reference types="@astrojs/image/client" />
```

**Après :**
```typescript
/// <reference types="astro/client" />
```

### Étape 1.7 : Tests Phase 1

```bash
# 1. Vérifier que le dev server démarre
pnpm dev

# Vérifier :
# ✓ Aucune erreur au démarrage
# ✓ TinaCMS se lance correctement
# ✓ Page d'accueil s'affiche
# ✓ Images se chargent
# ✓ Navigation fonctionne

# 2. Tester le build
pnpm build

# Vérifier :
# ✓ Build réussit sans erreur
# ✓ Aucun warning critique
# ✓ Dossier dist/ généré

# 3. Tester le preview
pnpm preview

# Vérifier :
# ✓ Site fonctionne en production
# ✓ Images optimisées présentes
# ✓ Toutes les pages accessibles
```

### Étape 1.8 : Commit Phase 1

```bash
git add .
git commit -m "feat: migrate to Astro 3.x - replace @astrojs/image with astro:assets"
```

**⚠️ NE PAS CONTINUER si les tests échouent. Déboguer avant Phase 2.**

---

## Phase 2 : Migration vers Astro 4.x

**Durée estimée :** 1-2 heures
**Objectif :** Mise à jour vers Vite 5, TypeScript 5+, et intégrations v4

### Étape 2.1 : Mettre à jour package.json

**Versions cibles pour Astro 4.x :**

```json
{
  "dependencies": {
    "astro": "^4.16.18",
    "@astrojs/partytown": "^2.1.2",
    "@astrojs/react": "^3.6.2",
    "@astrojs/sitemap": "^3.2.1",
    "@astrojs/tailwind": "^5.1.2"
  },
  "devDependencies": {
    "typescript": "^5.6.3"
  }
}
```

### Étape 2.2 : Installer les dépendances

```bash
pnpm install
```

### Étape 2.3 : Vérifier les changements Vite 5

Astro 4 utilise Vite 5. Changements potentiels :

- Résolution CSS peut différer
- Certains plugins peuvent nécessiter des mises à jour
- Performance généralement améliorée

**Pas de changement de code requis normalement.**

### Étape 2.4 : Tests Phase 2

```bash
# Dev server
pnpm dev

# Build
pnpm build

# Preview
pnpm preview

# Vérifier :
# ✓ Compilation TypeScript sans erreur
# ✓ Toutes les fonctionnalités marchent
# ✓ Performance stable ou améliorée
```

### Étape 2.5 : Commit Phase 2

```bash
git add .
git commit -m "feat: migrate to Astro 4.x - Vite 5 + TypeScript 5"
```

**⚠️ NE PAS CONTINUER si les tests échouent.**

---

## Phase 3 : Migration vers Astro 5.15

**Durée estimée :** 2-3 heures
**Objectif :** Migration finale avec Content Collections API v5, Vite 6, protections CSRF

### Étape 3.1 : Mettre à jour package.json

**Versions cibles pour Astro 5.15 :**

```json
{
  "dependencies": {
    "astro": "^5.15.0",
    "@astrojs/partytown": "^5.0.1",
    "@astrojs/react": "^4.0.1",
    "@astrojs/sitemap": "^4.0.1",
    "@astrojs/tailwind": "^6.1.0"
  }
}
```

**Vérifier aussi la compatibilité de :**
- `astro-compress`
- `astro-icon`
- `@astrolib/analytics`
- `@astrolib/seo`

### Étape 3.2 : Installer les dépendances

```bash
pnpm install
```

### Étape 3.3 : Migrer Content Collections

#### Fichier : src/content/config.ts

**Avant (v4) :**
```typescript
import { defineCollection, z } from 'astro:content';

const post = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    tags: z.array(z.string()).optional(),
    publishDate: z.date().or(z.string()).optional(),
  }),
});

export const collections = { post };
```

**Après (v5) :**
```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const post = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/realisations' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    tags: z.array(z.string()).optional(),
    publishDate: z.date().or(z.string()).optional(),
  }),
});

export const collections = { post };
```

#### Fichier : src/utils/realisations.ts

**Avant (v4) :**
```typescript
import type { CollectionEntry } from 'astro:content';

const getNormalizedRealisation = async (post: CollectionEntry<'realisations'>): Promise<Realisation> => {
  const { id, slug, body, data } = post;
  const { Content } = await post.render();

  // ...
  return {
    id,
    slug,
    Content,
    // ...
  };
};
```

**Après (v5) :**
```typescript
import type { CollectionEntry } from 'astro:content';
import { render } from 'astro:content';

const getNormalizedRealisation = async (post: CollectionEntry<'realisations'>): Promise<Realisation> => {
  const { id, slug, body, data } = post;
  const { Content } = await render(post);

  // ...
  return {
    id,
    slug,
    Content,
    // ...
  };
};
```

**Changement clé :**
- Importer `render` depuis `astro:content`
- Utiliser `await render(post)` au lieu de `await post.render()`

### Étape 3.4 : Mettre à jour tsconfig.json

**Ajouter :**
```json
{
  "extends": "astro/tsconfigs/base",
  "include": [".astro/types.d.ts"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "allowJs": true,
    "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"]
    }
  }
}
```

### Étape 3.5 : Gérer la protection CSRF (si nécessaire)

Si le formulaire de contact échoue avec des erreurs d'origine, ajouter dans `astro.config.mjs` :

```javascript
export default defineConfig({
  // ... autres configs
  security: {
    checkOrigin: false  // Uniquement si problème en dev
  }
});
```

**Note :** En production, laisser activé pour la sécurité.

### Étape 3.6 : Vérifier les balises <script>

Astro 5 ne hoist plus automatiquement les scripts vers `<head>`.

**Chercher les scripts conditionnels :**
```bash
grep -r "script" src/components --include="*.astro"
```

Si des scripts dépendent d'un ordre spécifique, ajouter `is:inline` ou réorganiser.

### Étape 3.7 : Tests Phase 3 (Exhaustifs)

```bash
# 1. Dev server avec TinaCMS
pnpm dev
```

**Vérifications complètes :**

**Homepage :**
- [ ] Images de catégories s'affichent
- [ ] Carrousel Swiper fonctionne
- [ ] Liens de navigation marchent
- [ ] Hero section s'affiche correctement

**Portfolio (/realisations) :**
- [ ] Liste des réalisations s'affiche
- [ ] Images optimisées chargent
- [ ] Pagination fonctionne
- [ ] Filtrage par tag marche

**Page réalisation individuelle :**
- [ ] Image principale s'affiche
- [ ] Galerie PhotoSwipe fonctionne
- [ ] Contenu markdown rendu
- [ ] Métadonnées correctes

**Composants React :**
- [ ] Formulaire de contact (client:visible) fonctionne
- [ ] Component Reviews (client:load) s'affiche
- [ ] Interactivité fonctionne

**TinaCMS :**
- [ ] Admin panel accessible (/admin)
- [ ] Édition de contenu fonctionne
- [ ] Sauvegarde marche

**Build & Preview :**
```bash
pnpm build
pnpm preview
```

- [ ] Build réussit sans erreur
- [ ] Aucun warning critique
- [ ] Preview fonctionne
- [ ] Toutes les routes accessibles
- [ ] Images optimisées présentes
- [ ] SEO meta tags présents (view source)

### Étape 3.8 : Tests de performance (optionnel mais recommandé)

```bash
# Lighthouse en local
npx lighthouse http://localhost:4321 --view
```

**Vérifier :**
- Performance >= 90
- Accessibility >= 90
- Best Practices >= 90
- SEO >= 90

### Étape 3.9 : Commit Phase 3

```bash
git add .
git commit -m "feat: migrate to Astro 5.15 - complete migration with Content Layer API"
```

---

## Tests à effectuer

### Tests fonctionnels

| Feature | Test | Status |
|---------|------|--------|
| **Homepage** | Affichage catégories | ☐ |
| | Carrousel fonctionne | ☐ |
| | Navigation header/footer | ☐ |
| **Réalisations** | Liste complète s'affiche | ☐ |
| | Images optimisées | ☐ |
| | Pagination | ☐ |
| | Filtres par tags | ☐ |
| **Galerie** | PhotoSwipe lightbox | ☐ |
| | Swipe entre images | ☐ |
| **Formulaire** | Contact form submit | ☐ |
| | Validation marche | ☐ |
| **Reviews** | Composant s'affiche | ☐ |
| | Interactivité | ☐ |
| **TinaCMS** | Admin accessible | ☐ |
| | Édition contenu | ☐ |
| | Sauvegarde | ☐ |
| **SEO** | Meta tags présents | ☐ |
| | Sitemap généré | ☐ |
| | Robots.txt | ☐ |
| **Build** | Build sans erreur | ☐ |
| | Preview fonctionne | ☐ |
| | Taille bundle raisonnable | ☐ |

### Tests de régression

Vérifier que ces fonctionnalités n'ont **pas** été cassées :

- [ ] Thème clair/sombre toggle
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Animations AOS (scroll animations)
- [ ] Google Analytics (Partytown)
- [ ] Polices optimisées
- [ ] Compression CSS/JS/HTML
- [ ] Structure des URLs (permalinks)
- [ ] Trailing slashes configuration

---

## Plan de rollback

### Si problème en Phase 1 (Astro 3.x)

```bash
# Retour au commit précédent
git reset --hard HEAD~1

# Ou retour au point avant migration
git checkout main

# Réinstaller dépendances
pnpm install
```

### Si problème en Phase 2 (Astro 4.x)

```bash
# Retour à Phase 1 (Astro 3.x)
git reset --hard HEAD~1
pnpm install

# Ou continuer avec Astro 3.x (stable et moderne)
```

### Si problème en Phase 3 (Astro 5.15)

```bash
# Retour à Phase 2 (Astro 4.x)
git reset --hard HEAD~1
pnpm install

# Astro 4.x reste une version LTS excellente
```

### Backup complet avant migration

```bash
# Créer un tag pour sauvegarder l'état actuel
git tag pre-migration-astro-v2.5.6
git push origin pre-migration-astro-v2.5.6

# En cas de catastrophe :
git checkout pre-migration-astro-v2.5.6
pnpm install
```

---

## Problèmes potentiels et solutions

### Problème 1 : Images ne s'affichent pas après migration

**Symptômes :**
- Images cassées (404)
- Erreurs de compilation liées aux images
- Images non optimisées

**Solutions :**

1. **Vérifier les imports :**
```astro
// Correct
import { Image } from 'astro:assets';

// Incorrect
import { Image } from '@astrojs/image/components';
```

2. **Vérifier width/height :**
```astro
// Toutes les images doivent avoir width ET height
<Image src={...} width={1200} height={675} alt="..." />
```

3. **Chemins relatifs vs absolus :**
```astro
// Depuis public/ (pas d'optimisation)
<Image src="/images/photo.jpg" width={800} height={600} />

// Import (avec optimisation)
import photo from '~/assets/images/photo.jpg';
<Image src={photo} alt="..." />
```

### Problème 2 : Build échoue avec erreur TypeScript

**Symptômes :**
- `error TS2307: Cannot find module 'astro:content'`
- Erreurs de types manquants

**Solutions :**

1. **Mettre à jour tsconfig.json :**
```json
{
  "extends": "astro/tsconfigs/base",
  "include": [".astro/types.d.ts"]
}
```

2. **Supprimer cache :**
```bash
rm -rf node_modules/.astro
rm -rf .astro
pnpm build
```

3. **Vérifier version TypeScript :**
```bash
pnpm list typescript
# Doit être >= 5.0
```

### Problème 3 : Content Collections ne fonctionnent plus (v5)

**Symptômes :**
- `post.render is not a function`
- Erreur lors du fetch des collections

**Solutions :**

1. **Utiliser render() standalone :**
```typescript
// Incorrect (v4)
const { Content } = await post.render();

// Correct (v5)
import { render } from 'astro:content';
const { Content } = await render(post);
```

2. **Ajouter loader dans config.ts :**
```typescript
const post = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/realisations' }),
  schema: z.object({...})
});
```

### Problème 4 : Formulaire de contact bloqué (CSRF)

**Symptômes :**
- Formulaire ne se soumet pas
- Erreur CORS ou Origin
- Message "Cross-origin request blocked"

**Solutions :**

1. **Désactiver en dev (astro.config.mjs) :**
```javascript
export default defineConfig({
  security: {
    checkOrigin: false  // DEV UNIQUEMENT
  }
});
```

2. **En production, configurer correctement :**
```javascript
export default defineConfig({
  site: 'https://charpenteboisdebout.fr',
  // checkOrigin sera automatiquement OK
});
```

### Problème 5 : TinaCMS ne démarre plus

**Symptômes :**
- `/admin` retourne 404
- Erreurs au build TinaCMS
- Admin UI ne se charge pas

**Solutions :**

1. **Vérifier la compatibilité TinaCMS :**
```bash
pnpm update tinacms @tinacms/cli
```

2. **Rebuilder TinaCMS :**
```bash
pnpm tinacms build
```

3. **Vérifier config TinaCMS (`.tina/config.ts`) :**
- Pas de changement normalement requis
- Mais vérifier imports si erreurs

### Problème 6 : Scripts JavaScript ne se chargent plus (v5)

**Symptômes :**
- Scripts inline ne s'exécutent pas
- Erreurs JavaScript dans console
- Comportements interactifs cassés

**Solutions :**

1. **Ajouter is:inline si nécessaire :**
```astro
<script is:inline>
  // Code qui doit s'exécuter immédiatement
</script>
```

2. **Utiliser client directives pour React :**
```astro
<Component client:load />   // Charge immédiatement
<Component client:visible /> // Charge quand visible
<Component client:idle />    // Charge quand browser idle
```

### Problème 7 : Performance dégradée après migration

**Symptômes :**
- Build plus lent
- Pages plus lentes à charger
- Bundle size augmenté

**Solutions :**

1. **Vérifier Sharp configuration :**
```bash
pnpm list sharp
# Doit être >= 0.33.x
```

2. **Optimiser images :**
```astro
<Image
  src={...}
  widths={[400, 800, 1200]}  // Tailles adaptées
  loading="lazy"              // Lazy load par défaut
/>
```

3. **Analyser le bundle :**
```bash
pnpm build
# Vérifier taille dans dist/
```

### Problème 8 : Intégrations tierces incompatibles

**Packages potentiellement problématiques :**
- `astro-compress`
- `astro-icon`
- `astro-google-fonts-optimizer`
- `@astrolib/analytics`
- `@astrolib/seo`

**Solutions :**

1. **Vérifier compatibilité :**
```bash
pnpm outdated
```

2. **Mettre à jour :**
```bash
pnpm update astro-compress astro-icon
```

3. **Si toujours incompatible, trouver alternatives ou retirer temporairement**

---

## Checklist complète

### Pré-migration

- [ ] Créer branche `migration/astro-v5`
- [ ] Créer tag `pre-migration-astro-v2.5.6`
- [ ] Sauvegarder base de données TinaCMS (si externe)
- [ ] Prendre screenshots des pages principales
- [ ] Documenter build actuel (`pnpm build` fonctionne)

### Phase 1 : Astro 3.x

- [ ] Mettre à jour `package.json` vers Astro 3.x
- [ ] Supprimer `@astrojs/image`
- [ ] Installer dépendances (`pnpm install`)
- [ ] Supprimer import `image` dans `astro.config.mjs`
- [ ] Migrer 13 fichiers composants images :
  - [ ] `src/components/photoswipe/lightbox.astro`
  - [ ] `src/components/Logo.astro`
  - [ ] `src/components/realisations/SingleRealisation.astro`
  - [ ] `src/components/widgets/Steps.astro`
  - [ ] `src/components/widgets/Content.astro`
  - [ ] `src/components/widgets/Presentation.astro`
  - [ ] `src/components/realisations/ListItem.astro`
  - [ ] `src/components/common/MetaTags.astro`
  - [ ] `src/components/review/Reviews.astro`
  - [ ] `src/components/widgets/Category.astro`
  - [ ] `src/components/widgets/Gallery.astro`
  - [ ] `src/components/widgets/SwiperImages.astro`
  - [ ] `src/components/realisations/GridItem.astro`
- [ ] Mettre à jour `src/env.d.ts` (si existe)
- [ ] Test : `pnpm dev` démarre
- [ ] Test : `pnpm build` réussit
- [ ] Test : `pnpm preview` fonctionne
- [ ] Test : Toutes les images s'affichent
- [ ] Test : TinaCMS fonctionne
- [ ] Commit : "feat: migrate to Astro 3.x"

### Phase 2 : Astro 4.x

- [ ] Mettre à jour `package.json` vers Astro 4.x
- [ ] Installer dépendances (`pnpm install`)
- [ ] Test : `pnpm dev` démarre
- [ ] Test : `pnpm build` réussit
- [ ] Test : TypeScript compile sans erreur
- [ ] Test : Toutes fonctionnalités marchent
- [ ] Commit : "feat: migrate to Astro 4.x"

### Phase 3 : Astro 5.15

- [ ] Mettre à jour `package.json` vers Astro 5.15
- [ ] Installer dépendances (`pnpm install`)
- [ ] Mettre à jour `src/content/config.ts` (ajouter loader)
- [ ] Mettre à jour `src/utils/realisations.ts` (render standalone)
- [ ] Mettre à jour `tsconfig.json` (include .astro/types.d.ts)
- [ ] Gérer CSRF si nécessaire
- [ ] Vérifier scripts (hoisting)
- [ ] Test complet :
  - [ ] Homepage
  - [ ] Portfolio listing
  - [ ] Pages individuelles
  - [ ] Galeries PhotoSwipe
  - [ ] Formulaire contact
  - [ ] Reviews component
  - [ ] TinaCMS admin
  - [ ] Build & preview
  - [ ] SEO meta tags
- [ ] Commit : "feat: migrate to Astro 5.15"

### Post-migration

- [ ] Test complet sur Netlify preview
- [ ] Vérifier console errors
- [ ] Vérifier analytics (Google Analytics)
- [ ] Vérifier sitemap.xml
- [ ] Test Lighthouse (performance)
- [ ] Merge vers main
- [ ] Déployer en production
- [ ] Vérifier production fonctionne
- [ ] Mettre à jour ce fichier avec notes/problèmes rencontrés

---

## Ressources utiles

### Documentation officielle Astro

- **Migration vers v3 :** https://docs.astro.build/en/guides/upgrade-to/v3/
- **Migration vers v4 :** https://docs.astro.build/en/guides/upgrade-to/v4/
- **Migration vers v5 :** https://docs.astro.build/en/guides/upgrade-to/v5/
- **Images (astro:assets) :** https://docs.astro.build/en/guides/images/
- **Content Collections v5 :** https://docs.astro.build/en/guides/content-collections/

### Guides spécifiques

- **Migrer de @astrojs/image :** https://docs.astro.build/en/guides/images/#migrate-from-v2
- **Content Layer API :** https://astro.build/blog/astro-5/
- **Vite 6 changelog :** https://vite.dev/guide/migration

### Support

- **Discord Astro :** https://astro.build/chat
- **GitHub Issues :** https://github.com/withastro/astro/issues
- **Stack Overflow :** Tag `astro`

---

## Notes de migration

_Utiliser cette section pour documenter les problèmes rencontrés et solutions appliquées pendant la migration._

### [DATE] - Phase X

**Problème :**

**Solution :**

**Impact :**

---

**FIN DU PLAN DE MIGRATION**

Dernière mise à jour : 12 novembre 2025
