import { describe, expect, it } from 'vitest';
import { generateStructuredData, toIso8601Duration } from './structuredData';

describe('generateStructuredData articleSection', () => {
  it('prefers category over tags', () => {
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
    expect(article?.articleSection).toBe('psychology');
  });

  it('falls back to tags when no category', () => {
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
    expect(article?.articleSection).toBe('empathy, growth, mindfulness');
  });
});

describe('generateStructuredData recipe', () => {
  it('emits Recipe instead of BlogPosting', () => {
    const schemas = generateStructuredData({
      title: 'Sofrito',
      description: 'The base.',
      path: '/p/recipes/sofrito',
      type: 'recipe',
      pubDate: new Date('2026-01-01T00:00:00.000Z'),
      heroImage: '/images/sofrito.avif',
      keywords: ['sofrito', 'puerto-rico'],
      recipeIngredient: ['2 onions', '1 head of garlic'],
      recipeInstructions: ['Chop everything.', 'Blend until coarse.'],
      prepTime: 'PT20M',
      cookTime: 'PT0M',
      totalTime: 'PT20M',
      recipeYield: '2 cups',
      recipeCategory: 'Sauce',
      recipeCuisine: 'Puerto Rican',
    });
    const list = Array.isArray(schemas) ? schemas : [schemas];
    const recipe = list.find((s) => s['@type'] === 'Recipe');
    const article = list.find((s) => s['@type'] === 'BlogPosting');

    expect(recipe).toBeDefined();
    expect(article).toBeUndefined();
    expect(recipe?.name).toBe('Sofrito');
    expect(recipe?.recipeIngredient).toEqual(['2 onions', '1 head of garlic']);
    expect(recipe?.prepTime).toBe('PT20M');
    expect(recipe?.recipeInstructions?.[0]).toMatchObject({
      '@type': 'HowToStep',
      position: 1,
      text: 'Chop everything.',
    });
  });

  it('still emits BlogPosting for a normal article', () => {
    const schemas = generateStructuredData({
      title: 'Good Sheep',
      description: 'An essay.',
      path: '/p/good-sheep',
      type: 'article',
      pubDate: new Date('2026-01-01T00:00:00.000Z'),
    });
    const list = Array.isArray(schemas) ? schemas : [schemas];
    expect(list.some((s) => s['@type'] === 'BlogPosting')).toBe(true);
    expect(list.some((s) => s['@type'] === 'Recipe')).toBe(false);
  });

  it('omits timing and ingredient keys when they have no data', () => {
    const schemas = generateStructuredData({
      title: 'Sofrito',
      description: 'The base.',
      path: '/p/recipes/sofrito',
      type: 'recipe',
      pubDate: new Date('2026-01-01T00:00:00.000Z'),
    });
    const recipe = (Array.isArray(schemas) ? schemas : [schemas]).find(
      (s) => s['@type'] === 'Recipe',
    );
    expect(recipe).toBeDefined();
    const json = JSON.parse(JSON.stringify(recipe));
    expect(json).not.toHaveProperty('prepTime');
    expect(json).not.toHaveProperty('cookTime');
    expect(json).not.toHaveProperty('totalTime');
    expect(json).not.toHaveProperty('recipeIngredient');
    expect(json).not.toHaveProperty('recipeInstructions');
    expect(json).not.toHaveProperty('recipeYield');
    expect(json).not.toHaveProperty('recipeCategory');
    expect(json).not.toHaveProperty('recipeCuisine');
    expect(json['@type']).toBe('Recipe');
  });
});

describe('toIso8601Duration', () => {
  it('passes through ISO durations and converts minute counts', () => {
    expect(toIso8601Duration('PT20M')).toBe('PT20M');
    expect(toIso8601Duration('20')).toBe('PT20M');
    expect(toIso8601Duration('')).toBeUndefined();
    expect(toIso8601Duration('soon')).toBeUndefined();
  });
});
