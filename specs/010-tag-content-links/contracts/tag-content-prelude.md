# Contract: Tag Content Prelude

## Purpose

Define the deterministic behavior for generating and rendering the sentence-style content-form links shown before the tag cloud on `/tag`.

## Input Contract

- **Source**: Published blog posts and their tag arrays.
- **Required input shape**:
  - `posts[]`
    - `tags[]: string`
- **Supporting configuration**:
  - Canonical writing-form vocabulary:
    - `canonicalLabel: string` (plural display form)
    - `variants: string[]` (accepted normalized forms)

## Transformation Contract

1. Build raw tag counts from all published posts.
2. Normalize each tag label for matching.
3. Include only tags whose normalized labels match a canonical vocabulary variant.
4. Group included tags by `canonicalLabel`.
5. Sum grouped counts into `totalCount`.
6. Sort output by:
   1. `totalCount` descending
   2. `canonicalLabel` ascending (alphabetical tie-break)

## Output Contract

- **Prelude items**:
  - `label: string` (canonical plural label)
  - `href: string` (tag browsing URL)
  - `count: number` (ordering field)
- **Render rule**:
  - If output length is `0`, do not render prelude section.
  - If output length is `>= 1`, render sentence-style prelude before tag cloud.

## Grammar Contract

- Display text must be readable for 1, 2, or N items.
- Use canonical plural labels in all cases.
- Do not render dangling punctuation or conjunctions.

## Invariants

- No non-content-form tag appears in prelude output.
- No singular/plural variant pair appears as separate prelude items.
- Repeated builds with unchanged content produce identical prelude ordering.
