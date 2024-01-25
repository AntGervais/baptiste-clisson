/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/image/client" />

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
