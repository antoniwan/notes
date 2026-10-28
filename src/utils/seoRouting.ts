import { STRIPPED_TAGS, TAG_ALIAS_MAP } from '../data/tagVocabulary';
import { buildCookbookRedirects } from '../data/cookbook';
import { getBuiltTagSlugs } from './sitemapTranslations';
import { normalizeTagInput } from './tagVocabulary';

/** Paths that should never appear in the sitemap or be indexed. */
export const SEO_EXCLUDED_PATHS = ['/sitemap.xml', '/api'] as const;

/** Writing Insights and its origin note, Brain Science, were removed on October 20, 2026: they were
 * not for readers. Every page they had goes home. */
const RETIRED_INSIGHTS_PAGES = [
  '',
  '/insights',
  '/cadence',
  '/evolution',
  '/topics',
  '/patterns',
  '/meta',
];
export const RETIRED_INSIGHTS_REDIRECTS: Record<string, string> = Object.fromEntries(
  ['/writing-insights', '/brain-science'].flatMap((base) =>
    RETIRED_INSIGHTS_PAGES.map((page) => [base + page, '/']),
  ),
);

/** Soft-deleted or renamed posts → permanent replacements. */
export const POST_REDIRECTS: Record<string, string> = {
  '/p/it-isnt-too-much-pressure': '/p/on-parental-pressure',
  '/p/fasting-ground-flow': '/p/fasting-metabolic-ritual',
  '/p/core-values-freedom': '/p/the-definition-and-practice-of-my-core-values-make-me-free',
  '/p/faces-of-death': '/p/thou-shalt-not-kill',
  '/p/lemon-pepper-chicken': 'https://cookbook.antoniwan.online/recipes/lemon-pepper-chicken',
};

/** Non-post URL moves (indexes, tags, retired pages). */
export const PAGE_REDIRECTS: Record<string, string> = {
  '/p/reflexion-palabras-transformacion': '/tag/transformation',
  '/library': 'https://antoniwan.online/collections/books',
  '/library/books': 'https://antoniwan.online/collections/books',
  '/books': 'https://antoniwan.online/projects',
  '/tag/recipes': '/tag/cooking',
  // October 20, 2026: Notes is for reading and searching. Everything is the Archive; Topics and
  // Categories are one Browse page; Guided Path is gone, and Browse is where to start.
  '/everything': '/archive',
  '/tag': '/browse',
  '/category': '/browse',
  '/guided-path': '/browse',
  // Tag Management was an author overview of tag usage, not for readers.
  '/tag-management': '/browse',
  // October 28, 2026: Honor the flame folded into Honesty as how I practice it.
  '/field-guide/values/honor-the-flame': '/field-guide/values/honesty',
  '/es/guia-de-campo/valores/honrar-la-llama': '/es/guia-de-campo/valores/honestidad',
};

/**
 * Build permanent redirects from tag aliases to their canonical tag pages.
 * Keys are normalized URL slugs (spaces → hyphens).
 * If the canonical page is not built, send the alias to `/browse` instead of a 404.
 */
export function buildTagAliasRedirects(
  builtTags: ReadonlySet<string> = getBuiltTagSlugs(),
): Record<string, string> {
  const redirects: Record<string, string> = {};

  for (const stripped of STRIPPED_TAGS) {
    redirects[`/tag/${stripped}`] = '/browse';
  }

  for (const [alias, canonical] of Object.entries(TAG_ALIAS_MAP)) {
    const aliasSlug = normalizeTagInput(alias);
    if (!aliasSlug || !canonical || aliasSlug === canonical) continue;
    const target = builtTags.has(canonical) ? `/tag/${canonical}` : '/browse';
    redirects[`/tag/${aliasSlug}`] = target;
  }

  return redirects;
}

export function buildSeoRedirects(): Record<string, string> {
  return {
    ...buildTagAliasRedirects(),
    ...POST_REDIRECTS,
    ...PAGE_REDIRECTS,
    ...RETIRED_INSIGHTS_REDIRECTS,
    ...buildCookbookRedirects(),
  };
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
  if (buildCookbookRedirects()[pathname]) return false;
  if (['/books', '/library', '/library/books', '/tag/recipes'].includes(pathname)) return false;

  return true;
}
