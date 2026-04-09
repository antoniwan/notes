# Audit scope: production-relevant components

## In scope

- All `.astro` components under `src/components/` that ship in production builds (shared UI, feature folders `about/`, `brain-science/`, `post-toc/`).
- Layout shells under `src/layouts/` (`BaseLayout`, `BlogLayout`, `HomeLayout`, `PageLayout`).
- Shared helpers **when listed** in `component-batches.md` under the shared-helper list (`src/utils/`, `src/data/`). Helpers are included only when an enhancement or audit explicitly targets them; default inventory focuses on `.astro` surfaces.

## Out of scope (excluded)

- Test fixtures, prototypes, and scratch files (none identified under `src/components/` at audit time).
- Non-UI modules not enumerated as shared helpers in `component-batches.md` (ordinary utilities consumed only indirectly).
- Content under `src/content/p/` (covered by editorial specs, not this component audit).
- Third-party scripts embedded in components (e.g. comment widgets): behavior documented as dependency; vendor code not rewritten here.

## Production-relevant definition

A file is production-relevant if it participates in prerendered or client-rendered site UI in normal visitor flows (navigation, posts, brain-science, home, errors, SEO head).
