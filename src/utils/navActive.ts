/** Normalize trailing slashes without changing the root pathname. */
export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

function isWithin(pathname: string, root: string): boolean {
  return pathname === root || pathname.startsWith(`${root}/`);
}

/** Top-level groups are distinct from their individual destination links. */
export function isMainNavItemActive(href: string, pathname: string): boolean {
  const p = normalizePathname(pathname);
  const h = normalizePathname(href);

  if (h === '/books') {
    return isWithin(p, '/books') || isWithin(p, '/library/books');
  }

  return isNavDropdownItemActive(h, p);
}

/** Destination matching is shared with mobile navigation. */
export function isNavDropdownItemActive(itemHref: string, pathname: string): boolean {
  const p = normalizePathname(pathname);
  const h = normalizePathname(itemHref);

  // Browse is the section for every topic, category, and post page.
  // A post has no breadcrumb row, so this is its "you are here".
  if (h === '/browse')
    return ['/browse', '/tag', '/category', '/p'].some((root) => isWithin(p, root));

  // The Field Guide holds its entries and its Spanish shelf.
  if (h === '/field-guide' || h === '/es/guia-de-campo')
    return ['/field-guide', '/es/guia-de-campo'].some((root) => isWithin(p, root));

  const sections = ['/tag', '/category'];
  if (sections.some((section) => isWithin(h, section))) return isWithin(p, h);

  return p === h;
}

/** A section link remains current on descendants without claiming to be that page. */
export function getNavLinkCurrent(href: string, pathname: string): 'page' | 'location' | undefined {
  if (!isNavDropdownItemActive(href, pathname)) return undefined;
  return normalizePathname(href) === normalizePathname(pathname) ? 'page' : 'location';
}
