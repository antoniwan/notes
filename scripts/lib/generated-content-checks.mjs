import {
  isPublicMeta,
  isSpanishPrimaryMeta,
  normalizePostMeta,
} from '../../src/utils/publishEligibility.mjs';

/**
 * Contract checks for the generated site.
 *
 * These are pure functions over already-extracted data so they can be unit
 * tested against synthetic bad input. The repo has no draft, unpublished, or
 * future-dated post today, so a real artifact run cannot demonstrate that the
 * draft rule bites — the unit tests are what establish that, and
 * `validate-generated-content.mjs` applies the same functions to the real build.
 *
 * Every function returns an array of human-readable problem strings. Empty means
 * the contract holds.
 */

/** JSON-LD every page is expected to carry. */
export const REQUIRED_SITE_SCHEMA_TYPES = ['WebSite', 'Organization'];

/**
 * Parses and shallow-validates JSON-LD blocks lifted from one page.
 *
 * @param {string[]} blocks raw text of each ld+json script
 * @param {{ label: string, requiredTypes?: string[] }} context
 */
export function checkJsonLd(blocks, { label, requiredTypes = [] }) {
  const problems = [];

  if (blocks.length === 0) {
    problems.push(`${label}: no application/ld+json blocks emitted`);
    return problems;
  }

  const seenTypes = new Set();

  blocks.forEach((raw, index) => {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      problems.push(`${label}: ld+json block ${index + 1} is not valid JSON (${error.message})`);
      return;
    }

    // A block may be a graph or a single node; normalize before inspecting.
    const nodes = Array.isArray(parsed) ? parsed : [parsed];
    for (const node of nodes) {
      if (!node || typeof node !== 'object') {
        problems.push(`${label}: ld+json block ${index + 1} is not an object`);
        continue;
      }
      if (!node['@context']) {
        problems.push(`${label}: ld+json block ${index + 1} is missing @context`);
      }
      if (!node['@type']) {
        problems.push(`${label}: ld+json block ${index + 1} is missing @type`);
        continue;
      }
      for (const type of Array.isArray(node['@type']) ? node['@type'] : [node['@type']]) {
        seenTypes.add(type);
      }
    }
  });

  for (const type of requiredTypes) {
    if (!seenTypes.has(type)) {
      problems.push(`${label}: expected ld+json @type ${type}, found ${[...seenTypes].join(', ')}`);
    }
  }

  return problems;
}

/**
 * Feed entries must be uniquely identified. A duplicate id makes readers merge
 * or drop posts, and it is invisible in a byte-count check.
 *
 * @param {{ id?: string, url?: string, title?: string }[]} items
 */
export function checkFeedIdsUnique(items, label) {
  const problems = [];
  const seen = new Map();

  items.forEach((item, index) => {
    const id = item.id ?? item.url;
    if (!id) {
      problems.push(`${label}: item ${index + 1} has neither id nor url`);
      return;
    }
    if (seen.has(id)) {
      problems.push(
        `${label}: duplicate id ${id} (items ${seen.get(id) + 1} and ${index + 1}: ` +
          `${item.title ?? 'untitled'})`,
      );
      return;
    }
    seen.set(id, index);
  });

  return problems;
}

/**
 * Publication rules come from the shared module rather than a copy. These two
 * wrappers keep this file's frontmatter-shaped call sites readable.
 */
export function isPublicFrontmatter(data, now = new Date()) {
  return isPublicMeta(normalizePostMeta(data), { now });
}

/** Feeds and listings carry English posts only; Spanish stays reachable by URL. */
export function isSpanishPrimaryFrontmatter(data) {
  return isSpanishPrimaryMeta(normalizePostMeta(data));
}

/**
 * Nothing withheld may be published, and nothing public may go missing.
 *
 * @param {{ slug: string, data: object }[]} posts source frontmatter
 * @param {Set<string>} emittedSlugs slugs with an emitted page in dist
 * @param {Set<string>} feedSlugs slugs present in the feeds
 */
export function checkPublishEligibility(posts, emittedSlugs, feedSlugs, now = new Date()) {
  const problems = [];

  for (const { slug, data } of posts) {
    const isPublic = isPublicFrontmatter(data, now);
    const emitted = emittedSlugs.has(slug);
    const inFeed = feedSlugs.has(slug);

    if (!isPublic) {
      const reason = data.draft
        ? 'draft'
        : data.published === false
          ? 'published: false'
          : 'future pubDate';
      if (emitted) problems.push(`${slug}: withheld (${reason}) but a page was emitted`);
      if (inFeed) problems.push(`${slug}: withheld (${reason}) but it appears in a feed`);
      continue;
    }

    if (!emitted) problems.push(`${slug}: public but no page was emitted`);

    if (isSpanishPrimaryFrontmatter(data)) {
      if (inFeed) problems.push(`${slug}: Spanish-primary post must not appear in the feeds`);
    } else if (!inFeed) {
      problems.push(`${slug}: public English post is missing from the feeds`);
    }
  }

  return problems;
}

/**
 * Site-local asset references must resolve to a file in the output. External
 * URLs are ignored on purpose: the audit asked that this gate never depend on
 * other websites being reachable.
 *
 * @param {{ label: string, url: string }[]} references
 * @param {(sitePath: string) => boolean} exists
 * @param {string} siteOrigin
 */
export function checkLocalAssets(references, exists, siteOrigin) {
  const problems = [];

  for (const { label, url } of references) {
    if (!url) continue;

    let sitePath = null;
    if (url.startsWith('/')) sitePath = url;
    else if (siteOrigin && url.startsWith(siteOrigin)) sitePath = url.slice(siteOrigin.length);
    // Anything else is off-site and deliberately not our problem here.
    if (!sitePath) continue;

    const clean = sitePath.split('?')[0].split('#')[0];
    if (!exists(clean)) problems.push(`${label}: local asset ${clean} has no file in the output`);
  }

  return problems;
}

/**
 * The canonical URL, the feed entry URL, and the JSON-LD identity have to agree,
 * or the same post is three different documents to a crawler.
 */
export function checkCanonicalConsistency({ label, canonical, feedUrl, jsonLdUrl }) {
  const problems = [];

  if (!canonical) {
    problems.push(`${label}: no canonical link emitted`);
    return problems;
  }

  const normalize = (url) => (url ? url.replace(/\/+$/, '') : url);
  const base = normalize(canonical);

  if (feedUrl && normalize(feedUrl) !== base) {
    problems.push(`${label}: feed url ${feedUrl} disagrees with canonical ${canonical}`);
  }
  if (jsonLdUrl && normalize(jsonLdUrl) !== base) {
    problems.push(`${label}: ld+json url ${jsonLdUrl} disagrees with canonical ${canonical}`);
  }

  return problems;
}

/**
 * Hero art must be served responsively (R20).
 *
 * Astro can only optimize images under `src/`. A hero dropped into
 * `public/images/` still renders — `HeroImage` falls back to a plain `<img>` —
 * so nothing errors and nothing looks broken. It just silently ships one
 * full-size file to every screen, which is the exact defect R20 removed. That
 * failure mode is invisible without a check, so this is the check.
 *
 * @param {{ label: string, src: string, hasSrcset: boolean }[]} heroes
 */
export function checkHeroesAreResponsive(heroes) {
  const problems = [];

  for (const { label, src, hasSrcset } of heroes) {
    if (hasSrcset) continue;
    problems.push(
      `${label}: hero image ${src} has no srcset. Move it from public/images/ to ` +
        `src/assets/images/ so Astro can generate responsive sizes.`,
    );
  }

  return problems;
}

/**
 * Site-internal links in a page must resolve, except paths the host redirects.
 *
 * @param {string[]} hrefs
 * @param {(sitePath: string) => boolean} exists
 * @param {string[]} redirectPrefixes paths owned by vercel.json / seoRouting
 */
export function checkLocalLinks(hrefs, exists, redirectPrefixes = [], label = 'page') {
  const problems = [];
  const seen = new Set();

  for (const href of hrefs) {
    if (!href || !href.startsWith('/') || href.startsWith('//')) continue;

    const clean = href.split('?')[0].split('#')[0];
    if (!clean || clean === '/' || seen.has(clean)) continue;
    seen.add(clean);

    // Host-level redirects have no file in the output by design.
    if (redirectPrefixes.some((prefix) => clean === prefix || clean.startsWith(prefix))) continue;

    if (!exists(clean)) problems.push(`${label}: internal link ${clean} resolves to nothing`);
  }

  return problems;
}
