import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { openPage, startHarness, stopHarness, VIEWPORTS } from './harness';

const ROTATOR_POST = '/p/why-electric-cars-cant-look-like-electric-cars/';
const LIGHTBOX_POST = '/p/bend-dont-break-learning-to-flow-again/';
/** ImageRotator autoplay interval in the published MDX, plus slack. */
const ROTATION_PERIOD_MS = 4500;

beforeAll(startHarness);
afterAll(stopHarness);

describe('article image lightbox (R08)', () => {
  test('opens from the keyboard, traps focus, and restores it on Escape', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.desktop });
    try {
      // HTMLElement.focus() silently does nothing when the browsing context is
      // not focused, so a focus assertion flakes depending on which test file
      // ran before this one. bringToFront() makes the context deterministic.
      await page.bringToFront();
      await goto(LIGHTBOX_POST);

      const image = page.locator('.prose img[role="button"]').first();
      await expect.poll(() => image.count()).toBe(1);

      // The trigger has to be reachable and named before it is any use.
      expect(await image.getAttribute('tabindex')).toBe('0');
      expect(await image.getAttribute('aria-label')).toBeTruthy();

      const bodyOverflowBefore = await page.evaluate(() => document.body.style.overflow);

      await image.focus();
      await page.keyboard.press('Enter');

      const dialog = page.locator('dialog#imageModal');
      await expect.poll(() => dialog.evaluate((d: HTMLDialogElement) => d.open)).toBe(true);

      // showModal() is what makes the background inert; a plain show() would not.
      expect(await dialog.evaluate((d: HTMLDialogElement) => d.matches(':modal'))).toBe(true);
      expect(await page.evaluate(() => document.activeElement?.className)).toContain('close-btn');
      expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');

      const modalImage = page.locator('#modalImage');
      expect(await modalImage.getAttribute('src')).toBeTruthy();

      await page.keyboard.press('Escape');
      await expect.poll(() => dialog.evaluate((d: HTMLDialogElement) => d.open)).toBe(false);

      // The dialog's `close` event fires asynchronously, and focus restoration
      // is deliberately deferred a frame so it wins against the browser's own
      // restore. Both post-close assertions therefore poll rather than sample.
      await expect
        .poll(() => page.evaluate(() => document.activeElement?.getAttribute('role')))
        .toBe('button');
      await expect
        .poll(() => page.evaluate(() => document.body.style.overflow))
        .toBe(bodyOverflowBefore);
    } finally {
      await context.close();
    }
  });

  test('restores focus to the image even when focus was elsewhere on open', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.desktop });
    try {
      // See the note above: focus() needs a focused browsing context.
      await page.bringToFront();
      await goto(LIGHTBOX_POST);

      // <dialog> natively returns focus to whatever was focused before
      // showModal(). Opening from an element that is NOT the image is the only
      // way to tell the layout's own `activeImage.focus()` apart from that
      // built-in behavior — without this, the assertion passes either way.
      await page.evaluate(() => {
        const elsewhere = document.querySelector<HTMLElement>('#theme-toggle');
        elsewhere?.focus();
        const image = [...document.querySelectorAll<HTMLImageElement>('.prose img[role="button"]')];
        image[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      const dialog = page.locator('dialog#imageModal');
      await expect.poll(() => dialog.evaluate((d: HTMLDialogElement) => d.open)).toBe(true);

      await page.keyboard.press('Escape');
      await expect.poll(() => dialog.evaluate((d: HTMLDialogElement) => d.open)).toBe(false);

      await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe('IMG');
      expect(await page.evaluate(() => document.activeElement?.getAttribute('role'))).toBe(
        'button',
      );
    } finally {
      await context.close();
    }
  });

  test('closes from the close button too', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.desktop });
    try {
      await goto(LIGHTBOX_POST);
      const image = page.locator('.prose img[role="button"]').first();
      await image.click();

      const dialog = page.locator('dialog#imageModal');
      await expect.poll(() => dialog.evaluate((d: HTMLDialogElement) => d.open)).toBe(true);

      await page.locator('dialog#imageModal .close-btn').click();
      await expect.poll(() => dialog.evaluate((d: HTMLDialogElement) => d.open)).toBe(false);
    } finally {
      await context.close();
    }
  });
});

describe('search (R01, R10)', () => {
  /** Returns the id of the search bar that is actually visible at this width. */
  async function visibleSearch(page: import('playwright').Page) {
    await page.locator('input[id^="search-"]').first().waitFor({ state: 'attached' });
    return page.evaluate(() => {
      const inputs = [...document.querySelectorAll<HTMLInputElement>('input[id^="search-"]')];
      const input = inputs.find((i) => i.offsetParent !== null) ?? inputs[0];
      return input?.id ?? null;
    });
  }

  test('announces the result count, and clearing leaves nothing stale', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.desktop });
    try {
      await goto('/');
      const id = await visibleSearch(page);
      expect(id).toBeTruthy();

      const input = page.locator(`#${id}`);
      const status = page.locator(`#${id}-status`);
      const results = page.locator(`#${id}-results`);

      expect(await status.textContent()).toBe('');

      await input.fill('electric');
      await expect.poll(() => status.textContent(), { timeout: 5_000 }).toMatch(/\d+ results? for/);
      expect(await results.isVisible()).toBe(true);
      expect(await results.getAttribute('aria-busy')).toBe('false');

      // Clearing must empty the live region, or a screen reader re-reads a count
      // for a search that no longer exists.
      await page.locator(`#${id}-clear`).click();
      await expect.poll(() => status.textContent()).toBe('');
      await expect.poll(() => results.isVisible()).toBe(false);
    } finally {
      await context.close();
    }
  });

  test('announces an empty result set', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.desktop });
    try {
      await goto('/');
      const id = await visibleSearch(page);
      const status = page.locator(`#${id}-status`);

      await page.locator(`#${id}`).fill('zzzqqqxyzzy');
      await expect.poll(() => status.textContent(), { timeout: 5_000 }).toMatch(/No results found/);
    } finally {
      await context.close();
    }
  });

  test('clearing inside the debounce window does not reopen results', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.desktop });
    try {
      await goto('/');
      const id = await visibleSearch(page);
      const input = page.locator(`#${id}`);
      const results = page.locator(`#${id}-results`);
      const status = page.locator(`#${id}-status`);

      // Type and clear well inside the 300ms debounce, then let it elapse.
      await input.fill('el');
      await page.waitForTimeout(120);
      await page.locator(`#${id}-clear`).click();
      await page.waitForTimeout(700);

      expect(await input.inputValue()).toBe('');
      expect(await results.isVisible()).toBe(false);
      expect(await status.textContent()).toBe('');

      // A real query afterwards still works.
      await input.fill('electric');
      await expect.poll(() => results.isVisible(), { timeout: 5_000 }).toBe(true);
    } finally {
      await context.close();
    }
  });

  test('fetches the corpus once, on intent, and shares it between both controls', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.desktop });
    try {
      const requested: string[] = [];
      page.on('request', (request) => {
        const path = new URL(request.url()).pathname;
        if (path === '/search-index.json') requested.push(path);
      });

      await goto('/');
      const id = await visibleSearch(page);

      // R19: nothing is fetched until the reader shows intent.
      expect(requested).toHaveLength(0);
      // And the corpus is no longer inlined into the document.
      expect(await page.content()).not.toContain('searchDataJson');

      await page.locator(`#${id}`).focus();
      await expect.poll(() => requested.length, { timeout: 5_000 }).toBe(1);

      await page.locator(`#${id}`).fill('electric');
      await expect
        .poll(() => page.locator(`#${id}-status`).textContent(), { timeout: 5_000 })
        .toMatch(/\d+ results? for/);

      // Focusing the other control must reuse the shared promise, not refetch.
      const other = await page.evaluate(() => {
        const inputs = [...document.querySelectorAll<HTMLInputElement>('input[id^="search-"]')];
        return inputs[inputs.length - 1]?.id ?? null;
      });
      if (other && other !== id) {
        await page.locator(`#${other}`).focus();
        await page.waitForTimeout(500);
      }
      expect(requested).toHaveLength(1);
    } finally {
      await context.close();
    }
  });

  test('a failed corpus load says so instead of claiming no results', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.desktop });
    try {
      await page.route('**/search-index.json*', (route) => route.abort());

      await goto('/');
      const id = await visibleSearch(page);
      await page.locator(`#${id}`).fill('electric');

      const status = page.locator(`#${id}-status`);
      await expect.poll(() => status.textContent(), { timeout: 5_000 }).toMatch(/unavailable/i);
      expect(await page.locator(`#${id}-error`).isVisible()).toBe(true);
      // "No results found" would be a lie about a network failure.
      expect(await page.locator(`#${id}-no-results`).isVisible()).toBe(false);

      // Retrying is just searching again — the failure is not memoized.
      await page.unroute('**/search-index.json*');
      await page.locator(`#${id}`).fill('electric cars');
      await expect.poll(() => status.textContent(), { timeout: 5_000 }).toMatch(/\d+ results? for/);
      expect(await page.locator(`#${id}-error`).isVisible()).toBe(false);
    } finally {
      await context.close();
    }
  });

  test('works from the mobile search panel too', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.mobile });
    try {
      await goto('/');
      await page.locator('#mobile-search-toggle').click();
      await expect
        .poll(() => page.locator('#mobile-search-toggle').getAttribute('aria-expanded'))
        .toBe('true');

      const id = await visibleSearch(page);
      expect(id).toBeTruthy();

      await page.locator(`#${id}`).fill('electric');
      await expect
        .poll(() => page.locator(`#${id}-status`).textContent(), { timeout: 5_000 })
        .toMatch(/\d+ results? for/);
    } finally {
      await context.close();
    }
  });
});

describe('image rotator autoplay (R11)', () => {
  test('a reader pause survives the pointer leaving', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.desktop });
    try {
      await goto(ROTATOR_POST);

      const rotator = page.locator('.image-rotator').first();
      const button = rotator.locator('.rotator-playback');
      const counter = rotator.locator('.current-index');

      await expect.poll(() => button.isVisible()).toBe(true);
      expect((await button.textContent())?.trim()).toBe('Pause slideshow');

      // It advances on its own to begin with.
      const start = await counter.textContent();
      await expect
        .poll(() => counter.textContent(), { timeout: ROTATION_PERIOD_MS + 2_000 })
        .not.toBe(start);

      await button.click();
      expect((await button.textContent())?.trim()).toBe('Play slideshow');

      const paused = await counter.textContent();
      await page.waitForTimeout(ROTATION_PERIOD_MS);
      expect(await counter.textContent()).toBe(paused);

      // Pointer in and back out again must not undo the reader's choice.
      await rotator.hover();
      await page.mouse.move(0, 0);
      await page.waitForTimeout(ROTATION_PERIOD_MS);
      expect(await counter.textContent()).toBe(paused);
      expect((await button.textContent())?.trim()).toBe('Play slideshow');
    } finally {
      await context.close();
    }
  });

  test('reduced motion never auto-advances, but still offers the control', async () => {
    const { page, context, goto } = await openPage({
      viewport: VIEWPORTS.desktop,
      reducedMotion: 'reduce',
    });
    try {
      await goto(ROTATOR_POST);

      const rotator = page.locator('.image-rotator').first();
      const button = rotator.locator('.rotator-playback');
      const counter = rotator.locator('.current-index');

      await expect.poll(() => button.isVisible()).toBe(true);
      // Starts paused, and says so, rather than hiding the control.
      expect((await button.textContent())?.trim()).toBe('Play slideshow');

      const start = await counter.textContent();
      await page.waitForTimeout(ROTATION_PERIOD_MS);
      expect(await counter.textContent()).toBe(start);

      // A reader who wants motion can still opt in.
      await button.click();
      expect((await button.textContent())?.trim()).toBe('Pause slideshow');

      // Clicking leaves the pointer resting on the rotator, and hover holds
      // rotation by design — so nothing moves until the pointer leaves.
      await page.waitForTimeout(ROTATION_PERIOD_MS);
      expect(await counter.textContent()).toBe(start);

      await page.mouse.move(0, 0);
      await expect
        .poll(() => counter.textContent(), { timeout: ROTATION_PERIOD_MS + 2_000 })
        .not.toBe(start);
    } finally {
      await context.close();
    }
  });

  test('manual navigation still works while paused', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.desktop });
    try {
      await goto(ROTATOR_POST);
      const rotator = page.locator('.image-rotator').first();
      await rotator.locator('.rotator-playback').click();

      const counter = rotator.locator('.current-index');
      const before = await counter.textContent();
      await rotator.locator('.nav-next').click();
      expect(await counter.textContent()).not.toBe(before);
    } finally {
      await context.close();
    }
  });
});

describe('mobile navigation', () => {
  test('opens as a modal dialog and returns focus to the trigger', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.mobile });
    try {
      await goto('/');

      const trigger = page.locator('#mobile-menu-button');
      const menu = page.locator('dialog#mobile-menu');

      expect(await trigger.getAttribute('aria-expanded')).toBe('false');
      await trigger.click();

      await expect.poll(() => menu.evaluate((d: HTMLDialogElement) => d.open)).toBe(true);
      expect(await menu.evaluate((d: HTMLDialogElement) => d.matches(':modal'))).toBe(true);
      await expect.poll(() => trigger.getAttribute('aria-expanded')).toBe('true');

      await page.keyboard.press('Escape');
      await expect.poll(() => menu.evaluate((d: HTMLDialogElement) => d.open)).toBe(false);
      await expect.poll(() => trigger.getAttribute('aria-expanded')).toBe('false');
      expect(await page.evaluate(() => document.activeElement?.id)).toBe('mobile-menu-button');
    } finally {
      await context.close();
    }
  });

  test('closes from its close button', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.mobile });
    try {
      await goto('/');
      await page.locator('#mobile-menu-button').click();

      const menu = page.locator('dialog#mobile-menu');
      await expect.poll(() => menu.evaluate((d: HTMLDialogElement) => d.open)).toBe(true);

      await page.locator('#close-mobile-menu').click();
      await expect.poll(() => menu.evaluate((d: HTMLDialogElement) => d.open)).toBe(false);
    } finally {
      await context.close();
    }
  });
});

describe('theme', () => {
  test('a chosen theme survives a reload', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.desktop });
    try {
      await goto('/');

      const toggle = page.locator('#theme-toggle');
      await expect.poll(() => toggle.count()).toBe(1);

      const before = await page.evaluate(() =>
        document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      );

      await toggle.click();
      const after = await page.evaluate(() =>
        document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      );
      expect(after).not.toBe(before);
      expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(after);

      await page.reload({ waitUntil: 'domcontentloaded' });
      const afterReload = await page.evaluate(() =>
        document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      );
      expect(afterReload).toBe(after);
    } finally {
      await context.close();
    }
  });
});

describe('bilingual routing', () => {
  test('a Spanish twin is reachable and declares its language', async () => {
    const { page, context, goto } = await openPage({ viewport: VIEWPORTS.desktop });
    try {
      await goto('/p/boundaries-miscalibration-unconditional-love-es/');
      expect(await page.evaluate(() => document.documentElement.lang)).toBe('es');

      await goto('/p/boundaries-miscalibration-unconditional-love/');
      expect(await page.evaluate(() => document.documentElement.lang)).toBe('en');
    } finally {
      await context.close();
    }
  });
});
