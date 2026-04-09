# Research: Post Sidebar Usability Redesign

## Decision 1: Primary category rule for constrained surfaces

- **Decision**: Use the first category in frontmatter order as the primary category for breadcrumb or other single-slot category surfaces.
- **Rationale**: This rule is deterministic, editorially controllable, and consistent with existing data ordering assumptions.
- **Alternatives considered**:
  - Site-wide category priority map (rejected: adds governance overhead and hidden logic).
  - Show no breadcrumb category when multiple exist (rejected: reduces orientation context).
  - Render all categories in breadcrumb (rejected: poor breadcrumb scanability).

## Decision 2: Social share placement in hierarchy

- **Decision**: Place social sharing in a lower-priority Actions block after taxonomy and metadata.
- **Rationale**: Legibility-first post reading requires contextual understanding before outbound actions; this reduces visual competition near title context.
- **Alternatives considered**:
  - Keep share near top/title (rejected: competes with primary context and taxonomy scanning).
  - Hide behind a compact-only trigger (rejected: adds extra interaction cost without strong need).

## Decision 3: Category overflow behavior

- **Decision**: Show first three categories by default and expose a “Show all” control for full category set.
- **Rationale**: Balances dense classification visibility with sidebar compactness and reading comfort.
- **Alternatives considered**:
  - Always show all categories (rejected: can overwhelm compact sidebar rhythm).
  - Hard-cap at three categories without expansion (rejected: hides valid taxonomy).

## Decision 4: Mobile metadata default state

- **Decision**: Keep metadata sections collapsed by default on mobile with clear headers and tap-to-expand behavior.
- **Rationale**: Preserves article reading flow while still exposing rich metadata on demand.
- **Alternatives considered**:
  - Expand all metadata by default (rejected: creates long, noisy blocks before/after core reading flow).
  - Move taxonomy to separate modal/sheet (rejected: unnecessary interaction complexity for this feature).

## Decision 5: Implementation scope boundary

- **Decision**: Implement redesign within existing post layout and metadata surfaces, preserving existing read-state, sharing, and taxonomy navigation capabilities.
- **Rationale**: Keeps risk low and aligns with enhancement intent rather than IA replatforming.
- **Alternatives considered**:
  - Build a new sidebar system from scratch (rejected: higher regression risk and larger migration effort).
