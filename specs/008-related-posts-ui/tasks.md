---
description: 'Task list for 008-related-posts-ui'
---

# Tasks: Related Posts Section Enhancement

**Input**: Design documents from `/specs/008-related-posts-ui/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Not requested in spec; verification via `pnpm` gates and `quickstart.md` manual checks.

**Organization**: Phases follow user story priorities (P1 → P2 → P3), then polish.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no ordering dependency)
- **[Story]**: `[US1]` / `[US2]` / `[US3]` for user-story phases only
- Paths are relative to repository root unless noted

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align implementer with contracts and file targets before code changes.

- [ ] T001 Review `specs/008-related-posts-ui/plan.md`, `specs/008-related-posts-ui/contracts/related-posts-behavior.md`, and `specs/008-related-posts-ui/data-model.md` for filters, scoring, and acceptance expectations

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core selection logic every story depends on. **No user story UI work should ship before this.**

**⚠️ CRITICAL**: T002 adds **FR-004** (same-language intersection) and **`published === false`** exclusion at the util layer. **FR-002** (exclude self) and **FR-003** (exclude drafts) MUST remain as today when editing `findRelatedPosts` in `src/utils/tagProcessing.ts` — do not regress those filters.

- [ ] T002 Extend `findRelatedPosts` in `src/utils/tagProcessing.ts` to exclude candidates with `published === false` and to require a non-empty intersection between `currentPost.data.language` and `candidate.data.language` (same-language rule per **FR-004**); **preserve** existing self-exclusion and draft exclusion

**Checkpoint**: Build still succeeds; related lists on posts will shrink or empty correctly once the component uses the updated util.

---

## Phase 3: User Story 1 - Discover the next read (Priority: P1) 🎯 MVP

**Goal**: Readers see up to four same-language, public suggestions with correct links; block hidden when none qualify (**FR-001**, **FR-002**, **FR-003**, **FR-004**, **FR-005**).

**Independent Test**: Open EN and ES posts with overlapping tags/categories; confirm no self-links, no drafts, no `published: false`, no cross-language items; empty state omits the section.

### Implementation for User Story 1

- [ ] T003 [US1] Create `src/components/related-posts/RelatedPosts.astro` by migrating logic and markup from `src/components/RelatedPosts.astro`, calling `findRelatedPosts(currentPost, allPosts, 4)` and preserving conditional render when the list is empty
- [ ] T004 [US1] Update `import RelatedPosts from '...'` in `src/layouts/BlogLayout.astro` to `../components/related-posts/RelatedPosts.astro`
- [ ] T005 [US1] Delete `src/components/RelatedPosts.astro` and fix any remaining imports (search repo for `RelatedPosts.astro`)

**Checkpoint**: MVP behavior matches **User Story 1** acceptance scenarios; constitution path for feature component satisfied.

---

## Phase 4: User Story 2 - Scan and choose quickly (Priority: P2)

**Goal**: Responsive, scannable list; visible focus; controlled truncation; **FR-008** browse-all link; **minutesRead** from pipeline with body fallback (**FR-007**, **FR-009**, **FR-010**, **SC-003**, **SC-004**).

**Independent Test**: Resize the viewport; tab through links; compare reading time to `src/pages/p/[...slug].astro` for the same target post.

### Implementation for User Story 2

- [ ] T006 [US2] Refactor `src/components/related-posts/RelatedPosts.astro` to use Tailwind utility classes aligned with post chrome (spacing, typography, borders, hover/focus) and semantic structure (`section`, heading, `ol`/`li`, links); **explicitly keep** the **FR-008** secondary action linking to `/everything` (or current archive URL) with visible `focus-visible` styles
- [ ] T007 [US2] In `src/components/related-posts/RelatedPosts.astro`, set displayed reading time to `post.data.minutesRead ?? calculateReadingTimeFromMarkdown(post.body || '')` (match `src/pages/p/[...slug].astro`)
- [ ] T008 [US2] In `src/components/related-posts/RelatedPosts.astro`, remove or minimize redundant scoped CSS; use `motion-reduce:` / non-essential transitions only so **FR-010** holds

**Checkpoint**: **User Story 2** passes keyboard and viewport checks from `specs/008-related-posts-ui/quickstart.md`.

---

## Phase 5: User Story 3 - Trust and tune relatedness (Priority: P3)

**Goal**: Maintainer-visible documentation matches code (**FR-011**).

**Independent Test**: Line-by-line compare `specs/008-related-posts-ui/contracts/related-posts-behavior.md` to `findRelatedPosts` scoring and filters.

### Implementation for User Story 3

- [ ] T009 [US3] Update `specs/008-related-posts-ui/contracts/related-posts-behavior.md` so documented filters, weights, tie-breaks, and cap match the final `findRelatedPosts` implementation in `src/utils/tagProcessing.ts`

**Checkpoint**: Contract is source of truth for audits and **SC-002** review.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates and doc hygiene.

- [ ] T010 [P] Run `pnpm run format:check`, `pnpm run check`, and `pnpm run build` from repository root; if `src/content.config.ts` or frontmatter validation rules change in this PR, also run `pnpm run audit-frontmatter`
- [ ] T011 Follow `specs/008-related-posts-ui/quickstart.md` manual checks (language mix, empty state, keyboard order); optionally record **SC-002** sample pass rate for maintainer review
- [ ] T012 [P] Search `docs/` and `specs/` for `src/components/RelatedPosts.astro` references and update paths to `src/components/related-posts/RelatedPosts.astro` where still accurate

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** → **Phase 2** → **Phase 3 (US1)** → **Phase 4 (US2)** → **Phase 5 (US3)** → **Phase 6**
- **US2** assumes **US1** component path and imports are stable.
- **US3** should run after scoring/filter code is final (typically after **T002** and any late tweaks from **US1/US2**).

### User Story Dependencies

- **US1**: Depends on **Phase 2** only.
- **US2**: Depends on **US1** (same component file).
- **US3**: Depends on finalized `src/utils/tagProcessing.ts` behavior; best after **US1**/**US2** unless util frozen earlier.

### Parallel Opportunities

- **T010** and **T012** can run in parallel after implementation stabilizes (different concerns: commands vs doc grep).
- **US1** tasks **T003 → T004 → T005** are sequential (same feature slice).
- **US2** tasks **T006–T008** touch one file; run in listed order.

---

## Parallel Example: Polish Phase

```bash
# After feature complete:
# Terminal A
pnpm run format:check && pnpm run check && pnpm run build

# Terminal B (doc grep)
rg 'src/components/RelatedPosts\.astro' docs specs
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete **Phase 1** and **Phase 2** (T001–T002).  
2. Complete **Phase 3** (T003–T005).  
3. **STOP and VALIDATE**: EN/ES posts, empty state, no bad candidates.  
4. Proceed to **US2** polish when MVP is correct.

### Incremental Delivery

1. **T002** fixes eligibility (language + published) for entire site.  
2. **T003–T005** relocate component and satisfy constitution layout guidance.  
3. **T006–T008** improve UX without changing selection rules.  
4. **T009** locks maintainer contract to code.  
5. **T010–T012** gates and reference cleanup.

---

## Notes

- No new automated test files unless project policy changes; rely on build + manual quickstart.  
- If `findRelatedPosts` weights change during audit, update **T009** in the same PR.  
- Do not add `getCollection` calls to global layouts for this feature (per `plan.md` performance note).
