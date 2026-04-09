# Data Model: Post Sidebar Usability Redesign

This feature introduces no server-persisted data entities. The model below defines UI-domain entities and validation rules required for consistent implementation and QA.

## Entity: Sidebar Section

- **Description**: A grouped block in sidebar/mobile metadata flow with a defined priority and purpose.
- **Fields**:
  - `section_id` (string, required): Canonical identifier (context, reading-signals, taxonomy, actions, secondary-metadata).
  - `display_order` (integer, required): Render priority in the information hierarchy.
  - `heading_label` (string, required): Reader-visible section heading.
  - `visibility_by_viewport` (enum map, required): Desktop and mobile visibility behavior.
- **Validation rules**:
  - Each section must have a unique `display_order`.
  - Desktop and mobile flows must preserve equivalent section semantics.

## Entity: Taxonomy Display Set

- **Description**: The category/tag representation for a post in sidebar surfaces.
- **Fields**:
  - `categories` (list of strings, required): Ordered category IDs from post metadata.
  - `tags` (list of strings, optional): Tag labels/IDs from post metadata.
  - `primary_category` (string, required when categories exist): First category in `categories`.
  - `collapsed_category_count` (integer, required): Number of categories shown before expansion (fixed at 3).
  - `show_all_enabled` (boolean, required): True when categories length > collapsed count.
- **Validation rules**:
  - All categories must remain linkable and discoverable.
  - If `categories.length > 3`, a `Show all` control must be present.
  - `primary_category` must equal `categories[0]` when categories exist.

## Entity: Reading Signal

- **Description**: Reader-facing status summary for reading duration or previously-read state.
- **Fields**:
  - `status_type` (enum, required): `unread` or `read`.
  - `display_value` (string, required): Reading-time estimate or relative read-time text.
  - `status_icon` (string, required): Visual indicator associated with status.
- **Validation rules**:
  - Read/unread transitions must preserve current behavior.
  - Signal must remain visible in both desktop and mobile metadata presentations.

## Entity: Mobile Section State

- **Description**: Default disclosure and interaction state for mobile metadata sections.
- **Fields**:
  - `default_state` (enum, required): `collapsed` (required by spec).
  - `header_label` (string, required): Tap-target heading text.
  - `expand_interaction` (enum, required): `tap-to-expand`.
- **Validation rules**:
  - Metadata sections are collapsed by default on mobile.
  - Section headers must remain visible and tappable.

## Relationships

- `Sidebar Section` defines ordering for `Taxonomy Display Set`, `Reading Signal`, and action/metadata groups.
- `Taxonomy Display Set.primary_category` feeds constrained surfaces such as breadcrumbs.
- `Mobile Section State` applies to mobile renderings of sidebar-equivalent sections.

## State Transitions

- `Current Sidebar` -> `Reordered Section Hierarchy` -> `Overflow + Mobile Disclosure Applied` -> `Validated`
- Transition rule: feature is only `Validated` when section order, taxonomy behavior, and mobile disclosure rules all pass QA.
