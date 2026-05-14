import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Realisation, TinaSystemInfo } from '~/types';
import { resolveContentRelativePath } from './content-paths';
import { normalizeTag } from './permalinks';

const getNormalizedRealisation = async (post: CollectionEntry<'realisations'>): Promise<Realisation> => {
  const { id, data } = post;
  const [{ Content }, relativePath] = await Promise.all([
    render(post),
    resolveContentRelativePath('src/content/realisations', id),
  ]);
  const tinaInfo: TinaSystemInfo = {
    filename: relativePath.split('/').pop() ?? relativePath,
    basename: relativePath.replace(/\.mdx?$/, ''),
    path: `src/content/realisations/${relativePath}`,
    relativePath,
  };

  const {
    tags: rawTags = [],
    publishDate: rawPublishDate = new Date(),
    title,
    accroche,
    gallery,
    description,
    image,
    location,
  } = data;

  const slug = id;
  const publishDate = new Date(rawPublishDate);
  const tags = rawTags.map((tag: string) => normalizeTag(tag));

  return {
    id: id,
    slug: slug,
    publishDate: publishDate,
    tags: tags,
    title,
    accroche,
    gallery,
    description,
    image,
    location,
    Content: Content,
    permalink: slug,
    tinaInfo,
  };
};

const loadRealisations = async function (): Promise<Array<Realisation>> {
  const realisations = await getCollection('realisations');
  const results = (await Promise.all(realisations.map((realisation) => getNormalizedRealisation(realisation)))).sort(
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
