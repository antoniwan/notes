# Contract: Visual Refinement Acceptance

## Purpose

Define non-functional acceptance obligations for the UI/UX refinement pass so implementation and QA remain aligned with spec constraints.

## Scope Contract

- Applies to all public-facing templates currently in the site.
- Preserves existing content, route structure, and interaction behavior.
- Allows visual changes to hierarchy, typography, spacing, alignment, and polish only.

## Accessibility Contract

- Refined templates must satisfy WCAG 2.2 AA contrast expectations for text and essential UI states.
- Typography roles must remain clearly distinguishable (title, heading levels, body, metadata).

## Coverage Contract

- For each public template, one representative page instance must be validated.
- Validation must be completed at three breakpoint classes: mobile, tablet, desktop.
- Long-form readability sampling (`SC-002`) must use at least 10 long-form post pages when available, or all long-form pages when fewer than 10 exist.
- `SC-002` pass formula: `pages meeting readability checks / sampled long-form pages`, with target `>= 90%`.
- Required checks per template/breakpoint:
  - hierarchy clarity,
  - spacing consistency,
  - alignment consistency,
  - legibility,
  - contrast conformance.

## Regression Contract

- No clipping, overlap, unintended overflow, or readability regressions on representative pages.
- No functional regression to existing navigation or interaction patterns.

## Exit Criteria

- All template/breakpoint checks pass.
- Quality gates pass: `pnpm run format:check`, `pnpm run check`, `pnpm run build`.

## Completion Evidence (2026-04-09)

- Shared refinement surfaces updated (global styles, post layout, homepage/about templates, repeated card/list components, post TOC modal).
- Quality gates passed in implementation run:
  - `pnpm run format:check`
  - `pnpm run check`
  - `pnpm run build`
- Scope guardrails preserved:
  - no route changes,
  - no content-model/frontmatter changes,
  - no interaction model additions.
