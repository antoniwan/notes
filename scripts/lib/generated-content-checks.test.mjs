import { describe, expect, test } from 'vitest';

import {
  checkCanonicalConsistency,
  checkFeedIdsUnique,
  checkJsonLd,
  checkLocalAssets,
  checkLocalLinks,
  checkPublishEligibility,
  isPublicFrontmatter,
  isSpanishPrimaryFrontmatter,
} from './generated-content-checks.mjs';

const ORIGIN = 'https://notes.antoniwan.online';

describe('checkJsonLd', () => {
  test('accepts well-formed blocks that carry the required types', () => {
    const blocks = [
      JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Notes' }),
      JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Notes' }),
    ];
    expect(
      checkJsonLd(blocks, { label: 'page', requiredTypes: ['WebSite', 'Organization'] }),
    ).toEqual([]);
  });

  test('rejects malformed JSON', () => {
    const problems = checkJsonLd(['{ "@type": "WebSite", }'], { label: 'page' });
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/not valid JSON/);
  });

  test('rejects a block missing @context or @type', () => {
    expect(checkJsonLd([JSON.stringify({ '@type': 'WebSite' })], { label: 'page' })[0]).toMatch(
      /missing @context/,
    );
    expect(
      checkJsonLd([JSON.stringify({ '@context': 'https://schema.org' })], { label: 'page' })[0],
    ).toMatch(/missing @type/);
  });

  test('rejects a page with no JSON-LD at all', () => {
    expect(checkJsonLd([], { label: 'page' })[0]).toMatch(/no application\/ld\+json/);
  });

  test('reads a @graph-style array and a required type it does not contain', () => {
    const blocks = [
      JSON.stringify([
        { '@context': 'https://schema.org', '@type': 'WebSite' },
        { '@context': 'https://schema.org', '@type': 'Person' },
      ]),
    ];
    expect(checkJsonLd(blocks, { label: 'page', requiredTypes: ['WebSite'] })).toEqual([]);
    expect(checkJsonLd(blocks, { label: 'page', requiredTypes: ['Organization'] })[0]).toMatch(
      /expected ld\+json @type Organization/,
    );
  });
});

describe('checkFeedIdsUnique', () => {
  test('accepts distinct ids', () => {
    const items = [
      { id: 'a', url: '/p/a' },
      { id: 'b', url: '/p/b' },
    ];
    expect(checkFeedIdsUnique(items, 'feed')).toEqual([]);
  });

  test('rejects a duplicate id', () => {
    const items = [
      { id: 'a', url: '/p/a', title: 'First' },
      { id: 'a', url: '/p/a-again', title: 'Second' },
    ];
    const problems = checkFeedIdsUnique(items, 'feed');
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/duplicate id a/);
  });

  test('rejects an item with no identity at all', () => {
    expect(checkFeedIdsUnique([{ title: 'orphan' }], 'feed')[0]).toMatch(/neither id nor url/);
  });
});

describe('publication eligibility', () => {
  const now = new Date('2026-09-10T00:00:00Z');
  const live = { pubDate: '2026-01-01' };

  test('classifies frontmatter the way publishFilters does', () => {
    expect(isPublicFrontmatter(live, now)).toBe(true);
    expect(isPublicFrontmatter({ ...live, draft: true }, now)).toBe(false);
    expect(isPublicFrontmatter({ ...live, published: false }, now)).toBe(false);
    expect(isPublicFrontmatter({ pubDate: '2027-01-01' }, now)).toBe(false);
    expect(isSpanishPrimaryFrontmatter({ language: ['es'] })).toBe(true);
    expect(isSpanishPrimaryFrontmatter({ language: ['en', 'es'] })).toBe(false);
    expect(isSpanishPrimaryFrontmatter({})).toBe(false);
  });

  test('accepts a build where every post is where it belongs', () => {
    const posts = [
      { slug: 'essay', data: live },
      { slug: 'ensayo', data: { ...live, language: ['es'] } },
      { slug: 'wip', data: { ...live, draft: true } },
    ];
    // The Spanish twin gets a page but no feed entry; the draft gets neither.
    const problems = checkPublishEligibility(
      posts,
      new Set(['essay', 'ensayo']),
      new Set(['essay']),
      now,
    );
    expect(problems).toEqual([]);
  });

  test('fails when a draft is published — the fixture the audit asked for', () => {
    const posts = [{ slug: 'wip', data: { ...live, draft: true } }];
    const problems = checkPublishEligibility(posts, new Set(['wip']), new Set(['wip']), now);
    expect(problems).toHaveLength(2);
    expect(problems[0]).toMatch(/withheld \(draft\) but a page was emitted/);
    expect(problems[1]).toMatch(/withheld \(draft\) but it appears in a feed/);
  });

  test('fails when a future-dated post leaks out', () => {
    const posts = [{ slug: 'embargoed', data: { pubDate: '2027-06-01' } }];
    const problems = checkPublishEligibility(posts, new Set(['embargoed']), new Set(), now);
    expect(problems[0]).toMatch(/withheld \(future pubDate\) but a page was emitted/);
  });

  test('fails when published: false leaks out', () => {
    const posts = [{ slug: 'pulled', data: { ...live, published: false } }];
    const problems = checkPublishEligibility(posts, new Set(['pulled']), new Set(), now);
    expect(problems[0]).toMatch(/withheld \(published: false\) but a page was emitted/);
  });

  test('fails when a Spanish-primary post reaches the English feeds', () => {
    const posts = [{ slug: 'ensayo', data: { ...live, language: ['es'] } }];
    const problems = checkPublishEligibility(posts, new Set(['ensayo']), new Set(['ensayo']), now);
    expect(problems[0]).toMatch(/Spanish-primary post must not appear in the feeds/);
  });

  test('fails when a public English post goes missing', () => {
    const posts = [{ slug: 'essay', data: live }];
    expect(checkPublishEligibility(posts, new Set(), new Set(), now)).toEqual([
      'essay: public but no page was emitted',
      'essay: public English post is missing from the feeds',
    ]);
  });
});

describe('checkLocalAssets', () => {
  const exists = (sitePath) => sitePath === '/images/real.avif';

  test('accepts a local asset that exists, by path or by absolute URL', () => {
    expect(
      checkLocalAssets(
        [
          { label: 'a', url: '/images/real.avif' },
          { label: 'b', url: `${ORIGIN}/images/real.avif` },
        ],
        exists,
        ORIGIN,
      ),
    ).toEqual([]);
  });

  test('rejects a local asset with no file behind it', () => {
    const problems = checkLocalAssets([{ label: 'og', url: '/images/gone.avif' }], exists, ORIGIN);
    expect(problems[0]).toMatch(/local asset \/images\/gone\.avif has no file/);
  });

  test('ignores off-site URLs so the gate never depends on another website', () => {
    expect(
      checkLocalAssets([{ label: 'x', url: 'https://example.com/a.png' }], exists, ORIGIN),
    ).toEqual([]);
  });
});

describe('checkCanonicalConsistency', () => {
  const canonical = `${ORIGIN}/p/essay`;

  test('accepts agreement, ignoring a trailing slash', () => {
    expect(
      checkCanonicalConsistency({
        label: 'p',
        canonical,
        feedUrl: `${ORIGIN}/p/essay/`,
        jsonLdUrl: canonical,
      }),
    ).toEqual([]);
  });

  test('rejects a feed URL that points somewhere else', () => {
    const problems = checkCanonicalConsistency({
      label: 'p',
      canonical,
      feedUrl: `${ORIGIN}/posts/essay`,
    });
    expect(problems[0]).toMatch(/disagrees with canonical/);
  });

  test('rejects a page with no canonical link', () => {
    expect(checkCanonicalConsistency({ label: 'p', canonical: null })[0]).toMatch(/no canonical/);
  });
});

describe('checkLocalLinks', () => {
  const exists = (sitePath) => sitePath === '/about';

  test('rejects an internal link that resolves to nothing', () => {
    const problems = checkLocalLinks(['/about', '/ghost'], exists, [], 'page');
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/\/ghost resolves to nothing/);
  });

  test('skips host-level redirects, which have no file by design', () => {
    expect(checkLocalLinks(['/api/quotes', '/rss.xml'], exists, ['/api/', '/rss.xml'])).toEqual([]);
  });

  test('ignores external and protocol-relative links', () => {
    expect(checkLocalLinks(['https://example.com', '//cdn.example.com/x'], exists)).toEqual([]);
  });

  test('reports a broken link once even when it appears repeatedly', () => {
    expect(checkLocalLinks(['/ghost', '/ghost#a', '/ghost?b=1'], exists)).toHaveLength(1);
  });
});
