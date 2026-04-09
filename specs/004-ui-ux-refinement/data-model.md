# Data Model: Professional UI/UX Refinement Pass

This feature does not add runtime-persisted entities. The model below defines design-domain entities and validation constraints used for implementation and QA.

## Entity: Public Template

- **Description**: A public-facing page template or route type rendered by the site.
- **Fields**:
  - `template_name` (string, required): Canonical template identifier.
  - `representative_page` (string, required): One concrete page URL/path used in QA.
  - `included_in_refinement` (boolean, required): Must be `true` for all public templates.
- **Validation rules**:
  - Every public template must have exactly one representative page for QA.
  - No public template is excluded from refinement scope.

## Entity: Visual Token Group

- **Description**: Shared design-system values that control visual consistency.
- **Fields**:
  - `typography_roles` (map, required): Title/heading/body/meta role definitions.
  - `spacing_scale` (list, required): Standardized spacing increments for layout rhythm.
  - `alignment_rules` (list, required): Shared horizontal/vertical alignment expectations.
- **Validation rules**:
  - Tokens must apply consistently across templates in the same semantic role.
  - Adjustments must not require content or interaction changes.

## Entity: Breakpoint QA Matrix

- **Description**: Coverage matrix for visual validation by template and breakpoint class.
- **Fields**:
  - `breakpoint_classes` (enum list, required): `mobile`, `tablet`, `desktop`.
  - `qa_checks` (list, required): Hierarchy clarity, spacing consistency, alignment consistency, legibility, WCAG 2.2 AA contrast.
  - `result_status` (enum, required): `pass` or `fail`.
- **Validation rules**:
  - Each public template must be checked at all three breakpoint classes.
  - A template is complete only when all required checks pass.

## Relationships

- `Public Template` maps to one `Breakpoint QA Matrix` row set.
- `Visual Token Group` is applied across all `Public Template` entries.
- QA outcomes validate that token updates remain coherent across template contexts.

## State Transitions

- `Baseline Captured` -> `Refinement Applied` -> `QA Validated` -> `Ready for Tasks`
- Transition rule: all public templates must reach `QA Validated` before `Ready for Tasks`.
