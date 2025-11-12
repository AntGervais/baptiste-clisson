import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const realisations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/realisations' }),
  schema: z.object({
    title: z.string(),
    accroche: z.string().optional(),
    folder: z.string(),
    description: z.string().optional(),
    image: z.string(),
    tags: z.array(z.string()).optional(),
    publishDate: z.date().or(z.string()).optional(),
  }),
});

const accueil_categories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/accueil_categories' }),
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  realisations,
  accueil_categories,
  post: realisations, // Alias for backwards compatibility
};
