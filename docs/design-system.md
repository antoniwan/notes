# Design system

The rules a change to Notes has to keep. Read this before touching a page, a component, or `src/styles/global.css`. The tokens are the source of truth; this file says what they mean and which choices are settled.

The same system, with live component previews and font files, is the "Notes" design system on claude.ai (https://claude.ai/artifact/DmxvWPrMxjSM3wQvinhHan, private to Antonio). When the two disagree, this repo wins.

## Color

All colors are RGB triplets on `:root` in `src/styles/global.css`, redefined under `.dark`. Use them as `rgb(var(--color-…))`; never write a raw hex in a component.

| Token                                     | Light                 | Dark              | Use                                                 |
| ----------------------------------------- | --------------------- | ----------------- | --------------------------------------------------- |
| `--color-bg`, `--color-surface-*`         | white, light greys    | near-black, greys | Paper. The site is monochrome first                 |
| `--color-text`, `--color-text-muted`      | `10 10 10`, `100…`    | `250…`, `160…`    | Ink                                                 |
| `--color-accent`                          | UV violet `88 40 168` | `186 150 255`     | Links, focus, the site chrome (header, footer, nav) |
| `--color-primary`                         | marigold `248 176 0`  | `255 196 20`      | Rare signal: buttons on ink, selection, highlights  |
| `--color-gold`                            | `140 100 28` (darker) | `214 170 76`      | The Field Guide only, from its cover lettering      |
| `--color-success` / `-warning` / `-error` | muted                 | lifted            | Status, never decoration                            |

- **Purple is the site; gold is the Field Guide.** Inside `.field-guide`, `--color-accent` is reassigned to gold, so components use the accent token and get the right color for free. The site header and footer stay purple on Field Guide pages. Gold never appears outside the guide.
- **Gold is darker on light mode** so it holds contrast on white; dark mode uses the brighter gold.
- **Contrast: 4.5:1 minimum** for any text, chips and tags included, in both themes. Check a new color pair before shipping it (the "Becoming" chip was raised from 4.29:1 to 5.05:1 in 7.12.1).

## Type

Fonts load through Astro's font API (`astro.config.mjs`, Fontsource):

| Variable         | Font           | Use                                                        |
| ---------------- | -------------- | ---------------------------------------------------------- |
| `--font-heading` | Fraunces       | Titles, display headings, Field Guide tabs and shelf names |
| `--font-serif`   | Source Serif 4 | Long-form reading text, poems                              |
| `--font-sans`    | DM Sans        | UI: navigation, labels, metadata, buttons                  |
| `--font-mono`    | JetBrains Mono | Code                                                       |

- Subtitles and summaries under a title are **italic serif** (Fraunces italic).
- The type scale lives in `tailwind.config.js`; every size has a fixed line height on the 4px grid (14/24, 16/28, 18/32, 20/36 …).

## Layout and rhythm

`pnpm run lint:tokens` enforces these in CI, with an all-zero baseline.

- **The layout sets the width.** A block never caps its own width. Running text stops at `--measure` (45rem, `max-w-measure`); display headings at `--measure-title` (18ch). Essays are one `--measure` column beside the contents rail.
- **One 4px rhythm.** Line heights use the seven named steps (`--leading-none|display|tight|snug|normal|relaxed|loose`). Margins, padding, and gaps sit on the 4px scale; a fluid value is wrapped in `round(nearest, …, 4px)`.
- **Fixed things name a token.** A drawer, toast, embed, aside, or author-sized figure uses a `--size-*` or `--figure-*` token, not a number.
- **Home** sits on one twelve-column grid with `--grid-gap`.

### Figures in posts

- An inline figure (`figure.post-inline-figure`) fills the 45rem column, flush with the paragraphs, caption included. An image smaller than the column stays at its own width, flush left, so it never stretches blurry.
- `--sm` is a deliberately small figure (`--figure-sm`). `--wide` breaks 12rem past the right edge (`--figure-wide`) on screens with room for it.
- Hero art goes in `src/assets/images/`; in-body images in `public/images/` (see the README).

## The Field Guide

The guide looks like a pocket reference, not a blog.

- **No horizontal rules and no boxes** on shelves or entries. Space and type do the separating.
- Gold accent (see Color), serif tabs (Concepts, Values, Beliefs), italic serif subtitles.
- The Concepts shelf has a gold A–Z thumb index; on phones it scrolls instead of losing letters.
- Entry structure and writing rules: [field-guide.md](./field-guide.md).

## Poems

Poem pages (a `<pre class="a-poem">` in the post) get three effects, loaded only there:

- **Pond**: the pointer leaves faint rings; a tap drops a bigger one.
- **Tide**: a slow color wash drifts behind the text.
- **Lantern**: CSS only; on devices with a pointer, the line under it stays full ink and the rest drop to the muted tone.

Not Ink and not Drift: both were tried and dropped. Everything is skipped under `prefers-reduced-motion`. Code: `src/utils/poemAmbience.client.ts` and the poem block in `global.css`.

## Titles

Set through `generateMetaTags` (`src/utils/seo.ts`). A test fails if the full name returns to a title.

| Page             | `<title>`                                       | Share title (`og:title`)          |
| ---------------- | ----------------------------------------------- | --------------------------------- |
| Post, most pages | `Title · Notes`                                 | `Title`                           |
| Field Guide      | `Title · Field Guide` / `Title · Guía de campo` | `Title` (shelves keep the suffix) |
| Home             | `Notes by antoniwan`                            | same                              |
| About            | `About · Notes`                                 | `About Antonio`                   |

The full name stays on the About page and in the Person structured data, never in a tab or shared-link title.

## Words in the interface

- **Category labels** are sentence case and humble ("Psychology, roughly", "Learning in public"). "On …" is kept only for opinion categories ("On parenting", "On politics"). List: `src/data/categories.ts`.
- UI copy is plain and warm, not marketing. Spanish UI strings are Puerto Rican Spanish.

## Language and locale

Spanish is always Puerto Rican Spanish: `es_PR` for Open Graph, `es-PR` for JSON-LD, dates, and feeds. Never `es_ES`. hreflang stays a plain `es`, so search engines don't limit the Spanish pages to readers in Puerto Rico. Details: [multilingual-setup.md](./multilingual-setup.md).

## Accessibility

- 4.5:1 text contrast in both themes.
- Every motion effect respects `prefers-reduced-motion`.
- Decorative layers are `aria-hidden`; counts and labels read as words ("250 entries", not "Concepts250").
- Focus is always visible and returns where it came from (menus, lightbox). `pnpm run test:browser` covers these journeys.
