# Implementation Plan: Floating Post Table of Contents

**Branch**: `002-post-toc-modal` | **Date**: 2026-04-08 | **Spec**: `/Users/SOFTHEART/Developer/projects/notes/specs/002-post-toc-modal/spec.md`
**Input**: Feature specification from `/specs/002-post-toc-modal/spec.md`

## Summary

Deliver a beautiful, optional, floating table-of-contents experience for post pages so readers can quickly jump through long essays. The implementation uses existing heading extraction in `src/pages/p/[...slug].astro`, introduces a dedicated post TOC UI component, and enforces mobile-first behavior with compact trigger + tap-to-open modal + auto-close on section selection.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript + Astro 6.x  
**Primary Dependencies**: Astro content rendering pipeline, Tailwind CSS utility system, existing blog layout components  
**Storage**: N/A (browser-local state only for open/closed interaction)  
**Testing**: `pnpm run check`, `pnpm run build`, `pnpm run format:check` + manual acceptance on target posts  
**Target Platform**: Static-generated web pages (mobile and desktop browsers)  
**Project Type**: Astro content site (web application)  
**Performance Goals**: No perceptible reading-flow interruption when opening, closing, or selecting TOC entries  
**Constraints**: Static-first architecture; no server-side reader tracking; non-intrusive overlay behavior on small screens  
**Scale/Scope**: All post pages with heading content; initial acceptance on latest leadership post and one long-read post

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify the plan against `.specify/memory/constitution.md` (Notes blog/platform):

- **Content / feeds / SEO:** If posts, frontmatter, feeds, sitemap, or JSON-LD change, cite
  `docs/frontmatter-spec.md` and structured-data docs as needed; note which validators apply
  (`validate-feeds`, `audit-frontmatter`, `validate-structured-data`).
- **Architecture:** Default remains static-first; any new API routes, SSR-only behavior, or
  server-persisted reader state MUST be justified and scoped in this plan.
- **Privacy:** No new third-party trackers or server-side reader tracking without spec disclosure
  and documentation updates.
- **Quality gates:** List which commands MUST pass for this feature (`build`, `check`,
  `format:check`, and content validators when relevant).
- **Layout:** New route areas SHOULD place feature components under `src/components/<feature>/` and
  pages under matching `src/pages/<feature>/`.

**Gate status (pre-research): PASS**

- **Content / feeds / SEO:** This feature does not change frontmatter schema, feeds, sitemap, or JSON-LD output. No additional content validators are required beyond standard checks.
- **Architecture:** Static-first remains intact (`getStaticPaths` + prerender). No new API routes, no SSR-only behavior, and no server persistence introduced.
- **Privacy:** No new third-party trackers or server-side reader behavior tracking. Interaction stays client-local.
- **Quality gates required:** `pnpm run check`, `pnpm run build`, `pnpm run format:check`.
- **Layout:** Feature UI will live under `src/components/post-toc/` and be consumed by existing post layout/page flow.

## Project Structure

### Documentation (this feature)

```text
specs/002-post-toc-modal/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── components/
│   ├── post-toc/
│   │   ├── PostTocModal.astro
│   │   └── postToc.client.ts
│   └── ...existing shared components
├── layouts/
│   └── BlogLayout.astro
├── pages/
│   └── p/[...slug].astro
└── content/p/
    └── ...posts updated with headings as needed

specs/002-post-toc-modal/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── toc-behavior.md
```

**Structure Decision**: Use existing single-project Astro layout and add a feature-scoped component folder under `src/components/post-toc/`, while integrating at `src/layouts/BlogLayout.astro` and using heading data from `src/pages/p/[...slug].astro`.

## Phase 0 Research Plan

- Validate heading-source strategy for TOC generation from markdown body and ensure consistent slug mapping.
- Evaluate mobile-first interaction patterns that preserve legibility and avoid content obstruction.
- Confirm static-first and privacy-safe interaction model (no server persistence).

## Phase 1 Design Plan

- Produce data model for TOC-related entities and state transitions in `data-model.md`.
- Define behavior/interface contract in `contracts/toc-behavior.md` for open/close/navigation behavior across breakpoints.
- Provide implementer workflow and acceptance checklist in `quickstart.md`.
- Update agent context via `.specify/scripts/bash/update-agent-context.sh cursor-agent`.

## Post-Design Constitution Check

**Gate status (post-design): PASS**

- Design artifacts preserve static-first rendering and client-local interaction only.
- No privacy-impacting persistence or third-party tracking added.
- Validation commands remain unchanged and actionable for implementation.
- Component placement adheres to feature-scoped layout guidance.

## Complexity Tracking

No constitution violations require justification for this plan.
