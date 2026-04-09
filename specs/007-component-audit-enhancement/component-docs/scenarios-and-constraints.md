# Supported scenarios and constraints (all components)

## Global baseline scenarios

These apply to every in-scope `.astro` component unless a batch file calls out an exception:

1. **Render**: Component renders on intended routes without Astro build errors.
2. **Static-first**: No mandatory server session or server-persisted reader state introduced by the component.
3. **Privacy**: No new third-party analytics or undisclosed trackers added via the component.
4. **Client scripts**: Any `client:*` or inline scripts preserve existing behavior (focus, localStorage, etc.) and do not leak PII to new endpoints.
5. **Accessibility**: Interactive components preserve keyboard operability and visible focus where already implemented; this audit does not mandate a full WCAG retrofit unless explicitly approved.

## Layout-specific scenarios

- **BlogLayout**: Post body, sidebar regions, mobile metadata disclosure, and TOC entry points behave as before audit.
- **BaseLayout**: Head, body wrapper, and global slot composition unchanged for consumers.
- **HomeLayout / PageLayout**: Home and generic pages compose without broken imports.

## Feature-folder scenarios

- **brain-science/\***: Charts and nav render when data props are provided; empty/error states do not crash the page.
- **post-toc/\***: TOC modal opens/closes and does not trap focus incorrectly vs. baseline.

## Constraints

- Per [spec clarifications](../spec.md): behavior changes require explicit stakeholder approval and documented rationale.
- Regression depth: all documented baseline scenarios plus cross-context checks for shared components (see [verification/verification-matrix.md](../verification/verification-matrix.md)).
