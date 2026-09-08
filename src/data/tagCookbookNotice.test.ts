import { describe, expect, it } from 'vitest';
import { COOKBOOK_NOTICE_TAGS, tagHasCookbookNotice } from './tagCookbookNotice';

describe('tagHasCookbookNotice', () => {
  it('marks the kitchen doors that look like a recipe shelf', () => {
    expect(COOKBOOK_NOTICE_TAGS).toEqual(['recipes', 'cooking', 'food']);
    expect(tagHasCookbookNotice('recipes')).toBe(true);
    expect(tagHasCookbookNotice('cooking')).toBe(true);
    expect(tagHasCookbookNotice('food')).toBe(true);
  });

  it('leaves other rooms alone', () => {
    expect(tagHasCookbookNotice('nutrition')).toBe(false);
    expect(tagHasCookbookNotice('parenting')).toBe(false);
  });
});
