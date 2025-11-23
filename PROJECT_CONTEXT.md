# Project Context: Baptiste Clisson - Charpente Bois Debout

## 1. Project Overview
**Website**: [charpenteboisdebout.fr](https://charpenteboisdebout.fr)
**Business**: Artisan Charpentier (Baptiste Clisson) in Saulgé, France.
**Focus**: Traditional timber framing (Charpente), Restoration (Restauration), Custom Stairs (Escalier).
**Aesthetic**: Natural, artisanal, professional. Dark greens, beige, serif fonts.

## 2. Technology Stack
- **Core Framework**: [Astro 5.x](https://astro.build)
- **Content Management**: [TinaCMS](https://tina.io) (Headless, Git-based)
- **Styling**: [Tailwind CSS 3.x](https://tailwindcss.com)
- **Language**: TypeScript / JavaScript
- **Package Manager**: **pnpm** (Strictly enforced)
- **Deployment**: Netlify

## 3. Development Commands
All commands must be run with `pnpm`.

| Command | Description |
|---------|-------------|
| `pnpm dev` | **Primary Dev Command**. Starts TinaCMS + Astro (localhost:3000). Use this for content & code changes. |
| `pnpm start` | Starts Astro dev server ONLY (no CMS). Faster if just editing code/styles. |
| `pnpm build` | Production build (Astro + Tina). Output to `dist/`. |
| `pnpm preview` | Preview the production build locally. |
| `pnpm format` | Format code with Prettier. |

## 4. Architecture & File Structure

### Key Directories
- **`src/content/`**: The source of truth for content (Markdown).
  - `realisations/`: Portfolio projects (individual `.md` files).
  - `accueil_categories/`: Homepage service categories.
- **`src/components/`**: Astro components.
  - `widgets/`: Major page sections (Header, Hero, Footer, Content).
  - `realisations/`: Components specific to the portfolio section.
  - `CustomStyles.astro`: Global CSS variables and font definitions.
- **`tina/`**: TinaCMS configuration.
  - `config.ts`: Defines the content schema (collections, fields).
- **`public/`**: Static assets.
  - `images/`: All site images.
  - `fonts/`: Local font files (Buenard, Satisfy).

### Data Flow
1.  **Content**: Editors use the TinaCMS admin panel (`/admin`).
2.  **Storage**: Changes are saved as Markdown files in `src/content/`.
3.  **Build**: Astro reads these files (via Content Collections) to generate static HTML.

## 5. Design System
Defined in `tailwind.config.cjs` and `src/components/CustomStyles.astro`.

### Colors
| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| **Primary** | `--aw-color-primary` | `#135a4c` | Dark Green (Brand color) |
| **Secondary** | `--aw-color-secondary` | `#606c38` | Olive Green |
| **Accent** | `--aw-color-accent` | `#bc6c25` | Orange/Brown (Highlights) |
| **Beige** | `--aw-color-beige` | `#f4f7f0` | Light Background |
| **Text** | `--aw-color-text-page` | `#0d4037` | Very Dark Green |

### Typography
- **Sans-serif**: `Buenard` (Body text)
- **Serif**: `Satisfy` (Headings, decorative)

## 6. Common Tasks & Workflows

### Adding a New Realisation (Portfolio Item)
1.  **Images**: Create a folder in `public/images/realisations/{project_slug}` and add images.
2.  **Content**:
    -   **Option A (CMS)**: Run `pnpm dev`, go to `http://localhost:3000/admin`, and create a new "Realisation".
    -   **Option B (Manual)**: Create a `.md` file in `src/content/realisations/`.
        -   Required Frontmatter: `title`, `image` (cover), `tags` (charpente/restauration/escalier), `publishDate`.
        -   Optional: `folder` (matches image folder name), `accroche`, `description`.

### Modifying Styles
-   **Global**: Edit `src/components/CustomStyles.astro` for variables or `@font-face`.
-   **Component**: Use Tailwind utility classes directly in the component (e.g., `class="text-primary hover:text-accent"`).

### Troubleshooting
-   **Images not loading**: Check `public/images` path. Ensure `folder` field in frontmatter matches directory name in `public/images/realisations/`.
-   **TinaCMS issues**: Ensure `pnpm dev` is running, not just `pnpm start`. Check `tina/config.ts` for schema errors.
