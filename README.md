# Notes

[![Version](https://img.shields.io/github/package-json/v/antoniwan/notes)](https://github.com/antoniwan/notes/releases)

Field notes from a life being lived: essays, household recipes, and the books on the shelf. Fatherhood, cooking, culture, work. English and Spanish, with links between twins.

This is not a magazine. It is not a recipe site with a blog attached. One public notebook. Essays and recipes share the same collection. Recipes live under `/p/recipes/` and list on the Cookbook.

Live site: [notes.antoniwan.online](https://notes.antoniwan.online)

Release history: [CHANGELOG.md](./CHANGELOG.md)

## What a reader sees

- **Writing** — essays and notes in `src/content/p/` (Markdown and MDX)
- **Cookbook** — `/recipes` is a plate grid plus A–Z contents. Recipes ship at `/p/recipes/<slug>`. English listed; Spanish via the dish toggle
- **Book library** — books on the shelf, under `/library` and `/library/books`
- **Paths in** — Guided Path (seasonal order, progress in the browser only), Everything (English archive), categories, tags as an idea map, header search
- **Home** — highlight masonry for `featured` English posts
- **Writing Insights** (`/writing-insights`) — cadence, topics, lexicon. `/brain-science` is the origin note; old dashboard subpaths 301
- **Feeds** — RSS (`/rss.xml`) and JSON Feed (`/feed.json`). Spanish stays out of feeds, same as listings
- **Quotes API** — `GET /api/quotes` (Stoic excerpts, other philosophy, lines from posts; optional `?kind=`)

English is the listing language. Spanish is a twin: language toggle, title search, SEO, direct URL. Not a second card stream. Details: [docs/multilingual-setup.md](docs/multilingual-setup.md).

## How it is built

- **10 categories** (for example On Parenting; Psychology, Roughly; On Politics; Metaspace; DIY & Creation) — essays only; household recipes list on the Cookbook and Everything. See `src/data/categories.ts`
- **Tags** — idea map for readers; **Tag management** is an author overview (noindex). Tags describe content, not the site name
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

## Quick start

```bash
git clone https://github.com/antoniwan/notes.git
cd notes
pnpm install
pnpm run dev
```

Then open `http://localhost:4321`.

This repo expects **pnpm**; you can use npm or yarn if you change commands yourself.

## Environment variables (optional)

For production builds of the **About** page, Letterboxd “latest watched” needs RSS URLs. Copy `.env.example` to `.env.local` and set:

- `LETTERBOXD_PROFILE_URL`
- `LETTERBOXD_RSS_URL`

If they are missing, that block on About simply won’t have fresh data (or may be empty depending on fallbacks).

Remark42 uses `PUBLIC_REMARK42_HOST` and `PUBLIC_REMARK42_SITE_ID` when you turn comments on — see `docs/comments-setup.md`. Both are listed in `.env.example`.

## Scripts

| Command                             | What it does                                                                                  |
| ----------------------------------- | --------------------------------------------------------------------------------------------- |
| `pnpm run dev`                      | Dev server                                                                                    |
| `pnpm run build`                    | Builds social JPG/PNG from AVIF (skipped when fingerprints + files match), then `astro build` |
| `pnpm run preview`                  | Serves the production build locally                                                           |
| `pnpm test`                         | Vitest unit tests (publish filters, SEO routing, feed HTML, quotes helpers)                   |
| `pnpm changelog:since`              | Commits + file groups since the previous version (for CHANGELOG drafts)                       |
| `pnpm run check`                    | `astro check` (TypeScript / Astro diagnostics)                                                |
| `pnpm run lint`                     | ESLint                                                                                        |
| `pnpm run lint:fix`                 | ESLint with `--fix`                                                                           |
| `pnpm run format`                   | Prettier write                                                                                |
| `pnpm run format:check`             | Prettier check (CI verifier; does not rewrite files)                                          |
| `pnpm run audit-frontmatter`        | Required-field / language sanity check on `src/content/p`                                     |
| `pnpm run validate-feeds`           | Validates `dist/rss.xml` + `dist/feed.json` (run after build)                                 |
| `pnpm run validate-structured-data` | Smoke-checks structured-data module exports                                                   |
| `pnpm run generate-social-images`   | AVIF → JPEG/PNG under `public/social/` only (same logic as the start of `pnpm run build`)     |
| `pnpm run generate-favicons`        | Favicon assets                                                                                |
| `pnpm run analyze`                  | Runs `astro build` only (no social-image step), then Vercel static-build analysis             |
| `pnpm run lighthouse`               | Lighthouse HTML report (start dev server first)                                               |
| `pnpm run performance`              | Runs `pnpm run build`, then `pnpm run analyze`                                                |
| `pnpm run audit-performance`        | Full `pnpm run build`, then Lighthouse performance JSON                                       |

CI’s format step **checks**; it does not rewrite or open a follow-up commit. After `pnpm install`, a pre-commit hook runs Prettier on staged files so commits already match that check.

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
│   ├── pages/           # Routes (cookbook, category, tag, writing-insights, api, …)
│   │   └── recipes.astro
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

| File                                                                              | Topic                                    |
| --------------------------------------------------------------------------------- | ---------------------------------------- |
| [frontmatter-spec.md](docs/frontmatter-spec.md)                                   | Post frontmatter                         |
| [tag-policy.md](docs/tag-policy.md)                                               | Signal-first tag policy                  |
| [tag-vocabulary.md](docs/tag-vocabulary.md)                                       | Canonical vocabulary                     |
| [tag-cleanup-assessment-2026-04-10.md](docs/tag-cleanup-assessment-2026-04-10.md) | Current cleanup audit                    |
| [multilingual-setup.md](docs/multilingual-setup.md)                               | EN/ES linking                            |
| [comments-setup.md](docs/comments-setup.md)                                       | Remark42                                 |
| [quotes-api.md](docs/quotes-api.md)                                               | `/api/quotes`                            |
| [structured-data-optimization.md](docs/structured-data-optimization.md)           | Schema.org                               |
| [performance-optimization.md](docs/performance-optimization.md)                   | Performance notes                        |
| [roadmap.md](docs/roadmap.md)                                                     | Ideas, product audit, technical roadmap  |
| [TECHNICAL-AUDIT.md](docs/TECHNICAL-AUDIT.md)                                     | System map, integrations, technical debt |
| [cursor-agent-skills.md](docs/cursor-agent-skills.md)                             | Cursor agent skill guide                 |
| [midjourney-og-image-prompts.md](docs/midjourney-og-image-prompts.md)             | Image prompt notes                       |

## Private generated materials

Generated planning/audit reports in `docs/materials/` are intentionally local-only and private. The folder is gitignored (except `docs/materials/.gitkeep`) so these files are not committed or published from this repository.

## License

- **Content**: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — [CONTENT_LICENSE.md](CONTENT_LICENSE.md)
- **Code**: [MIT](LICENSE)
