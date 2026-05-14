import { SITE, REALISATIONS } from '~/config.mjs';
import { trim } from '~/utils/utils';

export const trimSlash = (s: string) => trim(trim(s, '/'));
const createPath = (...params: string[]) => {
  const paths = params.reduce<string[]>((acc, el) => {
    const t = trimSlash(el);
    if (t) acc.push(t);
    return acc;
  }, []).join('/');
  return '/' + paths + (SITE.trailingSlash && paths ? '/' : '');
};

const BASE_PATHNAME = trimSlash(SITE.basePathname);

const splitPathAndSuffix = (value = '') => {
  const match = value.match(/([?#].*)$/);
  return {
    pathname: match ? value.slice(0, -match[1].length) : value,
    suffix: match?.[1] ?? '',
  };
};

export const normalizeTag = (value = '') => trimSlash(value).toLowerCase();

export const REALISATIONS_BASE = trimSlash(REALISATIONS?.list?.pathname || 'realisations');
export const TAG_BASE = trimSlash(REALISATIONS?.tag?.pathname || 'tag');

/** */
export const getCanonical = (path = ''): string | URL => new URL(path, SITE.origin);

/** */
export const getPermalink = (slug = '', type = 'page'): string => {
  const { pathname, suffix } = splitPathAndSuffix(slug);
  let permalinkPath: string;

  switch (type) {
    case 'tag':
      permalinkPath = createPath(BASE_PATHNAME, TAG_BASE, normalizeTag(pathname));
      break;

    case 'realisations':
      permalinkPath = createPath(BASE_PATHNAME, pathname);
      break;

    case 'page':
    default:
      permalinkPath = createPath(BASE_PATHNAME, pathname);
      break;
  }

  return `${permalinkPath}${suffix}`;
};

/** */
export const getHomePermalink = (): string => getPermalink('/');

/** */
export const getRealisationsPermalink = (): string => getPermalink(REALISATIONS_BASE);

/** */
export const getAsset = (path: string): string =>
  createPath(BASE_PATHNAME, path);
