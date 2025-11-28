import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_IMAGES = path.join(__dirname, '../public/images');
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;
const WEBP_QUALITY = 85;

async function* walkFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      yield* walkFiles(fullPath);
    } else {
      yield fullPath;
    }
  }
}

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return null;
  }

  try {
    const stats = await fs.stat(filePath);
    const originalSize = stats.size;

    const image = sharp(filePath);
    const metadata = await image.metadata();

    const outputPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    if (await fs.access(outputPath).then(() => true).catch(() => false)) {
      console.log(`⏭️  Skipping ${path.basename(filePath)} (WebP already exists)`);
      return null;
    }

    let pipeline = sharp(filePath);

    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      pipeline = pipeline.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    await pipeline
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    const newStats = await fs.stat(outputPath);
    const newSize = newStats.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    console.log(`✅ ${path.basename(filePath)} → ${path.basename(outputPath)}`);
    console.log(`   ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${savings}% saved)`);

    return {
      original: filePath,
      optimized: outputPath,
      originalSize,
      newSize,
      savings: parseFloat(savings)
    };
  } catch (error) {
    console.error(`❌ Error optimizing ${filePath}:`, error.message);
    return null;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');

  const results = [];

  for await (const file of walkFiles(PUBLIC_IMAGES)) {
    const result = await optimizeImage(file);
    if (result) {
      results.push(result);
    }
  }

  if (results.length === 0) {
    console.log('\n✨ No images to optimize!');
    return;
  }

  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalNew = results.reduce((sum, r) => sum + r.newSize, 0);
  const totalSavings = ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1);

  console.log('\n📊 Summary:');
  console.log(`   Images optimized: ${results.length}`);
  console.log(`   Total size before: ${formatBytes(totalOriginal)}`);
  console.log(`   Total size after: ${formatBytes(totalNew)}`);
  console.log(`   Total savings: ${totalSavings}%`);
}

main().catch(console.error);
