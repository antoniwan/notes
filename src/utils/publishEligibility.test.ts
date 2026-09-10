import { describe, expect, it } from 'vitest';

import {
  isFeedEligibleMeta,
  isListingEligibleMeta,
  isPublicMeta,
  isSpanishPrimaryMeta,
  lastmodForMeta,
  normalizePostMeta,
  toDate,
  toStringArray,
} from './publishEligibility.mjs';

const NOW = new Date('2026-09-10T00:00:00Z');

describe('normalizePostMeta', () => {
  it('accepts both a collection entry and raw YAML frontmatter', () => {
    // Collection entries arrive with real Dates; frontmatter read from disk
    // arrives as strings. Both had their own parsing before this module.
    const fromCollection = normalizePostMeta({
      title: 'x',
      pubDate: new Date('2026-01-01T00:00:00Z'),
      language: ['es'],
    });
    const fromYaml = normalizePostMeta({
      title: 'x',
      pubDate: '2026-01-01T00:00:00Z',
      language: ['es'],
    });
    expect(fromCollection.pubDate?.toISOString()).toBe(fromYaml.pubDate?.toISOString());
    expect(fromCollection.language).toEqual(fromYaml.language);
  });

  it('fills in defaults for absent fields', () => {
    const meta = normalizePostMeta({});
    expect(meta).toEqual({
      draft: false,
      published: true,
      pubDate: null,
      updatedDate: null,
      language: [],
      category: [],
      tags: [],
      translationGroup: null,
    });
  });

  it('treats only an explicit true/false as draft/unpublished', () => {
    expect(normalizePostMeta({ draft: 'yes' }).draft).toBe(false);
    expect(normalizePostMeta({ draft: true }).draft).toBe(true);
    expect(normalizePostMeta({ published: false }).published).toBe(false);
    expect(normalizePostMeta({ published: undefined }).published).toBe(true);
  });

  it('drops an unparseable date rather than producing Invalid Date', () => {
    expect(normalizePostMeta({ pubDate: 'not a date' }).pubDate).toBeNull();
    expect(toDate(new Date('nonsense'))).toBeNull();
    expect(toDate(null)).toBeNull();
  });

  it('accepts a bare string where an array is expected', () => {
    expect(toStringArray('parenting')).toEqual(['parenting']);
    expect(toStringArray(['a', '', 3, 'b'])).toEqual(['a', 'b']);
    expect(toStringArray(undefined)).toEqual([]);
  });

  it('ignores an empty translationGroup', () => {
    expect(normalizePostMeta({ translationGroup: '' }).translationGroup).toBeNull();
    expect(normalizePostMeta({ translationGroup: 'pair' }).translationGroup).toBe('pair');
  });
});

describe('eligibility rules', () => {
  const live = normalizePostMeta({ pubDate: '2026-01-01' });

  it('withholds drafts, unpublished posts, and future dates', () => {
    expect(isPublicMeta(live, { now: NOW })).toBe(true);
    expect(
      isPublicMeta(normalizePostMeta({ pubDate: '2026-01-01', draft: true }), { now: NOW }),
    ).toBe(false);
    expect(
      isPublicMeta(normalizePostMeta({ pubDate: '2026-01-01', published: false }), { now: NOW }),
    ).toBe(false);
    expect(isPublicMeta(normalizePostMeta({ pubDate: '2027-01-01' }), { now: NOW })).toBe(false);
  });

  it('honours includeFuture for dev preview', () => {
    const scheduled = normalizePostMeta({ pubDate: '2027-01-01' });
    expect(isPublicMeta(scheduled, { now: NOW, includeFuture: true })).toBe(true);
    // includeFuture lifts the embargo only; a draft is still a draft.
    const scheduledDraft = normalizePostMeta({ pubDate: '2027-01-01', draft: true });
    expect(isPublicMeta(scheduledDraft, { now: NOW, includeFuture: true })).toBe(false);
  });

  it('treats only the first language entry as primary', () => {
    expect(isSpanishPrimaryMeta(normalizePostMeta({ language: ['es'] }))).toBe(true);
    expect(isSpanishPrimaryMeta(normalizePostMeta({ language: ['es', 'en'] }))).toBe(true);
    expect(isSpanishPrimaryMeta(normalizePostMeta({ language: ['en', 'es'] }))).toBe(false);
    expect(isSpanishPrimaryMeta(normalizePostMeta({}))).toBe(false);
  });

  it('keeps Spanish out of feeds and listings but not out of the site', () => {
    const spanish = normalizePostMeta({ pubDate: '2026-01-01', language: ['es'] });
    expect(isPublicMeta(spanish, { now: NOW })).toBe(true);
    expect(isFeedEligibleMeta(spanish, { now: NOW })).toBe(false);
    expect(isListingEligibleMeta(spanish, { now: NOW })).toBe(false);
  });

  it('prefers updatedDate for lastmod, falling back to pubDate', () => {
    expect(lastmodForMeta(live)?.toISOString()).toBe('2026-01-01T00:00:00.000Z');
    const updated = normalizePostMeta({ pubDate: '2026-01-01', updatedDate: '2026-05-05' });
    expect(lastmodForMeta(updated)?.toISOString()).toBe('2026-05-05T00:00:00.000Z');
    expect(lastmodForMeta(normalizePostMeta({}))).toBeNull();
  });
});
