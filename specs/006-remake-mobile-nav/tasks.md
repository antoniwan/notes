# Tasks: Professional Mobile Navigation Refresh

**Input**: Design documents from `/specs/006-remake-mobile-nav/`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: No automated test suite additions requested in the spec; validation is performed through manual acceptance checks plus project quality gates.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature scope and guardrails before behavior changes

- [ ] T001 Review and lock implementation scope against `specs/006-remake-mobile-nav/spec.md`
- [ ] T002 Review interaction decisions and edge behavior in `specs/006-remake-mobile-nav/research.md`
- [ ] T003 [P] Capture baseline screenshots/video of current mobile menu behavior from `src/components/MobileNav.astro`
- [ ] T004 [P] Confirm target navigation labels/order source in `src/data/navigation.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared structural updates required before any story implementation

**CRITICAL**: No user story work should start until this phase is complete.

- [ ] T005 Refactor menu open/close state helpers for single-source state transitions in `src/components/MobileNav.astro`
- [ ] T006 Add centralized dismiss-reason handling (`close-button`, `overlay-tap`, `escape-key`, `back-action`, `link-selection`) in `src/components/MobileNav.astro`
- [ ] T007 Implement robust event listener setup/cleanup for Astro page lifecycle in `src/components/MobileNav.astro`
- [ ] T008 [P] Align mobile trigger and dialog semantics baseline (`aria-expanded`, `aria-controls`, dialog labeling) in `src/components/MobileNav.astro`
- [ ] T009 [P] Ensure header-level integration points remain compatible with mobile menu lifecycle in `src/components/Header.astro`

**Checkpoint**: Foundation ready for independent user story delivery.

---

## Phase 3: User Story 1 - Quickly reach key pages on mobile (Priority: P1) 🎯 MVP

**Goal**: Visitors can reliably open mobile navigation, see required destinations, and navigate in minimal taps.

**Independent Test**: In a mobile viewport, open menu on multiple pages and navigate to each required destination in <=2 taps from menu open.

### Implementation for User Story 1

- [ ] T010 [US1] Enforce v1 destination set (Home, Posts, Brain Science, About, Search) in mobile render path within `src/components/MobileNav.astro`
- [ ] T011 [P] [US1] Update navigation data mapping to support required destination visibility in `src/data/navigation.ts`
- [ ] T012 [US1] Ensure selecting any destination closes menu before navigation completes in `src/components/MobileNav.astro`
- [ ] T013 [US1] Preserve background page state/scroll context when menu is dismissed without navigation in `src/components/MobileNav.astro`
- [ ] T014 [US1] Implement first Back action to close open menu without leaving current page in `src/components/MobileNav.astro`
- [ ] T015 [US1] Keep overflow content usable on small viewports (scrollable menu body + stable header actions) in `src/components/MobileNav.astro`

**Checkpoint**: User Story 1 is independently functional and manually testable.

---

## Phase 4: User Story 2 - Understand current location and choices (Priority: P2)

**Goal**: Visitors can quickly understand where they are and which options are primary.

**Independent Test**: Open menu and verify active page indication and hierarchy clarity without prior site familiarity.

### Implementation for User Story 2

- [ ] T016 [US2] Improve active-state visibility for current destination in mobile menu items in `src/components/MobileNav.astro`
- [ ] T017 [P] [US2] Normalize destination labels to unambiguous naming where needed in `src/data/navigation.ts`
- [ ] T018 [US2] Apply hierarchy styling so Brain Science stays neutral and is not prioritized above Guided Path in `src/components/MobileNav.astro`
- [ ] T019 [US2] Keep visual treatment aligned with header/navigation design tokens by matching spacing, typography scale, and contrast usage in `src/components/MobileNav.astro`
- [ ] T020 [US2] Sync shared navigation highlight behavior with desktop logic by updating and reusing active-state helpers in `src/utils/navActive.ts`

**Checkpoint**: User Story 2 works independently while preserving User Story 1 behavior.

---

## Phase 5: User Story 3 - Use the menu with assistive and keyboard input (Priority: P3)

**Goal**: Keyboard and assistive technology users can open, traverse, and close navigation predictably.

**Independent Test**: With keyboard-only flow and screen reader pass, complete open -> inspect -> navigate/close -> focus return with no traps.

### Implementation for User Story 3

- [ ] T021 [US3] Move focus into menu predictably on open and return focus to trigger on close in `src/components/MobileNav.astro`
- [ ] T022 [US3] Add/adjust keyboard traversal behavior to prevent background focus escape while menu is open in `src/components/MobileNav.astro`
- [ ] T023 [US3] Ensure Escape closes menu from any focusable menu control in `src/components/MobileNav.astro`
- [ ] T024 [P] [US3] Improve control labels and state announcements for assistive technologies in `src/components/MobileNav.astro`
- [ ] T025 [US3] Validate compatibility between mobile search toggle and menu focus lifecycle in `src/components/Header.astro`

**Checkpoint**: User Story 3 is independently functional and accessible behavior is verifiable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, regression checks, and release-readiness steps

- [ ] T026 [P] Run manual quickstart verification checklist from `specs/006-remake-mobile-nav/quickstart.md`
- [ ] T027 Run quality gates: `pnpm run lint`, `pnpm run check`, `pnpm run format:check`, `pnpm run build` from repository root
- [ ] T028 [P] Perform responsive regression pass for desktop unaffected behavior in `src/components/Header.astro` and `src/components/Navigation.astro`
- [ ] T029 [P] Perform final accessibility smoke pass for mobile menu interactions in `src/components/MobileNav.astro`
- [ ] T030 [P] Execute timed navigation validation for SC-001 (10-second target path checks) and document outcomes in `specs/006-remake-mobile-nav/quickstart.md`
- [ ] T031 [P] Execute current-location recognition validation for SC-002 and document pass/fail outcomes in `specs/006-remake-mobile-nav/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Starts immediately
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories
- **Phase 3 (US1)**: Depends on Phase 2; delivers MVP
- **Phase 4 (US2)**: Depends on Phase 3 baseline behavior
- **Phase 5 (US3)**: Depends on foundational state lifecycle from Phase 2 and stable menu structure from US1
- **Phase 6 (Polish)**: Depends on completion of all targeted user stories

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories after foundational completion
- **US2 (P2)**: Builds on US1 destination and active-state baseline
- **US3 (P3)**: Uses US1 menu lifecycle and can be validated independently after implementation

### Within-Story Execution Notes

- Implement structural/state tasks before style refinements.
- Preserve single-source open/close state logic to avoid behavior drift.
- Validate each story independently before moving to the next phase.

### Parallel Opportunities

- Setup: T003 and T004 can run in parallel.
- Foundational: T008 and T009 can run in parallel after T005-T007 begin.
- US1: T011 can run in parallel with T010 once destination set is agreed.
- US2: T017 can run in parallel with T016.
- US3: T024 can run in parallel with T021-T023.
- Polish: T026, T028, T029, T030, and T031 can run in parallel before final gate run in T027.

---

## Parallel Example: User Story 2

```bash
Task: "T016 [US2] Improve active-state visibility in src/components/MobileNav.astro"
Task: "T017 [P] [US2] Normalize destination labels in src/data/navigation.ts"
Task: "T020 [US2] Sync shared highlight behavior in src/utils/navActive.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1 and Phase 2.
2. Deliver Phase 3 (US1).
3. Run independent mobile navigation test for US1.
4. Demo/review MVP before hierarchy and accessibility refinements.

### Incremental Delivery

1. US1: Core open/close/navigation reliability.
2. US2: Hierarchy and professional visual clarity.
3. US3: Accessibility and keyboard predictability.
4. Polish: quality gates and regression confidence.

### Parallel Team Strategy

1. One contributor handles foundational lifecycle refactor.
2. One contributor handles destination/hierarchy data and styling.
3. One contributor handles accessibility semantics and keyboard flow.
4. Merge for unified regression and quality-gate pass.

---

## Notes

- `[P]` tasks are safe parallel candidates only when touching independent files or non-overlapping concerns.
- Story labels (`[US1]`, `[US2]`, `[US3]`) ensure requirement traceability.
- SC-005 is post-release outcome tracking and is not a blocking implementation task for this feature.
