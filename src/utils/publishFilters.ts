import type { CollectionEntry } from 'astro:content';

type PostData = CollectionEntry<'blog'>['data'];

export interface PublishFilterOptions {
  /** Override "now" for tests / deterministic builds. */
  now?: Date;
  /**
   * When true, include posts with future pubDate (dev preview / scheduled drafts).
   * Production defaults to excluding them (embargo until pubDate).
   */
  includeFuture?: boolean;
}

/** Post is publicly live: not draft, not unpublished, and not embargoed by pubDate. */
export function isPublicPost(data: PostData, options: PublishFilterOptions = {}): boolean {
  if (data.draft) return false;
  if (data.published === false) return false;

  const includeFuture = options.includeFuture ?? false;
  if (!includeFuture && data.pubDate > (options.now ?? new Date())) return false;

  return true;
}

/**
 * Astro content-collection filter for production vs development.
 * Dev shows everything; prod requires a publicly live post.
 * Post pages use this so Spanish URLs still resolve.
 */
export function isCollectionPublic(data: PostData, options: PublishFilterOptions = {}): boolean {
  if (!import.meta.env.PROD) return true;
  return isPublicPost(data, options);
}

/** True when the post's primary language is Spanish. */
export function isSpanishPrimary(data: PostData): boolean {
  return (data.language?.[0] ?? 'en') === 'es';
}

/**
 * translationGroup values that have a public Spanish sibling.
 * Used so English listing cards can show an ES marker without linking to Spanish.
 */
export function spanishTwinGroupsFromPosts(posts: { data: PostData }[]): Set<string> {
  const groups = new Set<string>();
  for (const post of posts) {
    const group = post.data.translationGroup;
    if (!group) continue;
    if (!isPublicPost(post.data)) continue;
    if (isSpanishPrimary(post.data)) groups.add(group);
  }
  return groups;
}

/** Homepage Highlights: featured English posts that are publicly live. */
export function isHomepageHighlight(data: PostData, options: PublishFilterOptions = {}): boolean {
  if (isSpanishPrimary(data)) return false;
  return data.featured === true && isPublicPost(data, options);
}

/**
 * Feed eligibility: public English posts only.
 * Spanish stays reachable via language toggle, title search, SEO, and direct URL.
 */
export function isFeedEligiblePost(data: PostData, options: PublishFilterOptions = {}): boolean {
  if (!isPublicPost(data, options)) return false;
  return !isSpanishPrimary(data);
}

/**
 * Listing eligibility: public English posts only.
 * Spanish does not appear on Everything, category, tag, 404, or Guided Path.
 */
export function isListingEligiblePost(data: PostData, options: PublishFilterOptions = {}): boolean {
  if (!isPublicPost(data, options)) return false;
  return !isSpanishPrimary(data);
}

/**
 * Search eligibility: public posts in any language.
 * Title search is an allowed path to Spanish; listings are not.
 */
export function isSearchEligiblePost(data: PostData, options: PublishFilterOptions = {}): boolean {
  return isPublicPost(data, options);
}

/**
 * Guided Path is English-primary: never list Spanish posts.
 * Spanish versions stay reachable from the language toggle on the English note.
 * Unlike `isCollectionListed`, this language rule applies in both prod and dev.
 */
export function isGuidedPathEligiblePost(
  data: PostData,
  options: PublishFilterOptions = {},
): boolean {
  if (isSpanishPrimary(data)) return false;
  return isCollectionListed(data, options);
}

/**
 * Archive-style surfaces: hide Spanish in both prod and dev.
 * Dev still shows English drafts; prod requires a publicly live English post.
 */
export function isCollectionListed(data: PostData, options: PublishFilterOptions = {}): boolean {
  if (isSpanishPrimary(data)) return false;
  if (!import.meta.env.PROD) return true;
  return isPublicPost(data, options);
}

export type ContentLanguageMeta = {
  htmlLang: 'en' | 'es';
  contentLanguage: 'en' | 'es';
  ogLocale: 'en_US' | 'es_ES';
  inLanguage: 'en-US' | 'es-ES';
};

/** Map post `language` frontmatter to HTML / Open Graph / JSON-LD language tags. */
export function resolveContentLanguage(language?: string[]): ContentLanguageMeta {
  const primary = language?.[0] === 'es' ? 'es' : 'en';
  if (primary === 'es') {
    return {
      htmlLang: 'es',
      contentLanguage: 'es',
      ogLocale: 'es_ES',
      inLanguage: 'es-ES',
    };
  }
  return {
    htmlLang: 'en',
    contentLanguage: 'en',
    ogLocale: 'en_US',
    inLanguage: 'en-US',
  };
}
