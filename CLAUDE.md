# Notes: working in this repo

Antonio's public notebook (Astro 7, pnpm, Vercel). Start with the [README](README.md); this file holds the rules an agent must not break.

## Read before changing

- **Any page, component, or style:** [docs/design-system.md](docs/design-system.md). Colors, type, widths, the Field Guide look, poem effects, titles, contrast.
- **A post's frontmatter:** [docs/frontmatter-spec.md](docs/frontmatter-spec.md).
- **A Field Guide entry:** [docs/field-guide.md](docs/field-guide.md).
- **Anything Spanish:** [docs/multilingual-setup.md](docs/multilingual-setup.md).

## Settled rules

- Spanish is Puerto Rican Spanish: `es_PR` / `es-PR` in Open Graph, JSON-LD, dates, and feeds. Never `es_ES`. hreflang stays plain `es` on purpose.
- Purple chrome everywhere; gold only inside the Field Guide. No HRs or boxes on Field Guide shelves.
- Poem pages: Pond, Tide, and Lantern. Not Ink, not Drift.
- Titles: `Title · Notes`; never the full name in a tab or share title.
- Text contrast is at least 4.5:1 in both themes.
- A block never caps its own width, and spacing stays on the 4px grid (`pnpm run lint:tokens`).
- Never publish a post (merge it live, or flip `draft`) without Antonio's go-ahead for that post, and never without a hero image. Drafts live in the private `notes-drafts` repo, not as PRs here.

## Before a PR

```bash
pnpm test && pnpm run check && pnpm run lint && pnpm run lint:css && pnpm run lint:tokens && pnpm run format:check
pnpm run build && pnpm run validate-generated-content && pnpm run validate-feeds
```

A version bump in `package.json` needs a matching `CHANGELOG.md` entry, newest first. Every push to `main` deploys, and Vercel's free plan allows 100 deploys a day, so batch changes into one PR where you can.
