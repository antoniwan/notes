import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import { findMoreRecipes, isRecipePost } from './recipes';
import { findRelatedPosts } from './tagProcessing';

type BlogPost = CollectionEntry<'blog'>;

function post(id: string, overrides: Partial<BlogPost['data']> = {}): BlogPost {
  return {
    id,
    data: {
      title: id,
      description: `${id} description`,
      pubDate: new Date('2026-01-01T00:00:00.000Z'),
      language: ['en'],
      draft: false,
      published: true,
      featured: false,
      showComments: true,
      tags: ['cooking', 'recipes', 'food'],
      category: ['diy-creation'],
      ...overrides,
    },
  } as BlogPost;
}

describe('isRecipePost', () => {
  it('matches nested recipe ids and nothing else', () => {
    expect(isRecipePost({ id: 'recipes/lemon-pepper-chicken' })).toBe(true);
    expect(isRecipePost({ id: 'recipes' })).toBe(true);
    expect(isRecipePost({ id: 'i-didnt-start-cooking-for-love' })).toBe(false);
    expect(isRecipePost({ id: 'recipe-lemon-pepper-chicken' })).toBe(false);
  });
});

describe('findMoreRecipes', () => {
  it('returns empty when the current post is the only recipe', () => {
    const current = post('recipes/lemon-pepper-chicken');
    const others = [
      post('i-didnt-start-cooking-for-love'),
      post('on-cooking-on-everything-and-foundations'),
    ];

    expect(findMoreRecipes(current, [current, ...others])).toEqual([]);
  });

  it('returns other recipes newest first and skips essays', () => {
    const current = post('recipes/lemon-pepper-chicken', {
      pubDate: new Date('2025-05-02T00:00:00.000Z'),
    });
    const sofrito = post('recipes/sofrito', {
      pubDate: new Date('2026-07-23T00:00:00.000Z'),
    });
    const habichuelas = post('recipes/habichuelas-guisadas', {
      pubDate: new Date('2026-06-01T00:00:00.000Z'),
    });
    const essay = post('i-didnt-start-cooking-for-love', {
      pubDate: new Date('2026-08-01T00:00:00.000Z'),
    });

    const more = findMoreRecipes(current, [current, sofrito, habichuelas, essay]);
    expect(more.map((item) => item.id)).toEqual([
      'recipes/sofrito',
      'recipes/habichuelas-guisadas',
    ]);
  });

  it('keeps More Recipes in the same language and skips a twin', () => {
    const current = post('recipes/sofrito-en', {
      language: ['en'],
      translationGroup: 'sofrito',
    });
    const esTwin = post('recipes/sofrito', {
      language: ['es'],
      translationGroup: 'sofrito',
    });
    const enOther = post('recipes/habichuelas-guisadas-en', {
      language: ['en'],
      translationGroup: 'habichuelas-guisadas',
    });
    const esOther = post('recipes/habichuelas-guisadas', {
      language: ['es'],
      translationGroup: 'habichuelas-guisadas',
    });

    const more = findMoreRecipes(current, [current, esTwin, enOther, esOther]);
    expect(more.map((item) => item.id)).toEqual(['recipes/habichuelas-guisadas-en']);
  });
});

describe('findRelatedPosts recipe exclusion', () => {
  it('does not recommend recipe posts from an essay', () => {
    const essay = post('i-didnt-start-cooking-for-love');
    const recipe = post('recipes/lemon-pepper-chicken');
    const otherEssay = post('on-cooking-on-everything-and-foundations');

    const related = findRelatedPosts(essay, [essay, recipe, otherEssay]);
    expect(related.map((item) => item.id)).toEqual(['on-cooking-on-everything-and-foundations']);
  });
});
