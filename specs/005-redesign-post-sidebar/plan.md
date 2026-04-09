# Implementation Plan: Post Sidebar Usability Redesign

**Branch**: `005-redesign-post-sidebar` | **Date**: 2026-04-09 | **Spec**: `specs/005-redesign-post-sidebar/spec.md`  
**Input**: Feature specification from `specs/005-redesign-post-sidebar/spec.md`

## Summary

Redesign the post sidebar to improve long-form reading usability and taxonomy discoverability while preserving existing feature capabilities. The implementation will keep the static-first Astro architecture, retain current metadata/share/read-state behaviors, expose full multi-category visibility with controlled overflow behavior, and align desktop/mobile sidebar information architecture for legibility-first publication UX.

## Technical Context

**Language/Version**: TypeScript 5.x + Astro 6.x  
**Primary Dependencies**: Astro layout/component system, Tailwind CSS utility styling, existing post metadata/read-state/share components  
**Storage**: Browser-local state only for read status (existing behavior); no new server storage  
**Testing**: `pnpm run format:check`, `pnpm run check`, `pnpm run build`, focused manual UX QA on representative post pages  
**Target Platform**: Static web deployment (Astro prerendered site)  
**Project Type**: Content-driven web application (publication/blog)  
**Performance Goals**: No perceived regression in post-page rendering/scanning; preserve existing static delivery characteristics  
**Constraints**: Preserve existing interactions/features; static-first; no new trackers; mobile metadata collapsed by default; first-category breadcrumb rule; category overflow via first 3 + Show all  
**Scale/Scope**: Post-page sidebar and mobile-equivalent metadata presentation for all post entries including multi-category posts

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify the plan against `.specify/memory/constitution.md` (Notes blog/platform):

- **Content / feeds / SEO:** No frontmatter schema, feed generation, sitemap, or JSON-LD contract changes are planned. Existing canonical/SEO behavior remains unchanged.
- **Architecture:** Pass. Static-first remains intact. No new API routes, SSR-only behavior, or server-persisted reader state.
- **Privacy:** Pass. No new analytics/tracking and no server-side reader tracking introduced.
- **Quality gates:** Must pass `pnpm run format:check`, `pnpm run check`, and `pnpm run build`.
- **Layout:** Pass. Work is localized to existing post layout/components; no new route area required.

## Project Structure

### Documentation (this feature)

```text
specs/005-redesign-post-sidebar/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── sidebar-behavior-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── layouts/
│   └── BlogLayout.astro
├── pages/
│   └── p/[...slug].astro
├── components/
│   ├── Breadcrumbs.astro
│   ├── SocialShare.astro
│   └── post-toc/
└── utils/
    └── categoryUtils.ts
```

**Structure Decision**: Use the existing single-project Astro structure and implement the redesign in existing post layout/component surfaces to minimize regression risk and preserve current behavior.

## Phase 0: Research

Research findings are documented in `specs/005-redesign-post-sidebar/research.md` and resolve:

- primary-category rule for single-slot surfaces,
- share-control placement in hierarchy,
- category-overflow disclosure behavior,
- mobile collapsed-by-default metadata strategy.

## Phase 1: Design & Contracts

Design artifacts produced:

- `specs/005-redesign-post-sidebar/data-model.md`
- `specs/005-redesign-post-sidebar/contracts/sidebar-behavior-contract.md`
- `specs/005-redesign-post-sidebar/quickstart.md`

Agent context update step:

- Run `.specify/scripts/bash/update-agent-context.sh cursor-agent`

## Post-Design Constitution Check

- **Content / feeds / SEO:** Still no schema/feed/structured-data contract changes.
- **Architecture:** Static-first preserved; no server-state additions.
- **Privacy:** No new tracking; reader-state remains browser-local.
- **Quality gates:** `format:check`, `check`, and `build` remain required.
- **Compliance result:** PASS

## Complexity Tracking

No constitution violations requiring justification.
