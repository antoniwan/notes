---
name: astro-webmaster-notes
description: Principal Astro/web development orchestrator for this Notes repo. Guides architecture, content-system safety, SEO/schema consistency, and performance-aware implementation. Use when requests span multiple areas (Astro pages/layouts/components, content, metadata, feeds, build behavior), or when a change needs project-wide technical judgment.
---

# Astro Webmaster (Notes)

## Goal
Make high-quality, low-regression decisions across this Astro codebase while preserving project conventions and build performance.

## Use This Skill When
- A task touches multiple areas (for example `src/pages`, `src/layouts`, `src/components`, `src/content`, `src/utils`).
- The user asks for a "best way" or architectural decision.
- A change may affect SEO, feeds, content rendering, or build cost.
- You need to coordinate existing repo skills instead of solving in one narrow pass.

## Repo Anchors
- Content model: `src/content.config.ts`
- Post content: `src/content/p/`
- Frontmatter spec: `docs/frontmatter-spec.md`
- Multilingual behavior: `docs/multilingual-setup.md`
- SEO/meta/structured data logic: `src/utils/seo.ts`, `src/utils/structuredData.ts`
- Performance notes: `docs/performance-optimization.md`

## Decision Heuristics (Map, Not Encyclopedia)
1. **Safety first**: preserve behavior unless user asked to change behavior.
2. **Smallest coherent change**: prefer minimal edits with clear intent.
3. **Server/build over client**: avoid moving heavy work to client runtime.
4. **Single source of truth**: avoid duplicating metadata logic in multiple places.
5. **Content integrity**: frontmatter and translation consistency are non-negotiable.

## Orchestration Rules
- If content/frontmatter changes are involved, apply `post-publishing-workflow`.
- If EN/ES pairing or toggle/listing issues are involved, apply `multilingual-content-qa`.
- If brain-science pages/utils are touched, apply `brain-science-audit`.
- Before final handoff on substantial changes, apply `release-quality-gate`.

## Implementation Checklist
- [ ] Confirm affected scope (files/routes/components).
- [ ] Identify behavior-sensitive surfaces (SEO, feeds, listings, routing, metadata).
- [ ] Implement minimal changes with repo style.
- [ ] Validate assumptions with focused reads/searches before editing.
- [ ] Run appropriate checks for the change scope.

## Validation Strategy
- **Small localized edits**: run targeted validation first (at least `pnpm run check`).
- **Cross-cutting or risky edits**: run full gate (`format:check`, `check`, `lint`, `build`).
- **Content-facing edits**: ensure frontmatter/schema compatibility and build success.

## Output Format
Return:
1. `Scope and decision` (what changed and why this approach)
2. `Risks considered` (what could break and how it was avoided)
3. `Validation run` (commands + pass/fail)
4. `Follow-ups` (optional, only if useful)
