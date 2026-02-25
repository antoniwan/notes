import { getCollection } from 'astro:content';
import { categories } from '../data/categories';
import type { Category } from '../data/categories';

export interface CategoryWithCount extends Category {
  postCount: number;
}

/**
 * Resolve a single category ID to its display name.
 * Returns the category name if found, otherwise the raw id (for unknown IDs), or null if no id.
 */
export function getCategoryName(id: string | undefined): string | null {
  if (id == null || id === '') return null;
  const category = categories.find((cat) => cat.id === id);
  return category ? category.name : id;
}

/**
 * Resolve the first category ID from an array to its display name.
 * Returns the category name if found, otherwise the raw id, or null if array is empty/undefined.
 */
export function getCategoryNameFromIds(ids: string[] | undefined): string | null {
  if (!ids || ids.length === 0) return null;
  return getCategoryName(ids[0]);
}

export async function getSortedCategories(): Promise<CategoryWithCount[]> {
  // Get all posts
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  // Get post counts by category
  const postCounts = categories.reduce(
    (acc, category) => {
      acc[category.id] = posts.filter((post) => post.data.category?.includes(category.id)).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Sort categories by post count (most popular first) and filter out those with 0 posts
  return categories
    .filter((category) => postCounts[category.id] > 0)
    .sort((a, b) => postCounts[b.id] - postCounts[a.id])
    .map((category) => ({
      ...category,
      postCount: postCounts[category.id],
    }));
}
