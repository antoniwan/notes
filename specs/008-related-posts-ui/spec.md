# Feature Specification: Related Posts Section Enhancement

**Feature Branch**: `008-related-posts-ui`  
**Created**: 2026-04-09  
**Status**: Draft  
**Input**: User description: "audit and rework the RelatedPosts component for enhanced UI and features. I don't know today if the used approach is the best, although it looks correct."

<!--
  Notes platform: Features touching `src/content/p/`, frontmatter, feeds, or Schema.org output
  MUST align with docs/frontmatter-spec.md and related docs in docs/. See
  `.specify/memory/constitution.md` for non-negotiable constraints (static-first default, privacy,
  verification gates).
-->

## Clarifications

### Session 2026-04-09

- Q: For multilingual content, should related suggestions include only the same language as the current article, or allow cross-language matches? → A: Same language as the current article only (no cross-language items in the list).

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Discover the next read (Priority: P1)

After finishing (or skimming) an essay, a reader sees a short list of other writings that feel connected to what they just read, each opening in a predictable way when chosen.

**Why this priority**: This is the core value of the module—continued reading without hunting the archive.

**Independent Test**: Publish a post with overlapping topics with several others; open the post and confirm the module lists only other writings, ordered in a stable, explainable way, with working links.

**Acceptance Scenarios**:

1. **Given** a published post with at least one other published post that shares topic or collection metadata, **When** the reader scrolls past the main content, **Then** they see a labeled block of suggested writings (up to a fixed maximum count).
2. **Given** the current post, **When** the module renders, **Then** the current post never appears in the list and draft or unpublished items never appear.
3. **Given** a post with no qualifying candidates, **When** the page loads, **Then** the related block is omitted entirely (no empty shell).
4. **Given** the site publishes writings in more than one language, **When** the reader views an article in a given language, **Then** every suggestion (if any) is in that same language.

---

### User Story 2 - Scan and choose quickly (Priority: P2)

On both phone and large screens, the reader can compare titles and short descriptions (when present), see lightweight metadata (such as reading length), and activate a clear path to the full archive.

**Why this priority**: Poor layout or missing cues increase bounce; the module should match the rest of the site’s reading quality.

**Independent Test**: Resize the viewport from narrow to wide; each list entry remains readable, tappable targets remain comfortable, and focus order follows the visual order.

**Acceptance Scenarios**:

1. **Given** the related block is visible, **When** the reader uses keyboard navigation, **Then** each suggestion and the “browse all” path receive visible focus and activate with standard activation keys.
2. **Given** long titles or descriptions, **When** the list is shown, **Then** text is truncated or wrapped in a controlled way so the list stays scannable without breaking layout.
3. **Given** the related block is visible, **When** the reader wants more than the short list, **Then** they can follow a single obvious link to the full catalog of writings.

---

### User Story 3 - Trust and tune relatedness (Priority: P3)

Editors and maintainers understand what “related” means for this site, and the approach can be adjusted without confusing readers.

**Why this priority**: The request explicitly questions whether today’s approach is best; the outcome should include an audited, documented rationale and room for improvement.

**Independent Test**: Review internal documentation (or release notes for maintainers) that states ranking inputs, tie-breakers, and known limitations; confirm behavior matches that description on a sample of posts.

**Acceptance Scenarios**:

1. **Given** two candidates with different degrees of topic overlap, **When** both qualify, **Then** stronger overlap ranks above weaker overlap unless tie-break rules say otherwise.
2. **Given** equal relevance scores, **When** the list is built, **Then** tie-break behavior is deterministic (e.g., newer publication first) and documented.

---

### Edge Cases

- Post has no tags and no shared collection metadata: module may show no suggestions; no error state is shown to readers.
- Only one other published post exists: module shows that single item (if it qualifies), still within the maximum count cap.
- Very large tag overlap with many posts: only the top N by the defined ranking appear; N is fixed for the product.
- Multilingual catalog: only candidates in the **same language as the current article** are eligible; strong matches in other languages are excluded. If no same-language candidates qualify, the block is omitted (same as other empty cases).
- User has enabled reduced motion: motion or hover effects do not rely on animation for essential understanding.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST show a “related writings” block at the end of an article when at least one eligible candidate exists.
- **FR-002**: The system MUST exclude the article being read from the suggestion list.
- **FR-003**: The system MUST exclude writings marked as drafts or not intended for public listing from suggestions.
- **FR-004**: The system MUST restrict candidates to writings in the **same language** as the current article (per editorial language metadata); cross-language writings MUST NOT appear in the suggestion list.
- **FR-005**: The system MUST cap the number of suggestions at a fixed maximum (default: four) configurable without reader-facing ambiguity.
- **FR-006**: The system MUST rank candidates using shared topical signals (e.g., overlapping tags) and collection alignment (e.g., shared categories), with documented tie-breaking (e.g., publication recency).
- **FR-007**: Each suggestion MUST link to the correct writing and expose a clear title; optional short description and reading-length hint MUST appear when available in content metadata.
- **FR-008**: The system MUST provide a secondary action to browse the full set of writings from the related block when the block is shown.
- **FR-009**: The related block MUST meet the same accessibility expectations as other primary navigation links on the site (visible focus, meaningful labels, semantic structure for the list).
- **FR-010**: The system MUST respect the user’s reduced-motion preference for non-essential transitions in the block.
- **FR-011**: Maintainers MUST be able to verify relatedness behavior against a short written description of inputs, weights, tie-breakers, and **same-language filtering** (delivered as part of this feature’s completion artifacts, not necessarily shown to readers).

### Key Entities _(include if feature involves data)_

- **Article (current)**: The writing being read; used to exclude self and to compute similarity to others.
- **Article (candidate)**: Another published writing in the **same language** as the current article; contributes tags and collection metadata for scoring.
- **Suggestion list**: Ordered subset of candidates, size ≤ maximum, presented in the UI.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: On a sample set of at least ten diverse published articles (including multiple languages when the catalog includes them), 100% of rendered suggestion links resolve to a different published article in the **same language** as the page being viewed (no self-links, no dead links, no cross-language suggestions in the sample).
- **SC-002**: In moderated review, at least 80% of suggestions on the sample set are judged “reasonably related” by the maintainer using the documented ranking rules (overlap of tags/categories or stated tie-break).
- **SC-003**: On a phone-sized viewport and a desktop viewport, each suggestion’s title is fully visible or intentionally ellipsized without horizontal page scroll caused by the related block alone.
- **SC-004**: Keyboard-only traversal can reach every suggestion and the browse-all control in order without traps, matching documented focus order for the block.

## Assumptions

- Suggestions are derived from public metadata already present on each writing when the site is published; there is no signed-in personalization or server-side learning loop in scope.
- Per-browser reading history does not change suggestion order in this release.
- Visual treatment should stay consistent with the site’s existing typography, color tokens, and spacing rhythm unless this spec’s implementation plan explicitly proposes a coordinated redesign.
- Featured or editorial emphasis may continue to influence ranking slightly if it already does, as long as topical overlap remains the primary signal.
- Language matching for suggestions is **same-language only**; translation pairs do not bypass this rule for the related block.

## Out of Scope

- Machine-learning models or third-party recommendation APIs.
- A/B testing infrastructure or analytics-heavy engagement experiments tied to the block.
- Automatic backfill of tags or categories for old posts (editorial workflow remains separate).
- Cross-language recommendations in the related block (e.g., surfacing the translated counterpart or a highly related essay in another language instead of same-language matches only).
