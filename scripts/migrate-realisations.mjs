#!/usr/bin/env node

/**
 * Script de migration pour convertir les réalisations
 * du format folder (string) vers gallery (array d'images)
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
 * Parse simple YAML (supporte seulement les structures basiques)
 */
function parseYaml(yamlString) {
  const lines = yamlString.split('\n');
  const result = {};
  let currentKey = null;
  let currentArray = null;

  for (const line of lines) {
    // Ligne vide
    if (!line.trim()) continue;

    // Élément de liste (array)
    const arrayMatch = line.match(/^\s*-\s+(.+)$/);
    if (arrayMatch && currentArray) {
      currentArray.push(arrayMatch[1].replace(/^['"]|['"]$/g, ''));
      continue;
    }

    // Clé-valeur
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      currentKey = key;

      // Vérifier si c'est un array vide ou le début d'un array
      if (!value || value === '[]') {
        result[key] = [];
        currentArray = result[key];
      } else if (value.startsWith('[')) {
        // Array inline
        try {
          result[key] = JSON.parse(value.replace(/'/g, '"'));
        } catch {
          result[key] = value;
        }
        currentArray = null;
      } else {
        // Valeur simple
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
 * Liste toutes les images d'un dossier (en privilégiant les .webp)
 */
async function listImagesInFolder(folderName) {
  const folderPath = join(IMAGES_DIR, folderName);

  try {
    const files = await readdir(folderPath);
    const imageFiles = files.filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f));

    // Grouper par nom de base
    const baseNames = new Map();

    for (const file of imageFiles) {
      const baseName = file.substring(0, file.lastIndexOf('.'));
      const ext = file.substring(file.lastIndexOf('.')).toLowerCase();

      if (!baseNames.has(baseName)) {
        baseNames.set(baseName, []);
      }
      baseNames.get(baseName).push({ file, ext, priority: ext === '.webp' ? 1 : 0 });
    }

    // Pour chaque nom de base, garder uniquement le .webp s'il existe, sinon garder le premier
    const finalImages = [];

    for (const [baseName, versions] of baseNames.entries()) {
      // Trier par priorité (webp en premier)
      versions.sort((a, b) => b.priority - a.priority);
      finalImages.push(versions[0].file);
    }

    // Trier par nom de fichier
    finalImages.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

    // Convertir en chemins absolus
    return finalImages.map(f => `/images/realisations/${folderName}/${f}`);
  } catch (error) {
    console.warn(`⚠️  Impossible de lire le dossier ${folderName}:`, error.message);
    return [];
  }
}

/**
 * Migre un fichier de réalisation
 */
async function migrateRealisationFile(filename) {
  const filePath = join(REALISATIONS_DIR, filename);

  console.log(`\n📄 Migration de ${filename}...`);

  const content = await readFile(filePath, 'utf-8');
  const parsed = parseFrontmatter(content);

  if (!parsed) {
    console.log(`  ⚠️  Pas de frontmatter trouvé, fichier ignoré`);
    return;
  }

  const data = parseYaml(parsed.frontmatter);

  // Si pas de folder, rien à migrer
  if (!data.folder) {
    console.log(`  ℹ️  Pas de champ 'folder', migration non nécessaire`);
    return;
  }

  // Si gallery existe déjà, ne pas écraser
  if (data.gallery && data.gallery.length > 0) {
    console.log(`  ✓ Champ 'gallery' déjà présent, fichier ignoré`);
    return;
  }

  console.log(`  📁 Dossier détecté: ${data.folder}`);

  // Lister les images du dossier
  const images = await listImagesInFolder(data.folder);

  if (images.length === 0) {
    console.log(`  ⚠️  Aucune image trouvée dans le dossier ${data.folder}`);
  } else {
    console.log(`  ✓ ${images.length} image(s) trouvée(s)`);
  }

  // Ajouter le champ gallery
  data.gallery = images;

  // Reconstruire le fichier
  const newFrontmatter = toYaml(data);
  const newContent = `---\n${newFrontmatter}\n---\n${parsed.body}`;

  // Écrire le fichier
  await writeFile(filePath, newContent, 'utf-8');
  console.log(`  ✅ Fichier migré avec succès`);
}

/**
 * Point d'entrée principal
 */
async function main() {
  console.log('🚀 Début de la migration des réalisations\n');
  console.log('=' .repeat(60));

  const files = await readdir(REALISATIONS_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  console.log(`\n📊 ${mdFiles.length} fichier(s) markdown trouvé(s)\n`);

  for (const file of mdFiles) {
    await migrateRealisationFile(file);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Migration terminée !\n');
}

main().catch(error => {
  console.error('\n❌ Erreur lors de la migration:', error);
  process.exit(1);
});
