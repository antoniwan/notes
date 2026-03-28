# Quickstart — Media review template (implementation)

## Prerequisites

- `pnpm install`
- Branch `001-media-review-template` checked out
- Read [spec.md](./spec.md) and [plan.md](./plan.md)

## Implement in order

1. **Category** — Add `media-reviews` (or chosen id) to `src/data/categories.ts`; mirror in `docs/frontmatter-spec.md`.
2. **Schema** — Extend `src/content.config.ts` with `template`, `mediaType`, `workTitle`, `releaseYear`, optional `seasonLabel`, `trailerUrl` (and constraints when `template === 'media-review'`).
3. **Components** — Create `src/components/media-review/` (layout sections, trailer, optional `LetterboxdRecent`).
4. **Layout** — Either `MediaReviewLayout.astro` or conditional sections in `BlogLayout`; wire from `src/pages/p/[...slug].astro` based on `post.data.template`.
5. **Letterboxd** — Add `src/config/letterboxd.ts` + `src/utils/letterboxdRss.ts`; wire plain links into `Footer.astro` and `about.astro`; RSS component **only** in media review layout.
6. **Content** — Add Send Help (2026) post under `src/content/p/` with real frontmatter.
7. **Docs** — Update `docs/frontmatter-spec.md` for new fields.
8. **Validate** — `pnpm run build && pnpm run check && pnpm run format:check`; then `audit-frontmatter`, `validate-feeds`, `validate-structured-data` if applicable.

## Optional env (local / Vercel)

```bash
# Optional; leave unset to disable Letterboxd features
LETTERBOXD_PROFILE_URL=https://letterboxd.com/yourusername/
LETTERBOXD_RSS_URL=https://letterboxd.com/yourusername/rss/
```

## Definition of done (engineering)

- [ ] Media review template visually distinct on mobile (SC-001 / P3)
- [ ] Trailer works or is absent with no empty chrome (SC-002)
- [ ] Letterboxd RSS UI only on media review pages; About/footer links only
- [ ] Gates pass per plan Constitution Check
