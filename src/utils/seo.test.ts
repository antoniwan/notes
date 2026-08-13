import { describe, expect, it } from 'vitest';
import { SITE_DESCRIPTION } from '../consts';
import { META_DESCRIPTION_MAX_LENGTH, generateMetaTags, generateOptimizedDescription } from './seo';

describe('generateOptimizedDescription', () => {
  it('leaves short descriptions alone', () => {
    expect(generateOptimizedDescription('A short summary.')).toBe('A short summary.');
  });

  it('truncates long copy at a word boundary', () => {
    const long = 'Word '.repeat(80).trim();
    const optimized = generateOptimizedDescription(long);
    expect(optimized.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX_LENGTH);
    expect(optimized.endsWith('...')).toBe(false);
  });
});

describe('generateMetaTags', () => {
  it('uses the page description instead of the site default', () => {
    const tags = generateMetaTags({
      title: 'About',
      description: 'A page-specific meta description for About.',
      path: '/about',
    });
    expect(tags.description).toBe('A page-specific meta description for About.');
    expect(tags.description).not.toBe(SITE_DESCRIPTION);
  });

  it('clips descriptions that exceed the SEO budget', () => {
    const tags = generateMetaTags({
      title: 'Guided Path',
      description:
        'Read writings grouped by season and year. Each chapter is a season (Winter, Spring, Summer, Fall) with posts from that period. Only seasons with content are shown, and your reading progress is stored locally on your device.',
      path: '/guided-path',
    });
    expect(tags.description.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX_LENGTH);
  });
});
