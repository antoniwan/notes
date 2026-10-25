import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { openPage, startHarness, stopHarness, VIEWPORTS } from './harness';

/**
 * The service worker is retired. public/sw.js is now a worker that removes
 * itself, so readers who installed the old caching worker get cleaned up the
 * next time their browser checks /sw.js for an update.
 */

const ARTICLE = '/p/bend-dont-break-learning-to-flow-again/';

beforeAll(startHarness);
afterAll(stopHarness);

async function openWithServiceWorker() {
  return openPage({ viewport: VIEWPORTS.desktop, serviceWorkers: 'allow' });
}

describe('retired service worker', () => {
  test('pages no longer register a worker', async () => {
    const { page, context, goto } = await openWithServiceWorker();
    try {
      await goto('/');
      await goto(ARTICLE);
      await page.waitForTimeout(1_000);

      const registrations = await page.evaluate(
        async () => (await navigator.serviceWorker.getRegistrations()).length,
      );
      expect(registrations).toBe(0);
      expect(await page.evaluate(() => navigator.serviceWorker.controller)).toBeNull();
    } finally {
      await context.close();
    }
  });

  test("a returning reader's worker deletes the old caches and unregisters", async () => {
    const { page, context, goto } = await openWithServiceWorker();
    try {
      await goto('/');

      // What a reader of 7.6.0 or earlier has: caches from the old worker, one
      // cache belonging to something else, and a registration at the old URL.
      await page.evaluate(async () => {
        await (await caches.open('notes-pages-v7.6.0')).put('/', new Response('stale'));
        await caches.open('notes-assets-v7.6.0');
        await caches.open('some-other-tool-cache');
        await navigator.serviceWorker.register('/sw.js?v=7.6.0', { scope: '/' });
      });

      await page.waitForFunction(
        async () => (await navigator.serviceWorker.getRegistrations()).length === 0,
        null,
        { timeout: 20_000, polling: 250 },
      );

      // The registration can read as gone a moment before the deletes are visible.
      await expect
        .poll(async () =>
          (await page.evaluate(() => caches.keys())).filter((name) => name.startsWith('notes-')),
        )
        .toEqual([]);
      expect(await page.evaluate(() => caches.keys())).toContain('some-other-tool-cache');
    } finally {
      await context.close();
    }
  });
});
