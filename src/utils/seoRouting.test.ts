import { describe, expect, it } from 'vitest';
import {
  PAGE_REDIRECTS,
  POST_REDIRECTS,
  WRITING_INSIGHTS_REDIRECTS,
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
    expect(POST_REDIRECTS['/p/lemon-pepper-chicken']).toBe('/p/recipes/lemon-pepper-chicken');
    expect(POST_REDIRECTS['/library']).toBeUndefined();
    expect(POST_REDIRECTS['/p/reflexion-palabras-transformacion']).toBeUndefined();
  });

  it('keeps non-post moves in PAGE_REDIRECTS', () => {
    expect(PAGE_REDIRECTS['/library']).toBe('/library/books');
    expect(PAGE_REDIRECTS['/p/reflexion-palabras-transformacion']).toBe('/tag/transformation');
  });

  it('includes post redirects and tag-alias redirects without trailing-slash duplicates', () => {
    const redirects = buildSeoRedirects();
    expect(redirects['/p/core-values-freedom']).toBe(
      '/p/the-definition-and-practice-of-my-core-values-make-me-free',
    );
    expect(redirects['/library']).toBe('/library/books');
    expect(redirects['/p/reflexion-palabras-transformacion']).toBe('/tag/transformation');
    expect(redirects['/p/core-values-freedom/']).toBeUndefined();
    // Alias map should produce at least one /tag/... redirect when aliases exist
    const tagRedirects = Object.keys(redirects).filter((k) => k.startsWith('/tag/'));
    expect(tagRedirects.length).toBeGreaterThan(0);
    const built = getBuiltTagSlugs();
    expect(redirects['/tag/limites']).toBe(built.has('boundaries') ? '/tag/boundaries' : '/tag');
    expect(redirects['/tag/recuperacion']).toBe(built.has('recovery') ? '/tag/recovery' : '/tag');
    expect(redirects['/tag/escritura']).toBe(built.has('writing') ? '/tag/writing' : '/tag');
    expect(redirects['/tag/poem']).toBe(built.has('poems') ? '/tag/poems' : '/tag');
    expect(redirects['/tag/essay']).toBe(built.has('essays') ? '/tag/essays' : '/tag');
    expect(redirects['/tag/essays']).toBeUndefined();
    expect(redirects['/tag/development']).toBe(
      built.has('software-development') ? '/tag/software-development' : '/tag',
    );
    expect(redirects['/tag/notes']).toBe('/tag');
    expect(redirects['/tag/nota']).toBe('/tag');
  });

  it('sends a tag alias to /tag when the canonical page is not built', () => {
    const redirects = buildTagAliasRedirects(new Set(['boundaries']));
    expect(redirects['/tag/limites']).toBe('/tag/boundaries');
    expect(redirects['/tag/essay']).toBe('/tag');
    expect(redirects['/tag/notes']).toBe('/tag');
  });

  it('301s old Writing Insights subpaths and leaves the origin page in place', () => {
    const redirects = buildSeoRedirects();
    expect(WRITING_INSIGHTS_REDIRECTS['/brain-science/insights']).toBe(
      '/writing-insights/insights',
    );
    expect(redirects['/brain-science/insights']).toBe('/writing-insights/insights');
    expect(redirects['/brain-science/cadence']).toBe('/writing-insights/cadence');
    expect(redirects['/brain-science/evolution']).toBe('/writing-insights/evolution');
    expect(redirects['/brain-science/topics']).toBe('/writing-insights/topics');
    expect(redirects['/brain-science/patterns']).toBe('/writing-insights/patterns');
    expect(redirects['/brain-science/meta']).toBe('/writing-insights/meta');
    expect(redirects['/brain-science']).toBeUndefined();
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

  it('excludes only author tools and API hub paths', () => {
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/brain-science')).toBe(false);
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/writing-insights')).toBe(true);
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/writing-insights/cadence')).toBe(
      true,
    );
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/tag-management')).toBe(false);
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/api')).toBe(false);
  });
});
