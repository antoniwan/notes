import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import prettier from 'prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');
const socialRootDir = path.join(publicDir, 'social');
const cachePath = path.join(socialRootDir, '.cache.json');

const CACHE_VERSION = 1;

function getEmptyCache() {
  return {
    version: CACHE_VERSION,
    entries: {},
  };
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function toWebPath(fsPath) {
  const relative = path.relative(publicDir, fsPath);
  return '/' + relative.split(path.sep).join('/');
}

function toSingleQuoted(value) {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

async function getAvifFiles(rootDir) {
  const results = [];

  async function walk(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip the social output folder so we don't re-process generated files
      if (entry.isDirectory()) {
        if (path.relative(publicDir, fullPath).split(path.sep)[0] === 'social') {
          continue;
        }
        await walk(fullPath);
      } else if (entry.isFile()) {
        if (entry.name.toLowerCase().endsWith('.avif')) {
          results.push(fullPath);
        }
      }
    }
  }

  await walk(rootDir);
  return results;
}

async function findExistingSocialVariant(relativeDir, baseName) {
  const targetDir = path.join(socialRootDir, relativeDir);
  const jpegPath = path.join(targetDir, `${baseName}-social.jpg`);
  const pngPath = path.join(targetDir, `${baseName}-social.png`);

  try {
    await fs.stat(jpegPath);
    return jpegPath;
  } catch {}

  try {
    await fs.stat(pngPath);
    return pngPath;
  } catch {}

  return null;
}

async function getSourceFingerprint(filePath) {
  const stats = await fs.stat(filePath);
  return `${stats.size}-${Math.floor(stats.mtimeMs)}`;
}

async function readCache() {
  try {
    const raw = await fs.readFile(cachePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed?.version !== CACHE_VERSION || typeof parsed.entries !== 'object') {
      return getEmptyCache();
    }
    return parsed;
  } catch {
    return getEmptyCache();
  }
}

async function writeCache(cache) {
  const normalized = {
    version: CACHE_VERSION,
    entries: cache.entries ?? {},
  };
  await fs.writeFile(cachePath, JSON.stringify(normalized, null, 2) + '\n', 'utf8');
}

async function generateSocialForFile(filePath, cacheEntry) {
  const relative = path.relative(publicDir, filePath);
  const relDir = path.dirname(relative) === '.' ? '' : path.dirname(relative);
  const base = path.basename(filePath, path.extname(filePath));
  const originalWebPath = '/' + relative.split(path.sep).join('/');
  const sourceFingerprint = await getSourceFingerprint(filePath);

  if (cacheEntry?.fingerprint === sourceFingerprint && cacheEntry?.social) {
    const cachedOutputPath = path.join(publicDir, cacheEntry.social.slice(1));
    try {
      await fs.stat(cachedOutputPath);
      return {
        original: originalWebPath,
        social: cacheEntry.social,
        fingerprint: sourceFingerprint,
        wasCached: true,
      };
    } catch {
      // Cache entry is stale (output missing), continue and regenerate.
    }
  }

  // If we already have a generated social image, reuse it (cache)
  const existing = await findExistingSocialVariant(relDir, base);
  if (existing) {
    return {
      original: originalWebPath,
      social: toWebPath(existing),
      fingerprint: sourceFingerprint,
      wasCached: true,
    };
  }

  const sourceBuffer = await fs.readFile(filePath);

  const targetDir = path.join(socialRootDir, relDir);
  await ensureDir(targetDir);

  const jpegPath = path.join(targetDir, `${base}-social.jpg`);
  const pngPath = path.join(targetDir, `${base}-social.png`);

  // Encode as JPEG and PNG, then pick the smaller file
  await sharp(sourceBuffer).jpeg({ quality: 82, chromaSubsampling: '4:4:4' }).toFile(jpegPath);
  await sharp(sourceBuffer).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(pngPath);

  const [jpegStat, pngStat] = await Promise.all([fs.stat(jpegPath), fs.stat(pngPath)]);

  let chosenPath = jpegPath;
  let discardPath = pngPath;
  if (pngStat.size < jpegStat.size) {
    chosenPath = pngPath;
    discardPath = jpegPath;
  }

  try {
    await fs.unlink(discardPath);
  } catch {
    // If deletion fails, it's non-fatal; we just keep the extra file.
  }

  return {
    original: originalWebPath,
    social: toWebPath(chosenPath),
    fingerprint: sourceFingerprint,
    wasCached: false,
  };
}

async function writeManifest(mappings) {
  const manifestPath = path.join(__dirname, '../src/data/socialImageManifest.ts');

  const lines = [
    '// Auto-generated by scripts/generate-social-images.js. DO NOT EDIT BY HAND.',
    'export const SOCIAL_IMAGE_MANIFEST: Record<string, string> = {',
    ...mappings.map(
      ({ original, social }) => `  ${toSingleQuoted(original)}: ${toSingleQuoted(social)},`,
    ),
    '};',
    '',
  ];

  const formatted = await prettier.format(lines.join('\n'), {
    parser: 'typescript',
    singleQuote: true,
  });

  let existing = '';
  try {
    existing = await fs.readFile(manifestPath, 'utf8');
  } catch {
    // No existing manifest yet; write a new one.
  }

  if (formatted !== existing) {
    await fs.writeFile(manifestPath, formatted, 'utf8');
  }
}

async function main() {
  console.log('🔍 Scanning for AVIF images under /public ...');
  await ensureDir(publicDir);
  await ensureDir(socialRootDir);
  const cache = await readCache();

  const avifFiles = await getAvifFiles(publicDir);

  if (avifFiles.length === 0) {
    console.log('No .avif files found under /public; nothing to generate.');
    await writeManifest([]);
    return;
  }

  const mappings = [];
  const nextEntries = {};
  let generatedCount = 0;
  let skippedCount = 0;

  for (const file of avifFiles) {
    const relative = path.relative(publicDir, file).split(path.sep).join('/');
    const cacheEntry = cache.entries[relative];
    const mapping = await generateSocialForFile(file, cacheEntry);
    if (mapping.wasCached) {
      skippedCount += 1;
    } else {
      generatedCount += 1;
      console.log(`🆕 Generated ${mapping.social} from ${mapping.original}`);
    }
    mappings.push(mapping);
    nextEntries[relative] = {
      social: mapping.social,
      fingerprint: mapping.fingerprint,
    };
  }

  cache.entries = nextEntries;
  await writeCache(cache);

  const manifestPath = path.join(__dirname, '../src/data/socialImageManifest.ts');
  let hasManifest = true;
  try {
    await fs.stat(manifestPath);
  } catch {
    hasManifest = false;
  }

  // Avoid rewriting manifest on no-op builds; update only when needed.
  if (!hasManifest || generatedCount > 0) {
    await writeManifest(mappings);
  }
  console.log(
    `✅ Social image step done: ${generatedCount} generated, ${skippedCount} reused, ${mappings.length} total.`,
  );
}

main().catch((err) => {
  console.error('❌ Error generating social images:', err);
  process.exit(1);
});
