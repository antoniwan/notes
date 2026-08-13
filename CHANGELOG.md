# Changelog

All notable changes to [Notes](https://notes.antoniwan.online) are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [SemVer](https://semver.org/).

When bumping `package.json` version, run `pnpm changelog:since` (or follow the project skill) and prepend a new section.

## [6.6.0] — 2026-08-13

### Added

- Unique SEO meta descriptions for every public page (home, about, archive, guided path, library, categories, and tags), instead of reusing the homepage default.
- Category and tag listing pages get their own meta copy; meta tags clip to about 160 characters.

## [6.4.0] — 2026-08-12

### Changed

- Post pages now expose a single document `<h1>` (mobile `PageHeader`; desktop sidebar title is a visual echo) so Bing/Google stop flagging multiple H1s.
- Markdown `#` headings in post bodies are demoted to `##` so content cannot introduce a second H1.

### Added

- `PageHeader` `as` prop (`h1` | `p`) for semantic vs visual titles.
- Vitest guardrails for single-H1 layout rules and the remark demote plugin.

## [6.3.0] — 2026-08-12

### Added

- Optional `metaDescription` on layouts so on-page subtitles can stay long while SEO meta stays within ~160 characters (homepage uses this).

## [6.2.0] — 2026-08-12

### Changed

- Tag detail pages are indexable again and included in the sitemap (removed thin-tag `noindex` / sitemap exclusion). Author tools (`/brain-science/*`, `/tag-management`, `/api`) remain excluded.

## [6.1.0] — 2026-08-12

### Changed

- Dependency / workspace maintenance and social-image cache refresh.

## [6.0.0] — 2026-07-28

### Changed

- Visual UI overhaul (monochrome + marigold/violet accents). See `docs/TECHNICAL-AUDIT.md`.
