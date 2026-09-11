# Changelog

All notable **technical** changes to [Notes](https://notes.antoniwan.online) are documented here (site, product, and engineering). Published notes and copy edits live in git, not in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [SemVer](https://semver.org/).

When bumping `package.json` version, run `pnpm changelog:since` (or follow the project skill) and prepend a new section.

[6.13.2] through [6.21.0] is one ChatGPT Codex and Astra batch at full power, Max setting. Months of site work, shipped in days.

## [6.25.0] — 2026-09-10

Post-body images now get the same treatment as hero art, and some machinery that
was working around the framework is gone.

### Added

- `image.layout: 'constrained'` with breakpoints starting at 400. Every image
  Astro processes now emits a `srcset`, including images inside post bodies.
  Hero art keeps its own measured `widths`/`sizes`, which override the defaults.

### Changed

- All 24 post-body images moved to `src/assets/images/`, so Astro processes
  them. Markdown references became relative paths; four posts whose images sit
  inside `<figure>` markup became `.mdx` and import their images.
- Post pages render with `<Content />` instead of injecting `post.rendered.html`
  with `set:html`. Verified across all 129 posts: the only difference in the
  output is the removal of a `display: contents` wrapper, which generates no box.

### Fixed

- Images referenced from Markdown could never work. The page injected raw
  rendered HTML, skipping the step that turns Astro's `__ASTRO_IMAGE_`
  placeholders into real `<img>` elements, so a relative image shipped a broken
  placeholder. Nothing in the repo used one, which is why it went unnoticed.
- `symbols-of-power` referenced `/symbols/lightsaber.avif`, which sat outside the
  images folder its six siblings used. It is now imported like the rest.

### Removed

- `unwrapHeadingEmphasis` and `preparePostHtml`. The first flattened bold and
  italics inside headings; **no heading in any of the 129 posts uses either**.
  The second also duplicated, as a regex over HTML, what the `rehypeWrapTables`
  plugin already did on the tree.
- `wrapTablesInHtml.ts` is now `headingText.ts` and holds only
  `stripHeadingMarkup`, which earns its place: two headings use backtick code
  spans that should not appear as literal characters in a TOC label.

## [6.24.1] — 2026-09-10

Documentation accuracy and a guard, after the responsive-image move.

### Added

- `validate-generated-content` now checks every post's hero image and fails with
  the offending slug if one has no `srcset`. A hero left in `public/images/`
  still renders, so the mistake is invisible without a check — this makes it
  loud. Verified by moving a hero back and watching the gate name it.

### Changed

- README gained a "Where images go" table, and the project layout now shows
  `src/assets/images/`. The post-publishing skill, `docs/frontmatter-spec.md`,
  and `docs/midjourney-og-image-prompts.md` were all still telling authors to
  save hero art to `public/images/`, which would have silently produced
  unoptimized images on the next post.
- `docs/performance-optimization.md` records the real arrival-cost numbers, and
  notes that the widely-quoted 29 MB figure was a scroll-to-bottom worst case,
  not what a visitor pays.

### Fixed

- Intermittent focus loss after closing the article lightbox (see 6.24.0).

### Removed

- `meta-descriptions-export.md`, a stale generated export listing 84 posts when
  the site has 129, referenced by nothing.
- `measure-bs.js`, a throwaway Playwright script hardcoded to a local URL.
- `.eslintrc.cjs`. ESLint 10 uses flat config and ignores it entirely, so it was
  dead and misleading — editing it would have had no effect.

## [6.24.0] — 2026-09-10

Responsive images (R20), the last item from the September 10 audit roadmap.

### Added

- Hero art is now served at a size that suits the screen asking for it. Every
  card, article hero, Cookbook plate, and no-hero fallback cover ships a
  `srcset` at 400/800/1200 with a `sizes` hint describing its real painted box.

### Changed

- Hero images moved from `public/images/` to `src/assets/images/` so Astro can
  process them. `heroImage` frontmatter is unchanged — a small resolver maps the
  existing `/images/…` string onto the moved file, so feeds, Open Graph tags,
  structured data, and search keep reading exactly what they did before.
- Search result thumbnails are 200px derivatives instead of full-size hero art.
- Social cards are now generated for non-AVIF hero art too, so every post has a
  real Open Graph image rather than falling back to its raw source file.
- The social image manifest is written in sorted order, so it stops churning
  when the scan order changes.

### Deployment note

The first production build on Vercel took **15m 59s**, encoding 341 image
derivatives from scratch. Local measurement had suggested about 2m 9s for a cold
build, so budget for roughly eight times that on Vercel rather than trusting the
local figure. Warm local rebuilds stay near 20s because Astro caches derivatives
under `node_modules/.astro`; whether Vercel preserves that cache between deploys
has not been verified, and is the first thing to check if later builds are also
slow. Nothing about this affects visitors — it is deploy cost only.

### Fixed

- Images on phones. A 390px screen was downloading byte-identical images to a
  1440px desktop, because nothing on the site had a `srcset` at all:

  | Page          | before    | after    |
  | ------------- | --------- | -------- |
  | `/everything` | 29,032 KB | 1,169 KB |
  | Home          | 2,755 KB  | 667 KB   |
  | An article    | 587 KB    | 201 KB   |

  Desktop improves too — `/everything` goes from 29,032 KB to 3,203 KB — and the
  two are now genuinely different, which is the point.

- A race in the article lightbox. A native `<dialog>` restores focus to whatever
  was focused before it opened, and that restoration could land _after_ the
  layout's own focus call, dropping the reader on an unrelated control instead
  of the image they had opened. It happens intermittently, which is how it went
  unnoticed; focus restoration now waits a frame so it reliably wins.

- The Cookbook thumbnail on About had lost its crop and focal point.
  `object-fit: cover` and `object-position: center 55%` were written as
  component-scoped rules that stopped matching once the image moved into a
  shared component, so a tall photo was being squashed into a wide frame.

## [6.23.0] — 2026-09-10

Second half of the September 10 audit roadmap (R10–R21). Every item was checked
by planting the regression it guards against and confirming the gate caught it.

### Added

- Search announces its outcome to screen readers — result counts, no results,
  and a distinct "Search is unavailable" state — and clearing leaves nothing
  stale behind.
- Slideshows have a persistent play/pause button. Rotation now holds for a
  reader's pause, pointer hover, keyboard focus, and backgrounded tabs, and a
  manual pause survives the pointer moving away. Reduced motion never
  auto-advances but can be opted into.
- Offline reading. Article pages, their images, and the browse pages you have
  opened stay readable without a connection.
- `/search-index.json`, the search corpus as one cacheable asset.
- A browser regression suite (24 journeys over the built site) and a
  generated-content validator, both wired into CI.
- Node and pnpm versions pinned in the repo, with CI reading them from
  `.nvmrc` and `packageManager` rather than repeating them.

### Changed

- The search corpus is fetched once on first search instead of being inlined
  into every page. Compressed HTML drops about 40% per page (47.8 KB → 28.6 KB
  gzip on a sample article; 10.28 MB → 5.37 MB across the site).
- The service worker was rewritten around an explicit offline promise. It caches
  what you actually read rather than pre-downloading the site, which measured at
  about 118 MB of reader-facing output.
- Lint now covers 214 files across `.js`, `.mjs`, `.cjs`, `.ts`, and `.astro`,
  up from 131 files with eight Astro-only rules. TypeScript files were being
  skipped silently.
- Publication rules (drafts, scheduling, language policy) have a single
  definition shared by the site, the sitemap, and the build validators.
- `pnpm run preview` serves the built site directly. `astro preview` needs the
  Vercel CLI and is now `preview:vercel`.

### Fixed

- Editing a Spanish note no longer bumps the sitemap `lastmod` of English-only
  listings. `/tag/children` and `/tag/digital-safety` were carrying dates from
  Spanish posts those pages never list.
- Recipes no longer bump category-page `lastmod`; category and tag pages list
  essays.
- `engines.node` is pinned to a single major, so Vercel stops overriding the
  project's configured Node version and auto-upgrading on each new release.
- Article images are cached for offline use. AVIF, this site's main image
  format, was missing from the service worker's matcher entirely.
- Browse pages other than `/` and `/p/` had no offline behaviour at all.
- A service-worker upgrade no longer deletes unrelated caches on the origin.
- An unescaped `>` in the Writing Insights source.

### Removed

- `FeaturedWritingsRotator` and `LazyPosts`, which had no consumers.
- Placeholder push-notification and background-sync handlers with no feature
  behind them.
- The `analyze` and `performance` scripts. `analyze` called a Vercel adapter
  entry point that does not exist, and `performance` chained into it after a
  redundant build.

## [6.22.3] — 2026-09-10

### Changed

- Default OG/Twitter card image updated to a new piece of abstract artwork.
- Pages without a specific hero image now get an honest, objective `og:image:alt` description of the default artwork instead of a generic title-only fallback.

## [6.22.2] — 2026-09-10

### Changed

- Search data is emitted once per page, reducing initial HTML while keeping desktop and mobile search behavior.
- CI now checks frontmatter, structured-data exports, the Remark42 rewrite, and generated feeds around the production build.
- Writing Insights caches use content-aware hashes, so title and same-length body edits refresh analytics without discarding valid cached work.
- Optional Threads and IndexNow requests share explicit build-time deadlines.
- Article images open in a keyboard-accessible dialog, and scrolling respects reduced-motion preferences.

### Fixed

- Clearing search cannot reopen stale debounced results.
- Social-image metadata drops entries when source AVIF files are removed.
- Vite development file serving uses its strict filesystem boundary.

## [6.22.1] — 2026-09-09

### Changed

- Browse copy says Topics to match the nav. `/tag` URLs are unchanged. Posts still label their chips as Tags.
- About drops the line under every “What these notes cover” item, plus the bars on the portrait and Cookbook.

## [6.22.0] — 2026-09-09

### Added

- Deleted `/blog`, `/categories`, `/search`, `/p`, and `/ciencia-cerebral` URLs permanently redirect to today's pages, so inbound links stop 404ing.
- Recipe pages emit Recipe JSON-LD. Essays still emit BlogPosting.
- Post pages emit BreadcrumbList JSON-LD from the same trail the visible breadcrumbs show.
- Writing Insights is in the sitemap and can be indexed.
- Cookbook plates with a Spanish twin show an ES chip.

### Changed

- `/library` redirects to `/library/books`, so search only has one book catalogue URL.
- `/sitemap.xml` redirects at Vercel instead of through a page.
- If Letterboxd is down at build time, About keeps the last known watches instead of shipping an empty list.

## [6.21.0] — 2026-09-09

### Added

- Children’s books (`/books`) lists two bilingual picture books, The Bent One and Mia, the Sun, and the Moon, with covers, schema, and search.
- Homepage and About link those books. Each card opens its own English/Spanish reader.

### Changed

- Main nav is reader-first: Everything, Guided Path, Browse (Topics and Categories), Collections (children’s books, Cookbook, Book Library), and About.
- Mobile menu and footer use the same Read / Collections / Connect groups. Writing Insights and Tag Management sit under Site tools, not in the top nav.
- Contact email is `antonio@builds.software`. About asks people to write rather than pointing at meta-tools.
- Body type and tap targets step up across cards, nav, tags, post chrome, and the table of contents so reading type is not smaller than 0.875rem.

### Notes

- Closes the [6.13.2]–[6.21.0] Codex and Astra push. This reader redesign — navigation, type, children’s books, and the rest of the chrome — was the last of it, designed and shipped in about a day or two.

## [6.20.0] — 2026-09-09

### Added

- Comments speak the post’s language, offer a private email, and say when the box is idle, loading, or failed.
- Leave a note jumps to comments after the article. Continue reading and More recipes stay on the page even without cards, with a browse link.
- Spanish posts label that afterword in Spanish and name that related writings and the cookbook index are in English.

### Changed

- Related writings and more recipes use the same post cards as listings, and sit before comments.
- Related writings only recommend a shared subject. Form tags, featured recency, translations, drafts, and recipes no longer fill the grid.
- More recipes stay in the same language and skip unpublished or future dishes.
- On this page hides on phones once you reach the afterword.
- Tag sentence doors no longer sit in a padded box.

### Fixed

- Comment embed aborts and tears down on navigation instead of stacking iframes or leaking a failed script.
- Related and more-recipe order is stable when scores or dates match.

### Removed

- The Read toast when an essay is marked read.

## [6.19.0] — 2026-09-09

### Added

- Tag map search finds a topic without needing hyphens or matching letter case. The query stays in the URL.
- Topics jump A–Z by letter, with a skip to the full directory.

### Changed

- Tags is a sentence map plus an A–Z directory. The most-written ranking and the chip cloud are gone.
- Sentence doors and the A–Z list use readable topic names, not hashtags.

## [6.18.0] — 2026-09-09

### Added

- Cookbook search finds a dish by name without needing accents, punctuation, or the full title. The query stays in the URL.
- Book library search matches title or author the same way. Status and shelf filters also persist in the URL.

### Changed

- Book library is an A–Z card catalogue instead of a table.
- Cookbook A–Z index sits behind a browse control. Empty search shows a clear empty state.

## [6.17.0] — 2026-09-09

### Added

- Guided Path groups writings by calendar season, with a place to resume, a next unread door, and a season index.
- Category cards keep their emoji in front of the name so the A–Z directory is easier to scan.
- Everything jumps by year instead of infinite scroll.

### Changed

- Categories is one A–Z directory. The most-written ranking and the secondary chip list are gone.
- Category rooms split Writings from Related, with a jump between them when both exist.
- Guided Path seasons stay open instead of collapsing. Progress is a read count, not a percent bar.

## [6.16.0] — 2026-09-08

### Added

- Homepage intro sits in Highlights, with two lead cards beside the heading.
- Filtering Highlights with an intro shows a jump control back to those leads.
- About links the Cookbook beside the portrait, with a recipe photo as the door.
- Continue Reading on essays uses the same PostCard grid as listings.

### Changed

- Homepage and About share the BaseLayout and Container shell instead of PageLayout.
- Post cards drop the boxed border. Hover lives on the title and photo.
- Letterboxd on About stays as a heading when the diary feed is empty, and posters sit in a wider gallery.

## [6.15.7] — 2026-09-08

### Fixed

- Essay tables keep padding on the first and last columns. Typography had been flushing those cells to the border.
- Wide tables scroll sideways instead of squeezing every column into the measure.
- On this page labels and essay headings no longer leak leftover `**` or `_` from markdown emphasis.

### Changed

- Post blockquotes no longer add a second pair of quotation marks around the quoted line.

## [6.15.6] — 2026-09-08

### Changed

- Cookbook leads with the A–Z index. The plate grid comes after, and the intro names the kitchen instead of “Notes Recipes.”

## [6.15.5] — 2026-09-08

### Added

- Tag chips use eight idea-family colors (kitchen stays marigold, inner stays violet). Long-tail tags stay muted.

### Changed

- Recipe tags are the dish and its world, not household stamps. Kitchen rooms still send you to the Cookbook.

## [6.15.4] — 2026-09-08

### Added

- Kitchen tags (`recipes`, `cooking`, `food`) send you to the Cookbook. The tag page stays writings.

## [6.15.3] — 2026-09-08

### Changed

- Homepage **Browse topics** goes to the tag map, not categories.

## [6.15.2] — 2026-09-08

### Changed

- Tag index, tag pages, search tag results, and 404 topic chips use the same essay-only listing as categories. Household recipes stay on Cookbook and Everything.

## [6.15.1] — 2026-09-08

### Changed

- Footer names the author once, under the logo. The colophon is the CC and MIT licenses; the © year line is gone.

## [6.15.0] — 2026-09-08

### Added

- Footer is a directory: Reading, Resources, and Connect, with the full logo and a quieter colophon.
- Phone menu can share the current page and lists Bluesky, GitHub, and YouTube under Elsewhere.

### Changed

- Header, desktop nav, search, theme toggle, and the phone menu share one chrome language: 44px targets, native disclosures, and category counts.
- Search below 1280px opens a panel under the header. Escape, outside click, and leaving focus close it. Desktop search stays in the bar.

### Fixed

- Search arrow keys move focus onto results. Escape keeps you in the field.
- Phone search and menu keep `aria-expanded` in sync and close each other. Theme toggle names the theme you will switch to.

Chrome pass built with GPT Astra at Max reasoning effort.

## [6.14.0] — 2026-09-08

### Added

- Wide article pages keep a persistent On this page list. Below 1200px, Contents opens a left-aligned panel with focus, Escape, and outside-click.
- `/category` opens with a fair warning: tags follow how the ideas connect; categories are just the first stamp.

### Changed

- Title, description, date, reading time, and translation links sit above the hero at every width. One visible H1; the reading body is an article, not a nested main.
- Below 1200px the reading column stays a single centered stack. Wider screens get a 224px navigation rail beside the article. Prose stays at 68ch.
- Hero crops to 16:10 on phones and 16:9 from 768px up.
- Topics, tags, and sharing sit in the rail on desktop and collapse after the prose on smaller screens. Read status and duration show together.
- Reading progress tracks the article body, not comments, related posts, or the footer.

### Fixed

- Contents restores focus on close, marks the active section, and moves focus to the heading after a jump.
- Wide tables and code scroll inside the article instead of clipping, and focus outlines stay visible.
- Floating reading controls respect safe-area insets. The local service-worker badge stays off article previews.

Reading-layout pass built with GPT Astra at Max reasoning effort.

## [6.13.2] — 2026-09-08

### Fixed

- Desktop post sidebar stays below the header while you read. Long tag lists scroll inside the sidebar instead of clipping off the screen.

### Notes

- Opens the Codex and Astra batch (full power, Max) that runs through [6.21.0].

## [6.13.1] — 2026-09-05

### Changed

- Writings with Sources or References use the same ✦ break as comments. Continue Reading and More Recipes do too. Citation sections sit a little quieter; comments keep the current accent.

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
