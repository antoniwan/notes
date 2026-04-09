# Tasks: Homepage and About Voice Refresh

**Input**: Design documents from `/specs/003-update-home-about-voice/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: No dedicated automated test tasks are included because the spec does not explicitly request TDD/test-first for this feature. Validation is handled through quality gates plus editorial acceptance checks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare implementation guardrails and references before editing page content.

- [ ] T001 Create a pre-change checkpoint commit and record target edit areas in `src/pages/index.astro` and `src/pages/about.astro`
- [ ] T002 [P] Identify and mark homepage narrative sections to update in `src/pages/index.astro`
- [ ] T003 [P] Identify and mark About primary narrative sections to update in `src/pages/about.astro`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared constraints and review criteria that all stories depend on.

**CRITICAL**: No user story work should begin until this phase is complete.

- [ ] T004 Define canonical season-of-execution message anchors in `specs/003-update-home-about-voice/data-model.md`
- [ ] T005 Establish masonry guardrail verification checklist for homepage edits in `src/pages/index.astro`
- [ ] T006 Define cross-page acceptance checklist and completion rubric in `specs/003-update-home-about-voice/quickstart.md`

**Checkpoint**: Shared narrative criteria and constraints are ready; user stories can proceed.

---

## Phase 3: User Story 1 - Homepage Message Reflects Current Season (Priority: P1) 🎯 MVP

**Goal**: Update homepage messaging to clearly communicate the season-of-execution narrative with concrete lived context.

**Independent Test**: Load homepage and confirm the leading message expresses execution/action in first-person voice, includes lived context, and remains clear to first-time readers.

### Implementation for User Story 1

- [ ] T007 [US1] Rewrite homepage description and primary narrative copy in `src/pages/index.astro`
- [ ] T008 [US1] Add or refine supporting copy blocks/CTA framing for first-time-reader clarity in `src/pages/index.astro`
- [ ] T009 [US1] Apply targeted non-masonry layout/design refinements that support the new narrative in `src/pages/index.astro`
- [ ] T010 [US1] Verify masonry integration remains behaviorally unchanged while homepage copy/layout is updated in `src/pages/index.astro`

**Checkpoint**: User Story 1 is functional and independently reviewable on homepage only.

---

## Phase 4: User Story 2 - About Page Matches Voice and Direction (Priority: P2)

**Goal**: Refresh all primary About narrative sections so they align with the homepage direction while keeping About page structure mostly intact.

**Independent Test**: Open About page and confirm all primary narrative sections are updated, aligned to homepage theme, and existing structural skeleton is preserved.

### Implementation for User Story 2

- [ ] T011 [US2] Update About lead/kicker narrative to match season-of-execution framing in `src/pages/about.astro`
- [ ] T012 [US2] Refresh About story paragraphs with aligned message and lived context in `src/pages/about.astro`
- [ ] T013 [US2] Adjust About supporting narrative sections (topics intro and contextual copy) for message coherence in `src/pages/about.astro`
- [ ] T014 [US2] Preserve existing About structural skeleton while applying copy updates in `src/pages/about.astro`

**Checkpoint**: User Story 2 is functional and independently reviewable on About page only.

---

## Phase 5: User Story 3 - Existing Writing Voice is Preserved (Priority: P3)

**Goal**: Ensure homepage and About updates remain authentically in the author's voice and avoid generic phrasing.

**Independent Test**: Compare updated homepage/About copy against recent posts and confirm tone, cadence, and first-person authenticity remain consistent.

### Implementation for User Story 3

- [ ] T015 [P] [US3] Select and document voice reference excerpts from recent posts in `specs/003-update-home-about-voice/research.md`
- [ ] T016 [US3] Run side-by-side voice pass on homepage copy and refine wording in `src/pages/index.astro`
- [ ] T017 [US3] Run side-by-side voice pass on About copy and refine wording in `src/pages/about.astro`
- [ ] T018 [US3] Record final editorial consistency outcomes against contract conditions in `specs/003-update-home-about-voice/contracts/content-voice-contract.md`

**Checkpoint**: All user stories are independently functional and voice-consistent.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality gate execution and release readiness checks across stories.

- [ ] T019 [P] Run formatting validation in `package.json` via `pnpm run format:check`
- [ ] T020 [P] Run Astro/type validation in `package.json` via `pnpm run check`
- [ ] T021 Run production build validation in `package.json` via `pnpm run build`
- [ ] T022 Perform final contract and quickstart verification pass in `specs/003-update-home-about-voice/quickstart.md`
- [ ] T023 [P] Update user-visible messaging notes in `README.md` or relevant `docs/` page to reflect homepage/About narrative refresh

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies, starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks user story implementation.
- **Phase 3 (US1)**: Depends on Phase 2; MVP slice.
- **Phase 4 (US2)**: Depends on Phase 2; can run after or alongside US1 if staffed, but typically follows MVP.
- **Phase 5 (US3)**: Depends on completion of US1 and US2 content updates.
- **Phase 6 (Polish)**: Depends on all targeted stories complete.

### User Story Dependencies

- **US1 (P1)**: Independent after Foundational; no dependency on other user stories.
- **US2 (P2)**: Independent after Foundational; no hard dependency on US1 implementation details.
- **US3 (P3)**: Depends on completed drafts from US1 and US2 for cross-page voice review.

### Parallel Opportunities

- `T002` and `T003` can run in parallel during Setup.
- `T015` can be prepared in parallel with late US2 refinements.
- `T019` and `T020` can run in parallel during final validation.
- `T023` can run in parallel with final validation after content is finalized.

---

## Parallel Example: User Story 1

```bash
# US1 writing/design iteration in one file:
Task: "Rewrite homepage description and narrative copy in src/pages/index.astro"
Task: "Apply targeted non-masonry layout/design refinements in src/pages/index.astro"
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
2. Complete Phase 3 (US1).
3. Validate homepage independently against US1 acceptance criteria.
4. Demo/review MVP before expanding scope.

### Incremental Delivery

1. Deliver US1 homepage refresh (MVP).
2. Deliver US2 About alignment.
3. Deliver US3 cross-page voice harmonization and final editorial pass.
4. Execute polish quality gates and release checks.

### Notes

- Keep masonry unchanged throughout all homepage edits.
- Keep About structure mostly intact while refreshing primary narrative content.
- Prefer small, reviewable commits by phase or story slice.
