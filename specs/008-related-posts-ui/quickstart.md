# Quickstart: Verify Related Posts (008)

## Prerequisites

- `pnpm install` (repo root)
- Feature branch `008-related-posts-ui` with implementation applied

## Commands

```bash
pnpm run format:check
pnpm run check
pnpm run build
```

If frontmatter or collection schema changes:

```bash
pnpm run audit-frontmatter
```

## Manual checks (maps to spec success criteria)

1. **SC-001 / FR-004 (language + links)**
   - Open an **English** post that has related EN content: every suggestion shares language with the current page.
   - Open a **Spanish** post with related ES content: same check.
   - Confirm no link points to the current slug and all links return 200 after `pnpm run build` + static preview.

2. **Empty state (FR-001)**
   - Use a post with no overlapping tags/categories in the **same language** (or isolate via test content): confirm the related **section is absent**, not an empty card.

3. **SC-003 / SC-004 (layout + keyboard)**
   - Narrow viewport (~390px): titles do not force horizontal scroll; tap targets feel comfortable.
   - Tab through: each suggestion link and browse-all link receive visible focus in visual order.

4. **SC-002 (maintainer sample)**
   - Pick ≥10 posts (mix of EN/ES if available).
   - For each, judge whether suggestions are “reasonably related” using `contracts/related-posts-behavior.md` scoring story.
   - Track pass rate; target ≥80% per spec (editorial judgment).

5. **Reading time (Constitution I)**
   - Compare `minutesRead` on a post page with the value shown in related list for the **same** target post; they should match when `minutesRead` is populated.

## Maintainer doc check (FR-011)

- Confirm `specs/008-related-posts-ui/contracts/related-posts-behavior.md` matches actual code (weights, filters, tie-break).
- On algorithm change, update the contract in the same PR.
