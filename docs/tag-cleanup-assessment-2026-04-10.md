# Tag Cleanup Assessment - 2026-04-10

Repo-wide assessment of tags across `src/content/p/` using signal-first policy.

## Snapshot

- Unique tags detected: `266`
- Highest-frequency tags remain healthy (`consciousness`, `personal-growth`, `healing`, `self-reflection`)
- Main drift sources:
  - EN/ES duplicates and accent variants
  - spacing/hyphen variants (for example `ai agents` vs `ai-agents`)
  - low-frequency long-tail tags (single-use labels)

## Keep As Signal (recommended)

These were retained/promoted because they add browse value:

- `connection`
- `time`
- `emotional-health`
- `social-media`
- `slow-living`
- `trust`
- `vulnerability`
- `intimacy`
- `love`
- `presence`
- `communication`
- `ritual`

## Merge (recommended)

Keep canonical route, merge normalized variants:

- `regulación-emocional`, `regulacion-emocional` -> `emotional-regulation`
- `auto-reflexión`, `auto-reflexion` -> `self-reflection`
- `crítica-sistémica`, `critica-sistemica` -> `systemic-critique`
- `sanación`, `sanacion` -> `healing`

## Alias-Only (compatibility)

Maintain for backward compatibility, canonicalize in processing:

- `ai agents` -> `ai-agents`
- `ai-agent` -> `ai-agents`
- plural/singular content-form aliases routed to canonical slugs

## Next Cleanup Queue

To continue enhancement without flattening voice:

1. Review single-use tags in batches of 20 and classify as keep/merge/alias-only.
2. Prioritize posts with 12+ tags and remove only tags that are clearly redundant.
3. Keep expression/style tags when they improve reader intent.
4. Re-run tag analytics after each batch and update alias map incrementally.

## Batch 2 (single-use tags 1-20)

Reviewed set:
`abuse`, `adaptability`, `ai`, `ai agents`, `ai-agents`, `ambiguity`, `amor incondicional`, `analysis-paralysis`, `anime`, `apego`, `astro`, `atheism`, `attachment`, `attention`, `autenticidad`, `auto-conocimiento`, `awareness`, `behavioral-economics`, `berserk`, `bias`.

### Keep as signal

- `abuse`
- `adaptability`
- `ai`
- `ai-agents`
- `ambiguity`
- `amor incondicional`
- `analysis-paralysis`
- `anime`
- `astro`
- `atheism`
- `attachment`
- `attention`
- `awareness`
- `behavioral-economics`
- `berserk`
- `bias`

### Merge

- `apego` -> `attachment` (EN/ES intent pair)

### Alias-only

- `ai agents` -> `ai-agents` (spacing variant)
- `autenticidad` -> `authenticity` (already mapped)
- `auto-conocimiento` -> `self-awareness` (added)

## Batch 3 (single-use tags 21-40)

Reviewed set:
`bilingual`, `blind-spots`, `books`, `branching`, `breathing`, `capitalism`, `cartoons`, `character`, `childhood`, `clarity`, `coding`, `cognitive-load`, `compasión`, `conditioning`, `confidence-building`, `consumerism`, `contentment`, `control`, `corporate-manipulation`, `craftsmanship`.

### Keep as signal

- `bilingual`
- `blind-spots`
- `books`
- `branching`
- `breathing`
- `capitalism`
- `cartoons`
- `character`
- `childhood`
- `clarity`
- `coding`
- `cognitive-load`
- `conditioning`
- `confidence-building`
- `consumerism`
- `contentment`
- `control`
- `corporate-manipulation`
- `craftsmanship`

### Alias-only

- `compasión` -> `compassion` (accent variant, already normalized by alias map)

## Batch 4 (single-use tags 41-60)

Reviewed set:
`crecimiento-personal`, `crítica-sistémica`, `critical-thinking`, `culpa`, `cultura`, `cultural-critique`, `culture`, `decision-making`, `democracy`, `descalibración`, `digital-age`, `digital-art`, `digital-detox`, `digital-wellness`, `dignidad`, `dignity`, `doom-scrolling`, `dragon-ball`, `ego`, `embodiment`.

### Keep as signal

- `critical-thinking`
- `culpa`
- `cultural-critique`
- `culture`
- `decision-making`
- `democracy`
- `descalibración`
- `digital-age`
- `digital-art`
- `digital-detox`
- `digital-wellness`
- `doom-scrolling`
- `dragon-ball`
- `ego`
- `embodiment`

### Merge

- `crítica-sistémica` -> `systemic-critique` (accent/ES variant)

### Alias-only

- `crecimiento-personal` -> `personal-growth` (added)
- `cultura` -> `culture` (added)
- `dignidad` -> `dignity` (added)
