import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs'],
    // Pure utils and build-script helpers — no Astro SSR harness in this suite.
    // Browser journeys live in vitest.browser.config.ts.
  },
});
