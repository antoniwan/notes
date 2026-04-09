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

## 3) Apply system-first refinement

- Update shared visual primitives first (typography roles, spacing rhythm, alignment rules).
- Then apply targeted template-specific refinements where needed.
- Keep content, routes, and interactions unchanged.

## 4) Validate acceptance criteria

- Validate each representative template page at mobile/tablet/desktop.
- Confirm hierarchy, spacing, alignment, legibility, and WCAG 2.2 AA contrast expectations pass.
- Confirm no clipping/overlap/overflow and no interaction regressions.
- For `SC-002`, build a sampled long-form set from representative post pages: include at least 10 long-form pages when available (or all long-form pages if fewer), and compute pass rate as `pages meeting readability checks / sampled long-form pages`; target is `>= 90%`.

## 5) Run quality gates

```bash
pnpm run format:check
pnpm run check
pnpm run build
```

## 6) Ready for task breakdown

- Proceed to `/speckit.tasks` once all contracts and validation checks are satisfied.
