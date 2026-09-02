import { describe, expect, it } from 'vitest';
import { isMainNavItemActive, isNavDropdownItemActive } from './navActive';

describe('isMainNavItemActive', () => {
  it('marks Posts for writings, not recipes', () => {
    expect(isMainNavItemActive('/everything', '/everything')).toBe(true);
    expect(isMainNavItemActive('/everything', '/p/the-feeling-is-not-the-problem')).toBe(true);
    expect(isMainNavItemActive('/everything', '/p/recipes/sofrito-en')).toBe(false);
    expect(isMainNavItemActive('/everything', '/recipes')).toBe(false);
  });

  it('marks Resources for the cookbook and recipe posts', () => {
    expect(isMainNavItemActive('/tag', '/recipes')).toBe(true);
    expect(isMainNavItemActive('/tag', '/p/recipes/sofrito-en')).toBe(true);
    expect(isMainNavItemActive('/tag', '/p/the-feeling-is-not-the-problem')).toBe(false);
  });
});

describe('isNavDropdownItemActive', () => {
  it('marks Cookbook for /recipes and recipe posts', () => {
    expect(isNavDropdownItemActive('/recipes', '/recipes')).toBe(true);
    expect(isNavDropdownItemActive('/recipes', '/p/recipes/sofrito-en')).toBe(true);
    expect(isNavDropdownItemActive('/recipes', '/library/books')).toBe(false);
  });
});
