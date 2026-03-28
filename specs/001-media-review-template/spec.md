# Feature Specification: Movie and TV review template

**Feature Branch**: `001-media-review-template`  
**Created**: 2026-03-28  
**Last updated**: 2026-03-28 (clarifications session)  
**Status**: Draft  
**Input**: User description: "to implement a movie or TV show review template… editorial vs media layout… poster… trailer…" — **Revision**: Letterboxd integration is **public RSS and normal web links only**; **no** Letterboxd API, **no** third-party movie/TV database APIs for posters or trailers—authors supply poster and trailer manually.

<!--
  Notes platform: Features touching `src/content/p/`, frontmatter, feeds, or Schema.org output
  MUST align with docs/frontmatter-spec.md and related docs in docs/. See
  `.specify/memory/constitution.md` for non-negotiable constraints (static-first default, privacy,
  verification gates).
-->

## Clarifications

### Session 2026-03-28

- Q: Where should optional Letterboxd profile link and RSS-driven activity appear? → A: **RSS-sourced optional UI** (e.g. recent activity from the public feed) appears **only on media review pages.** The **About** page and **site footer** use **plain outbound link(s)** only (e.g. to the Letterboxd profile)—**no** Letterboxd RSS-driven UI on About or in the footer. A dedicated **“Movies / TV Shows Review”** hub/index page remains **out of scope** (future spec).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read a media review on a phone (Priority: P1)

A reader opens a movie or TV review on a small screen and immediately recognizes it as coverage of a specific title: poster (when provided), title, and review content are easy to scan without feeling like a long-form editorial essay layout.

**Why this priority**: The primary value is a reader-friendly, media-first reading experience distinct from standard editorial posts.

**Independent Test**: Publish one media review with poster and body only; open it on a narrow viewport and confirm layout, hierarchy, and readability without using any trailer or listing features.

**Acceptance Scenarios**:

1. **Given** a published movie review with poster and body text, **When** the reader opens it on a phone-sized viewport, **Then** the poster and title are prominent at the top and the review reads comfortably without horizontal scrolling.
2. **Given** a published TV review labeled as television, **When** the reader views it, **Then** labeling or structure makes clear it is TV (not film) without relying on fine print alone.

---

### User Story 2 - Author publishes a review with poster and optional trailer (Priority: P2)

An author creates a new movie or TV review entry, attaches poster artwork, writes the review, and optionally links or embeds an official trailer so readers can watch it in context. Poster and trailer are supplied **by the author** (files or URLs/embeds); there is **no** automated lookup from external databases in this feature.

**Why this priority**: Without authoring workflow and optional trailer support, the template cannot deliver the full intended experience.

**Independent Test**: Create a draft review with poster and optional trailer fields; publish and verify poster always appears when set; trailer area appears only when a trailer is provided.

**Acceptance Scenarios**:

1. **Given** an author is creating a media review, **When** they provide a poster and save or publish, **Then** the live page shows that poster in the media-review layout.
2. **Given** an author provides a valid trailer for the title, **When** readers open the review, **Then** they can start playback or reach the trailer from the page without leaving the site for unrelated destinations.
3. **Given** an author does not provide a trailer, **When** readers open the review, **Then** no empty trailer placeholder or broken media region is shown.

---

### User Story 3 - Editorial vs media layout is obviously different (Priority: P3)

A reader who alternates between a normal editorial post and a media review notices a consistent, intentional difference in layout and visual emphasis (poster-led, title treatment, optional trailer block), not merely a different headline.

**Why this priority**: The product goal is to separate media criticism from general editorial presentation.

**Independent Test**: Open one standard editorial post and one media review side by side on the same device; compare hierarchy and composition without measuring pixels.

**Acceptance Scenarios**:

1. **Given** a standard editorial article and a media review of similar length, **When** a reader views both, **Then** the media review uses a clearly different page structure centered on the title’s key art and cinematic/TV context.

---

### User Story 4 - Optional Letterboxd alignment via public RSS (Priority: P4)

The author regularly logs films on **Letterboxd** and wants the site to **optionally** reflect that habit using only what is **publicly syndicated** and **ordinary links**: on **media review pages** they may show a small **RSS-driven “recent activity”** area (from the member’s public feed) **and/or** a clear link to their Letterboxd profile. On the **About** page and in the **site footer**, only **plain outbound link(s)** to Letterboxd (e.g. profile) appear—**no** RSS-rendered lists, widgets, or feeds there. The same **site-level** Letterboxd settings (profile URL, RSS URL) back the media-review UI and the repeated links. Readers do not need a Letterboxd account. **Letterboxd’s authenticated developer API is out of scope** for this feature. A future, separate specification will cover a dedicated **“Movies / TV Shows Review”** listing or hub page—**not** part of this feature.

**Why this priority**: Improves author workflow continuity and discoverability; must not gate or replace on-site reviews.

**Independent Test**: Configure the public feed URL and/or profile link; confirm RSS-driven UI appears **only** on a media review when enabled; confirm About and footer show **links only** (no RSS block); confirm optional blocks disappear when disabled or when the feed is unavailable on review pages.

**Acceptance Scenarios**:

1. **Given** the author enables optional Letterboxd **profile link(s)**, **When** a reader opens a **media review**, the **About** page, or a page with the **footer**, **Then** they can follow a **plain labeled external link** to the author’s public Letterboxd profile where the author has enabled that link for that surface.
2. **Given** the author enables optional syndication from Letterboxd’s **public RSS**, **When** the feed is reachable and the reader opens a **media review** page, **Then** recent titles or entries appear as summarized, correctly attributed activity; **When** the reader opens the **About** page or views the **footer**, **Then** they do **not** see RSS-driven Letterboxd activity UI—only normal links if configured.
3. **Given** the RSS feed is unreachable on build or request, **When** a reader opens a **media review** that relied on the feed, **Then** the rest of the page still works and no broken RSS embed is shown; **About** and **footer** links (if any) remain ordinary links and are unaffected.

---

## Integration scope *(Letterboxd, public RSS only)*

These are **product-level** constraints for planning; they do not change P1–P3 if Letterboxd options are left off.

### In scope

- **Public RSS**: Letterboxd exposes a **public RSS feed** on member profiles for **new diary entries, reviews, and lists**. Typical URL pattern: member profile path with `/rss/` appended (e.g. `https://letterboxd.com/antoniwan/rss/` for username `antoniwan`). When used, RSS is consumed **only** to power optional **UI on media review pages** (e.g. recent activity). Format and availability are controlled by Letterboxd and may change.
- **Ordinary links**: Optional **plain** links to the author’s public Letterboxd profile (or other Letterboxd URLs) on **media review pages**, the **About** page, and/or the **site footer**—**no** RSS-driven UI on About or footer.

### Out of scope

- **Any Letterboxd API** (OAuth, authenticated endpoints, or developer API access): **not** part of this feature.
- **Third-party movie/TV database APIs** (for automatic posters, trailers, or metadata): **not** part of this feature.
- **Unofficial scrapers** or third-party wrappers that impersonate an API: **not** dependencies.
- **Dedicated “Movies / TV Shows Review” hub or index page**: deferred to a **separate specification** (not this feature).

### Core vs optional

- **Core (MUST)**: On-site media review layout; **manually** supplied poster and optional trailer.
- **Optional (MAY)**: Site-level **plain Letterboxd link(s)** on **media review pages**, **About**, and/or **footer**; optional **public RSS**-driven activity **UI** on **media review pages only** (not About, not footer).

---

### Edge Cases

- Poster image is missing or fails to load: page still shows title and review text with an acceptable fallback (no broken layout).
- Trailer URL is invalid or media unavailable: user sees a clear, non-technical fallback (e.g. hidden block or short message), not a silent failure or console-only error.
- Very long titles or franchise names: headline and poster region remain usable on narrow screens (wrapping, truncation, or spacing rules).
- TV series vs one-off film: metadata supports distinguishing TV reviews (e.g. series title, season where relevant) without confusing movie-only reviews.
- User disables motion or autoplay: trailer does not autoplay with sound in a surprising way; playback starts only after an explicit user action where platform policy requires it.
- **Letterboxd RSS** unavailable, throttled, or returns unexpected shape: optional RSS-driven UI on **media review** pages is omitted or shows a single non-alarming message; **no** impact on publishing the review itself; **About** and **footer** remain link-only surfaces with no RSS widget to break.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product MUST support a dedicated **media review** presentation for posts classified as movie or TV reviews, separate from the default editorial article layout.
- **FR-002**: Media review pages MUST be **mobile-first**: on narrow viewports, primary content (identity of the title, poster when present, opening review context) is visible with comfortable reading width and no required horizontal scrolling for core text.
- **FR-003**: Each media review MUST support a **poster image** for the reviewed work supplied by the author; when supplied, it MUST display as a primary visual anchor in the layout.
- **FR-004**: Each media review MAY include an **optional trailer**; when provided and valid, the page MUST offer an in-context way to watch or open the trailer; when omitted, MUST NOT show an empty trailer shell.
- **FR-005**: Media reviews MUST record whether the work is a **film or television** production so the page can present appropriate labeling or structure.
- **FR-006**: The inaugural published example MUST be a review of the film **Send Help (2026)** using the new template, demonstrating poster, review body, and trailer behavior per availability of assets at publish time.
- **FR-007**: Listing pages, feeds, or cards that surface the review MUST remain accurate (title, type, and imagery where the product already shows images for posts) without breaking existing editorial entries.
- **FR-008**: Publishing a complete media review MUST remain possible **without** any Letterboxd RSS or profile features; optional Letterboxd features MUST fail soft (omit optional blocks only).
- **FR-009** *(optional)*: The product MAY show **plain outbound link(s)** to the author’s public Letterboxd profile (and optionally other Letterboxd URLs) on **media review pages**, the **About** page, and/or the **site footer**, using **one site-level** configuration. **FR-009 MUST NOT** introduce RSS-driven Letterboxd UI on the **About** page or in the **footer**—**links only** there.
- **FR-010** *(optional)*: The product MAY ingest **public Letterboxd RSS** for the author’s profile to show recent diary/review/list activity **only on media review pages**, labeled as syndicated from Letterboxd, subject to feed availability, using a **site-level** feed URL. **FR-010 MUST NOT** render RSS-derived Letterboxd UI on the **About** page or in the **site footer**. **FR-010 MUST NOT** depend on Letterboxd API credentials.

### Key Entities *(include if feature involves data)*

- **Media review (content item)**: Represents one review of a film or TV work; includes review prose, classification (movie vs TV), optional year or season context, poster media, optional trailer reference, and standard metadata required elsewhere on the site (e.g. title, publication date, language) per existing content contracts. **Letterboxd** profile and RSS URLs are **site-level** settings (used for optional links site-wide and optional RSS **UI** on media review pages only), not required fields on each post.
- **Poster asset**: Image associated with the reviewed title; author-supplied; displayed in the media-review layout.
- **Trailer reference**: Optional pointer to official or approved trailer media for the same title; author-supplied URL or embed; may be absent.
- **Letterboxd public activity feed** *(optional)*: Syndicated source of recent public diary entries, reviews, and lists for a member profile, consumed **only** via its public RSS URL when the author opts in.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a representative phone-sized viewport, the reviewed title’s name and poster (when provided) appear in the first screenful of content without horizontal scrolling.
- **SC-002**: For any published media review, if a trailer is configured, **100%** of those pages expose a working, user-triggerable trailer experience; if no trailer is configured, **100%** of those pages omit trailer UI entirely (no blank trailer regions).
- **SC-003**: In a three-person informal check, **at least two of three** participants correctly identify the media review page as “different from a normal article” when compared to a standard editorial post of similar length, without coaching.
- **SC-004**: Time to locate the reviewer’s bottom-line opinion (rating, recommendation, or closing paragraph—whatever the review includes) on mobile is **no worse** than for a current editorial post of comparable word count, measured with a short usability task script (target: familiar site readers complete within **90 seconds**).
- **SC-005**: With **all** optional Letterboxd features **disabled**, authors can still publish **Send Help (2026)** and any other media review end-to-end with the same core layout guarantees as SC-001–SC-004.

## Assumptions

- **MVP path**: Authors ship reviews with **manually supplied** poster files and trailer links; **no** external movie-database or Letterboxd API integration.
- **Letterboxd**: Optional **plain profile (or other) links** may appear on **media review pages**, **About**, and **footer**; optional **RSS-driven activity UI** appears **only on media review pages**. **About** and **footer** never show RSS widgets for Letterboxd. A dedicated **Movies / TV Shows Review** index page is **not** in this spec. Behavior respects Letterboxd’s public feed format as it exists at implementation time.
- Trailers remain limited to **official or publisher-approved** sources to reduce copyright and quality risk.
- Default delivery remains compatible with **static prerendering** for reading; any RSS consumption at build time or embed for trailers must be justified in the technical plan and must respect reader privacy (no undisclosed third-party tracking).
- Multilingual, feed, and structured-data behavior follows existing site documentation for new post types; new fields and any syndicated snippets are documented where they affect feeds or discovery.
- “Send Help (2026)” remains the **first live** media review using the template; if a trailer is not yet available at launch, the page still ships with poster and text per FR-004.
