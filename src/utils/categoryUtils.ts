import { categories, type Category } from '../data/categories';

type Language = 'en' | 'es';

function displayName(category: Category, language: Language): string {
  return language === 'es' ? category.nameEs : category.name;
}

export interface CategoryDisplayItem {
  id: string;
  name: string;
  icon?: string;
}

/**
 * Resolve a single category ID to its display name.
 * Returns the category name if found, otherwise the raw id (for unknown IDs), or null if no id.
 */
export function getCategoryName(id: string | undefined, language: Language = 'en'): string | null {
  if (id == null || id === '') return null;
  const category = categories.find((cat) => cat.id === id);
  return category ? displayName(category, language) : id;
}

/**
 * Resolve the first category ID from an array to its display name.
 * Returns the category name if found, otherwise the raw id, or null if array is empty/undefined.
 */
export function getCategoryNameFromIds(
  ids: string[] | undefined,
  language: Language = 'en',
): string | null {
  if (!ids || ids.length === 0) return null;
  return getCategoryName(ids[0], language);
}

/**
 * Resolve all category IDs to display items while preserving incoming order.
 * Unknown IDs are preserved with their raw ID as display name.
 */
export function getCategoryDisplayItems(
  ids: string[] | undefined,
  language: Language = 'en',
): CategoryDisplayItem[] {
  if (!ids || ids.length === 0) return [];

  return ids.map((id) => {
    const category = categories.find((cat) => cat.id === id);
    return {
      id,
      name: category ? displayName(category, language) : id,
      icon: category?.icon,
    };
  });
}
