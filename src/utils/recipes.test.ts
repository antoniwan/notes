import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import { isCategoryListedPost, isFeedListedPost, isRecipePost, isTagListedPost } from './recipes';
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

describe('isFeedListedPost', () => {
  it('keeps essays and drops household recipes', () => {
    expect(isFeedListedPost(post('i-didnt-start-cooking-for-love'))).toBe(true);
    expect(isFeedListedPost(post('recipes/lemon-pepper-chicken'))).toBe(false);
  });

  it('still hides Spanish twins and drafts', () => {
    expect(
      isFeedListedPost(post('on-cooking-on-everything-and-foundations-es', { language: ['es'] })),
    ).toBe(false);
    expect(isFeedListedPost(post('i-didnt-start-cooking-for-love', { draft: true }))).toBe(false);
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
