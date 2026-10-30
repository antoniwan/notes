import { STRIPPED_TAGS, TAG_ALIAS_MAP } from '../data/tagVocabulary';
import { buildCookbookRedirects } from '../data/cookbook';
import { TAG_PAGE_HISTORY } from '../data/tagPageHistory';
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
  // October 28, 2026: Field Guide entries that said almost the same thing were merged.
  '/field-guide/concepts/say-do-coherence': '/field-guide/values/integrity',
  '/es/guia-de-campo/conceptos/coherencia-entre-decir-y-hacer':
    '/es/guia-de-campo/valores/integridad',
  '/field-guide/concepts/mastering-laziness': '/field-guide/concepts/efficiency-or-laziness',
  '/es/guia-de-campo/conceptos/dominar-la-vagancia':
    '/es/guia-de-campo/conceptos/eficiencia-o-vagancia',
  '/field-guide/concepts/radical-acceptance': '/field-guide/concepts/savage-acceptance',
  '/es/guia-de-campo/conceptos/la-aceptacion-radical':
    '/es/guia-de-campo/conceptos/aceptacion-salvaje',
  '/field-guide/concepts/the-first-hard-wall': '/field-guide/concepts/hard-and-soft-limits',
  '/es/guia-de-campo/conceptos/la-primera-pared-dura':
    '/es/guia-de-campo/conceptos/limites-duros-y-blandos',
  '/field-guide/concepts/peace-vs-happiness': '/field-guide/concepts/happiness',
  '/es/guia-de-campo/conceptos/paz-y-felicidad': '/es/guia-de-campo/conceptos/la-felicidad',
  '/field-guide/concepts/happiness-as-coherence': '/field-guide/concepts/happiness',
  '/es/guia-de-campo/conceptos/la-felicidad-como-coherencia':
    '/es/guia-de-campo/conceptos/la-felicidad',
  '/field-guide/concepts/moments-of-happiness': '/field-guide/concepts/happiness',
  '/es/guia-de-campo/conceptos/momentos-de-felicidad': '/es/guia-de-campo/conceptos/la-felicidad',
  '/field-guide/concepts/contempt-as-an-exit-from-grief': '/field-guide/concepts/contempt',
  '/es/guia-de-campo/conceptos/el-desprecio-como-salida-del-duelo':
    '/es/guia-de-campo/conceptos/el-desprecio',
};

/**
 * Where a tag goes when it has no page: the A to Z topic index on Browse, which opens
 * its fold for this hash.
 */
export const TAG_INDEX_PATH = '/browse#topics';

/**
 * Tags no post carries any more, sent to the tag that took their posts. A tag that
 * empties without an entry here still redirects, to the topic index (see TAG_PAGE_HISTORY).
 * Each entry steps aside if the tag gets a page again.
 */
export const RETIRED_TAG_REDIRECTS: Record<string, string> = {
  // October 30, 2026 retag (7.15.0).
  'crimson-desert': '/tag/gaming',
  dispatch: '/tag/gaming',
  diaspora: '/tag/puerto-rico',
  discipline: '/tag/self-control',
  psychology: '/category/psychology',
};

/** A successor tag that has no page itself falls back to the topic index. */
function liveTagTarget(target: string, builtTags: ReadonlySet<string>): string {
  const match = target.match(/^\/tag\/([^/#]+)$/);
  return match && !builtTags.has(match[1]) ? TAG_INDEX_PATH : target;
}

/**
 * Redirects for every tag URL without a page, so a tag URL never 404s:
 * - stripped tags go to the topic index;
 * - aliases go to their canonical tag;
 * - tags in TAG_PAGE_HISTORY that no post carries any more go to their successor in
 *   RETIRED_TAG_REDIRECTS, or else to the topic index.
 * Keys are normalized URL slugs (spaces → hyphens).
 */
export function buildTagAliasRedirects(
  builtTags: ReadonlySet<string> = getBuiltTagSlugs(),
): Record<string, string> {
  const redirects: Record<string, string> = {};

  for (const stripped of STRIPPED_TAGS) {
    redirects[`/tag/${stripped}`] = TAG_INDEX_PATH;
  }

  for (const [alias, canonical] of Object.entries(TAG_ALIAS_MAP)) {
    const aliasSlug = normalizeTagInput(alias);
    if (!aliasSlug || !canonical || aliasSlug === canonical) continue;
    redirects[`/tag/${aliasSlug}`] = liveTagTarget(`/tag/${canonical}`, builtTags);
  }

  const retired = new Set([...TAG_PAGE_HISTORY, ...Object.keys(RETIRED_TAG_REDIRECTS)]);
  for (const tag of retired) {
    const path = `/tag/${tag}`;
    if (builtTags.has(tag) || redirects[path]) continue;
    redirects[path] = liveTagTarget(RETIRED_TAG_REDIRECTS[tag] ?? TAG_INDEX_PATH, builtTags);
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
