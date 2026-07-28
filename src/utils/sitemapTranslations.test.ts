import { describe, expect, it } from 'vitest';
import { getSitemapTranslationLinksByUrl } from './sitemapTranslations';

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
