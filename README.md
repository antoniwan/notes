# Notes

[![Version](https://img.shields.io/badge/version-5.21.0-blue.svg)](https://github.com/antoniwan/notes/releases)

Personal writing site: essays and notes on fatherhood, masculinity, culture, and day-to-day life. Some posts are in English, some in Spanish, with links between translations where it applies.

Live site: [notes.antoniwan.online](https://notes.antoniwan.online)

## What it includes

- Posts in `src/content/p/` (Markdown and MDX); the file count grows over time
- **10 categories** (for example Parenting, Psychology, Politics, Metaspace) — see `src/data/categories.ts`
- **Dark and light theme**, including system preference
- **Layout** that works on phones and larger screens
- **Search** in the header (built from a client-side index at build time)
- **Guided Path** — seasonal reading order; progress stays in the browser only
- **Everything** — full archive-style list
- **Tags** — browse by tag; **Tag management** page for analytics-style views
- **Tag prelude links** — `/tag` now shows a sentence-style list of canonical writing-form links (for example essays, notes, poems) above the tag cloud when available
- **Brain Science** — several pages of writing stats and charts (cadence, topics, sentiment, and similar)
- **Book library** — static reference data under `/library` and `/library/books`
- **Reading time** — added at build time by a remark plugin (`minutesRead` in the collection)
- **Reading progress** on posts — stored in `localStorage` only, not on a server
- **Table of contents on long posts** — floating "Contents" button with section links and a quick "Top" jump
- **RSS** (`/rss.xml`) and **JSON Feed** (`/feed.json`)
- **Random quotes API** — `GET /api/quotes` (Stoic quotes from local data)
- **Public API** page at `/api/` — human-readable overview of endpoints
- **Schema.org JSON-LD** on pages where it fits
- **Comments** — [Remark42](https://remark42.com/) embed when you configure a host (optional; see `docs/comments-setup.md`)
- **Service worker** — registered for caching; version bumps during `pnpm run build`
- On **Vercel**: **Web Analytics** and **Speed Insights** components are included in the base layout (they only send data when the site runs on Vercel with those products enabled)

## Stack

- [Astro](https://astro.build/) 6 — static output, MDX, `@astrojs/vercel` adapter
- TypeScript
- Tailwind CSS
- Sharp for image work in the build

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

| Command                           | What it does                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------- |
| `pnpm run dev`                    | Dev server                                                                    |
| `pnpm run build`                  | Generates social images, bumps the service worker version, then `astro build` |
| `pnpm run preview`                | Serves the production build locally                                           |
| `pnpm run check`                  | `astro check` (TypeScript / Astro diagnostics)                                |
| `pnpm run lint`                   | ESLint                                                                        |
| `pnpm run lint:fix`               | ESLint with `--fix`                                                           |
| `pnpm run format`                 | Prettier write                                                                |
| `pnpm run format:check`           | Prettier check                                                                |
| `pnpm run generate-social-images` | OG/social images only                                                         |
| `pnpm run generate-favicons`      | Favicon assets                                                                |
| `pnpm run analyze`                | Build then Vercel static-build analysis                                       |
| `pnpm run lighthouse`             | Lighthouse HTML report (start dev server first)                               |
| `pnpm run performance`            | Build + analyze                                                               |
| `pnpm run audit-performance`      | Build + Lighthouse performance JSON                                           |

## Project layout

```text
notes/
├── public/              # Static files (images, service worker, etc.)
├── scripts/             # generate-social-images, favicons, SW version bump
├── src/
│   ├── components/      # Astro components (shared + feature folders like brain-science/)
│   ├── config/          # Comments, storage, assets
│   ├── content/p/       # Post files (Markdown / MDX)
│   ├── data/            # Categories, navigation, quotes, tags, etc.
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

| File                                                                    | Topic                    |
| ----------------------------------------------------------------------- | ------------------------ |
| [frontmatter-spec.md](docs/frontmatter-spec.md)                         | Post frontmatter         |
| [tag-policy.md](docs/tag-policy.md)                                     | Signal-first tag policy  |
| [tag-vocabulary.md](docs/tag-vocabulary.md)                             | Canonical vocabulary     |
| [tag-cleanup-assessment-2026-04-10.md](docs/tag-cleanup-assessment-2026-04-10.md) | Current cleanup audit    |
| [multilingual-setup.md](docs/multilingual-setup.md)                     | EN/ES linking            |
| [comments-setup.md](docs/comments-setup.md)                             | Remark42                 |
| [quotes-api.md](docs/quotes-api.md)                                     | `/api/quotes`            |
| [structured-data-optimization.md](docs/structured-data-optimization.md) | Schema.org               |
| [performance-optimization.md](docs/performance-optimization.md)         | Performance notes        |
| [roadmap.md](docs/roadmap.md)                                           | Ideas and backlog        |
| [cursor-agent-skills.md](docs/cursor-agent-skills.md)                   | Cursor agent skill guide |
| [midjourney-og-image-prompts.md](docs/midjourney-og-image-prompts.md)   | Image prompt notes       |

## Private generated materials

Generated planning/audit reports in `docs/materials/` are intentionally local-only and private. The folder is gitignored (except `docs/materials/.gitkeep`) so these files are not committed or published from this repository.

## License

- **Content**: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — [CONTENT_LICENSE.md](CONTENT_LICENSE.md)
- **Code**: [MIT](LICENSE)
