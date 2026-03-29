# Notes – Feature Roadmap

This document is where I think through features **before** building them. It should stay honest, concrete, and simple: what the feature is, why it matters, and what it roughly looks like in practice.

I am not promising timelines here. This is a **directional map**, not a contract.

## How to use this document

- **Capture ideas first**: Write the idea plainly here before touching code.
- **Be specific**: Describe what a user actually sees and does.
- **Write trade‑offs**: What I am saying “no” to by saying “yes” to this.
- **Mark status honestly**: Idea → Exploring → Planned → In progress → Shipped.

---

## Shipped today (living surface)

This section is a **checkpoint** so the roadmap does not read like the site is only the items below in sections 1–6. For full detail, see [README.md](../README.md).

- **Reading & discovery**: full-text **search** (build-time index), **categories**, **tags** (index, per-tag pages, **tag management** analytics view), **Everything** archive, **Guided Path** (seasonal order; progress in the browser only).
- **Posts**: automatic **reading time**, **reading progress** (`localStorage`), markdown-derived **table of contents**, **EN/ES** linking via `translationGroup`, **related posts** at the bottom via overlapping tags (“Continue reading”).
- **Home**: **highlight** masonry for posts marked `featured` or `highlight` in frontmatter.
- **Brain Science**: multi-page **stats and charts** (cadence, topics, sentiment, etc.).
- **Library**: dedicated **books** pages (see §4).
- **Feeds & APIs**: **RSS**, **JSON Feed**, **GET `/api/quotes`**, human-readable **`/api/`** overview.
- **Quality & distribution**: **Schema.org** where it fits, optional **Remark42** comments, **service worker** for caching (version bumped on build), **Vercel Web Analytics** and **Speed Insights** in the base layout when those products are enabled on Vercel.
- **About**: curated topic grid; optional **Letterboxd “latest watched”** when `LETTERBOXD_*` env vars are set.

**Not the same as §1 TLDRs:** posts already have a required **`description`** in frontmatter for SEO and cards; there is still no dedicated **`tldr`** field, no TL;DR block on the post, and no sitewide **TLDRs** index page.

---

## 1. Formalized TLDRs for notes

- **Status**: Idea / Exploring (unchanged — see “Shipped today” above for what exists today)
- **Goal**: Give readers a short, standalone summary of each note that can live on its own and still be true.

### What this actually means

- Each post can have a **`tldr` field in frontmatter**.
  - Either a **single short paragraph** or a **small list of bullets**.
  - Written by me, not auto‑generated.
- On the post page:
  - Show a small **“TL;DR” block near the top** when `tldr` exists.
  - It should be easy to skip or skim without feeling like a second intro.
- Site‑wide:
  - Add a **“TLDRs” page** that lists all TLDRs as short, standalone ideas, each linking to the full note.

### Why it matters

- Some readers want to **grasp the core idea in under 30 seconds**.
- It forces **clarity and synthesis** in my thinking: if I can’t write a clean TLDR, the note probably isn’t sharp enough.
- A TLDRs page becomes a **“idea index”**: a place to browse my thinking in compressed form.

### Shape and constraints

- TLDRs should:
  - Be **short** (roughly 1–3 sentences, or 3–5 bullets max).
  - Be **standalone**: understandable even without reading the full note.
  - Be **concrete**: avoid vague abstractions and “guru voice.”
  - Be **honest**: describe what the note actually delivers, not what I wish it did.
- I should **not**:
  - Turn TLDRs into a second essay.
  - Hide major caveats; if something is speculative, say so.

### Open questions

- Do I want TLDRs for **every** note, or just for the most important ones?
- Should TLDRs exist in **one language only** per translation group, or be translated as well?

---

## 2. “Click to listen” – Audio version of notes

- **Status**: Idea
- **Goal**: Let people **listen** to a note instead of (or while) reading it, with one simple, obvious control.

### What this actually means

- On each post:
  - A **“Listen to this note”** button or toggle near the top (above or near the TLDR).
  - When clicked, the note is read out loud, with basic controls:
    - Play / pause
    - Simple progress indicator
    - Ability to stop without weird behavior
- Implementation options (to decide later, but note them now):
  - **Browser text‑to‑speech** using the Web Speech API.
    - Pros: No server, no files to manage, easy to test.
    - Cons: Voice quality and consistency depend on the user’s device/browser.
  - **Pre‑recorded audio per note** (human‑voice recordings or high‑quality TTS rendered ahead of time).
    - Pros: Highest quality, consistent sound.
    - Cons: Time‑consuming, storage and bandwidth costs, more workflow overhead.

### Why it matters

- Accessibility: some people **process better by listening** or can’t stare at a screen all the time.
- Convenience: readers can **walk, drive, or cook** while still engaging with the note.
- It forces me to write in a way that **sounds human when read aloud**, which is a good discipline.

### Shape and constraints

- The UI should be:
  - **Obvious** (you shouldn’t have to hunt for it).
  - **Calm** (no auto‑play, no noisy animations).
  - **Respectful** of user control (never starts without explicit action).
- I should favor:
  - A **minimal, clear player** over a flashy audio UI.
  - A **gradual rollout**: start with a small number of posts to test whether this is genuinely useful.

### Open questions

- Do I want to commit to **recording my own voice**, or stay with automated voices?
- If I use browser‑based TTS, am I okay with **different voices on different devices**?
- Should I support **playback speed controls** (1.25×, 1.5×, etc.) from day one or later?

---

## 3. Notifications for new notes (email or push)

- **Status**: Idea
- **Goal**: Let people who genuinely care about these notes **opt in** to hearing about new work, without turning the site into a growth‑hack machine.

### What this actually means

- Add a **clear, low‑pressure “Get updates” entry point**:
  - Likely on the homepage, maybe on post pages or the TLDRs page.
  - Language should be honest: “Get an email when I publish something new,” not marketing fluff.
- Two main channels to consider:
  1. **Email notifications**
     - A small form to collect an email address.
     - Sends an email when there’s a new note (or a small digest after a period).
  2. **Browser push notifications**
     - Use web push + service worker.
     - Ask permission **only after a clear intention signal** (e.g., the user clicks a button).

### Why it matters

- Some readers don’t want to **check back manually** or live inside social feeds, but still want to follow the work.
- Email and/or push is a way to **build a quieter, direct connection** with people who genuinely care.
- It can gently support consistency: if I know someone is waiting for the next note, that’s a small accountability nudge.

### Shape and constraints

- **Email first, push later** feels sane:
  - Email is easier to reason about, friendlier to most people, and less intrusive.
  - Push can be explored later if there is a clear need and a good UX pattern.
- Tone rules:
  - No “growth hacks,” no manipulative copy.
  - Make it easy to **unsubscribe** or change preferences.
  - Be explicit about **frequency** (for example: “A few times a month at most”).

### Open questions

- Which email system do I want to trust (Buttondown, Substack, self‑hosted, etc.)?
- Do I only send **new note alerts**, or also send occasional **short reflections / roundups**?
- How do I handle **language preferences** (English vs Spanish) for notifications?

---

## 4. Library of sources (books)

- **Status**: Shipped (live on site)
- **Goal**: Give readers an honest view of the books that shape these notes: which ones I own, which I’ve read end‑to‑end, and which I mostly use as references or have only skimmed.

### What this actually means

- A dedicated **“Library” page** that:
  - Lists books I actually have on my shelves / in my Kindle, not an aspirational list.
  - Groups them into rough buckets:
    - **Read fully** (cover to cover; core influences).
    - **In progress / partially read**.
    - **Reference / skimmed** (I dip into specific chapters or ideas).
  - For each book:
    - Basic metadata (title, author, category/topic).
    - A short **“how I use this”** note: foundational, occasional reference, one‑chapter wonder, etc.
    - Optional link out to the book (non‑spammy; no growth‑hack copy).
- Surface this page from:
  - The **About** page.
  - Maybe footer / nav as “Library” if it earns the space.
  - Optionally from posts that mention a book (“From my library” link).

### Why it matters

- Readers can see **what they’re stepping into**: which thinkers, traditions, and texts sit behind the notes.
- It makes my **sources of knowledge and bias explicit**, which builds more trust than pretending ideas appear from nowhere.
- It’s a simple way to **recommend genuinely helpful books** without turning the site into a recommendation engine.
- It gives curious readers a **next step** beyond the site itself: “if you liked this note, here’s what to read in the real world.”

### Shape and constraints

- The page should feel like a **curated shelf**, not a Goodreads clone:
  - No star ratings.
  - No endless carousels.
  - Focus on **why this book matters to me**, not generic blurbs.
- Buckets should stay **coarse and honest** (read / partial / reference) instead of fake‑precision progress tracking.
- Avoid automations that invite **performative reading** (no “X books this year” counters).
- Keep it **manually curated** so adding a book is an intentional act, not a firehose.

### Open questions

- Do I want to expose **non‑book sources** (long‑form essays, papers, lectures) on the same page or keep it strictly books?
- Should posts be able to **declare related books** in frontmatter so the library can show “Referenced in: …” for each title?
- Am I comfortable adding **affiliate links** here, or do I want this page to stay affiliate‑free for trust/clarity?

## 5. Structured sources in frontmatter

- **Status**: Idea (*Sources* today are still **in the note body** — e.g. `## Sources` sections — not a `sources` field in the content schema.)
- **Goal**: Move the “Sources” for each note into a dedicated frontmatter field so I can surface influences and references consistently across the site, not just at the bottom of individual posts.

### What this actually means

- Introduce a `sources` (or similar) frontmatter field on posts:
  - Likely an **array of structured entries** (book, article, paper, podcast, etc.).
  - Each entry can hold: title, creator (author/speaker), type, optional URL, and a short “why this matters here” note.
- In posts:
  - Replace or augment the current ad‑hoc “Sources” section with data from this field.
  - Keep the tone personal and honest; this is where I say how I actually used the source, not just cite it academically.
- Site‑wide:
  - Add a **central “Sources” view** (or extend the Library page) that aggregates sources across notes:
    - Filterable by type (books, essays, research, talks, etc.).
    - Shows which notes each source appears in (“Referenced in: …”).
  - Connect with the **Library of books**:
    - When a source is a book that also lives in the Library, link them together instead of duplicating data.

### Why it matters

- Makes my **influences and references transparent and navigable**, not buried in footers.
- Lets curious readers **trace ideas back to their roots** and go deeper on specific thinkers or works.
- Creates a **bridge between posts and the Library page**, so the site feels like one coherent knowledge graph instead of isolated essays.
- Encourages better **source hygiene and humility**: I’m less likely to present a borrowed idea as entirely my own when I have a canonical place to credit it.

### Shape and constraints

- Keep the frontmatter schema **simple enough to maintain by hand**; this should not feel like filling out a citation form.
- Prioritize **signal over completeness**:
  - Include sources that genuinely shaped the note or are helpful for readers.
  - Skip automatic dumping of every casual reference.
- Avoid turning this into a **gamified metric** (no “most‑cited source” leaderboards).
- Design the central Sources view to feel like a **map of influences**, not a sterile bibliography.

### Open questions

- Do sources live in **one place per translation group** (e.g., only on the primary language), or are they duplicated/translated?
- How should I represent **non‑text sources** (conversations, lived experiences, unnamed influences) without forcing them into a rigid schema?
- Should I allow “site‑wide sources” (things that influence the whole project) distinct from **per‑note sources**, and surface those differently?

## 6. Future idea parking lot

This section is intentionally rough. Quick lines only; details come later.

- Better **content maps** (visual overviews of themes and how notes connect).
- Gentle **“related ideas”** surfacing from TLDRs and tags, without feeling like a recommendation engine.
  - *Partial today*: post footers already show **tag-overlap related posts** (`RelatedPosts`); this item still covers anything richer (TLDR-driven, curated pairs, softer copy, etc.).
- More **reader‑friendly export** options (e.g., clean print/PDF for certain notes or series).
