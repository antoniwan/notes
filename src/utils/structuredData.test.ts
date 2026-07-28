import { describe, expect, it } from 'vitest';
import { generateStructuredData } from './structuredData';

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
