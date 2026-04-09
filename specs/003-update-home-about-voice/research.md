# Research: Homepage and About Voice Refresh

## Decision 1: Keep homepage masonry fixed; refine surrounding narrative scaffolding

- **Decision**: Preserve `HighlightsMasonry` behavior and structure, and focus homepage changes on message copy, framing sections, and non-masonry visual polish.
- **Rationale**: The spec and clarification explicitly lock masonry as a loved and recently shipped pattern; changing it introduces high regression risk and violates agreed scope.
- **Alternatives considered**:
  - Redesign masonry cards or grid behavior (rejected: conflicts with clarified constraint).
  - Homepage copy-only update with no design refinements (rejected: user explicitly allowed selective layout/design improvements).

## Decision 2: Use existing About page structure, refresh primary narrative sections only

- **Decision**: Keep current About page skeleton (hero, lead/story, topics, rail/disclaimer) and update primary narrative copy sections for voice and season alignment.
- **Rationale**: Matches clarification outcome (broad narrative refresh while preserving structure), minimizing UX disruption while achieving message coherence.
- **Alternatives considered**:
  - Full About page rewrite and new section architecture (rejected: unnecessary scope expansion).
  - Intro-only About changes (rejected: insufficient to satisfy "all primary narrative sections" clarification).

## Decision 3: Validate voice consistency through editorial acceptance criteria, not runtime logic

- **Decision**: Treat voice quality as editorial review criteria embedded in spec and plan; no runtime checks or algorithmic scoring.
- **Rationale**: Voice is qualitative and human-reviewed in this repo's content workflow; keeps implementation practical and aligned with existing process.
- **Alternatives considered**:
  - Automated style checks/NLP heuristics (rejected: high complexity, low reliability for personal voice).
  - No explicit validation path (rejected: weakens measurable acceptance and raises rework risk).

## Decision 4: No new architecture, storage, or privacy surface

- **Decision**: Keep changes within static Astro pages/components, with no new APIs, persistence, or analytics/tracking.
- **Rationale**: Fully aligned with constitution requirements for static-first and privacy-preserving operation.
- **Alternatives considered**:
  - Add dynamic personalization or interaction state for homepage narrative (rejected: out of scope and unnecessary).
