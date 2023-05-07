import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { AccueilCategories } from '~/types';
import { cleanSlug } from './permalinks';

const getNormalizedAccueilCategories = async (
  categorie: CollectionEntry<'accueil_categories'>
): Promise<AccueilCategories> => {
  const { id, slug: rawSlug = '', data } = categorie;
  const slug = cleanSlug(rawSlug.split('/').pop());
  const { ...rest } = data;
  const { Content } = await categorie.render();

  return {
    id: id,
    slug: slug,
    ...rest,
    Content: Content,
  };
};

const loadAccueilCategories = async function (): Promise<Array<AccueilCategories>> {
  const categories = await getCollection('accueil_categories');
  const normalizedAccueilCategories = categories.map(
    async (categorie) => await getNormalizedAccueilCategories(categorie)
  );

  const results = await Promise.all(normalizedAccueilCategories);
  return results;
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
export const findCategoryByTag = async (tag: string): Promise<AccueilCategories> => {
  const categories = await fetchAccueilCategories();

  // on cherche la première categorie qui a le tag
  const categorie = categories.find((categorie) => categorie.tag === tag);
  return categorie;
};
