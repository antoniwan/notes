---
title: "I Don't Write the Code"
description: >-
  I shipped a tower game in three days and started a sword game a week later. Claude wrote every line. Here is what I do, and why I'm saying it.
pubDate: 2026-10-21T14:00:00-04:00
language:
  - en
category:
  - learning-projects
  - art-expression
  - diy-creation
tags:
  - game-development
  - ai
  - ai-agents
  - creativity
  - craftsmanship
  - software-development
  - writing
  - art-expression
draft: false
featured: true
published: true
showComments: true
translationGroup: i-dont-write-the-code
---

_Devlog 1 · October 21, 2026 · Uplift and Milak_

I have a day job and a family, and in the last ten days I put [a tower game on the web](https://uplifttowergame.com) and started building [a sword game](https://www.patreon.com/c/antoniwan) in a real game engine. I did not write a single line of the code for either one. Claude did.

A lot of people hate AI in games right now, and some of that hate is earned: there is [a flood of games on Steam](https://kotaku.com/steam-valve-slop-ai-genai-vibe-coding-pc-game-releases-2000746749) that somebody published but nobody seems to have directed, [games where nobody made a call](https://www.pcgamer.com/gaming-industry/steam-week-in-review-steam-next-fest-has-over-8-000-demos-as-worthless-vibe-coded-slop-levels-up/). So this devlog is about the calls I make while the machine types.

The tokens are going to be bought and used anyway, so I'll buy some and make kick-ass games with them, in the open. I say when AI is in the work, I make the calls, and I understand what it builds. The danger I worry about isn't someone like me making games with it. It's people running these models with the safety off and nobody watching.

## The two games

|                        | Uplift                                              | Milak                                                                      |
| ---------------------- | --------------------------------------------------- | -------------------------------------------------------------------------- |
| What it is             | A tower-building game, my take on SimTower          | A 3D action RPG: Milak Summir, a swordsman for hire                        |
| Where it stands        | Early and playable: a vertical slice, live and free | A combat prototype in plain shapes; its first bodies came in on October 20 |
| Decisions written down | 170+                                                | 100+                                                                       |
| Play it                | [uplifttowergame.com](https://uplifttowergame.com)  | Not yet. Support it on [Patreon](https://www.patreon.com/c/antoniwan)      |

<figure class="post-inline-figure post-inline-figure--center">
  <img src="/images/devlog-1-uplift-card.webp" alt="Uplift&#x27;s link card: its logo, a pixel-art tower with roots, beside a building and trees, with the words &#x27;Build a tower, floor by floor. Keep the elevators moving.&#x27;" width="1200" height="630" loading="lazy" decoding="async" />
</figure>

## Uplift: live in three days

Uplift started on October 11 with one sentence, more or less exactly: "i've always loved SimTower, let's build a worth web-based successor for it, let's create the project plan, let's define everything before building anything, help me out."

Define everything before building anything. That was the whole method, and it still is. Before any code there were questions, a lot of them, and every answer I gave got written down with my words and the date. When the code and my words disagree, my words win, and the code gets fixed.

Three days after that first sentence, Uplift was live.

<figure class="post-inline-figure post-inline-figure--center">
  <img src="/images/devlog-1-uplift-demo-tower.webp" alt="Uplift&#x27;s demo tower in play: fifteen floors of offices and homes over two basement levels, with the Tower, Objectives, Build, and Map panels open." width="1456" height="816" loading="lazy" decoding="async" />
</figure>

Then a friend played it and told me the first minute was confusing: too many panels, nothing to do. That one note became the new start of the game: an empty lot, one prompt, and the panels show up only when you need them. I didn't think of it. I just listened, and decided it was right.

I want more notes like that one, from more people. It's the reason I write devlogs at all.

## Milak: the game I've been dreaming about

The tower experiment, gave me the boost, the confidence to follow my dreams, basically! And my children enjoying my demos is a wild unexplainable sensation and feeling.

And yeah, I've been dreaming about Milak since the first time I played Yasuo and Yone in League of Legends. An RPG action game based solely on the quest of learning combat and martial arts and accumulating that skill and strength for a super fun adventure sandbox game. And this guy, our hero, he's a homebody! He only cares about eating tasty food TBH!

Milak started on the night of October 19. Milak Summir is a name I've used in my RPG runs for years, maybe since the original Guild Wars, and now he is a swordsman for hire who swings a two-handed bastard sword like a pencil. I told Claude, more or less: you're building it, not me, I'll direct the art.

<figure class="post-inline-figure post-inline-figure--center">
  <img src="/images/devlog-1-milak-mid-stride.webp" alt="Milak mid-stride on dusty ground, his two-handed sword raised." width="624" height="390" loading="lazy" decoding="async" />
</figure>

And the first thing I directed was no art at all. Milak was a blue capsule swinging at straw dummies until the fight felt right in my hands. Art on a fight that isn't fun is wasted, so it waited. The fight passed that check on October 20, and only then did bodies come in. Most of the job, I think, is deciding what not to build yet.

<figure class="post-inline-figure post-inline-figure--center">
  <img src="/images/devlog-1-milak-plain-shapes.webp" alt="An early Milak: a blue capsule hits straw training dummies." width="1280" height="560" loading="lazy" decoding="async" />
</figure>

<figure class="post-inline-figure post-inline-figure--center">
  <img src="/images/devlog-1-milak-ninja-fight.webp" alt="Milak with a real body, in a pool of blood among black-clad ninjas." width="1280" height="455" loading="lazy" decoding="async" />
</figure>

<figure class="post-inline-figure post-inline-figure--center">
  <img src="/images/devlog-1-milak-dummy-hit.webp" alt="Milak&#x27;s sword hits a straw dummy and straw flies." width="1280" height="455" loading="lazy" decoding="async" />
</figure>

<figure class="post-inline-figure post-inline-figure--center">
  <img src="/images/devlog-1-milak-dummies-spin.webp" alt="Milak spins, and the straw dummies around him break apart." width="1280" height="455" loading="lazy" decoding="async" />
</figure>

## How I direct Claude

My rule since October 14: "anything visually, every pixel, every line in this game, is it intentional, is it helpful, does it provide value to the game? always"

Claude proposes, a lot, and fast. Most of my time goes to saying which of the three options is the game and which two are not. Sometimes none of them is, and I say what is, in my own clumsy words, like the sword tornado, which I described as a coil, a stomp, three swings, and then a 360 that throws "a fucking tornado of dirt, blood, whatever was in that cone". Claude turned that into a move. I played it, and I said what was wrong with it, and we went again.

The science in the swing lab is brilliant. Claude built a tool that poses Milak through every sword animation, traces the tip of the blade, and marks the moment of the blow, with a dummy one meter in front of him for scale. It found that the animations were made for one-handed swords: his 1.65-meter blade went into the floor. So Milak starts with a normal sword now, and he earns the big one later.

<figure class="post-inline-figure post-inline-figure--center">
  <img src="/images/devlog-1-milak-swing-lab.webp" alt="Twelve frames from the swing lab: Milak lifts a huge black sword over his head and brings it down beside a training cylinder, the path of the blade&#x27;s tip traced in yellow." width="1600" height="900" loading="lazy" decoding="async" />
</figure>

<figure class="post-inline-figure post-inline-figure--center">
  <img src="/images/devlog-1-milak-grip-fix.webp" alt="Before and after the grip fix: on the left Milak&#x27;s sword angles down beside his hand; on the right it extends straight out from his fist at the blow." width="1216" height="560" loading="lazy" decoding="async" />
  <figcaption>The grip fix of October 21, before and after: the sword now sits in Milak's fist.</figcaption>
</figure>

What AI does for me is what a studio would do, if I were rich enough to pay one to build Milak.

I don't write the code, but I understand the codebase, completely. That's part of being a game developer. If you aren't doing that, then can you really say you are building a game, just by feel? How will you maintain it? That's how I can maintain it.

## The games write back

Uplift turned into a world-building tool for a novel. Its tower lives in a world I've been writing for years, and on October 19 I told Claude: "If you write it into the game it becomes canon in the universe - think about that". So now it works both ways. When the game needed robots and animals, I picked them, and now they exist in the novel's world too. That world is far enough in the future that a lot of it is guesswork, even for me, and the game keeps asking questions the novel never did: who walks the halls at night, what lives underground, what you find when you dig. Wild.

Milak might do the same thing from the other side. The game is meant to have him thinking as he travels, thoughts and maybe poems, with the player guiding them. That's writing, inside a game. Maybe one day it becomes a story of its own. I don't know yet.

I already had a place to write about the games. Coincidental, accidental, or intentional? Honestly, a bit of each. Notes was here for over a year before these games existed; that part is an accident. On October 7, four days before Uplift started, I wrote that all of my writing would be free and that people could support me on Patreon if they wanted; the timing is a coincidence. Writing these devlogs here is the intentional part.

## Is it slop?

Some of you might consider it slop, but I strongly disagree. To what standard is a free game that is a WIP, and being worked on with intentional direction is slop?

I am debating the ethics, the morality, the whys, the why-nots, of the whole AI-is-art-or-not debate. I wrote about it in [Front Row to the End of the World](https://notes.antoniwan.online/p/front-row-to-the-end-of-the-world/), and I still think what I thought then:

> I think we might be headed for a golden age of art. AI flattens the learning curves, and that could bring the next Leonardos and Leonardas forward.
>
> And the debate about whether AI art is even art? To me it's silly. It's a print. Yes, it's art. A print can be low or high quality, like any other print.
>
> Disclosure should matter, and then, the integrity of each person determines the value of that piece of art.

Merriam-Webster made "slop" its [word of the year for 2025](https://techcrunch.com/2025/12/15/merriam-webster-names-slop-the-word-of-the-year/): "digital content of low quality that is produced usually in quantity by means of artificial intelligence." Simon Willison, the programmer who helped the word catch on in 2024, [puts it shorter](https://simonwillison.net/2024/may/8/slop): AI content that is unrequested and unreviewed. And my own take, from the same essay: slop is still art, just sloppy.

Is it low quality? Is it made in quantity? Did anybody review it?

- **Uplift.** It's a work in progress, so parts of it are rough, and I know which ones: there's no sound yet, the rules for stairs aren't right, an empty lot looks the same as an abandoned one, and some buttons sit in the wrong panel. It also holds 60 frames a second with 15,000 people in the tower, every change has to pass its 311 tests before it's committed, and every one of its 170-plus decisions has my words on it. It's one game, not a pile of them. And it's reviewed: I play it, a friend played it and changed its first minute, and every change goes through me.
- **Milak.** It's two days old, so judge it later. For now: it was a blue capsule until the fight was fun, and the bodies that came in after are free models made by a person, [Quaternius](https://quaternius.com), not generated ones. One game. Nothing got art before it passed my check.
- **This post.** Claude wrote the first draft of it from my notes, and I'm rewriting it. By Willison's test, it isn't slop: I asked for it, and I'm reading every line. By Merriam-Webster's, quality is yours to judge, and that goes for all three. What I can promise is that a person made every call.

By my own moral and ethical standards, Anthropic is a company I'm okay using and paying, by the way. I pay for my plan myself; nobody sponsors me. If I'm wrong about them, leave me a note down there!!

## The hats I wear

Making two games without a studio, from October 11 to today, means wearing almost every hat.

| Role                  | Who                             | What it looks like                                                                                                |
| --------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Creative director     | Me                              | The vision for both games and the final word on every call: 170+ written decisions in Uplift, 100+ in Milak       |
| Game designer         | Me                              | The sword tornado's chain, stamina, Milak's talent web, Uplift's stars and construction crews                     |
| Art director          | Me                              | League's "hand-painted, yet graphic" look for Milak, every pixel earning its place, which models and fonts go in  |
| World builder         | Me                              | Uplift's tower lives in a world I've been writing for years, for a novel                                          |
| Engineer              | Claude                          | Every line of code: 300+ commits in Uplift, 150 in Milak                                                          |
| Code reviewer         | Me                              | I understand the codebase, completely                                                                             |
| Producer              | Me, with Claude's plans         | What gets built next and what waits, like plain shapes until the fight was fun                                    |
| QA and playtesting    | Friends, Claude's tests, and me | Friends send notes; I play both; Uplift has 311 tests every change must pass, and holds 60 fps with 15,000 people |
| 3D artist             | Quaternius, and maybe you       | Milak's bodies, clothes, animals, and the yard: free models made by a person                                      |
| Sound                 | Kenney for now, me later        | Milak's placeholder sounds are Kenney's; Uplift's sound waits on mine                                             |
| Researcher            | Claude                          | The asset library for Milak, and the market numbers I plan with                                                   |
| Writer and translator | Claude drafts, I rewrite        | This devlog, in English and Spanish                                                                               |
| Marketer              | Me                              | The soft launch, this devlog, the Antonio Builds Games channel, the Patreon page                                  |
| Community             | Me                              | Playtest links, an anonymous feedback form that files every answer for me, and the comments below                 |

Claude wears the engineer's hat and helps with research, tests, and first drafts. The rest are mine, or belong to the people whose free models and sounds are in Milak.

If you draw, model, animate, or make sounds, and building these games with me sounds fun, say hi down there. Worst case, we make something cool together. Best case, this is how a little game studio starts, lol. No pressure, I promise. I already wear enough hats to know how heavy they get.

## What went wrong

It is not magic and it is not free. Claude remembers things about the engine that don't exist anymore, and I learn that when the build breaks. It runs out of quota in the middle of a good week. Uplift's first push cost me $250 of credits and almost a whole week of my plan. And I'm new to making games. I have taste and I have a lot of years of making software, but I'm learning the craft of games in public, here, and I will get things wrong in public too.

## What's next

Every other week I'll write one of these: what got built, what I decided, and what I got wrong. Uplift is playable now, free, in your browser. Milak will have a free demo when the fight is something I'm proud of.

If you want to follow along, I'll ask one thing: [follow me on Patreon, for free](https://www.patreon.com/c/antoniwan), and you'll get each devlog by email when it ships. No ads, ever. Just the games and me making them.

_Screenshots: Uplift's live demo and its link card, October 21, 2026; Milak's own recordings, October 20 and 21, 2026._
