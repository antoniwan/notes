# Contract: Mobile Navigation Behavior

## Purpose

Define externally verifiable behavior for the mobile navigation experience so implementation and QA can validate the same rules.

## Trigger and Visibility Contract

1. A mobile-visible hamburger trigger MUST open the mobile menu.
2. Trigger MUST expose `aria-expanded` and `aria-controls` consistent with menu state.
3. Menu MUST present as modal-like navigation context and prevent background interaction while open.

## Destination Contract

1. Mobile menu v1 MUST include: `Home`, `Posts`, `Brain Science`, `About`, `Search`.
2. Active page MUST be visually indicated in the destination list.
3. Brain Science MUST remain available but MUST NOT be prioritized above Guided Path.
4. Labels MUST be clear and map to canonical destination meaning (no ambiguous aliases).

## Dismissal Contract

At least the following dismissal paths MUST work:

- Close button activation
- Overlay/outside-intent tap
- Escape key
- First system/browser Back action closes menu without navigating away

Selecting a destination MUST close the menu and continue to the selected destination.

## Accessibility Contract

1. On menu open, focus MUST move into the menu.
2. Keyboard traversal MUST remain predictable while menu is open (no focus escape to background content).
3. On menu close, focus MUST return to the opening trigger.
4. Controls MUST expose understandable labels and state announcements to assistive technologies.

## Edge Behavior Contract

1. Menu content overflow MUST remain usable on small viewports.
2. Rapid repeated open/close interactions MUST leave menu state coherent.
3. Device rotation while menu is open MUST preserve ability to close and navigate.
