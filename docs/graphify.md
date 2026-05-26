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
