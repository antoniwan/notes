# Quickstart: Tag Content Links Prelude

## Goal

Implement and verify the sentence-style content-form prelude on the tags page with deterministic ordering and normalized plural labels.

## 1) Implement

1. Update `src/pages/tag/index.astro` to compute prelude entries from existing tag counts.
2. Add/organize feature logic so it:
   - normalizes tag variants into canonical writing-form labels,
   - filters to content-form tags only,
   - sorts by count desc + alphabetical tie-break,
   - outputs canonical plural labels.
3. Render the prelude section before popular/all tag sections.
4. Preserve existing tag cloud and empty state behavior.

## 2) Manual verification

1. Run `pnpm run dev`.
2. Open `/tag`.
3. Confirm:
   - Prelude appears before tag cloud when at least one content-form tag exists.
   - Prelude links navigate to expected tag pages.
   - Order follows count desc; ties alphabetically.
   - Labels are canonical plurals only.
   - Prelude hides when no content-form tags are present.

## 3) Quality gates

Run:

- `pnpm run check`
- `pnpm run build`
- `pnpm run format:check`

All commands must pass before merge.
