/**
 * Sitemap translation clusters for slug-based EN/ES pairs.
 *
 * Uses filesystem frontmatter (not `astro:content`) so this module can be
 * imported from `astro.config.mjs` at config-load time.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { SITE_URL } from '../consts';

export type SitemapLangLink = { url: string; lang: string };

const HREFLANG_BY_LANG: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
};

const CONTENT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../content/p');

let linksByCanonicalUrl: Map<string, SitemapLangLink[]> | null = null;

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

function isPublicFrontmatter(data: Record<string, unknown>, now = new Date()): boolean {
  if (data.draft === true) return false;
  if (data.published === false) return false;
  if (data.pubDate) {
    const pub = data.pubDate instanceof Date ? data.pubDate : new Date(String(data.pubDate));
    if (!Number.isNaN(pub.valueOf()) && pub > now) return false;
  }
  return true;
}

function postIdFromFile(file: string): string {
  const base = path.basename(file);
  return base.replace(/\.(md|mdx)$/i, '');
}

function canonicalPostUrl(id: string): string {
  return new URL(`/p/${id}`, SITE_URL).href.replace(/\/$/, '');
}

/**
 * Build sitemap xhtml:link clusters for posts that share a translationGroup.
 * Paths are slug-based (not `/es/...` prefixes), so @astrojs/sitemap's `i18n`
 * option cannot infer pairs — we attach `links` in serialize instead.
 */
export function getSitemapTranslationLinksByUrl(): Map<string, SitemapLangLink[]> {
  if (linksByCanonicalUrl) return linksByCanonicalUrl;

  const byGroup = new Map<string, Array<{ lang: string; url: string }>>();
  const now = new Date();

  for (const file of walkMarkdownFiles(CONTENT_DIR)) {
    const raw = fs.readFileSync(file, 'utf8');
    const data = parseFrontmatter(raw);
    if (!data || !isPublicFrontmatter(data, now)) continue;

    const group = data.translationGroup;
    if (typeof group !== 'string' || !group) continue;

    const language = data.language;
    const lang =
      Array.isArray(language) && language[0] === 'es'
        ? 'es'
        : typeof language === 'string' && language === 'es'
          ? 'es'
          : 'en';

    const url = canonicalPostUrl(postIdFromFile(file));
    const list = byGroup.get(group) ?? [];
    list.push({ lang, url });
    byGroup.set(group, list);
  }

  const map = new Map<string, SitemapLangLink[]>();
  for (const members of byGroup.values()) {
    if (members.length < 2) continue;
    const links: SitemapLangLink[] = members.map((m) => ({
      url: m.url,
      lang: HREFLANG_BY_LANG[m.lang] || m.lang,
    }));
    for (const member of members) {
      map.set(member.url, links);
    }
  }

  linksByCanonicalUrl = map;
  return map;
}
