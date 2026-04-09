# Tasks: Professional UI/UX Refinement Pass

**Input**: Design documents from `/specs/004-ui-ux-refinement/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: No dedicated automated test-authoring tasks are included because the spec does not explicitly require new automated tests. Validation is handled through template-by-breakpoint visual QA and required repository quality gates.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Build inventory and baseline references before changing styles.

- [x] T001 Inventory all public-facing templates and record one representative page per template in `specs/004-ui-ux-refinement/data-model.md`
- [x] T002 [P] Capture baseline screenshots/notes at mobile, tablet, and desktop for representative pages and store references in `specs/004-ui-ux-refinement/quickstart.md`
- [x] T003 [P] Define the visual QA checklist (hierarchy, spacing, alignment, legibility, contrast) in `specs/004-ui-ux-refinement/contracts/visual-refinement-contract.md`
- [x] T004 [P] Define SC-002 sampling protocol (sample set size, inclusion rules, and pass-threshold calculation) in `specs/004-ui-ux-refinement/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish system-level styling foundations that all story work depends on.

**CRITICAL**: No user story implementation should begin until this phase is complete.

- [x] T005 Audit current shared typography/layout surfaces in `src/styles/global.css`, `src/layouts/BlogLayout.astro`, and `src/layouts/BaseLayout.astro`, then document target refinement points in `specs/004-ui-ux-refinement/research.md`
- [x] T006 Create/update shared typography role rules (title, headings, body, metadata) in `src/styles/global.css`
- [x] T007 Create/update shared spacing rhythm and container alignment rules in `src/styles/global.css` and `src/layouts/BlogLayout.astro`
- [x] T008 Validate that foundational style updates do not alter interactions or route/content structure across representative pages

**Checkpoint**: Shared design primitives are ready and safe; user stories can proceed.

---

## Phase 3: User Story 1 - Scan Long Posts Faster (Priority: P1) 🎯 MVP

**Goal**: Improve hierarchy and legibility on long-form reading pages so readers can scan quickly with less fatigue.

**Independent Test**: Open representative long posts in `src/pages/p/` routes at mobile/tablet/desktop and confirm title, heading levels, body, and metadata are clearly differentiated with improved readability.

### Implementation for User Story 1

- [x] T009 [US1] Refine long-form typography and hierarchy styling in `src/pages/p/[...slug].astro`, `src/layouts/BlogLayout.astro`, and `src/styles/global.css`
- [x] T010 [US1] Improve spacing rhythm between long-form content sections/headings in `src/pages/p/[...slug].astro`; update `src/components/post-toc/PostTocModal.astro` only if post-heading spacing or typography tokens are modified in this story
- [x] T011 [US1] Verify long-title/multi-line-heading behavior and update styles in `src/pages/p/[...slug].astro` and `src/layouts/BlogLayout.astro` to prevent collisions/overlap
- [x] T012 [US1] Validate WCAG 2.2 AA contrast and text legibility expectations on representative long-form pages

**Checkpoint**: US1 is independently functional and visually improved for long-form reading.

---

## Phase 4: User Story 2 - Experience Consistent Layout Rhythm (Priority: P2)

**Goal**: Ensure consistent spacing/alignment patterns across all public-facing templates.

**Independent Test**: Navigate representative home, about, listing, and post pages and confirm coherent container widths, spacing cadence, and component alignment.

### Implementation for User Story 2

- [x] T013 [P] [US2] Refine homepage layout rhythm and alignment in `src/pages/index.astro` without changing existing interactions/content structure
- [x] T014 [P] [US2] Refine about-page layout rhythm and alignment in `src/pages/about.astro` without changing existing interactions/content structure
- [x] T015 [US2] Refine shared page/listing layout consistency in `src/pages/index.astro`, `src/pages/about.astro`, `src/layouts/BlogLayout.astro`, and `src/styles/global.css`
- [x] T016 [US2] Harmonize component-level spacing/alignment inconsistencies for repeated UI patterns in `src/components/PostCard.astro` and `src/components/related-posts/RelatedPosts.astro`; update `src/components/post-toc/PostTocModal.astro` only if shared spacing/alignment tokens used by post listings are changed

**Checkpoint**: US2 is independently functional with consistent cross-template rhythm/alignment.

---

## Phase 5: User Story 3 - Use the Site Comfortably on Common Screens (Priority: P3)

**Goal**: Ensure refined templates remain balanced and legible on mobile, tablet, and desktop.

**Independent Test**: For every representative template page, confirm no clipping/overflow/crowding on mobile and no excessive line length/whitespace imbalance on desktop.

### Implementation for User Story 3

- [x] T017 [US3] Tune responsive typography and spacing behavior at mobile/tablet/desktop breakpoints in `src/styles/global.css`, `src/pages/index.astro`, `src/pages/about.astro`, and `src/layouts/BlogLayout.astro`
- [x] T018 [US3] Resolve edge-case presentation issues (very long headings, sparse pages, wide screens, narrow screens) in `src/pages/p/[...slug].astro`, `src/pages/about.astro`, and `src/pages/index.astro`
- [x] T019 [US3] Run full template-by-breakpoint QA matrix and record pass/fail outcomes in `specs/004-ui-ux-refinement/quickstart.md`
- [x] T020 [US3] Confirm all representative templates satisfy WCAG 2.2 AA contrast expectations and document final accessibility verification in `specs/004-ui-ux-refinement/contracts/visual-refinement-contract.md`

**Checkpoint**: US3 is independently functional with cross-device readability and layout quality.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency sweep, quality gates, and release readiness.

- [x] T021 [P] Perform final visual regression sweep across all representative templates and breakpoints; log final notes in `specs/004-ui-ux-refinement/quickstart.md`
- [x] T022 [P] Run formatting gate via `pnpm run format:check`
- [x] T023 [P] Run Astro/type validation via `pnpm run check`
- [x] T024 Run production build gate via `pnpm run build`
- [x] T025 Update `specs/004-ui-ux-refinement/contracts/visual-refinement-contract.md` with final completion evidence and sign-off

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user story work.
- **Phase 3 (US1)**: Depends on Phase 2; delivers MVP readability value.
- **Phase 4 (US2)**: Depends on Phase 2; can run after US1 or in parallel if staffed.
- **Phase 5 (US3)**: Depends on completion of key US1/US2 refinements.
- **Phase 6 (Polish)**: Depends on all targeted user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Independent after Foundational; no dependency on US2/US3.
- **US2 (P2)**: Independent after Foundational; integrates shared style decisions from Phase 2.
- **US3 (P3)**: Depends on finalized style updates from US1 and US2 for comprehensive breakpoint QA.

### Parallel Opportunities

- `T002`, `T003`, and `T004` can run in parallel during Setup.
- `T013` and `T014` can run in parallel during US2 (different page files).
- `T022` and `T023` can run in parallel during final validation.
- `T021` can run in parallel with command-based quality gates once implementation is stable.

---

## Parallel Example: User Story 2

```bash
Task: "Refine homepage layout rhythm and alignment in src/pages/index.astro"
Task: "Refine about-page layout rhythm and alignment in src/pages/about.astro"
```

## Parallel Example: Final Validation

```bash
Task: "Run pnpm run format:check"
Task: "Run pnpm run check"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) for long-form post readability.
3. Validate US1 independently at mobile/tablet/desktop.
4. Review MVP quality before broader template harmonization.

### Incremental Delivery

1. Deliver US1 long-form readability improvements.
2. Deliver US2 cross-template alignment/spacing consistency.
3. Deliver US3 responsive/device polish and full QA matrix coverage.
4. Run final gates and sign-off artifacts in Phase 6.

### Notes

- Keep content, interactions, and routing unchanged throughout implementation.
- Use shared style primitives first to avoid page-by-page divergence.
- Do not close the feature until all representative templates pass breakpoint QA and WCAG 2.2 AA checks.
