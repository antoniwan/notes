# Research: Professional UI/UX Refinement Pass

## Decision 1: Drive refinements through shared system primitives first

- **Decision**: Prioritize adjustments to shared typographic scale, spacing rhythm, and layout container rules before page-specific styling.
- **Rationale**: System-first updates maximize consistency across all public-facing templates and reduce one-off styling drift.
- **Alternatives considered**:
  - Patch each page independently (rejected: high inconsistency and rework risk).
  - Restrict to only top-traffic pages (rejected: conflicts with clarified full public-template scope).

## Decision 2: Preserve structure and interactions as hard guardrails

- **Decision**: Treat content order, route structure, and interaction behavior as non-negotiable constraints during implementation.
- **Rationale**: The feature goal is polish and legibility, not product behavior changes; this minimizes regression risk.
- **Alternatives considered**:
  - Introduce new interaction affordances (rejected: outside scope).
  - Rearrange content architecture to improve hierarchy (rejected: violates spec constraints).

## Decision 3: Use template-by-breakpoint coverage as completion criteria

- **Decision**: Validate one representative page per public-facing template at mobile, tablet, and desktop breakpoints.
- **Rationale**: Balances QA rigor and execution speed while ensuring each template class is verified.
- **Alternatives considered**:
  - Validate every page instance (rejected: excessive effort for similar template variants).
  - Validate a small ad hoc sample only (rejected: insufficient coverage confidence).

## Decision 4: Make accessibility measurable with WCAG 2.2 AA checks

- **Decision**: Enforce WCAG 2.2 AA contrast and text legibility expectations on refined templates.
- **Rationale**: Converts subjective readability goals into objective acceptance criteria.
- **Alternatives considered**:
  - Keep accessibility qualitative (rejected: ambiguous QA outcomes).
  - Target AAA universally (rejected: likely over-constraining for this pass).

## Implementation Audit Notes (System-First Targets)

- **Global typography + spacing source**: `src/styles/global.css` is the highest leverage surface for cross-template hierarchy and rhythm updates.
- **Long-form layout surface**: `src/layouts/BlogLayout.astro` controls post-page structural spacing, metadata rail rhythm, and content column balance.
- **Homepage + About per-template polish**: `src/pages/index.astro` and `src/pages/about.astro` receive local spacing/alignment refinements while preserving content/interactions.
- **Repeated card/list modules**: `src/components/PostCard.astro`, `src/components/RelatedPosts.astro`, and `src/components/post-toc/PostTocModal.astro` are tuned to reduce alignment drift across pages.
