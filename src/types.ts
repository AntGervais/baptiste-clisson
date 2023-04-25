export interface Realisation {
  id: string;
  slug: string;
  publishDate: Date;
  title: string;
  accroche: string;
  description: string;
  image: string;
  permalink?: string;
  tags?: Array<string>;
  Content: unknown;
  content?: string;
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
