import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import { findRelatedPosts, getRelatedTags } from './tagProcessing';

const post = (id: string, tags: string[]) =>
  ({
    id,
    data: {
      tags,
      pubDate: new Date('2026-01-01T00:00:00.000Z'),
    },
  }) as never;

describe('getRelatedTags', () => {
  it('ranks by co-occurrence on tagged posts, not global popularity', () => {
    const posts = [
      post('a', ['parenting', 'rare-signal']),
      post('b', ['parenting', 'rare-signal']),
      post('c', ['consciousness']),
      post('d', ['consciousness']),
      post('e', ['consciousness']),
    ];

    const related = getRelatedTags('parenting', posts, 8);
    expect(related[0]).toEqual({ tag: 'rare-signal', count: 2 });
    expect(related.some((item) => item.tag === 'consciousness')).toBe(false);
  });
});

type BlogPost = CollectionEntry<'blog'>;

function writing(id: string, overrides: Partial<BlogPost['data']> = {}): BlogPost {
  return {
    id,
    data: {
      title: id,
      description: `${id} description`,
      pubDate: new Date('2020-01-01T00:00:00.000Z'),
      language: ['en'],
      draft: false,
      published: true,
      featured: false,
      showComments: true,
      tags: ['fatherhood'],
      category: [],
      ...overrides,
    },
  } as BlogPost;
}

describe('findRelatedPosts', () => {
  it('matches canonical thematic tags without needing a shared category', () => {
    const current = writing('current', { tags: ['personal-growth'] });
    const related = writing('related', { tags: ['Personal Growth'] });

    expect(findRelatedPosts(current, [current, related])).toEqual([related]);
  });

  it('does not use form labels or featured recency as unrelated filler', () => {
    const current = writing('current', { tags: ['fatherhood', 'memoir', 'poems', 'reflection'] });
    const sameForm = writing('same-form', { tags: ['memoir', 'poems', 'reflection'] });
    const featured = writing('featured', {
      tags: ['technology'],
      featured: true,
      pubDate: new Date(),
    });

    expect(findRelatedPosts(current, [current, sameForm, featured], 4)).toEqual([]);
  });

  it('accepts a shared subject category even when there are no shared tags', () => {
    const current = writing('current', { category: ['family-relationships'] });
    const related = writing('related', {
      tags: ['co-parenting'],
      category: ['family-relationships'],
    });

    expect(findRelatedPosts(current, [current, related])).toEqual([related]);
  });

  it('excludes the current work and its translation, private posts, future posts and recipes', () => {
    const current = writing('current-es', { language: ['es'], translationGroup: 'current' });
    const twin = writing('current-en', { translationGroup: 'current' });
    const draft = writing('draft', { draft: true });
    const unpublished = writing('unpublished', { published: false });
    const future = writing('future', { pubDate: new Date('9999-01-01T00:00:00.000Z') });
    const recipe = writing('recipes/example');
    const spanish = writing('spanish', { language: ['es'] });
    const related = writing('related');

    expect(
      findRelatedPosts(current, [
        current,
        twin,
        draft,
        unpublished,
        future,
        recipe,
        spanish,
        related,
      ]),
    ).toEqual([related]);
  });

  it('puts stronger subject matches ahead of a newer featured match', () => {
    const current = writing('current', { tags: ['fatherhood', 'parenting'] });
    const strong = writing('strong', { tags: ['fatherhood', 'parenting'] });
    const recent = writing('recent', { featured: true, pubDate: new Date() });

    expect(findRelatedPosts(current, [recent, current, strong])).toEqual([strong, recent]);
  });

  it('handles missing tags and categories without inventing recommendations', () => {
    const current = writing('current', { tags: undefined, category: undefined });
    const candidate = writing('candidate', { tags: undefined, category: undefined });

    expect(findRelatedPosts(current, [current, candidate])).toEqual([]);
  });

  it('keeps equal-score results deterministic, respects limits and does not reorder the input', () => {
    const current = writing('current');
    const a = writing('a');
    const b = writing('b');
    const c = writing('c');
    const allPosts = [c, b, current, a];

    expect(findRelatedPosts(current, allPosts, 2)).toEqual([a, b]);
    expect(findRelatedPosts(current, allPosts, 0)).toEqual([]);
    expect(findRelatedPosts(current, allPosts, -1)).toEqual([]);
    expect(allPosts).toEqual([c, b, current, a]);
  });
});
