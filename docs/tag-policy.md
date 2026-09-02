# Tag Policy (Signal-First)

This policy defines how tags should be used in this repo so they stay expressive for readers and useful for navigation.

## Principles

- Keep tags as **reader signals**, not only analytics buckets.
- Prefer clarity over strict reduction: only merge tags when meaning is truly equivalent.
- Preserve voice/context tags when they improve discovery (for example `slow-living`, `connection`, `ritual`).
- Normalize formatting differences automatically (spacing, accents, singular/plural, EN/ES variants).
- Treat **writing form** and **theme** as different axes. Never alias `notes`, `poems`, `essays`, or other form tags into thematic slugs like `reflection`.

## Canonical Format

- Canonical tags are lowercase kebab-case (example: `personal-growth`).
- Canonical language for preferred vocabulary is English slugs.
- Input may still include variants (`auto-reflexión`, `ai-agent`, etc.); processing canonicalizes these.
- Alias map keys are stored in the same normalized kebab form the lookup uses (no spaces, no accents).

## Two Axes

1. **Thematic tags** — what the writing is about (`parenting`, `healing`, `puerto-rico`).
2. **Content-form tags** — what kind of writing it is (`poems`, `memoir`, `notes`, `essays`). Canonical form slugs live in `CONTENT_FORM_TAGS` and are protected from thematic aliasing.

## Three Outcomes For Any Tag

1. **Keep as signal**
   - Distinct meaning and reusable across posts.
   - Helps readers browse intentionally.
   - Examples: `presence`, `trust`, `vulnerability`, `connection`, `slow-living`.

2. **Merge**
   - Two tags represent the same semantic intent with no meaningful distinction.
   - Example: language/format variants such as `regulación-emocional` -> `emotional-regulation`.

3. **Alias-only**
   - Historical/legacy spelling retained for compatibility, but routed to canonical.
   - Example: `ai-agent` -> `ai-agents`.

## Authoring Guidelines

- Target **5-12 tags per post**, favoring quality over volume.
- Include:
  - 1-2 domain/context tags
  - 2-4 thematic/meaning tags
  - up to 2 content-form or expression/style tags when they add value
- Avoid adding one-off tags unless you expect reuse.
- If you invent a new recurring tag, add it to `src/data/tagVocabulary.ts`.
- On Spanish translations, you may write Spanish labels; aliases must map them to the same English canonical slugs as the English twin.

## Governance

- Source of truth:
  - Preferred tags: `CORE_PREFERRED_TAGS` + `DOMAIN_EXTENSION_TAGS` + `CONTENT_FORM_TAGS`
  - Aliases: `TAG_ALIAS_MAP` (thematic and form-internal only)
- Author analytics: `/tag-management` (noindex; not in public nav)
- Before merging broad tag changes:
  1. Run `pnpm run check`
  2. Run `pnpm run build`
  3. Spot-check `/tag` and representative `/tag/<slug>` routes

## Relationship To Other Docs

- Vocabulary inventory and migration notes live in `docs/tag-vocabulary.md`.
- Frontmatter structure rules live in `docs/frontmatter-spec.md`.
