# Contract: Related posts block (reader-visible behavior)

**Feature**: `008-related-posts-ui`  
**Spec**: `specs/008-related-posts-ui/spec.md`  
**Consumers**: Post pages using `BlogLayout` + `RelatedPosts` at `src/components/related-posts/RelatedPosts.astro`

## Preconditions

- Page is a public post route (`/p/{slug}`).
- Layout receives `currentPost` and full `allPosts` blog collection (existing prop pattern).

## Observable behavior

1. **Visibility**: The block renders **only if** at least one candidate passes all filters below. Otherwise **no** section markup (no empty heading, no “no results” copy).

2. **Candidate filters** (all required):
   - Not the current post.
   - Not `draft`.
   - Not `published: false`.
   - **Language**: `currentPost.data.language` ∩ `candidate.data.language` ≠ ∅.

3. **Ordering**: Candidates sorted by **relevance score** (higher first). **Tie-break**: newer `pubDate` first.

4. **Scoring** (documented for maintainers; adjust only with spec/plan update):
   - For each shared tag between current and candidate: **+10** base, plus `getTagWeight(tag)` from `src/data/tags`.
   - For each shared category id: **+5**.
   - Recency of **candidate** `pubDate`: ≤30 days **+2**; ≤90 days **+1**; else **+0**.
   - If candidate `featured`: **+3**.

5. **Cap**: At most **4** suggestions unless a single call site passes a different `maxCount` (must remain consistent with **FR-005**).

6. **List content**: Each item links to `/p/{id}`, shows title; shows description when present in frontmatter; shows reading time using `minutesRead` when present, else body-based fallback (same rule as post page).

7. **Secondary action**: When the block is shown, a **browse all writings** (or equivalent) link to the site archive remains available (existing `/everything` pattern unless product renames) — **FR-008**.

8. **Accessibility**:
   - Section has a visible heading.
   - Suggestions are in a semantic list; each title is part of a focusable link with visible focus.
   - Reduced motion: no essential information conveyed only through animation.

## Out of scope (must not appear)

- Cross-language suggestions in this block.
- Server-personalized ordering or client read-history reordering.
- Calls to third-party recommendation APIs.
