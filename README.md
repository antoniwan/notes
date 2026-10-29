# Notes

[![Version](https://img.shields.io/github/package-json/v/antoniwan/notes)](https://github.com/antoniwan/notes/releases)

Field notes from a life being lived: essays, fatherhood, cooking, culture, work, and the books on the shelf. English and Spanish, with links between twins.

This is not a magazine. It is a public notebook, for reading and for searching for something to read. Its navigation is Browse, Archive, Field Guide, and About, with search in the header.

Live site: [notes.antoniwan.online](https://notes.antoniwan.online) · Release history: [CHANGELOG.md](./CHANGELOG.md) · Design rules: [docs/design-system.md](docs/design-system.md) · Agent rules: [CLAUDE.md](CLAUDE.md)

**Moved off Notes in October 2026.** Family recipes live at [Cookbook](https://cookbook.antoniwan.online/) (routes, checks, and recovery: [Cookbook cutover guide](docs/cookbook-cutover.md); recipe source files stay as records, outside the build). The reading library lives at antoniwan.online/collections/books, authored books in its Projects section, and the movie diary at antoniwan.online/collections/movies. None of them appear in Notes' navigation or search.

## What a reader sees

- **Writing** — essays and notes in `src/content/p/` (Markdown and MDX)
- **Cookbook** — family recipes live at `cookbook.antoniwan.online`. `/recipes` and the old recipe pages redirect there, including Spanish and Markdown URLs
- **Authored books** — `/books` redirects to Projects on `antoniwan.online`.
- **Reading library** — `/library` and `/library/books` redirect to `antoniwan.online/collections/books`.
- **Paths in** — **Browse** (`/browse`: one search over every word of the English writing; the "Ways into the writing" sentences, whose topic words show that topic's writings in place: four pinned sentences first (`PRELUDE_NOW`), the rest ranked by recent writing, quiet ones last; and every topic A–Z, folded under the box), **Archive** (`/archive`: every note, newest first), About, and header search. A topic or category page (`/tag/<topic>`, `/category/<id>`) links back to Browse. `/everything`, `/tag`, `/category`, and the removed `/guided-path` 301 to Archive or Browse; `/search` goes to Browse. Enter in the header search opens Browse with that search.
- **Field Guide** — `/field-guide` (Spanish: `/es/guia-de-campo`): short entries on Concepts (an A–Z dictionary), Values, and Beliefs (grouped by topic), revised in place instead of dated. One hand-written file per language in `src/content/concepts`, `values`, and `beliefs`. See [docs/field-guide.md](docs/field-guide.md).
- **Home** — a writing hero with two ways in (Browse, then Archive), Highlights, and a short purpose note. Highlights are the public English posts marked `featured: true` (`src/utils/highlights.ts`); there are about twenty, picked by hand.
- **Poems** — a poem is a `<pre class="a-poem">` block in a post; its page gets the Pond, Tide, and Lantern effects, loaded only there.
- **Writing Insights** was removed on October 20, 2026; it was not for readers. `/writing-insights`, `/brain-science`, and their old subpaths 301 to the home page.
- **Feeds** — RSS (`/rss.xml`) and JSON Feed (`/feed.json`), English only. Spanish has its own RSS feed at `/es/rss.xml`
- **En español** — `/es` lists every Spanish piece, twins included, newest first
- **Series** — posts with `series: <id>` (ids in `src/data/series.ts`) get "Part N of M" links and a page at `/series/<id>`; `seriesOrder` overrides date order
- **Quotes API** — `GET /api/quotes` (Stoic excerpts, other philosophy, lines from posts; optional `?kind=`). The 404 page no longer calls it: it picks from the same pool, baked into the page

English is the listing language. Spanish is Puerto Rican Spanish (`es_PR`, never `es_ES`). Spanish is a twin: language toggle, title search, SEO, direct URL, and the `/es` index with its own feed. Not a second card stream on English pages. Details: [docs/multilingual-setup.md](docs/multilingual-setup.md).

## How it is built

- **10 categories** (for example On parenting; Psychology, roughly; On politics; Notes on the notes; Do it yourself / DIY) — essays only. Household recipes live on Cookbook. See `src/data/categories.ts`
- **Tags** — idea map for readers (essays only). Tags describe content, not the site name
- **Dark and light theme**, including system preference
- **Responsive layout** for small and large screens
- **Reading time** — remark plugin (`minutesRead`)
- **Reading progress** on posts — `localStorage` only, no server
- **Table of contents on long posts** — floating contents control
- **Schema.org JSON-LD** where it fits the page type
- **Comments** — optional [Remark42](https://remark42.com/) when env vars are set (see `docs/comments-setup.md`)
- **No service worker** — `public/sw.js` only unregisters the old one (see below)
- On **Vercel**: **Web Analytics** and **Speed Insights** in the base layout (they only send data when those products are enabled)
- **Stats** — Antonio's self-hosted Umami, shared with his other sites, when `PUBLIC_UMAMI_HOST` and `PUBLIC_UMAMI_WEBSITE_ID` are set (see `docs/analytics.md`)

## Design rules

The look lives in `src/styles/global.css` (tokens) and `tailwind.config.js` (the type scale); [docs/design-system.md](docs/design-system.md) explains them and lists the settled choices (purple chrome, gold only inside the Field Guide, fonts, figure widths, poem effects, titles, 4.5:1 contrast). `pnpm run lint:tokens` checks the layout rules in CI, against an all-zero baseline (`scripts/lint-tokens.baseline.json`):

- **The layout sets the width.** A block does not cap its own width. Running text stops at `--measure` (45rem); display headings at `--measure-title`.
- **One 4px rhythm.** Named line-height steps, spacing on the 4px scale, fluid values wrapped in `round(nearest, …, 4px)`.
- **Fixed things name a token** (`--size-*`, `--figure-*`), and Home sits on one twelve-column grid (`--grid-gap`).

Page titles are `Title · Notes` (`Title · Field Guide` in the guide), with the bare title for share previews; the full name never appears in a title.

## Stack

- [Astro](https://astro.build/) 7 — hybrid output (static pages + on-demand `GET /api/quotes`), MDX, `@astrojs/vercel` adapter
- TypeScript
- Tailwind CSS
- [Sharp](https://sharp.pixelplumbing.com/) — used by the social-image step to resize AVIF sources to JPEG/PNG

## Toolchain

| Tool    | Version          | Source of truth                            |
| ------- | ---------------- | ------------------------------------------ |
| Node.js | 22.23.4 (`22.x`) | `.nvmrc`, `engines.node` in `package.json` |
| pnpm    | 12.3.4           | `packageManager` in `package.json`         |

CI reads both from those files — `actions/setup-node` uses `node-version-file: .nvmrc`
and `pnpm/action-setup` uses the `packageManager` field — so there is no separate
version to keep in sync in `.github/workflows/ci.yml`.

`engines.node` is capped to a single major on purpose. **Vercel reads
`engines.node` and it overrides the Node version in Project Settings**, so an
open range such as `>=22.12.0` silently promotes production to the newest major
Node — and keeps doing so as new ones ship. `22.x` keeps production, CI, and
`.nvmrc` on the same major.

pnpm does not enforce `engines` unless `engine-strict` is set, so a newer local
Node still installs and runs. It is not the tested target, though: run `nvm use`
in this directory to pick up `.nvmrc` before trusting a local result.

Locally, `corepack enable` makes `pnpm` in this directory resolve to the pinned
version. Without corepack, install pnpm 12 yourself; older majors may not
understand every key in `pnpm-workspace.yaml`.

`pnpm-workspace.yaml` carries two dependency overrides, each scoped to the
single parent that needs it: `@vercel/routing-utils` pins a `path-to-regexp`,
and `@tailwindcss/typography` pins a `postcss-selector-parser`, each with an
open advisory. The second crosses a major (6 to 7), so it was checked by
building the site under both and comparing the CSS: byte-identical. Keep them
that narrow. An exact, unscoped override keeps holding a
package at that version after its own security fixes ship, which is how this
file once pinned three vulnerable versions. If an advisory needs an override,
scope it to the parent, give it a range (`^`) rather than an exact version, say
why in a comment, and remove it once the parent resolves a patched release
unaided — `pnpm audit` is the check.

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

Remark42 uses `PUBLIC_REMARK42_HOST` and `PUBLIC_REMARK42_SITE_ID` when you turn comments on — see `docs/comments-setup.md`. A third variable, `REMARK42_UPSTREAM_ORIGIN`, is the upstream Remark42 origin; Vercel can't interpolate env vars into `vercel.json`, so after changing it, run `pnpm run sync-remark42-rewrite` and commit the updated `vercel.json` (CI verifies this with `pnpm run check-remark42-rewrite`). All three are listed in `.env.example`.

## Scripts

| Command                               | What it does                                                                                       |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `pnpm run dev`                        | Dev server                                                                                         |
| `pnpm run build`                      | Builds social JPG/PNG from AVIF (skipped when fingerprints + files match), then `astro build`      |
| `pnpm run preview`                    | Serves prerendered `dist/client` on :4321 (no Vercel CLI needed; see caveat below)                 |
| `pnpm run preview:vercel`             | `astro preview` — needs the Vercel CLI installed                                                   |
| `pnpm test`                           | Vitest unit tests (publish filters, SEO routing, feed HTML, quotes helpers)                        |
| `pnpm run test:watch`                 | Vitest in watch mode                                                                               |
| `pnpm run test:browser`               | Browser regression journeys against `dist/client` (build first; see below)                         |
| `pnpm changelog:since`                | Commits + file groups since the previous version (for CHANGELOG drafts)                            |
| `pnpm run check`                      | `astro check` (TypeScript / Astro diagnostics)                                                     |
| `pnpm run lint`                       | ESLint                                                                                             |
| `pnpm run lint:fix`                   | ESLint with `--fix`                                                                                |
| `pnpm run lint:tokens`                | Rhythm and width tokens: fails if raw line heights, off-grid spacing, or stray widths grow         |
| `pnpm run format`                     | Prettier write                                                                                     |
| `pnpm run format:check`               | Prettier check (CI verifier; does not rewrite files)                                               |
| `pnpm run audit-frontmatter`          | Required-field / language sanity check on `src/content/p`                                          |
| `pnpm run validate-feeds`             | Validates `dist/rss.xml` + `dist/feed.json` (run after build)                                      |
| `pnpm run validate-structured-data`   | Smoke-checks structured-data module exports (source only)                                          |
| `pnpm run validate-generated-content` | Parses the built site: JSON-LD, RSS XML, feed ids, canonicals, local assets, drafts                |
| `pnpm run generate-social-images`     | AVIF → JPEG/PNG under `public/social/` only (same logic as the start of `pnpm run build`)          |
| `pnpm run generate-favicons`          | Favicon assets                                                                                     |
| `pnpm run check-image-sizes`          | Fails on new images over 1 MB (baseline in `scripts/check-image-sizes.baseline.json`)              |
| `pnpm run share-drafts [slug]`        | Drafts Bluesky, Threads, and Patreon announcement text for a post (reads the build; sends nothing) |
| `pnpm run sync-remark42-rewrite`      | Regenerates the Remark42 rewrite in `vercel.json` from `REMARK42_UPSTREAM_ORIGIN`                  |
| `pnpm run check-remark42-rewrite`     | CI check that `vercel.json`'s Remark42 rewrite matches `REMARK42_UPSTREAM_ORIGIN`                  |
| `pnpm run lighthouse`                 | Lighthouse HTML report against `dist/`; starts and stops its own preview server                    |
| `pnpm run audit-performance`          | Same, performance category only, JSON output                                                       |

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
  English essays appear in feeds; Spanish twins and household recipes stay out

Surfaces covered: homepage, `/archive`, an English essay,
a Spanish twin, and a recipe. External URLs are never fetched — a release must
not fail because someone else's site is down. Remote link health, if wanted, is a
separate optional report.

The rules live in `scripts/lib/generated-content-checks.mjs` as pure functions
with unit tests in `pnpm test`, because the repo has no draft or future-dated
post to exercise them against.

### No service worker

Notes has no caching service worker. It used to keep pages you had opened
readable offline, but a reader online could still be shown a stale copy after a
deploy, and the offline reading was not worth that. `public/sw.js` stays as a
worker that removes itself: browsers that installed the old one fetch it as an
update, it deletes the old `notes-` caches and unregisters. Keep the file in
place, since a 404 there would leave returning readers on the old worker.
`/sw.js` is served `no-cache` so that update is never held back.

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
so the unit suite stays fast.

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

Many preview surfaces still expect JPEG, so the script writes **1200×630**
cover-cropped JPEGs under `public/social/` (names end with `-social.jpg`). The
mapping lives in `src/data/socialImageManifest.ts`. Posts without a `heroImage`
share `/social/images/default-social.jpg`.

It scans both image roots: `public/` (AVIF only — that folder also holds book
covers and icons that have no business on a social card) and
`src/assets/images/` (all formats, since everything there is hero art).

Each source is hashed (SHA-256). If the hash matches
`src/data/socialImageFingerprints.json` and the output file is on disk, that file
is skipped. After adding or changing hero art, run `pnpm run build` or
`pnpm run generate-social-images` and commit the updated manifest, fingerprints,
and any new files under `public/social/`.

Social cards in `public/social/` are committed, so the build only regenerates changed ones. CI caches Astro's optimized hero sizes (`node_modules/.astro`) keyed on the images and image settings, and the Playwright browser (see `.github/workflows/ci.yml`). New images over 1 MB fail `pnpm run check-image-sizes`; the files already over it are in `scripts/check-image-sizes.baseline.json` and may only shrink.

Vercel skips the build when a push to `main` only touches docs, specs, tests, `.github`, the README or the changelog (`ignoreCommand` in `vercel.json`), so those pushes don't count against the 100 deploys a day. A scheduled workflow (`.github/workflows/uptime.yml`) checks the live site every six hours; a failure emails the owner. Dependabot opens grouped weekly update PRs.

## Where images go

This one matters, and it is easy to get wrong.

| Image                            | Put it in            | Why                                |
| -------------------------------- | -------------------- | ---------------------------------- |
| A post's `heroImage`             | `src/assets/images/` | Astro generates 400/800/1200 sizes |
| An image used inside a post body | `public/images/`     | Referenced by URL from Markdown    |
| Book covers, icons, favicons     | `public/`            | Never processed                    |

Frontmatter does not change: `heroImage: '/images/2026/my-post.avif'` still
refers to `src/assets/images/2026/my-post.avif`. `src/utils/heroImages.ts` maps
the one to the other, which is why the feeds, Open Graph tags, structured data,
and search index all keep reading the same string they always did.

A hero left in `public/images/` still renders — it falls back to a plain `<img>`
— but it ships one full-size file to every screen, which is the whole problem
responsive images solved. `pnpm run validate-generated-content` checks every post
and fails with the offending slug if a hero has no `srcset`.

## Project layout

```text
notes/
├── public/              # Unprocessed assets: book covers, icons, in-body post images
│   ├── images/          # Images referenced by URL from post bodies
│   └── social/          # Generated 1200x630 social JPEGs
├── scripts/             # generate-social-images.js, generate-favicons.js
├── src/
│   ├── assets/images/   # Hero art — Astro generates responsive sizes from here
│   ├── components/      # Astro components (shared + feature folders like post-toc/)
│   ├── config/          # Comments, storage, assets
│   ├── content/p/       # Essays and notes (Markdown / MDX)
│   │   └── recipes/    # Recipe source files, kept as records; not built
│   ├── content/concepts/, values/, beliefs/  # Field Guide entries, one file per language
│   ├── data/            # Categories, navigation, fieldGuide.ts, socialImageManifest.ts, socialImageFingerprints.json, …
│   ├── layouts/
│   ├── pages/           # Routes (browse, archive, category, tag, p, field-guide, es/guia-de-campo, api, …)
│   ├── styles/
│   ├── utils/
│   └── types/
├── docs/                # Longer how-tos and specs
└── astro.config.mjs
```

Feature-specific components live under `src/components/<feature>/` when they are only used by matching routes. Shared pieces sit at the top level of `src/components/`.

## Content

Four collections in `src/content.config.ts`: `blog` for the writing, and `concepts`, `values`, `beliefs` for the Field Guide. In `blog`, the folder is the discriminator, not a `kind` field:

| Path                              | Public URL            | Listing                                                                                         |
| --------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------- |
| `src/content/p/<slug>.md`         | `/p/<slug>`           | Archive, Browse, categories, tags, home Highlights, feeds                                       |
| `src/content/p/recipes/<slug>.md` | redirects to Cookbook | Not built: the loader skips `recipes/**`, and each URL redirects to `cookbook.antoniwan.online` |

Field Guide entries live at `/field-guide/<shelf>/<slug>` and `/es/guia-de-campo/<estante>/<slug>`, listed only on their own shelves. Rules for writing one: [docs/field-guide.md](docs/field-guide.md).

Frontmatter: [docs/frontmatter-spec.md](docs/frontmatter-spec.md).
Tags: [docs/tag-policy.md](docs/tag-policy.md) and [docs/tag-vocabulary.md](docs/tag-vocabulary.md).

Translations: same `translationGroup` on each language version. Spanish twins stay off English listings; English cards show an ES marker when a twin exists. Spanish-only notes (no `translationGroup`) are listed on Browse and their tag pages, marked Español. Details: [docs/multilingual-setup.md](docs/multilingual-setup.md).

Agents: [CLAUDE.md](CLAUDE.md) holds the rules; Cursor skills are in [docs/cursor-agent-skills.md](docs/cursor-agent-skills.md).

## Documentation in `docs/`

Current guides:

| File                                                                    | Topic                                   |
| ----------------------------------------------------------------------- | --------------------------------------- |
| [design-system.md](docs/design-system.md)                               | Colors, type, widths, settled look      |
| [field-guide.md](docs/field-guide.md)                                   | Field Guide shelves, entries, merges    |
| [frontmatter-spec.md](docs/frontmatter-spec.md)                         | Post frontmatter                        |
| [multilingual-setup.md](docs/multilingual-setup.md)                     | EN/ES twins and the `es_PR` locale      |
| [tag-policy.md](docs/tag-policy.md)                                     | Signal-first tag policy                 |
| [tag-vocabulary.md](docs/tag-vocabulary.md)                             | Canonical vocabulary                    |
| [comments-setup.md](docs/comments-setup.md)                             | Remark42                                |
| [quotes-api.md](docs/quotes-api.md)                                     | `/api/quotes`                           |
| [structured-data-optimization.md](docs/structured-data-optimization.md) | Schema.org                              |
| [performance-optimization.md](docs/performance-optimization.md)         | Performance notes                       |
| [mermaid-diagrams.md](docs/mermaid-diagrams.md)                         | Mermaid diagrams in posts               |
| [midjourney-og-image-prompts.md](docs/midjourney-og-image-prompts.md)   | Image prompt notes                      |
| [cookbook-cutover.md](docs/cookbook-cutover.md)                         | Cookbook move: routes, checks, recovery |
| [cursor-agent-skills.md](docs/cursor-agent-skills.md)                   | Cursor agent skills                     |
| [roadmap.md](docs/roadmap.md)                                           | Ideas, product audit, technical roadmap |
| [TECHNICAL-AUDIT.md](docs/TECHNICAL-AUDIT.md)                           | System map, integrations, debt          |

Dated reports, kept as a record (what they describe may have changed since):

| File                                                                                | Topic                                   |
| ----------------------------------------------------------------------------------- | --------------------------------------- |
| [tag-cleanup-assessment-2026-04-10.md](docs/tag-cleanup-assessment-2026-04-10.md)   | Tag cleanup audit (Apr 2026)            |
| [tag-vocabulary-migration-v1.md](docs/tag-vocabulary-migration-v1.md)               | Tag vocabulary migration, v1            |
| [tag-system-cleanup-2026-09.md](docs/tag-system-cleanup-2026-09.md)                 | Tag system continuity report (Sep 2026) |
| [seo-routing-cleanup-2026-09.md](docs/seo-routing-cleanup-2026-09.md)               | SEO and routing cleanup (Sep 2026)      |
| [article-reading-ui-audit-2026-09.md](docs/article-reading-ui-audit-2026-09.md)     | Article reading UI audit (Sep 2026)     |
| [homepage-audit-owner-brief-2026-09.md](docs/homepage-audit-owner-brief-2026-09.md) | Homepage audit, owner brief (Sep 2026)  |

## Private generated materials

Generated planning/audit reports in `docs/materials/` are intentionally local-only and private. The folder is gitignored (except `docs/materials/.gitkeep`) so these files are not committed or published from this repository.

## License

- **Content**: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — [CONTENT_LICENSE.md](CONTENT_LICENSE.md)
- **Code**: [MIT](LICENSE)
