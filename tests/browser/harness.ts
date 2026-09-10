/**
 * Shared harness for the browser regression journeys.
 *
 * These tests run against the real build output in `dist/client`, served by
 * `scripts/serve-dist.mjs`, in headless Chromium driven by the `playwright`
 * library. The library is already a devDependency; the `@playwright/test`
 * runner is not, so Vitest stays the only test runner in this repo.
 *
 * They need `pnpm run build` to have run first. `pnpm run test:browser` does not
 * build for you — building inside a test run makes a failure ambiguous between
 * the build and the behavior.
 */

import type { Browser, BrowserContext, Page } from 'playwright';
import { chromium } from 'playwright';
import type { Server } from 'node:http';

import { createDistServer, listen } from '../../scripts/serve-dist.mjs';

/** Widths the audit asked these journeys to cover. */
export const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
} as const;

let server: Server | null = null;
let browser: Browser | null = null;
let baseUrl = '';
let boundPort = 0;

/** Starts one server and one browser for the whole file. */
export async function startHarness(): Promise<string> {
  server = createDistServer();
  // Port 0 lets the OS pick a free one, so a stray dev server never collides
  // and two test files can never fight over a fixed port.
  baseUrl = await listen(server, { host: '127.0.0.1', port: 0 });
  boundPort = Number(new URL(baseUrl).port);
  browser = await chromium.launch();
  return baseUrl;
}

export async function stopHarness(): Promise<void> {
  await browser?.close();
  browser = null;
  await new Promise<void>((done) => {
    if (!server) return done();
    server.close(() => done());
  });
  server = null;
}

export interface PageOptions {
  viewport?: { width: number; height: number };
  reducedMotion?: 'reduce' | 'no-preference';
  colorScheme?: 'light' | 'dark';
  /**
   * Interaction journeys block service workers so a cached response from an
   * earlier run can never stand in for the build under test. The service-worker
   * suite is the one place that needs them allowed.
   */
  serviceWorkers?: 'allow' | 'block';
}

/** Opens an isolated context so storage never leaks between journeys. */
export async function openPage(options: PageOptions = {}): Promise<{
  page: Page;
  context: BrowserContext;
  goto: (path: string) => Promise<void>;
  origin: string;
}> {
  if (!browser) throw new Error('startHarness() must run before openPage()');

  const context = await browser.newContext({
    viewport: options.viewport ?? VIEWPORTS.desktop,
    reducedMotion: options.reducedMotion ?? 'no-preference',
    colorScheme: options.colorScheme ?? 'light',
    // Blocked by default: a cached response from an earlier run must never
    // stand in for the build under test. tests/browser/service-worker.test.ts
    // opts back in.
    serviceWorkers: options.serviceWorkers ?? 'block',
  });
  const page = await context.newPage();

  return {
    page,
    context,
    origin: baseUrl,
    goto: async (path: string) => {
      // 'load', not 'domcontentloaded': evaluating against a document that is
      // still committing produced "Execution context was destroyed" flakes.
      await page.goto(`${baseUrl}${path}`, { waitUntil: 'load' });
    },
  };
}

/**
 * Stops the server so nothing on the origin can be reached.
 *
 * `context.setOffline(true)` is not enough for service-worker tests: it emulates
 * the *page's* network, while the worker's own `fetch()` still reaches the
 * server. An offline assertion written against it passes whether or not the
 * cache is doing anything. Taking the server down is the only way to know.
 */
export async function stopServing(): Promise<void> {
  if (!server) return;
  const closing = new Promise<void>((done) => server!.close(() => done()));
  // close() only stops new connections; keep-alive sockets would survive it.
  server.closeAllConnections();
  await closing;
  server = null;
}

/** Brings the origin back up on the same port. */
export async function resumeServing(): Promise<void> {
  if (server) return;
  server = createDistServer();
  await listen(server, { host: '127.0.0.1', port: boundPort });
}

/** A post that renders an ImageRotator with autoplay, for the carousel journey. */
export const ROTATOR_POST = '/p/why-electric-cars-cant-look-like-electric-cars/';

/** A post with prose images, for the lightbox journey. */
export const LIGHTBOX_POST = '/p/my-crimson-desert-review-after-200-hours/';
