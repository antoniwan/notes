# Notes

[![Version](https://img.shields.io/badge/version-5.26.2-blue.svg)](https://github.com/antoniwan/notes/releases)

Personal writing site: essays and notes on fatherhood, masculinity, culture, and day-to-day life. Some posts are in English, some in Spanish, with links between translations where it applies.

Live site: [notes.antoniwan.online](https://notes.antoniwan.online)

## What it includes

- Posts in `src/content/p/` (Markdown and MDX)
- **10 categories** (for example Parenting, Psychology, Politics, Metaspace) — see `src/data/categories.ts`
- **Dark and light theme**, including system preference
- **Responsive layout** for small and large screens
- **Search** in the header (client-side index built at build time)
- **Guided Path** — seasonal reading order; progress stays in the browser only
- **Everything** — full archive-style list
- **Tags** — browse by tag; **Tag management** for overview-style views
- **Tag prelude links** on `/tag` — links to writing forms (essays, notes, poems, and similar) above the tag cloud when data exists
- **Brain Science** — writing stats and charts (cadence, topics, sentiment, and similar)
- **Book library** — static data under `/library` and `/library/books`
- **Reading time** — from a remark plugin (`minutesRead` in the collection)
- **Reading progress** on posts — `localStorage` only, no server
- **Table of contents on long posts** — floating contents control with section links and a jump to the top
- **RSS** (`/rss.xml`) and **JSON Feed** (`/feed.json`)
- **Random quotes API** — `GET /api/quotes` (Stoic excerpts, other philosophy, lines from posts; optional `?kind=`)
- **Public API** page at `/api/` — lists endpoints in plain language
- **Schema.org JSON-LD** where it fits the page type
- **Comments** — optional [Remark42](https://remark42.com/) embed when you set env vars (see `docs/comments-setup.md`)
- **Service worker** — registered for caching; the registration URL includes the **package version** from `package.json` so a version bump can nudge browsers to pick up updates
- On **Vercel**: **Web Analytics** and **Speed Insights** are wired in the base layout (they only send data when those products are enabled on the project)

## Stack

- [Astro](https://astro.build/) 6 — static output, MDX, `@astrojs/vercel` adapter
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

Remark42 uses `PUBLIC_REMARK42_HOST` and `PUBLIC_REMARK42_SITE_ID` when you turn comments on — see `docs/comments-setup.md`.

## Scripts

| Command                           | What it does                                                                                  |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| `pnpm run dev`                    | Dev server                                                                                    |
| `pnpm run build`                  | Builds social JPG/PNG from AVIF (skipped when fingerprints + files match), then `astro build` |
| `pnpm run preview`                | Serves the production build locally                                                           |
| `pnpm run check`                  | `astro check` (TypeScript / Astro diagnostics)                                                |
| `pnpm run lint`                   | ESLint                                                                                        |
| `pnpm run lint:fix`               | ESLint with `--fix`                                                                           |
| `pnpm run format`                 | Prettier write                                                                                |
| `pnpm run format:check`           | Prettier check                                                                                |
| `pnpm run generate-social-images` | AVIF → JPEG/PNG under `public/social/` only (same logic as the start of `pnpm run build`)     |
| `pnpm run generate-favicons`      | Favicon assets                                                                                |
| `pnpm run analyze`                | Runs `astro build` only (no social-image step), then Vercel static-build analysis             |
| `pnpm run lighthouse`             | Lighthouse HTML report (start dev server first)                                               |
| `pnpm run performance`            | Runs `pnpm run build`, then `pnpm run analyze`                                                |
| `pnpm run audit-performance`      | Full `pnpm run build`, then Lighthouse performance JSON                                       |

## Build (social images)

`pnpm run build` runs `scripts/generate-social-images.js` before `astro build`.

Hero images are stored as AVIF under `public/`. Many preview surfaces still expect JPEG or PNG, so the script writes matching files under `public/social/` (names end with `-social.jpg` or `-social.png`). The mapping lives in `src/data/socialImageManifest.ts`.

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
│   ├── content/p/       # Post files (Markdown / MDX)
│   ├── data/            # Categories, navigation, socialImageManifest.ts, socialImageFingerprints.json, …
│   ├── layouts/
│   ├── pages/           # Routes (blog, category, tag, brain-science, api, …)
│   ├── styles/
│   ├── utils/
│   └── types/
├── docs/                # Longer how-tos and specs
└── astro.config.mjs
```

Feature-specific components live under `src/components/<feature>/` when they are only used by matching routes. Shared pieces sit at the top level of `src/components/`.

## Content

Post frontmatter is documented in [docs/frontmatter-spec.md](docs/frontmatter-spec.md).
Tag governance and usage are documented in [docs/tag-policy.md](docs/tag-policy.md) and [docs/tag-vocabulary.md](docs/tag-vocabulary.md).

Translations: same `translationGroup` on each language version; use `featured` so only one version shows in main lists. Details: [docs/multilingual-setup.md](docs/multilingual-setup.md).

Using Cursor AI in this repo: [docs/cursor-agent-skills.md](docs/cursor-agent-skills.md).

## Documentation in `docs/`

| File                                                                              | Topic                    |
| --------------------------------------------------------------------------------- | ------------------------ |
| [frontmatter-spec.md](docs/frontmatter-spec.md)                                   | Post frontmatter         |
| [tag-policy.md](docs/tag-policy.md)                                               | Signal-first tag policy  |
| [tag-vocabulary.md](docs/tag-vocabulary.md)                                       | Canonical vocabulary     |
| [tag-cleanup-assessment-2026-04-10.md](docs/tag-cleanup-assessment-2026-04-10.md) | Current cleanup audit    |
| [multilingual-setup.md](docs/multilingual-setup.md)                               | EN/ES linking            |
| [comments-setup.md](docs/comments-setup.md)                                       | Remark42                 |
| [quotes-api.md](docs/quotes-api.md)                                               | `/api/quotes`            |
| [structured-data-optimization.md](docs/structured-data-optimization.md)           | Schema.org               |
| [performance-optimization.md](docs/performance-optimization.md)                   | Performance notes        |
| [roadmap.md](docs/roadmap.md)                                                     | Ideas and backlog        |
| [cursor-agent-skills.md](docs/cursor-agent-skills.md)                             | Cursor agent skill guide |
| [midjourney-og-image-prompts.md](docs/midjourney-og-image-prompts.md)             | Image prompt notes       |

## Private generated materials

Generated planning/audit reports in `docs/materials/` are intentionally local-only and private. The folder is gitignored (except `docs/materials/.gitkeep`) so these files are not committed or published from this repository.

## License

- **Content**: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — [CONTENT_LICENSE.md](CONTENT_LICENSE.md)
- **Code**: [MIT](LICENSE)
