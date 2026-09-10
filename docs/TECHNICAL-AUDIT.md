# Notes — Technical Audit

**Audit date:** 2026-07-28  
**App version:** 6.0.0 (visual UI overhaul — monochrome + marigold/violet accents)  
**Production:** [notes.antoniwan.online](https://notes.antoniwan.online) · Vercel project `notes` (`prj_MrjdKV4wL7ubFNGKhVBASHub9rmb`)  
**Companion product map:** [roadmap.md](./roadmap.md) (§7 product audit, §8 technical roadmap)

This document is the system map the constitution already points at. It records what the product _is_ technically, where docs/code drift, and which gaps are closed vs deferred.

**Revised 2026-09-10** (audit date above is preserved on purpose): the toolchain row
in §2, the gate table in §7, and the cache note in §10 were corrected against the
`codex/optimization-roadmap` work. Everything else still describes the 2026-07-28
snapshot and has not been re-verified.

---

## 1. Product shape (one sentence)

Public field notes (essays, household recipes, book library) on a **hybrid Astro site**: almost everything is statically prerendered at build time; the only on-demand server route is `GET /api/quotes`. Reader state stays in the browser. Optional third parties are Remark42 (comments), Letterboxd (About), Vercel Analytics / Speed Insights, and Threads oEmbed.

---

## 2. Stack (truth)

| Layer           | Actual (resolved)                                                                             | Docs that were wrong                               |
| --------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Framework       | **Astro 7.x** (`astro@7.2.2` as of 2026-09-10)                                                | README / constitution / specify-rules said Astro 6 |
| Output          | **Hybrid** — default static + `prerender = false` on quotes                                   | README said “static output”                        |
| Adapter         | `@astrojs/vercel@11`                                                                          | OK                                                 |
| UI              | Tailwind CSS 4 + Vite plugin; Astro Fonts (DM Sans, Fraunces, Source Serif 4, JetBrains Mono) | OK                                                 |
| Content         | MD/MDX via `@astrojs/mdx`, collection `blog`                                                  | OK                                                 |
| Language        | TypeScript 5.9                                                                                | OK                                                 |
| Package manager | pnpm 12.3.4 (`packageManager`), Node 22.12.0 (`.nvmrc`); CI reads both                        | OK                                                 |
| Image           | Sharp; AVIF sources → social JPEG/PNG                                                         | OK                                                 |
| Analysis        | `sentiment`, `reading-time`, brain-science utils                                              | OK                                                 |

---

## 3. Architecture map

```text
                    ┌─────────────────────────────────────┐
                    │  Vercel (host + 1 serverless fn)    │
                    │  Analytics + Speed Insights         │
                    └───────────────┬─────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
   Static HTML/CSS/JS         /api/quotes (SSR)         /api/remark42/*
   (pages, feeds, SW)         random quotes JSON        rewrite → Railway
         │
   BaseLayout ── BaseHead / StructuredData / Header+Search
              ── ReadingProgress / ReadState / Footer / SW
         │
   ┌─────┴──────┬────────────┬─────────────┬──────────────┐
 PageLayout  BlogLayout  BrainScience*   Feeds
   │             │
 Content        Posts (MD/MDX) ← content.config.ts schema
 collections    publishFilters · translationUtils · tagVocabulary
```

**Layouts**

| Layout             | Role                                                 | Status                         |
| ------------------ | ---------------------------------------------------- | ------------------------------ |
| `BaseLayout.astro` | Shell: SEO, search index, analytics, SW, read-state  | Active hub                     |
| `PageLayout.astro` | Base + Container + PageHeader                        | Active                         |
| `BlogLayout.astro` | Post chrome: TOC, comments, share, related, hreflang | Active                         |
| `HomeLayout.astro` | Thin Base+Container wrapper                          | **Removed** (unused duplicate) |

**Content pipeline:** `src/content/p/**/*.{md,mdx}` → `src/content.config.ts` (Zod) → `remark-reading-time.mjs` (`minutesRead`) → pages filter with `isCollectionPublic` / `isFeedEligiblePost` / `isPublicPost`.

---

## 4. Route inventory

| Area         | Routes                                                    | Notes                                                             |
| ------------ | --------------------------------------------------------- | ----------------------------------------------------------------- |
| Reading      | `/`, `/p/[...slug]`, `/everything`, `/guided-path`        | Core reader surface                                               |
| Taxonomy     | `/category`, `/category/[category]`, `/tag`, `/tag/[tag]` | Tag detail pages crawlable but **omitted from sitemap** by design |
| Author tools | `/brain-science/*`, `/tag-management`                     | `noindex` + sitemap-excluded                                      |
| Library      | `/library`, `/library/books`                              | Static data in `src/data/library.ts`                              |
| Cookbook     | `/recipes`, `/p/recipes/[...slug]`                        | Household recipes; English listed; Spanish via dish toggle        |
| Syndication  | `/rss.xml`, `/feed.json`, `@astrojs/sitemap`              | Feed eligibility ≠ listing eligibility                            |
| API          | `/api/quotes`                                             | SSR JSON quotes endpoint                                          |
| System       | `/404`, `/sitemap.xml` → 301 to sitemap-index             |                                                                   |

Redirects live in two places: Astro `buildSeoRedirects()` (`src/utils/seoRouting.ts`) and `vercel.json` (legacy hosts + Remark42 rewrite). Prefer adding post/tag redirects in `seoRouting.ts` going forward. Remark42 upstream: set `REMARK42_UPSTREAM_ORIGIN` and run `pnpm run sync-remark42-rewrite` (see `docs/comments-setup.md`).

---

## 5. Integration inventory

| Integration         | Where                                                         | Env                                               | Failure mode                           | Docs                               |
| ------------------- | ------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------- | ---------------------------------- |
| Vercel Analytics    | `BaseLayout`                                                  | Project toggle                                    | Silent no-op if disabled               | README                             |
| Speed Insights      | `BaseLayout` `<head>`                                         | Project toggle                                    | Silent no-op                           | README                             |
| Remark42            | `Comments.astro`, `config/comments.ts`, `vercel.json` rewrite | `PUBLIC_REMARK42_HOST`, `PUBLIC_REMARK42_SITE_ID` | Wrong siteId → empty/wrong thread      | `docs/comments-setup.md`           |
| Letterboxd          | `about.astro` + `utils/letterboxd.ts` (build fetch)           | `LETTERBOXD_RSS_URL`, `LETTERBOXD_PROFILE_URL`    | Empty block                            | README / `.env.example`            |
| Threads             | `ThreadsEmbed.astro`                                          | None                                              | Soft-fail to link                      | Code only                          |
| Service worker      | `public/sw.js` + registration (`?v=` package version)         | None                                              | Stale caches until version bump        | `docs/performance-optimization.md` |
| Social images       | `scripts/generate-social-images.js`                           | None                                              | Missing JPG/PNG → AVIF in OG (fragile) | README                             |
| Brain Science cache | `src/data/.brain-science-cache/`                              | None                                              | Cache miss → full NLP at build         | This audit                         |

---

## 6. Client state (privacy)

| Feature                             | Key / mechanism                                                   |
| ----------------------------------- | ----------------------------------------------------------------- |
| Theme                               | `localStorage.theme`                                              |
| Read marks / Guided Path / progress | `blog-read-posts-v1.0` (+ legacy key) via `src/config/storage.ts` |
| Search                              | Build-time index inlined into Header; client filter only          |
| Comments                            | Remark42 cookies on comment host (third party)                    |

No accounts. No server-side reading progress. Constitution principle IV applies.

---

## 7. Quality gates (actual vs claimed)

| Gate                                | Status                                                        |
| ----------------------------------- | ------------------------------------------------------------- |
| `pnpm run format:check`             | CI                                                            |
| `pnpm run check`                    | CI — also owns unused locals/params (see below)               |
| `pnpm run lint`                     | CI — coverage detailed below                                  |
| `pnpm run build`                    | CI (+ social image step)                                      |
| `pnpm run validate-feeds`           | CI, after the build (needs `dist/`)                           |
| `pnpm run audit-frontmatter`        | CI, before the build — walks `src/content/p`                  |
| `pnpm run validate-structured-data` | CI — smoke-checks structured-data module surface only         |
| `pnpm run check-remark42-rewrite`   | CI — `vercel.json` rewrite vs `REMARK42_UPSTREAM_ORIGIN`      |
| Unit tests (`pnpm test`)            | CI — see §9 for coverage                                      |
| Browser / e2e tests                 | CI — 22 journeys over `dist/client` (`pnpm run test:browser`) |

**Lint coverage (corrected 2026-09-10).** Before this pass `eslint .` reached 131
files and applied exactly 8 rules to each — all `eslint-plugin-astro` deprecated-API
checks. `.ts` files matched no config block at all and were skipped silently, plain
`.js`/`.mjs` got the Astro rules and no JavaScript rules, and
`src/pages/writing-insights/**` was excluded outright. A green `pnpm run lint`
therefore established very little.

It now reaches 214 files with a correctness rule set applied to `.js`, `.mjs`,
`.cjs`, `.ts`, and `.astro`, and no source directory is excluded. Removing the
Writing Insights exclusion surfaced one real defect: an unescaped `>` in
`insights.astro` that the Astro compiler tolerates but `astro-eslint-parser`
cannot parse.

Unused symbols are split by language on purpose. Core `no-unused-vars` cannot read
TypeScript type positions — it reports every parameter name in a function type as
an unused argument — so it runs on plain JavaScript only, and `noUnusedLocals` /
`noUnusedParameters` in `tsconfig.json` cover TypeScript through `astro check`.
Both halves were confirmed by planting a deliberate violation in each file class.

Still uncovered: type-aware lint rules. Adding `typescript-eslint` would bring
them, at the cost of a new devDependency.

---

## 8. Findings — closed this pass

| ID   | Finding                                                                    | Fix                                                                       |
| ---- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| T-01 | Docs claimed Astro 6 / pure static                                         | README + constitution updated to Astro 7 hybrid                           |
| T-02 | SW cached `/api/*` (quotes + Remark42)                                     | Network-only for `/api/`; no `cache.put`                                  |
| T-03 | Remark42 default `siteId` was `remark42` vs docs `notes-antoniwan`         | Default aligned; `.env.example` lists PUBLIC vars                         |
| T-04 | Dead `CATEGORY_EMOJIS`, unused `HomeLayout`, unused `localStorageFeatures` | Removed                                                                   |
| T-05 | Constitution referenced missing `docs/TECHNICAL-AUDIT.md`                  | This file                                                                 |
| T-06 | Constitution named missing npm scripts                                     | Scripts added                                                             |
| T-07 | `/test-theme` shipped (noindex)                                            | Removed + SEO exclude cleaned                                             |
| T-08 | Multilingual overview over-claimed “hidden from listings”                  | Clarified: feeds only for secondary ES                                    |
| T-09 | Brain Science meta cache returned string `postDate`s                       | Revive `Date` on load in `cache.ts`                                       |
| T-10 | Feeds shipped raw Markdown + AVIF images                                   | HTML via Container API + social-safe images                               |
| T-11 | Listings included secondary ES translations                                | `isListingEligiblePost` / `isCollectionListed` on archives + search       |
| T-12 | Duplicate post redirects in `vercel.json`                                  | Astro `seoRouting` (+ trailing slash); Vercel keeps hosts + Remark42 only |
| T-13 | Search indexed noindex author tools                                        | Dropped brain-science / tag-management from search index                  |
| T-14 | Brain Science re-scanned corpus per page                                   | Memoize posts + objective metrics + sentiment; precompiled regexes        |
| T-15 | `getSearchData()` rebuilt on every layout                                  | Memoized for the Node build process                                       |
| T-16 | Missing `og:locale:alternate` + sitemap EN/ES clusters                     | BaseHead + sitemap `serialize` via `translationGroup`                     |
| T-17 | Page-local Flesch/lexicon loops in Brain Science routes                    | Shared `textAnalysis.ts` (+ build memo)                                   |
| T-18 | `structured-data-optimization.md` drifted from generators                  | Rewrote against live `generateStructuredData` / layout wiring             |
| T-19 | Remark42 upstream hardcoded only in `vercel.json`                          | `REMARK42_UPSTREAM_ORIGIN` + sync/check scripts                           |
| T-20 | Silent empty Letterboxd when RSS URL set                                   | Build-time `console.warn` on HTTP/parse empty                             |
| T-21 | Inert `transition:name` without View Transitions                           | Removed attrs                                                             |
| T-22 | Tags overwrote BlogPosting `articleSection`                                | Category preferred; tags only as fallback                                 |

Package version bumped to **5.30.1** so browsers fetch the new service worker.

---

## 9. Findings — open (technical roadmap)

See [roadmap.md §8](./roadmap.md#8-technical-roadmap--2026-07-28). Remaining optional polish: curated FAQ/HowTo wiring (P3) if product wants it.

Unit tests (`pnpm test`) cover publish filters, SEO routing, feed HTML sanitization, quotes helpers, text metrics, OG locale alternates, sitemap translation clusters, and BlogPosting `articleSection`.

---

## 10. Scaling risks (known)

- Writing Insights lexicons live in `src/utils/brainScience/vocabulary.ts` (EN+ES). Flesch / word / sentence metrics + objective metrics + sentiment + posts fetch are memoized for the build process. The meta disk cache is versioned (v3) and its signature hashes title + body plus `pubDate`, so same-length body edits and title changes invalidate (corrected 2026-09-10).
- Dual redirect tables invite drift (host rules stay on Vercel; path redirects in Astro).
- Graphify graph may lag HEAD; refresh with `graphify update .` after code changes.

---

## 11. How to re-audit

```bash
pnpm run check && pnpm run lint && pnpm run build
pnpm run audit-frontmatter
pnpm run validate-feeds
pnpm run validate-structured-data
```

Refresh architecture graph: `graphify update .`  
Product / content bets stay in `docs/roadmap.md` §7; keep technical debt here and in §8.
