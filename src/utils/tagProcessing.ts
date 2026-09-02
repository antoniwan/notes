import type { CollectionEntry } from 'astro:content';
import { getTagWeight, getTagCategory, type TagCategory } from '../data/tags';
import { canonicalizeTag, canonicalizeTags } from './tagVocabulary';
import { isPublicPost } from './publishFilters';
import { isRecipePost } from './recipes';

/**
 * Calculate tag statistics across all posts
 */
export function calculateTagStats(posts: CollectionEntry<'blog'>[]) {
  const tagCounts: Record<string, number> = {};
  const tagWeights: Record<string, number> = {};

  posts.forEach((post) => {
    canonicalizeTags(post.data.tags).forEach((tag) => {
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

export { getTagWeight };

/**
 * Related tags ranked by co-occurrence on the same posts, not site-wide popularity.
 */
export function getRelatedTags(
  targetTag: string,
  posts: CollectionEntry<'blog'>[],
  maxCount: number = 8,
): Array<{ tag: string; count: number }> {
  const canonicalTargetTag = canonicalizeTag(targetTag);
  const coCounts: Record<string, number> = {};

  posts.forEach((post) => {
    const tags = canonicalizeTags(post.data.tags);
    if (!tags.includes(canonicalTargetTag)) return;
    tags.forEach((tag) => {
      if (tag === canonicalTargetTag) return;
      coCounts[tag] = (coCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(coCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, maxCount);
}

/**
 * Get all unique tags from posts
 */
export function getAllUniqueTags(posts: CollectionEntry<'blog'>[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post) => {
    canonicalizeTags(post.data.tags).forEach((tag) => tags.add(tag));
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
  const canonicalTag = canonicalizeTag(tag);
  return posts
    .filter((post) => canonicalizeTags(post.data.tags).includes(canonicalTag))
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
  const canonicalTag = canonicalizeTag(tag);
  const tagPosts = filterPostsByTag(posts, canonicalTag);
  const relatedTags = getRelatedTags(canonicalTag, posts);
  const category = getTagCategory(canonicalTag);

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
  // Filter out the current post and non-public posts
  const availablePosts = allPosts.filter(
    (post) =>
      post.id !== currentPost.id &&
      !isRecipePost(post) &&
      isPublicPost(post.data, { includeFuture: true }),
  );

  if (availablePosts.length === 0) return [];

  const currentPostTags = canonicalizeTags(currentPost.data.tags);
  // Score posts based on multiple factors
  const scoredPosts = availablePosts.map((post) => {
    let score = 0;
    const candidateTags = canonicalizeTags(post.data.tags);

    // Tag similarity (highest weight)
    if (currentPostTags.length > 0 && candidateTags.length > 0) {
      const commonTags = currentPostTags.filter((tag) => candidateTags.includes(tag));
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
