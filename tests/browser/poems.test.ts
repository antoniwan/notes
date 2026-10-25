import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { openPage, startHarness, stopHarness } from './harness';

/** A published poem; its page loads the Pond and Tide ambience. */
const POEM = '/p/carrot-cake-portions/';

beforeAll(startHarness);
afterAll(stopHarness);

describe('poem pages (v7.5.0)', () => {
  test('render verse as stanzas of lines, not a code box', async () => {
    const { page, context, goto } = await openPage();
    try {
      await goto(POEM);
      expect(await page.locator('pre.a-poem').count()).toBe(0);
      expect(await page.locator('.a-poem .poem-stanza .poem-line').count()).toBeGreaterThan(1);
    } finally {
      await context.close();
    }
  });

  test('add the decorative pond and tide layers', async () => {
    const { page, context, goto } = await openPage({ reducedMotion: 'no-preference' });
    try {
      await goto(POEM);
      await expect.poll(() => page.locator('canvas.poem-pond').count()).toBe(1);
      expect(await page.locator('.poem-tide').count()).toBe(1);
      // Decoration only: screen readers never meet either layer.
      expect(await page.locator('canvas.poem-pond').getAttribute('aria-hidden')).toBe('true');
      expect(await page.locator('.poem-tide').getAttribute('aria-hidden')).toBe('true');
    } finally {
      await context.close();
    }
  });

  test('skip the ambience under reduced motion', async () => {
    const { page, context, goto } = await openPage({ reducedMotion: 'reduce' });
    try {
      await goto(POEM);
      // Give the lazy chunk the same chance it gets in the test above.
      await page.waitForTimeout(1000);
      expect(await page.locator('canvas.poem-pond').count()).toBe(0);
      expect(await page.locator('.poem-tide').count()).toBe(0);
    } finally {
      await context.close();
    }
  });

  test('leave essays alone', async () => {
    const { page, context, goto } = await openPage();
    try {
      await goto('/p/i-dont-write-the-code/');
      await page.waitForTimeout(1000);
      expect(await page.locator('canvas.poem-pond').count()).toBe(0);
    } finally {
      await context.close();
    }
  });
});
