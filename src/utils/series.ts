import type { CollectionEntry } from 'astro:content';
import { isSpanishPrimary } from './publishFilters';

type Post = Pick<CollectionEntry<'blog'>, 'id' | 'data'>;

/**
 * The posts of one series in reading order, in one language: an English post
 * lists the English parts, a Spanish twin the Spanish ones. `seriesOrder` wins,
 * then publication date.
 */
export function seriesPosts<T extends Post>(posts: T[], seriesId: string, spanish = false): T[] {
  return posts
    .filter((post) => post.data.series === seriesId && isSpanishPrimary(post.data) === spanish)
    .sort((a, b) => {
      const orderA = a.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      return a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
    });
}

/** Where a post sits in its series, or null when it has none or stands alone. */
export function seriesPosition<T extends Post>(post: T, posts: T[]) {
  if (!post.data.series) return null;
  const parts = seriesPosts(posts, post.data.series, isSpanishPrimary(post.data));
  const index = parts.findIndex((p) => p.id === post.id);
  if (index < 0 || parts.length < 2) return null;
  return {
    seriesId: post.data.series,
    index,
    total: parts.length,
    previous: parts[index - 1] ?? null,
    next: parts[index + 1] ?? null,
  };
}
