import type { CollectionEntry } from 'astro:content';
import {
  isCollectionListed,
  isFeedEligiblePost,
  type PublishFilterOptions,
} from './publishFilters';

/**
 * Recipe posts live under `src/content/p/recipes/`. They moved to cookbook.antoniwan.online: the
 * content loader skips them and `/p/recipes/*` redirects there. These rules still keep one off
 * every Notes listing if it ever reaches the build, and code that reads the folder from disk
 * (the sitemap, the generated-content checks) skips it by id.
 */
export function isRecipeId(id: string): boolean {
  return id === 'recipes' || id.startsWith('recipes/');
}

export function isRecipePost(post: Pick<CollectionEntry<'blog'>, 'id'>): boolean {
  return isRecipeId(post.id);
}

/** Browse, category and tag pages and counts: listed writings, not recipes. */
export function isCategoryListedPost(post: Pick<CollectionEntry<'blog'>, 'id' | 'data'>): boolean {
  return isCollectionListed(post.data) && !isRecipePost(post);
}

/** Same listing set as categories: essays only. */
export function isTagListedPost(post: Pick<CollectionEntry<'blog'>, 'id' | 'data'>): boolean {
  return isCategoryListedPost(post);
}

/** RSS and JSON Feed: public English essays. */
export function isFeedListedPost(
  post: Pick<CollectionEntry<'blog'>, 'id' | 'data'>,
  options: PublishFilterOptions = {},
): boolean {
  return isFeedEligiblePost(post.data, options) && !isRecipePost(post);
}
