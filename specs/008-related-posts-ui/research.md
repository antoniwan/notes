# Research: Related Posts Section Enhancement

## Decision 1: Same-language eligibility

- **Decision**: A candidate post is eligible only if `candidate.data.language` and `currentPost.data.language` share at least one code (`en` or `es`). The schema defaults `language` to `['en']` when omitted in frontmatter, so runtime values are always normalized arrays.
- **Rationale**: Matches **FR-004** and clarification session (no cross-language rows). Intersection handles the rare multi-code case without preferring one code arbitrarily.
- **Alternatives considered**:
  - Primary language only (first array element) — rejected: unnecessary given small enum and intersection semantics.
  - Use `translationGroup` to allow cross-language — rejected: explicitly out of spec / Out of Scope.

## Decision 2: Published vs draft gating

- **Decision**: Exclude candidates with `draft: true` (existing) **and** candidates with `published: false` when evaluating related posts for the public post page.
- **Rationale**: Aligns suggestion list with other public surfaces; avoids linking to intentionally unpublished content if it remains in the collection for tooling.
- **Alternatives considered**:
  - Draft filter only — rejected: `published` exists in schema and can diverge from draft.

## Decision 3: Reading time in the list

- **Decision**: Display `post.data.minutesRead` when present; otherwise fall back to `calculateReadingTimeFromMarkdown(post.body)` (same precedence as `src/pages/p/[...slug].astro`).
- **Rationale**: Constitution **I** requires remark pipeline reading time as the source of truth; avoids divergent numbers between hero metadata and related list.
- **Alternatives considered**:
  - Always compute from body in `RelatedPosts` — rejected: duplicates work and can drift from pipeline output.

## Decision 4: Scoring algorithm baseline

- **Decision**: Keep the existing weighted model (tag overlap + tag weights, category overlap, recency bonus, featured bonus, score then date tie-break) unless audit finds a bug; document numeric weights in the behavior contract for **FR-011**.
- **Rationale**: Spec asks for audit, not a mandatory replacement; stable behavior reduces regression risk.
- **Alternatives considered**:
  - Replace with cosine similarity / embeddings — rejected: out of scope (no ML).
  - Flatten to tag count only — rejected: loses editorial tag weights already in `src/data/tags`.

## Decision 5: UI implementation style

- **Decision**: Rework `RelatedPosts` presentation using Tailwind utility classes aligned with `BlogLayout` / site tokens; retain semantic HTML (`section`, `h2`, ordered list, links) and focus styles meeting **FR-009** / **SC-004**.
- **Rationale**: Matches recent sidebar work and reduces one-off scoped CSS where practical.
- **Alternatives considered**:
  - Leave large `<style>` block — acceptable short-term but weaker consistency with surrounding post chrome.
