import { describe, expect, it } from 'vitest';
import { mainNavigation } from '../data/navigation';
import {
  getNavLinkCurrent,
  isMainNavItemActive,
  isNavDropdownItemActive,
  normalizePathname,
} from './navActive';

describe('desktop navigation destinations', () => {
  it('is three plain links, reading first, and keeps site tools out', () => {
    expect(mainNavigation.map((item) => item.label)).toEqual(['Archive', 'Browse', 'About']);
    expect(mainNavigation.every((item) => !item.dropdown)).toBe(true);
    const destinations = mainNavigation.flatMap((item) =>
      item.dropdown ? item.dropdown.items.map((child) => child.href) : [item.href],
    );
    expect(new Set(destinations).size).toBe(destinations.length);
    expect(destinations).not.toContain('/tag-management');
  });
});

describe('main navigation groups', () => {
  it.each([
    ['/archive', 'Archive'],
    ['/archive/', 'Archive'],
    ['/browse', 'Browse'],
    ['/browse/', 'Browse'],
    ['/tag/parenting', 'Browse'],
    ['/category', 'Browse'],
    ['/category/parenting/', 'Browse'],
    ['/about', 'About'],
  ])('marks exactly the intended group for %s', (pathname, label) => {
    expect(
      mainNavigation
        .filter((item) => isMainNavItemActive(item.href, pathname))
        .map((item) => item.label),
    ).toEqual([label]);
  });

  it.each([
    '/',
    '/tag-management',
    '/tag-management/audit',
    '/p/the-feeling-is-not-the-problem',
    '/category-administration',
    '/books',
    '/library/books',
    '/recipes',
    '/bookshelf',
    '/library/bookshelf',
    '/p/recipes-unrelated',
  ])('does not imply a reader group for %s', (pathname) => {
    expect(mainNavigation.some((item) => isMainNavItemActive(item.href, pathname))).toBe(false);
  });
});

describe('destination active states', () => {
  it.each([
    ['/category', '/category/parenting', 'location'],
    ['/tag', '/tag/fatherhood', 'location'],
    ['/books', '/books/a-picture-book', 'location'],
    ['/recipes', '/p/recipes/sofrito-en', 'location'],
    ['/library/books', '/library/books/a-book', 'location'],
    ['/recipes', '/recipes/', 'page'],
    ['/tag/', '/tag', 'page'],
    ['/archive', '/archive/', 'page'],
    ['/browse', '/browse', 'page'],
    ['/browse', '/tag/fatherhood', 'location'],
    ['/browse', '/category/parenting', 'location'],
    ['/tag', '/category', undefined],
    ['/books', '/recipes', undefined],
    ['/books', '/library/books', undefined],
    ['/library/books', '/books', undefined],
    ['/recipes', '/p/a-regular-essay', undefined],
    ['/category/art', '/category/artistic-expression', undefined],
    ['/archive', '/archive-else', undefined],
  ] as const)('gives %s on %s the correct current value', (href, pathname, current) => {
    expect(getNavLinkCurrent(href, pathname)).toBe(current);
    expect(isNavDropdownItemActive(href, pathname)).toBe(current !== undefined);
  });

  it('keeps mobile site-tool links independent from Topics', () => {
    expect(isNavDropdownItemActive('/tag-management', '/tag-management/audit')).toBe(true);
    expect(isNavDropdownItemActive('/tag', '/tag-management')).toBe(false);
    expect(isNavDropdownItemActive('/tag', '/tag-management/audit')).toBe(false);
  });

  it('preserves category-child matching and root normalization', () => {
    expect(isNavDropdownItemActive('/category/art', '/category/art/an-essay')).toBe(true);
    expect(normalizePathname('/')).toBe('/');
    expect(normalizePathname('')).toBe('/');
    expect(normalizePathname('/tag///')).toBe('/tag');
  });
});
