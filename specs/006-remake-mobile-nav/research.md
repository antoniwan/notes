# Research: Professional Mobile Navigation Refresh

## Decision 1: Keep a full-screen modal-style mobile navigation shell

- **Decision**: Retain a full-screen mobile menu pattern with explicit open/close controls and overlay dismissal.
- **Rationale**: The current architecture already uses a full-screen menu and this best supports clear focus management, predictable close behavior, and visible hierarchy for larger navigation sets.
- **Alternatives considered**:
  - Partial-height bottom sheet: rejected because destination density and nested groups can become cramped.
  - Slide-out side drawer: rejected because current visual language is full-width and modal behavior is easier to keep consistent across device widths.

## Decision 2: Back button closes menu before leaving page

- **Decision**: First system/browser Back action closes the menu when open; subsequent Back follows history navigation.
- **Rationale**: Aligns with common mobile overlay expectations and prevents accidental page exits.
- **Alternatives considered**:
  - Back always navigates history: rejected due to higher accidental navigation risk.
  - Ignore Back behavior in scope: rejected because it leaves a key acceptance path ambiguous.

## Decision 3: Fix destination set for v1 and cap emphasis drift

- **Decision**: Include Home, Posts, Brain Science, About, and Search in v1 mobile navigation; Brain Science remains available with neutral treatment and is not prioritized above Guided Path.
- **Rationale**: A fixed set allows objective implementation/testing while honoring clarified content hierarchy priorities.
- **Alternatives considered**:
  - Mirror desktop nav exactly: rejected because desktop composition can drift and undermine explicit mobile acceptance testing.
  - Minimized 3-item nav: rejected for discoverability loss.

## Decision 4: Strengthen accessibility semantics and focus lifecycle

- **Decision**: Explicitly enforce trigger semantics (`aria-expanded`, `aria-controls`), menu dialog semantics, focus entry on open, escape close, and focus return to trigger on close.
- **Rationale**: Accessibility requirements are explicit in the feature spec and should be validated as first-class behavior.
- **Alternatives considered**:
  - Visual-only polish without focus lifecycle updates: rejected as non-compliant with FR-010/FR-011.

## Decision 5: Keep implementation client-light and static-first

- **Decision**: Use existing inline client script patterns in Astro components; avoid adding framework islands or server dependencies.
- **Rationale**: Satisfies constitution static-first principles and limits risk during a navigation-focused refactor.
- **Alternatives considered**:
  - Introduce new client framework state container: rejected as unnecessary complexity.
  - Move behavior to server-backed state: rejected due to privacy and architecture constraints.
