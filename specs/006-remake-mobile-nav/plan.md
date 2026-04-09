# Implementation Plan: Professional Mobile Navigation Refresh

**Branch**: `006-remake-mobile-nav` | **Date**: 2026-04-09 | **Spec**: `/specs/006-remake-mobile-nav/spec.md`
**Input**: Feature specification from `/specs/006-remake-mobile-nav/spec.md`

## Summary

Replace the current mobile hamburger navigation with a cleaner, professional interaction model that preserves static-first architecture, improves accessibility behavior (focus flow, escape/close semantics, back-close behavior), and enforces explicit destination hierarchy where Brain Science remains available but not emphasized over Guided Path.

## Technical Context

**Language/Version**: TypeScript 5.x + Astro 6.x (`.astro` components with inline client script)  
**Primary Dependencies**: Astro, Tailwind CSS utility classes, existing navigation data/config, existing nav active-state helpers  
**Storage**: N/A (no new persisted state; interaction-only UI state in browser runtime)  
**Testing**: `pnpm run check`, `pnpm run build`, `pnpm run lint`, `pnpm run format:check` + manual mobile interaction verification  
**Target Platform**: Mobile and tablet browsers (responsive breakpoints below desktop nav threshold)  
**Project Type**: Static-first web application (Astro content site)  
**Performance Goals**: Menu open/close remains instant-feeling on mobile; no measurable regression in header interaction responsiveness  
**Constraints**: No server routes, no new tracker instrumentation, no server-persisted reader/navigation state, no visual promotion of Brain Science above Guided Path  
**Scale/Scope**: Navigation refresh limited to existing global header/mobile nav flow; no full IA redesign, no content model changes

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **Content / feeds / SEO:** PASS. No changes to frontmatter, feeds, sitemap, canonical metadata, or JSON-LD outputs are planned.
- **Architecture (static-first):** PASS. Scope stays within existing Astro component/UI behavior; no SSR-only or API route additions.
- **Privacy:** PASS. No new analytics/tracking and no server-side state collection introduced.
- **Quality gates:** PASS with required commands: `pnpm run build`, `pnpm run check`, `pnpm run lint`, `pnpm run format:check`.
- **Layout conventions:** PASS. Work remains in existing navigation components, primarily `src/components/MobileNav.astro` and `src/components/Header.astro`; no new route area required.

## Project Structure

### Documentation (this feature)

```text
specs/006-remake-mobile-nav/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── mobile-nav-behavior-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Header.astro
│   ├── MobileNav.astro
│   └── Navigation.astro
├── data/
│   └── navigation.ts
├── utils/
│   └── navActive.ts
└── layouts/
    ├── BaseLayout.astro
    └── BlogLayout.astro
```

**Structure Decision**: Use the existing single-project Astro structure and update current navigation components in place, avoiding new route trees or backend boundaries.

## Phase 0: Outline & Research

- Document interaction and accessibility decisions for modal-like mobile navigation behavior.
- Confirm destination hierarchy and labeling strategy consistent with spec clarifications.
- Evaluate lightweight event-handling approach that avoids listener leaks across Astro page transitions.
- Output: `research.md` with explicit decisions and rejected alternatives.

## Phase 1: Design & Contracts

- Define interaction data model/state machine for mobile menu visibility, focus origin/return, dismiss reasons, and active destination context.
- Produce behavior contract for menu trigger, close actions, back-button handling, hierarchy emphasis, and accessibility obligations.
- Create quickstart verification flow for manual QA plus required project checks.
- Run agent context update script after artifacts are generated.

## Phase 2: Task Planning Approach

- Break implementation into setup, component structure cleanup, behavior logic updates, accessibility validation, and regression checks.
- Ensure explicit task mapping to FR-001..FR-013 and measurable criteria SC-001..SC-004 (SC-005 tracked post-release).

## Post-Design Constitution Check

- **Architecture:** Still static-first; no backend dependencies introduced.
- **Privacy:** No additional data collection.
- **Quality gates:** Remain unchanged and sufficient for this scope.
- **Documentation discipline:** Feature-local contracts and quickstart artifacts created under `specs/006-remake-mobile-nav/`.

## Complexity Tracking

No constitution violations identified; complexity exceptions are not required.
