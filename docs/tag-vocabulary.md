# Tag Vocabulary Policy

This document defines the official preferred tag vocabulary for Notes.
For governance and day-to-day usage rules, see `docs/tag-policy.md`.

## Objectives

- Keep tags consistent and reusable across posts and domains.
- Reduce one-off tag sprawl while preserving discoverability.
- Normalize aliases (including EN/ES variants) into canonical English slugs.
- Create a stable foundation for future tag tooling and migration.

## Canonical Rules

- Canonical tags use lowercase kebab-case (example: `personal-growth`).
- Canonical language is English for all preferred tags.
- Aliases are allowed in content, but are normalized to canonical tags in processing.
- New tags should be added only if they are reusable and semantically clear.

## Preferred Vocabulary Model

The vocabulary is split into:

1. **Core tags**: cross-domain tags used broadly across the site.
2. **Domain extensions**: focused tags for psychology, technology, society, lifestyle, and expression.

The source of truth for preferred tags and aliases is:

- `src/data/tagVocabulary.ts`

## Usage Guidance

- Prefer 4-8 high-signal tags per post.
- Prioritize one or two domain tags plus broad thematic tags.
- Avoid ultra-specific one-off labels unless they recur in multiple posts.
- If an existing alias already maps to a canonical tag, use the canonical one directly in new posts.

## Migration Strategy (Current)

Rollout is intentionally incremental:

1. Normalize top-used tags and high-impact aliases first.
2. Expand to low-frequency long-tail tags in batches.
3. Keep alias mapping backward-compatible so existing URLs and filtering remain stable during migration.

## Update Workflow

When introducing or changing tags:

1. Update `src/data/tagVocabulary.ts` (`PREFERRED_TAGS` and `TAG_ALIAS_MAP`).
2. Confirm tag analytics output on `/tag-management`.
3. Validate tag pages and `/tag` build output.
4. Update this document if the policy or model changes.
