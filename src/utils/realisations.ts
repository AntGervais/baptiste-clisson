import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Realisation } from '~/types';
import { cleanSlug, trimSlash, POST_PERMALINK_PATTERN } from './permalinks';

const generatePermalink = async ({ id, slug, publishDate }) => {
  const year = String(publishDate.getFullYear()).padStart(4, '0');
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishDate.getDate()).padStart(2, '0');
  const hour = String(publishDate.getHours()).padStart(2, '0');
  const minute = String(publishDate.getMinutes()).padStart(2, '0');
  const second = String(publishDate.getSeconds()).padStart(2, '0');

  const permalink = POST_PERMALINK_PATTERN.replace('%slug%', slug)
    .replace('%id%', id)
    .replace('%year%', year)
    .replace('%month%', month)
    .replace('%day%', day)
    .replace('%hour%', hour)
    .replace('%minute%', minute)
    .replace('%second%', second);

  return permalink
    .split('/')
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
};

const getNormalizedRealisation = async (post: CollectionEntry<'realisations'>): Promise<Realisation> => {
  const { id, slug: rawSlug = '', data } = post;
  const { Content } = await post.render();

  const { tags: rawTags = [], publishDate: rawPublishDate = new Date(), ...rest } = data;

  const slug = cleanSlug(rawSlug.split('/').pop());
  const publishDate = new Date(rawPublishDate);
  const tags = rawTags.map((tag: string) => cleanSlug(tag));

  return {
    id: id,
    slug: slug,
    publishDate: publishDate,
    tags: tags,
    ...rest,

    Content: Content,
    // // or 'body' in case you consume from API

    permalink: await generatePermalink({ id, slug, publishDate }),
  };
};

const loadRealisations = async function (): Promise<Array<Realisation>> {
  const realisations = await getCollection('realisations');
  const normalizedRealisations = realisations.map(async (realisation) => await getNormalizedRealisation(realisation));

  const results = (await Promise.all(normalizedRealisations)).sort(
    (a, b) => b.publishDate.valueOf() - a.publishDate.valueOf()
  );
  // .filter((post) => !post.draft)
  return results;
};

let _posts: Array<Realisation>;

/** */
export const fetchRealisations = async (): Promise<Array<Realisation>> => {
  if (!_posts) {
    _posts = await loadRealisations();
  }

  return _posts;
};

/** */
export const findRealisationsBySlugs = async (slugs: Array<string>): Promise<Array<Realisation>> => {
  if (!Array.isArray(slugs)) return [];

  const posts = await fetchRealisations();

  return slugs.reduce(function (r: Array<Realisation>, slug: string) {
    posts.some(function (post: Realisation) {
      return slug === post.slug && r.push(post);
    });
    return r;
  }, []);
};

/** */
export const findRealisationsByIds = async (ids: Array<string>): Promise<Array<Realisation>> => {
  if (!Array.isArray(ids)) return [];

  const posts = await fetchRealisations();

  return ids.reduce(function (r: Array<Realisation>, id: string) {
    posts.some(function (post: Realisation) {
      return id === post.id && r.push(post);
    });
    return r;
  }, []);
};

/** */
export const findLatestRealisations = async ({ count }: { count?: number }): Promise<Array<Realisation>> => {
  const _count = count || 4;
  const posts = await fetchRealisations();

  return posts ? posts.slice(0, _count) : [];
};
