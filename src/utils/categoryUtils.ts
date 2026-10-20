import { categories } from '../data/categories';

export interface CategoryDisplayItem {
  id: string;
  name: string;
  icon?: string;
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

/**
 * Resolve all category IDs to display items while preserving incoming order.
 * Unknown IDs are preserved with their raw ID as display name.
 */
export function getCategoryDisplayItems(ids: string[] | undefined): CategoryDisplayItem[] {
  if (!ids || ids.length === 0) return [];

  return ids.map((id) => {
    const category = categories.find((cat) => cat.id === id);
    return {
      id,
      name: category ? category.name : id,
      icon: category?.icon,
    };
  });
}
