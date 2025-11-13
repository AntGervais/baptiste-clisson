# Visual Editing avec TinaCMS

Ce document explique l'implémentation du visual editing TinaCMS dans ce projet Astro 5.

## Ce qui a été mis en place

### 1. Directive client:tina personnalisée
Un nouveau dossier `astro-tina-directive/` contient les fichiers nécessaires pour créer une directive Astro personnalisée `client:tina`. Cette directive permet de charger les composants React uniquement lorsque la page est affichée dans un iframe (contexte d'édition TinaCMS).

**Fichiers créés :**
- `astro-tina-directive/index.d.ts` - Types TypeScript
- `astro-tina-directive/register.js` - Enregistrement de la directive
- `astro-tina-directive/tina.js` - Logique de la directive

### 2. Configuration Astro mise à jour
Le fichier `astro.config.mjs` a été modifié pour inclure la nouvelle directive :
```javascript
import tinaDirective from './astro-tina-directive/register.js';

export default defineConfig({
  // ...
  integrations: [
    // ... autres intégrations
    tinaDirective()
  ]
});
```

### 3. Structure TinaCMS réorganisée
TinaCMS v2.9.3 utilise le dossier `tina/` au lieu de `.tina/`. La configuration a été copiée :
- Configuration : `tina/config.ts`
- Fichiers générés : `tina/__generated__/`
- Composants React : `tina/pages/`

**Note :** L'ancien dossier `.tina/` existe toujours mais n'est plus utilisé par TinaCMS.

### 4. Composants React pour le visual editing
Deux composants React ont été créés dans `tina/pages/` :

#### AccueilCategoryPage.tsx
Permet d'éditer visuellement les catégories de la page d'accueil (charpente, escalier, restauration).

Utilise :
- `useTina()` pour connecter le composant à l'API TinaCMS
- `tinaField()` pour marquer les champs éditables

#### RealisationPage.tsx
Template pour éditer visuellement les réalisations (non encore intégré aux pages existantes).

### 5. Page de démonstration
Une page de test a été créée : `src/pages/demo/charpente.astro`

Cette page montre comment :
1. Charger les données depuis TinaCMS avec `client.queries.accueil_categories()`
2. Passer les données au composant React
3. Utiliser la directive `client:tina` pour activer le visual editing

## Comment utiliser le visual editing

### Démarrer le serveur
```bash
pnpm dev
```

Cela démarre :
- Le serveur TinaCMS sur http://localhost:4001
- Le serveur Astro sur http://localhost:4322 (ou 4321)

### Accéder à l'interface d'édition

1. **Interface admin classique :**
   - URL : http://localhost:4322/admin/index.html
   - Vous pouvez éditer le contenu via l'interface traditionnelle

2. **Visual editing (page de démo) :**
   - URL page : http://localhost:4322/demo/charpente
   - URL admin : http://localhost:4322/admin/index.html#/collections/accueil_categories/charpente.md
   - Dans l'admin, cliquez sur l'icône "Visual Editor" pour voir la page en iframe avec édition en direct

### Comment ça fonctionne

Lorsque vous éditez via le visual editor :

1. TinaCMS charge la page dans un iframe
2. La directive `client:tina` détecte qu'on est dans un iframe
3. Le composant React se charge et utilise `useTina()` pour se connecter à l'API
4. Les champs marqués avec `tinaField()` deviennent éditables en direct
5. Les changements sont visibles en temps réel

## ✅ Visual Editing activé sur toutes les Réalisations

Le visual editing a été intégré dans **toutes les pages de réalisations**. Chaque page charge automatiquement les données depuis TinaCMS et affiche le composant React avec les champs éditables.

**Pages concernées :** Toutes les URLs de type `/nom-de-realisation` (ex: `/abris_animaux`, `/escalier-colimaon-sur-base-hexagonale`, etc.)

## Intégrer le visual editing dans d'autres pages

Pour ajouter le visual editing à une nouvelle page :

### Étape 1 : Créer un composant React
Créez un fichier dans `tina/pages/` qui utilise `useTina` :

```tsx
import { useTina, tinaField } from 'tinacms/dist/react';
import type { RealisationsQuery } from '../__generated__/types';

export default function MyPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const content = data.realisations;

  return (
    <div>
      <h1 data-tina-field={tinaField(content, 'title')}>
        {content.title}
      </h1>
      {/* ... autres champs ... */}
    </div>
  );
}
```

### Étape 2 : Modifier la page Astro
Dans votre fichier `.astro` :

```astro
---
import client from '../../tina/__generated__/client';
import MyPage from '../../tina/pages/MyPage';

const result = await client.queries.realisations({
  relativePath: 'ma-realisation.md',
});
---

<Layout>
  <MyPage
    data={result.data}
    query={result.query}
    variables={{ relativePath: 'ma-realisation.md' }}
    client:tina
  />
</Layout>
```

## Limitations actuelles

### Rendu du contenu rich-text
Les composants React actuels n'affichent pas encore correctement le contenu rich-text (champ `description`). Pour l'améliorer, il faudrait :

1. Installer `@tinacms/mdx` :
   ```bash
   pnpm add @tinacms/mdx
   ```

2. Utiliser `TinaMarkdown` dans les composants :
   ```tsx
   import { TinaMarkdown } from 'tinacms/dist/rich-text';

   <TinaMarkdown content={content.description} />
   ```

### Incompatibilité avec le design existant
Les composants React créés pour le visual editing ne répliquent pas (encore) le design existant de vos composants Astro. Deux options :

1. **Option simple** : Utiliser le visual editing uniquement pour les pages de démo/test
2. **Option complète** : Convertir progressivement vos composants Astro clés en React pour bénéficier pleinement du visual editing

### Statut expérimental
Le visual editing avec Astro est marqué comme **expérimental** par TinaCMS. Des bugs peuvent survenir.

## Recommandations

Pour un site vitrine comme celui-ci :

### Mode actuel (recommandé pour l'instant)
- Édition via `/admin` (interface traditionnelle)
- Stable et éprouvé
- Parfaitement fonctionnel avec Astro 5

### Visual editing (pour plus tard)
- Utile si plusieurs éditeurs non-techniques contribuent régulièrement
- Nécessite de convertir plus de composants en React
- Meilleur pour du contenu très riche et varié

## Prochaines étapes possibles

Si vous voulez aller plus loin avec le visual editing :

1. **Améliorer le rendu rich-text** avec TinaMarkdown
2. **Convertir les composants clés** (SingleRealisation, etc.) en React
3. **Intégrer dans les pages de réalisations** existantes
4. **Tester en production** avec l'hébergement Netlify

## Ressources

- [Documentation TinaCMS - Visual Editing](https://tina.io/docs/contextual-editing/overview/)
- [TinaCMS + Astro Starter](https://github.com/tinacms/tina-astro-starter)
- [Discussion GitHub - Astro with Contextual Editing](https://github.com/tinacms/tinacms/discussions/3399)
