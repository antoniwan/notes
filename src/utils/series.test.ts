import { describe, expect, it } from 'vitest';
import { seriesPosition, seriesPosts } from './series';

type Data = {
  series?: string;
  seriesOrder?: number;
  pubDate: Date;
  language: ('en' | 'es')[];
};

const post = (id: string, data: Partial<Data>) => ({
  id,
  data: { pubDate: new Date('2026-01-01'), language: ['en'], ...data },
});

describe('seriesPosts', () => {
  it('orders by seriesOrder first, then by date', () => {
    const posts = [
      post('late', { series: 's', pubDate: new Date('2026-05-01') }),
      post('early', { series: 's', pubDate: new Date('2026-01-01') }),
      post('pinned', { series: 's', seriesOrder: 1, pubDate: new Date('2026-09-01') }),
      post('other', { series: 'x' }),
    ];
    // @ts-expect-error minimal test entries
    expect(seriesPosts(posts, 's').map((p) => p.id)).toEqual(['pinned', 'early', 'late']);
  });

  it('keeps languages apart', () => {
    const posts = [post('en-1', { series: 's' }), post('es-1', { series: 's', language: ['es'] })];
    // @ts-expect-error minimal test entries
    expect(seriesPosts(posts, 's', true).map((p) => p.id)).toEqual(['es-1']);
  });
});

describe('seriesPosition', () => {
  const posts = [
    post('one', { series: 's', pubDate: new Date('2026-01-01') }),
    post('two', { series: 's', pubDate: new Date('2026-02-01') }),
    post('three', { series: 's', pubDate: new Date('2026-03-01') }),
    post('alone', { series: 'solo' }),
    post('none', {}),
  ];

  it('finds neighbors', () => {
    // @ts-expect-error minimal test entries
    const position = seriesPosition(posts[1], posts);
    expect(position?.index).toBe(1);
    expect(position?.total).toBe(3);
    expect(position?.previous?.id).toBe('one');
    expect(position?.next?.id).toBe('three');
  });

  it('returns null for a post outside a series or alone in one', () => {
    // @ts-expect-error minimal test entries
    expect(seriesPosition(posts[3], posts)).toBeNull();
    // @ts-expect-error minimal test entries
    expect(seriesPosition(posts[4], posts)).toBeNull();
  });
});
