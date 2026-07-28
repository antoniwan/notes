import { describe, expect, it } from 'vitest';
import {
  POST_REDIRECTS,
  buildSeoRedirects,
  normalizePathname,
  shouldIncludeInSitemap,
} from './seoRouting';

describe('normalizePathname', () => {
  it('keeps root and strips trailing slashes', () => {
    expect(normalizePathname('/')).toBe('/');
    expect(normalizePathname('/about/')).toBe('/about');
    expect(normalizePathname('/p/foo///')).toBe('/p/foo');
  });
});

describe('POST_REDIRECTS + buildSeoRedirects', () => {
  it('maps known renamed posts to their replacements', () => {
    expect(POST_REDIRECTS['/p/it-isnt-too-much-pressure']).toBe('/p/on-parental-pressure');
    expect(POST_REDIRECTS['/p/fasting-ground-flow']).toBe('/p/fasting-metabolic-ritual');
  });

  it('includes post redirects and tag-alias redirects without trailing-slash duplicates', () => {
    const redirects = buildSeoRedirects();
    expect(redirects['/p/core-values-freedom']).toBe(
      '/p/the-definition-and-practice-of-my-core-values-make-me-free',
    );
    expect(redirects['/p/core-values-freedom/']).toBeUndefined();
    // Alias map should produce at least one /tag/... redirect when aliases exist
    const tagRedirects = Object.keys(redirects).filter((k) => k.startsWith('/tag/'));
    expect(tagRedirects.length).toBeGreaterThan(0);
  });
});

describe('shouldIncludeInSitemap', () => {
  it('includes canonical reader pages', () => {
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/')).toBe(true);
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/about')).toBe(true);
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/p/some-post')).toBe(true);
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/tag')).toBe(true);
  });

  it('excludes author tools, API hub, and thin tag detail pages', () => {
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/brain-science')).toBe(false);
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/tag-management')).toBe(false);
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/api')).toBe(false);
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/tag/parenting')).toBe(false);
  });
});
