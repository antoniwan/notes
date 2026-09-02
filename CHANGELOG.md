# Changelog

All notable **technical** changes to [Notes](https://notes.antoniwan.online) are documented here (site, product, and engineering). Published notes and copy edits live in git, not in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [SemVer](https://semver.org/).

When bumping `package.json` version, run `pnpm changelog:since` (or follow the project skill) and prepend a new section.

## [6.13.0] — 2026-09-02

### Added

- Guided Path marks household recipes with **Recipe**, the same kind label as the postcards. Reading time stays off on those rows.

### Changed

- Category pages and category counts list essays only. Recipes stay on Cookbook and Everything.

## [6.12.1] — 2026-09-02

### Changed

- Everything lives under Resources in the header, not as a top-level Posts item. Homepage and footer still link the archive.

### Fixed

- Category cards on `/category` keep a space between the count and "writing(s)".

## [6.12.0] — 2026-09-02

### Added

- English listing cards show an **ES** marker when a public Spanish twin exists. The card still opens the English note.
- Search results for Spanish posts show an ES badge. Title search can find Spanish; listings cannot.
- Hero photos can credit the photographer, license, and source under the image.
- Recipe cards show **Recipe** (Receta on Spanish dishes) in the date row, from the `/p/recipes/` folder. Reading time is hidden on those cards and on the dish page.
- `/recipes` is a cookbook under Resources: plate grid plus A–Z contents. Recipe pages breadcrumb to it.

### Changed

- Spanish posts stay off Everything, category, tags, homepage Highlights, Guided Path, RSS/JSON feeds, and Continue reading, including in local `astro dev`. `featured` no longer lists Spanish.
- Search indexes public posts in any language. Sitemap, hreflang, and post URLs are unchanged.
- Default site description names field notes, including household recipes.
- More Recipes stays in the same language and skips the translation twin.
- A Spanish-only site or subdomain is documented as later work in `docs/roadmap.md` (§10).

## [6.11.1] — 2026-09-02

### Changed

- `/tag` reads as an idea map: follow a room to find writings that share it. Headings are rooms with the most writings, then every idea.
- Busy preferred rooms have a short blurb on the room page. Cousin doors stay distinct in copy (`healing` is not `recovery`).
- Tag chips and room pages dropped the inventory emoji. The back link is Every idea.

## [6.11.0] — 2026-09-02

### Added

- Recipe posts live under `/p/recipes/`. `/p/lemon-pepper-chicken` 301s to the nested URL.
- More Recipes on recipe pages, so dishes link to other dishes instead of cooking essays.

### Changed

- Tags are a reader idea map. `/tag` opens with a deterministic set of connected rooms, not an author inventory of forms.
- Related tags rank by co-occurrence on the same writings. Tag pages use preferred names. 404 chips come from live posts.
- Spanish and other alias tag URLs 301 to the English canonical room. `/tag/notes` 301s to `/tag`.
- RSS `<category>` includes tags as well as site categories. JSON Feed `tags` is tags only.
- Recipe posts stay out of Continue reading. Tag Analytics is no longer in the author nav.
- Homepage headline names the practice. Start here, Browse topics, and Everything stay the three paths. About is quieter.

### Removed

- Unused tag cloud and tag-system UI. `notes` is not a browse tag.

## [6.10.0] — 2026-08-31

### Added

- Origin note at `/brain-science` for anyone still on the old URL: the name is retired, the charts are Writing Insights.

### Changed

- Writing Insights dashboards live at `/writing-insights`. Old `/brain-science/*` subpaths 301; `/brain-science` itself is not redirected.
- Nav, footer, and About point at the Writing Insights hub. The hub preamble is only on that index page.

### Fixed

- `astro check` no longer fails when Remark42 config is built from comment-section data attributes.

## [6.9.0] — 2026-08-29

### Added

- Writing Insights preamble on every author-analytics page: this is a forkable Markdown toolkit, not a public gradebook.
- Letter-grade explainers that show what this corpus scored versus what an A would require on the same toy formula.
- Shared English and Spanish lexicons, with a Unicode word matcher so accented terms actually count.
- Rankings by hits per 1,000 words, so longer essays do not win by volume.

### Changed

- Nav, About, and README call the section Writing Insights. The URL is still `/brain-science`.
- Meta-language detectors include Spanish writing/reflection phrases; the disk cache is version 2 so old English-only analyses are not reused.

## [6.8.8] — 2026-08-27

### Changed

- Comment threads sit closer to the essay, with a small ✦ break instead of a padded gap and a horizontal rule.

### Removed

- Remark42 “Powered by” footer on post comments.

## [6.8.7] — 2026-08-27

### Changed

- Prose body font is Source Serif 4 instead of Literata, so long-form reading sits quieter next to Fraunces headings and DM Sans UI.

## [6.8.6] — 2026-08-27

### Added

- Pre-commit hook runs Prettier on staged files so the CI format check does not need a follow-up commit.

### Changed

- Format-on-save uses Prettier for Astro, Markdown, JSON, and CSS so the editor matches CI.

## [6.8.5] — 2026-08-27

### Fixed

- Post image captions sit under the image on desktop instead of centering across the full column.

## [6.8.3] — 2026-08-19

### Changed

- Homepage Highlights lists only published `featured: true` posts.

### Removed

- Unused `src/content/highlights.json` and the leftover `highlight` frontmatter field. Homepage Highlights is driven only by `featured`.

## [6.8.2] — 2026-08-19

### Fixed

- IndexNow checks that the live key file is reachable before pinging, and retries Bing if the shared endpoint returns 403, so production deploys no longer warn when Bing cannot verify the key yet.
- Feed MDX rendering imports `getContainerRenderer` from `@astrojs/mdx/container-renderer`.
- Threads embeds no longer wrap a processed `<script>` in a `{ markup && … }` expression, which broke the Astro compiler.
- `astro check` type errors in the Vite trailing-slash plugin, PageHeader props, and the H1-demote unit test.

### Removed

- Unused leftover IndexNow key file from an older key.

## [6.8.1] — 2026-08-19

### Fixed

- IndexNow no longer fails the Vercel production build when the output folder has a `sitemap.xml` directory (the `/sitemap.xml` redirect page) alongside the real sitemap XML files.

## [6.8.0] — 2026-08-19

### Added

- IndexNow ping on Vercel production publishes, so Bing and other IndexNow engines get the live sitemap URLs as soon as a deploy goes out.
- `lastmod` on sitemap URLs from post `updatedDate` or `pubDate`; listing pages use the newest related post.

## [6.7.0] — 2026-08-15

### Added

- Soft staggered fade-up entrances on postcard grids, homepage highlights, category cards, popular tags, and related posts (`motion-stagger` + shared `fade-up` tokens).

### Changed

- Archive “load more” batches reuse the same calm fade-up motion instead of a separate keyframe.
- Astro updated to 7.2.2.

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
