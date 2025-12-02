import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Get highlights dynamically:
 * - Only posts with featured: true
 * - Excludes drafts (and unpublished in production)
 * - Sorted by pubDate (newest first)
 * - Limited to the latest 9 posts
 */
export async function getHighlights(): Promise<CollectionEntry<'blog'>[]> {
  const featuredPosts = await getCollection('blog', ({ data }) => {
    if (import.meta.env.PROD) {
      return !data.draft && data.published !== false && data.featured === true;
    }

    return data.featured === true;
  });

  const sortedByDate = featuredPosts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return sortedByDate.slice(0, 9);
}
