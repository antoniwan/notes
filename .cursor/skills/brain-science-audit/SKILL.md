---
name: brain-science-audit
description: Audits brain-science pages and analytics pipeline behavior, with focus on build cost, cache usage, and data integrity in this Notes repo. Use when changing src/pages/brain-science, src/utils/brainScience, or diagnosing slow builds tied to analysis features.
---

# Brain Science Audit

## Goal
Protect analytics feature correctness while containing build-time cost.

## Relevant Areas
- `src/pages/brain-science/`
- `src/utils/brainScience/`
- `src/data/.brain-science-cache/`
- `docs/performance-optimization.md`
- `docs/TECHNICAL-AUDIT.md`

## Workflow
1. Identify what changed in brain-science pages/utils.
2. Verify cache-aware behavior remains intact (no unnecessary full recomputation paths).
3. Run focused validation:
   - `pnpm run check`
   - `pnpm run build`
4. Inspect build output for regressions in brain-science generation time.
5. If regression appears:
   - Find repeated expensive operations.
   - Consolidate compute-once/read-many flow.
   - Re-run build and compare.

## Guardrails
- Avoid moving heavy analysis to client runtime.
- Keep generated/cache artifacts deterministic and reviewable.
- Favor small, traceable changes to analysis logic.

## Output Format
Return:
1. `Audit scope`
2. `Performance/correctness findings`
3. `Fixes applied`
4. `Before/after validation notes`
