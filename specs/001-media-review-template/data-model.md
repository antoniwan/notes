# Data model — Media review template

## Blog collection extensions (`src/content.config.ts`)

All existing required blog fields remain required (`title`, `description`, `pubDate`, `language`, etc.).

### Template discriminator

| Field | Type | Required when | Description |
|-------|------|----------------|-------------|
| `template` | `'media-review'` (literal) | Never | If set to `media-review`, post uses media review layout and **must** satisfy media fields below. If omitted, default editorial layout. |

### Media review fields (required when `template: media-review`)

| Field | Type | Description |
|-------|------|-------------|
| `mediaType` | `'film' \| 'tv'` | Drives “Film” vs “TV” labeling (FR-005). |
| `workTitle` | `string` | Title of the work as reviewed (may match `title` or be more specific, e.g. “Send Help”). |
| `releaseYear` | `number` | Release or primary year (e.g. 2026). |

### Media review fields (optional)

| Field | Type | Description |
|-------|------|-------------|
| `seasonLabel` | `string` | For TV only, e.g. “Season 1” (optional). |
| `trailerUrl` | `string` (URL) | Official trailer; YouTube preferred for embed (FR-004). |
| `heroImage` | `string` | **Poster** path under `public/` or site asset pipeline (FR-003); reused for OG/social. |
| `imageAlt` | `string` | Poster alt text (accessibility). |

### Validation rules

- When `template === 'media-review'`: require `mediaType`, `workTitle`, `releaseYear`; recommend `heroImage` for FR-003 (if missing, layout shows title-only fallback per spec edge cases).
- `trailerUrl` optional; validate URL shape when present.
- `category` should include the new `media-reviews` (or agreed id) once added to `categories.ts`.

## Site-level Letterboxd config (not in post frontmatter)

| Setting | Source | Description |
|---------|--------|-------------|
| Profile URL | `src/config/letterboxd.ts` / env | Plain link target for FR-009. |
| RSS URL | env optional | Public feed URL for FR-010 build-time fetch. |

Posts do **not** store Letterboxd URLs per spec.

## Entities (spec mapping)

- **Media review (content item)** → `blog` entry with `template: 'media-review'`.
- **Poster asset** → `heroImage` (+ `imageAlt`).
- **Trailer reference** → `trailerUrl`.
- **Letterboxd public activity feed** → fetched at build from site-level RSS URL; rendered only on media review pages.
