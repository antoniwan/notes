/**
 * Normalize URL pathname for comparisons (trailing slashes, except root).
 */
export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

/** True when pathname is under /category (index or /category/slug). */
function isUnderCategory(p: string): boolean {
  return p === '/category' || p.startsWith('/category/');
}

/**
 * Resources nav groups tag index, tag detail pages, brain-science, tag-management,
 * library books, and API docs — not a single URL prefix.
 */
function isUnderResourcesSection(p: string): boolean {
  if (p === '/tag' || (p.startsWith('/tag/') && !p.startsWith('/tag-management'))) {
    return true;
  }
  if (p === '/tag-management' || p.startsWith('/tag-management/')) return true;
  if (p === '/brain-science' || p.startsWith('/brain-science/')) return true;
  if (p === '/library/books' || p.startsWith('/library/books/')) return true;
  if (p === '/api' || p.startsWith('/api/')) return true;
  return false;
}

/**
 * Whether the top-level main nav item should show the active state.
 */
export function isMainNavItemActive(href: string, pathname: string): boolean {
  const p = normalizePathname(pathname);

  if (href === '/category/') {
    return isUnderCategory(p);
  }

  if (href === '/tag/') {
    return isUnderResourcesSection(p);
  }

  const h = normalizePathname(href);
  return p === h;
}

const dropdownActiveClasses =
  'bg-[rgb(var(--color-accent))]/10 text-[rgb(var(--color-accent))] font-medium';

export { dropdownActiveClasses };

/**
 * Active state for a dropdown link (category slug, Resources sub-item, etc.).
 */
export function isNavDropdownItemActive(itemHref: string, pathname: string): boolean {
  const p = normalizePathname(pathname);
  const h = normalizePathname(itemHref);

  if (h === '/tag') {
    return p === '/tag' || (p.startsWith('/tag/') && !p.startsWith('/tag-management'));
  }

  if (h === '/brain-science') {
    return p === '/brain-science' || p.startsWith('/brain-science/');
  }

  if (h === '/api') {
    return p === '/api' || p.startsWith('/api/');
  }

  if (h.startsWith('/category/')) {
    return p === h || p.startsWith(`${h}/`);
  }

  if (h === '/library/books') {
    return p === '/library/books' || p.startsWith('/library/books/');
  }

  return p === h;
}
