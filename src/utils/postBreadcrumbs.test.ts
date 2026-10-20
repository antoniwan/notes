import { describe, expect, it } from 'vitest';
import { SITE_URL } from '../consts';
import { generateCanonicalUrl } from './seo';
import { generateBreadcrumbSchema } from './structuredData';
import { breadcrumbItemsForSchema, buildPostBreadcrumbItems } from './postBreadcrumbs';

describe('post breadcrumbs', () => {
  it('builds Home, category, title and maps them to JSON-LD', () => {
    const currentUrl = generateCanonicalUrl('/p/good-sheep');
    const items = buildPostBreadcrumbItems({
      title: 'Good Sheep',
      isSpanish: false,
      primaryCategory: { id: 'psychology', name: 'Psychology, Roughly' },
    });
    const schema = generateBreadcrumbSchema(breadcrumbItemsForSchema(items, currentUrl));

    expect(items).toEqual([
      { label: 'Home', href: '/' },
      { label: 'Psychology, Roughly', href: '/category/psychology' },
      { label: 'Good Sheep' },
    ]);
    expect(schema?.itemListElement.map((item: { name: string }) => item.name)).toEqual(
      items.map((item) => item.label),
    );
    expect(schema?.itemListElement[0].item).toBe(generateCanonicalUrl('/'));
    expect(schema?.itemListElement[1].item).toBe(generateCanonicalUrl('/category/psychology'));
    expect(schema?.itemListElement[2].item).toBe(currentUrl);
    expect(schema?.itemListElement[2].item.startsWith(SITE_URL)).toBe(true);
  });

  it('uses Inicio for a Spanish post', () => {
    const items = buildPostBreadcrumbItems({
      title: 'Ovejas buenas',
      isSpanish: true,
      primaryCategory: { id: 'psychology', name: 'Psychology, Roughly' },
    });
    expect(items.map((item) => item.label)).toEqual([
      'Inicio',
      'Psychology, Roughly',
      'Ovejas buenas',
    ]);
  });

  it('goes straight from Home to the title when a post has no category', () => {
    const items = buildPostBreadcrumbItems({
      title: 'Loose Note',
      isSpanish: false,
      primaryCategory: null,
    });
    expect(items).toEqual([{ label: 'Home', href: '/' }, { label: 'Loose Note' }]);
  });
});
