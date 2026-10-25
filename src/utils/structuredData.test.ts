import { describe, expect, it } from 'vitest';
import { generateBreadcrumbSchema, generateStructuredData } from './structuredData';

describe('generateStructuredData articleSection', () => {
  it('uses the primary category by its display name', () => {
    const schemas = generateStructuredData({
      title: 'Test',
      description: 'Desc',
      path: '/p/test',
      type: 'article',
      pubDate: new Date('2026-01-01T00:00:00.000Z'),
      category: ['psychology'],
      tags: ['empathy', 'growth', 'mindfulness'],
    });
    const article = (Array.isArray(schemas) ? schemas : [schemas]).find(
      (s) => s['@type'] === 'BlogPosting',
    );
    expect(article?.articleSection).toBe('Psychology, roughly');
    expect(article?.about).toEqual([{ '@type': 'Thing', name: 'Psychology, roughly' }]);
  });

  it('leaves articleSection out when there is no category', () => {
    const schemas = generateStructuredData({
      title: 'Test',
      description: 'Desc',
      path: '/p/test',
      type: 'article',
      pubDate: new Date('2026-01-01T00:00:00.000Z'),
      tags: ['empathy', 'growth', 'mindfulness', 'extra'],
    });
    const article = (Array.isArray(schemas) ? schemas : [schemas]).find(
      (s) => s['@type'] === 'BlogPosting',
    );
    expect(article?.articleSection).toBeUndefined();
  });
});

describe('generateBreadcrumbSchema', () => {
  it('returns null for an empty trail', () => {
    expect(generateBreadcrumbSchema([])).toBeNull();
  });

  it('numbers ListItem positions from 1', () => {
    const schema = generateBreadcrumbSchema([
      { name: 'Home', url: 'https://notes.antoniwan.online/' },
      { name: 'Cookbook', url: 'https://notes.antoniwan.online/recipes' },
    ]);
    expect(schema?.['@type']).toBe('BreadcrumbList');
    expect(schema?.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://notes.antoniwan.online/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Cookbook',
        item: 'https://notes.antoniwan.online/recipes',
      },
    ]);
  });
});
