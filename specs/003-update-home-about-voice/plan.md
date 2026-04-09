# Implementation Plan: Homepage and About Voice Refresh

**Branch**: `003-update-home-about-voice` | **Date**: 2026-04-09 | **Spec**: `specs/003-update-home-about-voice/spec.md`  
**Input**: Feature specification from `specs/003-update-home-about-voice/spec.md`

## Summary

Refresh homepage and About messaging to reflect the author's "season of execution" narrative while preserving voice continuity with recent essays. Allow targeted homepage layout/design refinements to support the new narrative, with a hard constraint that the new masonry pattern remains unchanged.

## Technical Context

**Language/Version**: TypeScript 5.x + Astro 6.x  
**Primary Dependencies**: Astro, Tailwind CSS, existing layout/components, content collection pipeline  
**Storage**: N/A (static content/pages only)  
**Testing**: `pnpm run check`, `pnpm run build`, `pnpm run format:check`, manual content/UX review  
**Target Platform**: Static web deployment (Astro prerendered site)  
**Project Type**: Content-driven web application (blog)  
**Performance Goals**: No measurable regression in homepage rendering behavior; maintain current UX responsiveness  
**Constraints**: Preserve masonry presentation/behavior; no new tracking; keep static-first architecture  
**Scale/Scope**: Update homepage narrative/design accents and About primary narrative sections only

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **Content / feeds / SEO:** No frontmatter schema, feed generator, sitemap, or structured-data contract changes expected. Content validators are optional unless metadata files are touched.
- **Architecture:** Pass. Static-first preserved; no new routes, SSR-only behavior, or server persistence introduced.
- **Privacy:** Pass. No new analytics, trackers, or server-side reader state.
- **Quality gates:** Must pass `pnpm run check`, `pnpm run build`, and `pnpm run format:check`.
- **Layout:** Pass. Changes are limited to existing `src/pages/index.astro`, `src/pages/about.astro`, and related existing components, while masonry remains unchanged.

## Project Structure

### Documentation (this feature)

```text
specs/003-update-home-about-voice/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── content-voice-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── pages/
│   ├── index.astro
│   └── about.astro
└── components/
    └── HighlightsMasonry.astro
```

**Structure Decision**: Use the existing single-project Astro structure and update only existing homepage/About surfaces; avoid introducing new route areas or architecture layers.

## Phase 0: Research

Research findings are documented in `specs/003-update-home-about-voice/research.md` and resolve style/scope decisions for:

- voice consistency method,
- homepage refinement boundaries,
- acceptance-review approach for non-functional narrative quality.

## Phase 1: Design & Contracts

Design artifacts produced:

- `specs/003-update-home-about-voice/data-model.md`
- `specs/003-update-home-about-voice/contracts/content-voice-contract.md`
- `specs/003-update-home-about-voice/quickstart.md`

Agent context update step:

- Run `.specify/scripts/bash/update-agent-context.sh cursor-agent`

## Post-Design Constitution Check

- **Architecture:** Still static-first, no API/SSR expansion.
- **Privacy:** No new tracking or persistence.
- **Quality gates:** Remain `check`, `build`, `format:check`.
- **Layout constraint:** Masonry remains mandatory and unchanged in behavior.
- **Compliance result:** PASS

## Complexity Tracking

No constitution violations requiring justification.
