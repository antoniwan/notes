/** Normalize trailing slashes without changing the root pathname. */
export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

function isWithin(pathname: string, root: string): boolean {
  return pathname === root || pathname.startsWith(`${root}/`);
}

function isRecipeUrl(pathname: string): boolean {
  return isWithin(pathname, '/recipes') || isWithin(pathname, '/p/recipes');
}

/** Top-level groups are distinct from their individual destination links. */
export function isMainNavItemActive(href: string, pathname: string): boolean {
  const p = normalizePathname(pathname);
  const h = normalizePathname(href);

  if (h === '/books') {
    return isWithin(p, '/books') || isWithin(p, '/library/books') || isRecipeUrl(p);
  }

  return isNavDropdownItemActive(h, p);
}

/** Destination matching is shared with mobile navigation, including its site tools. */
export function isNavDropdownItemActive(itemHref: string, pathname: string): boolean {
  const p = normalizePathname(pathname);
  const h = normalizePathname(itemHref);

  if (h === '/recipes') return isRecipeUrl(p);
  // Browse is the section for every topic and category page.
  if (h === '/browse')
    return isWithin(p, '/browse') || isWithin(p, '/tag') || isWithin(p, '/category');

  const sections = ['/tag', '/category', '/books', '/library/books', '/tag-management'];
  if (sections.some((section) => isWithin(h, section))) return isWithin(p, h);

  return p === h;
}

/** A section link remains current on descendants without claiming to be that page. */
export function getNavLinkCurrent(href: string, pathname: string): 'page' | 'location' | undefined {
  if (!isNavDropdownItemActive(href, pathname)) return undefined;
  return normalizePathname(href) === normalizePathname(pathname) ? 'page' : 'location';
}
