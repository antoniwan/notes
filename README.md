# Notes

[![Version](https://img.shields.io/badge/version-5.9.0-blue.svg)](https://github.com/antoniwan/notes/releases)

A personal notes site: essays and notes on fatherhood, masculinity, culture, and modern life. Raw reflections on thinking, consciousness, and the soft heart inside the hard world.

## Overview

- **~75 posts** in `src/content/p/` (Markdown/MDX)
- **11 content categories** (e.g. Parenting, Psychology, Media reviews, Metaspace)
- **Bilingual content** with translation linking (English/Spanish)
- **Dark/light mode** with system preference detection
- **Responsive layout** for mobile and desktop
- **Structured data** (Schema.org) for search discoverability
- **Reading progress** with completion detection and optional toast; stored in `localStorage` only
- **Reading time** computed at build time via a remark plugin
- **Guided Path** – seasonal reading with progress tracked locally

## Tech Stack

- **Astro 6.0.5** – static site generator (with experimental queued rendering enabled)
- **TypeScript 5.9** – type-safe development
- **Tailwind CSS 3.4** – utility-first CSS
- **MDX** – Markdown with JSX
- **Sharp** – image optimization
- **Remark42** – self-hosted comments (optional)
- **Vercel** – deployment (optional)

## Quick Start

```bash
git clone https://github.com/antoniwan/notes.git
cd notes
pnpm install
pnpm run dev
```

Open `http://localhost:4321`.

## Available Scripts

> **Note:** The project uses **pnpm** as the primary package manager. The commands below assume pnpm; if you prefer `npm` or `yarn`, adjust accordingly.

| Command                               | Action                                              |
| ------------------------------------- | --------------------------------------------------- |
| `pnpm run dev`                        | Start development server                            |
| `pnpm run build`                      | Production build                                    |
| `pnpm run preview`                    | Preview production build                            |
| `pnpm run generate-favicons`          | Generate favicon assets                             |
| `pnpm run validate-feeds`             | Validate RSS and JSON feeds                         |
| `pnpm run audit-frontmatter`          | Audit frontmatter consistency                       |
| `pnpm run standardize-frontmatter`    | Standardize frontmatter format                      |
| `pnpm run remove-legacy-reading-time` | Remove legacy reading time fields                   |
| `pnpm run validate-structured-data`   | Validate structured data implementation             |
| `pnpm run fix:hr-spacing`             | Fix horizontal rule spacing in content              |
| `pnpm run format`                     | Format with Prettier                                |
| `pnpm run format:check`               | Check formatting                                    |
| `pnpm run analyze`                    | Build then run Vercel static-build                  |
| `pnpm run lighthouse`                 | Run Lighthouse on localhost (dev server must be up) |
| `pnpm run performance`                | Build and analyze                                   |
| `pnpm run audit-performance`          | Build then Lighthouse performance-only JSON report  |

## Project Structure

```text
notes/
├── public/                 # Static assets
├── src/
│   ├── components/        # UI (40+ Astro components)
│   ├── config/            # Storage, comments, assets
│   ├── content/p/         # Blog posts (Markdown/MDX)
│   ├── data/              # Categories, nav, tags, quotes
│   ├── layouts/           # BaseLayout, BlogLayout, etc.
│   ├── pages/             # Routes
│   │   ├── api/           # API (e.g. quotes)
│   │   ├── brain-science/ # Analytics-style pages
│   │   └── p/             # Post pages
│   ├── styles/            # Global CSS, fonts
│   ├── types/             # TypeScript types
│   └── utils/             # Utilities
├── scripts/               # Build/content automation
├── docs/                  # Project documentation
└── astro.config.mjs
```

### Architecture & folder conventions

- **Feature-specific components**: Components that belong to a specific feature area (for example `brain-science`) live under `src/components/<feature>/` and are only imported by pages in the matching route segment (for example `src/pages/brain-science/`). Shared, reusable UI lives at the root of `src/components/` and can be imported anywhere. This keeps feature internals from leaking into unrelated routes and helps avoid circular dependencies as new features are added.

## Content Management

### Blog posts

Posts use a shared frontmatter format. See [docs/frontmatter-spec.md](docs/frontmatter-spec.md).

Example:

```yaml
---
title: 'Post Title'
description: 'Short description for SEO'
pubDate: '2025-01-01T00:00:00.000Z'
language: ['en']
heroImage: '/images/hero-image.jpg'
category: ['integration-growth']
tags: ['tag1', 'tag2']
featured: true
translationGroup: 'unique-group-id'
draft: false
---
```

### Reading time

Reading time is computed by a remark plugin at build time and exposed as `minutesRead`. No manual field in frontmatter.

### Reading progress

- Completion is considered at ~75% of article content (before comments/footer).
- Data is stored only in the browser (`localStorage`); no server tracking.
- Optional toast and cross-tab sync. Config in `src/config/storage.ts`.

### Multilingual content

- Use the same `translationGroup` on both language versions.
- Set `featured: true` for the primary (e.g. English) and `featured: false` for the other so only one appears in main listings.
- Language toggles link to the other version. See [docs/multilingual-setup.md](docs/multilingual-setup.md).

### Categories

Defined in `src/data/categories.ts`. Examples: Art & Expression, Culture, DIY & Creation, Integration & Growth, Learning Projects, Media reviews, Metaspace, Parenting, Politics, Psychology, Systems & Strategy.

### Media reviews (film & TV)

Posts can set `template: media-review` with `mediaType`, `workTitle`, `releaseYear`, optional `seasonLabel`, `heroImage` (poster), and optional `trailerUrl`. YouTube trailers embed with **youtube-nocookie** and **no autoplay**. See [docs/frontmatter-spec.md](docs/frontmatter-spec.md).

### Letterboxd (optional)

Set these in `.env` / Vercel (both optional; leave unset to hide Letterboxd UI):

| Variable                 | Purpose                                                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `LETTERBOXD_PROFILE_URL` | Plain link on the footer, About page, and media review pages.                                                                      |
| `LETTERBOXD_RSS_URL`     | Public RSS URL; at build time, recent items render **only** on media review posts. About and the footer never show the RSS widget. |

## Features

- **Theme** – Dark/light with system preference
- **Search** – Client-side search over posts
- **Homepage** – Featured posts and highlights
- **Archive** – Chronological list with lazy loading
- **Guided Path** – Themed reading path with local progress
- **Tags** – Filtering and tag analytics (brain-science)
- **Brain Science** – Writing analytics (insights, evolution, topics, cadence, patterns, meta)
- **Comments** – Remark42 (self-hosted); requires setup
- **RSS/JSON** – Feeds for syndication
- **Quotes API** – `GET /api/quotes` for random Stoic quotes (see [docs/quotes-api.md](docs/quotes-api.md))
- **Structured data** – Schema.org types (e.g. WebSite, Organization, Person, BlogPosting, Review/Movie/TVSeries on media reviews, BreadcrumbList, FAQ where applicable). See [docs/structured-data-optimization.md](docs/structured-data-optimization.md).

## API

### Quotes

- **Endpoint**: `GET /api/quotes`
- **Returns**: One random Stoic quote plus metadata.
- **Docs**: [docs/quotes-api.md](docs/quotes-api.md)

## Documentation

| Doc                                                     | Description                    |
| ------------------------------------------------------- | ------------------------------ |
| [Frontmatter spec](docs/frontmatter-spec.md)            | Post frontmatter format        |
| [Roadmap](docs/roadmap.md)                              | Upcoming features and ideas    |
| [Comments setup](docs/comments-setup.md)                | Remark42 configuration         |
| [Quotes API](docs/quotes-api.md)                        | Quotes endpoint                |
| [Multilingual setup](docs/multilingual-setup.md)        | Translation linking            |
| [Structured data](docs/structured-data-optimization.md) | Schema.org implementation      |
| [Performance](docs/performance-optimization.md)         | Performance notes              |
| [Technical audit](docs/TECHNICAL-AUDIT.md)              | Codebase audit (point-in-time) |

## License

- **Content**: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — see [CONTENT_LICENSE.md](CONTENT_LICENSE.md).
- **Code**: [MIT](https://opensource.org/licenses/MIT) — see [LICENSE](LICENSE).
