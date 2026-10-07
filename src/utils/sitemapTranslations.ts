/**
 * Sitemap metadata derived from post frontmatter.
 *
 * Uses the filesystem (not `astro:content`) so this module can be imported
 * from `astro.config.mjs` at config-load time.
 *
 * Provides:
 * - xhtml:link clusters for slug-based EN/ES translationGroup pairs
 * - lastmod dates (updatedDate, else pubDate) for posts and listing pages
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL } from '../consts';
import { loadFrontmatterYaml } from './frontmatterYaml.mjs';
import { canonicalizeTags } from './tagVocabulary';
import { isRecipeId } from './recipes';
import {
  isListingEligibleMeta,
  isPublicMeta,
  isSpanishPrimaryMeta,
  lastmodForMeta,
  normalizePostMeta,
} from './publishEligibility.mjs';
import type { PostMeta } from './publishEligibility.mjs';

export type SitemapLangLink = { url: string; lang: string };

/** Same values as the page head's hreflang links. No region: es-ES would target Spain. */
const HREFLANG_BY_LANG: Record<string, string> = {
  en: 'en',
  es: 'es',
};

// Relative to this file at config load. Inside a built page this module runs from
// a bundled chunk, so fall back to the project root (where Astro and Vercel build).
const CONTENT_DIR =
  [
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../content/p'),
    path.resolve(process.cwd(), 'src/content/p'),
  ].find((dir) => fs.existsSync(dir)) ?? path.resolve(process.cwd(), 'src/content/p');

/** Listings that carry recipes alongside essays. */
const LISTING_PATHS = ['/', '/everything'];

/**
 * Feeds carry essays only — see `isFeedListedPost`. A new dish must not move
 * `/rss.xml` or `/feed.json` lastmod.
 */
const FEED_PATHS = ['/rss.xml', '/feed.json'];

/**
 * Listings that carry essays only — see `isGuidedPathListedPost`,
 * `isCategoryListedPost` and `isTagListedPost` in utils/recipes.ts. The category
 * and tag index pages build their counts from those same filters, so a new dish
 * changes nothing on them either.
 */
const ESSAY_LISTING_PATHS = ['/guided-path', '/category', '/tag'];

type SitemapMeta = {
  linksByCanonicalUrl: Map<string, SitemapLangLink[]>;
  lastmodByUrl: Map<string, Date>;
  /** Essays per canonical tag, on the same rules as the tag pages' lastmod. */
  tagPostCount: Map<string, number>;
};

/**
 * Tag pages with fewer essays than this stay up for readers, but are kept out of
 * the sitemap and marked noindex: one-post tag pages read as thin to search engines.
 */
export const TAG_INDEX_MIN_POSTS = 3;

let sitemapMeta: SitemapMeta | null = null;

function walkMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMarkdownFiles(full));
    else if (/\.(md|mdx)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function parseFrontmatter(raw: string): Record<string, unknown> | null {
  if (!raw.startsWith('---')) return null;
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return null;
  const block = raw.slice(3, end).replace(/^\r?\n/, '');
  try {
    const data = loadFrontmatterYaml(block);
    return data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function postIdFromFile(file: string): string {
  const rel = path.relative(CONTENT_DIR, file).replace(/\\/g, '/');
  return rel.replace(/\.(md|mdx)$/i, '');
}

function canonicalPostUrl(id: string): string {
  return new URL(`/p/${id}`, SITE_URL).href.replace(/\/$/, '');
}

/** Match @astrojs/sitemap URLs with `trailingSlash: 'never'` (root keeps `/`). */
export function sitemapPageUrl(pathname: string): string {
  const href = new URL(pathname, SITE_URL).href;
  if (pathname === '/') return href;
  return href.replace(/\/$/, '');
}

function bumpLastmod(map: Map<string, Date>, url: string, date: Date) {
  const prev = map.get(url);
  if (!prev || date > prev) map.set(url, date);
}

/** One post as the sitemap index needs it: its route id and normalized metadata. */
export type SitemapPostEntry = { postId: string; meta: PostMeta };

/**
 * Builds the sitemap index from already-normalized posts.
 *
 * Exported separately from the filesystem walk so the attribution rules can be
 * tested against fixtures. The real content set cannot demonstrate the
 * language-policy fix on its own: it only bites when the newest post is
 * Spanish, which is not true today.
 */
export function buildSitemapIndex(
  entries: SitemapPostEntry[],
  options: { now?: Date } = {},
): SitemapMeta {
  const now = options.now ?? new Date();
  const byGroup = new Map<string, Array<{ lang: string; url: string }>>();
  const lastmodByUrl = new Map<string, Date>();
  const tagPostCount = new Map<string, number>();

  for (const { postId, meta } of entries) {
    if (!isPublicMeta(meta, { now })) continue;

    const lastmod = lastmodForMeta(meta);
    if (!lastmod) continue;

    const url = canonicalPostUrl(postId);

    // Every public post has its own page, in either language.
    lastmodByUrl.set(url, lastmod);

    // Listing pages and feeds are English-only. Bumping them for a Spanish post
    // told crawlers an English-only listing had changed when it had not.
    if (isListingEligibleMeta(meta, { now })) {
      for (const listingPath of LISTING_PATHS) {
        bumpLastmod(lastmodByUrl, sitemapPageUrl(listingPath), lastmod);
      }

      if (isRecipeId(postId)) {
        bumpLastmod(lastmodByUrl, sitemapPageUrl('/recipes'), lastmod);
      } else {
        for (const listingPath of FEED_PATHS) {
          bumpLastmod(lastmodByUrl, sitemapPageUrl(listingPath), lastmod);
        }
        for (const listingPath of ESSAY_LISTING_PATHS) {
          bumpLastmod(lastmodByUrl, sitemapPageUrl(listingPath), lastmod);
        }

        // Individual category and tag pages list essays, not recipes, on the
        // same rules as their index pages above.
        for (const category of meta.category) {
          bumpLastmod(lastmodByUrl, sitemapPageUrl(`/category/${category}`), lastmod);
        }
        for (const tag of canonicalizeTags(meta.tags)) {
          bumpLastmod(lastmodByUrl, sitemapPageUrl(`/tag/${tag}`), lastmod);
          tagPostCount.set(tag, (tagPostCount.get(tag) ?? 0) + 1);
        }
      }
    }

    if (!meta.translationGroup) continue;

    const list = byGroup.get(meta.translationGroup) ?? [];
    list.push({ lang: isSpanishPrimaryMeta(meta) ? 'es' : 'en', url });
    byGroup.set(meta.translationGroup, list);
  }

  const linksByCanonicalUrl = new Map<string, SitemapLangLink[]>();
  for (const members of byGroup.values()) {
    if (members.length < 2) continue;
    const links: SitemapLangLink[] = members.map((m) => ({
      url: m.url,
      lang: HREFLANG_BY_LANG[m.lang] || m.lang,
    }));
    for (const member of members) {
      linksByCanonicalUrl.set(member.url, links);
    }
  }

  return { linksByCanonicalUrl, lastmodByUrl, tagPostCount };
}

/** Reads the content directory and builds the index from it, once. */
function loadSitemapMeta(): SitemapMeta {
  if (sitemapMeta) return sitemapMeta;

  const entries: SitemapPostEntry[] = [];
  for (const file of walkMarkdownFiles(CONTENT_DIR)) {
    const data = parseFrontmatter(fs.readFileSync(file, 'utf8'));
    if (!data) continue;
    entries.push({ postId: postIdFromFile(file), meta: normalizePostMeta(data) });
  }

  sitemapMeta = buildSitemapIndex(entries);
  return sitemapMeta;
}

/**
 * Build sitemap xhtml:link clusters for posts that share a translationGroup.
 * Paths are slug-based (not `/es/...` prefixes), so @astrojs/sitemap's `i18n`
 * option cannot infer pairs — we attach `links` in serialize instead.
 */
export function getSitemapTranslationLinksByUrl(): Map<string, SitemapLangLink[]> {
  return loadSitemapMeta().linksByCanonicalUrl;
}

/**
 * lastmod per sitemap URL: post `updatedDate` or `pubDate`; listing pages use
 * the newest related post so crawlers see real content changes, not build time.
 */
export function getSitemapLastmodByUrl(): Map<string, Date> {
  return loadSitemapMeta().lastmodByUrl;
}

/** True when a tag page should be hidden from search engines (see TAG_INDEX_MIN_POSTS). */
export function isThinTag(tag: string): boolean {
  return (loadSitemapMeta().tagPostCount.get(tag) ?? 0) < TAG_INDEX_MIN_POSTS;
}

/** isThinTag for a sitemap URL; false for anything that is not a tag page. */
export function isThinTagUrl(pageUrl: string): boolean {
  const match = new URL(pageUrl).pathname.match(/^\/tag\/([^/]+)\/?$/);
  return match ? isThinTag(decodeURIComponent(match[1])) : false;
}
