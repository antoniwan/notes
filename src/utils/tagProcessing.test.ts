import { describe, expect, it } from 'vitest';
import { getRelatedTags } from './tagProcessing';

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
