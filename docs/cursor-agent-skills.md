# Cursor Skills Guide (KISS)

Use this guide to run the right Cursor AI skill in the Notes repo.

## What Skills We Have

- `astro-webmaster-notes` — use for multi-file or architecture-level work.
- `post-publishing-workflow` — use when editing posts in `src/content/p/`.
- `multilingual-content-qa` — use for EN/ES translation pairs and toggles.
- `release-quality-gate` — use before PR or merge.
- `brain-science-audit` — use when touching brain-science pages/utils.
- `content-strategy-map` — audit latest 30 posts and generate topic ideas.

## Where Skills Live

- `.cursor/skills/astro-webmaster-notes/SKILL.md`
- `.cursor/skills/post-publishing-workflow/SKILL.md`
- `.cursor/skills/multilingual-content-qa/SKILL.md`
- `.cursor/skills/release-quality-gate/SKILL.md`
- `.cursor/skills/brain-science-audit/SKILL.md`
- `.cursor/skills/content-strategy-map/SKILL.md`

## How To Use Skills (Simple)

- Tell Cursor what changed.
- Include file paths.
- Ask for one skill by name.
- Ask for fixes and verification.

Use prompts like:

- "I edited `src/content/p/my-post.md`. Use `post-publishing-workflow` and fix issues."
- "I added EN and ES versions. Use `multilingual-content-qa` and verify toggles."
- "Run `release-quality-gate` for this branch and fix clear failures."
- "I changed `src/pages/brain-science/`. Run `brain-science-audit`."
- "This touches pages, layouts, and SEO. Use `astro-webmaster-notes`."
- "Use `content-strategy-map` to audit the latest 30 posts and save a dated topic map report."

## Example: Using One Skill (`content-strategy-map`)

- Copy/paste this prompt:
- "Use `content-strategy-map` now. Audit the latest 30 published posts in `src/content/p/`, build a topic map (core themes, adjacent themes, gaps), suggest 10 essay ideas with one-line thesis each, and save the result to `docs/materials/YYYY-MM-DD-content-strategy-map.md`."
- Follow-up prompt:
- "From that report, pick the top 3 ideas to publish this month and explain why."

## Quick Rules

- Be specific. Generic prompts give generic results.
- Include intent: "fix", "audit", "verify", or "prepare for PR".
- For bigger changes, start with `astro-webmaster-notes`.
- For publishing content, always run `post-publishing-workflow`.
- Before merge, run `release-quality-gate`.
- For writing direction, run `content-strategy-map` and keep the dated report.

## Honest Notes

- Skills help a lot, but they are not magic.
- You still need to review the final changes.
- Keep skill files short and practical.
