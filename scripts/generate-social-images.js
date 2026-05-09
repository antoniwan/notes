import sharp from 'sharp';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import prettier from 'prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');
const socialRootDir = path.join(publicDir, 'social');
const fingerprintPath = path.join(__dirname, '../src/data/socialImageFingerprints.json');

const CACHE_VERSION = 1;

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

async function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    createReadStream(filePath)
      .on('error', reject)
      .on('data', (chunk) => hash.update(chunk))
      .on('end', () => resolve(hash.digest('hex')));
  });
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
  results.sort((a, b) => a.localeCompare(b));
  return results;
}

async function resolvePublicPath(webPath) {
  const trimmed = webPath.replace(/^\/+/, '');
  if (trimmed.includes('..')) {
    throw new Error(`Invalid web path for social asset: ${webPath}`);
  }
  return path.join(publicDir, ...trimmed.split('/'));
}

function serializeFingerprintsPayload(sourcesObj) {
  const sortedSources = {};
  for (const key of Object.keys(sourcesObj).sort()) {
    sortedSources[key] = sourcesObj[key];
  }
  return (
    JSON.stringify(
      {
        version: CACHE_VERSION,
        sources: sortedSources,
      },
      null,
      2,
    ) + '\n'
  );
}

async function readFingerprintStore() {
  try {
    const raw = await fs.readFile(fingerprintPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (
      parsed?.version !== CACHE_VERSION ||
      typeof parsed.sources !== 'object' ||
      parsed.sources === null
    ) {
      return { version: CACHE_VERSION, sources: {} };
    }
    return { version: CACHE_VERSION, sources: parsed.sources };
  } catch {
    return { version: CACHE_VERSION, sources: {} };
  }
}

/**
 * One-time bootstrap: fingerprints file used to be ignored under public/social/.
 * If we have manifest + AVIF + social outputs but empty fingerprints, hydrate SHA-256
 * skips without re-encoding hundreds of thumbnails.
 */
function parsePairsFromSocialManifestTs(manifestText) {
  const pairs = [];
  const re = /'(\/[^']+)'\s*:\s*'(\/[^']+)'/gs;
  let m;
  while ((m = re.exec(manifestText)) !== null) {
    const original = m[1];
    const social = m[2];
    if (
      original.endsWith('.avif') &&
      social.includes('-social.') &&
      (social.endsWith('.jpg') || social.endsWith('.png'))
    ) {
      pairs.push({ original, social });
    }
  }
  return pairs;
}

async function maybeHydrateFingerprintsFromManifest(store) {
  if (Object.keys(store.sources).length > 0) {
    return store;
  }

  const manifestTsPath = path.join(__dirname, '../src/data/socialImageManifest.ts');
  let manifestText;
  try {
    manifestText = await fs.readFile(manifestTsPath, 'utf8');
  } catch {
    return store;
  }

  const hydrated = { ...store, sources: { ...store.sources } };
  const pairs = parsePairsFromSocialManifestTs(manifestText);
  let filled = 0;

  for (const { original, social } of pairs) {
    try {
      const sourceAbs = await resolvePublicPath(original);
      const destAbs = await resolvePublicPath(social);
      await Promise.all([fs.stat(sourceAbs), fs.stat(destAbs)]);
      const contentSha256 = await sha256File(sourceAbs);
      hydrated.sources[original] = {
        sha256: contentSha256,
        social,
      };
      filled += 1;
    } catch {
      // Missing file or unreadable manifest row; skip hydration for this pair.
    }
  }

  if (filled > 0) {
    console.log(
      `🧭 Bootstrapped ${filled} fingerprint(s) from existing manifest + social outputs.`,
    );
  }

  return hydrated;
}

async function writeFingerprintPayloadIfNeeded(sourcesObj, previousRaw) {
  const next = serializeFingerprintsPayload(sourcesObj);
  if (next.trim() === (previousRaw || '').trim()) {
    return false;
  }
  await fs.mkdir(path.dirname(fingerprintPath), { recursive: true });
  await fs.writeFile(fingerprintPath, next, 'utf8');
  return true;
}

async function generateSocialForFile(filePath, previousEntry) {
  const relative = path.relative(publicDir, filePath);
  const relativeSlash = relative.split(path.sep).join('/');
  const relDir =
    path.dirname(relative) === '.' ? '' : path.dirname(relative).split(path.sep).join('/');
  const base = path.basename(filePath, path.extname(filePath));
  const originalWebPath = '/' + relativeSlash;
  const contentSha256 = await sha256File(filePath);

  if (
    previousEntry?.sha256 === contentSha256 &&
    previousEntry?.social &&
    typeof previousEntry.social === 'string'
  ) {
    const cachedOutputAbs = await resolvePublicPath(previousEntry.social);
    try {
      await fs.stat(cachedOutputAbs);
      return {
        original: originalWebPath,
        social: previousEntry.social,
        fingerprint: contentSha256,
        wasCached: true,
      };
    } catch {
      // Output vanished; regenerate.
    }
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
    fingerprint: contentSha256,
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

  let store = await readFingerprintStore();
  store = await maybeHydrateFingerprintsFromManifest(store);

  const avifFiles = await getAvifFiles(publicDir);

  let existingFingerprintsRaw = '';
  try {
    existingFingerprintsRaw = await fs.readFile(fingerprintPath, 'utf8');
  } catch {
    //
  }

  if (avifFiles.length === 0) {
    console.log('No .avif files found under /public; nothing to generate.');
    await writeFingerprintPayloadIfNeeded({}, existingFingerprintsRaw);
    await writeManifest([]);
    return;
  }

  const mappings = [];
  let generatedCount = 0;
  let skippedCount = 0;

  for (const file of avifFiles) {
    const relativeSlash = path.relative(publicDir, file).split(path.sep).join('/');
    const originalWebPath = '/' + relativeSlash;
    const prev = store.sources[originalWebPath];
    const mapping = await generateSocialForFile(file, prev);
    if (mapping.wasCached) {
      skippedCount += 1;
    } else {
      generatedCount += 1;
      console.log(`🆕 Generated ${mapping.social} from ${mapping.original}`);
    }
    mappings.push(mapping);
  }

  const nextSources = {};
  for (const m of mappings) {
    nextSources[m.original] = { sha256: m.fingerprint, social: m.social };
  }

  await writeFingerprintPayloadIfNeeded(nextSources, existingFingerprintsRaw);

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
