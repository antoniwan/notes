# Quality gates (007)

Recorded **2026-04-09** from repo root `/Users/antonio.rodriguez@sbdinc.com/Developer/p/notes`.

| Command                 | Exit code | Notes                                                                          |
| ----------------------- | --------: | ------------------------------------------------------------------------------ |
| `pnpm run lint`         |         0 | ESLint completed; Node may emit ESLintIgnoreWarning for legacy `.eslintignore` |
| `pnpm run check`        |         0 | `astro check` — 0 errors (ServiceWorkerRegistration hints only)                |
| `pnpm run format:check` |         0 | Prettier — all matched files pass                                              |
| `pnpm run build`        |         0 | Static build completed (388 pages)                                             |

## Type-check fix (build health)

`src/components/MobileNav.astro`: added an explicit type for `mobilePrimaryNavigation` entries with optional `priority?: 'contextual'` so `item.priority` is valid for `astro check`. **No intended user-facing behavior change** (existing items omit `priority`, same as before).
