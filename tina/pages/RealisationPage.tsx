import { useTina, tinaField } from 'tinacms/dist/react';
import type { RealisationsQuery } from '../__generated__/types';

export interface RealisationPageProps {
  data: RealisationsQuery;
  query: string;
  variables: {
    relativePath: string;
  };
}

export default function RealisationPage(props: RealisationPageProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const realisation = data.realisations;

  return (
    <div data-tina-enabled>
      {/* Title */}
      <h1 data-tina-field={tinaField(realisation, 'title')}>
        {realisation.title}
      </h1>

      {/* Image */}
      {realisation.image && (
        <img
          src={realisation.image}
          alt={realisation.title}
          data-tina-field={tinaField(realisation, 'image')}
        />
      )}

      {/* Accroche */}
      {realisation.accroche && (
        <p data-tina-field={tinaField(realisation, 'accroche')}>
          {realisation.accroche}
        </p>
      )}

      {/* Tags */}
      {realisation.tags && realisation.tags.length > 0 && (
        <div data-tina-field={tinaField(realisation, 'tags')}>
          {realisation.tags.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>
      )}

      {/* Publish Date */}
      {realisation.publishDate && (
        <time data-tina-field={tinaField(realisation, 'publishDate')}>
          {new Date(realisation.publishDate).toLocaleDateString('fr-FR')}
        </time>
      )}

      {/* Description - Rich text content */}
      {realisation.description && (
        <div data-tina-field={tinaField(realisation, 'description')}>
          {/* The description is stored as JSON/rich-text, we'll render it as-is for now */}
          {/* You can integrate TinaMarkdown here if needed */}
        </div>
      )}
    </div>
  );
}
