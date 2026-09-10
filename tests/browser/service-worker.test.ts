import type { Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import {
  openPage,
  resumeServing,
  startHarness,
  stopHarness,
  stopServing,
  VIEWPORTS,
} from './harness';

/**
 * R18. These exercise the real worker in a real browser: activation and
 * upgrade, what survives a version bump, and whether the offline promise in
 * public/sw.js holds.
 *
 * The promise under test: pages and images you have already opened stay
 * readable offline; pages you never opened do not; API traffic is never stored.
 */

const ARTICLE = '/p/bend-dont-break-learning-to-flow-again/';
const NEVER_VISITED = '/p/captured-not-pathetic/';

beforeAll(startHarness);
afterAll(stopHarness);

async function openWithServiceWorker() {
  return openPage({ viewport: VIEWPORTS.desktop, serviceWorkers: 'allow' });
}

/** Resolves once a worker controls the page. */
async function waitForController(page: Page) {
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, {
    timeout: 20_000,
  });
}

const cacheNames = (page: Page) => page.evaluate(() => caches.keys());

const cachedUrls = (page: Page, cacheName: string) =>
  page.evaluate(async (name) => {
    const cache = await caches.open(name);
    return (await cache.keys()).map((request) => new URL(request.url).pathname);
  }, cacheName);

/** Every path stored across every cache on the origin. */
const allCachedPaths = (page: Page) =>
  page.evaluate(async () => {
    const names = await caches.keys();
    const paths: string[] = [];
    for (const name of names) {
      const cache = await caches.open(name);
      for (const request of await cache.keys()) paths.push(new URL(request.url).pathname);
    }
    return paths;
  });

describe('activation', () => {
  test('registers, activates, and names every cache with the owned prefix', async () => {
    const { page, context, goto } = await openWithServiceWorker();
    try {
      await goto('/');
      await waitForController(page);

      const names = await cacheNames(page);
      expect(names.length).toBeGreaterThan(0);
      expect(names.every((name) => name.startsWith('notes-'))).toBe(true);
      // The shell is precached on install, so the offline page is available
      // before the reader has visited anything.
      expect(
        await cachedUrls(
          page,
          names.find((n) => n.includes('shell'))!,
        ),
      ).toContain('/offline.html');
    } finally {
      await context.close();
    }
  });

  test('an upgrade deletes its own stale caches but leaves other caches alone', async () => {
    const { page, context, goto } = await openWithServiceWorker();
    try {
      await goto('/');
      await waitForController(page);

      // One cache belonging to something else on this origin, and one that
      // looks like an older version of ours.
      await page.evaluate(async () => {
        await caches.open('some-other-tool-cache');
        await caches.open('notes-pages-v0.0.1-old');
      });

      // Force the activate handler to run again by re-registering. Unregistering
      // first guarantees a fresh install/activate cycle rather than a no-op.
      await page.evaluate(async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        await registration?.unregister();
      });
      await page.reload({ waitUntil: 'load' });
      await waitForController(page);

      const names = await cacheNames(page);
      // The unrelated cache is untouched. The previous worker deleted every
      // cache on the origin except its own current two.
      expect(names).toContain('some-other-tool-cache');
      // Our own stale version is gone.
      expect(names).not.toContain('notes-pages-v0.0.1-old');
    } finally {
      await context.close();
    }
  });
});

describe('the offline promise', () => {
  test('an article you opened stays readable offline', async () => {
    const { page, context, goto } = await openWithServiceWorker();
    try {
      await goto('/');
      await waitForController(page);

      await goto(ARTICLE);
      const onlineTitle = await page.title();
      // Give the page and image writes attached to the fetch event time to land.
      await page.waitForTimeout(1_000);

      await stopServing();
      await page.reload({ waitUntil: 'load' });

      expect(await page.title()).toBe(onlineTitle);
      expect(await page.locator('article, main').first().isVisible()).toBe(true);
    } finally {
      await resumeServing();
      await context.close();
    }
  });

  test('an article you never opened falls back to the offline page', async () => {
    const { page, context, goto } = await openWithServiceWorker();
    try {
      await goto('/');
      await waitForController(page);
      await page.waitForTimeout(500);

      const origin = await openPageOrigin(page);
      await stopServing();
      await page.goto(`${origin}${NEVER_VISITED}`, { waitUntil: 'load' });

      const body = (await page.locator('body').innerText()).toLowerCase();
      expect(body).toMatch(/you're offline|not available offline/);
      // It must be the offline page, not a stale copy of some other article.
      expect(await page.title()).toMatch(/offline/i);
    } finally {
      await resumeServing();
      await context.close();
    }
  });

  test('browse pages work offline too, not just articles', async () => {
    const { page, context, goto } = await openWithServiceWorker();
    try {
      await goto('/');
      await waitForController(page);

      // '/everything' previously fell through to a plain fetch with no offline
      // handling at all — only '/' and '/p/' were treated as pages.
      await goto('/everything');
      const onlineTitle = await page.title();
      await page.waitForTimeout(1_000);

      await stopServing();
      await page.reload({ waitUntil: 'load' });
      expect(await page.title()).toBe(onlineTitle);
    } finally {
      await resumeServing();
      await context.close();
    }
  });

  test('article images are cached, which AVIF never was before', async () => {
    const { page, context, goto } = await openWithServiceWorker();
    try {
      await goto('/');
      await waitForController(page);
      await goto(ARTICLE);
      await page.waitForTimeout(1_500);

      const names = await cacheNames(page);
      const imageCache = names.find((name) => name.includes('images'));
      expect(imageCache).toBeTruthy();

      const stored = await cachedUrls(page, imageCache!);
      // Asserting the cache is merely non-empty is not enough: favicons and
      // apple-touch-icon are .ico/.png and would satisfy it even with AVIF
      // missing from the matcher, which is exactly the bug being guarded.
      expect(stored.some((path) => /\.(avif|webp)$/i.test(path))).toBe(true);
    } finally {
      await context.close();
    }
  });
});

describe('what must never be stored', () => {
  test('API traffic stays network-only', async () => {
    const { page, context, goto, origin } = await openWithServiceWorker();
    try {
      await goto('/');
      await waitForController(page);

      await page.evaluate(async (base) => {
        try {
          await fetch(`${base}/api/quotes`);
        } catch {
          // The static server does not serve this route; the point is only that
          // the worker must not store whatever came back.
        }
      }, origin);
      await page.waitForTimeout(500);

      expect((await allCachedPaths(page)).some((path) => path.startsWith('/api/'))).toBe(false);
    } finally {
      await context.close();
    }
  });

  test('Open Graph cards are never cached for readers', async () => {
    const { page, context, goto, origin } = await openWithServiceWorker();
    try {
      await goto('/');
      await waitForController(page);

      await page.evaluate(async (base) => {
        try {
          await fetch(`${base}/social/images/notes-og-abstract-social.jpg`);
        } catch {
          /* ignore */
        }
      }, origin);
      await page.waitForTimeout(500);

      // 30 MB of crawler-facing artwork a reader never displays.
      expect((await allCachedPaths(page)).some((path) => path.startsWith('/social/'))).toBe(false);
    } finally {
      await context.close();
    }
  });
});

/** The page's own origin, for navigations that bypass the harness helper. */
async function openPageOrigin(page: Page): Promise<string | null> {
  return page.evaluate(() => window.location.origin);
}
