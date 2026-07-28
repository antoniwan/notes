import { describe, expect, it } from 'vitest';
import {
  analyzeBasicTextMetrics,
  countLexiconHits,
  estimateReadingMinutes,
  fleschReadingEase,
} from './textAnalysis';
import { ogLocaleAlternatesFromHreflang } from '../ogLocale';

describe('textAnalysis basics', () => {
  it('counts words and computes a finite Flesch score', () => {
    const text = 'Hello world. This is a second sentence! And a third?';
    const m = analyzeBasicTextMetrics(text);
    expect(m.wordCount).toBeGreaterThan(5);
    expect(m.sentenceCount).toBe(3);
    expect(Number.isFinite(m.fleschScore)).toBe(true);
    expect(fleschReadingEase(100, 10, 150)).toBeTypeOf('number');
  });

  it('counts lexicon hits and estimates reading minutes', () => {
    expect(countLexiconHits('I feel love and joy today', ['love', 'joy', 'hate'])).toBe(2);
    expect(estimateReadingMinutes('4 min read', 900)).toBe(4);
    expect(estimateReadingMinutes(undefined, 400)).toBe(2);
  });
});

describe('ogLocaleAlternatesFromHreflang', () => {
  it('emits alternate OG locales and skips current + x-default', () => {
    const alts = ogLocaleAlternatesFromHreflang(
      [
        { hreflang: 'en', href: 'https://example.com/a' },
        { hreflang: 'es', href: 'https://example.com/b' },
        { hreflang: 'x-default', href: 'https://example.com/a' },
      ],
      'en_US',
    );
    expect(alts).toEqual(['es_ES']);
  });
});
