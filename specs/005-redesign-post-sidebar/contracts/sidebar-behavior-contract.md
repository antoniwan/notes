# Contract: Post Sidebar Behavior and Usability

## Purpose

Define observable behavior and acceptance obligations for the redesigned post sidebar and mobile metadata flow.

## Scope Contract

- Applies to post pages and their mobile-equivalent metadata presentation.
- Preserves existing feature capabilities (read signal, taxonomy navigation, social sharing, metadata visibility).
- Allows hierarchy, grouping, and disclosure refinements focused on legibility and usability.

## Information Hierarchy Contract

- Required sidebar group order:
  1. Post context
  2. Reading signals
  3. Taxonomy
  4. Actions
  5. Secondary metadata
- Group semantics must remain consistent on desktop and mobile, even when presentation differs.

## Taxonomy Contract

- All assigned categories must be accessible as links in the taxonomy area.
- Primary category for constrained single-slot surfaces must be the first category in frontmatter order.
- If more than three categories exist, show first three by default and provide `Show all` to reveal the full set.
- Tag link behavior must remain unchanged.

## Mobile Disclosure Contract

- Metadata sections are collapsed by default on mobile.
- Each collapsible section must expose a clear header and tap-to-expand behavior.
- Mobile disclosure behavior must not hide taxonomy/action availability entirely.

## Feature Preservation Contract

- Existing read-time/read-state behavior and visibility must remain intact.
- Existing sharing capability must remain available and appear in the Actions group after taxonomy/metadata.
- Existing publication metadata fields (published/updated/read time/tags/author where applicable) must remain supported.

## Regression Contract

- No clipping, overflow, or overlap in representative post pages at mobile, tablet, and desktop.
- No functional regression in taxonomy navigation, read-state signal behavior, or sharing interactions.

## Exit Criteria

- All contract obligations above are satisfied on representative post pages.
- Quality gates pass: `pnpm run format:check`, `pnpm run check`, `pnpm run build`.
