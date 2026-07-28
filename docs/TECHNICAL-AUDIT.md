# Notes — Technical Audit

**Audit date:** 2026-07-28  
**App version:** 5.30.1 (service-worker API cache fix + audit hygiene)  
**Production:** [notes.antoniwan.online](https://notes.antoniwan.online) · Vercel project `notes` (`prj_MrjdKV4wL7ubFNGKhVBASHub9rmb`)  
**Companion product map:** [roadmap.md](./roadmap.md) (§7 product audit, §8 technical roadmap)

This document is the system map the constitution already points at. It records what the product *is* technically, where docs/code drift, and which gaps are closed vs deferred.

---

## 1. Product shape (one sentence)

A **hybrid Astro site**: almost everything is statically prerendered at build time; the only on-demand server route is `GET /api/quotes`. Reader state stays in the browser. Optional third parties are Remark42 (comments), Letterboxd (About), Vercel Analytics / Speed Insights, and Threads oEmbed.

---

## 2. Stack (truth)

| Layer | Actual (resolved) | Docs that were wrong |
| --- | --- | --- |
| Framework | **Astro 7.x** (`astro@7.1.4`) | README / constitution / specify-rules said Astro 6 |
| Output | **Hybrid** — default static + `prerender = false` on quotes | README said “static output” |
| Adapter | `@astrojs/vercel@11` | OK |
| UI | Tailwind CSS 4 + Vite plugin; Astro Fonts (DM Sans, Fraunces, Literata, JetBrains Mono) | OK |
| Content | MD/MDX via `@astrojs/mdx`, collection `blog` | OK |
| Language | TypeScript 5.9 | OK |
| Package manager | pnpm (CI: pnpm 10, Node 22.12) | OK |
| Image | Sharp; AVIF sources → social JPEG/PNG | OK |
| Analysis | `sentiment`, `reading-time`, brain-science utils | OK |

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
 PageLayout  BlogLayout  BrainScience*   Feeds/API docs
   │             │
 Content        Posts (MD/MDX) ← content.config.ts schema
 collections    publishFilters · translationUtils · tagVocabulary
```

**Layouts**

| Layout | Role | Status |
| --- | --- | --- |
| `BaseLayout.astro` | Shell: SEO, search index, analytics, SW, read-state | Active hub |
| `PageLayout.astro` | Base + Container + PageHeader | Active |
| `BlogLayout.astro` | Post chrome: TOC, comments, share, related, hreflang | Active |
| `HomeLayout.astro` | Thin Base+Container wrapper | **Removed** (unused duplicate) |

**Content pipeline:** `src/content/p/**/*.{md,mdx}` → `src/content.config.ts` (Zod) → `remark-reading-time.mjs` (`minutesRead`) → pages filter with `isCollectionPublic` / `isFeedEligiblePost` / `isPublicPost`.

---

## 4. Route inventory

| Area | Routes | Notes |
| --- | --- | --- |
| Reading | `/`, `/p/[...slug]`, `/everything`, `/guided-path` | Core reader surface |
| Taxonomy | `/category`, `/category/[category]`, `/tag`, `/tag/[tag]` | Tag detail pages crawlable but **omitted from sitemap** by design |
| Author tools | `/brain-science/*`, `/tag-management` | `noindex` + sitemap-excluded |
| Library | `/library`, `/library/books` | Static data in `src/data/library.ts` |
| Syndication | `/rss.xml`, `/feed.json`, `@astrojs/sitemap` | Feed eligibility ≠ listing eligibility |
| API | `/api/`, `/api/quotes` | Quotes is SSR; index is static docs |
| System | `/404`, `/sitemap.xml` → 301 to sitemap-index | |

Redirects live in two places: Astro `buildSeoRedirects()` (`src/utils/seoRouting.ts`) and `vercel.json` (legacy hosts + a few post slugs + Remark42 rewrite). Prefer adding post/tag redirects in `seoRouting.ts` going forward.

---

## 5. Integration inventory

| Integration | Where | Env | Failure mode | Docs |
| --- | --- | --- | --- | --- |
| Vercel Analytics | `BaseLayout` | Project toggle | Silent no-op if disabled | README |
| Speed Insights | `BaseLayout` `<head>` | Project toggle | Silent no-op | README |
| Remark42 | `Comments.astro`, `config/comments.ts`, `vercel.json` rewrite | `PUBLIC_REMARK42_HOST`, `PUBLIC_REMARK42_SITE_ID` | Wrong siteId → empty/wrong thread | `docs/comments-setup.md` |
| Letterboxd | `about.astro` + `utils/letterboxd.ts` (build fetch) | `LETTERBOXD_RSS_URL`, `LETTERBOXD_PROFILE_URL` | Empty block | README / `.env.example` |
| Threads | `ThreadsEmbed.astro` | None | Soft-fail to link | Code only |
| Service worker | `public/sw.js` + registration (`?v=` package version) | None | Stale caches until version bump | `docs/performance-optimization.md` |
| Social images | `scripts/generate-social-images.js` | None | Missing JPG/PNG → AVIF in OG (fragile) | README |
| Brain Science cache | `src/data/.brain-science-cache/` | None | Cache miss → full NLP at build | This audit |

---

## 6. Client state (privacy)

| Feature | Key / mechanism |
| --- | --- |
| Theme | `localStorage.theme` |
| Read marks / Guided Path / progress | `blog-read-posts-v1.0` (+ legacy key) via `src/config/storage.ts` |
| Search | Build-time index inlined into Header; client filter only |
| Comments | Remark42 cookies on comment host (third party) |

No accounts. No server-side reading progress. Constitution principle IV applies.

---

## 7. Quality gates (actual vs claimed)

| Gate | Status |
| --- | --- |
| `pnpm run format:check` | CI |
| `pnpm run check` | CI |
| `pnpm run lint` | CI |
| `pnpm run build` | CI (+ social image step) |
| `pnpm run validate-feeds` | **Wired** — needs `dist/` from a prior build |
| `pnpm run audit-frontmatter` | **Wired** — walks `src/content/p` |
| `pnpm run validate-structured-data` | **Wired** — smoke-checks structured-data module surface |
| Unit / e2e tests | **None** (constitution acknowledges this) |

---

## 8. Findings — closed this pass

| ID | Finding | Fix |
| --- | --- | --- |
| T-01 | Docs claimed Astro 6 / pure static | README + constitution updated to Astro 7 hybrid |
| T-02 | SW cached `/api/*` (quotes + Remark42) | Network-only for `/api/`; no `cache.put` |
| T-03 | Remark42 default `siteId` was `remark42` vs docs `notes-antoniwan` | Default aligned; `.env.example` lists PUBLIC vars |
| T-04 | Dead `CATEGORY_EMOJIS`, unused `HomeLayout`, unused `localStorageFeatures` | Removed |
| T-05 | Constitution referenced missing `docs/TECHNICAL-AUDIT.md` | This file |
| T-06 | Constitution named missing npm scripts | Scripts added |
| T-07 | `/test-theme` shipped (noindex) | Removed + SEO exclude cleaned |
| T-08 | Multilingual overview over-claimed “hidden from listings” | Clarified: feeds only for secondary ES |
| T-09 | Brain Science meta cache returned string `postDate`s | Revive `Date` on load in `cache.ts` |
| T-10 | Feeds shipped raw Markdown + AVIF images | HTML via Container API + social-safe images |
| T-11 | Listings included secondary ES translations | `isListingEligiblePost` / `isCollectionListed` on archives + search |
| T-12 | Duplicate post redirects in `vercel.json` | Astro `seoRouting` (+ trailing slash); Vercel keeps hosts + Remark42 only |
| T-13 | Search indexed noindex author tools | Dropped brain-science / tag-management from search index |
| T-14 | Brain Science re-scanned corpus per page | Memoize posts + objective metrics + sentiment; precompiled regexes |
| T-15 | `getSearchData()` rebuilt on every layout | Memoized for the Node build process |
| T-16 | Missing `og:locale:alternate` + sitemap EN/ES clusters | BaseHead + sitemap `serialize` via `translationGroup` |
| T-17 | Page-local Flesch/lexicon loops in Brain Science routes | Shared `textAnalysis.ts` (+ build memo) |

Package version bumped to **5.30.1** so browsers fetch the new service worker.

---

## 9. Findings — open (technical roadmap)

See [roadmap.md §8](./roadmap.md#8-technical-roadmap--2026-07-28). Highest remaining leverage:

1. **Refresh `docs/structured-data-optimization.md`** against current generators (doc drift).

Unit tests (`pnpm test`) cover publish filters, SEO routing, feed HTML sanitization, quotes helpers, text metrics, and OG locale alternates.

---

## 10. Scaling risks (known)

- Brain Science routes still hold page-specific lexicon lists; shared **Flesch / word / sentence metrics + objective metrics + sentiment + posts fetch** are memoized for the build process. Cache signature still ignores title and same-length body edits for the disk meta-analysis cache.
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
