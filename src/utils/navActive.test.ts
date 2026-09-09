import { describe, expect, it } from 'vitest';
import { mainNavigation } from '../data/navigation';
import { collectionLinks } from '../data/readerNavigation';
import {
  getNavLinkCurrent,
  isMainNavItemActive,
  isNavDropdownItemActive,
  normalizePathname,
} from './navActive';

describe('desktop navigation destinations', () => {
  it('puts the full archive first and keeps reader groups separate from site tools', () => {
    expect(mainNavigation.map((item) => item.label)).toEqual([
      'Everything',
      'Guided Path',
      'Browse',
      'Collections',
      'About',
    ]);
    expect(mainNavigation.find((item) => item.label === 'Browse')?.dropdown?.items).toEqual([
      { href: '/tag', label: 'Topics' },
      { href: '/category', label: 'Categories' },
    ]);
    expect(mainNavigation.find((item) => item.label === 'Collections')?.dropdown?.items).toBe(
      collectionLinks,
    );
    const destinations = mainNavigation.flatMap((item) =>
      item.dropdown ? item.dropdown.items.map((child) => child.href) : [item.href],
    );
    expect(new Set(destinations).size).toBe(destinations.length);
    expect(destinations).not.toContain('/writing-insights');
    expect(destinations).not.toContain('/tag-management');
  });
});

describe('main navigation groups', () => {
  it.each([
    ['/everything', 'Everything'],
    ['/everything/', 'Everything'],
    ['/guided-path', 'Guided Path'],
    ['/tag', 'Browse'],
    ['/tag/parenting', 'Browse'],
    ['/category', 'Browse'],
    ['/category/parenting/', 'Browse'],
    ['/books', 'Collections'],
    ['/books/a-picture-book', 'Collections'],
    ['/recipes', 'Collections'],
    ['/p/recipes/sofrito-en/', 'Collections'],
    ['/library/books', 'Collections'],
    ['/library/books/a-book', 'Collections'],
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
    '/writing-insights',
    '/writing-insights/data',
    '/tag-management',
    '/tag-management/audit',
    '/brain-science',
    '/p/the-feeling-is-not-the-problem',
    '/category-administration',
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
    ['/everything', '/everything/', 'page'],
    ['/tag', '/category', undefined],
    ['/books', '/recipes', undefined],
    ['/books', '/library/books', undefined],
    ['/library/books', '/books', undefined],
    ['/recipes', '/p/a-regular-essay', undefined],
    ['/category/art', '/category/artistic-expression', undefined],
    ['/everything', '/everything-else', undefined],
  ] as const)('gives %s on %s the correct current value', (href, pathname, current) => {
    expect(getNavLinkCurrent(href, pathname)).toBe(current);
    expect(isNavDropdownItemActive(href, pathname)).toBe(current !== undefined);
  });

  it('keeps mobile site-tool links independent from Topics', () => {
    expect(isNavDropdownItemActive('/writing-insights', '/writing-insights/data')).toBe(true);
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
