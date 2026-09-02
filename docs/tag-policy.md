# Tag Policy (Reader-First)

The site is called Notes. Every writing here is already a note. Tags are **not** a second name for the site, a label for the author, a knob for SEO, or fuel for Writing Insights.

Tags exist so a **reader** can browse, navigate, map ideas, and follow how ideas connect.

If a tag does not help a stranger find more of that idea, it does not belong on the piece.

## Foundational test

Ask, in this order:

1. Would a reader click this to find related writings?
2. Does it name an idea, a world, or a distinct kind of piece they might seek (`poems`, `puerto-rico`, `fatherhood`)?
3. Or does it only describe _me_, _the CMS_, _the spec_, or _the chart_?

If (3) wins, drop the tag.

## Hard rules

- **Never** tag `notes` / `note` / `nota` / `notas`. The pipeline strips them. `/tag/notes` redirects to `/tag`.
- Do not add form labels (`essays`, `ideas`, `notes`) to satisfy `/tag` prelude code, specs, or analytics.
- Do not merge tags that mean different things to a reader (`parenting` vs `fatherhood`; English `limits` vs `boundaries`).
- Do merge true synonyms and language twins (`límites` → `boundaries`, `recuperacion` → `recovery`).

## What tags are for

- **Browsing** — `/tag/<idea>` should be a room of writings about that idea.
- **Navigation** — chips on a post are doors, not decorations.
- **Idea-mapping** — related tags should be ideas that actually share pages (co-occurrence), not a popularity contest.
- **Interconnectivity** — the graph is thematic. Form is optional and rare.

Writing Insights, Maslow buckets, and tag weights are **downstream**. They follow the preferred idea list. They do not get to demand extra tags on posts.

## Canonical format

- Canonical tags are lowercase kebab-case English slugs (`personal-growth`).
- Input may include variants (`auto-reflexión`, `ai-agent`); processing canonicalizes them.
- Alias map keys are stored in the same normalized kebab form the lookup uses.

## Two kinds of signal (reader destinations)

1. **Idea tags** (the default) — what the writing is about (`parenting`, `healing`, `puerto-rico`).
2. **Form tags** — only when a reader would browse that form as its own shelf. Live shelves: `poems`, `memoir`, `reflection`. Canonical form slugs live in `CONTENT_FORM_TAGS` and never alias into themes. `notes` is not a form tag. Empty labels (`essays`, `ideas`, `letters`, …) are not preferred.

## Three outcomes for any tag

1. **Keep as signal** — distinct meaning, reusable, helps a reader. Examples: `presence`, `trust`, `vulnerability`, `slow-living`.
2. **Merge** — same intent, no meaningful distinction. Example: `regulación-emocional` → `emotional-regulation`.
3. **Strip or alias-only** — site-name collisions (`notes`) are stripped. Historical spellings (`ai-agent` → `ai-agents`) route to canonical.

## Authoring guidelines

- Target **5–12 tags per post**, favoring ideas over volume.
- Include 1–2 domain/context tags and several thematic/meaning tags.
- Add a form tag only if the piece is a distinct reader destination (a poem, not “a note”).
- Do not stack cousin doors on one piece (`personal-growth` + `transformation` + `self-improvement`; `consciousness` + `self-reflection` + `mindfulness`). Pick the one a stranger would click.
- Avoid one-off tags unless you expect reuse.
- New recurring idea tags go in `src/data/tagVocabulary.ts`.
- On Spanish translations, Spanish labels are fine; aliases must map them to the same English canonical slugs as the English twin.

## Governance

- Source of truth:
  - Preferred idea tags: `CORE_PREFERRED_TAGS` + `DOMAIN_EXTENSION_TAGS`
  - Optional form destinations: `CONTENT_FORM_TAGS` (`poems`, `memoir`, `reflection` only)
  - Aliases: `TAG_ALIAS_MAP`
  - Stripped slugs: `STRIPPED_TAGS`
- Author analytics: `/tag-management` (noindex; not in public nav). Do not retag posts to improve that page.
- Before merging broad tag changes:
  1. Run `pnpm run check`
  2. Run `pnpm run build`
  3. Spot-check `/tag` and representative `/tag/<slug>` routes as a reader would

## Relationship to other docs

- Vocabulary inventory: `docs/tag-vocabulary.md`.
- Frontmatter: `docs/frontmatter-spec.md`.
- Agent rule: `.cursor/rules/tag-reader-first.mdc`.
- Continuity / blast radius (2026-09 checkpoint): [`docs/tag-system-cleanup-2026-09.md`](./tag-system-cleanup-2026-09.md).
