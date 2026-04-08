---
name: post-publishing-workflow
description: Validates and finalizes new or updated posts in this Notes repo, including frontmatter correctness, translation fields, and required project checks. Use when creating/editing content in src/content/p, preparing a post for publish, or reviewing post metadata quality.
---

# Post Publishing Workflow

## Goal
Ship content updates safely without breaking listings, feeds, or post pages.

## Use This Skill When
- A post in `src/content/p/` is created or edited.
- Frontmatter was changed.
- A draft is being promoted to published content.

## Workflow
1. Identify touched content files under `src/content/p/`.
2. Validate frontmatter against `docs/frontmatter-spec.md`:
   - Required: `title`, `description`, `pubDate`, `language`
   - Common optional checks: `category`, `tags`, `featured`, `published`, `translationGroup`, `showComments`
   - Never add manual `readingTime`; `minutesRead` is build-generated.
3. Verify category IDs match project categories.
4. Run project checks:
   - `pnpm run check`
   - `pnpm run lint`
   - `pnpm run build`
5. If checks fail, fix issues and rerun until green.
6. Report:
   - Files audited
   - Metadata issues fixed
   - Final check status

## Post QA Checklist
- [ ] Description is concise and SEO-friendly.
- [ ] `language` is valid (`en` or `es` in this repo).
- [ ] `featured` is intentional (not accidental visibility changes).
- [ ] Draft/published flags match intent.
- [ ] Hero image path (if present) resolves to an existing file.

## Repo Style Notes
- Keep `description` plain, concise, and readable in search previews.
- Prefer hero image paths under `/images/...` that map to files in `public/images/`.
- Keep categories/tags aligned with existing repo taxonomy and avoid one-off labels unless intentional.

## Output Format
Return:
1. `Audit findings` (bullets)
2. `Fixes applied` (bullets)
3. `Validation results` (exact command pass/fail status)
