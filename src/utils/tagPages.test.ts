import { describe, expect, it } from 'vitest';
import { tagPageHref } from './tagPages';

describe('tagPageHref', () => {
  it('links cooking essays without a retired recipe shelf', () => {
    expect(tagPageHref('cooking')).toBe('/tag/cooking');
    expect(tagPageHref('recipes')).toBeNull();
  });

  it('returns null for a slug with no tag page', () => {
    expect(tagPageHref('definitely-not-a-built-tag-page')).toBeNull();
    expect(tagPageHref('')).toBeNull();
  });
});
