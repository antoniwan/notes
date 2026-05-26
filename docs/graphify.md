# Graphify (this repo)

[Graphify](https://github.com/safishamsi/graphify) maps this project into a queryable knowledge graph so you (and Cursor) can ask architecture questions without grepping the whole tree. Official install and full command reference: [safishamsi/graphify](https://github.com/safishamsi/graphify).

## Install (once per machine)

Requires Python 3.10+.

```bash
uv tool install graphifyy
graphify cursor install --project
```

The PyPI package is `graphifyy` (double-y); the CLI is still `graphify`.

On **Windows PowerShell**, use `graphify .` not `/graphify .` (leading `/` is a path separator).

## Build or refresh the graph

From the repo root:

```bash
graphify update .
```

Or in Cursor chat: `/graphify .`

- **Code changes** — `graphify update .` is AST-only (fast, no API key).
- **Docs / papers / images** — use `/graphify . --update` in the assistant, or headless `graphify extract` with `GEMINI_API_KEY` / `GOOGLE_API_KEY` (see upstream docs).

Outputs land in `graphify-out/`:

| File | Use |
| ---- | --- |
| `graph.html` | Open in a browser — explore nodes and edges |
| `GRAPH_REPORT.md` | Highlights, god nodes, suggested questions |
| `graph.json` | Full graph for CLI queries |
| `wiki/index.md` | Agent-friendly wiki (when built with `--wiki`) |

## Query from the terminal

```bash
graphify query "how does post routing work?"
graphify path "BlogLayout" "getCollection"
graphify explain "translationGroup"
```

Prefer these scoped results over reading all of `GRAPH_REPORT.md` or running broad greps.

## Suggested questions (often skip them here)

`GRAPH_REPORT.md` includes auto-generated “Suggested Questions” from graph metrics (high betweenness, weak cohesion, and similar). Those prompts do not know Astro layout hierarchy.

In this repo you will often see questions like “Why does `BaseLayout` connect tags, read state, brain science, RSS, …?” That is usually not a design smell. `BaseLayout` is the parent of `PageLayout`, `HomeLayout`, and `BlogLayout`; most routes sit under that shell, so the graph treats it as a bridge between communities even when the real story is just **inheritance plus sibling imports on each page**.

Treat that section as noise for conventional layout trees. Better prompts for this codebase:

- What does `BlogLayout` add that post routes use but listing pages do not?
- `graphify path "ReadStateServiceInit" "PostCard"` — how does read state reach cards?
- Where do `translationGroup` and `LanguageToggle` meet in code?

Use **God Nodes** and **Surprising Connections** when they point at cross-file doc↔code links; ignore bridge questions whose answer is “it’s the base layout.”

## “Isolated nodes” in Knowledge Gaps

The report’s **999 isolated node(s)** (your count may vary slightly after rebuilds) means **degree ≤ 1** — at most one graph edge — not “unused in the app.” Graphify already excludes file hubs, doc concepts, and `rationale` nodes from that list.

For this repo, almost none of them are bugs. Typical buckets:

| Source | Why it looks isolated | Fix in the app? |
| ------ | --------------------- | --------------- |
| `src/data/socialImageFingerprints.json` (~333) | AST emits one node per JSON path (`/images/...`, `sha256`, `social`) with almost no edges | No — build artifact map; listed in `.graphifyignore` |
| `package.json` keys (`name`, `type`, `version`, …) (~46) | JSON field leaves | No — config noise |
| Brain Science `.astro` pages (~137) | Page-local variables (`pageInfo`, `chartData`, …) with a single `contains` edge | No — normal Astro frontmatter scope |
| Other code leaves (~461) | Module constants, `__dirname`, script paths, etc. | Usually no |

Doc-only concepts from semantic extraction are **not** counted in that 999; they are separate leaf nodes.

After ignoring fingerprint JSON, expect the gap line to drop by roughly a third on the next `/graphify` or `graphify update .`. Remaining “isolated” entries are mostly AST granularity, not missing architecture.

## Cursor behavior

`.cursor/rules/graphify.mdc` tells the agent to:

1. Run `graphify query` (or `path` / `explain`) when `graphify-out/graph.json` exists.
2. Use `graphify-out/wiki/index.md` when present.
3. Fall back to `GRAPH_REPORT.md` only for broad architecture review.
4. Run `graphify update .` after editing code in a session.

## Optional automation

```bash
graphify hook install   # AST rebuild on git commit; merges graph.json on conflicts
```

Upstream recommends committing `graphify-out/` (and ignoring `graphify-out/manifest.json` and `graphify-out/cost.json` in `.gitignore` if you adopt team workflow).

## Learn more

- [Graphify README](https://github.com/safishamsi/graphify) — install, platforms, privacy, full command list
- [graphify-out/GRAPH_REPORT.md](../graphify-out/GRAPH_REPORT.md) — report for this checkout (after a build)
