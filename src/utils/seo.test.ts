import { describe, expect, it } from 'vitest';
import { AUTHOR, SITE_DESCRIPTION } from '../consts';
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

describe('page titles', () => {
  it('ends tab titles in a short site name and shares the bare title', () => {
    const tags = generateMetaTags({
      title: 'Thou Shalt Not Kill*',
      path: '/p/thou-shalt-not-kill',
    });
    expect(tags.title).toBe('Thou Shalt Not Kill* · Notes');
    expect(tags.ogTitle).toBe('Thou Shalt Not Kill*');
  });

  it('lets a section stand in for the site name', () => {
    const tags = generateMetaTags({
      title: 'The Vegeta dynamic',
      titleSuffix: 'Field Guide',
      path: '/field-guide/concepts/the-vegeta-dynamic',
    });
    expect(tags.title).toBe('The Vegeta dynamic · Field Guide');
    expect(tags.ogTitle).toBe('The Vegeta dynamic');
  });

  it('drops the suffix when it would push the title past what search results show', () => {
    const title = 'On Boundaries, Miscalibration, and Relearning Unconditional Love';
    const tags = generateMetaTags({
      title,
      path: '/p/boundaries-miscalibration-unconditional-love',
    });
    expect(tags.title).toBe(title);
    expect(tags.ogTitle).toBe(title);
  });

  it('names the home page by handle', () => {
    const tags = generateMetaTags({ title: 'Notes', path: '/' });
    expect(tags.title).toBe('Notes by antoniwan');
    expect(tags.ogTitle).toBe('Notes by antoniwan');
  });

  it('keeps the full name out of every title', () => {
    for (const config of [
      { title: 'Notes', path: '/' },
      { title: 'About', ogTitle: 'About Antonio', path: '/about' },
      { title: 'En español', path: '/es' },
      { title: 'Archive', path: '/archive' },
    ]) {
      const tags = generateMetaTags(config);
      for (const t of [tags.title, tags.ogTitle]) {
        expect(t).not.toContain(AUTHOR.name);
        expect(t).not.toContain('Rodríguez Martínez');
      }
    }
  });
});
