/**
 * Framework-independent publication rules.
 *
 * This is the single definition of "is this post public", "is it Spanish", and
 * "does it belong in English listings and feeds". It is plain JavaScript with
 * JSDoc types on purpose, so that all four consumers can share one
 * implementation:
 *
 * - `src/utils/publishFilters.ts`, over `astro:content` collection entries
 * - `src/utils/sitemapTranslations.ts`, over raw frontmatter at config-load time
 *   when `astro:content` is not available
 * - `scripts/lib/generated-content-checks.mjs`, run by plain Node after a build
 * - anything else that needs the rules without an Astro runtime
 *
 * Before this module those were three separate implementations that had already
 * drifted. Nothing here may import `astro:content`, Vite's `import.meta.env`, or
 * anything else that would break `astro.config.mjs` at load time. Rules that
 * genuinely depend on the environment — the dev-mode draft preview in
 * `isCollectionListed` — stay in `publishFilters.ts`.
 *
 * @typedef {object} PostMeta
 * @property {boolean} draft
 * @property {boolean} published
 * @property {Date | null} pubDate
 * @property {Date | null} updatedDate
 * @property {string[]} language
 * @property {string[]} category
 * @property {string[]} tags
 * @property {string | null} translationGroup
 *
 * @typedef {object} EligibilityOptions
 * @property {Date} [now] Override "now" for tests and deterministic builds.
 * @property {boolean} [includeFuture] Include posts embargoed by a future pubDate.
 */

/** @param {unknown} value @returns {Date | null} */
export function toDate(value) {
  if (value instanceof Date) return Number.isNaN(value.valueOf()) ? null : value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.valueOf()) ? null : parsed;
  }
  return null;
}

/** @param {unknown} value @returns {string[]} */
export function toStringArray(value) {
  if (typeof value === 'string') return value ? [value] : [];
  if (!Array.isArray(value)) return [];
  return value.filter((entry) => typeof entry === 'string' && entry.length > 0);
}

/**
 * Normalizes either a collection entry's `data` or raw YAML frontmatter into one
 * shape. Collection entries arrive with real `Date` objects; frontmatter read
 * from disk arrives as strings or as js-yaml `Date`s.
 *
 * @param {Record<string, unknown>} raw
 * @returns {PostMeta}
 */
export function normalizePostMeta(raw) {
  const source = raw ?? {};
  return {
    draft: source.draft === true,
    published: source.published !== false,
    pubDate: toDate(source.pubDate),
    updatedDate: toDate(source.updatedDate),
    language: toStringArray(source.language),
    category: toStringArray(source.category),
    tags: toStringArray(source.tags),
    translationGroup:
      typeof source.translationGroup === 'string' && source.translationGroup
        ? source.translationGroup
        : null,
  };
}

/**
 * Publicly live: not a draft, not unpublished, not embargoed by a future date.
 *
 * @param {PostMeta} meta
 * @param {EligibilityOptions} [options]
 */
export function isPublicMeta(meta, options = {}) {
  if (meta.draft) return false;
  if (!meta.published) return false;
  if (options.includeFuture) return true;
  if (meta.pubDate && meta.pubDate > (options.now ?? new Date())) return false;
  return true;
}

/**
 * True when the post's primary language is Spanish. Only the first entry
 * counts: `['en', 'es']` is an English post that mentions Spanish.
 *
 * @param {PostMeta} meta
 */
export function isSpanishPrimaryMeta(meta) {
  return (meta.language[0] ?? 'en') === 'es';
}

/**
 * Feeds carry public English posts only. Spanish stays reachable through the
 * language toggle, search, SEO, and its direct URL.
 *
 * @param {PostMeta} meta
 * @param {EligibilityOptions} [options]
 */
export function isFeedEligibleMeta(meta, options = {}) {
  return isPublicMeta(meta, options) && !isSpanishPrimaryMeta(meta);
}

/**
 * English listing surfaces: Everything, category, tag, Cookbook, Guided Path,
 * the homepage, and 404. Same rule as feeds, named separately because the two
 * policies are allowed to diverge later.
 *
 * @param {PostMeta} meta
 * @param {EligibilityOptions} [options]
 */
export function isListingEligibleMeta(meta, options = {}) {
  return isPublicMeta(meta, options) && !isSpanishPrimaryMeta(meta);
}

/**
 * The date a crawler should treat as this post's last modification.
 *
 * @param {PostMeta} meta
 * @returns {Date | null}
 */
export function lastmodForMeta(meta) {
  return meta.updatedDate ?? meta.pubDate;
}
