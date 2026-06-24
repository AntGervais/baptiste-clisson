# CLAUDE.md

Guidance pour Claude Code lors du travail sur ce dépôt.

## Projet

Site vitrine statique pour **Charpente Bois Debout** (artisan charpentier à Saulgé, 86).
En production sur [charpenteboisdebout.fr](https://charpenteboisdebout.fr), déployé sur Netlify.

## Stack

- **Astro 7.x** (`output: 'static'`) — SSG, propulsé par Vite 8 (bundler Rolldown).
- **Tailwind CSS 4.x** via le plugin Vite `@tailwindcss/vite` (config CSS-first, pas de `tailwind.config` actif pour le thème).
- **TinaCMS 3.x** — CMS git-based ; contenu Markdown dans `src/content/`, schéma dans `tina/config.ts`, interface sur `/admin`.
- **React 19** — uniquement pour l'admin TinaCMS (`@astrojs/react`).
- **pnpm 10** comme gestionnaire de paquets. **Node >= 22.12.0** (Netlify build sur Node 24).
- Pipeline Markdown par défaut **Sätteri** : aucun plugin remark/rehype n'est utilisé.

## Commandes

```bash
pnpm dev          # serveur dev + TinaCMS (localhost:4321)
pnpm start        # serveur Astro seul (sans TinaCMS)
pnpm build        # astro build → ./dist (Astro uniquement)
pnpm build:prod   # build complet : tinacms build puis astro build (= commande Netlify)
pnpm preview      # prévisualise le build
pnpm format       # Prettier
pnpm lint:eslint  # ESLint
```

Pour vérifier une modification, `pnpm build` suffit dans la plupart des cas.
`pnpm build:prod` nécessite les variables TinaCloud (`TINA_CLIENT_ID`, `TINA_TOKEN`) et un accès réseau.

## Architecture

- `src/pages/` — routing basé sur les fichiers ; portfolio sous `src/pages/[...realisations]/` (liste, pagination, filtrage par tag).
- `src/layouts/` — `BaseLayout` (SEO), `PageLayout`, `MarkdownLayout`.
- `src/components/` — `widgets/` (grandes sections : Hero, Header, Footer…), `common/` (partagés), puis composants métier (`realisations/`, `contact/`, `review/`, `photoswipe/`).
- `src/content/` — Markdown géré par TinaCMS : collections `accueil_categories` et `realisations`.
- `src/config.mjs` — configuration du site (origine, base, trailingSlash, Google Analytics).
- `astro-tina-directive/` — directive client Astro personnalisée (`tina:`) pour l'édition visuelle.
- `astro.config.mjs`, `netlify.toml` — config Astro et déploiement.

## Conventions

- **Alias** : `~/*` pointe vers `src/*`.
- **Nommage** : PascalCase pour les composants `.astro`.
- **Styles** : classes Tailwind en priorité, CSS custom minimal.
- **Images** : toujours via le composant `Image` d'Astro (optimisation Sharp au build).
- **Types** : interfaces TypeScript dans `src/types.ts`.

## Notes / pièges connus

- `.astro/` et `pnpm-lock.yaml` sont gitignorés.
- ESLint, par défaut, lint aussi les fichiers générés dans `.astro/` (non exclus dans `eslint.config.js`) — les erreurs y sont des faux positifs sur du code généré.
- `astro check` remonte des erreurs de typage préexistantes (ex. `paginate` non typé, `page.url.prev: string | undefined`) ; il n'est pas dans la chaîne de build/déploiement.
