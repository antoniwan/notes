# Research: Tag Content Links Prelude

## Decision 1: Infer content-form tags dynamically from existing tag data

- **Decision**: Build the prelude from tags present in content, then filter with a canonical writing-form vocabulary.
- **Rationale**: Matches clarified spec intent, keeps links grounded in real available content, and prevents stale hardcoded lists.
- **Alternatives considered**:
  - Fixed allowlist only: simpler but can drift from actual content and requires manual updates for every taxonomy change.
  - All tags eligible: introduces topical tags and violates the "content-form tags only" requirement.

## Decision 2: Rank by descending post count with alphabetical tie-break

- **Decision**: Sort candidate content-form tags by count descending; if tied, sort by normalized display label alphabetically.
- **Rationale**: Surfaces most useful destinations first while ensuring deterministic output for stable builds and tests.
- **Alternatives considered**:
  - Alphabetical only: predictable but less aligned with reader demand.
  - Most-recent post timestamp tie-break: sensitive to content churn and less transparent to readers.

## Decision 3: Normalize singular/plural variants to canonical plural labels

- **Decision**: Use a normalization map for writing-form variants (e.g., `poem` -> `poems`) and always render canonical plural labels.
- **Rationale**: Enforces tag consistency, avoids duplicate categories, and preserves natural sentence readability.
- **Alternatives considered**:
  - Preserve raw variant from source tags: can produce duplicate or inconsistent labels.
  - Choose variant with highest count: can vary unexpectedly and weaken taxonomy consistency.

## Decision 4: Keep implementation static-first on `/tag`

- **Decision**: Compute prelude data during page render/build using existing content collection retrieval.
- **Rationale**: Aligns with constitution static-first principle and avoids unnecessary runtime complexity.
- **Alternatives considered**:
  - API-driven prelude data: unnecessary for this scope and introduces avoidable architectural overhead.
  - Client-side post-processing after load: adds complexity and can reduce initial clarity/accessibility.

## Decision 5: Document a UI contract for sentence rendering behavior

- **Decision**: Add a contract document defining data shape, ordering, inclusion criteria, and grammar rules for prelude output.
- **Rationale**: Creates an explicit verification target for implementation and future refactors.
- **Alternatives considered**:
  - No contract document: faster short term but weaker guardrails for deterministic behavior and acceptance checks.
