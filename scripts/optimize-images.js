import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const IMAGES_DIR = join(PUBLIC_DIR, 'images');

// Configuration
const QUALITY = {
  webp: 75,  // Reduced for better compression
  jpeg: 82,
  png: 85,
};

// Maximum width for images (maintain aspect ratio)
const MAX_WIDTH = 2400;
const MAX_HEIGHT = 2400;

async function getAllImageFiles(dir, fileList = []) {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      await getAllImageFiles(filePath, fileList);
    } else {
      const ext = extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  }

  return fileList;
}

async function optimizeImage(imagePath) {
  const ext = extname(imagePath).toLowerCase();
  const name = basename(imagePath, ext);
  const dir = dirname(imagePath);

  try {
    let image = sharp(imagePath);
    const metadata = await image.metadata();
    const originalSizeMB = (metadata.size / 1024 / 1024);

    console.log(`Processing: ${imagePath}`);
    console.log(`  Original: ${metadata.width}x${metadata.height}, ${originalSizeMB.toFixed(2)} MB`);

    // Resize if image is too large
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      image = image.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      });
      console.log(`  Resizing to max ${MAX_WIDTH}x${MAX_HEIGHT}`);
    }

    // Convert to WebP
    const webpPath = join(dir, `${name}.webp`);
    await image
      .webp({ quality: QUALITY.webp, effort: 6 })
      .toFile(webpPath);

    const webpStat = await stat(webpPath);
    const webpSizeMB = (webpStat.size / 1024 / 1024);
    const reduction = ((originalSizeMB - webpSizeMB) / originalSizeMB * 100);

    console.log(`  WebP created: ${webpSizeMB.toFixed(2)} MB (${reduction > 0 ? '-' : '+'}${Math.abs(reduction).toFixed(1)}%)`);

    return true;
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('Starting image optimization...\n');

  const imageFiles = await getAllImageFiles(IMAGES_DIR);
  console.log(`Found ${imageFiles.length} images to process\n`);

  let processed = 0;
  let failed = 0;

  for (const imagePath of imageFiles) {
    const success = await optimizeImage(imagePath);
    if (success) {
      processed++;
    } else {
      failed++;
    }
    console.log('');
  }

  console.log('='.repeat(50));
  console.log(`Optimization complete!`);
  console.log(`Processed: ${processed}`);
  console.log(`Failed: ${failed}`);
  console.log('='.repeat(50));
  console.log('\nNext steps:');
  console.log('1. Review the generated .webp files');
  console.log('2. Update your Gallery component to use WebP images');
  console.log('3. Consider removing the large original files');
}

main().catch(console.error);
