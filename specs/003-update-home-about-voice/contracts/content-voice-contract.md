# Contract: Content and Voice Alignment

## Purpose

Define the acceptance contract for homepage and About updates so implementation and review stay aligned with the specification.

## Contract Scope

- Homepage content and permitted non-masonry refinements in `src/pages/index.astro`
- About page primary narrative sections in `src/pages/about.astro`

## Required Conditions

1. **Homepage Narrative Condition**
   - Homepage includes explicit season-of-execution message in first-person voice.
   - Copy contains concrete life context (fatherhood, patience, action, leadership practice).

2. **Masonry Preservation Condition**
   - Masonry remains present and behaviorally unchanged.
   - No contract-breaking edits to masonry interaction/pattern.

3. **About Narrative Condition**
   - All primary narrative sections are refreshed for message alignment.
   - Existing About page structural skeleton remains mostly intact.

4. **Cross-Page Consistency Condition**
   - Homepage and About use coherent thematic language and tone.
   - No major narrative contradiction between pages.

5. **Reader Clarity Condition**
   - First-time readers can understand current author focus from homepage alone.

## Verification Evidence

- Side-by-side editorial review of homepage and About copy
- Manual check that `HighlightsMasonry` integration remains unchanged on homepage
- Quality gate commands pass:
  - `pnpm run check`
  - `pnpm run build`
  - `pnpm run format:check`
