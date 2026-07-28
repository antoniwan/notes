/**
 * Lightweight frontmatter audit for src/content/p.
 * Checks required fields and basic publish/language sanity (not a full Zod re-run).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'src', 'content', 'p');

const REQUIRED = ['title', 'description', 'pubDate'];
const errors = [];
const warnings = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (/\.(md|mdx)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

function parseFrontmatter(raw, file) {
  if (!raw.startsWith('---')) {
    errors.push(`${file}: missing frontmatter fence`);
    return null;
  }
  const end = raw.indexOf('\n---', 3);
  if (end === -1) {
    errors.push(`${file}: unclosed frontmatter`);
    return null;
  }
  const block = raw.slice(3, end).replace(/^\r?\n/, '');
  try {
    return yaml.load(block);
  } catch (e) {
    errors.push(`${file}: YAML parse error — ${e.message}`);
    return null;
  }
}

const files = walk(contentDir);
for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const raw = fs.readFileSync(file, 'utf8');
  const data = parseFrontmatter(raw, rel);
  if (!data || typeof data !== 'object') continue;

  for (const key of REQUIRED) {
    if (data[key] === undefined || data[key] === null || data[key] === '') {
      errors.push(`${rel}: missing required field \`${key}\``);
    }
  }

  if (data.language !== undefined) {
    if (!Array.isArray(data.language) || data.language.length === 0) {
      errors.push(`${rel}: language must be a non-empty array`);
    } else {
      for (const lang of data.language) {
        if (lang !== 'en' && lang !== 'es') {
          errors.push(`${rel}: unsupported language \`${lang}\``);
        }
      }
    }
  }

  if (data.translationGroup && data.featured === undefined) {
    warnings.push(`${rel}: has translationGroup but no featured flag`);
  }

  if (data.draft === true && data.published === true) {
    warnings.push(`${rel}: draft:true with published:true (prod will hide as draft)`);
  }
}

console.log(`audit-frontmatter: scanned ${files.length} posts`);
if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  warnings.forEach((w) => console.log(`  - ${w}`));
}
if (errors.length) {
  console.error(`Errors (${errors.length}):`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log('audit-frontmatter: OK');
