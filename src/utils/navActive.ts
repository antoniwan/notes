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
 * Resources nav groups tag index, tag detail pages, writing-insights, the
 * /brain-science origin note, tag-management, library books, and the cookbook.
 */
function isRecipeUrl(p: string): boolean {
  return p === '/recipes' || p.startsWith('/p/recipes/') || p === '/p/recipes';
}

function isUnderResourcesSection(p: string): boolean {
  if (p === '/tag' || (p.startsWith('/tag/') && !p.startsWith('/tag-management'))) {
    return true;
  }
  if (p === '/tag-management' || p.startsWith('/tag-management/')) return true;
  if (p === '/writing-insights' || p.startsWith('/writing-insights/')) return true;
  if (p === '/brain-science' || p.startsWith('/brain-science/')) return true;
  if (p === '/library/books' || p.startsWith('/library/books/')) return true;
  if (isRecipeUrl(p)) return true;
  return false;
}

function isUnderPostsSection(p: string): boolean {
  if (p === '/everything') return true;
  if (isRecipeUrl(p)) return false;
  return p.startsWith('/p/');
}

/**
 * Whether the top-level main nav item should show the active state.
 */
export function isMainNavItemActive(href: string, pathname: string): boolean {
  const p = normalizePathname(pathname);
  const h = normalizePathname(href);

  if (h === '/category') {
    return isUnderCategory(p);
  }

  if (h === '/tag') {
    return isUnderResourcesSection(p);
  }

  if (h === '/everything') {
    return isUnderPostsSection(p);
  }

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

  if (h === '/writing-insights') {
    return p === '/writing-insights' || p.startsWith('/writing-insights/');
  }

  if (h.startsWith('/category/')) {
    return p === h || p.startsWith(`${h}/`);
  }

  if (h === '/library/books') {
    return p === '/library/books' || p.startsWith('/library/books/');
  }

  if (h === '/recipes') {
    return isRecipeUrl(p);
  }

  return p === h;
}
