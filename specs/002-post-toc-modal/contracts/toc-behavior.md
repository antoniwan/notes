# Contract: Post TOC Interaction Behavior

## Scope

Defines expected user-visible behavior for the floating post table of contents across mobile and desktop post pages.

## Inputs

- Post page with computed TOC item list (ordered headings).
- Current viewport mode (`mobile` or `desktop`).
- User actions: open trigger, close modal, select section item.

## Behavior Contract

1. If TOC list is empty or insufficient for navigation, the TOC UI is not shown.
2. TOC items appear in the same order as post headings.
3. Selecting a TOC item navigates to its matching in-page section.
4. TOC can always be dismissed by the reader.
5. On mobile:
   - A compact `Contents` trigger is shown.
   - Modal opens only after explicit trigger action.
   - Modal closes automatically after section selection.
6. On desktop:
   - TOC remains discoverable in a non-obstructive floating presentation.
   - Closing the TOC is always available if shown as an overlay.

## Error/Edge Behavior

- Missing target heading slug: selection is ignored safely and reader remains in current position.
- Duplicate-like heading text: each TOC item must still map to a unique destination.
- Very long labels: TOC layout preserves readability without clipping core meaning.

## Acceptance Alignment

This contract maps directly to spec requirements `FR-001` through `FR-010` and measurable outcomes `SC-001` through `SC-005`.
