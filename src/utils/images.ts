const load = async function () {
  let images: Record<string, () => Promise<unknown>> | undefined = undefined;
  try {
    images = import.meta.glob('/public/images/**');
  } catch (e) {
    // continue regardless of error
  }
  return images;
};

let _images;

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

  const images = await fetchLocalImages();

  return typeof images[path] === 'function' ? (await images[path]())['default'] : null;
};
