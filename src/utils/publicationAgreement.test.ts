import { describe, expect, it } from 'vitest';

import {
  isFeedEligiblePost,
  isListingEligiblePost,
  isPublicPost,
  isSearchEligiblePost,
  isSpanishPrimary,
} from './publishFilters';
import {
  isFeedEligibleMeta,
  isListingEligibleMeta,
  isPublicMeta,
  isSpanishPrimaryMeta,
  normalizePostMeta,
} from './publishEligibility.mjs';
import {
  isPublicFrontmatter,
  isSpanishPrimaryFrontmatter,
} from '../../scripts/lib/generated-content-checks.mjs';
import { buildSitemapIndex, sitemapPageUrl } from './sitemapTranslations';

/**
 * R21: the collection surface, the sitemap surface, and the post-build
 * validator each used to carry their own copy of these rules. This file is the
 * cross-surface fixture check the audit asked for — every surface must reach the
 * same verdict about drafts, scheduling, dates, and language.
 */

const NOW = new Date('2026-09-10T00:00:00Z');

type Fixture = { name: string; data: Record<string, unknown> };

const FIXTURES: Fixture[] = [
  { name: 'plain English essay', data: { pubDate: '2026-01-01', language: ['en'] } },
  { name: 'English essay with no language field', data: { pubDate: '2026-01-01' } },
  { name: 'Spanish twin', data: { pubDate: '2026-01-01', language: ['es'] } },
  {
    name: 'English essay that also lists Spanish',
    data: { pubDate: '2026-01-01', language: ['en', 'es'] },
  },
  { name: 'draft', data: { pubDate: '2026-01-01', draft: true } },
  { name: 'Spanish draft', data: { pubDate: '2026-01-01', draft: true, language: ['es'] } },
  { name: 'unpublished', data: { pubDate: '2026-01-01', published: false } },
  { name: 'future-dated', data: { pubDate: '2027-06-01' } },
  { name: 'future-dated Spanish', data: { pubDate: '2027-06-01', language: ['es'] } },
  { name: 'dated exactly now', data: { pubDate: NOW.toISOString() } },
  { name: 'date given as a YAML Date', data: { pubDate: new Date('2026-01-01T00:00:00Z') } },
];

describe('publication rules agree across every surface', () => {
  for (const { name, data } of FIXTURES) {
    it(name, () => {
      const meta = normalizePostMeta(data);
      // `publishFilters` takes collection data; the shape is structurally the
      // same, so the cast is the adapter boundary, not a behavior change.
      const asPostData = data as never;

      expect(isPublicPost(asPostData, { now: NOW })).toBe(isPublicMeta(meta, { now: NOW }));
      expect(isSpanishPrimary(asPostData)).toBe(isSpanishPrimaryMeta(meta));
      expect(isFeedEligiblePost(asPostData, { now: NOW })).toBe(
        isFeedEligibleMeta(meta, { now: NOW }),
      );
      expect(isListingEligiblePost(asPostData, { now: NOW })).toBe(
        isListingEligibleMeta(meta, { now: NOW }),
      );

      // The post-build validator reaches the same verdict from raw frontmatter.
      expect(isPublicFrontmatter(data, NOW)).toBe(isPublicMeta(meta, { now: NOW }));
      expect(isSpanishPrimaryFrontmatter(data)).toBe(isSpanishPrimaryMeta(meta));

      // Search is the documented exception: public in any language.
      expect(isSearchEligiblePost(asPostData, { now: NOW })).toBe(isPublicMeta(meta, { now: NOW }));
    });
  }
});

describe('sitemap lastmod attribution', () => {
  const entry = (postId: string, data: Record<string, unknown>) => ({
    postId,
    meta: normalizePostMeta(data),
  });

  it('does not bump English-only listings for a Spanish-only edit', () => {
    const index = buildSitemapIndex(
      [
        entry('english-essay', {
          pubDate: '2026-01-01',
          updatedDate: '2026-03-01',
          language: ['en'],
          category: ['psychology'],
        }),
        // Edited much later, and it is the newest post in the set.
        entry('ensayo-espanol', {
          pubDate: '2026-01-01',
          updatedDate: '2026-08-01',
          language: ['es'],
          category: ['psychology'],
        }),
      ],
      { now: NOW },
    );

    const spanishEdit = '2026-08-01T00:00:00.000Z';
    const englishEdit = '2026-03-01T00:00:00.000Z';

    // The Spanish post's own page reflects its edit.
    expect(index.lastmodByUrl.get(sitemapPageUrl('/p/ensayo-espanol'))?.toISOString()).toBe(
      spanishEdit,
    );

    // English-only surfaces must not claim to have changed on that date.
    for (const listing of ['/', '/everything', '/guided-path', '/rss.xml', '/feed.json']) {
      expect(index.lastmodByUrl.get(sitemapPageUrl(listing))?.toISOString()).toBe(englishEdit);
    }
    expect(index.lastmodByUrl.get(sitemapPageUrl('/category/psychology'))?.toISOString()).toBe(
      englishEdit,
    );
  });

  it('never lists a withheld post at all', () => {
    const index = buildSitemapIndex(
      [
        entry('live', { pubDate: '2026-01-01', language: ['en'] }),
        entry('wip', { pubDate: '2026-08-01', draft: true }),
        entry('pulled', { pubDate: '2026-08-02', published: false }),
        entry('embargoed', { pubDate: '2027-01-01' }),
      ],
      { now: NOW },
    );

    expect(index.lastmodByUrl.has(sitemapPageUrl('/p/live'))).toBe(true);
    for (const withheld of ['wip', 'pulled', 'embargoed']) {
      expect(index.lastmodByUrl.has(sitemapPageUrl(`/p/${withheld}`))).toBe(false);
    }
    // None of them may have moved the homepage either.
    expect(index.lastmodByUrl.get(sitemapPageUrl('/'))?.toISOString()).toBe(
      '2026-01-01T00:00:00.000Z',
    );
  });

  it('keeps recipes off category, tag and Guided Path pages', () => {
    const index = buildSitemapIndex(
      [
        entry('essay', {
          pubDate: '2026-01-01',
          category: ['parenting'],
          tags: ['parenting'],
        }),
        entry('recipes/sofrito', {
          pubDate: '2026-08-01',
          category: ['parenting'],
          tags: ['parenting'],
        }),
      ],
      { now: NOW },
    );

    const essayDate = '2026-01-01T00:00:00.000Z';
    const recipeDate = '2026-08-01T00:00:00.000Z';

    // The Cookbook and Everything both list recipes, so they move.
    expect(index.lastmodByUrl.get(sitemapPageUrl('/recipes'))?.toISOString()).toBe(recipeDate);
    expect(index.lastmodByUrl.get(sitemapPageUrl('/everything'))?.toISOString()).toBe(recipeDate);

    // Category, tag and Guided Path pages list essays only, so they must not.
    // See isCategoryListedPost / isTagListedPost / isGuidedPathListedPost.
    for (const essayOnly of [
      '/category',
      '/category/parenting',
      '/tag',
      '/tag/parenting',
      '/guided-path',
    ]) {
      expect(index.lastmodByUrl.get(sitemapPageUrl(essayOnly))?.toISOString()).toBe(essayDate);
    }
  });

  it('still clusters EN/ES translation pairs', () => {
    const index = buildSitemapIndex(
      [
        entry('essay', { pubDate: '2026-01-01', language: ['en'], translationGroup: 'pair' }),
        entry('ensayo', { pubDate: '2026-01-01', language: ['es'], translationGroup: 'pair' }),
        entry('lonely', { pubDate: '2026-01-01', translationGroup: 'solo' }),
      ],
      { now: NOW },
    );

    const links = index.linksByCanonicalUrl.get(sitemapPageUrl('/p/essay'));
    expect(links).toBeTruthy();
    expect(links!.map((link) => link.lang).sort()).toEqual(['en-US', 'es-ES']);
    expect(index.linksByCanonicalUrl.get(sitemapPageUrl('/p/ensayo'))).toEqual(links);

    // A group of one is not a pair.
    expect(index.linksByCanonicalUrl.has(sitemapPageUrl('/p/lonely'))).toBe(false);
  });
});
