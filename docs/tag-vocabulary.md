# Tag Vocabulary Policy

This document defines the official preferred tag vocabulary for Notes.
For governance and day-to-day usage rules, see `docs/tag-policy.md`.

## Objectives

- Keep tags consistent and reusable across posts and domains.
- Reduce one-off tag sprawl while preserving discoverability.
- Normalize aliases (including EN/ES variants) into canonical English slugs.
- Keep writing-form tags on their own axis so `/tag` prelude links stay honest.

## Canonical Rules

- Canonical tags use lowercase kebab-case (example: `personal-growth`).
- Canonical language is English for all preferred tags.
- Aliases are allowed in content, but are normalized to canonical tags in processing.
- Alias keys in `TAG_ALIAS_MAP` must already be normalized kebab-case.
- New tags should be added only if they are reusable and semantically clear.
- Content-form canonical slugs (`CONTENT_FORM_TAGS`) never alias into thematic tags.

## Preferred Vocabulary Model

The vocabulary is split into:

1. **Core tags**: cross-domain tags used broadly across the site.
2. **Domain extensions**: focused tags for psychology, technology, society, lifestyle, and expression.
3. **Content-form tags**: writing-kind slugs such as `poems`, `memoir`, `notes`, `essays`.

The source of truth for preferred tags and aliases is:

- `src/data/tagVocabulary.ts`

Display names, weights, and Maslow membership for analytics live in `src/data/tags.ts` and should follow the preferred list (preferred tags that alias away must not remain in the preferred arrays).

## Usage Guidance

- Prefer 5-12 high-signal tags per post.
- Prioritize one or two domain tags plus broad thematic tags.
- Add a content-form tag when the piece is distinctly a poem, memoir, letter, etc.
- Avoid ultra-specific one-off labels unless they recur in multiple posts.
- If an existing alias already maps to a canonical tag, use the canonical one directly in new posts.

## Update Workflow

When introducing or changing tags:

1. Update `src/data/tagVocabulary.ts` (`CORE_PREFERRED_TAGS`, `DOMAIN_EXTENSION_TAGS`, `CONTENT_FORM_TAGS`, and `TAG_ALIAS_MAP`).
2. Confirm tag analytics output on `/tag-management`.
3. Validate tag pages and `/tag` build output.
4. Update this document if the policy or model changes.
