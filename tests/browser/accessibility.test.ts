import AxeBuilder from '@axe-core/playwright';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { openPage, startHarness, stopHarness } from './harness';

/**
 * One page per template. 7.4.1 fixed 68 axe violations found by hand; this keeps
 * the serious and critical ones from coming back unnoticed.
 */
const PAGES = [
  '/',
  '/browse/',
  '/archive/',
  '/about/',
  '/p/i-dont-write-the-code/',
  '/p/yo-no-escribo-el-codigo/',
  '/p/carrot-cake-portions/',
  '/p/my-crimson-desert-review-after-200-hours/',
  '/es/',
  '/series/game-reviews/',
];

beforeAll(startHarness);
afterAll(stopHarness);

describe('accessibility (axe, WCAG 2.1 AA)', () => {
  for (const path of PAGES) {
    for (const colorScheme of ['light', 'dark'] as const) {
      test(`${path} has no serious or critical violations (${colorScheme})`, async () => {
        const { page, context, goto } = await openPage({ colorScheme, reducedMotion: 'reduce' });
        try {
          await goto(path);
          const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();
          const blocking = results.violations
            .filter((v) => v.impact === 'serious' || v.impact === 'critical')
            .map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0]?.target.join(' ')}`);
          expect(blocking).toEqual([]);
        } finally {
          await context.close();
        }
      });
    }
  }
});
