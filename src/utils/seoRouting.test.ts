import { describe, expect, it } from 'vitest';
import {
  PAGE_REDIRECTS,
  POST_REDIRECTS,
  RETIRED_INSIGHTS_REDIRECTS,
  buildSeoRedirects,
  buildTagAliasRedirects,
  normalizePathname,
  shouldIncludeInSitemap,
} from './seoRouting';
import { getBuiltTagSlugs } from './sitemapTranslations';

describe('normalizePathname', () => {
  it('keeps root and strips trailing slashes', () => {
    expect(normalizePathname('/')).toBe('/');
    expect(normalizePathname('/about/')).toBe('/about');
    expect(normalizePathname('/p/foo///')).toBe('/p/foo');
  });
});

describe('POST_REDIRECTS + PAGE_REDIRECTS + buildSeoRedirects', () => {
  it('maps known renamed posts to their replacements', () => {
    expect(POST_REDIRECTS['/p/it-isnt-too-much-pressure']).toBe('/p/on-parental-pressure');
    expect(POST_REDIRECTS['/p/fasting-ground-flow']).toBe('/p/fasting-metabolic-ritual');
    expect(POST_REDIRECTS['/p/lemon-pepper-chicken']).toBe(
      'https://cookbook.antoniwan.online/recipes/lemon-pepper-chicken',
    );
    expect(POST_REDIRECTS['/library']).toBeUndefined();
    expect(POST_REDIRECTS['/p/reflexion-palabras-transformacion']).toBeUndefined();
  });

  it('keeps non-post moves in PAGE_REDIRECTS', () => {
    expect(PAGE_REDIRECTS['/library']).toBe('https://antoniwan.online/collections/books');
    expect(PAGE_REDIRECTS['/p/reflexion-palabras-transformacion']).toBe('/tag/transformation');
  });

  it('includes post redirects and tag-alias redirects without trailing-slash duplicates', () => {
    const redirects = buildSeoRedirects();
    expect(redirects['/p/core-values-freedom']).toBe(
      '/p/the-definition-and-practice-of-my-core-values-make-me-free',
    );
    expect(redirects['/library']).toBe('https://antoniwan.online/collections/books');
    expect(redirects['/p/reflexion-palabras-transformacion']).toBe('/tag/transformation');
    expect(redirects['/p/core-values-freedom/']).toBeUndefined();
    // Alias map should produce at least one /tag/... redirect when aliases exist
    const tagRedirects = Object.keys(redirects).filter((k) => k.startsWith('/tag/'));
    expect(tagRedirects.length).toBeGreaterThan(0);
    const built = getBuiltTagSlugs();
    expect(redirects['/tag/limites']).toBe(built.has('boundaries') ? '/tag/boundaries' : '/browse');
    expect(redirects['/tag/recuperacion']).toBe(
      built.has('recovery') ? '/tag/recovery' : '/browse',
    );
    expect(redirects['/tag/escritura']).toBe(built.has('writing') ? '/tag/writing' : '/browse');
    expect(redirects['/tag/poem']).toBe(built.has('poems') ? '/tag/poems' : '/browse');
    expect(redirects['/tag/essay']).toBe(built.has('essays') ? '/tag/essays' : '/browse');
    expect(redirects['/tag/essays']).toBeUndefined();
    expect(redirects['/tag/development']).toBe(
      built.has('software-development') ? '/tag/software-development' : '/browse',
    );
    expect(redirects['/tag/notes']).toBe('/browse');
    expect(redirects['/tag/nota']).toBe('/browse');
  });

  it('sends a tag alias to /tag when the canonical page is not built', () => {
    const redirects = buildTagAliasRedirects(new Set(['boundaries']));
    expect(redirects['/tag/limites']).toBe('/tag/boundaries');
    expect(redirects['/tag/essay']).toBe('/browse');
    expect(redirects['/tag/notes']).toBe('/browse');
  });

  it('sends the old reading pages to Archive and Browse', () => {
    const redirects = buildSeoRedirects();
    expect(redirects['/everything']).toBe('/archive');
    expect(redirects['/tag']).toBe('/browse');
    expect(redirects['/category']).toBe('/browse');
    expect(redirects['/guided-path']).toBe('/browse');
  });

  it('sends every retired Writing Insights and Brain Science page home', () => {
    const redirects = buildSeoRedirects();
    expect(RETIRED_INSIGHTS_REDIRECTS['/writing-insights']).toBe('/');
    expect(redirects['/writing-insights']).toBe('/');
    expect(redirects['/writing-insights/cadence']).toBe('/');
    expect(redirects['/writing-insights/meta']).toBe('/');
    expect(redirects['/brain-science']).toBe('/');
    expect(redirects['/brain-science/insights']).toBe('/');
  });
});

describe('shouldIncludeInSitemap', () => {
  it('includes canonical reader pages', () => {
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/')).toBe(true);
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/about')).toBe(true);
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/p/some-post')).toBe(true);
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/tag')).toBe(true);
  });

  it('includes tag detail pages', () => {
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/tag/parenting')).toBe(true);
  });

  it('excludes recipe redirects from the Notes sitemap', () => {
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/recipes')).toBe(false);
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/p/recipes/sofrito')).toBe(false);
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/p/recipes/sofrito.md')).toBe(
      false,
    );
  });

  it('excludes only author tools and API hub paths', () => {
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/tag-management')).toBe(false);
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/api')).toBe(false);
  });
});
