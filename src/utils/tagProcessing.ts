import type { CollectionEntry } from 'astro:content';
import { getTagWeight, getTagCategory, type TagCategory } from '../data/tags';
import { canonicalizeTag, canonicalizeTags, isContentFormTag } from './tagVocabulary';
import { isPublicPost, isSpanishPrimary } from './publishFilters';
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
 * Find public English writings on a shared subject, excluding the current work's translations.
 * Form labels alone are not a subject match; recency and featured status only rank real matches.
 */
export function findRelatedPosts(
  currentPost: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
  maxCount: number = 3,
): CollectionEntry<'blog'>[] {
  if (maxCount <= 0) return [];

  const now = new Date();
  const currentGroup = currentPost.data.translationGroup;
  const availablePosts = allPosts.filter(
    (post) =>
      post.id !== currentPost.id &&
      (!currentGroup || post.data.translationGroup !== currentGroup) &&
      !isRecipePost(post) &&
      !isSpanishPrimary(post.data) &&
      isPublicPost(post.data, { now }),
  );

  if (availablePosts.length === 0) return [];

  const currentPostTags = canonicalizeTags(currentPost.data.tags).filter(
    (tag) => !isContentFormTag(tag),
  );
  // Score posts based on multiple factors
  const scoredPosts = availablePosts.map((post) => {
    let score = 0;
    const candidateTags = canonicalizeTags(post.data.tags);
    const commonTags = currentPostTags.filter((tag) => candidateTags.includes(tag));
    const commonCategories = (currentPost.data.category ?? []).filter((category) =>
      post.data.category?.includes(category),
    );
    const isRelated = commonTags.length > 0 || commonCategories.length > 0;

    // Tag similarity (highest weight)
    if (commonTags.length > 0) {
      score += commonTags.length * 10; // 10 points per common tag

      // Bonus for high-weight tags
      commonTags.forEach((tag) => {
        score += getTagWeight(tag);
      });
    }

    // Category similarity
    score += commonCategories.length * 5; // 5 points per common category

    // Recency bonus (newer posts get slight preference)
    const daysSincePublished = Math.floor(
      (now.valueOf() - post.data.pubDate.valueOf()) / (1000 * 60 * 60 * 24),
    );
    if (daysSincePublished <= 30)
      score += 2; // Recent posts get bonus
    else if (daysSincePublished <= 90) score += 1; // Semi-recent posts get small bonus

    // Featured posts get bonus
    if (post.data.featured) score += 3;

    return { post, score, isRelated };
  });

  // Sort by score (highest first), then by date for ties
  const sortedPosts = scoredPosts
    .filter((item) => item.isRelated)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (
        b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf() ||
        a.post.id.localeCompare(b.post.id)
      );
    })
    .map((item) => item.post);

  return sortedPosts.slice(0, maxCount);
}
