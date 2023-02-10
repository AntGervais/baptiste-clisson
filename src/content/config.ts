import { z, defineCollection } from 'astro:content';

const post = defineCollection({
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    publishDate: z.date().or(z.string()).optional(),
  }),
});

export const collections = {
  post: post,
};
