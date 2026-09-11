import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import {
  findMoreRecipes,
  isCategoryListedPost,
  isCookbookListedPost,
  isGuidedPathListedPost,
  isRecipePost,
  isTagListedPost,
  recipeContentsLetter,
} from './recipes';
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

describe('isCookbookListedPost', () => {
  it('lists English recipes and hides Spanish twins', () => {
    expect(isCookbookListedPost(post('recipes/sofrito-en', { language: ['en'] }))).toBe(true);
    expect(isCookbookListedPost(post('recipes/sofrito', { language: ['es'] }))).toBe(false);
    expect(isCookbookListedPost(post('i-didnt-start-cooking-for-love'))).toBe(false);
  });
});

describe('isCategoryListedPost', () => {
  it('keeps essays and drops household recipes', () => {
    expect(isCategoryListedPost(post('i-didnt-start-cooking-for-love'))).toBe(true);
    expect(isCategoryListedPost(post('recipes/lemon-pepper-chicken'))).toBe(false);
  });

  it('still hides Spanish twins', () => {
    expect(
      isCategoryListedPost(
        post('on-cooking-on-everything-and-foundations-es', { language: ['es'] }),
      ),
    ).toBe(false);
  });
});

describe('isTagListedPost', () => {
  it('keeps essays and drops household recipes', () => {
    expect(isTagListedPost(post('i-didnt-start-cooking-for-love'))).toBe(true);
    expect(isTagListedPost(post('recipes/lemon-pepper-chicken'))).toBe(false);
  });
});

describe('isGuidedPathListedPost', () => {
  it('keeps essays on the reading path and drops recipes', () => {
    expect(isGuidedPathListedPost(post('i-didnt-start-cooking-for-love'))).toBe(true);
    expect(isGuidedPathListedPost(post('recipes/lemon-pepper-chicken'))).toBe(false);
    expect(isGuidedPathListedPost(post('recipes/arroz-con-pollo-en'))).toBe(false);
  });

  it('still hides Spanish essays', () => {
    expect(
      isGuidedPathListedPost(post('presentando-vastitas-omniparens', { language: ['es'] })),
    ).toBe(false);
  });
});

describe('recipeContentsLetter', () => {
  it('uses the first letter of the title', () => {
    expect(recipeContentsLetter('Sofrito')).toBe('S');
    expect(recipeContentsLetter("Mia's Chicken Nuggets")).toBe('M');
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

  it('excludes drafts, unpublished dishes and future dishes even when passed directly', () => {
    const current = post('recipes/current');
    const draft = post('recipes/draft', { draft: true });
    const unpublished = post('recipes/unpublished', { published: false });
    const future = post('recipes/future', { pubDate: new Date('9999-01-01T00:00:00.000Z') });
    const available = post('recipes/available');

    expect(findMoreRecipes(current, [current, draft, unpublished, future, available])).toEqual([
      available,
    ]);
  });

  it('keeps Spanish recipe recommendations in Spanish and excludes the same work', () => {
    const current = post('recipes/current-es', { language: ['es'], translationGroup: 'current' });
    const duplicate = post('recipes/same-work', { language: ['es'], translationGroup: 'current' });
    const english = post('recipes/other-en');
    const spanish = post('recipes/other-es', { language: ['es'] });

    expect(findMoreRecipes(current, [current, duplicate, english, spanish])).toEqual([spanish]);
  });

  it('keeps equal-date results deterministic, respects limits and preserves input order', () => {
    const current = post('recipes/current');
    const a = post('recipes/a');
    const b = post('recipes/b');
    const c = post('recipes/c');
    const allPosts = [c, b, current, a];

    expect(findMoreRecipes(current, allPosts, 2)).toEqual([a, b]);
    expect(findMoreRecipes(current, allPosts, 0)).toEqual([]);
    expect(findMoreRecipes(current, allPosts, -1)).toEqual([]);
    expect(allPosts).toEqual([c, b, current, a]);
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

  it('does not recommend Spanish posts from Continue reading', () => {
    const essay = post('boundaries-and-belonging');
    const spanish = post('limites-y-pertenencia', { language: ['es'] });
    const otherEssay = post('the-feeling-is-not-the-problem');

    const related = findRelatedPosts(essay, [essay, spanish, otherEssay]);
    expect(related.map((item) => item.id)).toEqual(['the-feeling-is-not-the-problem']);
  });
});
