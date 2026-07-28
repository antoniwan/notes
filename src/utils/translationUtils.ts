import { type CollectionEntry, getCollection } from 'astro:content';
import { isPublicPost } from './publishFilters';

export interface Translation {
  id: string;
  title: string;
  language: string[];
  path: string;
}

/**
 * Find all translations for a given translation group
 * @param translationGroup - The translation group identifier
 * @param allPosts - All blog posts (optional, will fetch if not provided)
 * @returns Array of translation objects
 */
export async function findTranslations(
  translationGroup: string | undefined,
  allPosts?: CollectionEntry<'blog'>[],
): Promise<Translation[]> {
  if (!translationGroup) {
    return [];
  }

  // Fetch posts if not provided
  if (!allPosts) {
    allPosts = await getCollection('blog');
  }

  // Filter posts by translation group and only include published posts
  const translations = allPosts
    .filter((post) => post.data.translationGroup === translationGroup && isPublicPost(post.data))
    .map((post) => ({
      id: post.id,
      title: post.data.title,
      language: post.data.language || ['en'],
      path: `/p/${post.id}`,
    }));

  return translations;
}

/**
 * Get the current post's language
 * @param post - The current blog post
 * @returns The primary language code
 */
export function getCurrentLanguage(post: CollectionEntry<'blog'>): string {
  return post.data.language?.[0] || 'en';
}

/**
 * Check if a post has translations available
 * @param translationGroup - The translation group identifier
 * @param allPosts - All blog posts (optional, will fetch if not provided)
 * @returns True if translations exist (more than 1 post in the group)
 */
export async function hasTranslations(
  translationGroup: string | undefined,
  allPosts?: CollectionEntry<'blog'>[],
): Promise<boolean> {
  const translations = await findTranslations(translationGroup, allPosts);
  return translations.length > 1;
}

/**
 * Get translation data for use in components
 * @param currentPost - The current blog post
 * @param allPosts - All blog posts (optional, will fetch if not provided)
 * @returns Object with translations, current language, and current path
 */
export async function getTranslationData(
  currentPost: CollectionEntry<'blog'>,
  allPosts?: CollectionEntry<'blog'>[],
) {
  const translations = await findTranslations(currentPost.data.translationGroup, allPosts);
  const currentLanguage = getCurrentLanguage(currentPost);
  const currentPath = `/p/${currentPost.id}`;

  return {
    translations,
    currentLanguage,
    currentPath,
    hasTranslations: translations.length > 1,
  };
}
