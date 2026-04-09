# Implementation Plan: Related Posts Section Enhancement

**Branch**: `008-related-posts-ui` | **Date**: 2026-04-09 | **Spec**: `specs/008-related-posts-ui/spec.md`  
**Input**: Feature specification from `specs/008-related-posts-ui/spec.md`

## Summary

Audit and improve the post-page “related writings” experience: enforce **same-language** candidates per **FR-004**, keep **static-first** scoring (tags, categories, recency, featured bonus), align presentation with the site’s Tailwind/design patterns, prefer **`minutesRead`** from the remark pipeline over recomputing from body, and ship **maintainer-facing documentation** of ranking inputs and tie-breakers (**FR-011**). No new APIs, no server-side reader state, and no cross-language recommendations in this block.

## Technical Context

**Language/Version**: TypeScript 5.x + Astro 6.x  
**Primary Dependencies**: Astro content collections (`blog`), existing `findRelatedPosts` in `src/utils/tagProcessing.ts`, `src/components/related-posts/RelatedPosts.astro`, `BlogLayout.astro`, Zod schema in `src/content.config.ts` (`language`, `draft`, `published`, `minutesRead`)  
**Storage**: N/A (derived at build time from collection entries)  
**Testing**: `pnpm run format:check`, `pnpm run check`, `pnpm run build`; manual spot-check on EN and ES posts plus `pnpm run audit-frontmatter` if frontmatter assumptions change  
**Target Platform**: Static prerendered site  
**Project Type**: Content-driven blog / publication  
**Performance Goals**: No extra collection passes per request; keep O(n) scoring over `allPosts` only where already passed from `[...slug].astro` props (no new global layout `getCollection` fan-out)  
**Constraints**: Constitution **I** (use `minutesRead` from pipeline, not ad-hoc frontmatter reading time); **II** static-first; **IV** no new trackers; align with `docs/frontmatter-spec.md` for `language`  
**Scale/Scope**: All post pages that render `RelatedPosts`; typical `n` = full blog collection size (hundreds, not millions)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **Content / feeds / SEO:** No planned changes to feed generators, sitemap, or JSON-LD. Uses existing `language` and `published`/`draft` semantics from `src/content.config.ts` and `docs/frontmatter-spec.md`. If frontmatter validation rules change, run `pnpm run audit-frontmatter`.
- **Architecture:** Pass. Relatedness remains build-time / prerender data; no new API routes or SSR-only behavior.
- **Privacy:** Pass. No analytics or server-side reader tracking.
- **Quality gates:** `pnpm run format:check`, `pnpm run check`, `pnpm run build` for merge-ready changes.
- **Layout:** SHOULD place feature UI under `src/components/related-posts/` (see **Structure Decision**). Post route remains `src/pages/p/[...slug].astro`.

## Project Structure

### Documentation (this feature)

```text
specs/008-related-posts-ui/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── related-posts-behavior.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── components/
│   └── related-posts/
│       └── RelatedPosts.astro
├── layouts/
│   └── BlogLayout.astro
├── pages/
│   └── p/
│       └── [...slug].astro
├── utils/
│   └── tagProcessing.ts        # findRelatedPosts + language / published filtering
└── content.config.ts           # reference only unless schema clarified
```

**Structure Decision**: Introduce `src/components/related-posts/RelatedPosts.astro` and update imports from `BlogLayout.astro` (and any other consumers) so the feature matches constitution guidance for feature-scoped components. Keep scoring logic in `tagProcessing.ts` as shared utilities.

## Phase 0: Research

Consolidated in `specs/008-related-posts-ui/research.md`. Resolves:

- Same-language rule as **set intersection** on `post.data.language` (`en` | `es`, defaulted in schema).
- **Published** candidates: exclude `draft` and treat `published === false` as ineligible (align with public listings).
- **Reading time display**: use `post.data.minutesRead` with fallback to `calculateReadingTimeFromMarkdown` only when missing (parity with `src/pages/p/[...slug].astro`).
- UI direction: prefer Tailwind + design tokens over large scoped CSS blocks where rework touches layout.

## Phase 1: Design & Contracts

Artifacts:

- `specs/008-related-posts-ui/data-model.md` — entities and filtering rules.
- `specs/008-related-posts-ui/contracts/related-posts-behavior.md` — observable behavior for QA and maintainers.
- `specs/008-related-posts-ui/quickstart.md` — verification steps including SC-001 / SC-002 sampling notes.

## Post-Design Constitution Check

- **Content / feeds / SEO:** Still no feed/sitemap/schema contract changes; language uses existing schema.
- **Architecture:** Static-first; related list computed from props passed into layout.
- **Privacy:** Unchanged.
- **Quality gates:** `format:check`, `check`, `build` unchanged.
- **Compliance result:** PASS

## Complexity Tracking

No constitution violations requiring justification.
