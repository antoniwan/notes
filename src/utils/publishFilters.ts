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
 */
export function isCollectionPublic(data: PostData, options: PublishFilterOptions = {}): boolean {
  if (!import.meta.env.PROD) return true;
  return isPublicPost(data, options);
}

/**
 * Feed eligibility: public posts only; exclude secondary-language translations
 * (typically Spanish with featured: false) so feeds stay primary-language.
 */
export function isFeedEligiblePost(data: PostData, options: PublishFilterOptions = {}): boolean {
  if (!isPublicPost(data, options)) return false;
  return !isSecondaryLanguageTranslation(data);
}

/**
 * Listing / search eligibility: same language policy as feeds.
 * Secondary-language translations stay reachable via direct URL + language toggle
 * (post pages still use `isCollectionPublic`), but do not appear in archives,
 * category/tag indexes, guided path, or search.
 */
export function isListingEligiblePost(data: PostData, options: PublishFilterOptions = {}): boolean {
  if (!isPublicPost(data, options)) return false;
  return !isSecondaryLanguageTranslation(data);
}

/**
 * Guided Path is English-primary: never list Spanish posts (featured or not).
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
 * Dev shows everything; prod uses listing eligibility (public ∧ not secondary translation).
 * Prefer this over `isCollectionPublic` for archive-style surfaces.
 */
export function isCollectionListed(data: PostData, options: PublishFilterOptions = {}): boolean {
  if (!import.meta.env.PROD) return true;
  return isListingEligiblePost(data, options);
}

function isSpanishPrimary(data: PostData): boolean {
  return (data.language?.[0] ?? 'en') === 'es';
}

/** Secondary translation: primary language is Spanish and not featured. */
function isSecondaryLanguageTranslation(data: PostData): boolean {
  return isSpanishPrimary(data) && data.featured === false;
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
