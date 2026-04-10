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

The commit cadence mirrors my life — bursts of 119 (July) and 107 (November) when I'm on fire, then 9 (October) and 14 (January) when I'm living, parenting, recovering. My son Andre Antonio was born on December 25, 2025. January was 14 commits. That's not a dip in productivity — that's a man holding his newborn. I'm not shipping to a sprint board. I'm shipping to my own internal clock.

This artisanal project remains the most meaningful creative work I do — and the sharpest instrument I have for witnessing myself. The goal is always the same: become what I write, and be as honest through the process as I can.

## What I Built

Here's the tour. Not a changelog — a narrative of what I actually cared enough to build, and why.

### Brain Science

This one is wild. I built a multi-page analytics suite that runs at build time and generates writing statistics about my own posts — cadence charts, topic evolution, sentiment analysis, consistency tracking. [Chart.js](https://www.chartjs.org/) powers the visualizations, and the whole thing runs as a static page. No server, no database, just my words being analyzed by my own code.

Why? Because I wanted to *see* my own patterns. How often do I write? What themes recur? When do I go quiet? Brain Science turned my blog into a mirror. It's the most self-indulgent feature on the site and I regret nothing.

### Guided Path

A curated seasonal reading order. You land on it, pick where you are, and it walks you through posts in the sequence I think makes sense — not chronological, but *thematic*. Progress is stored in your browser only. No accounts, no tracking, no cookies with someone's name on them.

### Read/Unread Tracking

Every post you've read is marked with a subtle visual indicator. Progress is kept in `localStorage`. If you clear your browser, it's gone. That's the point — I don't want your reading data. I just want to help you remember what you've already seen.

### The Comments Overhaul

I replaced [Giscus](https://giscus.app/) (GitHub Discussions–based) with [Remark42](https://remark42.com/), a self-hosted comment system. The integration was a beast — handling theme synchronization, SPA navigation lifecycle, lazy loading, and making sure comment instances don't leak memory during Astro view transitions. I spent more time on comment lifecycle management than I'd like to admit. But the result is a comment system that *actually works* with my site's architecture instead of fighting it.

### The Layout Transformation

The site used to be called "Antonio's Notes Blog." Now it's just **Notes**. The branding simplification was part of a bigger layout overhaul: simpler navigation, a masonry-style homepage with featured highlights, cleaner typography (Lora for headings, which gives the essays the weight they deserve), and a responsive design that actually breathes on mobile.

I redesigned the post sidebar to show taxonomy (categories and tags) clearly, moved metadata around for mobile, added a floating table of contents for long essays, and rebuilt the mobile navigation from scratch with proper focus management and search integration.

Small things that matter: the "Back to Top" button has a satisfying animation. The search bar dynamically filters posts. The footer links to the exact version on GitHub. Dark mode respects your system preference but remembers if you override it. These details aren't features — they're hospitality.

### Social Sharing

Share buttons for Twitter, BlueSky, and Threads. Simple, non-obnoxious, and they generate clean URLs with the post description. The share component sits in the sidebar on desktop and in an expandable section on mobile. I debated whether to add these at all — sharing should happen because the writing is good, not because a button is shiny. But making it easy to share is still a form of respect for the reader.

### Quotes API

A random Stoic quotes API on a static site. `GET /api/quotes` returns wisdom from Marcus Aurelius, Seneca, and Epictetus. It's a tiny feature, but it makes me smile every time I hit the endpoint. Sometimes you build things because they're useful. Sometimes you build them because they spark joy.

### Tag Governance

Tags used to be a mess. I'd slap whatever felt right on a post and move on. Now there's a [canonical tag vocabulary](/tag), a tag policy document, alias normalization (so `essay` and `essays` and `nota` all resolve to the same thing), and a tag management page with analytics-style views. The `/tag` page now opens with a sentence-style prelude linking to content forms — essays, notes, poems, ideas — when they exist on the site. It's a small touch that makes browsing feel intentional instead of random.

### Performance, Always

100/100 on PageSpeed Insights. Still. Font loading optimized with proper `<link>` preloads. Images served in modern formats. Service worker caching with version-synced cache names that bust on every build. Social images generated automatically at build time. No tracking scripts, no third-party widgets that slow things down.

Fast is a moral position when you're asking someone to read your words.

## What I've Been Writing About

The code is one half of the art. The other half is the writing itself. In eight months, the essays went deeper, harder, and more bilingual.

**Recovery and becoming.** *Who I Am Today: A Recovery Progress Report* was raw vulnerability on a screen. *Season of Becoming* drew a line in the sand — moving from performing growth to living it. *The Feeling Is Not the Problem* pushed back against emotional suppression culture.

**Love, fatherhood, and boundaries.** *Love Is the Final Revolution* argued that building a home rooted in kindness is the most radical political act. *On Boundaries, Miscalibration, and Relearning Unconditional Love* examined what happens when your boundary-setting gets miscalibrated and you have to recalibrate toward openness. *The First Wall* and *On Clear Signals* explored the geometry of human relationships.

**Politics and power.** *The Prometheus Problem* is my longest critical piece — an examination of how AI companies position themselves as saviors while externalizing the consequences of their systems onto teenagers and vulnerable populations. *Notes on Puerto Rico: Sin Pie Forzao* was political analysis with Caribbean anger. *An Invitation to the End of Wealth Worship* imagined what comes after capitalism-as-religion.

**Craft and building.** *Rolling Back Main (And Why You Shouldn't Have to)* was an honest post-mortem of what happens when you trust AI too much with your git history. *On Leadership and Leadership-Adjacent Things* was a monster essay — leadership as cost, care, and teaching others to lead.

**Grief and letting go.** *The Rhythm of Grief* and *Empathy as a Shield* sat with pain instead of trying to fix it.

Eight of these posts were published in both English and Spanish, using translation groups that let readers toggle between languages. Every bilingual post is a commitment — not just translation, but re-thinking the ideas in another linguistic frame.

## How I Use AI Now — The Honest Version

Here's where it gets interesting. Since the original sandbox post, AI went from "neat toy I occasionally use" to "daily collaborator I've built custom tooling around."

I work in [Cursor](https://cursor.sh/), an AI-native IDE, with Claude as my primary pair-programmer. But "pair-programmer" undersells what's actually happening. I've built **six custom agent skills** specifically for this repository:

- **Astro Webmaster** — the principal orchestrator. It understands the project's architecture, content pipeline, SEO patterns, and performance constraints. When I ask it to help with a change that spans layouts, components, and content, it knows where things live and what contracts to honor.
- **Brain Science Audit** — focused on the analytics pipeline. It checks build cost, cache usage, and data integrity in the writing-stats pages so I don't accidentally make builds take five minutes.
- **Content Strategy Map** — audits my last 30 posts and produces a topic map with suggested essay ideas. It identifies theme gaps and generates writing prompts grounded in what I've *actually* been writing about, not generic advice.
- **Multilingual Content QA** — audits translation linking. It checks that `translationGroup` fields are set correctly, that featured flags don't accidentally hide a language version, and that publish states are consistent across pairs.
- **Post Publishing Workflow** — validates frontmatter before I publish. Categories exist in the system? Tags follow the canonical vocabulary? Required fields present? It catches the stupid mistakes before they break feeds and structured data.
- **Release Quality Gate** — runs the full pre-merge checklist: `pnpm run check`, `build`, `format:check`, and flags anything that drifted from the project constitution.

These aren't generic AI prompts. They're **project-specific intelligence** that understands *this* codebase, *these* conventions, *this* content model. The AI doesn't replace my judgment — it amplifies my ability to enforce the standards I've set for myself.

### The Honest Part

AI writes first drafts of code. I review and shape. AI identifies patterns and suggests refactors. I decide which ones matter. AI runs quality gates. I make the judgment calls about what "good enough" means for a personal art project versus a production system.

And sometimes the AI fucks up. *Rolling Back Main* exists because I let the AI handle too much without checking. It pushed changes that broke things, and I had to do a manual rollback on `main` — the kind of thing you write a post-mortem about, not because it was catastrophic, but because the lesson is universal: **tools amplify both your strengths and your inattention.**

The collaboration works because I've been clear about the boundaries. The AI is a power tool. I'm the craftsman. When I pick up a power sander, the table is still mine. Same principle.

## Spec-Kit — How I Learned to Plan Before Building

On March 28, 2026, I adopted [github/spec-kit](https://github.com/github/spec-kit) for this project, and it changed how I work.

Before spec-kit, my process was: get an idea, open a file, start coding, discover edge cases mid-build, refactor, ship something that mostly works. It was fun but chaotic. The AI made the chaos faster — more code, more changes, more things that could go wrong.

Spec-kit introduced structure without killing the joy. Here's what it looks like now:

**A project constitution** — five core principles ratified in `.specify/memory/constitution.md`:

1. **Content schema contracts** — posts must conform to the frontmatter spec. Categories must exist. Bilingual pairs must use `translationGroup`. Reading time comes from the remark pipeline, period.
2. **Static-first delivery** — the default experience must work with static prerendering. No sneaking in SSR or mandatory cookies without justification.
3. **Verification gates** — `pnpm run build` must succeed. TypeScript checks must pass. Formatting must be clean. These aren't aspirational; they're enforced.
4. **Reader privacy** — reading progress stays in the browser. No third-party analytics without disclosure. Your data is yours.
5. **Feed integrity** — RSS, JSON Feed, Schema.org, and Open Graph must stay consistent when things change.

**Feature specs** with full artifacts. Every non-trivial feature now gets a `spec.md` (what and why), a `plan.md` (how), a `quickstart.md` (implementation guide), behavior contracts, and requirement checklists. I've shipped six features through this workflow:

- **002** — Floating Table of Contents for long posts
- **003** — Homepage and About page voice refresh
- **004** — Professional UI/UX refinement pass (WCAG 2.2 AA compliance)
- **005** — Post sidebar redesign
- **006** — Mobile navigation rebuild
- **010** — Tag content-form links on the `/tag` page

Each one went through the same cycle: **spec → plan → build → verify**. The AI helps at every step — drafting specs, generating implementation plans, writing code, running quality gates. But the *decisions* — what to build, why it matters, what trade-offs to accept — those are mine.

The beautiful thing about spec-kit is that it makes the *thinking* visible. When I look at `specs/005-redesign-post-sidebar/spec.md`, I can see exactly why I made the choices I made. The reasoning is documented, not just the code. That's a gift to future me, and to anyone who reads the source.

## The Artisanal Argument

People ask me — sometimes with genuine curiosity, sometimes with barely concealed skepticism — why I keep building this when AI can generate entire websites in minutes.

Here's my answer: **AI can generate a website. It cannot generate *my* website.**

My site is 550 commits of intentional choices. It's a reading progress system that respects your privacy. It's a tag vocabulary that was debated, refined, and documented. It's a constitution that says "reader privacy is non-negotiable" and means it. It's bilingual essays that exist because I believe ideas change shape when they cross languages.

None of that comes from a prompt. It comes from caring — stubbornly, unreasonably, joyfully caring — about every detail of a thing that, let's be honest, maybe a few hundred people will ever see.

The AI makes me faster. Spec-kit makes me more disciplined. But the thing that makes this site *mine* is the same thing it's always been: I give a shit about it in a way no tool can replicate.

There's a difference between "AI-generated" and "AI-assisted artisanal." The first is a commodity. The second is a craft practice that happens to use powerful tools. A woodworker who uses a CNC router is still a woodworker — especially when they designed the piece, chose the wood, and decided where the grain should run. The machine executes. The human *decides*.

550 commits. Every one a decision. Every one mine.

## What's Next

The [roadmap](https://github.com/antoniwan/notes/blob/main/docs/roadmap.md) is honest about where this is going:

- **TLDRs for posts** — standalone summaries that force me to distill each piece to its essence. A "TLDRs" index page as a compressed idea browser.
- **Audio versions** — "Click to listen" on posts, starting with browser TTS and maybe recording my own voice eventually.
- **Email notifications** — a quiet, honest way to let people know when something new goes up. No growth hacks, no manipulative copy.
- **Structured sources** — moving my reading influences into frontmatter so they're navigable and transparent, connected to the Library.
- **More bilingual content** — every essay that matters deserves to exist in both languages.

I'm also 7 specs deep into a workflow that generates its own momentum. Each feature I ship teaches me something about the next one. The process compounds.

---

Eight months ago I wrote: *"I fucking love working on my blog."*

It's still true. More true. The tools got better, the process got sharper, and the work got deeper — but the feeling hasn't changed. It's still the same childlike, obsessive, unreasonable joy of building something that works exactly how I want it to work.

This is still my art. Code and content together. The shedding, the adding, the crashes, the chaos. 550 commits of a man figuring out what he wants to say and building the exact machine to say it.

*The whole thing is still [open source](https://github.com/antoniwan/notes). Still version 5.21.0 and climbing. Still fast, still mine, still alive. Come poke around.*