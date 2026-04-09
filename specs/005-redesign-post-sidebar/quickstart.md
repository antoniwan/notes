# Quickstart: Implement Post Sidebar Usability Redesign

## 1) Confirm branch and planning artifacts

- Work on branch: `005-redesign-post-sidebar`
- Primary planning docs:
  - `specs/005-redesign-post-sidebar/spec.md`
  - `specs/005-redesign-post-sidebar/plan.md`
  - `specs/005-redesign-post-sidebar/research.md`
  - `specs/005-redesign-post-sidebar/data-model.md`
  - `specs/005-redesign-post-sidebar/contracts/sidebar-behavior-contract.md`

## 2) Implementation scope and target files

- Primary scope: post sidebar + mobile metadata equivalent.
- Expected touchpoints:
  - `src/layouts/BlogLayout.astro`
  - `src/pages/p/[...slug].astro` (if prop/model adjustments needed)
  - `src/utils/categoryUtils.ts` (if category display helpers are expanded)
  - Related UI helpers/components as needed for safe section grouping.

## 3) Apply hierarchy and behavior rules

- Enforce section order: context -> reading signals -> taxonomy -> actions -> secondary metadata.
- Preserve read-time/read-state behavior and visibility.
- Keep social sharing available in the Actions section after taxonomy/metadata.
- Render all assigned categories as links with overflow behavior:
  - show first 3 by default,
  - reveal full set via `Show all`.
- Use first frontmatter category as primary in single-slot surfaces (breadcrumb rule).
- On mobile, keep metadata sections collapsed by default with clear tap-to-expand headers.

## 4) Validate acceptance criteria

- Confirm multi-category posts show full linked taxonomy set (via default + expansion).
- Confirm breadcrumb primary category follows first category in frontmatter.
- Confirm mobile disclosure defaults are collapsed and functional.
- Confirm no loss of existing features (share/read signal/metadata/tags).
- Verify visual legibility and no overlap/clipping at mobile/tablet/desktop.

## 5) Run quality gates

```bash
pnpm run format:check
pnpm run check
pnpm run build
```

## 6) Ready for task breakdown

- Proceed to `/speckit.tasks` once contract obligations and quality gates are satisfied.
