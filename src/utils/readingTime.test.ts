import { describe, expect, it } from 'vitest';
import { localizeReadingTime } from './readingTime';

describe('localizeReadingTime', () => {
  it('keeps the English label', () => {
    expect(localizeReadingTime('30 min read', 'en')).toBe('30 min read');
  });

  it('says it in Spanish for Spanish posts', () => {
    expect(localizeReadingTime('30 min read', 'es')).toBe('30 min de lectura');
  });
});
