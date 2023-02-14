/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/image/client" />

declare global {
  export type Contact = Record<'firstName' | 'lastName' | 'email' | 'phone' | 'message', string>;
}

export {};
