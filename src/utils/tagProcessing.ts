import type { CollectionEntry } from 'astro:content';
import {
  MASLOW_CATEGORIES,
  getTagWeight,
  getTagCategory,
  type TagStats,
  type TagCategory,
} from '../data/tags';

/**
 * Calculate tag statistics across all posts
 */
export function calculateTagStats(posts: CollectionEntry<'blog'>[]) {
  const tagCounts: Record<string, number> = {};
  const tagWeights: Record<string, number> = {};

  posts.forEach((post) => {
    post.data.tags?.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      tagWeights[tag] = getTagWeight(tag);
    });
  });

  return {
    tagCounts,
    tagWeights,
    totalTags: Object.keys(tagCounts).length,
    totalTagInstances: Object.values(tagCounts).reduce((sum, count) => sum + count, 0),
  };
}

/**
 * Sort tags by importance (weight) and then alphabetically
 */
export function sortTagsByImportance(tags: string[]): string[] {
  return tags.sort((a, b) => {
    const weightA = getTagWeight(a);
    const weightB = getTagWeight(b);

    // Sort by weight first (descending)
    if (weightA !== weightB) {
      return weightB - weightA;
    }

    // Then alphabetically
    return a.localeCompare(b);
  });
}

/**
 * Get the most important tags for display, limited to maxCount
 */
export function getImportantTags(tags: string[], maxCount: number = 3): string[] {
  const sortedTags = sortTagsByImportance(tags);
  return sortedTags.slice(0, maxCount);
}

/**
 * Get recommended tags for a post based on its content and related posts
 */
export function getRecommendedTags(
  postTags: string[],
  allPosts: CollectionEntry<'blog'>[],
  maxCount: number = 5,
): string[] {
  // Get posts with similar tags
  const relatedPosts = allPosts.filter((post) =>
    post.data.tags?.some((tag) => postTags.includes(tag)),
  );

  // Count tag frequency in related posts
  const relatedTagCounts: Record<string, number> = {};
  relatedPosts.forEach((post) => {
    post.data.tags?.forEach((tag) => {
      if (!postTags.includes(tag)) {
        // Don't include tags already on the post
        relatedTagCounts[tag] = (relatedTagCounts[tag] || 0) + 1;
      }
    });
  });

  // Sort by frequency and weight
  const sortedRelatedTags = Object.entries(relatedTagCounts)
    .sort(([tagA], [tagB]) => {
      const weightA = getTagWeight(tagA);
      const weightB = getTagWeight(tagB);
      return weightB - weightA;
    })
    .map(([tag]) => tag);

  return sortedRelatedTags.slice(0, maxCount);
}

/**
 * Create tag data with size calculation for visual representation
 */
export function createTagData(
  tag: string,
  count: number,
  maxCount: number,
  minCount: number,
): TagStats {
  return {
    tag,
    count,
    size: Math.max(
      0.875,
      Math.min(2.5, 0.875 + ((count - minCount) / (maxCount - minCount)) * 1.625),
    ),
  };
}

/**
 * Categorize tags by Maslow's hierarchy
 */
export function categorizeTags(tagCounts: Record<string, number>): {
  categorized: Array<Omit<TagCategory, 'tags'> & { tags: TagStats[] }>;
  uncategorized: TagStats[];
} {
  const maxCount = Math.max(...Object.values(tagCounts));
  const minCount = Math.min(...Object.values(tagCounts));

  const categorized = MASLOW_CATEGORIES.map((category) => ({
    ...category,
    tags: Object.entries(tagCounts)
      .filter(([tag]) => category.tags.includes(tag))
      .map(([tag, count]) => createTagData(tag, count, maxCount, minCount))
      .sort((a, b) => b.count - a.count),
  }));

  const uncategorized = Object.entries(tagCounts)
    .filter(([tag]) => !MASLOW_CATEGORIES.some((cat) => cat.tags.includes(tag)))
    .map(([tag, count]) => createTagData(tag, count, maxCount, minCount))
    .sort((a, b) => b.count - a.count);

  return { categorized, uncategorized };
}

export { getTagWeight };

/**
 * Get related tags for a specific tag
 */
export function getRelatedTags(
  targetTag: string,
  posts: CollectionEntry<'blog'>[],
  maxCount: number = 8,
): Array<{ tag: string; count: number }> {
  // Get posts with the target tag
  const tagPosts = posts.filter((post) => post.data.tags?.includes(targetTag));

  // Get all tags from these posts
  const relatedTags = new Set<string>();
  tagPosts.forEach((post) => {
    post.data.tags?.forEach((tag) => {
      if (tag !== targetTag) relatedTags.add(tag);
    });
  });

  // Calculate tag counts across all posts
  const tagCounts = posts.reduce(
    (acc, post) => {
      post.data.tags?.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  // Return related tags with counts, sorted by frequency
  return Array.from(relatedTags)
    .map((tag) => ({ tag, count: tagCounts[tag] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxCount);
}

/**
 * Get all unique tags from posts
 */
export function getAllUniqueTags(posts: CollectionEntry<'blog'>[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.data.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
}

/**
 * Filter posts by tag
 */
export function filterPostsByTag(
  posts: CollectionEntry<'blog'>[],
  tag: string,
): CollectionEntry<'blog'>[] {
  return posts
    .filter((post) => post.data.tags?.includes(tag))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * Get tag statistics for a specific tag
 */
export function getTagStatistics(
  tag: string,
  posts: CollectionEntry<'blog'>[],
): {
  totalPosts: number;
  relatedTags: Array<{ tag: string; count: number }>;
  category?: TagCategory;
} {
  const tagPosts = filterPostsByTag(posts, tag);
  const relatedTags = getRelatedTags(tag, posts);
  const category = getTagCategory(tag);

  return {
    totalPosts: tagPosts.length,
    relatedTags,
    category,
  };
}

/**
 * Find related posts based on tag similarity, category, and recency
 */
export function findRelatedPosts(
  currentPost: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
  maxCount: number = 3,
): CollectionEntry<'blog'>[] {
  // Filter out the current post and draft posts
  const availablePosts = allPosts.filter((post) => post.id !== currentPost.id && !post.data.draft);

  if (availablePosts.length === 0) return [];

  // Score posts based on multiple factors
  const scoredPosts = availablePosts.map((post) => {
    let score = 0;

    // Tag similarity (highest weight)
    if (currentPost.data.tags && post.data.tags) {
      const commonTags = currentPost.data.tags.filter((tag) => post.data.tags!.includes(tag));
      score += commonTags.length * 10; // 10 points per common tag

      // Bonus for high-weight tags
      commonTags.forEach((tag) => {
        score += getTagWeight(tag);
      });
    }

    // Category similarity
    if (currentPost.data.category && post.data.category) {
      const commonCategories = currentPost.data.category.filter((cat) =>
        post.data.category!.includes(cat),
      );
      score += commonCategories.length * 5; // 5 points per common category
    }

    // Recency bonus (newer posts get slight preference)
    const daysSincePublished = Math.floor(
      (Date.now() - post.data.pubDate.valueOf()) / (1000 * 60 * 60 * 24),
    );
    if (daysSincePublished <= 30)
      score += 2; // Recent posts get bonus
    else if (daysSincePublished <= 90) score += 1; // Semi-recent posts get small bonus

    // Featured posts get bonus
    if (post.data.featured) score += 3;

    return { post, score };
  });

  // Sort by score (highest first), then by date for ties
  const sortedPosts = scoredPosts
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf();
    })
    .map((item) => item.post);

  return sortedPosts.slice(0, maxCount);
}
