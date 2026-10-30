import { describe, expect, it } from 'vitest';
import {
  PAGE_REDIRECTS,
  POST_REDIRECTS,
  RETIRED_INSIGHTS_REDIRECTS,
  RETIRED_TAG_REDIRECTS,
  TAG_INDEX_PATH,
  buildSeoRedirects,
  buildTagAliasRedirects,
  normalizePathname,
  shouldIncludeInSitemap,
} from './seoRouting';
import { getBuiltTagSlugs } from './sitemapTranslations';
import { TAG_PAGE_HISTORY } from '../data/tagPageHistory';
import { categories } from '../data/categories';

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
    expect(redirects['/tag/limites']).toBe(
      built.has('boundaries') ? '/tag/boundaries' : '/browse#topics',
    );
    expect(redirects['/tag/recuperacion']).toBe(
      built.has('recovery') ? '/tag/recovery' : '/browse#topics',
    );
    expect(redirects['/tag/escritura']).toBe(
      built.has('writing') ? '/tag/writing' : '/browse#topics',
    );
    expect(redirects['/tag/poem']).toBe(built.has('poems') ? '/tag/poems' : '/browse#topics');
    expect(redirects['/tag/essay']).toBe(built.has('essays') ? '/tag/essays' : '/browse#topics');
    // The canonical form never aliases to itself; with no page it goes to the topic index.
    expect(redirects['/tag/essays']).toBe(built.has('essays') ? undefined : TAG_INDEX_PATH);
    expect(redirects['/tag/development']).toBe(
      built.has('software-development') ? '/tag/software-development' : '/browse#topics',
    );
    expect(redirects['/tag/notes']).toBe('/browse#topics');
    expect(redirects['/tag/nota']).toBe('/browse#topics');
  });

  it('sends a tag alias to /tag when the canonical page is not built', () => {
    const redirects = buildTagAliasRedirects(new Set(['boundaries']));
    expect(redirects['/tag/limites']).toBe('/tag/boundaries');
    expect(redirects['/tag/essay']).toBe('/browse#topics');
    expect(redirects['/tag/notes']).toBe('/browse#topics');
  });

  it('sends retired tag pages where their posts went, unless the tag is built again', () => {
    const redirects = buildTagAliasRedirects(new Set(['gaming']));
    expect(redirects['/tag/crimson-desert']).toBe('/tag/gaming');
    expect(redirects['/tag/psychology']).toBe('/category/psychology');
    expect(buildTagAliasRedirects(new Set(['discipline']))['/tag/discipline']).toBeUndefined();
    // A successor without a page of its own falls back to the topic index.
    expect(buildTagAliasRedirects(new Set())['/tag/dispatch']).toBe(TAG_INDEX_PATH);
  });

  it('sends an emptied tag with no successor to the topic index', () => {
    expect(buildTagAliasRedirects(new Set())['/tag/stoicism']).toBe(TAG_INDEX_PATH);
  });

  // The rule: a tag URL never 404s. If this fails, add the new tag to
  // src/data/tagPageHistory.ts (and never remove one from it).
  it('lists every built tag in the tag page history', () => {
    const history = new Set(TAG_PAGE_HISTORY);
    const missing = [...getBuiltTagSlugs()].filter((tag) => !history.has(tag));
    expect(missing).toEqual([]);
  });

  it('gives every tag in the history a page or a redirect', () => {
    const built = getBuiltTagSlugs();
    const redirects = buildTagAliasRedirects(built);
    const orphans = TAG_PAGE_HISTORY.filter((tag) => !built.has(tag) && !redirects[`/tag/${tag}`]);
    expect(orphans).toEqual([]);
  });

  it('points retired tags at pages that exist', () => {
    const built = getBuiltTagSlugs();
    const categoryPaths = new Set(categories.map((category) => `/category/${category.id}`));
    for (const target of Object.values(RETIRED_TAG_REDIRECTS)) {
      const tag = target.match(/^\/tag\/(.+)$/)?.[1];
      expect(tag ? built.has(tag) : categoryPaths.has(target), target).toBe(true);
    }
  });

  it('sends the old reading pages to Archive and Browse', () => {
    const redirects = buildSeoRedirects();
    expect(redirects['/everything']).toBe('/archive');
    expect(redirects['/tag']).toBe('/browse');
    expect(redirects['/category']).toBe('/browse');
    expect(redirects['/guided-path']).toBe('/browse');
    expect(redirects['/tag-management']).toBe('/browse');
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

  it('excludes the API hub', () => {
    expect(shouldIncludeInSitemap('https://notes.antoniwan.online/api')).toBe(false);
  });
});
