type LocalImageModule = { default: string };
type LocalImageModules = Record<string, () => Promise<LocalImageModule>>;

const load = async function (): Promise<LocalImageModules | undefined> {
  let images: LocalImageModules | undefined = undefined;
  try {
    images = import.meta.glob<LocalImageModule>('/public/images/**');
  } catch {
    // continue regardless of error
  }
  return images;
};

let _images: Promise<LocalImageModules | undefined> | undefined;

/** */
export const fetchLocalImages = async () => {
  _images = _images || load();
  return await _images;
};

/** */
export const findImage = async (imagePath?: string) => {
  if (typeof imagePath !== 'string') {
    return null;
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // add public folder to path for local images
  let path = imagePath.startsWith('/images/') ? `/public${imagePath}` : imagePath;

  path = path.replace(/\/{2,}/g, '/');

  const images = await fetchLocalImages();
  if (!images) return null;

  const loader = images[path];
  return typeof loader === 'function' ? (await loader())['default'] : null;
};
