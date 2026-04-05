type LocalImageModules = Record<string, () => Promise<unknown>>;

const load = async function (): Promise<LocalImageModules | undefined> {
  let images: LocalImageModules | undefined = undefined;
  try {
    images = import.meta.glob('/public/images/**');
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
  let path = imagePath;
  if (typeof imagePath !== 'string') {
    return null;
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  if (imagePath.startsWith('/images/')) {
    // add public folder to path
    path = `/public${imagePath}`;
  }

  path = path.replace(/\/{2,}/g, '/');

  const images = await fetchLocalImages();

  return typeof images[path] === 'function' ? (await images[path]())['default'] : null;
};
