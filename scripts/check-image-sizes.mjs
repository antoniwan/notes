// Caps the size of committed images, so the repo and the build's image
// encoding stop growing with every oversized upload.
//
// A new image over MAX_BYTES fails. Files already over it are listed in
// check-image-sizes.baseline.json and may only shrink; re-encode one and drop
// it from the baseline. Aim for AVIF at 2400px wide or less.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const MAX_BYTES = 1_000_000;
const ROOTS = ['src/assets/images', 'public/images'];
const EXT = /\.(avif|webp|png|jpe?g|gif)$/i;
const baseline = JSON.parse(
  readFileSync(new URL('./check-image-sizes.baseline.json', import.meta.url), 'utf8'),
);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (EXT.test(entry.name)) yield path;
  }
}

const failures = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const rel = relative('.', file).split('\\').join('/');
    const size = statSync(file).size;
    const allowed = baseline[rel] ?? MAX_BYTES;
    if (size > allowed) {
      failures.push(
        `${rel}: ${(size / 1e6).toFixed(2)} MB (limit ${(allowed / 1e6).toFixed(2)} MB)`,
      );
    }
  }
}

if (failures.length) {
  console.error('check-image-sizes: re-encode these (AVIF, 2400px wide or less):');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`check-image-sizes: OK (limit ${MAX_BYTES / 1e6} MB per image)`);
