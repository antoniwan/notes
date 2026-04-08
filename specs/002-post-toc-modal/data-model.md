# Data Model: Floating Post Table of Contents

## Entity: PostNavigationSection

- **Description**: A section in a post that can be navigated from the TOC.
- **Fields**:
  - `text` (string): reader-facing heading label.
  - `slug` (string): in-page target identifier.
  - `level` (enum-like number): heading depth used for visual hierarchy.
  - `order` (integer): appearance order in the post.
- **Validation rules**:
  - `text` must be non-empty after trimming.
  - `slug` must be URL-safe and stable for in-page linking.
  - `level` must be within supported heading depths for TOC display.

## Entity: TocItem

- **Description**: UI representation of a `PostNavigationSection` in the floating modal.
- **Fields**:
  - `label` (string): display text mapped from section heading.
  - `target` (string): in-page destination mapped to section slug.
  - `indentLevel` (integer): visual nesting indicator derived from heading level.
  - `isActive` (boolean): whether this section is currently the nearest reading position.
- **Relationships**:
  - One `TocItem` maps to exactly one `PostNavigationSection`.

## Entity: TocDisplayState

- **Description**: Current visibility and mode state for TOC presentation.
- **Fields**:
  - `isOpen` (boolean): whether modal is visible.
  - `triggerVisible` (boolean): whether compact trigger is visible.
  - `viewportMode` (enum): `mobile` or `desktop`.
- **Validation rules**:
  - In `mobile` mode, trigger remains visible when TOC is closed.
  - In `mobile` mode, selecting a TOC item transitions `isOpen` to false.

## State Transitions

1. `Closed` -> `Open` when reader activates TOC trigger.
2. `Open` -> `Closed` when reader dismisses modal.
3. `Open` -> `Closed` when reader selects a TOC item on mobile.
4. `Open` -> `Open` when reader selects a TOC item on desktop and modal remains available.
5. `Disabled` (implicit) when post lacks sufficient headings; trigger/modal are not shown.
