import { describe, expect, it } from 'vitest';
import {
  isFeedEligiblePost,
  isGuidedPathEligiblePost,
  isHomepageHighlight,
  isListingEligiblePost,
  isPublicPost,
  isSearchEligiblePost,
  resolveContentLanguage,
  spanishTwinGroupsFromPosts,
} from './publishFilters';

type PostData = Parameters<typeof isPublicPost>[0];

function post(overrides: Partial<PostData> = {}): PostData {
  return {
    title: 'Test',
    description: 'Desc',
    pubDate: new Date('2026-01-15T12:00:00.000Z'),
    language: ['en'],
    draft: false,
    published: true,
    featured: false,
    showComments: true,
    ...overrides,
  } as PostData;
}

const now = new Date('2026-06-01T00:00:00.000Z');

describe('isPublicPost', () => {
  it('allows a live published post', () => {
    expect(isPublicPost(post(), { now })).toBe(true);
  });

  it('hides drafts and unpublished posts', () => {
    expect(isPublicPost(post({ draft: true }), { now })).toBe(false);
    expect(isPublicPost(post({ published: false }), { now })).toBe(false);
  });

  it('embargoes future pubDates unless includeFuture', () => {
    const future = post({ pubDate: new Date('2026-12-01T00:00:00.000Z') });
    expect(isPublicPost(future, { now })).toBe(false);
    expect(isPublicPost(future, { now, includeFuture: true })).toBe(true);
  });
});

describe('feed and listing eligibility', () => {
  it('includes English posts in feeds and listings', () => {
    const en = post({ language: ['en'], featured: false });
    expect(isFeedEligiblePost(en, { now })).toBe(true);
    expect(isListingEligiblePost(en, { now })).toBe(true);
  });

  it('excludes all Spanish posts from feeds and listings, including featured', () => {
    const esSecondary = post({ language: ['es'], featured: false });
    const esFeatured = post({ language: ['es'], featured: true });
    expect(isFeedEligiblePost(esSecondary, { now })).toBe(false);
    expect(isListingEligiblePost(esSecondary, { now })).toBe(false);
    expect(isFeedEligiblePost(esFeatured, { now })).toBe(false);
    expect(isListingEligiblePost(esFeatured, { now })).toBe(false);
  });

  it('still requires public status before language rules', () => {
    const draftEs = post({ language: ['es'], featured: true, draft: true });
    expect(isFeedEligiblePost(draftEs, { now })).toBe(false);
  });
});

describe('isSearchEligiblePost', () => {
  it('includes public Spanish posts so title search can find them', () => {
    expect(isSearchEligiblePost(post({ language: ['es'], featured: false }), { now })).toBe(true);
    expect(isSearchEligiblePost(post({ language: ['es'], featured: true }), { now })).toBe(true);
  });

  it('still hides drafts from search', () => {
    expect(isSearchEligiblePost(post({ language: ['es'], draft: true }), { now })).toBe(false);
  });
});

describe('isGuidedPathEligiblePost', () => {
  it('includes English posts', () => {
    expect(isGuidedPathEligiblePost(post({ language: ['en'] }), { now })).toBe(true);
  });

  it('excludes all Spanish posts, including featured', () => {
    expect(isGuidedPathEligiblePost(post({ language: ['es'], featured: false }), { now })).toBe(
      false,
    );
    expect(isGuidedPathEligiblePost(post({ language: ['es'], featured: true }), { now })).toBe(
      false,
    );
  });
});

describe('isHomepageHighlight', () => {
  it('includes published featured English posts', () => {
    expect(isHomepageHighlight(post({ featured: true }), { now })).toBe(true);
  });

  it('excludes featured Spanish posts from homepage highlights', () => {
    expect(isHomepageHighlight(post({ featured: true, language: ['es'] }), { now })).toBe(false);
  });

  it('excludes unpublished or draft featured posts', () => {
    expect(isHomepageHighlight(post({ featured: true, published: false }), { now })).toBe(false);
    expect(isHomepageHighlight(post({ featured: true, draft: true }), { now })).toBe(false);
  });
});

describe('spanishTwinGroupsFromPosts', () => {
  it('marks groups that have a public Spanish sibling', () => {
    const posts = [
      { data: post({ translationGroup: 'feeling', language: ['en'] }) },
      { data: post({ translationGroup: 'feeling', language: ['es'] }) },
      { data: post({ translationGroup: 'english-only', language: ['en'] }) },
    ];

    expect(spanishTwinGroupsFromPosts(posts)).toEqual(new Set(['feeling']));
  });

  it('ignores draft Spanish siblings', () => {
    const posts = [
      { data: post({ translationGroup: 'feeling', language: ['en'] }) },
      { data: post({ translationGroup: 'feeling', language: ['es'], draft: true }) },
    ];

    expect(spanishTwinGroupsFromPosts(posts).size).toBe(0);
  });
});

describe('resolveContentLanguage', () => {
  it('maps es primary language to Spanish meta tags', () => {
    expect(resolveContentLanguage(['es'])).toEqual({
      htmlLang: 'es',
      contentLanguage: 'es',
      ogLocale: 'es_ES',
      inLanguage: 'es-ES',
    });
  });

  it('defaults to English', () => {
    expect(resolveContentLanguage(undefined).htmlLang).toBe('en');
    expect(resolveContentLanguage(['en', 'es']).htmlLang).toBe('en');
  });
});
