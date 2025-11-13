declare module '@astrolib/seo' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const AstroSeo: AstroComponentFactory;
  export { AstroSeo };
  export default AstroSeo;
}

declare global {
  export type Review = {
    author_name: string;
    author_url: string;
    profile_photo_url: string;
    rating: number;
    relative_time_description: string;
    text: string;
  };

  export type Contact = Record<'name' | 'email' | 'phone' | 'message', string>;
}

export {};
