# Changelog

All notable **technical** changes to [Notes](https://notes.antoniwan.online) are documented here (site, product, and engineering). Published notes and copy edits live in git, not in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [SemVer](https://semver.org/).

When bumping `package.json` version, run `pnpm changelog:since` (or follow the project skill) and prepend a new section.

## [6.6.0] — 2026-08-13

### Added

- Unique SEO meta descriptions for every public page (home, about, archive, guided path, library, categories, and tags), instead of reusing the homepage default.
- Category and tag listing pages get their own meta copy; meta tags clip to about 160 characters.

## [6.5.2] — 2026-08-13

### Changed

- Social share images regenerated and compressed; default OG card is now the 1200×630 JPEG.
- Post card and hero images crop to fill instead of stretching.

## [6.5.1] — 2026-08-13

### Changed

- Footer credits the author by name.
- Post sidebar title echo uses the same heading rhythm as the mobile H1, with a bit more space above the description.

## [6.5.0] — 2026-08-12

### Added

- `CHANGELOG.md` and `pnpm changelog:since` so version bumps get a draft from git history.

### Changed

- Comments heading is now “Leave a note”.

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

## [5.31.0] — 2026-07-28

### Changed

- Theme color and layout pass for consistency and contrast (prelude to the 6.0 visual overhaul).
- Trailing-slash handling and navigation links made consistent.

## [5.30.1] — 2026-07-28

### Added

- Vitest unit tests and feed / frontmatter / structured-data validation scripts.

### Changed

- Secondary-language translations stay out of main listings, search, and feeds.
- Brain Science build work is memoized to cut repeat analysis cost.
- Remark42 comments config and Letterboxd error handling tightened.

## [5.30.0] — 2026-07-28

### Changed

- SEO redirects, robots.txt, and search-index filtering refined.
- Publish filters keep only eligible posts in listings, RSS, and JSON feed.

## [5.29.0] — 2026-07-28

### Added

- `imageAlt` on posts; hreflang support on layouts.
- Canonical SEO redirects (no trailing slash); Brain Science pages `noindex`.

### Changed

- Site-wide links and sitemap filtering aligned with `trailingSlash: 'never'`.

## [5.28.0] — 2026-07-27

### Changed

- Document titles made consistent in SEO meta.
- Category names prefixed with “On” where it fit; About labels follow.

## [5.27.0] — 2026-07-08

### Changed

- Astro / MDX dependency upgrades; `@astrojs/markdown-remark` for markdown processing.
- Experimental queued rendering turned off.

## [5.26.3] — 2026-07-08

### Changed

- Header search layout and result alignment.

## [5.26.1] — 2026-06-03

### Changed

- Threads embeds: URL normalization, extra oEmbed endpoints, loading state.
- Service worker cache bust.

## [5.26.0] — 2026-06-03

### Changed

- Threads embed loading and styling.

## [5.25.0] — 2026-05-08

### Added

- Quotes API supports more quote types and source links back to site content.

### Changed

- 404 quote styling.

## [5.24.1] — 2026-05-08

### Changed

- Social-image generation fingerprints and caches derivatives so rebuilds skip unchanged assets.

## [5.24.0] — 2026-05-08

### Changed

- Tailwind via the Vite plugin instead of the old Astro integration; component class cleanup.

## [5.23.0] — 2026-05-08

### Changed

- Brain Science evolution page: clearer language heuristics and Flesch reading-ease.
- Category index: most-written and alphabetical groupings.
- Search keyboard focus and type badges; sidebar scrollbar; Letterboxd diary links.

## [5.22.0] — 2026-05-08

### Added

- Review-verdict component for scored reviews.

### Changed

- Build pipeline drops empty Vite chunks.

## [5.21.0] — 2026-04-10

### Added

- Canonical tag vocabulary, content-form tag prelude on tag pages, and tag-governance docs.

### Changed

- Tags normalized at ingest; tag stats and management pages follow the vocabulary.

## [5.20.0] — 2026-04-09

### Changed

- Compact share button layout on tablet and mobile.

## [5.19.0] — 2026-04-09

### Added

- “See all categories” on category detail pages.

## [5.18.0] — 2026-04-09

### Changed

- Mobile nav: search in the menu, clearer active states for primary items.

## [5.17.0] — 2026-04-09

### Changed

- Post sidebar redesign: taxonomy, reading signals, mobile metadata.
- Service worker version follows `package.json`.
- Home and About layout pass; TOC modal positioning.

## [5.16.0] — 2026-04-08

### Added

- Floating table of contents on post pages.

## [5.15.0] — 2026-04-08

### Changed

- Dependency upgrades; Cursor agent skills documented in the README.

## [5.14.0] — 2026-03-29

### Changed

- About topics link through to matching categories.

## [5.13.1] — 2026-03-29

### Changed

- README rewritten around current features and stack.

## [5.13.0] — 2026-03-29

### Changed

- Desktop and mobile nav share one active-state helper.

## [5.12.0] — 2026-03-29

### Added

- About page: recent Letterboxd watches and topic map.

## [5.11.0] — 2026-03-29

### Changed

- Service worker cache names and social-image manifest refresh.
- 404 quote presentation.

## [5.10.0] — 2026-03-28

### Added

- Spec Kit / Specify workflow files for planning features.

### Changed

- Back-to-top button script is a bit leaner.

## [5.9.0] — 2026-03-17

### Changed

- Build updates the service worker version automatically.
- Back-to-top uses an inline script.

## [5.7.0] — 2026-03-17

### Changed

- Tailwind plugins imported as ES modules.

## [5.6.0] — 2026-03-17

### Changed

- CI Node.js 22.12.0.

## [5.5.0] — 2026-03-17

### Changed

- Service worker: cache v3 and background revalidation.
- Footer/About social link: Links Forest instead of Bluesky.

## [5.4.0] — 2026-03-17

### Changed

- Fonts via Fontsource (DM Sans, Fraunces, Literata, JetBrains Mono) instead of Google Fonts preload.
- About page animation timing.

## [5.3.0] — 2026-03-17

### Added

- Experimental queued rendering for faster builds.

## [5.1.0] — 2026-03-17

### Changed

- Site fonts loaded through Astro font config and CSS variables; legacy `fonts.css` removed.

## [5.0.0] — 2026-03-17

### Changed

- Astro 6.0.5.
