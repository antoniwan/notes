import type { CollectionEntry } from 'astro:content';
import { isListingEligiblePost, isPublicPost } from './publishFilters';

/** Recipe posts live under `src/content/p/recipes/` and ship at `/p/recipes/<slug>`. */
export function isRecipeId(id: string): boolean {
  return id === 'recipes' || id.startsWith('recipes/');
}

export function isRecipePost(post: Pick<CollectionEntry<'blog'>, 'id'>): boolean {
  return isRecipeId(post.id);
}

/** English, public recipes for the cookbook index. */
export function isCookbookListedPost(post: Pick<CollectionEntry<'blog'>, 'id' | 'data'>): boolean {
  return isRecipePost(post) && isListingEligiblePost(post.data);
}

export function recipeContentsLetter(title: string): string {
  const ch = title.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(ch) ? ch : '#';
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
  const currentLang = currentPost.data.language?.[0] ?? 'en';
  const currentGroup = currentPost.data.translationGroup;

  return allPosts
    .filter((post) => {
      if (post.id === currentPost.id) return false;
      if (!isRecipePost(post)) return false;
      if (!isPublicPost(post.data, { includeFuture: true })) return false;
      const lang = post.data.language?.[0] ?? 'en';
      if (lang !== currentLang) return false;
      if (currentGroup && post.data.translationGroup === currentGroup) return false;
      return true;
    })
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, maxCount);
}
