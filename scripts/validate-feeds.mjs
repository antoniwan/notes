/**
 * Validate built RSS + JSON feeds under dist/.
 * Run after `pnpm run build` (or any build that produces dist/rss.xml + dist/feed.json).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

function fail(msg) {
  console.error(`validate-feeds: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(dist)) {
  fail('dist/ missing — run `pnpm run build` first');
}

const rssPath = path.join(dist, 'rss.xml');
const jsonPath = path.join(dist, 'feed.json');

if (!fs.existsSync(rssPath)) fail(`missing ${rssPath}`);
if (!fs.existsSync(jsonPath)) fail(`missing ${jsonPath}`);

const rss = fs.readFileSync(rssPath, 'utf8');
const jsonRaw = fs.readFileSync(jsonPath, 'utf8');

const rssErrors = [];
if (!rss.includes('<rss') && !rss.includes('<feed')) rssErrors.push('not recognizable RSS/Atom XML');
if (!/<item[\s>]|<entry[\s>]/.test(rss)) rssErrors.push('no <item> or <entry> elements');
if (!rss.includes('<title')) rssErrors.push('missing <title>');
if (!rss.includes('<link')) rssErrors.push('missing <link>');

let json;
try {
  json = JSON.parse(jsonRaw);
} catch (e) {
  fail(`feed.json is not valid JSON: ${e.message}`);
}

const jsonErrors = [];
if (!json.version) jsonErrors.push('missing version');
if (!json.title) jsonErrors.push('missing title');
if (!json.home_page_url) jsonErrors.push('missing home_page_url');
if (!json.feed_url) jsonErrors.push('missing feed_url');
if (!Array.isArray(json.items)) jsonErrors.push('missing items array');
else if (json.items.length === 0) jsonErrors.push('items array is empty');
else {
  json.items.forEach((item, i) => {
    if (!item.id) jsonErrors.push(`item ${i + 1}: missing id`);
    if (!item.url) jsonErrors.push(`item ${i + 1}: missing url`);
    if (!item.title) jsonErrors.push(`item ${i + 1}: missing title`);
    if (!item.date_published) jsonErrors.push(`item ${i + 1}: missing date_published`);
  });
}

if (rssErrors.length || jsonErrors.length) {
  if (rssErrors.length) {
    console.error('RSS errors:');
    rssErrors.forEach((e) => console.error(`  - ${e}`));
  }
  if (jsonErrors.length) {
    console.error('JSON Feed errors:');
    jsonErrors.forEach((e) => console.error(`  - ${e}`));
  }
  process.exit(1);
}

const itemCount = Array.isArray(json.items) ? json.items.length : 0;
console.log(`validate-feeds: OK (JSON Feed ${itemCount} items; RSS ${Buffer.byteLength(rss)} bytes)`);
