# Phase 0: Research — Media review template

## 1. How to branch layout for one post type

**Decision:** Use an explicit frontmatter flag `template: 'media-review'` (string enum in Zod) on `blog` collection entries.

**Rationale:** Category alone is ambiguous (a culture post might not be a review). A discriminator keeps `getStaticPaths` and feed logic unchanged and makes intent obvious in content.

**Alternatives considered:** New Astro collection `mediaReviews` (rejected: duplicates routing, feeds, and translation patterns); category-only switch (rejected: weak coupling).

## 2. Letterboxd RSS consumption

**Decision:** Fetch the public RSS URL **once per build** inside a small utility (`src/utils/letterboxdRss.ts`), parse XML to a normalized array, cache in module scope for the duration of the build so multiple media review pages do not re-fetch.

**Rationale:** Matches constitution **static-first**; no Letterboxd API keys; failures degrade to empty optional UI (FR-008, FR-010).

**Alternatives considered:** Runtime client fetch (rejected: unnecessary client JS, CORS unknown); committed JSON snapshot (optional later for offline builds; not required for v1).

## 3. Trailer presentation

**Decision:** Primary: **YouTube** URLs parsed to embed via `youtube-nocookie.com` iframe, **no autoplay**, click-to-play. Secondary: arbitrary URL opens in new tab with labeled button (“Watch trailer”) when embed is not used.

**Rationale:** Satisfies “in-context” viewing (FR-004) and spec edge case on motion/autoplay; aligns with privacy posture (nocookie, no surprise audio).

**Alternatives considered:** Autoplay muted (rejected: spec prefers explicit user action); only link-out (acceptable fallback when URL is not YouTube).

## 4. Poster image field

**Decision:** Reuse existing **`heroImage`** for the poster path in v1 **or** add optional `mediaPoster` that falls back to `heroImage` for OG/card consistency—document one canonical approach in [data-model.md](./data-model.md).

**Rationale:** Minimizes duplicate images in frontmatter; `heroImage` already drives OG in existing pipeline.

**Alternatives considered:** Separate field only (clearer semantics, slightly more frontmatter); **Recommendation in data-model:** prefer `heroImage` as poster for media reviews + `imageAlt` for accessibility.

## 5. Site-level Letterboxd links

**Decision:** Centralize optional URLs in `src/config/letterboxd.ts` reading `import.meta.env` (Astro) with empty string = disabled.

**Rationale:** Single source for Footer, About, and media-review components; no per-post duplication (matches spec entities).

## 6. Category for reviews

**Decision:** Add a dedicated category id (e.g. `media-reviews`) in `src/data/categories.ts` and document in `docs/frontmatter-spec.md`.

**Rationale:** Constitution requires category ids to exist in `categories.ts`; improves filtering and FR-007 listing accuracy.
