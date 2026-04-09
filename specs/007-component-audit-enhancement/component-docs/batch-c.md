# Baseline documentation — Batch C

One section per component. Scenarios and cross-cutting constraints are summarized in `scenarios-and-constraints.md` and `dependencies-and-contexts.md`.

## CMP-033 — `src/components/TagCard.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Tag link card.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-034 — `src/components/TagCloud.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Weighted tag cloud.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-035 — `src/components/TagDisplay.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Inline tag list display.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-036 — `src/components/TagSystem.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Tag grouping or system UI.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-037 — `src/components/ThemeToggle.astro`

- **Type**: public-ui
- **Primary context**: varies by route
- **Purpose**: Light/dark theme switch (client-local).
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-038 — `src/components/brain-science/BarChart.astro`

- **Type**: public-ui
- **Primary context**: brain-science
- **Purpose**: Brain Science bar chart visualization.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-039 — `src/components/brain-science/BrainScienceLayout.astro`

- **Type**: public-ui
- **Primary context**: brain-science
- **Purpose**: Brain Science section layout shell.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-040 — `src/components/brain-science/BrainScienceNav.astro`

- **Type**: public-ui
- **Primary context**: brain-science
- **Purpose**: In-section navigation for Brain Science.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-041 — `src/components/brain-science/MetricCard.astro`

- **Type**: public-ui
- **Primary context**: brain-science
- **Purpose**: KPI or metric summary card.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-042 — `src/components/brain-science/ScatterChart.astro`

- **Type**: public-ui
- **Primary context**: brain-science
- **Purpose**: Scatter plot visualization.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-043 — `src/components/brain-science/TimeSeriesChart.astro`

- **Type**: public-ui
- **Primary context**: brain-science
- **Purpose**: Time series chart visualization.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-044 — `src/components/post-toc/PostTocModal.astro`

- **Type**: public-ui
- **Primary context**: post-detail
- **Purpose**: Post table-of-contents modal/drawer.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-045 — `src/layouts/BaseLayout.astro`

- **Type**: layout
- **Primary context**: multiple (wrapped pages)
- **Purpose**: Root HTML shell and global slots.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-046 — `src/layouts/BlogLayout.astro`

- **Type**: layout
- **Primary context**: multiple (wrapped pages)
- **Purpose**: Blog/post page layout and sidebar regions.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-047 — `src/layouts/HomeLayout.astro`

- **Type**: layout
- **Primary context**: multiple (wrapped pages)
- **Purpose**: Home page layout composition.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.

## CMP-048 — `src/layouts/PageLayout.astro`

- **Type**: layout
- **Primary context**: multiple (wrapped pages)
- **Purpose**: Generic interior page layout.
- **Expected behavior (baseline)**: Renders without console errors; respects existing props/slots as consumed by parent layouts/pages; client scripts remain optional and do not persist server-side state.
- **Inputs/outputs**: Follows parent-passed props and Astro slot patterns; see source for exact prop names.
- **Constraints**: Static-first; no new trackers; reader-local state only where already used.
