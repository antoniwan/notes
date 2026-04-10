# Implementation Plan: Tag Content Links Prelude

**Branch**: `010-tag-content-links` | **Date**: 2026-04-10 | **Spec**: `/specs/010-tag-content-links/spec.md`  
**Input**: Feature specification from `/specs/010-tag-content-links/spec.md`

## Summary

Add a sentence-style prelude above the tags cloud on `src/pages/tag/index.astro` that links only to inferred content-form tags, ordered by descending post count with alphabetical tie-breaking. Classification and display use a canonical writing-form vocabulary with singular/plural normalization and canonical plural labels.

## Technical Context

**Language/Version**: TypeScript 5.x in Astro 6.x `.astro` pages/components  
**Primary Dependencies**: Astro content collections (`getCollection`), existing tag UI components (`TagCard`)  
**Storage**: N/A (build-time derived metadata only; no persistent state)  
**Testing**: `pnpm run check`, `pnpm run build`, `pnpm run format:check`  
**Target Platform**: Static Astro site pages in modern browsers  
**Project Type**: Static web application (content-driven blog)  
**Performance Goals**: No perceptible regression on `/tag`; added logic remains linear with tag/post counts  
**Constraints**: Static-first architecture, no new API routes, no server-side tracking, preserve existing tag-cloud behavior  
**Scale/Scope**: Single route enhancement (`/tag`) and related helper/component additions for content-form prelude generation

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **Content / feeds / SEO:** No post frontmatter, feeds, sitemap, or JSON-LD contract changes planned. `docs/frontmatter-spec.md` remains unaffected. Feed/structured-data validators are not required for this scope unless implementation expands.
- **Architecture:** PASS. Change remains static-first and build-time computed in tag page rendering. No SSR-only behavior and no new server endpoints.
- **Privacy:** PASS. No reader tracking, analytics additions, or server-persisted reader state.
- **Quality gates:** MUST pass `pnpm run check`, `pnpm run build`, and `pnpm run format:check` before merge.
- **Layout:** PASS. Route remains in `src/pages/tag/`; new feature-specific UI helper/component should be placed under `src/components/tag/` if extracted from page logic.

Post-design re-check (Phase 1): PASS. Planned artifacts and contracts keep the same static-first/privacy constraints with no constitution violations.

## Project Structure

### Documentation (this feature)

```text
specs/010-tag-content-links/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── tag-content-prelude.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── pages/
│   └── tag/
│       └── index.astro
├── components/
│   ├── TagCard.astro
│   └── tag/
│       └── ContentFormPrelude.astro         # planned new feature component (if extracted)
└── utils/
    └── tag/
        └── contentFormTags.ts               # planned normalization/ranking helper (if extracted)
```

**Structure Decision**: Use the existing single-project Astro structure. Keep route wiring in `src/pages/tag/index.astro`; isolate normalization and prelude rendering into feature-local files under `src/components/tag/` and `src/utils/tag/` when this improves testability and reuse.

## Complexity Tracking

No constitution violations requiring justification.
