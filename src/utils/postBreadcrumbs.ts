import { generateCanonicalUrl } from './seo';

export type VisualBreadcrumbItem = {
  label: string;
  href?: string;
};

/** Same trail the visible `<Breadcrumbs>` component renders on a post. */
export function buildPostBreadcrumbItems(input: {
  title: string;
  isRecipe: boolean;
  isSpanish: boolean;
  primaryCategory: { id: string; name: string } | null;
}): VisualBreadcrumbItem[] {
  const { title, isRecipe, isSpanish, primaryCategory } = input;

  return [
    { label: isSpanish ? 'Inicio' : 'Home', href: '/' },
    ...(isRecipe
      ? [{ label: isSpanish ? 'Recetario' : 'Cookbook', href: '/recipes' }]
      : primaryCategory
        ? [{ label: primaryCategory.name, href: `/category/${primaryCategory.id}` }]
        : []),
    { label: title },
  ];
}

/** Map visual crumbs to schema.org items. The current page fills in the last URL. */
export function breadcrumbItemsForSchema(
  items: VisualBreadcrumbItem[],
  currentUrl: string,
): Array<{ name: string; url: string }> {
  return items.map((item) => ({
    name: item.label,
    url: item.href ? generateCanonicalUrl(item.href) : currentUrl,
  }));
}
