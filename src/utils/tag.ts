import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { AccueilCategories, TinaSystemInfo } from '~/types';
import { resolveContentRelativePath } from './content-paths';
import { normalizeTag } from './permalinks';

const getNormalizedAccueilCategories = async (
  categorie: CollectionEntry<'accueil_categories'>
): Promise<AccueilCategories> => {
  const { id, data } = categorie;
  const slug = id;
  const relativePath = await resolveContentRelativePath('src/content/accueil_categories', id);
  const tinaInfo: TinaSystemInfo = {
    filename: relativePath.split('/').pop() ?? relativePath,
    basename: relativePath.replace(/\.mdx?$/, ''),
    path: `src/content/accueil_categories/${relativePath}`,
    relativePath,
  };
  const { title, description, image, tag } = data;
  const { Content } = await render(categorie);

  return {
    id: id,
    slug: slug,
    title,
    description,
    image,
    tag,
    Content: Content,
    tinaInfo,
  };
};

const loadAccueilCategories = async function (): Promise<Array<AccueilCategories>> {
  const categories = await getCollection('accueil_categories');
  return Promise.all(categories.map((categorie) => getNormalizedAccueilCategories(categorie)));
};

let _accueilCategories: Array<AccueilCategories>;

/** */
export const fetchAccueilCategories = async (): Promise<Array<AccueilCategories>> => {
  if (!_accueilCategories) {
    _accueilCategories = await loadAccueilCategories();
  }

  return _accueilCategories;
};

/** */
export const findCategoryByTag = async (tag: string): Promise<AccueilCategories | undefined> => {
  const categories = await fetchAccueilCategories();

  // on cherche la première categorie qui a le tag
  const categorie = categories.find((categorie) => normalizeTag(categorie.tag) === normalizeTag(tag));
  return categorie;
};
