# Notes – Feature Roadmap

This document is where I think through features **before** building them. It should stay honest, concrete, and simple: what the feature is, why it matters, and what it roughly looks like in practice.

I am not promising timelines here. This is a **directional map**, not a contract.

## How to use this document

- **Capture ideas first**: Write the idea plainly here before touching code.
- **Be specific**: Describe what a user actually sees and does.
- **Write trade‑offs**: What I am saying “no” to by saying “yes” to this.
- **Mark status honestly**: Idea → Exploring → Planned → In progress → Shipped.

---

## 1. Formalized TLDRs for notes

- **Status**: Idea / Exploring
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

## 4. Future idea parking lot

This section is intentionally rough. Quick lines only; details come later.

- Better **content maps** (visual overviews of themes and how notes connect).
- Gentle **“related ideas”** surfacing from TLDRs and tags, without feeling like a recommendation engine.
- More **reader‑friendly export** options (e.g., clean print/PDF for certain notes or series).
