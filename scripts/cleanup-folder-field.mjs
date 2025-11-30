#!/usr/bin/env node

/**
 * Script de nettoyage pour supprimer le champ 'folder'
 * de tous les fichiers de réalisations
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const REALISATIONS_DIR = join(projectRoot, 'src/content/realisations');

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
 * Nettoie un fichier de réalisation en supprimant le champ 'folder'
 */
async function cleanupRealisationFile(filename) {
  const filePath = join(REALISATIONS_DIR, filename);

  console.log(`\n📄 Nettoyage de ${filename}...`);

  const content = await readFile(filePath, 'utf-8');
  const parsed = parseFrontmatter(content);

  if (!parsed) {
    console.log(`  ⚠️  Pas de frontmatter trouvé, fichier ignoré`);
    return;
  }

  const data = parseYaml(parsed.frontmatter);

  // Si pas de folder, rien à nettoyer
  if (!data.folder) {
    console.log(`  ℹ️  Pas de champ 'folder', nettoyage non nécessaire`);
    return;
  }

  console.log(`  📁 Champ 'folder' détecté: ${data.folder}`);

  // Supprimer le champ folder
  delete data.folder;

  // Reconstruire le fichier
  const newFrontmatter = toYaml(data);
  const newContent = `---\n${newFrontmatter}\n---\n${parsed.body}`;

  // Écrire le fichier
  await writeFile(filePath, newContent, 'utf-8');
  console.log(`  ✅ Champ 'folder' supprimé avec succès`);
}

/**
 * Point d'entrée principal
 */
async function main() {
  console.log('🚀 Début du nettoyage des fichiers de réalisations\n');
  console.log('=' .repeat(60));

  const files = await readdir(REALISATIONS_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  console.log(`\n📊 ${mdFiles.length} fichier(s) markdown trouvé(s)\n`);

  for (const file of mdFiles) {
    await cleanupRealisationFile(file);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Nettoyage terminé !\n');
}

main().catch(error => {
  console.error('\n❌ Erreur lors du nettoyage:', error);
  process.exit(1);
});
