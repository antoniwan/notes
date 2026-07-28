import { TAG_ALIAS_MAP } from '../data/tagVocabulary';
import { normalizeTagInput } from './tagVocabulary';

/** Paths that should never appear in the sitemap or be indexed. */
export const SEO_EXCLUDED_PATHS = [
  '/tag-management',
  '/sitemap.xml',
  '/api',
  '/brain-science',
  '/brain-science/insights',
  '/brain-science/cadence',
  '/brain-science/evolution',
  '/brain-science/topics',
  '/brain-science/patterns',
  '/brain-science/meta',
] as const;

/** Soft-deleted or renamed posts → permanent replacements. */
export const POST_REDIRECTS: Record<string, string> = {
  '/p/it-isnt-too-much-pressure': '/p/on-parental-pressure',
  '/p/fasting-ground-flow': '/p/fasting-metabolic-ritual',
  '/p/core-values-freedom': '/p/the-definition-and-practice-of-my-core-values-make-me-free',
  '/p/reflexion-palabras-transformacion': '/tag/transformation',
};

/**
 * Build permanent redirects from tag aliases to their canonical tag pages.
 * Keys are normalized URL slugs (spaces → hyphens).
 */
export function buildTagAliasRedirects(): Record<string, string> {
  const redirects: Record<string, string> = {};

  for (const [alias, canonical] of Object.entries(TAG_ALIAS_MAP)) {
    const aliasSlug = normalizeTagInput(alias);
    if (!aliasSlug || !canonical || aliasSlug === canonical) continue;
    redirects[`/tag/${aliasSlug}`] = `/tag/${canonical}`;
  }

  return redirects;
}

export function buildSeoRedirects(): Record<string, string> {
  const redirects: Record<string, string> = {
    ...buildTagAliasRedirects(),
    ...POST_REDIRECTS,
  };

  // Trailing-slash variants for renamed posts only (tag aliases already collide
  // with static `/tag/[tag]` routes under trailingSlash: 'never').
  for (const [from, to] of Object.entries(POST_REDIRECTS)) {
    if (from !== '/' && !from.endsWith('/')) {
      redirects[`${from}/`] = to;
    }
  }

  return redirects;
}

/** Normalize a pathname for comparison (no trailing slash except root). */
export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

/** Whether a fully-qualified page URL belongs in the public sitemap. */
export function shouldIncludeInSitemap(pageUrl: string): boolean {
  let pathname: string;
  try {
    pathname = normalizePathname(new URL(pageUrl).pathname);
  } catch {
    return false;
  }

  if ((SEO_EXCLUDED_PATHS as readonly string[]).includes(pathname)) return false;

  // Individual tag URLs are thin/duplicate-prone; keep only the tag index.
  // Canonical tag pages remain crawlable via internal links.
  if (pathname.startsWith('/tag/') && pathname !== '/tag') return false;

  return true;
}
