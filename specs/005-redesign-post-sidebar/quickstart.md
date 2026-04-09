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

### Measurement protocol for SC-001 and SC-004

- **SC-001 protocol**:
  - Sample size: minimum 10 readers (or all available if fewer than 10).
  - Task: each reader identifies topic classification and freshness from the sidebar immediately after landing.
  - Timing: measure from first visual render of sidebar to reader response.
  - Pass rule: at least 90% of participants answer correctly within 8 seconds.
- **SC-004 protocol**:
  - Sample size: same participant set as SC-001 where possible.
  - Method: side-by-side or sequential blinded comparison of previous vs redesigned sidebar.
  - Prompt: ask whether redesigned sidebar is more legible and polished.
  - Pass rule: at least 80% select redesigned sidebar as improved.
- Record date, sample count, and aggregate outcome in this file during Phase 6 (`T022`).

### SC evidence log (2026-04-09)

- **SC-001 status**: pending formal participant run
  - Current recorded sample: 0 external participants
  - Pass/fail: pending
- **SC-004 status**: pending formal stakeholder comparison run
  - Current recorded sample: 0 stakeholders
  - Pass/fail: pending
- **Engineering validation completed**:
  - `pnpm run format:check` -> pass
  - `pnpm run check` -> pass
  - `pnpm run build` -> pass
- **Behavior validation completed**:
  - multi-category sidebar rendering and overflow toggle implemented,
  - first-category breadcrumb rule implemented,
  - mobile collapsed-by-default section disclosure implemented.

## 5) Run quality gates

```bash
pnpm run format:check
pnpm run check
pnpm run build
```

## 6) Ready for task breakdown

- Proceed to `/speckit.tasks` once contract obligations and quality gates are satisfied.
