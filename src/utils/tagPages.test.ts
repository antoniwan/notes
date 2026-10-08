import { describe, expect, it } from 'vitest';
import { tagPageHref } from './tagPages';

describe('tagPageHref', () => {
  it('links kitchen doors that always have a page', () => {
    expect(tagPageHref('cooking')).toBe('/tag/cooking');
    expect(tagPageHref('recipes')).toBe('/tag/recipes');
  });

  it('returns null for a slug with no tag page', () => {
    expect(tagPageHref('definitely-not-a-built-tag-page')).toBeNull();
    expect(tagPageHref('')).toBeNull();
  });
});
