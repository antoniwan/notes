import { describe, expect, it } from 'vitest';
import {
  getSitemapLastmodByUrl,
  getSitemapTranslationLinksByUrl,
  sitemapPageUrl,
} from './sitemapTranslations';

describe('getSitemapTranslationLinksByUrl', () => {
  it('clusters known EN/ES translation pairs', () => {
    const map = getSitemapTranslationLinksByUrl();
    const en = 'https://notes.antoniwan.online/p/presenting-vastitas-omniparens';
    const es = 'https://notes.antoniwan.online/p/presentando-vastitas-omniparens';
    const links = map.get(en);
    expect(links).toBeTruthy();
    expect(links!.some((l) => l.url === es && l.lang === 'es-ES')).toBe(true);
    expect(links!.some((l) => l.url === en && l.lang === 'en-US')).toBe(true);
    expect(map.get(es)).toEqual(links);
  });
});

describe('getSitemapLastmodByUrl', () => {
  const lastmodByUrl = getSitemapLastmodByUrl();

  it('uses updatedDate when present', () => {
    const url = sitemapPageUrl('/p/the-feeling-is-not-the-problem');
    expect(lastmodByUrl.get(url)?.toISOString()).toBe('2026-02-27T16:00:00.000Z');
  });

  it('falls back to pubDate when updatedDate is absent', () => {
    const url = sitemapPageUrl('/p/presentando-vastitas-omniparens');
    expect(lastmodByUrl.get(url)?.toISOString()).toBe('2026-07-27T13:45:00.000Z');
  });

  it('uses nested content paths as post ids', () => {
    const nested = sitemapPageUrl('/p/recipes/lemon-pepper-chicken');
    const oldFlat = sitemapPageUrl('/p/lemon-pepper-chicken');
    expect(lastmodByUrl.has(nested)).toBe(true);
    expect(lastmodByUrl.has(oldFlat)).toBe(false);
  });

  it('sets listing pages to the newest related post', () => {
    const home = lastmodByUrl.get(sitemapPageUrl('/'));
    const category = lastmodByUrl.get(sitemapPageUrl('/category/integration-growth'));
    const tag = lastmodByUrl.get(sitemapPageUrl('/tag/integration'));
    expect(home).toBeInstanceOf(Date);
    expect(category).toBeInstanceOf(Date);
    expect(tag).toBeInstanceOf(Date);
    expect(home!.valueOf()).toBeGreaterThanOrEqual(category!.valueOf());
  });
});
