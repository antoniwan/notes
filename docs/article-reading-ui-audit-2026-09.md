# Article reading interface audit

Date: 2026-09-08. Scope: local article reading layouts and supporting controls.

## Findings and changes

| Finding in the previous layout                                                                | Change                                                                                                                                                                                                   |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop title and description competed with metadata inside a narrow 25% sidebar.             | A single visible H1, description, date, reading time, and translation links now precede the hero at every width.                                                                                         |
| A 450px hero cropped the image severely on phones and delayed the opening paragraph.          | Hero uses 16:10 below 768px and 16:9 above it.                                                                                                                                                           |
| A sidebar appeared at 1024px, squeezing the reading column on landscape tablets.              | Single centered column below 1200px; a 224px navigation rail alongside a maximum 768px article above it. Prose remains capped at 68ch.                                                                   |
| Desktop contents required a floating popup. Mobile trigger and popup occupied opposite sides. | Persistent desktop section navigation; a left-aligned mobile/tablet panel with safe-area spacing.                                                                                                        |
| Contents lacked focus management and reliable outside-click dismissal.                        | Focus moves to a section link on opening, returns on Escape/close, and moves to the reading destination after a jump. Active sections expose aria-current.                                               |
| Metadata was verbose, and read-state feedback replaced the duration.                          | Compact linked topics, three initial categories with expansion, collapsed tags, and sharing below the details. Read status and duration coexist. Rich mobile metadata remains collapsed after the prose. |
| A second main landmark was nested inside the page main.                                       | The reading body is an article associated with its visible title.                                                                                                                                        |
| Global prose clipping could cut off wide content and focus outlines.                          | Article-only overflow handling preserves focus outlines and gives tables/code horizontal scrolling.                                                                                                      |
| Reading progress included comments, related posts, and the footer.                            | Progress measures the prose extent, recalculates after layout changes, and has exact endpoints. Existing read-state storage and the 75% marking threshold remain.                                        |
| Local service-worker status overlapped mobile reading controls.                               | The development badge is hidden on article previews; floating reading controls account for safe-area insets.                                                                                             |

## Implementation

- `src/layouts/BlogLayout.astro`: article structure, responsive layout, visual hierarchy, and read-status display.
- `src/components/post-reading/PostDetails.astro`: shared topic and update details.
- `src/components/post-toc/`: responsive contents and keyboard interactions.
- `src/components/ReadingProgress.astro` and `src/utils/readingProgress.ts`: article-relative progress.
- `src/components/SocialShare.astro`: visible sidebar menu expansion and keyboard dismissal.
- `src/components/BackToTop.astro`: safe-area alignment.
- `src/components/ServiceWorkerRegistration.astro`: development badge placement.

Existing article copy, routes, category/tag vocabulary, hero assets, translation grouping, and metadata generation are preserved. This is a local preview; no release or deployment was requested.

## Verification

Browser checks on localhost:4321:

- Long article at 320, 390, 768, 1024, 1199, 1200, and 1440px: no horizontal overflow; one H1 and one main landmark.
- Desktop section jumps, active-section indication, and reset at the top.
- Mobile contents opening, Escape focus restoration, outside dismissal, and heading focus/scroll position.
- Light and dark themes; portrait tablet and landscape laptop layouts.
- English/Spanish navigation and localized contents controls.
- Recipe duration remains omitted, and translation access is retained.
- Technical article tables and code remain inside a 390px viewport with horizontal overflow available.
- Expanded categories and tags remain accessible; the desktop share menu stays inside the rail, focuses an option, and restores focus on Escape.

Representative routes: `/p/captured-not-pathetic`, `/p/my-crimson-desert-review-after-200-hours`, `/p/presenting-vastitas-omniparens`, `/p/presentando-vastitas-omniparens`, and `/p/recipes/asopao-de-pollo-en`.

Automated checks passed: formatting, Astro/type check (zero errors or warnings), ESLint, production build, and all 136 tests across 23 test files. The H1 guard was updated to assert the new single visible article title; seven progress tests cover boundaries, short articles, layout changes, and document fallback.
