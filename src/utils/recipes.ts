import type { CollectionEntry } from 'astro:content';
import { isPublicPost } from './publishFilters';

/** Recipe posts live under `src/content/p/recipes/` and ship at `/p/recipes/<slug>`. */
export function isRecipePost(post: Pick<CollectionEntry<'blog'>, 'id'>): boolean {
  return post.id === 'recipes' || post.id.startsWith('recipes/');
}

/**
 * Other public recipes, newest first.
 * Does not include cooking essays. Returns [] when this is the only recipe.
 */
export function findMoreRecipes(
  currentPost: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
  maxCount: number = 4,
): CollectionEntry<'blog'>[] {
  return allPosts
    .filter(
      (post) =>
        post.id !== currentPost.id &&
        isRecipePost(post) &&
        isPublicPost(post.data, { includeFuture: true }),
    )
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, maxCount);
}
