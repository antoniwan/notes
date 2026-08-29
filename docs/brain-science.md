# Writing Insights (routes: `/brain-science`)

Public name is **Writing Insights**. The URL is still `/brain-science` until a redirect pass. This document is the living audit and execution map for that section.

Companion: [roadmap.md](./roadmap.md) §9.

**Audit date:** 2026-08-29  
**Corpus snapshot:** 88 published posts (77 English-tagged, 11 Spanish-only). Language is a YAML array (`language: [es]`), not a scalar.

---

## What this section actually is

Build-time **author mirrors**: counts, tag frequencies, calendar slices, and lexicon votes over published Markdown. Pages are `noindex` and sitemap-excluded. They are not psychology, medicine, IQ, or “brain science.”

Footer already said Writing Insights. Nav, About, and page titles now match. Folder names and routes do not, yet.

## Length bias and what “love” means

Most lexicon scores were **raw hit counts**. A 12,000-word essay that says `love` three times outranks a 400-word note that says it three times. That is more opportunities to match a token, not more love.

What the matcher actually measures: occurrence of strings in a fixed list (`love`, `amor`, …), plus `!` in some scores. It does not measure affect, theme, or irony (“I don’t love this”).

**Computational correctness** (did we count as specified?) is testable. **Construct validity** (does the count mean emotion?) is not implied.

How we quantify the length confound:

1. Pearson **r(word count, raw hits)** — high r means the score is a length proxy.
2. Pearson **r(word count, hits per 1,000 words)** — should drop if rate-normalization worked.
3. Ranking by rate so short notes can outrank long essays (Affect lexicon page).
4. Gold standard we do **not** have: a human-labeled sample and agreement (κ) against the dictionary. Until that exists, do not treat these numbers as a truth score.

Other known skews: winner-take-all sentiment uses raw counts and a large “neutral” (cognitive-verb) list, so long essays often vote neutral. `intellectualDepth` on Language over time **adds** `wordCount / 50` on purpose. Flesch ignores Spanish vowels.

---

## Audit findings (2026-08-29)

### Honesty / naming

| Surface     | Before                             | After this pass    |
| ----------- | ---------------------------------- | ------------------ |
| Nav / About | Brain Science                      | Writing Insights   |
| Index H1    | Writing Analytics & Self-Discovery | Writing Insights   |
| Insights    | Emotional Processing Analytics     | Affect lexicon     |
| Evolution   | Intellectual Growth Analytics      | Language over time |
| Topics      | Core Themes Analysis               | Themes & tags      |
| Cadence     | Writing Cadence                    | Cadence            |
| Patterns    | Pattern Recognition                | Correlations       |
| Meta        | Meta Analysis                      | Meta-language      |
| URL         | `/brain-science/*`                 | **unchanged**      |

In-page copy still has leftover “Emotional Processing Metrics” headings. That is queued below, not done.

### Dictionaries (this pass)

Lists lived in three Astro pages plus `metrics.ts` plus `data.ts`. They were English-only, duplicated, and matched with JS `\\b`, which **does not treat á/é/ñ as word characters**. Spanish posts were effectively invisible to lexicon scores.

Also noisy on purpose or by accident:

- Vulnerability included hedges: `maybe`, `perhaps`, `sometimes`, `often`.
- Confidence included `know` (too common).
- Wisdom included `found` / `opted` / `selected`.
- Sentiment “positive” included topic words (`growth`, `transformation`, `better`).
- Sentiment “neutral” is cognitive verbs, not emotionally flat prose. That is now documented in code, not renamed in the UI yet.
- `curiosity` listed `explore` twice.
- Multi-word phrases (`figure out`, `me doy cuenta`) now match via unicode boundaries.

**Shipped:** `src/utils/brainScience/vocabulary.ts` is the single source. Pages import it. Matcher is unicode-aware. Spanish affect / cognitive / discourse tokens added from the actual corpus (fatherhood, dignity, grief, _me doy cuenta_, _sin embargo_, etc.). Topic words (leadership, Puerto Rico, children) stay out of affect lists — those already have tags.

Meta-language detectors now include Spanish writing/reflection phrases. Disk cache version bumped **1 → 2** so old English-only analyses are not reused.

### Still wrong / incomplete

1. **Flesch / syllable proxy** still strips to `a–z` vowels. Spanish and accented English are under-counted. Not a lexicon issue; still a language-over-time lie.
2. **`sentiment` npm (AFINN)** on the meta page is English-only. Parallel to the custom lists, not replaced.
3. **Letter grades (A+–F)** on Correlations still overclaim. Thresholds in `BRAIN_SCIENCE_CONFIG` are dashboard hints dressed as report cards.
4. **“Quality variance”** is word-count variance labeled as quality.
5. **Cache signature** still ignores title and same-length body edits (`{id, bodyLength, pubDate}`).
6. **Page-local loops** remain (each route still walks posts for its own charts). Shared vocab + memoized posts/sentiment/Flesch; not a single analysis pipeline.
7. **Code identifiers** are still `brainScience`, `BrainScienceLayout`, `/brain-science`. Public name and URL diverge on purpose until redirects exist.
8. **Insights inner headings** still say “Emotional Processing.”
9. **No dedicated topic lexicon** (leadership, fatherhood, colony, algorithm). Tags already cover this; a second dictionary would double-count unless it is a separate view.

---

## Ranked work

### Shipped this pass — 2026-08-29

- Shared vocabulary module + EN/ES expansion grounded in the current corpus.
- Unicode lexicon matcher.
- Public rename to Writing Insights (labels only; URL kept).
- Meta detector Spanish + cache v2.
- Tests for uniqueness, hedge removal, and accented hits.
- Grade explainers: why this corpus got the letter it got, and what an A would take.
- Section opener: this repo is a Markdown toolkit; `docs/materials/` and `graphify-out/` stay local.

### Near-term (honesty, low risk)

| Status  | Item                                                                         | Notes                                          |
| ------- | ---------------------------------------------------------------------------- | ---------------------------------------------- |
| Planned | Finish in-page copy so headings match the new titles                         | Insights / topics formula sections             |
| Shipped | Explain each letter grade: why this corpus scored it, and what an A requires | Index + Cadence cards; Correlations hover      |
| Planned | Drop or relabel A–F grades on Correlations                                   | Rubric is in; letters remain as relative ranks |
| Planned | Rename “quality variance” in UI to “length variance”                         | Code can follow                                |
| Shipped | Rate-normalize lexicon rankings (per 1,000 words) and report r vs length     | Affect + Correlations scatter                  |

### Mid-term (measurement)

| Status    | Item                                                                          | Notes                                                               |
| --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Planned   | Spanish-aware syllable / readability path, or stop showing Flesch on ES posts | Current formula is English                                          |
| Planned   | Include detector version in meta cache signature                              | Avoid silent stale scores next lexicon edit                         |
| Planned   | Strip markdown images/URLs before lexicon counts                              | Image captions (`crimson`, `desert`, `.avif`) leak into word counts |
| Exploring | Optional topic lexicons as a **separate** chart, not mixed into affect        | leadership, fatherhood, colony, algorithm                           |
| Exploring | Replace AFINN on meta with the shared lists so one engine votes               |                                                                     |

### Later (product)

| Status   | Item                                                                      | Notes                                                             |
| -------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Planned  | Route rename `/brain-science` → `/writing-insights` with 301s             | Pages are `noindex`; still do redirects for bookmarks             |
| Idea     | Fold Tag Analytics and Writing Insights into one “Mirrors” hub            | Product thesis in roadmap §7; do not outrun reader value          |
| Idea     | Per-language split on every chart                                         | 11 ES posts are now countable; they should also be **filterable** |
| Non-goal | Client-side NLP, LLM scoring at request time, “brain” metaphors in new UI | Build-time, reviewable, cheap                                     |

### Explicit non-goals

- Presenting these pages as clinical, cognitive, or diagnostic.
- Auto-expanding dictionaries from raw term frequency (that is how `https` and `caption` get in).
- Growth dashboards or public leaderboards of “self-awareness score.”

---

## How to extend a list

1. Edit `src/utils/brainScience/vocabulary.ts` only.
2. Prefer words that are affect/cognition/discourse, not topics.
3. Add the Spanish counterpart when the English term is in voice.
4. Keep hedge words and ultra-common verbs out (`maybe`, `know`, `found`, `solo` as “only”).
5. Run `pnpm test` (vocabulary uniqueness + unicode hits).
6. If meta detectors change, bump `cache.ts` `version` so CI does not reuse stale JSON.

---

## Key files

| Path                                     | Role                                  |
| ---------------------------------------- | ------------------------------------- |
| `src/utils/brainScience/vocabulary.ts`   | Lexicons                              |
| `src/utils/brainScience/textAnalysis.ts` | Flesch, unicode hits                  |
| `src/utils/brainScience/metrics.ts`      | Sentiment buckets, “challenge” scores |
| `src/utils/brainScience/metaAnalysis.ts` | Writing-about-writing detectors       |
| `src/utils/brainScience/cache.ts`        | Disk cache for meta (v2)              |
| `src/data/brainScience.ts`               | Page titles, thresholds               |
| `src/pages/brain-science/`               | Routes (URL unchanged)                |
