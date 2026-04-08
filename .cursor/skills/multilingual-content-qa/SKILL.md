---
name: multilingual-content-qa
description: Audits and fixes English/Spanish translation linking for posts in this Notes repo using translationGroup, featured flags, and publish state rules. Use when the user adds translated posts, asks about language toggles, or reports missing translation links.
---

# Multilingual Content QA

## Goal

Keep EN/ES pairs correctly linked and visible in the intended places.

## Source Of Truth

- `docs/multilingual-setup.md`
- `docs/frontmatter-spec.md`

## Use This Skill When

- Creating a translation pair.
- Translation toggle does not appear.
- A secondary language version appears in main listings unexpectedly.

## Workflow

1. Locate related post files in `src/content/p/`.
2. Verify both posts share the same `translationGroup`.
3. Validate language/visibility rules:
   - Translation linking depends on `translationGroup`, `language`, `published`, and `draft`.
   - Use `featured` only as an editorial listing control, not as a hard requirement for translation linking.
   - If the user asks for listing behavior changes, then verify `featured` intent across the pair.
4. Ensure language arrays are correct (`["en"]` and `["es"]`).
5. Run:
   - `pnpm run check`
   - `pnpm run build`
6. If needed, inspect the built behavior and confirm translation links are present.

## Failure Triage

- Missing toggle: check `translationGroup`, `published`, `draft`, and `language`.
- Duplicate listing exposure: check `featured` values only when listing behavior is part of the request.
- Wrong routing/path: confirm file names and content slugs align.

## Output Format

Return:

1. `Pair status` (which files are linked)
2. `Rule violations found`
3. `Edits made`
4. `Verification result`
