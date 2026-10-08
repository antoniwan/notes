# Structured Data

How Notes emits Schema.org JSON-LD. Source of truth: [`src/utils/structuredData.ts`](../src/utils/structuredData.ts), rendered by [`StructuredData.astro`](../src/components/StructuredData.astro) from [`BaseLayout.astro`](../src/layouts/BaseLayout.astro).

Site constants (`SITE_TITLE`, `AUTHOR`, `SEO_CONFIG`) live in [`src/consts.ts`](../src/consts.ts). Image URLs go through `generateImageUrl()` (social-safe JPEG/PNG when a manifest variant exists). Canonical URLs never use trailing slashes (`trailingSlash: 'never'`).

Do not emit an `Organization` node for Antonio. 6.31.1 removed it. Every schema that names him uses `authorRef`: a `Person` with `@id` `https://antoniwan.online/#person`. antoniwan.online holds the full Person. Notes points at it.

## Production path

`BaseLayout` always calls `generateStructuredData(...)` and emits one `<script type="application/ld+json">` per schema object.

| Layout / page prop    | `structuredDataType` | Extra schemas beyond WebSite             |
| --------------------- | -------------------- | ---------------------------------------- |
| Default / most pages  | `website`            | none                                     |
| `BlogLayout` (essays) | `article`            | `BlogPosting` (requires `pubDate`)       |
| `BlogLayout` (dishes) | `recipe`             | `Recipe`                                 |
| `category/[category]` | `category`           | `CollectionPage` when `posts.length > 0` |
| `tag/[tag]`           | `tag`                | `CollectionPage` when `posts.length > 0` |

Post pages also attach a `BreadcrumbList` from `generateBreadcrumbSchema` as an extra schema. The module has no FAQ, HowTo, or Review helpers. Those were never wired into a layout and were removed in 6.29.0.

## Base schema (every page)

Always emitted first:

1. **WebSite** — `name: Notes`, site description/URL, `inLanguage: en-US`, `publisher` as `authorRef`. **No `SearchAction`** (site search is client-only; there is no crawlable `/search?q=` endpoint).

There is no separate Organization or Person graph on Notes pages.

## Article pages (`type: 'article'`)

Requires `pubDate`. Emits **BlogPosting**:

- `headline`, `description`, `image`, `datePublished`, `dateModified` (falls back to `pubDate`)
- `author` / `publisher` as `authorRef`
- `keywords` (comma-joined), `timeRequired` as `PTnM` when `minutesRead` parses
- `url` (canonical), `inLanguage` from the layout (`en-US` or `es`)
- `wordCount` when provided (> 0)
- `mainEntityOfPage`, `isPartOf` → Blog named `Notes`
- When the post has categories: `articleSection` is the primary category **display name**, and `about` is a `Thing` per category name
- A post with no category has no `articleSection` and no `about`

It does not set `isAccessibleForFree`, `hasPart`, or tag lists as `articleSection`.

## Recipe pages (`type: 'recipe'`)

Emits **Recipe** instead of BlogPosting. Ingredients and steps come from `recipeSections.ts` (the `## Ingredients` / `## Method` blocks) unless frontmatter already set them. Empty timing and ingredient keys are omitted.

## Collection pages (`category` / `tag`)

Only when `posts` is non-empty. Emits **CollectionPage** with:

- `mainEntity` → `ItemList` of compact `BlogPosting` items
- Nested `breadcrumb`: Home → Categories|Tags index → current page
- Category pages with `identifier`: `about` Thing (the identifier string, not the display name)
- Tag pages with `identifier`: `keywords: identifier`
- Collection `inLanguage` is hardcoded `en-US`

Empty category/tag result sets fall back to WebSite only.

## Unused exports (library only)

| Export                   | Intent                               | Wired to HTML?                       |
| ------------------------ | ------------------------------------ | ------------------------------------ |
| `generateArticleSchema`  | Generic `Article` (vs `BlogPosting`) | No                                   |
| `validateStructuredData` | Dev/debug helper                     | No (CI uses a separate smoke script) |

Both stay because the smoke script below requires them. `generateArticleSchema` still names `publisher` as Organization. That helper is not used on the site. Do not use it as a model for live JSON-LD.

## Validation

```bash
pnpm run validate-structured-data
```

Smoke-checks that `structuredData.ts` still exports `generateStructuredData`, `generateArticleSchema`, and `validateStructuredData`, and mentions core Schema.org types. It does **not** crawl live HTML or call Google’s Rich Results Test. Generated pages are checked by `pnpm run validate-generated-content`, which requires `WebSite` on every sampled page.

For live checks:

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- Search Console → Enhancements / Experience reports after deploy

## Known gaps / follow-ups

1. Base WebSite always uses `inLanguage: en-US`, even on Spanish posts (only `BlogPosting.inLanguage` / `Recipe.inLanguage` follow the post).
2. `hasComments`, `featured`, `draft`, and `tags` are accepted on options but unused in schema output.
3. Collection schemas list every post in the page’s `posts` prop — keep that list bounded if indexes grow large.

## Related

- Meta / Open Graph / hreflang: [`src/utils/seo.ts`](../src/utils/seo.ts), [`BaseHead.astro`](../src/components/BaseHead.astro)
- Multilingual listing vs URL policy: [`docs/multilingual-setup.md`](./multilingual-setup.md)
- Technical audit: [`docs/TECHNICAL-AUDIT.md`](./TECHNICAL-AUDIT.md)
