import { readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const CONTENT_EXTENSIONS = new Set(['.md', '.mdx']);
const relativePathCache = new Map<string, Promise<Map<string, string>>>();

const normalizeSegment = (segment: string) =>
  segment
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const walkContentFiles = async (rootDir: string, currentDir = rootDir): Promise<string[]> => {
  const entries = await readdir(currentDir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(currentDir, entry.name);
      if (entry.isDirectory()) return walkContentFiles(rootDir, fullPath);
      if (!CONTENT_EXTENSIONS.has(extname(entry.name))) return [];
      return [relative(rootDir, fullPath)];
    })
  );

  return files.flat().sort();
};

export const relativePathToSlug = (relativePath: string) =>
  relativePath
    .replace(/\.(md|mdx)$/, '')
    .split('/')
    .map((segment) => normalizeSegment(segment))
    .filter(Boolean)
    .join('/');

const loadRelativePathMap = (contentDir: string) => {
  const cachedMap = relativePathCache.get(contentDir);
  if (cachedMap) return cachedMap;

  const pathMapPromise = walkContentFiles(contentDir).then((files) => {
    const pathMap = new Map<string, string>();
    for (const file of files) {
      pathMap.set(relativePathToSlug(file), file);
    }
    return pathMap;
  });

  relativePathCache.set(contentDir, pathMapPromise);
  return pathMapPromise;
};

export const resolveContentRelativePath = async (contentDir: string, slug: string) => {
  const pathMap = await loadRelativePathMap(contentDir);
  return pathMap.get(slug) ?? `${slug}.md`;
};
