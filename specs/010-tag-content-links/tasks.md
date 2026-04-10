# Tasks: Tag Content Links Prelude

**Input**: Design documents from `/specs/010-tag-content-links/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Tests were not explicitly requested in the feature specification; this task list focuses on implementation and validation via quickstart + quality gates.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature-local files and constants for deterministic prelude behavior.

- [ ] T001 Create feature utility directory and files for tag normalization in `src/utils/tag/contentFormTags.ts`
- [ ] T002 Create feature component file for prelude rendering in `src/components/tag/ContentFormPrelude.astro`
- [ ] T003 [P] Add canonical writing-form vocabulary constants and variant map in `src/utils/tag/contentFormTags.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement reusable data transformation logic required by all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Implement tag normalization helper for canonical matching in `src/utils/tag/contentFormTags.ts`
- [ ] T005 Implement content-form filtering and grouping by canonical label in `src/utils/tag/contentFormTags.ts`
- [ ] T006 Implement sorting helper (count desc, alphabetical tie-break) in `src/utils/tag/contentFormTags.ts`
- [ ] T007 Implement sentence grammar formatter for 1/2/N labels in `src/utils/tag/contentFormTags.ts`
- [ ] T008 Add helper exports and inline usage documentation for prelude pipeline in `src/utils/tag/contentFormTags.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Browse by content form quickly (Priority: P1) 🎯 MVP

**Goal**: Readers can click sentence-style content-form links above the tag cloud to navigate by writing form.

**Independent Test**: Load `/tag` and verify that at least one rendered prelude link appears above tag sections and each link navigates to the matching tag page.

### Implementation for User Story 1

- [ ] T009 [US1] Integrate content-form prelude data derivation into `src/pages/tag/index.astro` using helpers from `src/utils/tag/contentFormTags.ts`
- [ ] T010 [US1] Implement `ContentFormPrelude` structure and label rendering in `src/components/tag/ContentFormPrelude.astro`
- [ ] T011 [US1] Render `ContentFormPrelude` before existing popular/all tag sections in `src/pages/tag/index.astro`
- [ ] T012 [US1] Implement and verify prelude href generation against existing `/tag/[tag]` route format in `src/components/tag/ContentFormPrelude.astro`

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Keep browsing language natural and readable (Priority: P2)

**Goal**: Prelude text remains grammatically coherent and editorial in tone while preserving deterministic order.

**Independent Test**: Validate `/tag` output reads naturally for 1, 2, and 3+ prelude items with proper punctuation and conjunctions.

### Implementation for User Story 2

- [ ] T013 [US2] Implement canonical plural label display in prelude rendering logic in `src/components/tag/ContentFormPrelude.astro`
- [ ] T014 [US2] Apply sentence grammar formatting output from helper pipeline in `src/pages/tag/index.astro`
- [ ] T015 [P] [US2] Add lightweight style and spacing rules for readable sentence presentation in `src/components/tag/ContentFormPrelude.astro`
- [ ] T016 [US2] Verify deterministic order is reflected in rendered sentence output in `src/pages/tag/index.astro`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Handle missing content-form tags safely (Priority: P3)

**Goal**: Prelude hides safely when no eligible tags exist, without impacting existing tag cloud behavior.

**Independent Test**: With zero matched content-form tags, `/tag` renders without prelude and still shows existing tag sections/empty states correctly.

### Implementation for User Story 3

- [ ] T017 [US3] Add guard logic to skip prelude render when derived prelude list is empty in `src/pages/tag/index.astro`
- [ ] T018 [US3] Ensure singular/plural variants collapse to one canonical entry in `src/utils/tag/contentFormTags.ts`
- [ ] T019 [US3] Confirm no regressions to existing popular/all tags and empty-state rendering in `src/pages/tag/index.astro`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, docs, and project quality gates.

- [ ] T020 [P] Update feature documentation notes for tag normalization behavior in `specs/010-tag-content-links/quickstart.md`
- [ ] T021 Run `pnpm run check` and fix any issues in `src/pages/tag/index.astro`, `src/components/tag/ContentFormPrelude.astro`, and `src/utils/tag/contentFormTags.ts`
- [ ] T022 Run `pnpm run build` and fix any regressions impacting `/tag` in `src/pages/tag/index.astro`
- [ ] T023 Run `pnpm run format:check` and format touched files if needed in `src/pages/tag/index.astro`, `src/components/tag/ContentFormPrelude.astro`, and `src/utils/tag/contentFormTags.ts`
- [ ] T024 [P] Document the new `/tag` prelude behavior and canonical writing-form normalization rules in `docs/` (or `README.md` if no dedicated docs page applies)
- [ ] T025 Run and record a manual timing check for SC-002 in `specs/010-tag-content-links/quickstart.md` (identify and click intended prelude link in under 5 seconds)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2 completion.
- **Phase 4 (US2)**: Depends on Phase 2 completion; can proceed after US1 for easier UI verification.
- **Phase 5 (US3)**: Depends on Phase 2 completion; validate after US1 wiring exists.
- **Phase 6 (Polish)**: Depends on all targeted stories being complete.

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories after foundational work.
- **US2 (P2)**: Builds on US1 display path but remains independently verifiable by sentence quality checks.
- **US3 (P3)**: Uses the same pipeline and independently verifies empty/missing-tag handling.

### Within Each User Story

- Implement data derivation before rendering updates.
- Keep canonical normalization source-of-truth in `src/utils/tag/contentFormTags.ts`.
- Complete story checkpoint validation before moving to next priority.

### Parallel Opportunities

- **Setup**: `T003` can run in parallel with `T001`/`T002` after file creation starts.
- **US2**: `T015` can run in parallel with `T013` once component structure exists.
- **Polish**: `T020` can run in parallel while implementation stabilizes before gate runs.

---

## Parallel Example: User Story 2

```bash
# Parallelizable after US2 starts:
Task: "Implement canonical plural label display in src/components/tag/ContentFormPrelude.astro"
Task: "Add lightweight style and spacing rules in src/components/tag/ContentFormPrelude.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate independent US1 navigation behavior on `/tag`.
4. Stop for MVP review/demo.

### Incremental Delivery

1. Ship US1 for functional browsing gain.
2. Add US2 for language/readability polish.
3. Add US3 for robustness in missing-tag cases.
4. Run all quality gates and finalize.

### Parallel Team Strategy

With multiple contributors after Phase 2:

1. Developer A: US1 page wiring in `src/pages/tag/index.astro`
2. Developer B: US2 presentation updates in `src/components/tag/ContentFormPrelude.astro`
3. Developer C: US3 robustness logic in `src/utils/tag/contentFormTags.ts`

---

## Notes

- All tasks follow the required checklist format with task ID and file path.
- `[Story]` labels are used only in user story phases.
- `[P]` markers are applied only where parallel execution is safe.
- Keep feature behavior aligned with `specs/010-tag-content-links/contracts/tag-content-prelude.md`.
