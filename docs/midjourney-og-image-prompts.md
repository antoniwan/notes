# Midjourney cover prompts

Target size for this site: **1200×630** (Open Graph / Twitter `summary_large_image`).

Only posts **without** a non-empty `heroImage` are listed below. If a post already has a cover, skip it.

## Drop-in parameters

Append this to every prompt (or keep it at the end of the paste):

```text
--ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature, caption, typography
```

Then: upscale → download → convert to AVIF → save under `public/images/2026/<slug>.avif` → set `heroImage: /images/2026/<slug>.avif` in frontmatter → run `pnpm run generate-social-images`.

Keep the focal subject in the **center third**. The on-page hero crops to a shorter 1200×450 banner; OG uses the full 1200×630.

---

## Default cover pool (placeholders)

Drop these into `public/images/default_covers/` as `default-1.avif` … `default-8.avif` (replace the current 3:2 set). Same parameters as above. Site vibe: raw, cosmic, hand-made, a little weird, no letters.

**1 — night chart**

```text
wide cinematic painting of a deep navy night sky with a warm orange-to-violet nebula band across the center, thin gold constellation linework and small alchemical sigils floating among stars, mystical star-chart mood, no people, no text
```

**2 — kintsugi quiet**

```text
extreme close-up of cracked dark ceramic repaired with glowing gold kintsugi seams, soft cream and charcoal, shallow depth of field, tender still life, one small hairline crack catching light, no text
```

**3 — threshold**

```text
a lone figure standing at a desert-to-forest threshold at golden hour, a faint glowing path under their feet, vast sky, painterly cinematic landscape, introspective, no readable signs
```

**4 — breath**

```text
abstract impressionist study of a human torso dissolving into ocean fog and sunrise, thin gold thread from heart to mind, muted pastels, calm, lots of negative space, no face details, no text
```

**5 — forge**

```text
dark workshop, a blacksmith anvil beside a dim terminal glow, sparks and molten gold in the dark, cyan reflections on steel, gritty digital painting, no screens with readable UI
```

**6 — two silhouettes**

```text
minimal hand-drawn illustration of two human silhouettes facing each other, small glowing hearts in the chest, overlapping circles of amber and deep blue between them, cream background, pencil texture, no text
```

**7 — notebook light**

```text
open cloth-bound journal on a wooden desk under a warm lamp, pages filled with unreadable marks and checkmarks, a shrinking shadow in the background, cozy browns and gold, no legible writing
```

**8 — infinite stair**

```text
surreal digital painting of a figure walking an endless staircase that loops inside a transparent chest, galaxies where the heart should be, dark blue purple gold, dreamlike, no text
```

---

## Posts still missing a cover

16 posts. Each block is one paste: subject + the parameters from the top of this file.

### `some-notes-on-overcoming-emotional-pain.md`

Path: `/images/2026/overcoming-emotional-pain.avif`

Away from his daughter, somatization, accountability, kintsugi of the self.

```text
close-up of a cracked ceramic heart being repaired with glowing gold kintsugi seams, a child's drawing barely visible and out of focus on the table behind it, soft ambient light, warm muted pinks and creams, tender detailed digital painting, no text --ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature
```

### `reflections-from-a-tough-weekend.md`

Path: `/images/2026/tough-weekend.avif`

Night kitchen, one lamp, processing hurt and getting ready to leave emotional abuse.

```text
a person sitting alone at a kitchen table at night, small pool of warm lamp light, coffee mug and crumpled unreadable notes, rain on the window, semi-realistic digital painting, muted blues and warm yellow, honest and tired mood, no text --ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature
```

### `on-limits-growth-and-the-meaning-of-my-life.md`

Path: `/images/2026/limits-growth-meaning.avif`

Tearing down and rebuilding body and mind; meaning asked of the self, not others.

```text
a lone traveler at the edge of a vast desert that gradually becomes a lush forest, a faint glowing line on the ground marking a chosen path, golden hour, semi-realistic painting, introspective, wide cinematic landscape, no text --ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature
```

### `note-to-self-on-being-a-conscious-parent.md`

Path: `/images/2026/conscious-parent.avif`

Model the behavior; stop lecturing; children copy what we do.

```text
pencil-and-watercolor drawing of an adult kneeling to meet a child at eye level, soft halos of light around both heads, a faint heart-shaped connection between them, warm gentle palette, sketchy expressive linework, no text --ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature
```

### `learning-construction-self.md`

Path: `/images/2026/learning-construction-self.avif`

Humility, a daughter's wonder, the self built like a structure.

```text
a human silhouette drawn as an architectural blueprint, scaffolding and cranes building the figure, unlabeled sections of light where values and memories live, teal and white technical drawing on deep navy, high contrast, clean wide composition, no readable labels --ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature
```

### `conquering-imposter-syndrome-with-evidence-based-journaling.md`

Path: `/images/2026/imposter-syndrome-journaling.avif`

Evidence log of real work; the shadow of fraud shrinks as the page glows.

```text
a journal open on a desk with pages of small checkmarks and unreadable notes, a dark shadowy silhouette shrinking in the background while the pages glow softly, cozy lamplight, warm browns and golds, clean digital illustration, no legible writing --ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature
```

### `some-books-for-self-transcendence.md`

Path: `/images/2026/books-self-transcendence.avif`

Stoic and heart books as tools; daily reads, rain or shine.

```text
illustrated stack of well-worn clothbound books with unreadable spines, soft warm lamp light, tendrils of stardust and tiny galaxies rising from the open top book, cozy reading nook, painterly digital illustration, warm orange and deep blue, no legible titles --ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature
```

### `things-i-have-learned-this-week-regarding-a-4-year-olds-long-curly-hair.md`

Path: `/images/2026/curly-hair-lessons.avif`

Dad learning not to brush curls dry; detangle in the shower; patience.

```text
whimsical storybook illustration of a parent gently detangling a small child's long curly hair, curls flowing like waves, bath toys and a towel nearby, soft evening light, rounded shapes, warm oranges and purples, cozy and tender, no text --ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature
```

### `note-to-self-to-be-or-what-not-to-be.md`

Path: `/images/2026/to-be-or-what-not.avif`

You become what you practice; refuse resentment; choose kindness.

```text
close-up of a small mirror on a desk reflecting a blurred human silhouette, a blank sticky note beside it with only a hand-drawn question mark, soft natural light, minimal color palette, contemplative, no other writing --ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature
```

### `on-feeling-overpowered.md`

Path: `/images/2026/feeling-overpowered.avif`

OP in the good sense: training to failure, whole food, sleep, kids, response not reaction.

```text
a strong calm figure standing in a sunlit kitchen doorway after training, steam from a whole-food meal, a child's shoes by the door, golden hour, grounded power not rage, painterly realistic, warm earth tones, no text --ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature
```

### `briefly-on-empathy-as-a-double-edged-sword.md`

Path: `/images/2026/empathy-double-edged.avif`

Empathy cuts the hand that grips too tight; the world's suffering vs self-preservation.

```text
a hand gently holding a glowing crystal sword of light, the blade split warm gold on one side and cold blue shards on the other, floating over a dark neutral background, minimalist semi-abstract, sharp edges with a soft glow, no text --ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature
```

### `forging-stronghand-terminal.md`

Path: `/images/2026/stronghand-terminal.avif`

WezTerm / PowerShell forge: chaos to command.

```text
a blacksmith forging a glowing sword whose blade is made of green terminal code, sparks flying, dark workshop lit only by the forge and a dim CRT glow, gritty digital painting, fantasy mixed with hacker aesthetic, no readable UI --ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature
```

### `why-i-built-buildssoftware-and-what-im-building-next.md`

Path: `/images/2026/builds-software.avif`

A personal digital forge; no ads, no feed; build in public.

```text
semi-abstract blueprint of a software city being constructed, cranes lifting code blocks, roads made of flowcharts, glowing nodes connecting buildings, deep navy background with cyan linework, modern isometric illustration, clean and optimistic, no readable labels --ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature
```

### `my-mental-health-routine-unfiltered.md`

Path: `/images/2026/mental-health-routine.avif`

Breathwork, writing, gym, art, daughter FaceTime, real food, sunrise, rest.

```text
collage-style illustration of daily rituals orbiting a calm seated figure with eyes closed: journal, glass of water, running shoes, guitar, a sunlit window, bare feet on wet grass, soft pastel painterly texture, no text --ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature
```

### `on-overcoming-analysis-paralysis.md`

Path: `/images/2026/analysis-paralysis.avif`

Breathe until you are in your senses, then take one physical step. Motion before the perfect plan.

```text
a person standing at a crossroads of dozens of glowing paths, most blurry and fading, one clear gold path lighting up under their feet as they take the first step, motion blur, cinematic concept art, blues and golds, no text --ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature
```

### `toddler-internet-safety.md`

Path: `/images/2026/toddler-internet-safety.avif`

Protecting toddlers online; guardian presence vs glitchy dark shapes.

```text
cartoon illustration of a small child with a tablet while a gentle guardian figure made of warm light and a shield shape stands between them and dark glitchy forms in the background, bright friendly colors, simple clean shapes, no UI text, no logos --ar 1200:630 --v 7 --stylize 200 --style raw --no text, watermark, logo, letters, signature
```
