# Structured Data

How Notes emits Schema.org JSON-LD. Source of truth: [`src/utils/structuredData.ts`](../src/utils/structuredData.ts), rendered by [`StructuredData.astro`](../src/components/StructuredData.astro) from [`BaseLayout.astro`](../src/layouts/BaseLayout.astro).

Site constants (`SITE_TITLE`, `AUTHOR`, `SEO_CONFIG`, `SOCIAL_LINKS`) live in [`src/consts.ts`](../src/consts.ts). Image URLs go through `generateImageUrl()` (social-safe JPEG/PNG when a manifest variant exists). Canonical URLs never use trailing slashes (`trailingSlash: 'never'`).

## Production path

`BaseLayout` always calls `generateStructuredData(...)` and emits one `<script type="application/ld+json">` per schema object.

| Layout / page prop    | `structuredDataType` | Extra schemas beyond base set                         |
| --------------------- | -------------------- | ----------------------------------------------------- |
| Default / most pages  | `website`            | none                                                  |
| `BlogLayout` (posts)  | `article`            | `BlogPosting` + `BreadcrumbList` (requires `pubDate`) |
| `category/[category]` | `category`           | `CollectionPage` when `posts.length > 0`              |
| `tag/[tag]`           | `tag`                | `CollectionPage` when `posts.length > 0`              |

Helpers such as FAQ / HowTo / Review / `generateEnhancedStructuredData` exist in the module but are **not wired** into layouts today. Do not assume they appear in page HTML.

## Base schemas (every page)

Always emitted first:

1. **WebSite** — `name: Notes`, site description/URL, `inLanguage: en-US`, `publisher` as Person. **No `SearchAction`** (site search is client-only; there is no crawlable `/search?q=` endpoint).
2. **Organization** — `name` from `SEO_CONFIG.organizationName` (author name), logo via `generateImageUrl`, `sameAs: Object.values(SOCIAL_LINKS)`, foundingDate `2024`, areaServed / serviceType strings.
3. **Person** (author) — `AUTHOR` fields, subset `sameAs` (twitter, github, bluesky), `knowsAbout` topic list, occupation metadata.

## Article pages (`type: 'article'`)

Requires `pubDate`. Emits:

### BlogPosting

Notable fields:

- `headline`, `description`, `image`, `datePublished`, `dateModified` (falls back to `pubDate`)
- `author` / `publisher` (Person / Organization with logo)
- `keywords` (comma-joined), `timeRequired` as `PTnM` when `minutesRead` parses
- `url` (canonical), `inLanguage` from layout (post language → `en-US` / `es-ES`)
- `wordCount` when provided (> 0)
- `mainEntityOfPage`, `isPartOf` → Blog named `Notes`
- `about` from `category[]` as `Thing`s when categories exist
- `articleSection`: primary `category[0]` if present; else first three tags joined; else `"Personal Growth"`
- `featured` → `isAccessibleForFree: true`; `draft` → `isAccessibleForFree: false`
- TOC present → `hasPart` WebPageElement named “Table of Contents”

### BreadcrumbList

`Home` → optional first category (`/category/{id}`) → post title. Positions adjust when no category.

## Collection pages (`category` / `tag`)

Only when `posts` is non-empty. Emits **CollectionPage** with:

- `mainEntity` → `ItemList` of compact `BlogPosting` items (headline, description, url, dates, author, image, keywords, articleSection, timeRequired)
- Nested `breadcrumb`: Home → Categories|Tags index → current page
- Category pages with `identifier`: `about` Thing
- Tag pages with `identifier`: `keywords: identifier`
- Collection `inLanguage` is hardcoded `en-US` (not post-language-aware)

Empty category/tag result sets fall back to the base three schemas only.

## Unused exports (library only)

| Export                                                     | Intent                               | Wired to HTML?                       |
| ---------------------------------------------------------- | ------------------------------------ | ------------------------------------ |
| `generateFAQSchema` / `autoDetectFAQSchema`                | FAQPage from Q&A markdown heuristics | No                                   |
| `generateEnhancedStructuredData`                           | Base schemas + auto FAQ for articles | No                                   |
| `generateHowToSchema`                                      | HowTo tutorials                      | No                                   |
| `generateReviewSchema`                                     | Review / rating                      | No                                   |
| `generateArticleSchema`                                    | Generic `Article` (vs `BlogPosting`) | No                                   |
| `generateContentTypeSpecificSchema`                        | Switch for how-to / review / faq     | No                                   |
| `validateStructuredData` / `generateStructuredDataSummary` | Dev/debug helpers                    | No (CI uses a separate smoke script) |

Wire these only with intentional layout changes and Rich Results expectations — auto-FAQ heuristics are noisy.

## Validation

```bash
pnpm run validate-structured-data
```

Smoke-checks that `structuredData.ts` still exports `generateStructuredData`, `generateArticleSchema`, and `validateStructuredData`, and mentions core Schema.org types. It does **not** crawl live HTML or call Google’s Rich Results Test.

For live checks:

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- Search Console → Enhancements / Experience reports after deploy

Optional local helper:

```ts
import { validateStructuredData, generateStructuredDataSummary } from '../utils/structuredData';
```

## Known gaps / follow-ups

1. Base WebSite / Organization / Person always use `inLanguage: en-US` even on Spanish posts (only `BlogPosting.inLanguage` follows the post).
2. FAQ / HowTo / Review helpers are dead code unless product wants them on specific posts.
3. `hasComments` is accepted on options but unused in schema output.
4. Collection schemas list every post in the page’s `posts` prop — keep that list bounded if indexes grow large.

## Related

- Meta / Open Graph / hreflang: [`src/utils/seo.ts`](../src/utils/seo.ts), [`BaseHead.astro`](../src/components/BaseHead.astro)
- Multilingual listing vs URL policy: [`docs/multilingual-setup.md`](./multilingual-setup.md)
- Technical audit: [`docs/TECHNICAL-AUDIT.md`](./TECHNICAL-AUDIT.md)
