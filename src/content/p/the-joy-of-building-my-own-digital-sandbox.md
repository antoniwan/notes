---
title: The Joy of Building My Own Digital Sandbox
description: >-
  Why I spend hundreds of hours building a custom blog when perfectly good
  solutions exist.  Because this digital art project—code and content
  together—is how I view the world.
pubDate: '2025-07-29T22:00:00.000Z'
language:
  - en
heroImage: /images/how-i-view-the-world.avif
category:
  - systems-strategy
  - diy-creation
  - metaspace
  - art-expression
tags:
  - astro
  - typescript
  - web-development
  - open-source
  - diy-creation
  - systems-strategy
  - art-expression
  - metaspace
  - coding
  - personal-projects
  - digital-art
  - craftsmanship
draft: false
featured: false
published: true
showComments: true
---

I fucking love working on my blog.

Not just the writing part — though brainstorming ideas and watching them come together is pretty satisfying. I'm talking about the **code**. The features. The endless tweaking and optimization. The pure, childlike joy of building something that works exactly how I want it to work.

This digital art project — code and content together — is how I view the world, linearly, through my life, my days, my experiences. I try to post what's most meaningful to me, along with the code updates that feel most meaningful. Git carries the history: the shedding, the adding, the crashes, the chaos.

This is my art.

## This Is My Art

Look, I'm a terrible painter. I can play music pretty well, and I'm a kickass cook because I focused on fundamentals instead of fancy shit. But my real art — the thing I'm actually good at — I don't know yet, but I intend to find out. I keep learning things every day. Learning about everything and anything. Aprendiendo de todo. We keep moving with intention, and this art project helps me channel a lot of energy.

Building systems, thinking through hard problems in public — that's part of it. The technical work and the philosophical exploration, together.

This blog is both the canvas and the gallery. The code I write to make it work is one form of creative expression. The essays I publish about fatherhood, masculinity, and building better systems — that's the other form. They're not separate things. They're two parts of the same artistic practice.

When I spend hours perfecting the reading progress indicator, that's craft. When I write about what it means to raise resilient children in a fractured world, that's also craft. Both require attention, intention, and the willingness to iterate until it's right.

Other people might separate their "real work" from their creative expression. For me, building this platform and filling it with honest thinking about hard questions — that's the whole art project. We keep moving with intention.

## Why Build When Ghost or WordPress Exists?

Fair question. Why spend hundreds of hours building a custom blog system when perfectly good solutions exist?

Because those solutions aren't **mine**. They're compromises. Built for everyone, which means they're not built for me. They solve 80% of problems for 80% of people, leaving me wrestling with the remaining 20% that matters most.

Want dark mode that feels intentional instead of slapped-on? Need a category system that matches how my fractured brain actually organizes thoughts? Require reading indicators that don't lie about progress?

With my own system, I don't ask permission. I don't fight with themes. I don't install plugins that break everything else. I just build what I need.

## The Stack That Doesn't Suck

My blog runs on Astro, TypeScript, and Tailwind CSS. Modern tools that get out of my way instead of creating more problems:

- **Dynamic category filtering** with icons that actually mean something
- **Multi-language support** for English and Spanish content (terrible implementation for now, but it's mine to improve)
- **Reading progress indicators** that work correctly instead of lying
- **SEO optimization** that doesn't feel like keyword-stuffing spam
- **Dark mode** that respects system preferences but remembers manual overrides

Each feature started as an itch I needed to scratch. Each one taught me something new about web development, user experience, or just how my own mind works.

## Markdown: The Sweet Spot Between Power and Simplicity

Everything is markdown files. No database. No admin panel. No WYSIWYG editor that mangles my HTML behind my back.

Just clean, portable text files that I can edit anywhere, version control with Git, and deploy to any service that accepts static files.

The frontmatter system lets me add metadata without cluttering the content:

```yaml
---
title: "Post title that doesn't suck"
description: 'One line that captures the essence'
pubDate: '2025-01-29T00:00:00.000Z'
category: ['systems-strategy', 'diy-creation']
tags: ['astro', 'typescript', 'open-source']
featured: true

---
```

Simple. Portable. Future-proof.

## Design That Serves the Words

I spent weeks getting the typography right. Not because I'm a perfectionist, but because bad typography makes good ideas harder to absorb. And if you're going to share your thinking publicly, you owe it to readers to make it as clear as possible.

Open Sans for body text — readable at any size. Source Serif Pro for headings — weight and character without pretension. Fira Code for code blocks because if you're sharing your craft, make it look good.

The layout breathes without wasting space. Colors that work in both light and dark modes. No unnecessary animations or widgets that distract from what matters: the ideas.

This is part of the art too — making sure the technical decisions serve the content instead of getting in the way.

## Performance That Actually Matters

100/100 on PageSpeed Insights isn't vanity — it's respect for people's time and attention.

Static generation means everything loads instantly. Image optimization happens automatically. Bundle size stays tiny because I only ship what's needed.

No tracking scripts. No analytics that slow things down. No third-party widgets that break when their servers have problems.

Just fast, clean, intentional web pages that work everywhere.

## Open Source by Default

The whole thing is [open source on GitHub](https://github.com/antoniwan/notes). Not because I think it'll change the world, but because hoarding knowledge is pointless.

If someone wants to see how I built the reading progress indicator or category system, the code is right there. Take it. Improve it. Make it yours.

It's also my backup plan. If something happens to me, if I lose interest, if I move on — the code survives. The writing survives. The system keeps working without me.

## What's Next

I'm always tinkering. Always improving. Currently working on:

- **Better search functionality** that finds what you're actually looking for
- **Related posts algorithm** that surfaces genuinely relevant content instead of random suggestions
- **Comment system** that doesn't suck (maybe Webmentions?)
- **Performance optimizations** because fast can always be faster

---

_Want to see how it all works? Check out the [source code](https://github.com/antoniwan/notes) or just poke around this site. Everything you see was built with intention, iteration, and probably too much caffeine._
