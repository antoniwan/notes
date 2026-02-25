# Notes

[![Version](https://img.shields.io/badge/version-4.17.4-blue.svg)](https://github.com/antoniwan/notes/releases)

A personal notes site: essays and notes on fatherhood, masculinity, culture, and modern life. Raw reflections on thinking, consciousness, and the soft heart inside the hard world.

## Overview

- **~75 posts** in `src/content/p/` (Markdown/MDX)
- **10 content categories** (e.g. Parenting, Psychology, Politics, Metaspace)
- **Bilingual content** with translation linking (English/Spanish)
- **Dark/light mode** with system preference detection
- **Responsive layout** for mobile and desktop
- **Structured data** (Schema.org) for search discoverability
- **Reading progress** with completion detection and optional toast; stored in `localStorage` only
- **Reading time** computed at build time via a remark plugin
- **Guided Path** – seasonal reading with progress tracked locally

## Tech Stack

- **Astro 5.17** – static site generator
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
npm install
npm run dev
```

Open `http://localhost:4321`.

## Available Scripts

| Command | Action |
|--------|--------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run generate-favicons` | Generate favicon assets |
| `npm run validate-feeds` | Validate RSS and JSON feeds |
| `npm run audit-frontmatter` | Audit frontmatter consistency |
| `npm run standardize-frontmatter` | Standardize frontmatter format |
| `npm run remove-legacy-reading-time` | Remove legacy reading time fields |
| `npm run validate-structured-data` | Validate structured data implementation |
| `npm run fix:hr-spacing` | Fix horizontal rule spacing in content |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |
| `npm run analyze` | Build then run Vercel static-build |
| `npm run lighthouse` | Run Lighthouse on localhost (dev server must be up) |
| `npm run performance` | Build and analyze |
| `npm run audit-performance` | Build then Lighthouse performance-only JSON report |

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

Defined in `src/data/categories.ts`. Examples: Art & Expression, Culture, DIY & Creation, Integration & Growth, Learning Projects, Metaspace, Parenting, Politics, Psychology, Systems & Strategy.

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
- **Structured data** – Schema.org types (e.g. WebSite, Organization, Person, BlogPosting, BreadcrumbList, FAQ where applicable). See [docs/structured-data-optimization.md](docs/structured-data-optimization.md).

## API

### Quotes

- **Endpoint**: `GET /api/quotes`
- **Returns**: One random Stoic quote plus metadata.
- **Docs**: [docs/quotes-api.md](docs/quotes-api.md)

## Documentation

| Doc | Description |
|-----|-------------|
| [Frontmatter spec](docs/frontmatter-spec.md) | Post frontmatter format |
| [Comments setup](docs/comments-setup.md) | Remark42 configuration |
| [Quotes API](docs/quotes-api.md) | Quotes endpoint |
| [Multilingual setup](docs/multilingual-setup.md) | Translation linking |
| [Structured data](docs/structured-data-optimization.md) | Schema.org implementation |
| [Performance](docs/performance-optimization.md) | Performance notes |
| [Technical audit](docs/TECHNICAL-AUDIT.md) | Codebase audit (point-in-time) |

## License

- **Content**: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — see [CONTENT_LICENSE.md](CONTENT_LICENSE.md).
- **Code**: [MIT](https://opensource.org/licenses/MIT) — see [LICENSE](LICENSE).
