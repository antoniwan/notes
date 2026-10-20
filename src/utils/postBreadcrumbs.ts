import { generateCanonicalUrl } from './seo';

export type VisualBreadcrumbItem = {
  label: string;
  href?: string;
};

/**
 * The trail for a post's BreadcrumbList JSON-LD. The page shows no breadcrumb row:
 * the logo is Home, the eyebrow is the category, the H1 is the title.
 */
export function buildPostBreadcrumbItems(input: {
  title: string;
  isSpanish: boolean;
  primaryCategory: { id: string; name: string } | null;
}): VisualBreadcrumbItem[] {
  const { title, isSpanish, primaryCategory } = input;

  return [
    { label: isSpanish ? 'Inicio' : 'Home', href: '/' },
    ...(primaryCategory
      ? [{ label: primaryCategory.name, href: `/category/${primaryCategory.id}` }]
      : []),
    { label: title },
  ];
}

/** Map crumbs to schema.org items. The current page fills in the last URL. */
export function breadcrumbItemsForSchema(
  items: VisualBreadcrumbItem[],
  currentUrl: string,
): Array<{ name: string; url: string }> {
  return items.map((item) => ({
    name: item.label,
    url: item.href ? generateCanonicalUrl(item.href) : currentUrl,
  }));
}
