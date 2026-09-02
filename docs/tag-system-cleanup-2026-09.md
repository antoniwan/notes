# Tag system cleanup — continuity report (2026-09-02)

Branch: `cursor/tag-system-cleanup`  
Status: ready to land on `main` as a checkpoint, then branch for remaining reader-first work.

This is the handoff. Merge this so later branches do not re-litigate the principle, the pipeline, or the blast radius.

## Principle (do not regress)

The site is called Notes. Every writing is already a note.

Tags exist so a **reader** can browse, navigate, map ideas, and follow connections. They do not exist for the author, the CMS, SEO, specs, or Writing Insights.

Canonical test: would a stranger click this tag to find more of that idea?

Source of truth:

- Policy: [`docs/tag-policy.md`](./tag-policy.md)
- Agent rule (always on): `.cursor/rules/tag-reader-first.mdc`
- Vocabulary + strip list: `src/data/tagVocabulary.ts` (`STRIPPED_TAGS` drops `notes` / `note` / `nota` / `notas`)

Never tag `notes`. Canonicalize strips it. `/tag/notes` 301s to `/tag` (restart dest after this lands; dest can 404 until `astro.config` reloads redirects).

---

## Snapshot vs the original audit

89 published writings.

|                                 | 2026-09-02 original audit                                | This checkpoint                                              |
| ------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| Canonical unique tags           | 252                                                      | 230                                                          |
| Avg tags per post               | 11.3                                                     | ~8.96                                                        |
| Posts over the 12-tag cap       | 22 (max 21)                                              | 0 (max 12)                                                   |
| `notes` as a browse tag         | aliased into `reflection`, then briefly added to 8 posts | stripped; 0 posts                                            |
| Spanish chips (`limites`, etc.) | 404 in production                                        | 301 to English canonical rooms                               |
| Related tags                    | global popularity                                        | co-occurrence                                                |
| `/tag` prelude                  | SSR then client `Math.random()`                          | deterministic idea map; no “I’ve written #memoirs” inventory |
| Preferred / weights / Maslow    | three disagreeing lists                                  | derived from preferred list (113 slugs)                      |

The mid-cleanup experiment of tagging eight writings `notes` was a detour (prelude/spec, not readers). It is reversed in this checkpoint.

---

## Does this affect other sections? Yes.

Tags are not a `/tag`-only feature. The collection schema canonicalizes `tags` at load (`src/content.config.ts`). Everything that reads `post.data.tags` sees the cleaned array.

### Readers (visible)

| Surface                 | What changed                                                                                                                                                                               | What to check after merge                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `/tag`                  | Prelude is a deterministic idea map. Subtitle is “Follow a room…”. Busy rooms have blurbs. No `#notes`. No author-form inventory line.                                                     | Open `/tag`. Confirm idea-map subtitle, no notes chip, no “I’ve written” line.     |
| `/tag/<slug>`           | Titles from `getTagMetadata` (humanized preferred names). Related row is co-occurrence. No `/tag/notes` page.                                                                              | `/tag/parenting`, `/tag/puerto-rico`, `/tag/poems`, `/tag/limites` → `boundaries`. |
| Post pages              | Chips are canonical English slugs. Eight titled-notes posts lost the `notes` chip. Over-tagged posts were trimmed to ≤12.                                                                  | Respect, Self-Control, Note to Self pair, etc.                                     |
| Continue reading        | `findRelatedPosts` still scores shared tags + **weights**. Non-preferred tags no longer get hand weights (e.g. old `fitness: 7` → default 1). Order of related posts can shuffle slightly. | Spot-check 3–4 posts’ related row.                                                 |
| Search                  | Tag documents in the client index: names/weights from metadata; no `notes` entry. Post records still include their tag arrays.                                                             | Search `parenting`, `poems`; `notes` should not be a tag hit.                      |
| 404                     | Chips use live content tags, not `TAG_WEIGHTS` keys.                                                                                                                                       | Trigger a missing URL; chips should be real rooms.                                 |
| RSS                     | `<category>` now includes **tags as well as site categories**.                                                                                                                             | One item in `/rss.xml`.                                                            |
| JSON Feed               | `tags` is **tags only**, not categories concatenated.                                                                                                                                      | One item in `/feed.json`.                                                          |
| Sitemap                 | Tag URLs lastmod from canonical tags. No `/tag/notes`. Alias paths are redirects, not sitemap entries.                                                                                     | Build sitemap; no notes URL.                                                       |
| JSON-LD / meta keywords | `generateKeywords` and article keywords still join tags. Fewer / different slugs on trimmed posts.                                                                                         | View-source on one trimmed post.                                                   |
| EN/ES                   | Spanish labels still allowed in frontmatter; they canonicalize to the English twin. Chips on ES posts show English slugs on purpose so links 200.                                          | Boundaries pair; wealth-worship pair.                                              |

### Author-only (noindex; still moves)

**Writing Insights** (`/writing-insights/*`) and the shared `src/utils/brainScience/` helpers **do** move. They are not the reason tags exist, but they read the same arrays.

| Page / helper                                               | Why it moves                                                                                                                                                                                                                                                                 |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/writing-insights/topics`                                  | Tag counts, ranked tags (uses `getTagWeight`), Maslow-style coverage (`MASLOW_CATEGORIES`), co-occurrence pairs. Every preferred tag is now in exactly one Maslow bucket, so coverage rows will count more posts than the old partial lists. `notes` disappears from charts. |
| `/writing-insights/insights`                                | “Knowledge areas” expand from Maslow membership. Same bucket widening.                                                                                                                                                                                                       |
| `/writing-insights/evolution`                               | Topic growth bars use tag frequency + weights.                                                                                                                                                                                                                               |
| `/writing-insights/cadence`, `patterns`                     | Iterate `post.data.tags` for slices/clusters. Counts follow the trimmed, canonical arrays.                                                                                                                                                                                   |
| `src/utils/brainScience/data.ts`, `metrics.ts`, `grades.ts` | Same tag/Maslow inputs. Disk cache `src/data/.brain-science-cache/` will rebuild; **do not treat cache diffs as the feature**.                                                                                                                                               |
| `/tag-management`                                           | Author overview: averages, over-cap list (should be empty), preferred vs long-tail. Noindex.                                                                                                                                                                                 |

Expected Insights deltas (not bugs):

- Six Maslow rows still appear; **post counts per row go up** because missing official tags (`fatherhood`, `presence`, `metaspace`, `values`, form destinations, …) are assigned now.
- Long-tail tags stay uncategorized. That is intentional.
- Toy metrics like “193% of writings in the top 5 topics” can still look silly: they sum tag incidences, and one writing can wear several of those tags. **Do not retag posts to pretty the dashboard.**

`/brain-science` the origin **note** is prose. It does not compute tags. Old `/brain-science/*` dashboards still 301 to Writing Insights.

### Unchanged on purpose

- Categories (`/category/*`, Guided Path seasons, homepage masonry) — different field.
- Comments, library, quotes API, social image pipeline, Remark42.
- English `limits` vs `boundaries` (keep distinct). Parenting / fatherhood / family / conscious-parenting (keep distinct). One-offs like `berserk`, `crimson-desert` (keep).

---

## What landed in code (this checkpoint)

1. Form slugs no longer alias into themes (`poems` stays `poems`). `notes` is not a form slug.
2. EN/ES aliases; `recuperacion` → `recovery`; kebab-only alias keys.
3. Related tags by co-occurrence; 404 uses live tags.
4. `/tag` prelude is an idea map (no author form inventory line).
5. Over-cap posts trimmed; hub + pair alignment (cooking, technology, parenting, puerto-rico, economics, …).
6. Weights / Maslow / metadata derived from preferred vocab (`src/data/tags.ts`).
7. RSS includes tags; JSON Feed `tags` is tags only.
8. Reader-first policy + always-on rule + `STRIPPED_TAGS`.
9. Empty form shelves (`essays`, `ideas`, `letters`, `stories`, `songs`, `manifestos`) removed from preferred vocab. Aliases still 301 old URLs.
10. Cousin becoming stacks trimmed per post (keep one door). `efficiency`, `revolution`, `discipline` promoted as reader hubs. Vague `development` aliases to `software-development`.
11. Inner-work cousins trimmed per post (`consciousness` / `self-reflection` / `mindfulness` / `inner-work` — one door).
12. Heal cousins trimmed per post (`healing` / `therapy` / `mental-health` — one door). EN/ES recovery-progress pair aligned.

Dead UI already removed earlier on this branch: `TagSystem.astro`, `TagCloud.astro`, `tagUtils.ts`.

---

## Open work (branch off after merge)

Do these as small follow-up branches. Do not mix them into unrelated PRs.

1. **Long-tail leftovers** — still many one-offs (`berserk`, `crimson-desert`, English `limits`). Leave them. Promote later only if a third distinct writing appears (`colonialism`, `accountability`, …).
2. **Tag blurbs** — busy preferred rooms have a sentence; sparse preferred tags still humanize the slug. Optional copy, not a retag.
3. **Specs 009 / 010** — still Draft; same feature, two folders. Prelude is now an idea map, not the form inventory those specs asked for. Align or archive.
4. **Insights math** — “193% in top 5” is a counting bug in the dashboard, not a reason to change tags.

---

## Merge hygiene

**Include** tag policy, vocabulary, pipeline, tests, agent rule/skills, and the content tag edits that are actually this work.

**Leave out of this merge** unless a separate commit already owns them:

- `public/social/images/2026/what-phrases-did-your-dad-install-on-you-social.jpg`
- `src/data/socialImageFingerprints.json` / `socialImageManifest.ts` (unless the lemon-pepper recipe is in the same PR on purpose)
- `src/data/.brain-science-cache/meta-analysis.json` (regenerated Insights cache)
- Recipe file moves (`lemon-pepper-chicken` → `src/content/p/recipes/`) if that is a different thread

After merge, restart dest so alias + strip redirects load. Production picks them up from `astro.config.mjs` → `buildSeoRedirects()`.

When you cut a site version, changelog the reader-facing parts (tag chips, redirects, feeds). Do not changelog individual post tag lists.

---

## Continuity one-liner

Tags are an idea map for readers. This checkpoint made the map honest (rooms resolve, connections are real, covers are quieter, `notes` is not a tag, `/tag` is not an author inventory, becoming / inner-work / heal cousins are one door per piece). Writing Insights will look different because it holds up a mirror to that map; do not retag to please the mirror. Next: leftover long-tail, optional blurbs.
