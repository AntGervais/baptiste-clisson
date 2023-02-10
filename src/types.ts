export interface Post {
  id: string;
  slug: string;

  publishDate: Date;
  title: string;
  description: string;

  image: string;

  permalink?: string;

  draft?: boolean;

  excerpt?: string;
  tags?: Array<string>;
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
