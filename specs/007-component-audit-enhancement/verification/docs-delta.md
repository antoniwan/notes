# User-visible documentation delta (007)

## Decision log

| Date       | Change                                                                                                                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-09 | Added feature workspace under `specs/007-component-audit-enhancement/`: inventory, batches, register, templates, component-docs, enhancement-decisions, verification artifacts, stakeholder summary. |

## User-facing site (`src/`)

**No changes** — blog readers and public pages see no difference from this feature.

## Maintainer-facing

- `scripts/generate-social-images.js` now runs **Prettier** when writing `src/data/socialImageManifest.ts` so `pnpm run format:check` stays green after each build.

New canonical references for component audit:

- `specs/007-component-audit-enhancement/README.md` — workspace index
- `component-docs/README.md` — documentation entry point
- `stakeholder-audit-summary.md` — single-page overview for review
