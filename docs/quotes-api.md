# Quotes API

`GET /api/quotes` returns one random quote as JSON. The pool includes:

- **Stoic** — classical excerpts (the original set).
- **Philosophical** — other thinkers and writers (short attributed lines).
- **Site** — pull quotes from essays on this site; responses include a URL to the post when applicable.

There is no authentication. The server sends **`Cache-Control: private, max-age=0, must-revalidate`** so `?kind=` is never mixed up with a shared cache entry for `/api/quotes`.

## Endpoint

### `GET /api/quotes`

Returns a random quote plus metadata (total count, version, counts per kind).

#### Optional query parameter

| Parameter | Values                           | Meaning                                                                                    |
| --------- | -------------------------------- | ------------------------------------------------------------------------------------------ |
| `kind`    | `stoic`, `philosophical`, `site` | Prefer quotes from that bucket only. Invalid values are ignored and the full pool is used. |

Examples:

- `/api/quotes`
- `/api/quotes?kind=site`
- `/api/quotes?kind=philosophical`

#### Response shape

```json
{
  "quote": {
    "id": 37,
    "kind": "philosophical",
    "sourceUrl": null,
    "postId": null,
    "text": "…",
    "author": "William James",
    "work": "The Principles of Psychology",
    "book": null,
    "themes": ["wisdom", "attention", "judgment"],
    "category": "philosophy_general",
    "difficulty": "beginner",
    "length": "short",
    "popularity": "high",
    "context": "…",
    "modernRelevance": "…"
  },
  "metadata": {
    "totalQuotes": 42,
    "version": "2.0",
    "lastUpdated": "2026-05-08",
    "description": "Random quote: classical Stoicism, other philosophy, or a line from a post on this site.",
    "countsByKind": {
      "stoic": 30,
      "philosophical": 6,
      "site": 6
    },
    "kindRequested": "philosophical",
    "selectionPoolSize": 6,
    "usedFallbackToFullPool": false
  }
}
```

| `metadata.kindRequested` | What you sent on `kind=`, or `null` when unfiltered |
| `metadata.selectionPoolSize` | How many quotes were eligible for this draw |
| `metadata.usedFallbackToFullPool` | `true` only if that bucket had zero quotes (then the API used the whole list). |

For **site** quotes, `kind` is `"site"`, `postId` is the blog entry id (Markdown filename without extension), and `sourceUrl` is an absolute path on this site, e.g. `/p/intelligence-burns/`. For other quotes, `sourceUrl` is `null`.

#### Fields on `quote`

| Field                         | Notes                                                                |
| ----------------------------- | -------------------------------------------------------------------- |
| `kind`                        | Always present in the response: `stoic`, `philosophical`, or `site`. |
| `sourceUrl`                   | Path to the post, or `null`.                                         |
| `postId`                      | Set only for site quotes.                                            |
| `book`                        | Section or letter when known; may be `null`.                         |
| `themes`                      | Tags for filtering or display.                                       |
| `context` / `modernRelevance` | Short blurbs; optional for display.                                  |

## Usage example

```javascript
const response = await fetch('/api/quotes');
const { quote, metadata } = await response.json();

console.log(quote.text);
if (quote.sourceUrl) {
  console.log('Read more:', quote.sourceUrl);
}
console.log(metadata.countsByKind);
```

## Human-readable docs

The `/api/` page on the live site summarizes the same behavior and includes a small tester UI.
