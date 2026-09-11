#!/usr/bin/env node
/**
 * Validates the generated site against its content contracts. Run after
 * `pnpm run build`.
 *
 * This is the artifact-level counterpart to `validate-structured-data.mjs`,
 * which only greps the source module for export names and therefore cannot say
 * whether a layout wired those utilities correctly. Here the emitted bytes are
 * parsed:
 *
 * - every representative page's JSON-LD parses and carries @context / @type
 * - RSS is well-formed XML, by a real parser, not a substring search
 * - feed ids are unique across RSS and JSON Feed
 * - canonical URL, feed entry URL, and JSON-LD identity agree
 * - site-local images and internal links resolve to real files
 * - drafts, unpublished, and future-dated posts are absent from pages and feeds,
 *   and public English posts are present
 *
 * External URLs are never fetched. A release must not fail because someone
 * else's website is down.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import yaml from 'js-yaml';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

import {
  checkCanonicalConsistency,
  checkFeedIdsUnique,
  checkHeroesAreResponsive,
  checkJsonLd,
  checkLocalAssets,
  checkLocalLinks,
  checkPublishEligibility,
  REQUIRED_SITE_SCHEMA_TYPES,
} from './lib/generated-content-checks.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_ORIGIN = 'https://notes.antoniwan.online';

/**
 * Paths served by host-level redirects or the on-demand route, so they have no
 * file in the static output and must not be reported as broken links.
 */
const REDIRECT_PREFIXES = ['/api/', '/rss.xml', '/sitemap.xml', '/sitemap-index.xml'];

const problems = [];
const notes = [];

function findDistRoot() {
  for (const dir of [path.join(root, 'dist', 'client'), path.join(root, 'dist')]) {
    if (fs.existsSync(path.join(dir, 'index.html'))) return dir;
  }
  return null;
}

const dist = findDistRoot();
if (!dist) {
  console.error('validate-generated-content: no built output — run `pnpm run build` first');
  process.exit(1);
}

/** True when a site path corresponds to a file in the output. */
function outputHas(sitePath) {
  const clean = decodeURIComponent(sitePath).replace(/^\/+/, '');
  const direct = path.join(dist, clean);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return true;
  const asDirectory = path.join(dist, clean, 'index.html');
  return fs.existsSync(asDirectory) && fs.statSync(asDirectory).isFile();
}

// --- Page-level extraction ---------------------------------------------------

function readPage(sitePath) {
  const file = path.join(dist, sitePath.replace(/^\/+/, ''), 'index.html');
  const indexFile = sitePath === '/' ? path.join(dist, 'index.html') : file;
  if (!fs.existsSync(indexFile)) return null;
  return fs.readFileSync(indexFile, 'utf8');
}

function extractJsonLdBlocks(html) {
  return [
    ...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ].map((match) => match[1]);
}

function extractAttribute(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1] : null;
}

function extractCanonical(html) {
  return extractAttribute(html, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
}

function extractOgImage(html) {
  return extractAttribute(
    html,
    /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
  );
}

/** The post hero, which BlogLayout renders inside `.post-hero__frame`. */
function extractHero(html) {
  const frame = html.match(/<div class="post-hero__frame"[\s\S]{0,1500}?<\/div>/);
  if (!frame) return null;
  const img = frame[0].match(/<img[^>]*>/);
  if (!img) return null;
  const src = img[0].match(/src="([^"]+)"/);
  return { src: src ? src[1] : '(unknown)', hasSrcset: /srcset=/.test(img[0]) };
}

function extractHrefs(html) {
  return [...html.matchAll(/<a[^>]*href=["']([^"']+)["']/gi)].map((match) => match[1]);
}

/** The JSON-LD node that claims to be this page, if any. */
function articleUrlFromJsonLd(blocks) {
  for (const raw of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      continue;
    }
    for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
      const types = Array.isArray(node?.['@type']) ? node['@type'] : [node?.['@type']];
      if (!types.includes('BlogPosting') && !types.includes('Article')) continue;
      const target = node.mainEntityOfPage;
      const fromMain = typeof target === 'string' ? target : target?.['@id'];
      return node.url ?? fromMain ?? node['@id'] ?? null;
    }
  }
  return null;
}

// --- Source frontmatter ------------------------------------------------------

const contentDir = path.join(root, 'src', 'content', 'p');

function walkContent(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walkContent(full));
    else if (/\.mdx?$/i.test(entry.name)) found.push(full);
  }
  return found;
}

function readFrontmatter(file) {
  const raw = fs.readFileSync(file, 'utf8');
  if (!raw.startsWith('---')) return null;
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return null;
  try {
    return yaml.load(raw.slice(3, end).replace(/^\r?\n/, '')) ?? {};
  } catch (error) {
    problems.push(`${path.relative(root, file)}: unreadable frontmatter (${error.message})`);
    return null;
  }
}

const posts = [];
for (const file of walkContent(contentDir)) {
  const data = readFrontmatter(file);
  if (!data) continue;
  // The collection id — and therefore the route — keeps the subdirectory, so
  // recipes live at /p/recipes/<name>, not /p/<name>.
  const slug = path
    .relative(contentDir, file)
    .replace(/\.mdx?$/i, '')
    .split(path.sep)
    .join('/');
  posts.push({ slug, data });
}
notes.push(`${posts.length} source posts`);

// --- Feeds -------------------------------------------------------------------

const jsonFeedPath = path.join(dist, 'feed.json');
const rssPath = path.join(dist, 'rss.xml');

if (!fs.existsSync(jsonFeedPath)) problems.push('feed.json is missing from the output');
if (!fs.existsSync(rssPath)) problems.push('rss.xml is missing from the output');

let jsonFeed = null;
if (fs.existsSync(jsonFeedPath)) {
  try {
    jsonFeed = JSON.parse(fs.readFileSync(jsonFeedPath, 'utf8'));
  } catch (error) {
    problems.push(`feed.json is not valid JSON: ${error.message}`);
  }
}

let rssItems = [];
if (fs.existsSync(rssPath)) {
  const rssRaw = fs.readFileSync(rssPath, 'utf8');

  // A real XML parse. The previous check looked for substrings, which passes on
  // an unescaped ampersand or an unbalanced tag — the two faults that actually
  // break feed readers.
  const validity = XMLValidator.validate(rssRaw);
  if (validity !== true) {
    const { code, msg, line, col } = validity.err ?? {};
    problems.push(`rss.xml is not well-formed XML: ${code} ${msg} (line ${line}, col ${col})`);
  } else {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@' });
    const parsed = parser.parse(rssRaw);
    const channelItems = parsed?.rss?.channel?.item ?? [];
    rssItems = (Array.isArray(channelItems) ? channelItems : [channelItems]).map((item) => ({
      id: typeof item.guid === 'object' ? item.guid['#text'] : item.guid,
      url: item.link,
      title: item.title,
    }));
    notes.push(`RSS ${rssItems.length} items`);
  }
}

const jsonItems = Array.isArray(jsonFeed?.items) ? jsonFeed.items : [];
if (jsonFeed) notes.push(`JSON Feed ${jsonItems.length} items`);

problems.push(...checkFeedIdsUnique(jsonItems, 'feed.json'));
problems.push(...checkFeedIdsUnique(rssItems, 'rss.xml'));

/** Maps a feed entry URL back to a post slug, subdirectory included. */
function slugFromUrl(url) {
  if (typeof url !== 'string') return null;
  const match = url.replace(/\/+$/, '').match(/\/p\/(.+)$/);
  return match ? match[1] : null;
}

const feedSlugs = new Set(
  [...jsonItems, ...rssItems].map((item) => slugFromUrl(item.url)).filter(Boolean),
);

// Both feeds should carry the same set of posts.
const jsonSlugs = new Set(jsonItems.map((item) => slugFromUrl(item.url)).filter(Boolean));
const rssSlugs = new Set(rssItems.map((item) => slugFromUrl(item.url)).filter(Boolean));
for (const slug of jsonSlugs) {
  if (rssSlugs.size && !rssSlugs.has(slug)) problems.push(`${slug}: in feed.json but not rss.xml`);
}
for (const slug of rssSlugs) {
  if (jsonSlugs.size && !jsonSlugs.has(slug))
    problems.push(`${slug}: in rss.xml but not feed.json`);
}

// --- Publication eligibility -------------------------------------------------

const emittedSlugs = new Set(
  posts.map((post) => post.slug).filter((slug) => outputHas(`/p/${slug}`)),
);
problems.push(...checkPublishEligibility(posts, emittedSlugs, feedSlugs));

// --- Representative pages ----------------------------------------------------

/**
 * One of each surface the audit asked to cover. Slugs are resolved from source
 * rather than hardcoded, so renaming a post does not silently drop coverage.
 */
function pickSlug(predicate) {
  const found = posts.find(({ data }) => predicate(data));
  return found ? found.slug : null;
}

const englishEssay = posts.find(
  ({ slug, data }) => !slug.includes('/') && (data.language?.[0] ?? 'en') === 'en',
)?.slug;
const spanishTwin = pickSlug((data) => (data.language?.[0] ?? 'en') === 'es');
// Recipes are identified by their location in the collection, which is what
// determines their route, rather than by a tag that may or may not be set.
const recipe = posts.find(({ slug }) => slug.startsWith('recipes/'))?.slug ?? null;

const surfaces = [
  { label: 'homepage', sitePath: '/' },
  { label: 'index (everything)', sitePath: '/everything' },
  { label: 'writing insights', sitePath: '/writing-insights' },
  englishEssay && { label: `english essay (${englishEssay})`, sitePath: `/p/${englishEssay}` },
  spanishTwin && { label: `spanish twin (${spanishTwin})`, sitePath: `/p/${spanishTwin}` },
  recipe && { label: `recipe (${recipe})`, sitePath: `/p/${recipe}` },
].filter(Boolean);

if (!spanishTwin) problems.push('no Spanish-primary post found in source — coverage gap');
if (!recipe) notes.push('no recipe post in source; that surface was not exercised');

const feedUrlBySlug = new Map(
  [...jsonItems, ...rssItems]
    .map((item) => [slugFromUrl(item.url), item.url])
    .filter(([slug]) => slug),
);

// A check that inspects nothing passes exactly like a check that inspects
// everything. These counters make that difference visible in the output.
let jsonLdBlocksSeen = 0;
let heroesSeen = 0;
let linksSeen = 0;
let assetsSeen = 0;

for (const { label, sitePath } of surfaces) {
  const html = readPage(sitePath);
  if (!html) {
    problems.push(`${label}: ${sitePath} was not emitted`);
    continue;
  }

  const blocks = extractJsonLdBlocks(html);
  jsonLdBlocksSeen += blocks.length;
  problems.push(...checkJsonLd(blocks, { label, requiredTypes: REQUIRED_SITE_SCHEMA_TYPES }));

  const canonical = extractCanonical(html);
  const slug = sitePath.startsWith('/p/') ? sitePath.slice(3) : null;
  problems.push(
    ...checkCanonicalConsistency({
      label,
      canonical,
      feedUrl: slug ? feedUrlBySlug.get(slug) : null,
      jsonLdUrl: articleUrlFromJsonLd(blocks),
    }),
  );

  const ogImage = extractOgImage(html);
  if (ogImage) assetsSeen += 1;
  problems.push(
    ...checkLocalAssets([{ label: `${label} og:image`, url: ogImage }], outputHas, SITE_ORIGIN),
  );

  const hrefs = extractHrefs(html);
  linksSeen += hrefs.filter((href) => href.startsWith('/') && !href.startsWith('//')).length;
  problems.push(...checkLocalLinks(hrefs, outputHas, REDIRECT_PREFIXES, label));
}

// Every post, not a sample: the failure this guards against is one hero put in
// the wrong folder, which six representative pages would almost always miss.
const heroes = [];
for (const { slug } of posts) {
  if (!emittedSlugs.has(slug)) continue;
  const html = readPage(`/p/${slug}`);
  if (!html) continue;
  const hero = extractHero(html);
  if (!hero) continue;
  heroesSeen += 1;
  heroes.push({ label: `/p/${slug}`, src: hero.src, hasSrcset: hero.hasSrcset });
}
problems.push(...checkHeroesAreResponsive(heroes));

if (heroesSeen === 0) problems.push('no hero images were inspected - the extractor found nothing');

if (jsonLdBlocksSeen === 0) problems.push('no JSON-LD was inspected — the extractor found nothing');
if (linksSeen === 0)
  problems.push('no internal links were inspected — the extractor found nothing');
if (assetsSeen === 0) problems.push('no og:image was inspected — the extractor found nothing');

notes.push(
  `${surfaces.length} surfaces · ${jsonLdBlocksSeen} ld+json blocks · ` +
    `${linksSeen} internal links / ${heroesSeen} heroes · ${assetsSeen} og:images`,
);

// --- Report ------------------------------------------------------------------

if (problems.length) {
  console.error(`validate-generated-content: ${problems.length} problem(s)`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`validate-generated-content: OK (${notes.join(' · ')})`);
