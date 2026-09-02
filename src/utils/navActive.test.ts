import { describe, expect, it } from 'vitest';
import { isMainNavItemActive, isNavDropdownItemActive } from './navActive';

describe('isMainNavItemActive', () => {
  it('marks Categories only for category pages', () => {
    expect(isMainNavItemActive('/category', '/category')).toBe(true);
    expect(isMainNavItemActive('/category', '/category/parenting')).toBe(true);
    expect(isMainNavItemActive('/category', '/everything')).toBe(false);
    expect(isMainNavItemActive('/category', '/p/the-feeling-is-not-the-problem')).toBe(false);
  });

  it('marks Resources for Everything, the cookbook, and recipe posts', () => {
    expect(isMainNavItemActive('/tag', '/everything')).toBe(true);
    expect(isMainNavItemActive('/tag', '/recipes')).toBe(true);
    expect(isMainNavItemActive('/tag', '/p/recipes/sofrito-en')).toBe(true);
    expect(isMainNavItemActive('/tag', '/p/the-feeling-is-not-the-problem')).toBe(false);
    expect(isMainNavItemActive('/tag', '/category')).toBe(false);
  });
});

describe('isNavDropdownItemActive', () => {
  it('marks Everything only on the archive page', () => {
    expect(isNavDropdownItemActive('/everything', '/everything')).toBe(true);
    expect(isNavDropdownItemActive('/everything', '/p/the-feeling-is-not-the-problem')).toBe(false);
    expect(isNavDropdownItemActive('/everything', '/category')).toBe(false);
  });

  it('marks Cookbook for /recipes and recipe posts', () => {
    expect(isNavDropdownItemActive('/recipes', '/recipes')).toBe(true);
    expect(isNavDropdownItemActive('/recipes', '/p/recipes/sofrito-en')).toBe(true);
    expect(isNavDropdownItemActive('/recipes', '/library/books')).toBe(false);
  });
});
