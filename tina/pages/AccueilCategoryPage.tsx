import { useTina, tinaField } from 'tinacms/dist/react';
import type { Accueil_CategoriesQuery } from '../__generated__/types';

export interface AccueilCategoryPageProps {
  data: Accueil_CategoriesQuery;
  query: string;
  variables: {
    relativePath: string;
  };
}

export default function AccueilCategoryPage(props: AccueilCategoryPageProps) {
  // Use the useTina hook to enable visual editing
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const category = data.accueil_categories;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Image */}
      {category.image && (
        <div className="mb-6" data-tina-field={tinaField(category, 'image')}>
          <img
            src={category.image}
            alt={category.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Title */}
      <h1
        className="text-4xl font-bold text-primary mb-4"
        data-tina-field={tinaField(category, 'title')}
      >
        {category.title}
      </h1>

      {/* Tag */}
      <div className="mb-4" data-tina-field={tinaField(category, 'tag')}>
        <span className="inline-block bg-accent text-white px-3 py-1 rounded">
          {category.tag}
        </span>
      </div>

      {/* Description - Rich text */}
      <div
        className="prose prose-lg max-w-none"
        data-tina-field={tinaField(category, 'description')}
      >
        {/* Note: For proper rich text rendering, you would use TinaMarkdown here */}
        {/* For now, this is a placeholder that shows the editing capability */}
        <p>Description content (editable via TinaCMS)</p>
      </div>
    </div>
  );
}
