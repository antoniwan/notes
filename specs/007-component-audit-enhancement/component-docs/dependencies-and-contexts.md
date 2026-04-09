# Dependencies and usage contexts

## Upstream dependencies (typical)

- **Layouts** (`src/layouts/*.astro`) compose **global shell** components: `Header.astro`, `Footer.astro`, `MobileNav.astro`, `BaseHead.astro`, and feature wrappers.
- **Pages** under `src/pages/` import layouts and pass collections/props into cards, lists, and MDX content.
- **Data** from `src/data/*.ts` feeds navigation, categories, and some feature config.

## Cross-context (shared) components

High fan-out surfaces (verify on multiple routes):

| Path                                                  | Contexts                        |
| ----------------------------------------------------- | ------------------------------- |
| `src/components/Header.astro`                         | All layouts using global header |
| `src/components/Footer.astro`                         | Base layout footers             |
| `src/components/BaseHead.astro`                       | All pages using standard head   |
| `src/components/Navigation.astro` / `MobileNav.astro` | Desktop + mobile nav            |
| `src/components/Container.astro`                      | Many pages                      |
| `src/components/StructuredData.astro`                 | SEO on indexable pages          |
| `src/layouts/BaseLayout.astro`                        | Wraps most user-facing pages    |

## Downstream / embedded

- **Comments.astro**: Depends on configured comment host (e.g. Remark42); treat as external script boundary.
- **ServiceWorkerRegistration.astro**: Depends on build/service worker availability.
- **ReadStateServiceInit.astro**, **ReadingProgress.astro**, **ThemeToggle.astro**: Browser-local state only.

## Notes

Exact import graph can be refreshed with repository search for each `componentId` path; this document captures the architectural pattern for regression planning.
