# Tasks: Floating Post Table of Contents

**Input**: Design documents from `/specs/002-post-toc-modal/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: No new automated test suite was explicitly requested in the specification; this task list emphasizes independent manual acceptance checks plus existing project quality gates.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature files and baseline wiring for TOC work.

- [ ] T001 Create feature component directory scaffold in `src/components/post-toc/` (add `.gitkeep` if needed)
- [ ] T002 Create TOC modal component shell in `src/components/post-toc/PostTocModal.astro`
- [ ] T003 [P] Create TOC client interaction module shell in `src/components/post-toc/postToc.client.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared logic all user stories depend on before story-level delivery.

**⚠️ CRITICAL**: No user story implementation should start until this phase is complete.

- [ ] T004 Normalize heading slug generation and duplicate-safe anchors in `src/pages/p/[...slug].astro`
- [ ] T005 Define and export TOC data props/types consumed by layout and component in `src/types/layout.ts`
- [ ] T006 Integrate base TOC data plumbing from post page to layout props in `src/pages/p/[...slug].astro` and `src/layouts/BlogLayout.astro`
- [ ] T007 [P] Add baseline TOC container placement and slot in post layout in `src/layouts/BlogLayout.astro`

**Checkpoint**: Foundation ready - user story tasks can proceed.

---

## Phase 3: User Story 1 - Jump to Any Section Quickly (Priority: P1) 🎯 MVP

**Goal**: Readers can open TOC and jump to sections in long posts quickly.

**Independent Test**: Open a long post with multiple headings, open TOC, choose any section, and verify accurate in-page navigation.

### Implementation for User Story 1

- [ ] T008 [US1] Implement ordered TOC item rendering with heading hierarchy in `src/components/post-toc/PostTocModal.astro`
- [ ] T009 [US1] Implement open/close behavior and section navigation handlers in `src/components/post-toc/postToc.client.ts`
- [ ] T010 [US1] Wire `tableOfContents` data into TOC component invocation in `src/layouts/BlogLayout.astro`
- [ ] T011 [US1] Handle empty/insufficient heading cases by hiding TOC UI in `src/components/post-toc/PostTocModal.astro`
- [ ] T012 [US1] Validate section-jump behavior on leadership post content in `src/content/p/on-leadership-and-leadership-adjacent-things-april-2026.md`

**Checkpoint**: US1 is fully functional and independently testable (MVP).

---

## Phase 4: User Story 2 - Dismiss the Navigation Overlay (Priority: P2)

**Goal**: Readers can dismiss TOC and continue distraction-free reading.

**Independent Test**: Open TOC, close it, and confirm no persistent overlay obstructs reading.

### Implementation for User Story 2

- [ ] T013 [US2] Implement explicit dismiss control and escape/overlay close behavior in `src/components/post-toc/PostTocModal.astro`
- [ ] T014 [US2] Implement compact mobile `Contents` trigger behavior in `src/components/post-toc/PostTocModal.astro`
- [ ] T015 [US2] Implement mobile auto-close after section selection in `src/components/post-toc/postToc.client.ts`
- [ ] T016 [US2] Ensure overlay non-obstruction and layout-safe positioning in `src/layouts/BlogLayout.astro`

**Checkpoint**: US2 works independently with clean dismissal behavior.

---

## Phase 5: User Story 3 - Enjoy a Polished Reading Experience (Priority: P3)

**Goal**: TOC looks beautiful, coherent, and legible within site aesthetics.

**Independent Test**: Review TOC in the latest leadership post and confirm visual polish, clear hierarchy, and subjective legibility acceptance.

### Implementation for User Story 3

- [ ] T017 [US3] Apply polished visual styling (spacing, hierarchy, motion, theming) in `src/components/post-toc/PostTocModal.astro`
- [ ] T018 [P] [US3] Add responsive style refinements for mobile and desktop in `src/components/post-toc/PostTocModal.astro`
- [ ] T019 [US3] Tune interaction affordances and transitions for visual coherence in `src/components/post-toc/postToc.client.ts`
- [ ] T020 [US3] Add/adjust headings in target long-form post to improve TOC usability in `src/content/p/on-leadership-and-leadership-adjacent-things-april-2026.md`

**Checkpoint**: US3 visual acceptance criteria pass without regressing US1/US2.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, docs alignment, and quality gates across stories.

- [ ] T021 [P] Update feature documentation and implementation notes in `specs/002-post-toc-modal/quickstart.md`
- [ ] T022 Verify end-to-end acceptance scenarios across US1-US3 using `specs/002-post-toc-modal/spec.md`
- [ ] T023 Run project quality gates (`check`, `build`, `format:check`) via `package.json` scripts
- [ ] T024 Perform final regression check on post layout behavior in `src/layouts/BlogLayout.astro`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: starts immediately.
- **Phase 2 (Foundational)**: depends on Phase 1 and blocks all user stories.
- **Phase 3 (US1)**: depends on Phase 2; defines MVP.
- **Phase 4 (US2)**: depends on Phase 2; may build on US1 UI hooks but remains independently testable.
- **Phase 5 (US3)**: depends on Phase 2; should be applied after core behavior to avoid styling rework.
- **Phase 6 (Polish)**: depends on completion of selected user stories.

### User Story Dependencies

- **US1 (P1)**: no dependency on other stories after foundation.
- **US2 (P2)**: no hard dependency on US3; can proceed after foundation and integrate with US1 behavior.
- **US3 (P3)**: no hard dependency on US2 logic; best done after US1 core functionality is stable.

### Parallel Opportunities

- T003 can run in parallel with T002 once Phase 1 starts.
- T007 can run in parallel with T005 after T004 is complete.
- T018 can run in parallel with T017 in US3.
- T021 can run in parallel with T022 in Polish phase.

---

## Parallel Example: User Story 1

```bash
# After foundational tasks are complete:
Task: "Implement ordered TOC item rendering in src/components/post-toc/PostTocModal.astro"
Task: "Implement open/close behavior and navigation handlers in src/components/post-toc/postToc.client.ts"
```

## Parallel Example: User Story 2

```bash
# Once base TOC component exists:
Task: "Implement dismiss control and close behavior in src/components/post-toc/PostTocModal.astro"
Task: "Ensure overlay non-obstruction in src/layouts/BlogLayout.astro"
```

## Parallel Example: User Story 3

```bash
# Styling pass can be split:
Task: "Apply polished styling in src/components/post-toc/PostTocModal.astro"
Task: "Tune interaction transitions in src/components/post-toc/postToc.client.ts"
```

---

## Implementation Strategy

### MVP First (US1 only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate independent US1 acceptance on long post navigation.

### Incremental Delivery

1. Deliver US1 as MVP.
2. Add US2 dismissal and mobile interaction refinements.
3. Add US3 visual polish and heading curation.
4. Run final polish and quality gates.
