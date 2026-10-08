import type { TocItem } from '../types/layout';
import { stripHeadingMarkup } from './headingText';

/**
 * Build the post TOC from Astro's rendered headings.
 *
 * Those slugs are the `id` values on the page. A second slugger that strips
 * accents, `&`, and emoji produces links that do not exist.
 */
export function tableOfContentsFromHeadings(
  headings: ReadonlyArray<{ depth: number; slug: string; text: string }>,
): TocItem[] {
  const items = headings
    .filter((heading) => heading.depth === 2 || heading.depth === 3)
    .map((heading) => ({
      text: stripHeadingMarkup(heading.text),
      slug: heading.slug,
      level: heading.depth,
    }))
    .filter((item) => item.text.length > 0 && item.slug.length > 0);

  if (items.length === 0) return [];

  return [{ text: 'Top', slug: 'post-top', level: 1 }, ...items];
}
