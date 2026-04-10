---
title: 'The Joy of Building My Own Digital Sandbox — April 2026 Update'
description: >-
  Eight months, 550 commits, 26 new posts, and a full transformation of how I
  build this site — with AI pair-programming, spec-driven workflows, and the
  same stubborn love for artisanal code.
pubDate: '2026-04-10T12:00:00.000Z'
language:
  - en
heroImage: '/images/2026/tinkering-in-2026.avif'
category:
  - metaspace
  - diy-creation
  - systems-strategy
  - art-expression
tags:
  - astro
  - typescript
  - web-development
  - ai
  - ai-agents
  - software-development
  - craftsmanship
  - creativity
draft: false
featured: false
published: true
showComments: true
---

I still fucking love ~~playing~~ working on my blog.

Last July I wrote about [the joy of building my own digital sandbox](/p/the-joy-of-building-my-own-digital-sandbox/) — a love letter to the code, the content, the obsessive tinkering that makes this site feel like mine. Eight months later:

- **550 commits** across **24 merged pull requests**
- Version jumped from **~2.x** to **5.21.0** — over 90 version bumps
- **26 new posts** published, including **10 bilingual EN/ES pairs**
- **AI pair-programming** adopted as a core workflow, with 6 custom agent skills built for this repo
- **Spec-driven development** formalized through [github/spec-kit](https://github.com/github/spec-kit)

The commit cadence mirrors my life: bursts of 119 (July) and 107 (November) when I'm on fire, then 9 (October) and 14 (January) when I'm living, parenting, recovering. My son Andre Antonio was born on December 25, 2025. January was 14 commits. That's not a dip in productivity — that's a man holding his newborn and his enhanced blended family. It's pretty cool that I'm not shipping to a sprint board and I'm shipping to my own internal clock and life cadence.

This artisanal project remains some of the most meaningful creative work I do and the sharpest instrument I have for witnessing myself because the goal is always the same: become what I write, and be as honest through the process as I can.

## What I Built

Here's what I built and why.

### Brain Science

I built a multi-page section that runs at build time and generates writing statistics about my own posts — cadence charts, topic breakdowns, and consistency tracking. [Chart.js](https://www.chartjs.org/) powers the visualizations, and it all renders as static pages. No server or database.

I wanted to see my own patterns. How often do I write? What themes keep coming back? When do I go quiet? It's probably the most self-indulgent feature on the site. It wasn't as helpful as I thought it would be but it's a good starting point to a much more thorough analysis feature to be built in the future. I'm sure if you forked/cloned the repo and added your own content you could get some good insights into your writing styles and patterns.

### Guided Path

A curated reading order. You pick where you are, and it walks you through posts in a sequence I chose — thematic, not chronological. Progress is stored in your browser only so that means that no accounts, no tracking for users because I care about your privacy. I think this is a GREAT way to browse and read online content, perhaps I should patent it. Hah!

### Read/Unread Tracking

Every post you've read is marked with a subtle visual indicator. Progress is kept in `localStorage`. If you clear your browser, it's gone. And again, that's the point, privacy — I don't want your reading data. I just want to help you remember what you've already seen.

### The Comments Overhaul

I replaced [Giscus](https://giscus.app/) (GitHub Discussions–based) with [Remark42](https://remark42.com/), a self-hosted comment system. The integration involved theme synchronization, SPA navigation lifecycle, lazy loading, and managing comment instances across Astro view transitions. I spent more time on comment lifecycle management than I expected.

### The Layout Transformation

The site used to be called "Antonio's Notes Blog." Now it's just **Notes**. That name change was part of a bigger layout overhaul: simpler navigation, a masonry-style homepage with featured highlights, new typography (Lora for headings), and a mobile-first responsive redesign.

I redesigned the post sidebar to show taxonomy (categories and tags) more clearly, moved metadata around for mobile, added a floating table of contents for long essays, and rebuilt the mobile navigation with focus management and search integration.

Small things I care about: the search bar dynamically filters posts. The footer links to the exact version on GitHub. Dark mode respects your system preference but remembers if you override it.

### Social Sharing

Share buttons for Facebook, Twitter, BlueSky, and Threads. They generate URLs with the post description and the component sits in the sidebar on desktop and in an expandable section on mobile. I don't know who's sharing or if they are sharing, but users are able to do so if they want to.

### Quotes API

A random Stoic quotes API. `GET /api/quotes` returns quotes from Marcus Aurelius, Seneca, and Epictetus. Small feature. Makes me smile and is part of a bigger idea I have for a later time: I want to serve my own important or helpful quotes!

### Tag Governance

Tags used to be a mess. I'd slap whatever felt right on a post and move on. Now there's a [canonical tag vocabulary](/tag), a tag policy document, alias normalization (so `essay` and `essays` and `nota` all resolve to the same thing), and a tag management page with analytics-style views. The `/tag` page now opens with a sentence-style prelude linking to content forms — essays, notes, poems, ideas — when they exist on the site. It's a small touch that makes browsing feel intentional instead of random.

### Performance, Always

Font loading uses proper `<link>` preloads. Images are served in modern formats. The service worker uses version-synced cache names that bust on every build. Social images are generated at build time. No tracking scripts or third-party widgets and still achieving **100 page speed insights** score (According to vercel tooling at least!), so that's very important to me.


## What I've Been Writing About

The code is one half and the writing is the other. Here's what I wrote about, roughly by theme:

**Recovery and becoming.** *Who I Am Today: A Recovery Progress Report*. *Season of Becoming* — moving from performing growth to living it. *The Feeling Is Not the Problem* — about what happens when you suppress emotions instead of sitting with them.

**Love, fatherhood, and boundaries.** *Love Is the Final Revolution* — kindness as political act. *On Boundaries, Miscalibration, and Relearning Unconditional Love* — what happens when boundary-setting overcorrects. *The First Wall* and *On Clear Signals* — relationships, signals, walls.

**Politics and power.** *The Prometheus Problem* — how AI companies externalize consequences. *Notes on Puerto Rico: Sin Pie Forzao* — political analysis of the island's situation. *An Invitation to the End of Wealth Worship* — what comes after treating wealth as religion.

**Craft and building.** *Rolling Back Main (And Why You Shouldn't Have to)* — a post-mortem of trusting AI too much with git!!! 🫣 *On Leadership and Leadership-Adjacent Things* — a stupidly long (Sorry, not sorry!) essay on leadership as cost, care, and teaching others to lead.

**Grief and letting go.** *The Rhythm of Grief* and *Empathy as a Shield*.

Eight of these posts were published in both English and Spanish, using translation groups that let readers toggle between languages.

## How I Use AI Now — The Honest Version

Since the original sandbox post, AI went from something I occasionally used to a daily part of how I work on this site.

I work in [Cursor](https://cursor.sh/), an AI-native IDE, with Claude as the model I use most. I've built **six custom agent skills** for this repository — configuration files that give the AI specific context about the project:

- **Astro Webmaster** — has context about the project's architecture, content pipeline, and layout conventions. I use it when a change spans multiple files.
- **Brain Science Audit** — focused on the analytics pipeline. Checks build cost and data integrity in the writing-stats pages.
- **Content Strategy Map** — reads my last 30 posts and produces a topic map with suggested essay ideas based on what I've been writing about.
- **Multilingual Content QA** — checks that `translationGroup` fields are set correctly and that featured flags and publish states are consistent across language pairs.
- **Post Publishing Workflow** — validates frontmatter before I publish. Categories exist in the system? Tags follow the canonical vocabulary? Required fields present?
- **Release Quality Gate** — runs the pre-merge checklist: `pnpm run check`, `build`, `format:check`.

These are project-specific configurations, not generic prompts. They give the AI context about this codebase and these conventions.

### What the collaboration looks like in practice

AI writes first drafts of code. I review and shape. AI suggests refactors. I decide which ones to take. AI runs quality gates. I decide what to do about the results.

Sometimes the AI fucks up. *Rolling Back Main* exists because I let the AI handle too much without checking. It pushed changes that broke things, and I had to do a manual rollback on `main`. The lesson: **tools amplify both your strengths and your inattention!**

The collaboration works when I stay involved and when I don't, things break. Pretty obvious, but as a solo-developer it exposes the attention gap that otherwise someone else would have exposed to me (or perhaps I wouldn't be this careless at work with others! who knows...).

## Spec-Kit — How I Learned to Plan Before Building

On March 28, 2026, I adopted [github/spec-kit](https://github.com/github/spec-kit) for this project. I'm still in that testing phase, figuring it out.

Before spec-kit, my process was: get an idea, open a file, start coding, discover edge cases mid-build, refactor, ship something that mostly works and the AI made the chaos faster — more code, more changes, more things that could go wrong. Sometimes I would branch, other times I would commit directly to main but all of that changed when introducing Github's spec-kit because Spec-kit added structure. 

Here's what it looks like now:

**A project constitution** — five core principles ratified in `.specify/memory/constitution.md`:

1. **Content schema contracts** — posts must conform to the frontmatter spec. Categories must exist. Bilingual pairs must use `translationGroup`. Reading time comes from the remark pipeline, period.
2. **Static-first delivery** — the default experience must work with static prerendering. No sneaking in SSR or mandatory cookies without justification.
3. **Verification gates** — `pnpm run build` must succeed. TypeScript checks must pass. Formatting must be clean.
4. **Reader privacy** — reading progress stays in the browser. No third-party analytics without disclosure. Your data is yours.
5. **Feed integrity** — RSS, JSON Feed, Schema.org, and Open Graph must stay consistent when things change.

**Feature specs** with full artifacts. Every non-trivial feature now gets a `spec.md` (what and why), a `plan.md` (how), a `quickstart.md` (implementation guide), behavior contracts, and requirement checklists. I've shipped six (?) features through this workflow:

- **002** — Floating Table of Contents for long posts
- **003** — Homepage and About page voice refresh
- **004** — Professional UI/UX refinement pass (WCAG 2.2 AA compliance)
- **005** — Post sidebar redesign
- **006** — Mobile navigation rebuild
- **010** — Tag content-form links on the `/tag` page

Each one went through the same cycle: **spec → plan → build → verify**. The AI helps at several steps — drafting specs, writing code, running quality gates. I make the decisions about what to build and what trade-offs to accept.

What I like about spec-kit is that it makes the thinking visible. When I look at `specs/005-redesign-post-sidebar/spec.md`, I can see why I made the choices I made. The reasoning is documented, not just the code.

## The Artisanal Argument

Why keep building this when AI can generate entire websites?

Because my site is 550 commits of specific choices. A reading progress system that stores nothing on a server. A tag vocabulary that got refined over months. A constitution that says "reader privacy is non-negotiable." Bilingual essays that I wrote in both languages because ideas change shape when they cross languages and some writings I simply don't want to write in English, or in Spanish, depending on the materials.

A lot of that involved AI assistance. But the choices — what to build, what to skip, what principles to hold — those came from me sitting with the project over months, not from a prompt.

I think there's a difference between "AI-generated" and "AI-assisted." The first produces something generic while the second is a person using tools to build something specific. A woodworker who uses a CNC router still designed the piece and chose the wood. The machine cuts but the human decides.

550 commits. Most of them small and ALL of them mine.

## What's Next

The [roadmap](https://github.com/antoniwan/notes/blob/main/docs/roadmap.md) has what I'm thinking about next:

- **TLDRs for posts** — standalone summaries for each piece. A "TLDRs" index page as a compressed idea browser.
- **Audio versions** — "Click to listen" on posts, starting with browser TTS.
- **Email notifications** — a way to let people know when something new goes up. I'm kind of conflicted with this feature because I really don't want or care to know who you are and what you are reading from this site and I feel like adding an email subscription opens up that door that I can't close again.
- **Structured sources** — moving reading influences into frontmatter so they're browsable and connected to the Library.
- **More bilingual content** — I want more of my writing to exist in both languages.

I'm 7 specs into the spec-kit workflow now and each feature teaches me something about the next one. We'll see what else develops from this work.

---

Eight months ago I wrote: *"I fucking love working on my blog."*

It's still true. The tools got better, the process got more structured, and the work kept going — but the feeling is the same. I like building this thing. I like that it's mine.

This is still my art. Code and content together. The shedding, the adding, the crashes, the chaos. 550 commits of a man figuring out what he wants to say and building a machine to say it.

*The whole thing is [open source](https://github.com/antoniwan/notes). Version 5.21.0 and climbing. Come poke around.*