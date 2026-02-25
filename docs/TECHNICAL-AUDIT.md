# Technical Audit: Notes (Astro Blog)

**Date:** February 2025  
**Last updated:** February 2025 (audit refreshed to reflect current state)  
**Scope:** Architecture, dependencies, performance, code quality, content layer, styling, build/tooling, maintainability  
**Assumption:** Codebase scales to ~10× current content volume (~80 posts → 800+).

> **Note:** This is a point-in-time audit. The codebase may have changed since; some findings may already be addressed or outdated.

---

## Updates since original audit (current state)

- **TOC bug (1.1) — FIXED.** Table of contents is now derived from markdown headings (`/^#{2,3}\s+(.+)$/gm`) in `src/pages/p/[...slug].astro`. TOC data is passed to BlogLayout and into BaseLayout; structured data receives a boolean (has TOC) and adds `hasPart` for the article schema when the TOC is non-empty. There is still no in-page TOC UI; the data is used for JSON-LD only.
- **Storage constants (1.2) — FIXED.** ReadStateServiceInit.astro no longer duplicates STORAGE_KEYS, STORAGE_EVENTS, or TIMING; it imports from `src/config/storage.ts` and injects them via `define:vars`.
- **Fonts.** Local `@font-face` in `src/styles/fonts.css` now only defines Open Sans. Lora and Source Serif Pro were removed to avoid 404s when gstatic URLs change; both are loaded solely via the Google Fonts stylesheet in BaseHead.astro.
- **Client scripts.** ReadStateServiceInit no longer uses `import.meta` in its inline script (uses `define:vars={{ isDev }}` from frontmatter). BlogLayout’s read-state script no longer uses `define:vars`; it reads `postSlug` from the DOM (`data-post-slug` on the main content wrapper) so the script can stay a proper ES module and use `import`.
- **Types.** `Window.ReadStateService` is declared in `src/env.d.ts`. `BaseLayoutProps.tableOfContents` accepts either a boolean or the TOC array shape for structured data.

---

## Executive Summary

The project is a well-structured Astro blog with sensible defaults (static prerender, Tailwind, content collections, Vercel adapter). **Structural health is good** with clear separation of layouts, components, and content. The **critical TOC bug is fixed**. Remaining items that will compound at scale: **duplicated data fetching** (SearchBar, repeated `getCollection`), **duplicated logic** (reading time, relative time, category resolution, storage constants), **missing tooling** (no ESLint), and **heavy client-side and build-time work** (NLP on every brain-science page, `readdirSync` per DefaultImage). Dependency hygiene is mostly good; a few packages are misplaced or only used in scripts. Addressing the remaining structural items below will keep the codebase maintainable and performant as it grows.

**Overall health: B+** — Solid foundation; one critical bug resolved; targeted refactors will raise it to A.

---

## 1. Critical Issues (Must Fix)

### 1.1 Table of contents — ✅ FIXED

**Was:** TOC was built with an HTML regex on `post.body`, which is raw markdown in Astro content collections, so the regex never matched and TOC was always empty.

**Current:** In `src/pages/p/[...slug].astro`, TOC is derived from markdown headings with `/^(#{2,3})\s+(.+)$/gm`; `text`, `level`, and `slug` are derived and passed to BlogLayout. BaseLayout converts the TOC array to a boolean and passes it to `generateStructuredData`, so the article schema gets `hasPart` (Table of Contents) when the post has headings. There is no in-page TOC UI yet; the data is used for JSON-LD only.

---

### 1.2 Duplicated storage constants — ✅ FIXED

**Locations:**  
- `src/config/storage.ts` — source of truth for `STORAGE_KEYS`, `STORAGE_EVENTS`, `TIMING`  
- `src/components/ReadStateServiceInit.astro` — inline script duplicates the same constants with comment “match src/config/storage.ts”

**Issue:** Changing a key or timing in `config/storage.ts` does not update the inline script. Read state can break or diverge (e.g. different key names, different delays).

**Fix:**  
- Do not duplicate: either inject constants at build time (e.g. `define:vars` from a shared module used only in that script’s context) or ship a tiny shared script that defines the constants and is loaded before the inline script.  
- Prefer a single source of truth in `config/storage.ts` and one way to expose it to the client (e.g. one small client bundle or inline JSON from server).

---

### 1.3 Reading time computed twice; remark value ignored — ✅ FIXED

**Locations:**  
- `remark-reading-time.mjs` — sets `data.astro.frontmatter.minutesRead` during content load.  
- `src/pages/p/[...slug].astro` — now uses `post.data.minutesRead ?? calculateReadingTimeFromMarkdown(post.body)` and passes it as `minutesRead` to BlogLayout.

**Was:** Reading time was computed in the remark plugin and again in the page; the remark value was never used.

**Current:** The post page prefers `post.data.minutesRead` from the collection and only falls back to `calculateReadingTimeFromMarkdown(post.body)` when absent. Single source of truth for the post page; no duplicate computation there. Components (Chapter, PostCard, RelatedPosts, FeaturedWritingsRotator) still use `calculateReadingTimeFromMarkdown(post.body)`; they can be updated later to prefer `post.data.minutesRead` when the entry is a collection entry.

---

## 2. Structural Improvements (High Impact)

### 2.1 SearchBar fetches the full blog collection

**Location:** `src/components/SearchBar.astro` — calls `getCollection('blog', ...)` in the component.

**Issue:** SearchBar is used in Header, which is in BaseLayout. Every prerendered page that uses BaseLayout runs this component and thus `getCollection('blog')`. At 372 pages this means 372 (or 744 if two SearchBar instances) collection fetches. At 10× scale this multiplies. Astro may dedupe within a build, but the pattern is “component-level data fetch for global data,” which is fragile and unclear.

**Recommendation:**  
- Move blog (and any other) search data to a single place: e.g. a layout or a shared data module that runs once per build.  
- Pass search index (or minimal post list) into Header/SearchBar as props or via a shared build-time payload (e.g. a JSON fragment or a script tag generated once).  
- Keep SearchBar as a presentational + client-search component that receives data instead of calling `getCollection`.

---

### 2.2 Centralize category ID → name resolution

**Locations:**  
- `src/pages/p/[...slug].astro`: `categories.find((cat) => cat.id === post.data.category![0])?.name ?? ...`  
- `src/components/Chapter.astro`: local `getCategoryName(categoryIds)` doing the same.

**Issue:** Two places resolve category id → display name. Adding categories or changing logic requires edits in multiple files.

**Recommendation:**  
- Add `getCategoryName(id: string | undefined): string | null` (and optionally `getCategoryNameFromIds(ids: string[] | undefined)`) in `src/utils/categoryUtils.ts` or `src/data/categories.ts`.  
- Use it in `[...slug].astro`, Chapter.astro, and anywhere else that needs category display names.

---

### 2.3 Single implementation for relative read time

**Locations:**  
- `src/utils/relativeReadTime.ts` (server/codegen)  
- `src/utils/relativeReadTime.client.ts` (client; used by BlogLayout and Chapter)

**Issue:** Same logic in two files. Comment in one says it’s for “client-side”; the other is for server. If you change wording or rules (e.g. “yesterday” vs “1 day ago”), both must be updated.

**Recommendation:**  
- Keep one implementation (e.g. in `relativeReadTime.ts`) with pure functions.  
- For client, either: (a) import that module in a client bundle (no DOM/Node APIs), or (b) generate a small client-only wrapper that re-exports or duplicates only if the main module pulls in Node-only code. Prefer (a) so there is a single implementation.

---

### 2.4 DefaultImage runs readdirSync at build time per usage

**Location:** `src/components/DefaultImage.astro` — `readdirSync(join(process.cwd(), 'public', 'images', 'default_covers'))` in the component.

**Issue:** Every page that renders DefaultImage runs this. With many posts and cards, this is repeated filesystem access during build.

**Recommendation:**  
- Resolve default cover list once at build: e.g. in a top-level layout or in `src/data/` / a Vite plugin that exposes `defaultCoverImages: string[]`.  
- Pass the list (or a chosen URL) into DefaultImage as a prop so the component is pure and the FS read is single-purpose and cacheable.

---

### 2.5 Folder structure and coupling

**Current:** Content in `src/content/p/`, layouts in `src/layouts/`, components in `src/components/` (and `brain-science/`), data in `src/data/`, utils in `src/utils/`, config in `src/config/`.

**Assessment:** Clear and scalable. One improvement: **brain-science** is both a route segment and a component folder (`src/components/brain-science/`). If more feature areas appear, consider a convention like `src/features/brain-science/` (pages + components + utils) or keep components under `src/components/` with a strict prefix to avoid coupling other pages to “brain-science” internals.

**Recommendation:** Document the chosen convention (e.g. “feature-specific components live under `components/<feature>/` and only those pages import from them”) so new features don’t scatter or create circular deps.

---

## 3. Performance Improvements

### 3.1 Hydration and client JS

**Current:** No `client:load` / `client:visible` / `client:idle` on components. Client JS comes from:

- Inline scripts in BaseLayout (image modal, FOUC), ReadStateServiceInit (no `import.meta` in inline script; uses `define:vars` for dev flag), BlogLayout (read-status/relative time; script is a module, reads `postSlug` from DOM), Chapter (read state + progress), PerformanceMonitor, etc.
- `relativeReadTime.client.ts` imported in BlogLayout and Chapter (bundled).
- SearchBar (script bundled; build shows ~9.43 kB for `SearchBar.astro_astro_type_script_index_0_lang.*.js`).

**Assessment:** Static-first is good. Client JS is confined to features that need it (search, read state, theme, image modal). No unnecessary islands.

**Recommendations:**  
- Lazy-load or conditionally load PerformanceMonitor (e.g. only in dev or behind a flag) so production does not pay for CWV collection if you don’t use it.  
- Ensure SearchBar script is loaded only when the search UI is visible (e.g. when the user opens the search panel) if the bundle size becomes a concern.

---

### 3.2 Brain-science and NLP at build time

**Observation:** `brain-science/meta.astro` took ~28s in the sampled build; other brain-science pages also run compromise/sentiment and heavy analysis. `manualChunks` already isolates `vendor-nlp` and `brain-science`; the cost is build time and memory, not client bundle.

**Recommendations:**  
- Consider caching: e.g. write computed metrics to `src/content/.brain-science-cache/` or a similar JSON artifact and reuse across builds until content or config changes.  
- If you add more NLP or analytics pages, move to a “compute once, consume everywhere” pipeline (e.g. a script that runs after content sync and writes JSON; pages read JSON only).

---

### 3.3 Image handling

**Current:** Sharp via `astro/assets`; `DefaultImage` uses plain `<img>` with `sizes` and `loading`/`fetchpriority`. Hero in BlogLayout uses raw `<img>` or DefaultImage, not `<Image>`.

**Recommendations:**  
- Use Astro’s `<Image>` (or the same image pipeline) for hero images in BlogLayout when `heroImage` is set, so you get srcset and optimized formats.  
- Keep DefaultImage as-is for the random default covers, but ensure default images are optimized (e.g. pre-generated sizes/AVIF) so that non-Image usage is still fast.

---

### 3.4 Build output

**Observation:** Client chunks are small (vendor ~3 kB, SearchBar ~9.4 kB). Empty chunks for PerformanceMonitor and ServiceWorkerRegistration are expected (inline scripts). No obvious bloat.

**Recommendation:** Keep `manualChunks` and `optimizeDeps`; consider adding a `build.rollupOptions.output.assetFileNames` pattern for clearer cache busting if you add more assets.

---

## 4. Cleanup / Hygiene Tasks

### 4.1 Dependencies

| Package        | Current use | Recommendation |
|----------------|------------|-----------------|
| **js-yaml**    | Only in `scripts/` (e.g. `standardize-frontmatter.js`, `scripts/utils/frontmatter.js`). Not used in app runtime. | Move to **devDependencies**. |
| **compromise** | brain-science pages + `utils/brainScience/metaAnalysis.ts`. | Keep in dependencies; already in vendor-nlp chunk. |
| **sentiment**  | brain-science (insights, metaAnalysis, metrics). | Keep; same as above. |
| **reading-time** | remark plugin + `utils/readingTime.ts` (and indirectly in many components). | Keep. |
| **mdast-util-to-string** | remark-reading-time only. | Keep. |
| **date-fns**   | Used in layouts and brain-science. | Keep. |
| **sharp**      | Astro image service. | Keep. |

**Unused in app code:** None clearly unused. `@astrojs/vercel` is required for the adapter; `@vercel/analytics` and `@vercel/speed-insights` are used in BaseLayout.

**Heavy packages:** compromise and sentiment are large but only used at build time for brain-science; they don’t affect client bundle. No change needed for production JS.

---

### 4.2 TypeScript and `any`

**Current:** `strict: true`, `strictNullChecks: true` in tsconfig. Good. `Window.ReadStateService` is declared in `src/env.d.ts` for client scripts that use the read-state singleton.

**`any` usage:**  
- `types/layout.ts`: `posts?: any[]`, `currentPost?: any`, `allPosts?: any[]` — replace with `CollectionEntry<'blog'>[]` and `CollectionEntry<'blog'>` where appropriate.  
- `SearchBar.astro`, `guided-path.astro`, `StructuredData.astro`, `structuredData.ts`, `localStorageFeatures.ts`, etc. — many `any` types for events, schemas, and storage.  

**Recommendation:** Replace layout and collection-related `any` with proper types first (biggest maintainability win). Then gradually tighten StructuredData, SearchBar result types, and storage/event types.

---

### 4.3 Linting and formatting

**Current:** Prettier (with `prettier-plugin-astro`, `prettier-plugin-tailwindcss`). No ESLint config found.

**Recommendation:** Add ESLint (e.g. `eslint-plugin-astro`, TypeScript ESLint) with rules for consistent imports, no unused vars, and Astro best practices. Run in CI so new code stays consistent.

---

### 4.4 Content schema and categories

**Current:** `content.config.ts` builds `validCategoryIds` from `src/data/categories`. Schema uses `z.enum(validCategoryIds as [string, ...string[]])` for `category`. Single source of truth for category IDs.

**Recommendation:** Keep this pattern. If you add a new category, add it in `data/categories` only; the schema stays in sync. Optional: add a short comment in `content.config.ts` that category enum is derived from `data/categories`.

---

### 4.5 Sitemap

**Current:** `src/pages/sitemap.xml.astro` returns a 301 redirect to `/sitemap-index.xml`. `@astrojs/sitemap` generates `sitemap-index.xml` and `sitemap-0.xml` in `dist/`.

**Recommendation:** Ensure your deployment serves `/sitemap.xml` (the redirect) and that `/sitemap-index.xml` is reachable. No structural change needed.

---

## 5. Styling Audit

**Methodology:** Tailwind with `@layer base/components/utilities`; design tokens in `global.css` (CSS vars for colors, animation, typography). `tailwind.config.js` extends with same tokens and typography plugin.

**Findings:**  
- No global leakage observed; theme uses class or data attributes.  
- Duplication: color and timing values exist in both `global.css` and `tailwind.config.js` (e.g. primary/accent/highlight scales). Acceptable for Tailwind integration; document that theme edits may need to touch both.  
- `.prose * { max-width: 100% !important; }` is broad; keep only if you’ve verified it doesn’t break components.  
- Image modal and `.a-poem` are in global.css; consider moving to a component-scoped style or a small “overrides” file to keep global.css for tokens and base only.

**Fonts (current):** `src/styles/fonts.css` defines only Open Sans locally (woff2). Lora and Source Serif Pro have no local `@font-face`; they are loaded solely via the Google Fonts stylesheet in BaseHead.astro to avoid 404s when gstatic URLs change.

**Recommendation:** Optional: add a one-line comment at the top of `global.css` listing which files define theme tokens (e.g. `global.css`, `tailwind.config.js`) so future edits don’t miss one.

---

## 6. Build & Tooling

**Astro config:**  
- Integrations: MDX, sitemap, Tailwind — all justified.  
- Prefetch: `prefetchAll: false`, `defaultStrategy: 'hover'` — good.  
- Image: Sharp, `inlineStylesheets: 'auto'`, Vite `manualChunks` and terser — good.  
- `vite.optimizeDeps.include` lists MDX, date-fns, reading-time, compromise, sentiment — fine for dev.

**Testing:** No test runner or tests found. For a blog, optional; if you add forms or critical client logic, add Vitest or similar and run in CI.

**CI:** Recommend running in CI: `pnpm run build`, `pnpm run format:check`, and (once added) `eslint .` and `astro check` if you use `@astrojs/check`.

---

## 7. Optional Enhancements (Low Priority)

- **RSS/JSON feed:** `feed.json.js` and `rss.xml.js` use `post.body`; ensure they don’t expose raw markdown if you want HTML only (or intentionally expose markdown).  
- **404 and test-theme:** Keep or remove `test-theme.astro` from production routes if it’s only for local dev.  
- **Documentation:** `docs/performance-optimization.md` exists; add a short “Architecture” section (e.g. in README or `docs/ARCHITECTURE.md`) describing layout hierarchy, where data is loaded (layout vs page vs component), and the read-state / search data flow so future contributors know the intended patterns.

---

## 8. Refactoring Roadmap (Ordered by Leverage)

1. ~~**Fix TOC**~~ — **Done.** Markdown heading regex in `[...slug].astro`; TOC wired into structured data.
2. ~~**Unify storage constants**~~ — **Done.** Constants injected via `define:vars` from `config/storage.ts` into ReadStateServiceInit.astro.
3. ~~**Use remark `minutesRead` in post page**~~ — **Done.** `[...slug].astro` uses `post.data.minutesRead ?? calculateReadingTimeFromMarkdown(post.body)`.
4. ~~**Centralize category name resolution**~~ — **Done.** `getCategoryName` and `getCategoryNameFromIds` in `src/utils/categoryUtils.ts`; used in [...slug].astro and Chapter.astro.
5. ~~**Move search data out of SearchBar**~~ — **Done.** `getSearchData()` in `src/data/searchIndex.ts`; BaseLayout fetches once and passes to Header → SearchBar as `searchData` prop.
6. ~~**Single relative-read-time implementation**~~ — **Done.** One shared module (`relativeReadTime.ts`) with client wrapper re-exporting the same functions.
7. ~~**DefaultImage: resolve default covers once**~~ — **Done.** `getDefaultCoverUrls()` in `src/data/defaultCovers.ts`; DefaultImage imports it so readdirSync runs once per build.
8. **Replace layout `any` types** — Use `CollectionEntry<'blog'>` and typed arrays for posts/currentPost/allPosts.
9. **Add ESLint + CI** — Format check + lint + `astro check` in CI.
10. **Optional: cache brain-science metrics** — Persist NLP results between builds to reduce rebuild time.

---

## Summary Table

| Area                | Severity   | Status | Action |
|---------------------|-----------|--------|--------|
| TOC bug             | Critical  | Done   | Markdown heading extraction; TOC wired to structured data |
| Storage constants   | Critical  | Done   | Single source; injected via define:vars |
| Reading time        | High      | Done   | Use remark `minutesRead`; fallback in [...slug].astro only when absent |
| SearchBar data      | High      | Done   | getSearchData() in layout; pass to SearchBar as props |
| Category name       | Medium    | Done   | Centralized in categoryUtils; used in [...slug], Chapter |
| relativeReadTime    | Medium    | Done   | Single implementation shared between server and client |
| DefaultImage FS     | Medium    | Done   | getDefaultCoverUrls() in data layer; DefaultImage uses it |
| TypeScript `any`    | Medium    | Open   | Tighten layout and collection types |
| ESLint/CI           | Low       | Open   | Add and run in CI |
| Brain-science cache| Low       | Open   | Optional build-time cache |

**Other changes reflected:** Fonts (Lora, Source Serif Pro) no longer have local @font-face; client script fixes (ReadStateServiceInit, BlogLayout module); `Window.ReadStateService` typed in env.d.ts.

This audit should be re-run after major refactors or when doubling content or adding new feature areas.
