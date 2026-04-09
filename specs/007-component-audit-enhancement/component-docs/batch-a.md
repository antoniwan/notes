# Baseline documentation — Batch A

One section per component. Scenarios and cross-cutting constraints are summarized in `scenarios-and-constraints.md` and `dependencies-and-contexts.md`.

## CMP-001 — `src/components/BackToTop.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Scroll-to-top affordance after reading.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-002 — `src/components/BaseHead.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Document head: meta, fonts, global links.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-003 — `src/components/Breadcrumbs.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Taxonomy/path breadcrumbs on pages.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-004 — `src/components/CategoryCard.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Card linking to a category.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-005 — `src/components/Chapter.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Chapter/section wrapper for longform content.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-006 — `src/components/Comments.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Remark42 (or configured) comments embed.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-007 — `src/components/Container.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Width-constrained page container.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-008 — `src/components/DefaultImage.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Fallback/placeholder image handling.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-009 — `src/components/Disclaimer.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Legal or editorial disclaimer block.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-010 — `src/components/FeaturedWritingsRotator.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Rotating featured posts teaser.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-011 — `src/components/Footer.astro`

- **Type**: public-ui
- **Primary context**: global shell
- **Purpose**: Site footer links and meta.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-012 — `src/components/FormattedDate.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Localized date display.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-013 — `src/components/Header.astro`

- **Type**: public-ui
- **Primary context**: global shell
- **Purpose**: Site header: logo, nav, theme/search triggers.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-014 — `src/components/HighlightsMasonry.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Masonry grid of highlights.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-015 — `src/components/ImageRotator.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Rotating hero or gallery images.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-016 — `src/components/LanguageToggle.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: EN/ES (or configured) language switch.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.
