import { getBuiltTagSlugs } from './sitemapTranslations';
import { canonicalizeTag } from './tagVocabulary';

/** `/tag/<slug>` when that page is built; otherwise null so chips do not 404. */
export function tagPageHref(tag: string): string | null {
  const slug = canonicalizeTag(tag);
  if (!slug) return null;
  return getBuiltTagSlugs().has(slug) ? `/tag/${slug}` : null;
}
