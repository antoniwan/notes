# Component batches (deterministic)

Split rule: sort all in-scope `.astro` paths, assign `CMP-001`… in order, then:

- **Batch A**: CMP-001–CMP-016
- **Batch B**: CMP-017–CMP-032
- **Batch C**: CMP-033–CMP-048

| Batch | Owner    | Reviewer | componentId range |
| ----- | -------- | -------- | ----------------- |
| A     | _assign_ | _assign_ | CMP-001–CMP-016   |
| B     | _assign_ | _assign_ | CMP-017–CMP-032   |
| C     | _assign_ | _assign_ | CMP-033–CMP-048   |

## Shared helpers (optional enhancement targets)

Listed for T027 when explicitly approved; not part of CMP-ID sequence unless a follow-up audit adds them.

- `src/utils/` — utility modules (audit only if touched for enhancement).
- `src/data/` — static data modules (audit only if touched for enhancement).

## Batch membership

### Batch A

- `CMP-001` → `src/components/BackToTop.astro`
- `CMP-002` → `src/components/BaseHead.astro`
- `CMP-003` → `src/components/Breadcrumbs.astro`
- `CMP-004` → `src/components/CategoryCard.astro`
- `CMP-005` → `src/components/Chapter.astro`
- `CMP-006` → `src/components/Comments.astro`
- `CMP-007` → `src/components/Container.astro`
- `CMP-008` → `src/components/DefaultImage.astro`
- `CMP-009` → `src/components/Disclaimer.astro`
- `CMP-010` → `src/components/FeaturedWritingsRotator.astro`
- `CMP-011` → `src/components/Footer.astro`
- `CMP-012` → `src/components/FormattedDate.astro`
- `CMP-013` → `src/components/Header.astro`
- `CMP-014` → `src/components/HighlightsMasonry.astro`
- `CMP-015` → `src/components/ImageRotator.astro`
- `CMP-016` → `src/components/LanguageToggle.astro`

### Batch B

- `CMP-017` → `src/components/LatestWatched.astro`
- `CMP-018` → `src/components/LazyPosts.astro`
- `CMP-019` → `src/components/Logo.astro`
- `CMP-020` → `src/components/MobileNav.astro`
- `CMP-021` → `src/components/Navigation.astro`
- `CMP-022` → `src/components/NotFoundQuote.astro`
- `CMP-023` → `src/components/PageHeader.astro`
- `CMP-024` → `src/components/PerformanceMonitor.astro`
- `CMP-025` → `src/components/PostCard.astro`
- `CMP-026` → `src/components/ReadStateServiceInit.astro`
- `CMP-027` → `src/components/ReadingProgress.astro`
- `CMP-028` → `src/components/RelatedPosts.astro`
- `CMP-029` → `src/components/SearchBar.astro`
- `CMP-030` → `src/components/ServiceWorkerRegistration.astro`
- `CMP-031` → `src/components/SocialShare.astro`
- `CMP-032` → `src/components/StructuredData.astro`

### Batch C

- `CMP-033` → `src/components/TagCard.astro`
- `CMP-034` → `src/components/TagCloud.astro`
- `CMP-035` → `src/components/TagDisplay.astro`
- `CMP-036` → `src/components/TagSystem.astro`
- `CMP-037` → `src/components/ThemeToggle.astro`
- `CMP-038` → `src/components/brain-science/BarChart.astro`
- `CMP-039` → `src/components/brain-science/BrainScienceLayout.astro`
- `CMP-040` → `src/components/brain-science/BrainScienceNav.astro`
- `CMP-041` → `src/components/brain-science/MetricCard.astro`
- `CMP-042` → `src/components/brain-science/ScatterChart.astro`
- `CMP-043` → `src/components/brain-science/TimeSeriesChart.astro`
- `CMP-044` → `src/components/post-toc/PostTocModal.astro`
- `CMP-045` → `src/layouts/BaseLayout.astro`
- `CMP-046` → `src/layouts/BlogLayout.astro`
- `CMP-047` → `src/layouts/HomeLayout.astro`
- `CMP-048` → `src/layouts/PageLayout.astro`
