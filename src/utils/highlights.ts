import { getCollection, type CollectionEntry } from 'astro:content';
import { categories } from '../data/categories';
import { isHomepageHighlight } from './publishFilters';

/**
 * Get homepage highlights for "All":
 * - Posts with featured: true
 * - Public only (published, not draft, pubDate not in the future)
 * - Sorted by pubDate (newest first)
 */
export async function getHighlights(): Promise<CollectionEntry<'blog'>[]> {
  const highlightedPosts = await getCollection('blog', ({ data }) => isHomepageHighlight(data));
  return highlightedPosts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * Get highlights per category for filtering.
 * Only categories that have at least one highlight are included.
 */
export async function getHighlightsByCategory(): Promise<
  Record<string, CollectionEntry<'blog'>[]>
> {
  const highlightedPosts = await getCollection('blog', ({ data }) => isHomepageHighlight(data));
  const byCategory: Record<string, CollectionEntry<'blog'>[]> = {};

  for (const cat of categories) {
    const inCategory = highlightedPosts
      .filter((p) => (p.data.category || []).includes(cat.id))
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
    if (inCategory.length > 0) {
      byCategory[cat.id] = inCategory;
    }
  }

  return byCategory;
}
