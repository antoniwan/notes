# Cursor task: SEO and routing cleanup for `notes.antoniwan.online`

## Context

This is the Astro 7 site behind `notes.antoniwan.online`, deployed on Vercel with `@astrojs/vercel`. `trailingSlash: 'never'`. Content lives in a single `blog` collection loaded from `src/content/p/`, with recipes in the `src/content/p/recipes/` subdirectory shipping at `/p/recipes/<slug>`.

I have already audited the routes. **Do not restructure anything.** No route renames, no moving `/recipes`, no new sections. Every task below is additive or a redirect, and each one is independently shippable.

Work through them in order. Commit each task separately with a clear message. Run `pnpm test`, `pnpm lint`, and `pnpm build` before you say a task is done.

---

## Task 1 — Restore ~16 months of unredirected 404s (highest priority)

**Problem.** On 2025-05-21 these page files were deleted and no redirects were ever added. I grepped `vercel.json`, `astro.config.mjs`, and all of `src/` — nothing handles them.

- `src/pages/blog/[...slug].astro` and `src/pages/blog/index.astro` (commit `f6b3a9e`)
- `src/pages/categories/[category].astro` and `src/pages/categories/index.astro` (commit `b2b64c5`)
- `src/pages/ciencia-cerebral/*` (7 files — the Spanish brain-science dashboard)
- `src/pages/search/index.astro`
- `src/pages/p/index.astro`

This compounds with the host redirects already in `vercel.json`: an inbound link to `antoniwan.blog/blog/good-sheep` is correctly forwarded to `notes.antoniwan.online/blog/good-sheep` and then 404s.

**What to do.** Add wildcard redirects to `vercel.json`. Put them **after** the existing `/:path+/` trailing-slash rule and **after** the five host redirects, so neither is shadowed. All permanent (308).

| Source                     | Destination         |
| -------------------------- | ------------------- |
| `/blog/:slug*`             | `/p/:slug*`         |
| `/blog`                    | `/everything`       |
| `/categories/:slug*`       | `/category/:slug*`  |
| `/categories`              | `/category`         |
| `/ciencia-cerebral/:path*` | `/writing-insights` |
| `/search`                  | `/everything`       |
| `/p`                       | `/everything`       |

Keep these in `vercel.json` rather than `buildSeoRedirects()` — the Astro `redirects` map is for exact paths and the wildcards belong at the platform layer.

**Acceptance.** `pnpm build` succeeds. Confirm by reading the built output that no route collision was introduced, and that `/p/<slug>` pages still generate normally.

---

## Task 2 — Remove the duplicate `/library` page

**Problem.** `src/pages/library.astro` and `src/pages/library/books.astro` render the same `books` array from `src/data/library.ts` with the same three filters. `/library` is linked from nowhere in the codebase, but **both** URLs are in the live sitemap (verified in `dist/client/sitemap-0.xml`), so they compete with each other in search.

**What to do.**

1. Delete `src/pages/library.astro`.
2. Add `'/library': '/library/books'` to `POST_REDIRECTS` in `src/utils/seoRouting.ts`. (Yes, the constant is misnamed — see Task 7.)
3. Remove the `'/library'` key from `PAGE_META` in `src/data/pageMeta.ts`.
4. Check `src/data/pageMeta.test.ts` — if it asserts over `PAGE_META` keys or route coverage, update it.
5. Check `src/data/socialImageManifest.ts` and `src/data/defaultCovers.ts` for a `/library` entry and remove it if present.

**Acceptance.** `pnpm test` passes. `pnpm build` emits no `/library` page and the sitemap contains `/library/books` only.

---

## Task 3 — `Recipe` structured data on the 38 dish pages

**Problem.** Every recipe page emits `BlogPosting`. `src/utils/structuredData.ts` supports `website`, `article`, `category`, `tag` and has helpers for FAQ, HowTo, Review, and Article — but no `Recipe`. Recipe rich results are the largest untapped organic lever on this site and they require the `Recipe` type.

**What to do.**

1. Extend `StructuredDataOptions.type` in `src/utils/structuredData.ts` with `'recipe'`, and add optional recipe fields: `recipeIngredient?: string[]`, `recipeInstructions?: string[]`, `prepTime?: string`, `cookTime?: string`, `totalTime?: string`, `recipeYield?: string`, `recipeCategory?: string`, `recipeCuisine?: string`.
2. In `generateStructuredData`, when `type === 'recipe'`, emit a `Recipe` schema. Map what already exists in frontmatter: `title` → `name`, `description`, `heroImage` → `image`, `author`, `pubDate` → `datePublished`, `keywords`. ISO 8601 durations (`PT20M`) for the time fields. Omit any field with no data rather than emitting an empty value — a partial `Recipe` is valid and still beats `BlogPosting`.
3. In `src/layouts/BlogLayout.astro`, `structuredDataType` is currently hardcoded to `"article"` on the `BaseLayout` call. Make it conditional: use `"recipe"` when the post is a recipe, `"article"` otherwise. Use the existing `isRecipePost()` from `src/utils/recipes.ts` — do not write a new path check.
4. Add the new optional fields to the `blog` collection schema in `src/content.config.ts`, all `.optional()` so no existing post breaks.
5. Add vitest coverage in `src/utils/structuredData.test.ts` for the recipe branch: a recipe entry produces `@type: 'Recipe'`, a non-recipe entry still produces `BlogPosting`, and a recipe with no timing fields emits valid JSON with those keys absent.

**Do not** backfill frontmatter for the 38 recipes in this task. Ship the plumbing; I will fill in ingredients and times myself.

**Acceptance.** `pnpm test` passes. Build the site and confirm a recipe page's JSON-LD validates as `Recipe` and a normal post's still validates as `BlogPosting`.

---

## Task 4 — `BreadcrumbList` JSON-LD

**Problem.** `BlogLayout.astro` already renders a visual `<Breadcrumbs>` component, but no `BreadcrumbList` structured data is emitted anywhere. Google uses it to replace the raw URL in the SERP with a readable trail, which matters most on `/p/recipes/<slug>`.

**What to do.**

1. Add a `generateBreadcrumbSchema(items: Array<{ name: string; url: string }>)` export to `src/utils/structuredData.ts`.
2. `StructuredData.astro` already accepts an `additionalSchemas` prop, but `BaseLayout.astro` never passes one — it only passes `data`. Add an `additionalSchemas` prop to `BaseLayout` and forward it to `<StructuredData>`.
3. Have `BlogLayout` build the breadcrumb trail from the same source the visual `<Breadcrumbs>` component uses, so the two can never disagree, and pass it through.
4. Test that the emitted trail matches the rendered one.

---

## Task 5 — Index the Writing Insights pages

**Problem.** All seven `/writing-insights` paths are in `SEO_EXCLUDED_PATHS` in `src/utils/seoRouting.ts`, so they are kept out of the sitemap. Their intended audience is people reading the GitHub repo and people who find this kind of writing analysis interesting — an audience that arrives via search. Excluding them is backwards.

**What to do.** Remove these seven entries from `SEO_EXCLUDED_PATHS`:

```
/writing-insights
/writing-insights/insights
/writing-insights/cadence
/writing-insights/evolution
/writing-insights/topics
/writing-insights/patterns
/writing-insights/meta
```

Leave `/brain-science` and its six subpaths in the list — those are tombstones and redirect targets, not destinations. Leave `/tag-management`, `/sitemap.xml`, and `/api` excluded.

Also check whether any of those seven pages set a `robots` meta prop via `BaseLayout`; if they emit `noindex`, remove that too, otherwise the sitemap change accomplishes nothing.

**Do not** change `src/data/navigation.ts` in this task. The nav restructure is a separate decision.

**Acceptance.** `pnpm build`; the sitemap now contains all seven, and none of them serve a `noindex` meta tag.

---

## Task 6 — Surface the Spanish twins on the Cookbook index

**Problem.** `src/pages/recipes.astro` already builds a `plates` array where each entry has a `hasSpanish` boolean derived from `getSpanishTwinGroups()`, and then never renders it. Twelve of the thirty-eight recipes have a Spanish version and a reader cannot tell which without clicking.

**What to do.** Render a small `ES` marker on plate cards where `hasSpanish` is true. Keep the index itself in English — this only signals that a translation exists behind the dish. Give it an accessible label (something like "Spanish version available"), not a bare two-letter badge. Match the existing chip styling on the page rather than inventing a new component.

---

## Task 7 — Small cleanups

1. **Rename the redirect constant.** `POST_REDIRECTS` in `src/utils/seoRouting.ts` already contains a non-post entry (`/p/reflexion-palabras-transformacion` → `/tag/transformation`) and Task 2 adds `/library`. Split it into `POST_REDIRECTS` (genuine post-to-post moves) and `PAGE_REDIRECTS` (everything else), and merge both in `buildSeoRedirects()`. Update any tests.

2. **Move the sitemap redirect out of the route layer.** `src/pages/sitemap.xml.astro` is a page whose entire body is `return Astro.redirect('/sitemap-index.xml', 301)`. Delete the file and add the redirect to `vercel.json` instead. Confirm `/sitemap.xml` still 301s after the change.

3. **Make the Letterboxd fetch fail loudly.** `fetchLetterboxdRecent` in `src/utils/letterboxd.ts` returns `[]` and logs `console.warn` when the RSS fetch fails or times out (12s). On Vercel that means a transient Letterboxd outage silently ships an About page with no films. Add a committed JSON fallback (last known good response) that gets used when the fetch returns empty, and make the warning loud enough to notice in build logs.

---

## Verification before you hand it back

- `pnpm lint`, `pnpm test`, `pnpm check`, and `pnpm build` all clean.
- Diff the generated `sitemap-0.xml` against the previous build and tell me exactly which URLs were added and removed. I want to see that list, not a summary.
- Paste the JSON-LD from one recipe page, one regular post, and one Spanish post so I can check them against Google's Rich Results Test myself.
- Confirm no existing `/p/*` URL changed. Any change there is a bug in this work, not a feature.

## Out of scope — do not touch

- `src/data/navigation.ts`
- Renaming `/recipes`, `/library/books`, or any existing route
- Adding a `/books` route or any new section
- Backfilling recipe frontmatter
- Anything in `src/content/p/`
