import { useTina, tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import type { RealisationsQuery } from '../__generated__/types';

export interface RealisationPageProps {
  data: RealisationsQuery;
  query: string;
  variables: {
    relativePath: string;
  };
  url?: string;
}

export default function RealisationPage(props: RealisationPageProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const post = data.realisations;

  return (
    <section className="mx-auto py-8 sm:py-16 lg:py-20">
      <article>
        <header>
          <div className="mx-auto mb-2 mt-0 flex max-w-4xl flex-col justify-between px-4 sm:flex-row sm:items-center sm:px-6">
            {/* Publish date commented out as in original */}
          </div>

          {/* Title */}
          <h1
            className="leading-tighter mx-auto max-w-4xl px-4 font-heading text-4xl text-accent sm:px-6 md:text-5xl"
            data-tina-field={tinaField(post, 'title')}
          >
            {post.title}
          </h1>

          {/* Accroche */}
          <p
            className="text-muted mx-auto mb-8 mt-4 max-w-4xl px-4 text-justify text-xl sm:px-6 md:text-2xl"
            data-tina-field={tinaField(post, 'accroche')}
          >
            {post.accroche}
          </p>

          {/* Main Image */}
          {post.image && (
            <img
              src={post.image}
              alt={post.title || post.accroche || ''}
              className="mx-auto mb-6 max-w-full bg-gray-400 sm:rounded-sm lg:max-w-6xl"
              loading="eager"
              data-tina-field={tinaField(post, 'image')}
            />
          )}
        </header>

        {/* Description - Rich text content */}
        <div className="prose-md prose-headings:leading-tighter prose prose-lg mx-auto mt-8 max-w-4xl px-6 lg:prose-xl prose-headings:font-heading prose-headings:font-bold prose-a:text-primary prose-img:rounded-sm prose-img:shadow-lg sm:px-6">
          {post.description && (
            <div data-tina-field={tinaField(post, 'description')}>
              <TinaMarkdown content={post.description} />
            </div>
          )}

          {/* Gallery placeholder - folder info available but Gallery component is Astro-specific */}
          {post.folder && (
            <div className="mt-8 text-sm text-gray-500">
              📁 Galerie d'images : {post.folder}
              <br />
              <em>
                (La galerie complète est visible en mode aperçu, l'édition
                visuelle se concentre sur le contenu textuel)
              </em>
            </div>
          )}
        </div>
      </article>

      {/* Tags and Social Share */}
      <div className="mx-auto mt-8 flex max-w-4xl flex-col justify-between px-6 sm:flex-row sm:px-6">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mr-5 flex flex-wrap gap-2" data-tina-field={tinaField(post, 'tags')}>
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block rounded-full bg-accent px-3 py-1 text-sm text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Social Share placeholder */}
        {props.url && (
          <div className="mt-5 align-middle text-gray-500 sm:mt-1">
            <span className="text-sm">Partager : {post.title}</span>
          </div>
        )}
      </div>
    </section>
  );
}
