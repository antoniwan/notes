import { STRIPPED_TAGS, TAG_ALIAS_MAP } from '../data/tagVocabulary';
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
  '/writing-insights',
  '/writing-insights/insights',
  '/writing-insights/cadence',
  '/writing-insights/evolution',
  '/writing-insights/topics',
  '/writing-insights/patterns',
  '/writing-insights/meta',
] as const;

/** Old dashboard subpaths → Writing Insights. `/brain-science` itself stays as the origin note. */
export const WRITING_INSIGHTS_REDIRECTS: Record<string, string> = {
  '/brain-science/insights': '/writing-insights/insights',
  '/brain-science/cadence': '/writing-insights/cadence',
  '/brain-science/evolution': '/writing-insights/evolution',
  '/brain-science/topics': '/writing-insights/topics',
  '/brain-science/patterns': '/writing-insights/patterns',
  '/brain-science/meta': '/writing-insights/meta',
};

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

  for (const stripped of STRIPPED_TAGS) {
    redirects[`/tag/${stripped}`] = '/tag';
  }

  for (const [alias, canonical] of Object.entries(TAG_ALIAS_MAP)) {
    const aliasSlug = normalizeTagInput(alias);
    if (!aliasSlug || !canonical || aliasSlug === canonical) continue;
    redirects[`/tag/${aliasSlug}`] = `/tag/${canonical}`;
  }

  return redirects;
}

export function buildSeoRedirects(): Record<string, string> {
  return {
    ...buildTagAliasRedirects(),
    ...POST_REDIRECTS,
    ...WRITING_INSIGHTS_REDIRECTS,
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

  return true;
}
