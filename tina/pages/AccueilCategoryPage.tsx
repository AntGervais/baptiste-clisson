import { useTina, tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import type { Accueil_CategoriesQuery } from '../__generated__/types';

export interface AccueilCategoryPageProps {
  data: Accueil_CategoriesQuery;
  query: string;
  variables: {
    relativePath: string;
  };
}

export default function AccueilCategoryPage(props: AccueilCategoryPageProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const category = data.accueil_categories;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <article className="grid gap-8 lg:grid-cols-2 lg:items-center">
        {category.image && (
          <figure
            className="overflow-hidden rounded-lg shadow-lg"
            data-tina-field={tinaField(category, 'image')}
          >
            <img
              src={category.image}
              alt={category.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </figure>
        )}

        <div>
          <div className="mb-4 flex flex-wrap gap-3">
            <span
              className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-accent"
              data-tina-field={tinaField(category, 'tag')}
            >
              {category.tag}
            </span>
          </div>

          <h1
            className="font-heading text-4xl font-bold text-primary sm:text-5xl"
            data-tina-field={tinaField(category, 'title')}
          >
            {category.title}
          </h1>

          {category.description && (
            <div
              className="prose prose-lg mt-6 max-w-none text-gray-700 prose-headings:font-heading prose-headings:text-primary"
              data-tina-field={tinaField(category, 'description')}
            >
              <TinaMarkdown content={category.description} />
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
