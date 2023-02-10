import { z, defineCollection } from 'astro:content';

const post = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    accueil: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    publishDate: z.date().or(z.string()).optional(),
  }),
});

export const collections = {
  post: post,
};
