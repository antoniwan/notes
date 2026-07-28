import { describe, expect, it } from 'vitest';
import {
  filterQuotesByKind,
  getQuoteCountsByKind,
  getQuoteKind,
  getQuoteSourceUrl,
  pickRandomQuoteWithMeta,
} from '../data/quotes';

describe('quotes helpers (API contract core)', () => {
  it('classifies kinds and builds site source URLs without trailing slash', () => {
    const site = {
      id: 999,
      text: 'x',
      author: 'a',
      work: 'w',
      book: null,
      themes: [],
      category: 'c',
      difficulty: 'beginner' as const,
      length: 'short' as const,
      popularity: 'low' as const,
      context: '',
      modernRelevance: '',
      kind: 'site' as const,
      postId: 'presenting-vastitas-omniparens',
    };
    expect(getQuoteKind(site)).toBe('site');
    expect(getQuoteSourceUrl(site)).toBe('/p/presenting-vastitas-omniparens');
  });

  it('counts and filters by kind consistently', () => {
    const counts = getQuoteCountsByKind();
    expect(counts.stoic + counts.philosophical + counts.site).toBeGreaterThan(0);
    expect(filterQuotesByKind('stoic').every((q) => getQuoteKind(q) === 'stoic')).toBe(true);
  });

  it('honors kind selection and reports pool metadata', () => {
    const { quote, poolUsed, usedFallbackToFullPool } = pickRandomQuoteWithMeta('stoic');
    expect(getQuoteKind(quote)).toBe('stoic');
    expect(poolUsed.length).toBe(getQuoteCountsByKind().stoic);
    expect(usedFallbackToFullPool).toBe(false);
  });
});
