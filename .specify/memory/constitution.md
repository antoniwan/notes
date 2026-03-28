<!--
Sync Impact Report
- Version change: (unversioned template) → 1.0.0
- Modified principles: N/A (initial adoption; placeholders replaced in full)
- Added sections: Core Principles (5), Platform & Content Constraints, Development Workflow & Quality Gates, Governance
- Removed sections: N/A (template placeholder sections only)
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ Constitution Check gates aligned
  - .specify/templates/spec-template.md — ✅ Notes/content pointer added
  - .specify/templates/tasks-template.md — ✅ Path conventions for Astro layout
  - .specify/templates/checklist-template.md — ✅ N/A (generic; no constitution drift)
  - .cursor/commands/speckit.constitution.md — ✅ N/A (agent-generic)
- Follow-up TODOs: None
-->

# Notes Constitution

## Core Principles

### I. Content schema and editorial contracts

New or changed posts under `src/content/p/` MUST conform to
[docs/frontmatter-spec.md](../../docs/frontmatter-spec.md). Category identifiers MUST exist in
`src/data/categories.ts`. Bilingual pairs MUST use a shared `translationGroup` and the featured
pattern described in [docs/multilingual-setup.md](../../docs/multilingual-setup.md). Reading time
MUST come from the remark pipeline (`minutesRead`); MUST NOT reintroduce manual reading-time
fields in frontmatter.

**Rationale:** RSS/JSON feeds, SEO, translation switching, and layout logic assume stable, documented
metadata. Drift breaks listings, feeds, and structured data.

### II. Static-first delivery

The default experience for reading posts MUST remain compatible with static prerendering. New
dynamic surfaces (server routes, SSR-only behavior, mandatory cookies) MUST be justified in the
feature spec and plan, scoped minimally, and documented in `docs/` when user-visible.

**Rationale:** Keeps hosting simple, improves cacheability and performance, and matches the current
Astro + optional Vercel adapter model.

### III. Verification gates before merge

For changes merged to the main development line: `pnpm run build` MUST succeed. TypeScript and
Astro template changes MUST pass `pnpm run check`. Formatting MUST pass `pnpm run format:check` when
files under Prettier coverage are touched. Content, feed, or sitemap work SHOULD run
`pnpm run validate-feeds` and `pnpm run audit-frontmatter` when post metadata or feed generators
change. Structured data or JSON-LD changes SHOULD run `pnpm run validate-structured-data`.

**Rationale:** The codebase is content- and UI-heavy; exhaustive unit TDD is not uniformly enforced
today. These gates match actual tooling and catch the highest-risk regressions honestly.

### IV. Reader privacy and transparent UX

Reading progress, Guided Path state, and similar behaviors MUST remain browser-local
(`localStorage` or equivalent client-only storage) unless a feature spec explicitly introduces
server-side persistence and documents the privacy impact. MUST NOT add third-party analytics or
trackers without disclosure in project documentation and the relevant spec.

**Rationale:** The site presents personal essays; audience trust depends on predictable, honest data
handling.

### V. Discoverability and feed integrity

Changes that affect titles, descriptions, canonical URLs, Open Graph behavior, RSS/JSON feeds, or
Schema.org output MUST keep feeds and validators consistent with
[docs/structured-data-optimization.md](../../docs/structured-data-optimization.md) and related
docs. Public API behavior (e.g. `GET /api/quotes`) MUST stay documented in `docs/` when contracts
change.

**Rationale:** Syndication and search depend on stable, valid outputs; silent regressions are hard
to spot without intentional checks.

## Platform & Content Constraints

- **Stack (current):** Astro 6.x, TypeScript, Tailwind CSS, MDX, pnpm, Sharp; optional Vercel
  deployment and Remark42 comments per [README.md](../../README.md) and `docs/`.
- **Licensing:** Site content under [CONTENT_LICENSE.md](../../CONTENT_LICENSE.md) (CC BY-NC-SA
  4.0); code under [LICENSE](../../LICENSE) (MIT). Features MUST NOT imply a different license
  without explicit governance amendment.
- **Component placement:** Feature-specific components MUST live under
  `src/components/<feature>/` and primarily serve pages under the matching route segment (e.g.
  `src/pages/brain-science/`). Shared UI remains at `src/components/` root. This reduces coupling
  and matches existing README conventions.
- **Performance posture:** Avoid patterns that multiply expensive work per page at build or request
  time (e.g. redundant `getCollection` in global layouts, repeated filesystem walks in hot paths)
  without measurement and justification; see [docs/TECHNICAL-AUDIT.md](../../docs/TECHNICAL-AUDIT.md)
  for known scaling risks.

## Development Workflow & Quality Gates

- **Package manager:** pnpm is the canonical install/run tool for this repository.
- **Documentation:** User-visible behavior or setup changes MUST update the relevant `docs/` file
  or [README.md](../../README.md) in the same change set when practical.
- **Spec-driven work:** Non-trivial features SHOULD use the Specify workflow (`spec.md`, `plan.md`,
  `tasks.md` under `specs/`) so constitution checks are traceable in reviews.
- **Review:** Reviewers SHOULD confirm constitution principles relevant to the PR (content,
  privacy, static-first scope, validators) are satisfied or explicitly waived with rationale in
  the Complexity Tracking table of the plan when applicable.

## Governance

This constitution supersedes ad-hoc coding preferences for work tracked through this repository.
Amendments MUST update `.specify/memory/constitution.md`, bump **Version** per semantic rules below,
set **Last Amended** to the amendment date (ISO `YYYY-MM-DD`), and propagate material constraint
changes to `.specify/templates/` and agent commands when templates drift.

**Versioning policy:** MAJOR — removal or incompatible redefinition of a principle or mandatory
constraint. MINOR — new principle or materially expanded obligation. PATCH — clarification, typo,
or non-semantic wording.

**Compliance:** Maintainers SHOULD spot-check merged work against this document during significant
releases. Feature plans MUST include a Constitution Check that references the principles above.

**Version**: 1.0.0 | **Ratified**: 2026-03-28 | **Last Amended**: 2026-03-28
