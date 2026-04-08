---
name: content-strategy-map
description: Audits the latest 30 posts in this Notes repo and produces a practical topic map with suggested essay ideas. Use when planning the next writing cycle, identifying theme gaps, or generating content suggestions from existing posts. Saves a dated report in-repo as reusable material.
---

# Content Strategy Map (Last 30 Posts)

## Goal

Turn recent publishing history into a clear map of what to write next.

## Use This Skill When

- The user asks for topic ideas, theme planning, or editorial direction.
- The user wants suggestions based on their own content (not generic internet prompts).
- You need a reusable, dated audit saved in the repo.

## Scope

- Analyze the most recent 30 posts from `src/content/p/`.
- Use published content unless the user asks to include drafts.
- Work from frontmatter + body signals (title, description, category, tags, tone, repeated concepts).

## Workflow

1. Identify the latest 30 posts by `pubDate`.
2. Extract key signals:
   - recurring themes
   - category/tag concentration
   - language split (`en` / `es`)
   - tone patterns (for example reflective, practical, critical)
3. Build a **topic map**:
   - Core themes (already strong)
   - Adjacent themes (natural expansions)
   - Underused themes (clear gaps)
4. Propose essay ideas:
   - 10 ideas minimum
   - each with: title draft, one-line thesis, why it fits now
5. Save report to:
   - `docs/materials/YYYY-MM-DD-content-strategy-map.md`
6. Keep suggestions grounded in repo voice and existing themes.

## Guardrails

- Be specific, not generic.
- Prefer "next logical step" ideas over random novelty.
- Do not force trends that conflict with the repo's identity.
- Keep output practical: map + ideas + rationale.

## Report Template

Use this structure in the saved file:

1. `Snapshot`
   - date
   - number of posts audited
   - included/excluded rules (published/draft)
2. `Theme Map`
   - core themes
   - adjacent themes
   - gaps
3. `What To Write Next`
   - numbered essay ideas with thesis + fit reason
4. `30-60 Day Plan`
   - suggested publishing sequence (lightweight)

## Output Format (Chat Response)

Return:

1. `Audit path` (exact saved file path)
2. `Top 3 strategic takeaways`
3. `Top 5 suggested essays`
