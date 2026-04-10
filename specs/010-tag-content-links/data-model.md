# Data Model: Tag Content Links Prelude

## Entity: Tag Catalog Entry

- **Description**: A raw tag aggregated from blog posts with its usage count.
- **Fields**:
  - `rawTag` (string): Original tag value from content.
  - `count` (number): Number of posts containing this tag.
- **Validation rules**:
  - `rawTag` must be non-empty after trimming.
  - `count` must be an integer >= 1.

## Entity: Canonical Writing-Form Vocabulary Entry

- **Description**: Defines recognized content-form categories and their normalized plural labels.
- **Fields**:
  - `canonicalLabel` (string): Display label used in the prelude (plural form).
  - `variants` (string[]): Accepted normalized variants mapping to this canonical label.
- **Validation rules**:
  - `canonicalLabel` must be plural and unique within vocabulary.
  - `variants` must be non-empty and map to exactly one canonical label.

## Entity: Content-Form Tag Candidate

- **Description**: A tag catalog entry that matches the canonical writing-form vocabulary.
- **Fields**:
  - `canonicalLabel` (string)
  - `totalCount` (number): Sum count for all variants normalized to this canonical label.
  - `tagPath` (string): Destination path for the canonical tag page.
- **Validation rules**:
  - Must exist in canonical vocabulary.
  - `totalCount` must aggregate all matching variants.
  - `tagPath` must resolve to existing tag browsing destination pattern.

## Entity: Prelude Link Item

- **Description**: Final render item in the sentence prelude.
- **Fields**:
  - `label` (string): Canonical plural label shown to readers.
  - `href` (string): Link destination for the canonical content-form tag.
  - `count` (number): Count used only for ordering.
  - `orderIndex` (number): Final sorted position.
- **Validation rules**:
  - `label` must equal canonical plural label.
  - `href` must be non-empty and navigable.
  - Ordered by `count` descending, then `label` ascending.

## Relationships

- One **Canonical Writing-Form Vocabulary Entry** maps many raw **Tag Catalog Entries** via variant matching.
- One **Content-Form Tag Candidate** becomes one **Prelude Link Item**.
- **Prelude Link Items** are a filtered subset of **Tag Catalog Entries** after normalization and grouping.

## State/Flow

1. Aggregate all tag catalog entries from published posts.
2. Normalize tags and match against canonical writing-form vocabulary.
3. Group matched variants by canonical label and sum counts.
4. Sort by descending count and alphabetical tie-break.
5. Render as sentence prelude links; if empty, render no prelude.
