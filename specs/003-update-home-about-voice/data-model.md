# Data Model: Homepage and About Voice Refresh

This feature is content-structure focused and does not add persisted runtime entities. The model below defines editorial entities and constraints used for implementation and validation.

## Entity: Homepage Narrative Block

- **Description**: Primary narrative copy and supporting sections on `src/pages/index.astro` that communicate the current season message.
- **Fields**:
  - `headline_message` (string, required): Season-of-execution framing in first-person voice.
  - `supporting_context` (string[], required): Concrete lived details (fatherhood, patience, action, leadership).
  - `cta_links` (link[], required): Existing discovery links users can follow.
  - `non_masonry_layout_refinements` (string[], optional): Allowed visual/spacing/section-order refinements outside masonry.
- **Validation rules**:
  - Must not alter masonry behavior or remove masonry feature presence.
  - Must remain understandable to first-time readers without prior essay context.

## Entity: About Narrative Section Set

- **Description**: Primary narrative sections on `src/pages/about.astro` refreshed to align with homepage message.
- **Fields**:
  - `lead_statement` (string, required): Concise identity/season framing.
  - `story_paragraphs` (string[], required): Core narrative body in the same voice.
  - `theme_alignment_markers` (string[], required): Shared language with homepage (execution, presence, action, patience, leadership).
  - `structure_guardrail` (enum, required): `preserve-existing-structure`.
- **Validation rules**:
  - All primary narrative sections are updated.
  - Existing page skeleton remains mostly intact.

## Entity: Voice Reference Set

- **Description**: Recent content pieces used as qualitative baseline for tone consistency.
- **Fields**:
  - `reference_posts` (postRef[], required): Selected recent posts from content collection.
  - `voice_characteristics` (string[], required): Traits like first-person honesty, lived specificity, non-guru tone.
- **Validation rules**:
  - Updated homepage/About copy should remain recognizably authored in the same voice.

## Relationships

- `Homepage Narrative Block` and `About Narrative Section Set` both align against `Voice Reference Set`.
- `Homepage Narrative Block` sets message direction; `About Narrative Section Set` deepens and contextualizes that direction.

## State Transitions

- `Draft` -> `Rewritten` -> `Editorially Reviewed` -> `Ready for Merge`
- Transition rule: both homepage and About must reach `Editorially Reviewed` before `Ready for Merge`.
