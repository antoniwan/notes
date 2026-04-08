# Cursor Agent Skills For This Repo

This project now includes custom skills in `.cursor/skills/` so Cursor Agent can apply repeatable workflows automatically.

## Installed Skills

- `post-publishing-workflow`
- `multilingual-content-qa`
- `release-quality-gate`
- `brain-science-audit`

## Where They Live

- `.cursor/skills/post-publishing-workflow/SKILL.md`
- `.cursor/skills/multilingual-content-qa/SKILL.md`
- `.cursor/skills/release-quality-gate/SKILL.md`
- `.cursor/skills/brain-science-audit/SKILL.md`

## How To Use

Use natural prompts that include the trigger context. Example prompts:

- "I updated a post in `src/content/p/`. Run the post publishing workflow and fix any frontmatter issues."
- "I added an English and Spanish version of this note. Audit translationGroup and listing behavior."
- "Run release quality gate for this branch and fix clear failures."
- "I changed brain-science analysis code. Audit for build-time regressions and cache issues."

## Learning Path (Recommended)

1. Start with `post-publishing-workflow` on one edited post.
2. Run `release-quality-gate` and review how failures are reported/fixed.
3. Practice `multilingual-content-qa` on one EN/ES pair.
4. Use `brain-science-audit` only when touching analytics/perf-sensitive areas.

## Notes

- Skills are guidance, not hardcoded automation. The agent still evaluates context.
- Best results come from specific prompts with file paths and intent.
- Keep skill files short and focused; add new skills only for repeated workflows.
