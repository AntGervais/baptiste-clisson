# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a website for "Charpente Bois Debout," a carpentry business run by Baptiste Clisson in Saulgé, France. The site showcases the craftsman's work in traditional timber framing, wood structures, custom stairs, and restoration of old buildings. Built with Astro 5.x + Tailwind CSS 3.x, based on the AstroWind template.

**Website**: https://charpenteboisdebout.fr

## Build & Development Commands

All commands use **pnpm** (not npm/yarn despite what the README says):

```bash
# Development with TinaCMS
pnpm dev              # Starts TinaCMS + Astro dev server at localhost:3000

# Development (Astro only)
pnpm start            # Starts local dev server without TinaCMS

# Build
pnpm build            # Builds TinaCMS admin + Astro production site to ./dist/

# Other
pnpm preview          # Preview production build locally
pnpm format           # Format code with Prettier
pnpm lint:eslint      # Run ESLint
pnpm subfont          # Optimize fonts (run after build)
```

**Note**: Node.js 18.x required (see `.nvmrc` for exact version), pnpm 8.x or higher

## Technology Stack

### Core Dependencies (from package.json)
- **Astro**: 5.15.0 (static site generator)
- **TinaCMS**: 2.9.3 (headless CMS)
- **Tailwind CSS**: 3.3.2 (utility-first CSS framework)
- **TypeScript**: 5.6.3
- **React**: 18.2.0 (for TinaCMS admin interface)

### Key Libraries
- **PhotoSwipe**: 5.3.7 (image gallery/lightbox)
- **Swiper**: 9.3.2 (carousels)
- **Sharp**: 0.33.5 (image optimization)
- **AOS**: 2.3.4 (scroll animations)

## Architecture

### Content Management System

This site uses **TinaCMS** for content editing:
- TinaCMS config: `.tina/config.ts`
- Admin interface: `/admin/index.html` (built to `public/admin/`)
- Content is stored as Markdown files in `src/content/`

Two main content collections defined in `.tina/config.ts`:
1. **accueil_categories** - Homepage categories for different services (charpente/restauration/escalier)
2. **realisations** - Portfolio projects with images, descriptions, tags, and publish dates

### Content Collections

Astro content collections are defined in `src/content/config.ts`:
- `post` collection (but content uses "realisations" directory)
- Schema validation with Zod

Content structure:
```
src/content/
├── accueil_categories/  # Homepage service categories
│   ├── charpente.md
│   ├── restauration.md
│   └── escalier.md
└── realisations/        # Portfolio projects
    ├── rehabilitation_montreal.md
    ├── abris_animaux.md
    └── ...
```

### Site Configuration

- **Main config**: `src/config.mjs` - Contains site metadata, permalinks, language (French), and realisations blog configuration
- **TinaCMS config**: `.tina/config.ts` - Content schema and media settings
- **Navigation**: `src/data.js` - Header links and footer data

### Key Architectural Patterns

**Realisations (Portfolio) System**:
- Content: Markdown files in `src/content/realisations/`
- Utils: `src/utils/realisations.ts` - Fetches and normalizes portfolio entries
- Types: `src/types.ts` - TypeScript interfaces for `Realisation` and `AccueilCategories`
- Pages: Dynamic routes in `src/pages/[...realisations]/`
  - `index.astro` - Main portfolio listing
  - `[...page].astro` - Paginated portfolio
  - `[tag]/[...page].astro` - Tag-filtered portfolio pages

**Component Organization**:
```
src/components/
├── common/          # Shared components (MetaTags, ToggleTheme, etc.)
├── contact/         # Contact form
├── photoswipe/      # Image gallery/lightbox (PhotoSwipe integration)
├── realisations/    # Portfolio-specific components
├── review/          # Customer reviews
└── widgets/         # Larger page sections (Header, Footer, Hero, etc.)
```

**Layouts**:
- `BaseLayout.astro` - Main site layout with SEO
- `MarkdownLayout.astro` - For markdown content
- `PageLayout.astro` - Standard page wrapper

### Image Handling

- TinaCMS media root: `public/images/`
- Realisation images organized in folders: `public/images/realisations/{folder-name}/`
- Uses `@astrojs/image` with Sharp for optimization
- PhotoSwipe library for gallery/lightbox functionality
- Image utilities in `src/utils/images.ts`

### Styling

- Tailwind CSS with custom config: `tailwind.config.cjs`
- Base styles: `src/assets/styles/base.css`
- Typography plugin enabled
- Custom styles component: `src/components/CustomStyles.astro`

### Special Features

**Swiper Integration**: Multiple carousel components for image galleries and category browsing
- `SwiperCategories.astro` - Homepage category carousel
- `SwiperImages.astro` - Image galleries
- `SwiperRealisations.astro` - Portfolio carousel

**Reviews System**: Customer testimonials stored in `src/initialReviews.ts`

**AOS (Animate On Scroll)**: Used for scroll animations throughout the site

### Build Output

- Static site generated to `dist/`
- TinaCMS admin panel built to `public/admin/`
- Uses `astro-compress` for minification (CSS/HTML/JS, but NOT images/SVG)
- Partytown integration for Google Analytics (if enabled)

### Package Manager Note

Despite the README showing `npm` commands, this project uses **pnpm** (see `package.json` scripts and `.npmrc`). Always use `pnpm` commands.

### Deployment

**Active Deployment**: Netlify
- Netlify project: https://app.netlify.com/projects/charpenteboisdebout/overview
- Production URL: https://charpenteboisdebout.fr
- Config: `netlify.toml`

Also configured for Vercel (see `vercel.json`) but not currently used.
