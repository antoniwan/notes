# Quickstart: Implement Professional UI/UX Refinement Pass

## 1) Confirm branch and planning artifacts

- Work on branch: `004-ui-ux-refinement`
- Primary planning docs:
  - `specs/004-ui-ux-refinement/spec.md`
  - `specs/004-ui-ux-refinement/plan.md`
  - `specs/004-ui-ux-refinement/research.md`
  - `specs/004-ui-ux-refinement/data-model.md`
  - `specs/004-ui-ux-refinement/contracts/visual-refinement-contract.md`

## 2) Establish baseline and template inventory

- Enumerate all public-facing templates and select one representative page instance for each.
- Capture baseline screenshots/notes for mobile, tablet, and desktop breakpoints.

### Baseline representative routes

- `/`, `/about`, `/p/[...slug]`, `/everything`, `/category`, `/category/[category]`
- `/tag`, `/tag/[tag]`, `/guided-path`, `/library`, `/library/books`
- `/tag-management`, `/brain-science`, `/api`, `/404`

### Baseline capture notes

- Record typography hierarchy before/after for each representative route.
- Record spacing/alignment deltas for header, content body, side/meta blocks, and cards.
- Record contrast checks for body text, headings, metadata text, and interactive links/buttons.

## 3) Apply system-first refinement

- Update shared visual primitives first (typography roles, spacing rhythm, alignment rules).
- Then apply targeted template-specific refinements where needed.
- Keep content, routes, and interactions unchanged.

## 4) Validate acceptance criteria

- Validate each representative template page at mobile/tablet/desktop.
- Confirm hierarchy, spacing, alignment, legibility, and WCAG 2.2 AA contrast expectations pass.
- Confirm no clipping/overlap/overflow and no interaction regressions.
- For `SC-002`, build a sampled long-form set from representative post pages: include at least 10 long-form pages when available (or all long-form pages if fewer), and compute pass rate as `pages meeting readability checks / sampled long-form pages`; target is `>= 90%`.

### Visual QA checklist

- Hierarchy: title, heading levels, body, and metadata are visually distinct.
- Spacing: vertical rhythm is consistent within and across templates.
- Alignment: containers and repeated components align to shared grid logic.
- Legibility: body copy remains readable on mobile/tablet/desktop.
- Accessibility: WCAG 2.2 AA contrast passes for text and essential UI states.

## 5) Run quality gates

```bash
pnpm run format:check
pnpm run check
pnpm run build
```

## 6) Ready for task breakdown

- Proceed to `/speckit.tasks` once all contracts and validation checks are satisfied.

## Implementation Execution Notes (2026-04-09)

- Baseline representative route set documented in this file and in `data-model.md`.
- Shared typography/spacing/alignment refinements applied to:
  - `src/styles/global.css`
  - `src/layouts/BlogLayout.astro`
  - `src/pages/index.astro`
  - `src/pages/about.astro`
  - `src/components/PostCard.astro`
  - `src/components/related-posts/RelatedPosts.astro`
  - `src/components/post-toc/PostTocModal.astro`
- Quality gates executed successfully:
  - `pnpm run format:check` -> pass
  - `pnpm run check` -> pass
  - `pnpm run build` -> pass
- Visual QA matrix recorded as complete for representative template classes under the contract criteria; no interaction or routing changes were introduced.
