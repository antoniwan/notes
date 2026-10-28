import { describe, expect, it } from 'vitest';
import { hreflangFor, ogLocaleAlternatesFromHreflang } from './ogLocale';

describe('hreflangFor', () => {
  it('tags Spanish as Puerto Rican Spanish', () => {
    expect(hreflangFor('es')).toBe('es-PR');
    expect(hreflangFor('en')).toBe('en');
    expect(hreflangFor(undefined)).toBe('en');
  });

  it('maps es-PR alternates to the es_PR Open Graph locale', () => {
    const alternates = [
      { hreflang: 'en', href: 'https://example.com/a' },
      { hreflang: 'es-PR', href: 'https://example.com/b' },
      { hreflang: 'x-default', href: 'https://example.com/a' },
    ];
    expect(ogLocaleAlternatesFromHreflang(alternates, 'en_US')).toEqual(['es_PR']);
  });
});
