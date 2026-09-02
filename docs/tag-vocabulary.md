# Tag Vocabulary Policy

This document defines the official preferred tag vocabulary for Notes.
For the reader-first rules, see `docs/tag-policy.md`.

## Objectives

- Give readers a stable idea map: browse, navigate, and follow connections.
- Keep tags consistent and reusable across posts and domains.
- Normalize aliases (including EN/ES variants) into canonical English slugs.
- Never use tags that only mean “this is a note.” The site is already called Notes.

## Canonical rules

- Canonical tags use lowercase kebab-case (example: `personal-growth`).
- Canonical language is English for all preferred tags.
- Aliases are allowed in content, but are normalized to canonical tags in processing.
- Alias keys in `TAG_ALIAS_MAP` must already be normalized kebab-case.
- New tags should be added only if a reader would reuse them to find an idea. Promote a long-tail slug into preferred vocab when it already has 3+ distinct writings and a stranger would browse it.
- `STRIPPED_TAGS` (`notes`, `note`, `nota`, `notas`) are dropped in canonicalize. They must not appear in preferred lists or alias targets.
- Remaining content-form slugs (`CONTENT_FORM_TAGS`) never alias into thematic tags. Use them only as reader destinations (`poems`, `memoir`), not as CMS labels.

## Preferred vocabulary model

The vocabulary is split into:

1. **Core tags**: cross-domain idea tags used broadly across the site.
2. **Domain extensions**: focused idea tags for psychology, technology, society, lifestyle, and expression.
3. **Content-form tags**: only live reader shelves (`poems`, `memoir`, `reflection`). Empty form labels are not preferred.

The source of truth for preferred tags, aliases, and stripped slugs is:

- `src/data/tagVocabulary.ts`

Display names, weights, and Maslow membership are derived in `src/data/tags.ts` from the preferred list. Those analytics lists follow the idea vocabulary. They do not get extra tags on posts.

## Usage guidance

- Prefer 5–12 high-signal **idea** tags per post.
- Prioritize one or two domain tags plus thematic tags a reader would click.
- Add a form tag only when the piece is a distinct shelf (a poem, not “Notes on Respect”).
- Avoid ultra-specific one-off labels unless they recur in multiple posts.
- If an existing alias already maps to a canonical tag, use the canonical one directly in new posts.

## Update workflow

When introducing or changing tags:

1. Update `src/data/tagVocabulary.ts` (`CORE_PREFERRED_TAGS`, `DOMAIN_EXTENSION_TAGS`, `CONTENT_FORM_TAGS`, `TAG_ALIAS_MAP`, `STRIPPED_TAGS`).
2. Confirm `/tag` still reads as an idea map, not an author inventory.
3. Validate tag pages and `/tag` build output.
4. Update this document if the policy or model changes.
