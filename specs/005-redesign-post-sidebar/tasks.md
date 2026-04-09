# Tasks: Post Sidebar Usability Redesign

**Input**: Design documents from `/specs/005-redesign-post-sidebar/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: No dedicated automated test-authoring tasks are included because the specification does not explicitly require new automated tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (e.g., `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare implementation guardrails and baseline references for sidebar behavior.

- [ ] T001 Audit current post sidebar and mobile metadata surfaces in `src/layouts/BlogLayout.astro` and `src/pages/p/[...slug].astro`, then record baseline notes in `specs/005-redesign-post-sidebar/quickstart.md`
- [ ] T002 [P] Confirm category display helper behavior and primary-category assumptions in `src/utils/categoryUtils.ts`; record any helper changes needed in `specs/005-redesign-post-sidebar/research.md`
- [ ] T003 [P] Confirm contract coverage checklist in `specs/005-redesign-post-sidebar/contracts/sidebar-behavior-contract.md` for hierarchy order, taxonomy overflow, and mobile disclosure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared sidebar primitives and data rules required by all user stories.

**⚠️ CRITICAL**: No user story implementation begins until this phase is complete.

- [ ] T004 Define shared sidebar section structure and ordering constants in `src/layouts/BlogLayout.astro` for context, reading signals, taxonomy, actions, and secondary metadata blocks
- [ ] T005 [P] Implement reusable multi-category mapping helper (including first-category primary rule) in `src/utils/categoryUtils.ts`
- [ ] T006 [P] Refactor post route category props to support full category list display without losing existing behavior in `src/pages/p/[...slug].astro`
- [ ] T007 Add shared taxonomy overflow behavior contract comments/notes in `src/layouts/BlogLayout.astro` and align wording with `specs/005-redesign-post-sidebar/contracts/sidebar-behavior-contract.md`

**Checkpoint**: Foundation ready; user story work can begin.

---

## Phase 3: User Story 1 - Scan Context Instantly (Priority: P1) 🎯 MVP

**Goal**: Improve first-glance readability and contextual understanding in the sidebar while exposing full category classification.

**Independent Test**: Open representative posts (including multi-category posts) and verify section order and complete category discoverability are clear at first scan.

### Implementation for User Story 1

- [ ] T008 [US1] Reorder desktop sidebar blocks in `src/layouts/BlogLayout.astro` to match required hierarchy (context -> reading signals -> taxonomy -> actions -> secondary metadata)
- [ ] T009 [US1] Render all assigned categories as linked items in the taxonomy block in `src/layouts/BlogLayout.astro`
- [ ] T010 [US1] Apply breadcrumb primary-category rule (first category) consistently in `src/layouts/BlogLayout.astro`
- [ ] T011 [US1] Implement category overflow behavior (first 3 + Show all) in `src/layouts/BlogLayout.astro`
- [ ] T012 [US1] Tune spacing/heading emphasis for context and taxonomy scanability in `src/layouts/BlogLayout.astro`

**Checkpoint**: US1 is independently functional and testable.

---

## Phase 4: User Story 2 - Use Existing Sidebar Features Better (Priority: P2)

**Goal**: Preserve all existing sidebar capabilities while reducing visual competition and improving grouping.

**Independent Test**: Verify read-state/read-time, sharing, tags, and metadata remain available and easier to parse without feature loss.

### Implementation for User Story 2

- [ ] T013 [US2] Keep reading-time/read-state behavior intact while relocating it into the dedicated reading-signals block in `src/layouts/BlogLayout.astro`
- [ ] T014 [US2] Move social sharing controls to the lower Actions block after taxonomy/metadata in `src/layouts/BlogLayout.astro`
- [ ] T015 [US2] Preserve tags and secondary metadata rendering while aligning to new section grouping in `src/layouts/BlogLayout.astro`
- [ ] T016 [US2] Verify no behavior regressions for existing read-state updates and share interactions in `src/layouts/BlogLayout.astro` and `src/components/SocialShare.astro`

**Checkpoint**: US1 and US2 remain independently functional.

---

## Phase 5: User Story 3 - Read Comfortably Across Viewports (Priority: P3)

**Goal**: Ensure desktop and mobile preserve equivalent information architecture with mobile-friendly disclosure defaults.

**Independent Test**: Validate the redesigned sidebar and mobile metadata flow at mobile/tablet/desktop with no clipping, missing sections, or interaction regressions.

### Implementation for User Story 3

- [ ] T017 [US3] Implement mobile metadata collapsed-by-default behavior with clear tap-to-expand section headers in `src/layouts/BlogLayout.astro`
- [ ] T018 [US3] Align mobile section semantics and ordering with desktop hierarchy in `src/layouts/BlogLayout.astro`
- [ ] T019 [US3] Refine responsive spacing and line-wrapping for long category/tag labels in `src/layouts/BlogLayout.astro`
- [ ] T020 [US3] Validate language-toggle discoverability and sidebar/mobile metadata coexistence in `src/layouts/BlogLayout.astro`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency sweep, contract validation, and release-readiness checks.

- [ ] T021 [P] Run contract checklist validation and record completion evidence in `specs/005-redesign-post-sidebar/contracts/sidebar-behavior-contract.md`
- [ ] T022 [P] Update implementation notes and verification outcomes in `specs/005-redesign-post-sidebar/quickstart.md`
- [ ] T023 [P] Run formatting gate: `pnpm run format:check`
- [ ] T024 [P] Run Astro/type validation gate: `pnpm run check`
- [ ] T025 Run production build gate: `pnpm run build`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user-story work.
- **Phase 3 (US1)**: Depends on Phase 2; delivers MVP sidebar value.
- **Phase 4 (US2)**: Depends on Phase 2; can proceed after US1 or in parallel if staffed.
- **Phase 5 (US3)**: Depends on core hierarchy decisions from US1 and preserved features from US2.
- **Phase 6 (Polish)**: Depends on all targeted stories being complete.

### User Story Dependencies

- **US1 (P1)**: Independent after Foundational; no dependency on US2/US3.
- **US2 (P2)**: Independent after Foundational; should not break US1 hierarchy outcomes.
- **US3 (P3)**: Depends on settled hierarchy/grouping from US1/US2 for responsive parity checks.

### Parallel Opportunities

- `T002` and `T003` can run in parallel in Setup.
- `T005` and `T006` can run in parallel in Foundational.
- `T021` to `T024` can run in parallel in final validation.

---

## Parallel Example: User Story 1

```bash
Task: "Render all assigned categories as linked items in src/layouts/BlogLayout.astro"
Task: "Apply breadcrumb primary-category rule in src/layouts/BlogLayout.astro"
```

## Parallel Example: Final Validation

```bash
Task: "Run contract checklist validation in specs/005-redesign-post-sidebar/contracts/sidebar-behavior-contract.md"
Task: "Run pnpm run format:check"
Task: "Run pnpm run check"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently on representative multi-category and single-category posts.
4. Review hierarchy/legibility outcomes before proceeding.

### Incremental Delivery

1. Deliver US1 hierarchy and full taxonomy visibility.
2. Deliver US2 feature-preservation regrouping.
3. Deliver US3 responsive disclosure and cross-viewport parity.
4. Run final quality gates and contract validation in Phase 6.

### Notes

- Keep feature behavior static-first and privacy-safe.
- Preserve existing interactions while improving information architecture.
- Do not introduce new route or content-model changes for this feature.
