---
name: release-quality-gate
description: Runs the Notes project pre-merge quality gate and resolves clear failures using repository conventions. Use when preparing a PR, validating release readiness, or after broad edits across Astro components, content, and utilities.
---

# Release Quality Gate

## Goal
Ensure changes are merge-ready with the same checks used in project docs and CI.

## Gate Commands
Run in this order:

1. `pnpm run format:check`
2. `pnpm run check`
3. `pnpm run lint`
4. `pnpm run build`

## Workflow
1. Run the gate commands in sequence.
2. If a command fails:
   - Read the error.
   - Apply the smallest safe fix.
   - Re-run the failing command, then continue the sequence.
3. For content-only changes, still run full gate because Astro collection and build checks can fail on frontmatter/content.
4. Summarize unresolved blockers separately from fixed issues.

## Fix Strategy
- Prefer source fixes over disabling rules.
- Keep changes scoped; avoid unrelated refactors.
- Preserve existing project style and naming.

## Output Format
Return:
1. `Gate status` with pass/fail per command
2. `Fixes applied`
3. `Remaining blockers` (if any)
4. `Merge-readiness` (yes/no with reason)
