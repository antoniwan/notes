# Quickstart: Floating Post Table of Contents

## 1) Confirm branch and artifacts

1. Ensure current branch is `002-post-toc-modal`.
2. Review:
   - `specs/002-post-toc-modal/spec.md`
   - `specs/002-post-toc-modal/plan.md`
   - `specs/002-post-toc-modal/research.md`
   - `specs/002-post-toc-modal/data-model.md`
   - `specs/002-post-toc-modal/contracts/toc-behavior.md`

## 2) Implementation targets

1. Add TOC feature components under `src/components/post-toc/`.
2. Integrate TOC UI in `src/layouts/BlogLayout.astro`.
3. Reuse heading data from `src/pages/p/[...slug].astro`.
4. Validate the latest leadership post and one long-read post with added headings as needed.

### Current implementation notes

- `PostTocModal.astro` provides the floating trigger and modal UI.
- `postToc.client.ts` handles open/close state, active-link highlighting, and mobile auto-close on section select.
- `src/pages/p/[...slug].astro` now generates duplicate-safe heading slugs.
- `src/content/p/on-leadership-and-leadership-adjacent-things-april-2026.md` includes section headings for TOC validation.

## 3) Mobile-first acceptance checks

1. On mobile viewport, verify compact `Contents` trigger is visible.
2. Verify TOC opens only after tap.
3. Select a section and confirm:
   - Reader jumps to expected section.
   - Modal closes immediately.
4. Re-open TOC and verify manual close works.

## 4) Desktop acceptance checks

1. Verify TOC remains discoverable and visually polished.
2. Verify selecting sections navigates correctly in-page.
3. Verify the UI does not obstruct core reading flow.

## 5) Quality gates

Run:

1. `pnpm run check`
2. `pnpm run build`
3. `pnpm run format:check`

## 6) Done criteria

- All acceptance scenarios from spec pass.
- Mobile-first behavior from clarifications is implemented as contracted.
- Visual style and legibility pass stakeholder qualitative review.
