# Notes

[![Version](https://img.shields.io/github/package-json/v/antoniwan/notes)](https://github.com/antoniwan/notes/releases)

Field notes from a life being lived: essays, household recipes, and the books on the shelf. Fatherhood, cooking, culture, work. English and Spanish, with links between twins.

This is not a magazine. It is not a recipe site with a blog attached. One public notebook. Essays and recipes share the same collection. Recipes live under `/p/recipes/` and list on the Cookbook.

Live site: [notes.antoniwan.online](https://notes.antoniwan.online)

Release history: [CHANGELOG.md](./CHANGELOG.md)

## What a reader sees

- **Writing** — essays and notes in `src/content/p/` (Markdown and MDX)
- **Cookbook** — `/recipes` is a plate grid plus A–Z contents. Recipes ship at `/p/recipes/<slug>`. English listed; Spanish via the dish toggle; an ES chip marks plates that have a Spanish twin
- **Children’s books** — `/books`, two picture books he wrote, each opening in its own bilingual (English/Español) reader
- **Book library** — books he has read, at `/library/books`. `/library` alone 301s there
- **Paths in** — Guided Path (seasonal order, progress in the browser only), Everything (English archive), Categories, Topics (the tag index, read as an idea map for browsing subjects), header search. The main nav groups these under **Browse** (Topics, Categories) and **Collections** (Children’s books, Cookbook, Book library)
- **Home** — a hero ("I write to live it"), three entry links (Start here → Guided Path, Browse topics, Everything), Highlights masonry for `featured` English posts, a Children’s books teaser, and a short "why this space exists" note
- **Writing Insights** (`/writing-insights`) — cadence, topics, lexicon. `/brain-science` is the origin note; old dashboard subpaths 301
- **Feeds** — RSS (`/rss.xml`) and JSON Feed (`/feed.json`). Spanish stays out of feeds, same as listings
- **Quotes API** — `GET /api/quotes` (Stoic excerpts, other philosophy, lines from posts; optional `?kind=`)

English is the listing language. Spanish is a twin: language toggle, title search, SEO, direct URL. Not a second card stream. Details: [docs/multilingual-setup.md](docs/multilingual-setup.md).

## How it is built

- **10 categories** (for example On Parenting; Psychology, Roughly; On Politics; Metaspace; DIY & Creation) — essays only; household recipes list on the Cookbook and Everything. See `src/data/categories.ts`
- **Tags** — idea map for readers (essays only; household recipes list on the Cookbook and Everything); **Tag management** is an author overview (noindex). Tags describe content, not the site name
- **Dark and light theme**, including system preference
- **Responsive layout** for small and large screens
- **Reading time** — remark plugin (`minutesRead`). Hidden on recipe cards and dish pages
- **Reading progress** on posts — `localStorage` only, no server
- **Table of contents on long posts** — floating contents control
- **Schema.org JSON-LD** where it fits the page type
- **Comments** — optional [Remark42](https://remark42.com/) when env vars are set (see `docs/comments-setup.md`)
- **Service worker** — registration URL includes the **package version** from `package.json`
- On **Vercel**: **Web Analytics** and **Speed Insights** in the base layout (they only send data when those products are enabled)

## Stack

- [Astro](https://astro.build/) 7 — hybrid output (static pages + on-demand `GET /api/quotes`), MDX, `@astrojs/vercel` adapter
- TypeScript
- Tailwind CSS
- [Sharp](https://sharp.pixelplumbing.com/) — used by the social-image step to resize AVIF sources to JPEG/PNG

## Toolchain

| Tool    | Version               | Source of truth                            |
| ------- | --------------------- | ------------------------------------------ |
| Node.js | 22.12.0 (`>=22.12.0`) | `.nvmrc`, `engines.node` in `package.json` |
| pnpm    | 12.3.4                | `packageManager` in `package.json`         |

CI reads both from those files — `actions/setup-node` uses `node-version-file: .nvmrc`
and `pnpm/action-setup` uses the `packageManager` field — so there is no separate
version to keep in sync in `.github/workflows/ci.yml`.

Locally, `corepack enable` makes `pnpm` in this directory resolve to the pinned
version. Without corepack, install pnpm 12 yourself; older majors may not
understand every key in `pnpm-workspace.yaml`.

`pnpm-workspace.yaml` also carries dependency `overrides` (tar, minimatch,
fast-xml-parser, ajv, rollup, devalue). They are deliberate pins, not leftovers —
review them against a fresh advisory check before changing or removing any.

## Quick start

```bash
git clone https://github.com/antoniwan/notes.git
cd notes
corepack enable
pnpm install --frozen-lockfile
pnpm run dev
```

Then open `http://localhost:4321`.

`--frozen-lockfile` is what CI runs; use it locally too unless you are
deliberately changing dependencies. This repo expects **pnpm**; you can use npm
or yarn if you change commands yourself.

## Environment variables (optional)

For production builds of the **About** page, Letterboxd “latest watched” needs RSS URLs. Copy `.env.example` to `.env.local` and set:

- `LETTERBOXD_PROFILE_URL`
- `LETTERBOXD_RSS_URL`

If they are missing, that block on About simply won’t have fresh data (or may be empty depending on fallbacks).

Remark42 uses `PUBLIC_REMARK42_HOST` and `PUBLIC_REMARK42_SITE_ID` when you turn comments on — see `docs/comments-setup.md`. A third variable, `REMARK42_UPSTREAM_ORIGIN`, is the upstream Remark42 origin; Vercel can't interpolate env vars into `vercel.json`, so after changing it, run `pnpm run sync-remark42-rewrite` and commit the updated `vercel.json` (CI verifies this with `pnpm run check-remark42-rewrite`). All three are listed in `.env.example`.

## Scripts

| Command                               | What it does                                                                                  |
| ------------------------------------- | --------------------------------------------------------------------------------------------- |
| `pnpm run dev`                        | Dev server                                                                                    |
| `pnpm run build`                      | Builds social JPG/PNG from AVIF (skipped when fingerprints + files match), then `astro build` |
| `pnpm run preview`                    | Serves prerendered `dist/client` on :4321 (no Vercel CLI needed; see caveat below)            |
| `pnpm run preview:vercel`             | `astro preview` — needs the Vercel CLI installed                                              |
| `pnpm test`                           | Vitest unit tests (publish filters, SEO routing, feed HTML, quotes helpers)                   |
| `pnpm run test:watch`                 | Vitest in watch mode                                                                          |
| `pnpm run test:browser`               | Browser regression journeys against `dist/client` (build first; see below)                    |
| `pnpm changelog:since`                | Commits + file groups since the previous version (for CHANGELOG drafts)                       |
| `pnpm run check`                      | `astro check` (TypeScript / Astro diagnostics)                                                |
| `pnpm run lint`                       | ESLint                                                                                        |
| `pnpm run lint:fix`                   | ESLint with `--fix`                                                                           |
| `pnpm run format`                     | Prettier write                                                                                |
| `pnpm run format:check`               | Prettier check (CI verifier; does not rewrite files)                                          |
| `pnpm run audit-frontmatter`          | Required-field / language sanity check on `src/content/p`                                     |
| `pnpm run validate-feeds`             | Validates `dist/rss.xml` + `dist/feed.json` (run after build)                                 |
| `pnpm run validate-structured-data`   | Smoke-checks structured-data module exports (source only)                                     |
| `pnpm run validate-generated-content` | Parses the built site: JSON-LD, RSS XML, feed ids, canonicals, local assets, drafts           |
| `pnpm run generate-social-images`     | AVIF → JPEG/PNG under `public/social/` only (same logic as the start of `pnpm run build`)     |
| `pnpm run generate-favicons`          | Favicon assets                                                                                |
| `pnpm run sync-remark42-rewrite`      | Regenerates the Remark42 rewrite in `vercel.json` from `REMARK42_UPSTREAM_ORIGIN`             |
| `pnpm run check-remark42-rewrite`     | CI check that `vercel.json`'s Remark42 rewrite matches `REMARK42_UPSTREAM_ORIGIN`             |
| `pnpm run lighthouse`                 | Lighthouse HTML report against `dist/`; starts and stops its own preview server               |
| `pnpm run audit-performance`          | Same, performance category only, JSON output                                                  |

CI’s format step **checks**; it does not rewrite or open a follow-up commit. After `pnpm install`, a pre-commit hook runs Prettier on staged files so commits already match that check.

### Generated content contracts

`pnpm run validate-generated-content` runs after a build and parses the emitted
bytes rather than the source:

- every representative surface's JSON-LD parses and carries `@context` / `@type`
- `rss.xml` is well-formed XML by a real parser — a substring check passes on an
  unescaped `&` or an unbalanced tag, which are the faults that break readers
- feed ids are unique, and RSS and JSON Feed carry the same posts
- canonical URL, feed entry URL, and JSON-LD identity agree
- site-local `og:image` targets and internal links resolve to real files
- drafts, `published: false`, and future-dated posts appear nowhere; public
  English posts appear everywhere they should; Spanish twins stay out of feeds

Surfaces covered: homepage, `/everything`, `/writing-insights`, an English essay,
a Spanish twin, and a recipe. External URLs are never fetched — a release must
not fail because someone else's site is down. Remote link health, if wanted, is a
separate optional report.

The rules live in `scripts/lib/generated-content-checks.mjs` as pure functions
with unit tests in `pnpm test`, because the repo has no draft or future-dated
post to exercise them against.

### Offline behaviour

`public/sw.js` makes one promise: **everything you have already opened stays
readable offline** — article pages, their images, the browse pages you navigated
through, and the site's CSS, JS, and fonts. Anything never opened is not
available offline, and `/offline.html` says so.

It does not pre-download the site. Measured on this build, reader-facing output
is about 118 MB: 25.9 MB of article HTML across 129 posts (~205 KB per page),
67.3 MB of images, and ~24 MB of listing pages. Precaching that on a first visit
would cost more data than most phone plans enjoy and be re-fetched on every
deploy. Caching as you read reaches the same practical result for a few hundred
KB per article.

Never cached: `/api/*` (quotes, the Remark42 proxy) is network-only, `/social/*`
(30.3 MB of Open Graph cards a reader never displays) is skipped entirely, and
cross-origin requests are left alone.

Caches are named `notes-<kind>-v<version>`, and an upgrade deletes only caches
carrying that prefix, so a cache belonging to anything else on the origin
survives. Page, asset, and image caches have entry ceilings (120/120/250),
trimmed FIFO. `pnpm run test:browser` covers activation, upgrade, the offline
journeys, and what must never be stored.

### Browser regression journeys

`pnpm run test:browser` drives headless Chromium over the real build output —
lightbox keyboard journey, search announcements and rapid clear, carousel pause
including reduced motion, mobile navigation focus return, theme persistence, and
EN/ES routing — at 390, 768, and 1440 pixels.

It needs a completed `pnpm run build` and does not build for you: building inside
the test run would make a failure ambiguous between the build and the behavior.
First run also needs the browser binary:

```bash
pnpm exec playwright install chromium
```

These use the `playwright` library through Vitest rather than `@playwright/test`,
so the repo keeps one test runner. They are a separate command from `pnpm test`
so the unit suite stays fast. Service workers are blocked in the test context —
offline behavior needs its own suite with explicit lifecycle steps.

### Previewing and measuring a build locally

`pnpm run preview` serves `dist/client` from `scripts/serve-dist.mjs`. It shows the
prerendered pages and assets; it does **not** serve the on-demand `/api/quotes`
route or apply any `vercel.json` redirect, rewrite, header, or compression rule.
Verify host behavior against a deployment URL, not against this server.

`astro preview` (`pnpm run preview:vercel`) is delegated to the Vercel CLI by
`@astrojs/vercel`. Without that CLI installed it fails with "Preview server
process exited before becoming ready", which is why it is no longer the default
`preview` script.

`pnpm run lighthouse` and `pnpm run audit-performance` start and stop that same
static server themselves, so run `pnpm run build` first and nothing else. Reports
land in `reports/` (gitignored). They measure localhost over plain HTTP — useful
as a before/after baseline, not as field performance.

## Build (social images)

`pnpm run build` runs `scripts/generate-social-images.js` before `astro build`.

Hero images are stored as AVIF under `public/`. Many preview surfaces still expect JPEG, so the script writes **1200×630** cover-cropped JPEGs under `public/social/` (names end with `-social.jpg`). The mapping lives in `src/data/socialImageManifest.ts`. Posts without a `heroImage` share `/social/images/default-social.jpg`.

Each AVIF is hashed (SHA-256). If the hash matches `src/data/socialImageFingerprints.json` and the output file is on disk, that file is skipped. After adding or changing AVIFs, run `pnpm run build` or `pnpm run generate-social-images` and commit the updated manifest, fingerprints, and any new files under `public/social/`.

CI restores `public/social/` from cache when possible (see `.github/workflows/ci.yml`). Timing depends on how many images need encoding; routine builds with everything already up to date stay short.

## Project layout

```text
notes/
├── public/              # Static assets; generated social JPEG/PNG live under public/social/
├── scripts/             # generate-social-images.js, generate-favicons.js
├── src/
│   ├── components/      # Astro components (shared + feature folders like brain-science/)
│   ├── config/          # Comments, storage, assets
│   ├── content/p/       # Essays and notes (Markdown / MDX)
│   │   └── recipes/    # Household recipes → /p/recipes/<slug>
│   ├── data/            # Categories, navigation, socialImageManifest.ts, socialImageFingerprints.json, …
│   ├── layouts/
│   ├── pages/           # Routes (books, category, library, tag, writing-insights, api, …)
│   │   ├── books.astro          # Children's books (/books)
│   │   ├── library/books.astro  # Book library (/library/books)
│   │   └── recipes.astro        # Cookbook (/recipes)
│   ├── styles/
│   ├── utils/
│   └── types/
├── docs/                # Longer how-tos and specs
└── astro.config.mjs
```

Feature-specific components live under `src/components/<feature>/` when they are only used by matching routes. Shared pieces sit at the top level of `src/components/`.

## Content

One collection (`blog` in `src/content.config.ts`). Folder is the discriminator, not a `kind` field:

| Path                              | Public URL          | Listing                                                                                    |
| --------------------------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| `src/content/p/<slug>.md`         | `/p/<slug>`         | Everything, categories, tags, home Highlights, Guided Path, feeds                          |
| `src/content/p/recipes/<slug>.md` | `/p/recipes/<slug>` | Cookbook (`/recipes`). Cards say Recipe / Receta. More Recipes instead of Continue reading |

Frontmatter: [docs/frontmatter-spec.md](docs/frontmatter-spec.md).
Tags: [docs/tag-policy.md](docs/tag-policy.md) and [docs/tag-vocabulary.md](docs/tag-vocabulary.md).

Translations: same `translationGroup` on each language version. Spanish stays off English listings; English cards show an ES marker when a twin exists. Details: [docs/multilingual-setup.md](docs/multilingual-setup.md).

Using Cursor AI in this repo: [docs/cursor-agent-skills.md](docs/cursor-agent-skills.md).

## Documentation in `docs/`

| File                                                                                | Topic                                            |
| ----------------------------------------------------------------------------------- | ------------------------------------------------ |
| [frontmatter-spec.md](docs/frontmatter-spec.md)                                     | Post frontmatter                                 |
| [tag-policy.md](docs/tag-policy.md)                                                 | Signal-first tag policy                          |
| [tag-vocabulary.md](docs/tag-vocabulary.md)                                         | Canonical vocabulary                             |
| [tag-cleanup-assessment-2026-04-10.md](docs/tag-cleanup-assessment-2026-04-10.md)   | Tag cleanup audit (Apr 2026)                     |
| [tag-vocabulary-migration-v1.md](docs/tag-vocabulary-migration-v1.md)               | Tag vocabulary migration, v1 notes               |
| [tag-system-cleanup-2026-09.md](docs/tag-system-cleanup-2026-09.md)                 | Tag system cleanup, continuity report (Sep 2026) |
| [multilingual-setup.md](docs/multilingual-setup.md)                                 | EN/ES linking                                    |
| [comments-setup.md](docs/comments-setup.md)                                         | Remark42                                         |
| [quotes-api.md](docs/quotes-api.md)                                                 | `/api/quotes`                                    |
| [structured-data-optimization.md](docs/structured-data-optimization.md)             | Schema.org                                       |
| [performance-optimization.md](docs/performance-optimization.md)                     | Performance notes                                |
| [seo-routing-cleanup-2026-09.md](docs/seo-routing-cleanup-2026-09.md)               | SEO and routing cleanup task notes (Sep 2026)    |
| [brain-science.md](docs/brain-science.md)                                           | Writing Insights audit and execution map         |
| [article-reading-ui-audit-2026-09.md](docs/article-reading-ui-audit-2026-09.md)     | Article reading UI audit (Sep 2026)              |
| [homepage-audit-owner-brief-2026-09.md](docs/homepage-audit-owner-brief-2026-09.md) | Homepage audit, owner-as-client brief (Sep 2026) |
| [roadmap.md](docs/roadmap.md)                                                       | Ideas, product audit, technical roadmap          |
| [TECHNICAL-AUDIT.md](docs/TECHNICAL-AUDIT.md)                                       | System map, integrations, technical debt         |
| [cursor-agent-skills.md](docs/cursor-agent-skills.md)                               | Cursor agent skill guide                         |
| [midjourney-og-image-prompts.md](docs/midjourney-og-image-prompts.md)               | Image prompt notes                               |

## Private generated materials

Generated planning/audit reports in `docs/materials/` are intentionally local-only and private. The folder is gitignored (except `docs/materials/.gitkeep`) so these files are not committed or published from this repository.

## License

- **Content**: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — [CONTENT_LICENSE.md](CONTENT_LICENSE.md)
- **Code**: [MIT](LICENSE)
