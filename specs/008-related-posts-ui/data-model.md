# Data Model: Related Posts Section Enhancement

## Entities

### Current article (context)

| Field / concept | Source                            | Use in feature                              |
| --------------- | --------------------------------- | ------------------------------------------- |
| Identity        | `CollectionEntry<'blog'>.id`      | Exclude self from candidates                |
| Language        | `data.language: ('en' \| 'es')[]` | Filter candidates (intersection non-empty)  |
| Tags            | `data.tags?: string[]`            | Scoring: overlap + per-tag weights          |
| Categories      | `data.category?: string[]`        | Scoring: overlap                            |
| Draft           | `data.draft`                      | Current page assumed non-draft public route |
| Published       | `data.published`                  | Current page assumed public                 |

### Candidate article

| Field / concept | Rule                                                                      |
| --------------- | ------------------------------------------------------------------------- |
| Not self        | `candidate.id !== current.id`                                             |
| Public          | `candidate.data.draft !== true` AND `candidate.data.published !== false`  |
| Same language   | `intersection(candidate.data.language, current.data.language).length > 0` |
| Scoring inputs  | Shared tags, shared categories, candidate `pubDate`, candidate `featured` |

### Suggestion list (output)

- Ordered array of candidates, length ≤ `maxCount` (default **4**, per **FR-005**).
- Deterministic ordering: sort by score descending, then by `pubDate` descending for ties.

## Validation / invariants

- `language` is always a non-empty array after Zod parse (`default(['en'])`).
- Related block **omitted** when zero eligible candidates after filters ( **FR-001** / edge cases).

## Relationships

- **Many candidates → zero or one suggestion list** per current article render.
- No persistence; derived only from in-memory collection entries at build/prerender time.
