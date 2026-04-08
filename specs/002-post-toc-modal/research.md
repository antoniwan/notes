# Research: Floating Post Table of Contents

## Decision 1: Reuse existing heading extraction as the TOC source

- **Decision**: Use the existing heading extraction flow in `src/pages/p/[...slug].astro` as the canonical TOC input source, with heading depth constrained to meaningful content levels.
- **Rationale**: The route already derives table-of-contents data from post markdown body. Reusing this avoids duplicate parsing and keeps prerender output deterministic.
- **Alternatives considered**:
  - Re-parse rendered HTML in the layout at runtime (rejected: duplicate work and less predictable).
  - Manual per-post TOC frontmatter (rejected: high authoring overhead and higher drift risk).

## Decision 2: Mobile-first TOC behavior uses compact trigger + modal on demand

- **Decision**: On mobile, expose a compact `Contents` trigger; open modal only after explicit tap; auto-close modal after section selection.
- **Rationale**: This aligns with clarified requirements and minimizes reading obstruction while keeping navigation discoverable.
- **Alternatives considered**:
  - Persistent floating TOC panel on mobile (rejected: likely visual obstruction).
  - Auto-open modal for long posts (rejected: intrusive and not reader-initiated).

## Decision 3: Beauty-first legibility validation for this phase

- **Decision**: Treat visual polish as the primary acceptance lens and validate legibility through qualitative stakeholder review instead of hard numeric thresholds in this phase.
- **Rationale**: Clarification explicitly selected subjective design review for legibility to optimize aesthetic freedom during initial rollout.
- **Alternatives considered**:
  - Define strict text-size/contrast thresholds now (rejected: conflicts with current clarified preference).
  - Defer legibility review entirely (rejected: contradicts requirement for readability and polish).

## Decision 4: Keep interaction state client-local and ephemeral

- **Decision**: TOC open/closed behavior remains local to the current page session with no server-side persistence.
- **Rationale**: Satisfies constitution privacy principle and avoids introducing reader tracking concerns.
- **Alternatives considered**:
  - Persist TOC preference server-side (rejected: out of scope and privacy-sensitive).
  - Persist in long-term cross-page storage by default (rejected for now: unnecessary complexity for MVP).
