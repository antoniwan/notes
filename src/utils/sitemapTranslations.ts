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
import yaml from 'js-yaml';
import { SITE_URL } from '../consts';
import { canonicalizeTags } from './tagVocabulary';

export type SitemapLangLink = { url: string; lang: string };

const HREFLANG_BY_LANG: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
};

const CONTENT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../content/p');

const LISTING_PATHS = [
  '/',
  '/everything',
  '/guided-path',
  '/category',
  '/tag',
  '/rss.xml',
  '/feed.json',
];

type SitemapMeta = {
  linksByCanonicalUrl: Map<string, SitemapLangLink[]>;
  lastmodByUrl: Map<string, Date>;
};

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
    const data = yaml.load(block);
    return data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.valueOf()) ? null : value;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.valueOf()) ? null : d;
  }
  return null;
}

function isPublicFrontmatter(data: Record<string, unknown>, now = new Date()): boolean {
  if (data.draft === true) return false;
  if (data.published === false) return false;
  const pub = parseDate(data.pubDate);
  if (pub && pub > now) return false;
  return true;
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

function asStringArray(value: unknown): string[] {
  if (typeof value === 'string' && value) return [value];
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string' && v.length > 0);
}

function postLang(data: Record<string, unknown>): string {
  const language = data.language;
  if (Array.isArray(language) && language[0] === 'es') return 'es';
  if (typeof language === 'string' && language === 'es') return 'es';
  return 'en';
}

function bumpLastmod(map: Map<string, Date>, url: string, date: Date) {
  const prev = map.get(url);
  if (!prev || date > prev) map.set(url, date);
}

function loadSitemapMeta(): SitemapMeta {
  if (sitemapMeta) return sitemapMeta;

  const byGroup = new Map<string, Array<{ lang: string; url: string }>>();
  const lastmodByUrl = new Map<string, Date>();
  const now = new Date();

  for (const file of walkMarkdownFiles(CONTENT_DIR)) {
    const raw = fs.readFileSync(file, 'utf8');
    const data = parseFrontmatter(raw);
    if (!data || !isPublicFrontmatter(data, now)) continue;

    const lastmod = parseDate(data.updatedDate) ?? parseDate(data.pubDate);
    if (!lastmod) continue;

    const url = canonicalPostUrl(postIdFromFile(file));
    lastmodByUrl.set(url, lastmod);

    for (const listingPath of LISTING_PATHS) {
      bumpLastmod(lastmodByUrl, sitemapPageUrl(listingPath), lastmod);
    }

    for (const category of asStringArray(data.category)) {
      bumpLastmod(lastmodByUrl, sitemapPageUrl(`/category/${category}`), lastmod);
    }

    for (const tag of canonicalizeTags(asStringArray(data.tags))) {
      bumpLastmod(lastmodByUrl, sitemapPageUrl(`/tag/${tag}`), lastmod);
    }

    const group = data.translationGroup;
    if (typeof group !== 'string' || !group) continue;

    const list = byGroup.get(group) ?? [];
    list.push({ lang: postLang(data), url });
    byGroup.set(group, list);
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

  sitemapMeta = { linksByCanonicalUrl, lastmodByUrl };
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
