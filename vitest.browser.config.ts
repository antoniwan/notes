import { defineConfig } from 'vitest/config';

/**
 * Browser regression journeys, kept out of `pnpm test` on purpose.
 *
 * They need `dist/client` from a completed build and a Chromium binary, so they
 * are a separate command (`pnpm run test:browser`) and a separate CI step after
 * the build. The unit suite stays fast and dependency-free.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/browser/**/*.test.ts'],
    // One browser and one server per file; parallel files would multiply both.
    fileParallelism: false,
    // Journeys wait on real debounce and carousel intervals.
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
