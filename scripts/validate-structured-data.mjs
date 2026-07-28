/**
 * Smoke-check structured-data module surface used by BaseLayout.
 * Does not fetch live pages — catches export regressions.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modulePath = path.join(root, 'src', 'utils', 'structuredData.ts');
const src = fs.readFileSync(modulePath, 'utf8');

const requiredExports = [
  'generateStructuredData',
  'generateArticleSchema',
  'validateStructuredData',
];

const missing = requiredExports.filter(
  (name) => !new RegExp(`export\\s+function\\s+${name}\\b`).test(src),
);

if (missing.length) {
  console.error('validate-structured-data: missing exports:');
  missing.forEach((m) => console.error(`  - ${m}`));
  process.exit(1);
}

if (!/BlogPosting|Article|WebSite|Organization|Person/.test(src)) {
  console.error('validate-structured-data: expected core schema.org types not found in module');
  process.exit(1);
}

console.log(`validate-structured-data: OK (${path.relative(root, modulePath).replace(/\\/g, '/')})`);
