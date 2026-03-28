# Implementation Plan: Movie and TV review template

**Branch**: `001-media-review-template` | **Date**: 2026-03-28 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/001-media-review-template/spec.md`

## Summary

Add a **distinct, mobile-first layout** for film and TV reviews (poster-led hero, optional trailer, clear movie vs TV labeling) while keeping the rest of the site on the existing editorial `BlogLayout`. Ship **Send Help (2026)** as the first post using the template.

**Optional Letterboxd:** **Site-level** configuration supplies a **profile URL** and optional **public RSS URL**. **Plain links** to Letterboxd may appear on **media review pages**, **About**, and **footer**. **RSS-driven UI** (recent activity list) appears **only on media review pages**, built from a **single build-time fetch** of the public RSS feed—no Letterboxd API, no TMDB or other catalog APIs. If the fetch fails or URLs are unset, optional blocks omit cleanly (FR-008).

A dedicated **Movies / TV hub page** is **out of scope** (future spec).

## Technical Context

**Language/Version**: TypeScript (strict), Astro 6.x per [constitution](../../.specify/memory/constitution.md)  
**Primary Dependencies**: Astro Content Collections, Zod (`src/content.config.ts`), Tailwind CSS, MDX/Markdown pipeline  
**Storage**: Markdown/MDX under `src/content/p/`; optional site config module (e.g. `src/config/letterboxd.ts` or env-driven constants)  
**Testing**: Manual + existing gates (`pnpm run build`, `pnpm run check`, `format:check`, validators when feeds/frontmatter/JSON-LD touched)  
**Target Platform**: Static site (prerender); optional Vercel adapter unchanged  
**Project Type**: Content-first Astro blog / notes site  
**Performance Goals**: One RSS fetch per build (not per page request); avoid duplicate `getCollection` in hot paths per constitution  
**Constraints**: Static-first; no new server-only reader tracking; trailer embed must be **click-to-play**, no autoplay with sound (spec edge cases)  
**Scale/Scope**: Single author, low volume of media reviews; RSS item cap (e.g. 5–10) for sidebar/widget

## Constitution Check

*GATE: Passed. Re-checked after Phase 1 design.*

| Principle | How this plan complies |
|-----------|-------------------------|
| **I. Content schema** | Extend Zod schema in `src/content.config.ts` + document new fields in `docs/frontmatter-spec.md`. Add category id to `src/data/categories.ts` if reviews use a dedicated category (recommended). Run `pnpm run audit-frontmatter` after schema/content changes. |
| **II. Static-first** | Letterboxd RSS fetched at **build time** only; HTML is prerendered. No new dynamic API routes required for core feature. Optional: `fetch` in Astro build with graceful `[]` on failure. |
| **III. Quality gates** | `pnpm run build`, `pnpm run check`, `pnpm run format:check` MUST pass. If post metadata, feed generators, or structured data for reviews change: run `validate-feeds`, `audit-frontmatter`, and `validate-structured-data` as appropriate. |
| **IV. Privacy** | Letterboxd RSS is public data; no reader cookies. YouTube trailer embed: use **youtube-nocookie** domain, **no autoplay**, document third-party embed in `docs/` if not already covered. No analytics on iframe without disclosure. |
| **V. Discoverability** | If review posts affect OG images, canonical URLs, or Schema.org `Article`/`Review`, align with `docs/structured-data-optimization.md` and update generators if needed. |
| **Component placement** | New UI under `src/components/media-review/`; routing remains `src/pages/p/[...slug].astro` with layout branching. |

**Layout note:** Constitution suggests pages under `src/pages/<feature>/`; this feature **reuses** existing post URLs (`/p/...`) with a **template switch**, which is acceptable and avoids duplicate URL schemes.

## Project Structure

### Documentation (this feature)

```text
specs/001-media-review-template/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1 (RSS item JSON shape)
└── tasks.md             # /speckit.tasks (not created here)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── media-review/           # NEW: poster hero, trailer, Letterboxd RSS block, labels
├── config/
│   └── letterboxd.ts           # NEW (optional): site-level profile + RSS URLs, feature flags
├── content/
│   └── p/                      # NEW post: send-help-2026 review (MD/MDX)
├── content.config.ts           # EXTEND: media review frontmatter fields + template discriminator
├── data/
│   └── categories.ts           # EXTEND: e.g. media-reviews category
├── layouts/
│   └── BlogLayout.astro        # OR new MediaReviewLayout.astro + branch in [...slug].astro
├── pages/
│   ├── p/[...slug].astro       # EXTEND: pass template + media props; pick layout
│   └── about.astro             # EXTEND: optional Letterboxd plain link from config
├── utils/
│   └── letterboxdRss.ts        # NEW: build-time fetch + parse → LetterboxdFeedItem[]
└── components/
    └── Footer.astro            # EXTEND: optional Letterboxd plain link from config
```

**Structure Decision:** Feature components isolated under `src/components/media-review/`; post route stays `src/pages/p/[...slug].astro` with conditional layout or conditional slots inside a thin wrapper. Site-wide Letterboxd **links** wired from `src/config/letterboxd.ts` (or env) into `Footer.astro` and `about.astro`.

## Technical Design

### 1. Detecting a media review post

- Add optional frontmatter discriminator, e.g. `template: 'media-review'` (default absent = editorial).
- When `template === 'media-review'`, render **media review layout** and validate **media-specific fields** (see [data-model.md](./data-model.md)).

### 2. Layout and UI

- **Mobile-first:** Poster + work title + type badge (Film / TV) above the fold; article body below; optional trailer section (embed or external link per research).
- **Desktop:** Preserve reading experience; may use a column layout but must not contradict SC-001 (poster + title visible on phone).
- **Differentiation from editorial:** Distinct typography, poster aspect ratio, optional “work metadata” row (year, media type)—satisfies FR-001 / P3.

### 3. Trailer (FR-004)

- Prefer **YouTube nocookie** iframe with **`loading="lazy"`**, **no autoplay**, **title** attribute for a11y; support alternate “open trailer” link if only a URL is provided.

### 4. Letterboxd (FR-009, FR-010)

- **Config:** e.g. `LETTERBOXD_PROFILE_URL`, `LETTERBOXD_RSS_URL` (env) or exported constants in `src/config/letterboxd.ts`. Empty = feature off.
- **Links:** Render in footer / About / media review as normal `<a rel="noopener noreferrer">` with clear label (“Letterboxd”).
- **RSS UI:** `letterboxdRss.ts` parses RSS/XML at build, maps to `LetterboxdFeedItem[]` (see [contracts/](./contracts/)). Component `media-review/LetterboxdRecent.astro` renders only inside media review layout. On failure: render nothing or one short non-alarming line.

### 5. Feeds and listings (FR-007)

- Media reviews remain normal `blog` collection entries; ensure PostCard / category pages show sensible image (poster via `heroImage` or dedicated field) and titles unchanged.

## Phase 0 & Phase 1 Artifacts

| Artifact | Path |
|----------|------|
| Research decisions | [research.md](./research.md) |
| Frontmatter / entities | [data-model.md](./data-model.md) |
| Dev workflow | [quickstart.md](./quickstart.md) |
| RSS parse contract | [contracts/letterboxd-feed-item.schema.json](./contracts/letterboxd-feed-item.schema.json) |

## Risks

| Risk | Mitigation |
|------|------------|
| Letterboxd RSS shape changes | Defensive parser; cap items; fail soft to empty list |
| YouTube embed CSP / privacy | nocookie domain, documented in docs, no tracking params |
| Schema drift | Update Zod + `audit-frontmatter` in CI |

## Complexity Tracking

No constitution violations requiring justification. Empty table.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
