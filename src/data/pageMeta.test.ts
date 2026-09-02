import { describe, expect, it } from 'vitest';
import { SITE_DESCRIPTION } from '../consts';
import { categories } from './categories';
import { CATEGORY_META, PAGE_META, categoryMetaDescription, tagMetaDescription } from './pageMeta';
import { META_DESCRIPTION_MAX_LENGTH } from '../utils/seo';

describe('PAGE_META', () => {
  const values = Object.values(PAGE_META);

  it('keeps every static page description unique', () => {
    expect(new Set(values).size).toBe(values.length);
  });

  it('does not reuse the site-wide default', () => {
    for (const description of values) {
      expect(description).not.toBe(SITE_DESCRIPTION);
      expect(description.length).toBeGreaterThan(20);
    }
  });

  it('describes /tag as an idea map, not an inventory', () => {
    expect(PAGE_META['/tag'].toLowerCase()).toContain('idea map');
    expect(PAGE_META['/tag']).not.toMatch(/discover content/i);
  });

  it('stays within the SEO length budget', () => {
    for (const [path, description] of Object.entries(PAGE_META)) {
      expect(description.length, path).toBeLessThanOrEqual(META_DESCRIPTION_MAX_LENGTH);
    }
  });
});

describe('categoryMetaDescription', () => {
  it('covers every category id with unique copy', () => {
    const descriptions = categories.map(categoryMetaDescription);
    expect(new Set(descriptions).size).toBe(categories.length);
    for (const category of categories) {
      expect(CATEGORY_META[category.id], category.id).toBeDefined();
    }
    for (const description of descriptions) {
      expect(description).not.toBe(SITE_DESCRIPTION);
      expect(description.length).toBeGreaterThan(20);
      expect(description.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX_LENGTH);
    }
  });
});

describe('tagMetaDescription', () => {
  it('leads with the tag blurb when one exists', () => {
    const description = tagMetaDescription('fatherhood', 12);
    expect(description).toMatch(/12 notes/i);
    expect(description.toLowerCase()).toContain('father');
    expect(description).not.toMatch(/tagged with/i);
    expect(description).not.toBe(SITE_DESCRIPTION);
  });

  it('uses singular copy for a single note', () => {
    expect(tagMetaDescription('healing', 1)).toBe(
      'Getting well after what hurt. 1 note in the archive.',
    );
  });

  it('names the room once when there is no blurb', () => {
    expect(tagMetaDescription('limits', 3)).toBe('3 notes on Limits in the Notes archive.');
  });

  it('keeps blurb meta descriptions inside the SEO budget', () => {
    for (const tag of ['emotional-regulation', 'systemic-critique', 'conscious-parenting']) {
      expect(tagMetaDescription(tag, 99).length, tag).toBeLessThanOrEqual(
        META_DESCRIPTION_MAX_LENGTH,
      );
    }
  });
});
