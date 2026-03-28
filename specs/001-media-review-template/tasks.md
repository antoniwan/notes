---
description: "Task list for media review template (001-media-review-template)"
---

# Tasks: Movie and TV review template

**Input**: Design documents from `/specs/001-media-review-template/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [data-model.md](./data-model.md), [research.md](./research.md), [quickstart.md](./quickstart.md), [contracts/](./contracts/)

**Tests**: Not requested in spec; validation via `pnpm run build`, `pnpm run check`, and manual acceptance per user stories.

**Organization**: Phases follow spec priorities P1–P4; foundational schema blocks all story work.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependencies within the same phase)
- **[Story]**: User story label `[US1]`…`[US4]` for story phases only
- Paths are relative to repository root unless noted

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align with feature docs and repo conventions before code changes.

- [ ] T001 Follow implementation order in `specs/001-media-review-template/quickstart.md` and keep work on branch `001-media-review-template`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Content schema and documentation required before any layout or Letterboxd work.

**⚠️ CRITICAL**: Complete this phase before User Stories 1–4.

- [ ] T002 Add `media-reviews` category (id, name, description, icon) to `src/data/categories.ts` per [data-model.md](./data-model.md)
- [ ] T003 Extend blog collection Zod schema in `src/content.config.ts` with `template`, `mediaType`, `workTitle`, `releaseYear`, optional `seasonLabel`, `trailerUrl`; enforce required media fields when `template === 'media-review'`
- [ ] T004 Document new category id and media-review frontmatter fields in `docs/frontmatter-spec.md`

**Checkpoint**: `pnpm run check` passes; category id is valid for `category` arrays in new posts.

---

## Phase 3: User Story 1 — Read a media review on a phone (Priority: P1) 🎯 MVP

**Goal**: Distinct mobile-first media review page with poster-led hero, work title, Film/TV labeling, and body content—without trailer or Letterboxd.

**Independent Test**: Publish one `template: media-review` post with `heroImage` and body only; open `/p/...` on a narrow viewport—poster + title prominent, readable text, no horizontal scroll for core content (spec SC-001).

### Implementation for User Story 1

- [ ] T005 [P] [US1] Add `MediaReviewLayoutProps` (or extend shared types) in `src/types/layout.ts` for media review layout props used by `src/pages/p/[...slug].astro`
- [ ] T006 [P] [US1] Create `src/components/media-review/MediaReviewHero.astro` (poster via `heroImage`, `workTitle`, `mediaType`, `releaseYear`, optional `seasonLabel`, fallback when poster missing)
- [ ] T007 [US1] Create `src/layouts/MediaReviewLayout.astro` composing BaseLayout/PageHeader patterns as needed, mobile-first grid, slot for MDX body and future trailer/Letterboxd regions
- [ ] T008 [US1] Update `src/pages/p/[...slug].astro` to branch: when `post.data.template === 'media-review'`, render `MediaReviewLayout` with post props; otherwise keep existing `BlogLayout` path
- [ ] T009 [US1] Add Send Help (2026) media review markdown under `src/content/p/` with `template: media-review`, required media fields, `category` including `media-reviews`, `heroImage` poster path, no `trailerUrl` yet

**Checkpoint**: MVP route works; editorial posts unchanged.

---

## Phase 4: User Story 2 — Author publishes poster + optional trailer (Priority: P2)

**Goal**: Optional `trailerUrl` with in-page YouTube nocookie embed or external link; no empty chrome when absent (FR-004, SC-002).

**Independent Test**: Same post with and without `trailerUrl`—trailer plays on user action; without URL, no trailer block.

### Implementation for User Story 2

- [ ] T010 [P] [US2] Create `src/components/media-review/MediaReviewTrailer.astro` (YouTube nocookie iframe when URL is YouTube, else labeled external link; no autoplay; `title` on iframe)
- [ ] T011 [US2] Integrate `MediaReviewTrailer.astro` into `src/layouts/MediaReviewLayout.astro` only when `trailerUrl` is set
- [ ] T012 [US2] Add optional `trailerUrl` to Send Help post in `src/content/p/` when an official trailer URL is available

**Checkpoint**: Trailer behavior matches spec edge cases (invalid URL → graceful omit or message).

---

## Phase 5: User Story 3 — Editorial vs media layout obviously different (Priority: P3)

**Goal**: Side-by-side, readers recognize media review vs normal article (P3, SC-003).

**Independent Test**: Open any editorial post and the Send Help review—clear structural/visual difference (poster-led vs essay layout).

### Implementation for User Story 3

- [ ] T013 [US3] Refine Tailwind/layout tokens in `src/layouts/MediaReviewLayout.astro` and `src/components/media-review/MediaReviewHero.astro` so composition is clearly distinct from `src/layouts/BlogLayout.astro` (not just same chrome with different image)
- [ ] T014 [US3] Verify listing cards and feeds still show correct title/image for media reviews—adjust `src/components/PostCard.astro` and/or feed utilities under `src/utils/` if `heroImage` or categories need special casing (FR-007)

**Checkpoint**: Visual differentiation + listings accurate.

---

## Phase 6: User Story 4 — Optional Letterboxd (links + RSS UI on reviews only) (Priority: P4)

**Goal**: Site-level Letterboxd profile link on media review pages, `src/pages/about.astro`, and `src/components/Footer.astro`; RSS-driven recent activity **only** on media review pages; fail soft if env unset or fetch fails (FR-009, FR-010, spec clarifications).

**Independent Test**: With env URLs set—footer and About show plain links only; media review shows optional RSS block. With URLs unset—no broken UI. About/footer never show RSS widget.

### Implementation for User Story 4

- [ ] T015 [P] [US4] Create `src/config/letterboxd.ts` exporting profile URL and RSS URL from `import.meta.env` (document variable names in `README.md` or `docs/` in polish phase)
- [ ] T016 [US4] Implement `src/utils/letterboxdRss.ts` to fetch and parse public RSS at build time into items matching `specs/001-media-review-template/contracts/letterboxd-feed-item.schema.json`, with in-memory build cache and empty array on failure
- [ ] T017 [P] [US4] Create `src/components/media-review/LetterboxdRecent.astro` rendering capped list (e.g. 5–10 items) with attribution label
- [ ] T018 [US4] Call `letterboxdRss` from `src/pages/p/[...slug].astro` (or layout) only for `template: media-review` entries and pass items into `src/layouts/MediaReviewLayout.astro`; render `LetterboxdRecent.astro` inside media layout only
- [ ] T019 [P] [US4] Add optional plain Letterboxd profile `<a>` to `src/components/Footer.astro` using `src/config/letterboxd.ts` when URL configured
- [ ] T020 [P] [US4] Add optional plain Letterboxd profile link to `src/pages/about.astro` using `src/config/letterboxd.ts` when URL configured
- [ ] T021 [US4] Add optional plain Letterboxd profile link on media review pages via `src/components/media-review/LetterboxdProfileLink.astro` or equivalent inside `src/layouts/MediaReviewLayout.astro`

**Checkpoint**: No RSS UI on About or footer; media review optional blocks degrade cleanly.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Docs, SEO/structured data alignment, quality gates.

- [ ] T022 [P] Document Letterboxd env vars and media-review frontmatter in `README.md` or `docs/` (embed privacy: YouTube nocookie, no autoplay)
- [ ] T023 [P] If JSON-LD or Open Graph need `Review` or adjusted types for media posts, update `src/utils/structuredData.ts` and/or `src/components/StructuredData.astro` per `docs/structured-data-optimization.md`
- [ ] T024 Run `pnpm run build`, `pnpm run check`, and `pnpm run format:check` from repository root; fix any regressions
- [ ] T025 Run `pnpm run lint` if ESLint applies to touched files and resolve new issues in edited paths only

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** → **Phase 2** → **Phase 3–6** (user stories) → **Phase 7**
- **Phase 2** blocks all user stories (schema + category + docs)

### User Story Dependencies

- **US1**: After Phase 2. No dependency on US2–US4.
- **US2**: After US1 (needs `MediaReviewLayout` and post branch).
- **US3**: After US1; best after US2 when layout is complete.
- **US4**: After US1 (RSS UI mounts on media layout); can proceed in parallel with US2/US3 only if layout shell already exposes slots (recommended order: US1 → US2 → US3 → US4).

### Parallel Opportunities

- **Phase 2**: T004 can start after T002 (T003 depends on T002 for category enum).
- **US1**: T005 and T006 parallel; T007 after hero/types; T008 after T007; T009 after T008.
- **US2**: T010 parallel with unrelated files; T011 after T010.
- **US4**: T015, T017, T019, T020 parallel once Phase 2 done; T016 before T018; T018 before validating T017 integration.

---

## Parallel Example: User Story 1

```text
# After T002–T003 complete:
Parallel: T005 (src/types/layout.ts) + T006 (src/components/media-review/MediaReviewHero.astro)
Then sequential: T007 → T008 → T009
```

---

## Parallel Example: User Story 4

```text
Parallel: T015 (src/config/letterboxd.ts) + T017 (LetterboxdRecent.astro) + T019 (Footer.astro) + T020 (about.astro)
Sequential: T016 (letterboxdRss.ts) → T018 (wire in [...slug] + layout) → T021 (profile link on review)
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 + Phase 2  
2. Phase 3 (US1) through T009  
3. Stop: validate Send Help page on mobile (SC-001, FR-001–FR-003, FR-006)

### Incremental Delivery

1. Add US2 (trailer) → validate SC-002  
2. Add US3 (differentiation + listings) → validate SC-003 / FR-007  
3. Add US4 (Letterboxd) → validate FR-009/FR-010 and clarifications  
4. Phase 7 gates

---

## Task Summary

| Phase | Task IDs | Count |
|-------|----------|-------|
| Setup | T001 | 1 |
| Foundational | T002–T004 | 3 |
| US1 | T005–T009 | 5 |
| US2 | T010–T012 | 3 |
| US3 | T013–T014 | 2 |
| US4 | T015–T021 | 7 |
| Polish | T022–T025 | 4 |
| **Total** | **T001–T025** | **25** |

**Parallel opportunities**: Marked `[P]` on 12 tasks (where dependencies allow).

**Suggested MVP scope**: Phase 1–2 + Phase 3 (T001–T009) only.
