import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { openPage, startHarness, stopHarness, VIEWPORTS } from './harness';

/**
 * Browse, words first (7.2.0). One box searches every word of the English writing. The sentences
 * and the A–Z rows run that search in place, and the word index loads only once a reader searches.
 * Counts change as writing is published, so these journeys assert shapes, not totals.
 */

const WORDS = '/browse-words.json';

beforeAll(startHarness);
afterAll(stopHarness);

describe('Browse at rest', () => {
  test('shows the sentences and a closed A–Z, and fetches no word index', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.desktop });
    const wordRequests: string[] = [];
    page.on('request', (request) => {
      if (new URL(request.url()).pathname === WORDS) wordRequests.push(request.url());
    });
    try {
      await goto('/browse');

      expect(await page.locator('#browse-results').isHidden()).toBe(true);
      expect(await page.locator('#sentence-browse-heading').innerText()).toBe(
        'Ways into the writing',
      );
      expect(await page.locator('.sentence-list li').count()).toBeGreaterThan(9);
      expect(await page.locator('details#topics').evaluate((d: HTMLDetailsElement) => d.open)).toBe(
        false,
      );
      // No categories block any more.
      expect(await page.locator('#categories').count()).toBe(0);

      await page.waitForTimeout(500);
      expect(wordRequests).toEqual([]);
    } finally {
      await context.close();
    }
  });

  test('a letter link opens the fold at that letter', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.mobile });
    try {
      await goto('/browse#topics-P');
      await expect
        .poll(() => page.locator('details#topics').evaluate((d: HTMLDetailsElement) => d.open))
        .toBe(true);
      expect(await page.locator('#topics-P').isVisible()).toBe(true);
    } finally {
      await context.close();
    }
  });
});

describe('Browse search', () => {
  test('a ?q= link finds titles first, then writings that mention the word', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.desktop });
    const wordRequests: string[] = [];
    page.on('request', (request) => {
      if (new URL(request.url()).pathname === WORDS) wordRequests.push(request.url());
    });
    try {
      await goto('/browse?q=dad');

      const results = page.locator('#browse-results');
      await expect.poll(() => results.isVisible()).toBe(true);
      expect(await page.locator('#browse-q').inputValue()).toBe('dad');
      await expect
        .poll(() => page.locator('#results-heading').innerText())
        .toMatch(/^\d+ writings? for “dad”$/);
      // Body words arrive with the index; "dad" is in far more essays than titles.
      await expect
        .poll(() => page.locator('.browse-results__aside').innerText())
        .toMatch(/^Mentioned in \d+ more$/);
      // The sentences give way to the results.
      expect(await page.locator('.browse-rest').isHidden()).toBe(true);

      const first = page.locator('.browse-grid li:not([hidden]) h3').first();
      expect((await first.innerText()).toLowerCase()).toContain('dad');

      // A second search reuses the index.
      await page.locator('#browse-q').fill('money');
      await expect.poll(() => page.locator('#results-heading').innerText()).toMatch(/“money”/);
      expect(wordRequests).toHaveLength(1);
    } finally {
      await context.close();
    }
  });

  test('a sentence word shows only its topic, and Back returns to the sentences', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.mobile });
    try {
      await page.bringToFront();
      await goto('/browse');

      const word = page.locator('.sentence-list a', { hasText: /^Poems$/ }).first();
      await word.click();

      await expect.poll(() => new URL(page.url()).search).toBe('?topic=poems');
      await expect.poll(() => page.locator('#browse-results').isVisible()).toBe(true);
      await expect
        .poll(() => page.evaluate(() => document.activeElement?.id))
        .toBe('results-heading');
      expect(await page.locator('#results-heading').innerText()).toMatch(
        /^\d+ writings? in Poems$/,
      );
      // A topic is not a word search: every card shown is tagged with it, and none only
      // mentions it.
      const shown = page.locator('.browse-grid li:not([hidden])');
      expect(await shown.count()).toBeGreaterThan(0);
      for (const slugs of await shown.evaluateAll((items) =>
        items.map((item) => (item as HTMLElement).dataset.topicSlugs ?? ''),
      )) {
        expect(slugs.split('|')).toContain('poems');
      }
      expect(await page.locator('.browse-results__aside').isHidden()).toBe(true);
      expect(await page.locator('#browse-q').inputValue()).toBe('');

      await page.goBack();
      await expect.poll(() => new URL(page.url()).search).toBe('');
      await expect.poll(() => page.locator('.browse-rest').isVisible()).toBe(true);
      expect(await page.locator('#browse-results').isHidden()).toBe(true);
      expect(await page.locator('#browse-q').inputValue()).toBe('');
    } finally {
      await context.close();
    }
  });

  test('a word with no match keeps the sentences in view', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.desktop });
    try {
      await goto('/browse?q=zzqxv');
      await expect
        .poll(() => page.locator('#results-heading').innerText())
        .toBe('No writing mentions “zzqxv”');
      expect(await page.locator('.browse-rest').isVisible()).toBe(true);
    } finally {
      await context.close();
    }
  });
});

describe('header search', () => {
  test('Enter with no highlighted result opens Browse with that search', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.desktop });
    try {
      await page.bringToFront();
      await goto('/');

      const input = page.locator('.site-header__desktop-search input.search-input');
      await input.fill('money');
      await input.press('Enter');

      await page.waitForURL((url) => url.pathname === '/browse' && url.search === '?q=money');
      await expect.poll(() => page.locator('#browse-results').isVisible()).toBe(true);
    } finally {
      await context.close();
    }
  });
});
