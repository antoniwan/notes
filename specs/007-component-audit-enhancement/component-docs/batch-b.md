# Baseline documentation — Batch B

One section per component. Scenarios and cross-cutting constraints are summarized in `scenarios-and-constraints.md` and `dependencies-and-contexts.md`.

## CMP-017 — `src/components/LatestWatched.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Latest watched / activity teaser.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-018 — `src/components/LazyPosts.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Deferred-loaded post list.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-019 — `src/components/Logo.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Site logo mark and home link.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-020 — `src/components/MobileNav.astro`

- **Type**: public-ui
- **Primary context**: global shell
- **Purpose**: Mobile navigation drawer/sheet.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-021 — `src/components/Navigation.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Primary navigation links.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-022 — `src/components/NotFoundQuote.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: 404 page quote or personality content.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-023 — `src/components/PageHeader.astro`

- **Type**: public-ui
- **Primary context**: global shell
- **Purpose**: Page title and intro region.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-024 — `src/components/PerformanceMonitor.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Dev-oriented performance overlay (client).
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-025 — `src/components/PostCard.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Post summary card for listings.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-026 — `src/components/ReadStateServiceInit.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Client init for read-state/local signals.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-027 — `src/components/ReadingProgress.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Reading progress indicator (client-local).
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-028 — `src/components/RelatedPosts.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Related posts list on post pages.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-029 — `src/components/SearchBar.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Site search input and affordances.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-030 — `src/components/ServiceWorkerRegistration.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Registers service worker when enabled.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-031 — `src/components/SocialShare.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Share actions for a post.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-032 — `src/components/StructuredData.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: JSON-LD / structured data emission.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.
