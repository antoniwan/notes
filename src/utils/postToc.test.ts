import { describe, expect, it } from 'vitest';
import { tableOfContentsFromHeadings } from './postToc';

describe('tableOfContentsFromHeadings', () => {
  it('keeps Astro slugs, including accents, and prepends Top', () => {
    expect(
      tableOfContentsFromHeadings([
        { depth: 1, slug: 'title', text: 'Title' },
        { depth: 2, slug: 'cómo-proteger', text: 'Cómo proteger' },
        { depth: 3, slug: 'límites', text: 'Límites' },
      ]),
    ).toEqual([
      { text: 'Top', slug: 'post-top', level: 1 },
      { text: 'Cómo proteger', slug: 'cómo-proteger', level: 2 },
      { text: 'Límites', slug: 'límites', level: 3 },
    ]);
  });

  it('drops h1 and empty labels, and skips a heading with no slug', () => {
    expect(
      tableOfContentsFromHeadings([
        { depth: 1, slug: 'essay', text: 'Essay' },
        { depth: 2, slug: '', text: 'No id' },
        { depth: 2, slug: 'ok', text: 'Ok' },
      ]),
    ).toEqual([
      { text: 'Top', slug: 'post-top', level: 1 },
      { text: 'Ok', slug: 'ok', level: 2 },
    ]);
  });

  it('returns nothing when there are no h2 or h3 headings', () => {
    expect(tableOfContentsFromHeadings([{ depth: 1, slug: 'only', text: 'Only' }])).toEqual([]);
  });
});
