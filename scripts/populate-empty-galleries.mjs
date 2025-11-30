#!/usr/bin/env node

/**
 * Script pour peupler les galeries vides en se basant sur le nom du dossier
 * extrait de l'image principale
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const REALISATIONS_DIR = join(projectRoot, 'src/content/realisations');
const IMAGES_DIR = join(projectRoot, 'public/images/realisations');

/**
 * Parse le frontmatter YAML d'un fichier markdown
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const frontmatter = match[1];
  const body = match[2];

  return { frontmatter, body };
}

/**
 * Parse simple YAML
 */
function parseYaml(yamlString) {
  const lines = yamlString.split('\n');
  const result = {};
  let currentKey = null;
  let currentArray = null;

  for (const line of lines) {
    if (!line.trim()) continue;

    const arrayMatch = line.match(/^\s*-\s+(.+)$/);
    if (arrayMatch && currentArray) {
      currentArray.push(arrayMatch[1].replace(/^['"]|['"]$/g, ''));
      continue;
    }

    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      currentKey = key;

      if (!value || value === '[]') {
        result[key] = [];
        currentArray = result[key];
      } else if (value.startsWith('[')) {
        try {
          result[key] = JSON.parse(value.replace(/'/g, '"'));
        } catch {
          result[key] = value;
        }
        currentArray = null;
      } else {
        result[key] = value.replace(/^['"]|['"]$/g, '');
        currentArray = null;
      }
    }
  }

  return result;
}

/**
 * Convertit un objet en YAML
 */
function toYaml(obj) {
  let yaml = '';

  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        yaml += `${key}:\n`;
      } else {
        yaml += `${key}:\n`;
        for (const item of value) {
          yaml += `  - ${item}\n`;
        }
      }
    } else {
      const needsQuotes = typeof value === 'string' && (value.includes(':') || value.includes('#'));
      yaml += `${key}: ${needsQuotes ? `'${value}'` : value}\n`;
    }
  }

  return yaml.trim();
}

/**
 * Liste toutes les images d'un dossier
 */
async function listImagesInFolder(folderName) {
  const folderPath = join(IMAGES_DIR, folderName);

  try {
    const files = await readdir(folderPath);
    const imageFiles = files.filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f));

    const baseNames = new Map();

    for (const file of imageFiles) {
      const baseName = file.substring(0, file.lastIndexOf('.'));
      const ext = file.substring(file.lastIndexOf('.')).toLowerCase();

      if (!baseNames.has(baseName)) {
        baseNames.set(baseName, []);
      }
      baseNames.get(baseName).push({ file, ext, priority: ext === '.webp' ? 1 : 0 });
    }

    const finalImages = [];

    for (const [baseName, versions] of baseNames.entries()) {
      versions.sort((a, b) => b.priority - a.priority);
      finalImages.push(versions[0].file);
    }

    finalImages.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

    return finalImages.map(f => `/images/realisations/${folderName}/${f}`);
  } catch (error) {
    console.warn(`  ⚠️  Impossible de lire le dossier ${folderName}`);
    return [];
  }
}

/**
 * Peuple la galerie d'un fichier si elle est vide
 */
async function populateGalleryIfEmpty(filename) {
  const filePath = join(REALISATIONS_DIR, filename);

  console.log(`\n📄 Vérification de ${filename}...`);

  const content = await readFile(filePath, 'utf-8');
  const parsed = parseFrontmatter(content);

  if (!parsed) {
    console.log(`  ⚠️  Pas de frontmatter trouvé`);
    return;
  }

  const data = parseYaml(parsed.frontmatter);

  // Si la galerie existe et n'est pas vide, on skip
  if (data.gallery && data.gallery.length > 0) {
    console.log(`  ✓ Galerie déjà remplie (${data.gallery.length} image(s))`);
    return;
  }

  // Extraire le nom du dossier depuis l'image principale
  if (!data.image) {
    console.log(`  ⚠️  Pas d'image principale, impossible de déterminer le dossier`);
    return;
  }

  // L'image est au format /images/realisations/NomDossier/image.webp
  const match = data.image.match(/\/images\/realisations\/([^\/]+)\//);
  if (!match) {
    console.log(`  ⚠️  Format d'image non reconnu: ${data.image}`);
    return;
  }

  const folderName = match[1];
  console.log(`  📁 Dossier détecté: ${folderName}`);

  // Lister les images du dossier
  const images = await listImagesInFolder(folderName);

  if (images.length === 0) {
    console.log(`  ⚠️  Aucune image trouvée dans le dossier ${folderName}`);
    return;
  }

  console.log(`  ✓ ${images.length} image(s) trouvée(s)`);

  // Mettre à jour la galerie
  data.gallery = images;

  // Reconstruire le fichier
  const newFrontmatter = toYaml(data);
  const newContent = `---\n${newFrontmatter}\n---\n${parsed.body}`;

  // Écrire le fichier
  await writeFile(filePath, newContent, 'utf-8');
  console.log(`  ✅ Galerie peuplée avec succès`);
}

/**
 * Point d'entrée principal
 */
async function main() {
  console.log('🚀 Début du peuplement des galeries vides\n');
  console.log('=' .repeat(60));

  const files = await readdir(REALISATIONS_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  console.log(`\n📊 ${mdFiles.length} fichier(s) markdown trouvé(s)\n`);

  for (const file of mdFiles) {
    await populateGalleryIfEmpty(file);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Peuplement terminé !\n');
}

main().catch(error => {
  console.error('\n❌ Erreur:', error);
  process.exit(1);
});
