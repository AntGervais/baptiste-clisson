# Migration vers Visual Editing TinaCMS

Date : 13 Novembre 2025

## Résumé

Le visual editing TinaCMS a été implémenté avec succès sur le site Charpente Bois Debout, permettant l'édition en temps réel de toutes les pages de réalisations.

## Ce qui a été fait

### 1. Migration TinaCMS vers la nouvelle structure

**Avant :** Configuration dans `.tina/`
**Après :** Configuration dans `tina/` (nouvelle convention TinaCMS 2.9.3)

- Fichiers générés automatiquement dans `tina/__generated__/`
- Configuration copiée dans `tina/config.ts`
- Client GraphQL accessible via `tina/__generated__/client.ts`

### 2. Directive Astro personnalisée `client:tina`

Création d'une directive custom pour activer les composants React uniquement en mode édition :

```
astro-tina-directive/
├── index.d.ts       # Types TypeScript
├── register.js      # Enregistrement dans Astro
└── tina.js         # Logique de détection iframe
```

**Fonctionnement :**
- Détecte si la page est dans un iframe (contexte TinaCMS)
- Charge le composant React uniquement si nécessaire
- Évite le chargement inutile en production

### 3. Composants React pour Visual Editing

**RealisationPage.tsx** (`tina/pages/`)
- Composant principal pour l'édition des réalisations
- Utilise `useTina()` pour la connexion temps réel avec TinaCMS
- Tous les champs marqués avec `tinaField()` sont éditables
- Design reproduisant fidèlement les composants Astro existants
- Support de TinaMarkdown pour le rich text

**AccueilCategoryPage.tsx** (`tina/pages/`)
- Composant pour les catégories de la homepage
- Page de démo disponible : `/demo/charpente`

### 4. Intégration dans les pages existantes

**Fichier modifié :** `src/pages/[...realisations]/index.astro`

```astro
// Charge les données depuis TinaCMS
const relativePath = post.id.endsWith('.md') ? post.id : `${post.id}.md`;
const tinaData = await client.queries.realisations({ relativePath });

// Affiche le composant React avec visual editing
<RealisationPage
  data={tinaData.data}
  query={tinaData.query}
  variables={{ relativePath }}
  url={String(url)}
  client:tina
/>
```

**Fallback automatique :** Si TinaCMS ne charge pas, le composant Astro original s'affiche.

### 5. Configuration Netlify mise à jour

**Changements dans `netlify.toml` :**
- Command build : `npm run build` → `pnpm build`
- Node version : 20 → 18 (LTS pour compatibilité plugin Lighthouse)

**Changements dans `.nvmrc` :**
- Version : 20 → 18

### 6. Corrections techniques

**ESLint :**
- Support des fichiers `.tsx` ajouté
- Fichiers générés TinaCMS exclus via `.eslintignore`

**TypeScript :**
- Import `type` pour `Realisation` (respect de `verbatimModuleSyntax`)
- Composant `tsconfig.json` dans `tina/` pour les paths

**Dependencies :**
- Lockfile pnpm régénéré pour compatibilité
- Peer dependencies warnings (normaux avec Astro 5)

## Pages avec Visual Editing

✅ **Toutes les réalisations** (routes dynamiques)
- `/abris_animaux`
- `/escalier-colimaon-sur-base-hexagonale`
- `/rehabilitation-montreal`
- ... et toutes les autres réalisations

✅ **Page de démo**
- `/demo/charpente` (catégorie d'accueil)

## Utilisation

### En développement

```bash
# Démarrer le serveur
pnpm dev

# TinaCMS démarre automatiquement sur http://localhost:4001
# Astro sur http://localhost:4322
```

### Éditer du contenu

1. Ouvrir http://localhost:4322/admin/index.html
2. Naviguer vers "Realisations" ou "Catégories Accueil"
3. Sélectionner un contenu à éditer
4. Cliquer sur l'icône "Visual Editor" pour le mode édition en direct
5. Éditer avec preview en temps réel !

### En production

Le visual editing fonctionne automatiquement :
- Les composants React se chargent uniquement en mode édition
- Les utilisateurs normaux voient la version statique optimisée
- Pas d'impact sur les performances

## Champs éditables

### Réalisations
- ✏️ Titre
- ✏️ Accroche (description courte)
- ✏️ Image principale
- ✏️ Description (rich text avec TinaMarkdown)
- ✏️ Tags
- ✏️ Folder (dossier d'images)
- ✏️ Date de publication

### Catégories Accueil
- ✏️ Titre
- ✏️ Image de couverture
- ✏️ Description (rich text)
- ✏️ Tag (charpente/escalier/restauration)

## Limitations actuelles

### Gallery PhotoSwipe
La galerie d'images (PhotoSwipe) n'est pas disponible en mode visual editing car elle utilise des composants Astro spécifiques. Un placeholder s'affiche à la place.

**Solution de contournement :**
- Le champ `folder` est éditable
- Les images de la galerie se voient en mode preview (hors visual editing)

### Composants Astro non convertis
Certains composants restent en Astro :
- `Tags.astro`
- `SocialShare.astro`
- `Gallery.astro`

Le visual editing se concentre sur le contenu textuel et les métadonnées.

## Fichiers importants

### Configuration
- `tina/config.ts` - Configuration TinaCMS
- `astro.config.mjs` - Intégration directive custom
- `netlify.toml` - Config déploiement

### Composants React
- `tina/pages/RealisationPage.tsx`
- `tina/pages/AccueilCategoryPage.tsx`

### Directive custom
- `astro-tina-directive/index.d.ts`
- `astro-tina-directive/register.js`
- `astro-tina-directive/tina.js`

### Documentation
- `VISUAL_EDITING.md` - Guide complet d'utilisation
- `MIGRATION_VISUAL_EDITING.md` - Ce fichier

## Compatibilité

- ✅ Astro 5.15.5
- ✅ TinaCMS 2.9.3
- ✅ Node 18 LTS
- ✅ React 18
- ✅ TypeScript 5.9
- ✅ pnpm 10.x

## Prochaines étapes possibles

Si vous voulez aller plus loin :

1. **Améliorer le rendu rich-text**
   - Personnaliser les composants TinaMarkdown
   - Ajouter des composants custom dans le rich-text

2. **Convertir plus de pages**
   - Homepage complète
   - Pages statiques (contact, à propos)

3. **Intégrer la galerie**
   - Créer un composant React pour PhotoSwipe
   - Permettre l'édition des images de galerie

4. **Optimisations**
   - Code splitting des composants React
   - Lazy loading du client TinaCMS

## Résultat

✨ **Visual editing 100% fonctionnel !**

Le site conserve toutes ses fonctionnalités existantes tout en offrant une expérience d'édition moderne et intuitive via TinaCMS.
