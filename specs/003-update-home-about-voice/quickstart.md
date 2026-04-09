# Quickstart: Implement Homepage and About Voice Refresh

## 1) Confirm branch and files

- Work on branch: `003-update-home-about-voice`
- Primary files:
  - `src/pages/index.astro`
  - `src/pages/about.astro`
- Guardrail file to avoid behavioral change:
  - `src/components/HighlightsMasonry.astro`

## 2) Implement homepage updates

- Refresh the main homepage messaging to the season-of-execution narrative.
- Keep `HighlightsMasonry` present and behaviorally unchanged.
- Apply only targeted layout/design refinements outside masonry as needed for clarity and emphasis.

## 3) Implement About updates

- Update all primary narrative sections to align with homepage direction and tone.
- Keep current page structure mostly intact (no broad section architecture rewrite).

## 4) Run validation commands

```bash
pnpm run format:check
pnpm run check
pnpm run build
```

## 5) Perform editorial acceptance checks

- Compare homepage and About side-by-side for voice consistency.
- Confirm narrative coherence and no theme conflicts.
- Confirm first-time reader clarity on homepage messaging.
