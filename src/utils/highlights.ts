import { getCollection, type CollectionEntry } from 'astro:content';
import { categories } from '../data/categories';

const HIGHLIGHT_PREDICATE = ({ data }: { data: CollectionEntry<'blog'>['data'] }) => {
  const isHighlighted = data.featured === true || data.highlight === true;
  if (import.meta.env.PROD) {
    return !data.draft && data.published !== false && isHighlighted;
  }
  return isHighlighted;
};

/**
 * Get homepage highlights for "All":
 * - Posts with either featured: true OR highlight: true
 * - Sorted by pubDate (newest first)
 * - Returns between 8 and 12 posts (or fewer if not enough exist)
 */
export async function getHighlights(): Promise<CollectionEntry<'blog'>[]> {
  const highlightedPosts = await getCollection('blog', HIGHLIGHT_PREDICATE);
  const sorted = highlightedPosts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  return sorted.slice(0, 12);
}

const MAX_HIGHLIGHTS_PER_CATEGORY = 12;

/**
 * Get up to 12 highlights per category for filtering.
 * Only categories that have at least one highlight are included.
 */
export async function getHighlightsByCategory(): Promise<
  Record<string, CollectionEntry<'blog'>[]>
> {
  const highlightedPosts = await getCollection('blog', HIGHLIGHT_PREDICATE);
  const byCategory: Record<string, CollectionEntry<'blog'>[]> = {};

  for (const cat of categories) {
    const inCategory = highlightedPosts
      .filter((p) => (p.data.category || []).includes(cat.id))
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .slice(0, MAX_HIGHLIGHTS_PER_CATEGORY);
    if (inCategory.length > 0) {
      byCategory[cat.id] = inCategory;
    }
  }

  return byCategory;
}
