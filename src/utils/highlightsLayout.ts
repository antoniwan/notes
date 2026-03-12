import type { CollectionEntry } from 'astro:content';

/**
 * Desktop-only row types for a 12-column grid.
 * 2 equal | 2 with emphasis (left/right) | 3 equal | 3 with emphasis (1st/2nd/3rd)
 *
 * The "emphasis" patterns keep the favored column slightly smaller than before
 * (e.g. 8/4 → 7/5) so the layout feels more balanced when one column is highlighted.
 */
const ROW_TYPES: number[][] = [
  [6, 6],       // 2 equal
  [7, 5],       // 2 emphasis left (slightly reduced)
  [5, 7],       // 2 emphasis right (slightly reduced)
  [4, 4, 4],    // 3 equal
  [6, 3, 3],    // 3 emphasis 1st
  [3, 6, 3],    // 3 emphasis 2nd
  [3, 3, 6],    // 3 emphasis 3rd
];

export interface LayoutSlot {
  post: CollectionEntry<'blog'>;
  rowIndex: number;
  colStart: number;
  span: number;
}

/**
 * Fill rows using the fixed row types; cycle through types for variety.
 * Returns one slot per post with grid placement (1-based colStart, span).
 */
export function buildHighlightsLayout(posts: CollectionEntry<'blog'>[]): LayoutSlot[] {
  const slots: LayoutSlot[] = [];
  let postIndex = 0;
  let rowIndex = 0;

  while (postIndex < posts.length) {
    const typeIndex = rowIndex % ROW_TYPES.length;
    const spans = ROW_TYPES[typeIndex];
    let colStart = 1;

    for (const span of spans) {
      if (postIndex >= posts.length) break;
      slots.push({
        post: posts[postIndex],
        rowIndex,
        colStart,
        span,
      });
      postIndex += 1;
      colStart += span;
    }
    rowIndex += 1;
  }

  return slots;
}

export { ROW_TYPES };
