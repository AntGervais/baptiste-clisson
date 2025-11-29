export interface TinaSystemInfo {
  filename: string;
  basename: string;
  path: string;
  relativePath: string;
}

export interface AccueilCategories {
  id: string;
  slug: string;
  image?: string;
  title: string;
  description?: string;
  tag: string;
  Content: unknown;
  tinaInfo?: TinaSystemInfo;
}

export interface Realisation {
  id: string;
  slug: string;
  publishDate: Date;
  title: string;
  accroche?: string;
  location?: string;
  folder?: string; // Deprecated: use gallery instead
  gallery?: string[]; // New: list of image paths
  description?: string;
  image: string;
  permalink?: string;
  tags?: Array<string>;
  Content: unknown;
  content?: string;
  tinaInfo?: TinaSystemInfo;
}

export interface ImagePath {
  src: string;
  alt: string;
}

export interface MetaSEO {
  title?: string;
  description?: string;
  image?: string;

  canonical?: string | URL;
  noindex?: boolean;
  nofollow?: boolean;

  ogTitle?: string;
  ogType?: string;
}
