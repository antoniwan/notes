import { describe, expect, it } from 'vitest';
import { calculateReadingProgress } from './readingProgress';

const article = { top: 1000, height: 2400 };

describe('article reading progress', () => {
  it('excludes the article header and reaches zero exactly at the body start', () => {
    expect(calculateReadingProgress(0, 800, 6000, article)).toBe(0);
    expect(calculateReadingProgress(999, 800, 6000, article)).toBe(0);
    expect(calculateReadingProgress(1000, 800, 6000, article)).toBe(0);
  });

  it('measures only the article, independently of comments and footer height', () => {
    expect(calculateReadingProgress(1800, 800, 6000, article)).toBe(50);
    expect(calculateReadingProgress(1800, 800, 10000, article)).toBe(50);
  });

  it('reaches 100 when the last line enters the viewport and stays complete below it', () => {
    expect(calculateReadingProgress(2599, 800, 6000, article)).toBeLessThan(100);
    expect(calculateReadingProgress(2600, 800, 6000, article)).toBe(100);
    expect(calculateReadingProgress(5000, 800, 6000, article)).toBe(100);
  });

  it('recalculates with changed article and viewport dimensions at the same scroll position', () => {
    expect(calculateReadingProgress(1800, 800, 6000, article)).toBe(50);
    expect(calculateReadingProgress(1800, 800, 6000, { ...article, height: 4000 })).toBe(25);
    expect(calculateReadingProgress(1800, 400, 6000, article)).toBe(40);
  });

  it('completes short articles only once their entire body is visible', () => {
    const shortArticle = { top: 1000, height: 400 };
    expect(calculateReadingProgress(599, 800, 3000, shortArticle)).toBe(0);
    expect(calculateReadingProgress(600, 800, 3000, shortArticle)).toBe(100);
    expect(calculateReadingProgress(1000, 800, 3000, { top: 1000, height: 800 })).toBe(100);
  });
});

describe('document reading progress fallback', () => {
  it('preserves document scrolling on pages without an article', () => {
    expect(calculateReadingProgress(800, 800, 2400)).toBe(50);
    expect(calculateReadingProgress(1600, 800, 2400)).toBe(100);
  });

  it('keeps non-scrollable pages and overscroll finite and bounded', () => {
    expect(calculateReadingProgress(0, 800, 800)).toBe(0);
    expect(calculateReadingProgress(0, 800, 600)).toBe(0);
    expect(calculateReadingProgress(-100, 800, 2400)).toBe(0);
    expect(calculateReadingProgress(1800, 800, 2400)).toBe(100);
    expect(calculateReadingProgress(Number.NaN, 800, 2400)).toBe(0);
  });
});
