import { describe, expect, it } from 'vitest';
import { SITE_URL } from '../consts';
import { generateCanonicalUrl } from './seo';
import { generateBreadcrumbSchema } from './structuredData';
import { breadcrumbItemsForSchema, buildPostBreadcrumbItems } from './postBreadcrumbs';

describe('post breadcrumbs', () => {
  it('keeps the JSON-LD trail identical to the visible crumbs', () => {
    const currentUrl = generateCanonicalUrl('/p/recipes/sofrito-en');
    const visual = buildPostBreadcrumbItems({
      title: 'Sofrito',
      isRecipe: true,
      isSpanish: false,
      primaryCategory: { id: 'diy-creation', name: 'DIY & Creation' },
    });
    const schemaItems = breadcrumbItemsForSchema(visual, currentUrl);
    const schema = generateBreadcrumbSchema(schemaItems);

    expect(visual).toEqual([
      { label: 'Home', href: '/' },
      { label: 'Cookbook', href: '/recipes' },
      { label: 'Sofrito' },
    ]);
    expect(schemaItems.map((item) => item.name)).toEqual(visual.map((item) => item.label));
    expect(schema?.itemListElement.map((item: { name: string }) => item.name)).toEqual(
      visual.map((item) => item.label),
    );
    expect(schema?.itemListElement[0].item).toBe(generateCanonicalUrl('/'));
    expect(schema?.itemListElement[1].item).toBe(generateCanonicalUrl('/recipes'));
    expect(schema?.itemListElement[2].item).toBe(currentUrl);
    expect(schema?.itemListElement[2].item.startsWith(SITE_URL)).toBe(true);
  });

  it('uses Spanish labels and Cookbook for a recipe twin', () => {
    const visual = buildPostBreadcrumbItems({
      title: 'Sofrito',
      isRecipe: true,
      isSpanish: true,
      primaryCategory: { id: 'diy-creation', name: 'DIY & Creation' },
    });
    expect(visual.map((item) => item.label)).toEqual(['Inicio', 'Recetario', 'Sofrito']);
  });

  it('uses the category for a normal essay', () => {
    const currentUrl = generateCanonicalUrl('/p/good-sheep');
    const visual = buildPostBreadcrumbItems({
      title: 'Good Sheep',
      isRecipe: false,
      isSpanish: false,
      primaryCategory: { id: 'psychology', name: 'Psychology, Roughly' },
    });
    const schema = generateBreadcrumbSchema(breadcrumbItemsForSchema(visual, currentUrl));

    expect(visual).toEqual([
      { label: 'Home', href: '/' },
      { label: 'Psychology, Roughly', href: '/category/psychology' },
      { label: 'Good Sheep' },
    ]);
    expect(schema?.itemListElement.map((item: { name: string }) => item.name)).toEqual(
      visual.map((item) => item.label),
    );
  });
});
