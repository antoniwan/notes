# Data Model: Professional Mobile Navigation Refresh

## Entity: MobileMenuState

- **Purpose**: Represents runtime visibility and interaction state for the mobile navigation menu.
- **Fields**:
  - `isOpen` (boolean): Whether the menu is currently visible.
  - `dismissReason` (enum): `close-button | overlay-tap | escape-key | back-action | link-selection`.
  - `openedFromTriggerId` (string): Trigger control ID used for focus return.
  - `lastActionAt` (number): Timestamp used for debouncing rapid open/close interactions.
- **Validation Rules**:
  - `isOpen = false` after any valid dismiss action.
  - `openedFromTriggerId` must be present before opening to guarantee focus return.
  - `dismissReason` must be recorded on close for deterministic behavior handling.

## Entity: MobileNavDestination

- **Purpose**: Represents a top-level destination rendered in mobile navigation.
- **Fields**:
  - `label` (string): User-visible destination name.
  - `href` (string): Canonical destination URL.
  - `isPrimary` (boolean): Indicates primary-level inclusion for v1 destination set.
  - `priorityGroup` (enum): `core | contextual`.
  - `isActive` (boolean): Active-page indicator for current route.
- **Validation Rules**:
  - v1 set MUST include `Home`, `Posts`, `Brain Science`, `About`, `Search`.
  - `Brain Science` cannot be assigned a higher `priorityGroup` than `Guided Path` in mobile hierarchy rendering.
  - Exactly one destination MAY be active for a given route context.

## Entity: AccessibilityState

- **Purpose**: Captures keyboard and assistive interaction obligations for menu lifecycle.
- **Fields**:
  - `focusEntryTarget` (string): First focusable element when menu opens.
  - `focusReturnTarget` (string): Element that receives focus when menu closes.
  - `isFocusTrapped` (boolean): Whether focus remains constrained to menu while open.
  - `escapeEnabled` (boolean): Whether Escape key can close menu.
- **Validation Rules**:
  - `focusReturnTarget` must equal the menu trigger used to open menu.
  - `escapeEnabled` must remain true in open state.
  - Focus trap behavior must prevent traversal to background content while open.

## State Transitions

1. **Closed -> Open**
   - Triggered by hamburger control activation.
   - Sets `isOpen = true`, updates trigger ARIA state, and moves focus into menu.
2. **Open -> Closed (Soft Dismiss)**
   - Triggered by overlay tap, Escape key, or close button.
   - Sets `isOpen = false`, records dismiss reason, returns focus to trigger.
3. **Open -> Closed (Back Dismiss)**
   - Triggered by first system/browser Back while menu is open.
   - Closes menu without route transition.
4. **Open -> Closed (Navigate)**
   - Triggered by selecting destination.
   - Closes menu and proceeds to selected route.
