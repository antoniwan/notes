---
title: Rolling Back Main (And Why You Shouldn't Have to)
description: >-
  Practical guide for solo developers who need to undo bad commits on main,
  followed by an honest reflection on why it happened and how to avoid it when
  vibecoding with AI tools.
pubDate: '2026-03-09T16:30:00.000Z'
language:
  - en
heroImage: /images/2026/lgtm-antoniwan.jpg
category:
  - systems-strategy
  - learning-projects
  - metaspace
tags:
  - git
  - version-control
  - ai-agents
  - workflow
  - critical-thinking
keywords:
  - git
  - branching
  - ai agents
draft: false
featured: true
published: true
showComments: true
---

## Rolling Back Main (And Why You Shouldn't Have to)

A guide for solo developers who committed directly to main and need to undo it, followed by an honest look at why it happened. Written from real experience on a mobile-first turborepo project: Expo for native, Next.js for web and admin, Hono for the API, all wired together with tRPC and backed by Turso.

## Part 1: The Rollback Guide

### The Situation

I was vibecoding the early scaffolding of a mobile-first turborepo. Clerk auth was integrated, tRPC was wired up, NativeWind was styled, the Expo app was talking to the Hono API. Things were moving. Then I started refactoring the auth screens to "improve user experience," and five commits later I had broken a bunch of things I didn't notice until it was too late.

The irony: the commit messages all say things like "improve," "enhance," "streamline." They were doing the opposite. _Let's fix this mess!_

### Before You Start

The first step is figuring out where you are and where you need to go back to. Run this to see your recent commit history:

```bash
git log --oneline
```

You'll get a list of commits, newest first. Each line is a short SHA and a commit message. What you're looking for is the last commit where everything still worked. Scan the messages and find the boundary between "this was fine" and "this is where things started breaking."

Next, check whether your bad commits have already been pushed to the remote:

```bash
git log origin/main --oneline
```

If the bad commits are only local, your life is easier. If they're already on the remote, you'll need to either force push (Strategy A) or push revert commits (Strategy B).

### My Situation

Here's what my log looked like:

```
49ac744 (HEAD -> main, origin/main) Update documentation: add SERVICES.md...
831db24 Refactor useVerifyEmail hook to improve session finalization logic...
c24cdd7 Enhance authentication flow by integrating email parameter handling...
3027eec Refactor authentication screens to improve user experience...
8b6b164 Enhance error messages and handling in authentication screens...
b853068 Update documentation to reflect recent changes: add AUTH-SETUP.md...
ce956ac Refactor mobile app layout and TabOneScreen to improve navigation...
751f5f7 Integrate Clerk authentication into mobile app...
66afbd7 Refactor mobile app layout and TabOneScreen to integrate SafeAreaProvider...
...etcetera!!!...
```

Everything from `8b6b164` up through `49ac744` needs to go. The last known good state is `b853068`, right after documenting the auth setup and before touching the auth screen components. That's 5 commits to undo (_a topic for later..._).

All five bad commits were already pushed (`origin/main` pointed to `49ac744`). That means whichever strategy I pick, I need to deal with the remote too.

### Strategy A: Rewrite History (`git reset`)

**What it does:** Moves the `main` branch pointer back to your last good commit as if the bad commits never happened. Clean history, but those commits are erased from the branch.

**When to use it:** You're a solo developer, nobody else has pulled your bad commits, and you don't care about preserving a record of the mistake.

```bash
# 1. Make sure your working directory is clean
git stash  # if you have uncommitted changes you want to keep

# 2. Reset main to the last good commit (use your SHA here)
git reset --hard b853068

# 3. If you already pushed the bad commits to remote, force push
git push --force-with-lease origin main
```

`--force-with-lease` is safer than `--force`. It refuses to push if someone else has pushed commits you haven't seen. Unlikely for a solo dev, but it's a good habit that costs nothing.

**After this:** Both local and remote `main` point to your last good commit. In my case, the auth screen refactoring, the `useVerifyEmail` hook changes, the email parameter handling, and the documentation updates from those commits are all gone from history.

The bad commits still exist in git's reflog for about 30 days if you need to recover anything. Run `git reflog` to see them:

```
b853068 (HEAD -> main, origin/main, origin/HEAD) HEAD@{0}: reset: moving to b853068
49ac744 HEAD@{1}: clone: from https://github.com/antoniwan/nido-app.git
```

See that `49ac744 HEAD@{1}`? That's the HEAD of the bad commits, still accessible. If I realize later that one of those five commits had something I actually needed, I can cherry-pick it out:

```bash
# Check out a specific file from the bad commits without restoring the whole thing
git checkout 49ac744 -- path/to/file-i-actually-needed.ts

# Or cherry-pick a single commit onto a new branch to extract what you need
git checkout -b recovery/grab-that-one-thing
git cherry-pick c24cdd7
```

The reflog is the safety net under the safety net. The bad commits aren't really gone; they're just not on any branch. Git will garbage-collect them after about 30 days, so if you think you might need something from them, don't wait.

### Strategy B: Preserve History (`git revert`)

**What it does:** Creates new commits that undo the bad commits. The original commits stay in history, and the revert sits on top. Nothing is erased.

**When to use it:** You want a record of what happened and what you undid, or you're uncomfortable rewriting history, or others may have already pulled your changes.

```bash
# 1. Revert the bad commits (newest to oldest), staged but not yet committed
#    Replace the number with however many commits you need to undo
git revert --no-commit HEAD~5..HEAD
```

This runs silently if there are no conflicts. No output means it worked.

_(Note: when I tested this strategy, I did a dry run reverting 3 commits instead of all 5. The output below reflects that test. The process is identical regardless of the count — just adjust the number.)_

Now review what it staged:

```bash
git diff --cached
```

Here's a truncated version of what I saw when I ran this on my project (reverting 3 documentation-related commits as a test):

```diff
diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
@@ -38,10 +38,9 @@ pnpm check-types
 | [GETTING-STARTED.md](docs/GETTING-STARTED.md)       | How to chip away — build order, commands, where to look      |
 | [AUTH-SETUP.md](docs/AUTH-SETUP.md)                 | Auth setup, test users, testing login and sign-up            |
 | [MONOREPO.md](docs/MONOREPO.md)                     | Monorepo layout, three web apps (marketing, admin, embedded) |

diff --git a/apps/admin/.env.example b/apps/admin/.env.example
deleted file mode 100644
--- a/apps/admin/.env.example
+++ /dev/null
@@ -1,4 +0,0 @@
-# Clerk (admin auth). Get keys from https://dashboard.clerk.com/
-NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
-CLERK_SECRET_KEY=sk_test_xxxx

diff --git a/apps/admin/.gitignore b/apps/admin/.gitignore
@@ -27,7 +27,6 @@ yarn-error.log*
 .env*
-!.env.example

diff --git a/apps/mobile/.env.example b/apps/mobile/.env.example
deleted file mode 100644

... (many more files — the diff will be long in a monorepo)
```

This is the "review" step. You're reading the diff to confirm it's undoing what you expect: documentation rows removed from the README table, `.env.example` files deleted, `.gitignore` exclusions reverted. If something looks wrong, you can abort with `git reset HEAD` before committing anything.

Once you're satisfied, commit and push:

```bash
# 3. Commit the revert as a single commit
git commit -m "Revert auth refactoring commits (49ac744..8b6b164): broke session finalization and email verification flow. Rolling back to b853068."

# 4. Push normally (no force needed)
git push origin main
```

Here's what my commit and push looked like:

```
[main 6c650fb] Revert commits because I'm a dumbass
 22 files changed, 261 insertions(+), 2283 deletions(-)
 delete mode 100644 apps/admin/.env.example
 delete mode 100644 apps/mobile/.env.example
 delete mode 100644 apps/mobile/app/(auth)/_layout.tsx
 delete mode 100644 apps/mobile/app/(auth)/sign-in.tsx
 delete mode 100644 apps/mobile/app/(auth)/sign-up.tsx
 delete mode 100644 apps/mobile/app/(auth)/verify-email.tsx
 delete mode 100644 apps/mobile/app/index.tsx
 delete mode 100644 docs/AUTH-SETUP.md
```

22 files changed. 2,283 lines deleted. That's the cost of five bad commits in a monorepo.

The push goes through normally since we're adding commits, not rewriting history:

```
To https://github.com/antoniwan/nido-app.git
   b853068..6c650fb  main -> main
```

**A note on the commit message:** My actual message was _"Revert commits because I'm a dumbass."_ I'm of two minds on this. On one hand, it's honest and it's my repo. On the other hand, commit messages are documentation. Six months from now, `git log --oneline` will show `6c650fb Revert commits because I'm a dumbass` sandwiched between actual descriptions of work. It tells future-me nothing about _what_ was reverted or _why_. A message like `Revert auth refactoring (8b6b164..49ac744): broke verify-email flow and session handling` is less cathartic but actually useful when you're scanning the log trying to understand what happened. Self-deprecation in commit messages is another form of the laziness this guide is about: it feels like accountability, but it's skipping the work of writing something informative. Even solo devs deserve a readable log. Especially solo devs, because there's no one else to ask "hey, what was this commit about?"

The `--no-commit` flag is what makes this clean. Without it, git would create a separate revert commit for each bad commit (three "Revert ..." entries in the log). With it, everything gets staged together and you commit once.

**Note on the range:** `HEAD~5..HEAD` means "the last 5 commits." Adjust the number to match how many bad commits you have. If you're unsure, count them in `git log --oneline`.

### Strategy Comparison

|             | Reset (A)                     | Revert (B)                       |
| ----------- | ----------------------------- | -------------------------------- |
| History     | Clean, bad commits gone       | Full record preserved            |
| Remote push | Requires `--force-with-lease` | Normal push                      |
| Recovery    | Via reflog (~30 days)         | Original commits visible forever |
| Complexity  | 3 commands                    | 4 commands                       |
| Solo dev?   | The right call                | Also fine                        |
| Team?       | Dangerous                     | Safe                             |

**For a solo developer, Strategy A is usually the right call.** It's simpler and gives you a clean history. In my case, I'm the only one pulling from this repo, so there's no reason to preserve the record of five commits that did nothing but break things. Strategy B is there if you want the paper trail or if anyone else might have cloned your repo.

### Turborepo-Specific Cleanup

The git part is done. But in a monorepo, rolling back the code is only half the job. Your local environment still thinks it's living in the future: `node_modules` have packages that the restored commit doesn't expect, Turbo's cache has build artifacts from the bad commits, and your package manager's lockfile might be out of sync. If you skip this cleanup, you'll get mysterious build failures and wonder if the rollback even worked.

Your specific project will have its own cleanup needs depending on your stack. Think about what your bad commits touched: did they add dependencies? Change shared packages? Modify config files? Anything that leaves artifacts outside of git needs to be cleaned up manually. Here's what I had to do for mine:

```bash
# 1. Nuke node_modules across the entire monorepo
#    In a turborepo, each app/package has its own node_modules
#    Don't just clear the root — get all of them
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# 2. Reinstall from the lockfile at the restored commit
#    This project uses pnpm (common with turborepo)
pnpm install

# 3. Clear Turborepo's build cache
#    Stale cache = stale builds = mysterious "it still doesn't work" moments
rm -rf .turbo
turbo daemon clean
```

Now verify each app builds. In a monorepo, don't just build one app and assume the rest are fine. The bad commits touched auth components in the mobile app, but also documentation, `.env.example` files, and `.gitignore` rules across admin and mobile. Stale state in any of those apps could cause problems:

```bash
# Build everything
turbo build

# If you want to be thorough, check each app individually
turbo build --filter=mobile
turbo build --filter=web
turbo build --filter=admin
turbo build --filter=api
```

For the Expo mobile app specifically, Metro has its own bundler cache that lives outside of Turbo:

```bash
cd apps/mobile
npx expo start --clear
```

Beyond the build cache, think about what else your bad commits touched that lives outside of git's awareness. In my case, the reverted commits had added Clerk keys to `apps/admin/.env.example` and `apps/mobile/.env.example`, both of which got deleted in the rollback. So I had to double-check that my actual `.env` files still matched what the restored code expected.

If your bad commits modified shared packages in `packages/`, the source is reverted but any built output (like `dist/` folders) might still be stale. Nuke them: `rm -rf packages/*/dist` and rebuild. If they included database migrations, rolling back the code doesn't roll back the schema — that's a separate problem you'll need to handle manually. If they changed native dependencies in an Expo or React Native project, you may need `npx expo prebuild --clean` or a full rebuild of your development client. And if they touched CI/CD config (GitHub Actions, Vercel, etc.), verify the restored config still works on your next deployment.

The general principle: git only rolls back the source. Caches, build artifacts, databases, environment config, native builds — anything that exists outside of `.git` needs to be manually reconciled. The rollback command gets you 80% of the way there. The last 20% is on you, and it's the part that will bite you if you skip it.

## Part 2: Why I Had to Do Any of This

Here's the part where I talk about why this happened. I'm writing this for myself, but if any of it resonates, take what's useful.

### My Laziness Masked as Efficiency

Working directly on `main` felt faster to me. No branch to create, no PR to open, no merge to deal with. As a solo developer vibecoding the foundation of a new project, it felt especially justified. "I'm scaffolding. I'm moving fast. Everything is changing anyway. _Who am I branching for?_"

This reasoning sounded like efficiency to me, but looking back, it was laziness. The way I see the difference: efficiency is removing steps that don't add value. Laziness is skipping steps that do add value because the cost of skipping them feels abstract until it isn't.

Creating a branch takes five seconds:

```bash
git checkout -b feature/refactor-auth-screens
```

That's the entire overhead I was skipping. Five seconds of "ceremony" that would have meant the difference between `git checkout main` and the multi-step surgery described in Part 1.

### What Actually Happened

The scaffolding phase went fine. Integrating Clerk, wiring up tRPC, setting up NativeWind with a custom color palette, getting the Expo app to talk to the Hono API through Turso: all of that worked, committed to main, no issues. The habit got reinforced. "See? Branching would have been pointless overhead."

Then came the auth screen refactoring. Five commits that touched the sign-in flow, the sign-up flow, the email verification hook, the session finalization logic, and the navigation between all of them. Each commit message said things like "improve," "enhance," "streamline." Each one introduced subtle breakage I didn't catch because I was testing the happy path and moving to the next thing.

By the time I realized the `useVerifyEmail` hook's session finalization was broken and the email parameter handling in sign-in was tangled, I was five commits deep with no clean state to fall back to. The "last good state" was somewhere behind me in the log, and getting back to it meant reading a rollback guide and praying I didn't miss a step.

If I had run `git checkout -b feature/refactor-auth-screens` before that first commit, main would still be sitting clean at `b853068`, and "rolling back" would have been: `git checkout main`. Delete the branch if you want. Done.

### What Branching Actually Gives Me as a Solo Developer

I used to think branching was a team practice. It's not. Here's what it gives me, working alone on a turborepo with four apps:

**A stable reference point.** Main always works. The mobile app launches, the API responds, the web app renders, the admin panel loads. If my auth refactoring experiment breaks the verify-email flow, main doesn't care. Main is still clean.

**Cheap experimentation.** Branches are free. I could have tried three different approaches to the auth screen architecture: one with shared hooks, one with per-screen logic, one with a state machine. Keep the one that works, delete the rest. On main, every experiment is a commitment I might have to surgically remove.

**Cleaner recovery.** Compare the two recovery paths. Without branching: read a guide, identify the SHA, run reset or revert commands, force push, nuke `node_modules` across every app and package in the monorepo, clear the turbo cache, clear the Metro cache, rebuild all four apps, check my `.env` files. With branching: `git checkout main`. Done.

**Better commit history.** When I work on a branch and squash-merge, my main branch tells a clean story: "integrated Clerk auth," "wired up tRPC," "added NativeWind." When I work on main, the story becomes: "refactor auth screens," "enhance auth flow," "refactor useVerifyEmail," "update docs for the refactoring," then a revert commit that says "rolled all of that back because it was broken." One of these histories is useful. The other is a diary of my mistakes.

### The Trap I Fell Into

The trap isn't that I don't know this. I do. I've told other developers to branch. The trap is that the cost of not branching was invisible to me 99% of the time. I committed to main, it worked, I moved on. Twenty-two commits of scaffolding went fine on main. The habit got reinforced with every single one.

Then the 1% hit. I was five commits deep into an auth refactoring that broke session finalization across the Expo app, and I was reading a guide about `git reset --hard` and `--force-with-lease` and nuking `node_modules` from every directory in a monorepo, and I realized I had traded five seconds of branch creation for thirty minutes of cleanup and the low-grade anxiety of wondering if I actually got everything back to the right state.

That trade was never efficient. To me, it was just laziness that hadn't been invoiced yet.

### Five Commits of Not Noticing

This part deserves its own section because it's a separate failure from the branching problem. The auth screen refactoring didn't break on the first commit. It broke across five commits, and I didn't notice until all five were in.

That's worth sitting with. Five commits means I wrote code, committed it, looked at the result, thought "this is fine," and moved on. Five times. The breakage was there the entire time. I just wasn't looking at the right things.

Why? A few possibilities, and I'm being honest with myself about all of them:

**I was testing the happy path only.** I refactored the sign-in screen, tested sign-in, it worked, committed. Then the sign-up screen, tested sign-up, committed. But did I test the full flow end to end? Did I verify that the `useVerifyEmail` hook still finalized the session correctly after the changes in `c24cdd7`? Did I check that the email parameter handling in sign-in still worked after the navigation changes? No. I tested the thing I just changed, not the things adjacent to it.

**I was reading my own commit messages as progress.** "Enhance authentication flow." "Improve session finalization logic." "Streamline email parameter handling." Each commit message told a story of improvement. But I wrote those messages, and I was biased toward believing my changes were improvements. The commit messages were aspirational, not verified.

**My vibecoding feedback loop was too short.** When I'm iterating fast with AI-generated code, the cycle is: generate, glance, commit, next. The "glance" step is doing a lot of heavy lifting, and it's the weakest link. I'm pattern-matching on "does this look right?" instead of "does this actually work across all the flows it touches?"

**I had no checkpoint.** This connects back to the branching problem, but it's worth stating separately. If I had a working main to compare against, the breakage would have been obvious earlier. I could run the app from main, run it from my branch, and see the difference. Without that reference point, "working" was just "seems okay to me right now."

The takeaway for me: catching breakage five commits late isn't just a branching problem. It's a testing-and-verification problem. Branching gives me a safety net. But the reason I needed the safety net is that I wasn't checking my work thoroughly enough between commits. Both failures contributed. Fixing one without fixing the other just means the next incident will look slightly different.

What would have caught this earlier: after each commit, run through the full auth flow. Sign up, verify email, sign in, sign out, sign back in. Every time. Yes, it's tedious. It's less tedious than rolling back five commits.

But there's something deeper here that I think deserves serious attention, and it's the thing I'm most uncomfortable admitting: this is a **critical thinking failure**. Not a tooling failure, not a workflow failure. A thinking failure.

Every commit I made was a decision. "This code is good enough to commit." "I don't need to test the adjacent flows." "The commit message says 'improve' so it must be an improvement." "I don't need a branch for this." Five commits means five decisions where I chose not to stop and think critically about what I was doing. I deferred to momentum instead of judgment. I let the feeling of productivity substitute for the evidence of it.

Vibecoding made this worse in a specific way. When I write code myself, I have to think the implementation into existence. That thinking is a natural review moment — I'm reasoning through the logic as I type it, so I at least have a chance of noticing when something doesn't fit. When the AI generates the code, that step disappears. I go from "I need to refactor this hook" to "here's the refactored hook" without the intermediate step of actually reasoning through the implementation. The "glance" I mentioned earlier is doing even less work than I thought, because I'm not checking work I did — I'm checking work someone else did, at speed, with my guard down because it _looks_ right. The AI produces code that reads well. Readable code feels correct. But feeling correct and being correct are different things, and five commits of not noticing is what happens when I let one substitute for the other.

I think this matters beyond my repo. The way I make decisions in a codebase reflects how I make decisions generally. Every shortcut I take, every verification I skip, every assumption I don't question — those are habits of mind, not habits of git. A repo is just a place where the consequences of lazy thinking become visible and measurable. In other areas of life, the consequences are just as real but harder to trace back to the specific moment I stopped thinking critically.

The uncomfortable question I'm sitting with: if I can't be bothered to think critically about five commits in my own solo project, where the only person affected is me, what does that say about the rigor I bring to decisions with higher stakes? I don't have a clean answer for that yet. But I think the question is worth asking.

### Do AI Agents Even Work Better When You Branch?

This is a question I started asking myself after this whole mess, and it turns out the answer is unambiguously yes. Not just "better practice" yes, but "the tools are literally designed around it" yes.

GitHub Copilot's coding agent can _only_ push to branches prefixed with `copilot/`. It is physically prevented from pushing to main. That's not a suggestion or a best practice doc buried in a wiki. It's a hard constraint built into the product. GitHub looked at the problem of AI agents writing code and decided the first safety rail is: never let it touch main directly. If GitHub's own AI agent isn't trusted to commit to main, I have to ask myself why I thought _I_ should be trusted to do it while vibecoding at speed.

Claude Code has built-in git worktree support. You can spin up isolated worktrees where each agent session gets its own branch and working directory. The idea is that you can run multiple AI agents in parallel, each on its own branch, and they can't interfere with each other or with main. When the agent is done, you review the branch and merge what works. If it produced garbage, you delete the worktree and nothing is lost.

The pattern across the ecosystem is consistent: Cursor, Aider, Cline, Claude Code, Copilot — they all either enforce or strongly encourage branching. The emerging best practice is to treat each AI coding session as its own branch, commit small and often within that branch, and only merge to main after human review. Some teams even use naming conventions like `agent/feature-name` to make it obvious which branches were AI-assisted.

Here's what I find interesting about this: the AI tooling community arrived at "always branch, never commit to main directly" not because of some abstract git philosophy, but because they learned the hard way that AI-generated code _needs_ isolation. The output is variable. Running the same prompt twice can produce different results. The agent might refactor something you didn't ask it to touch. Without branch isolation, you're one bad generation away from exactly the situation I described in Part 1.

I don't have a definitive answer on whether branching makes the AI itself produce _better_ code. But I'm fairly convinced that branching makes the _workflow_ around AI-generated code dramatically safer and more manageable. The isolation means you can experiment freely, the branch boundary means main stays stable, and the merge step forces a review moment that the "generate, glance, commit, next" cycle on main completely skips.

If the companies building these tools decided that branching isn't optional for AI-assisted development, maybe it shouldn't be optional for me either. Something to sit with.

### The Fix

For me, the fix isn't discipline. It's making the right thing the default. Here's what I'm doing:

**Git aliases.** Making branching so easy I don't think about it:

```bash
git config --global alias.start '!f() { git checkout -b "$1" && echo "Working on $1"; }; f'
# Now: git start feature/refactor-auth-screens
```

**A pre-commit hook on main.** Making committing to main annoying on purpose:

```bash
#!/bin/sh
# .git/hooks/pre-commit
branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" = "main" ]; then
  echo ""
  echo "  ⚠ You're committing directly to main."
  echo "  Remember the auth screen rollback?"
  echo "  Use: git checkout -b feature/your-thing"
  echo ""
  echo "  (bypass with --no-verify if you really mean it)"
  exit 1
fi
```

**A personal rule.** Main is for merges only. Every change, no matter how small, gets a branch. No exceptions. The "it's just scaffolding" exception is exactly how this project ended up needing a rollback guide.

### The Honest Summary

I didn't need a rollback guide. I needed a five-second habit. The rollback guide exists because I optimized for the wrong thing: speed of committing instead of safety of my codebase. To me, that's laziness wearing efficiency's clothes. I'm not calling anyone else lazy for doing the same thing. But I know it was laziness for me, because I knew better and I still skipped it.

The goal isn't to feel bad about it. The goal is to make the five-second habit automatic so this guide collects dust.

_Written after rolling back five commits on my own project because I was too lazy to type `git checkout -b`. Learn from my experience if it speaks to you._

## Sources

### Git Documentation

- [git reset](https://git-scm.com/docs/git-reset) — Moving branch pointers and unstaging changes
- [git revert](https://git-scm.com/docs/git-revert) — Creating commits that undo previous commits
- [git reflog](https://git-scm.com/docs/git-reflog) — Viewing the reference log to recover "lost" commits
- [git cherry-pick](https://git-scm.com/docs/git-cherry-pick) — Applying specific commits from one branch to another
- [git worktree](https://git-scm.com/docs/git-worktree) — Managing multiple working trees for parallel development
- [git push --force-with-lease](https://git-scm.com/docs/git-push#Documentation/git-push.txt---force-with-leaseltrefnamegt) — Safer force pushing that checks for upstream changes

### AI Agents and Branching

- [Using Git Worktrees for Multi-Feature Development with AI Agents](https://www.nrmitchi.com/2025/10/using-git-worktrees-for-multi-feature-development-with-ai-agents/) — Nick Mitchinson on worktree-based workflows for AI coding
- [How we're shipping faster with Claude Code and Git Worktrees](https://incident.io/blog/shipping-faster-with-claude-code-and-git-worktrees) — incident.io's real-world workflow with parallel AI agents
- [Parallel Vibe Coding: Using Git Worktrees with Claude Code](https://www.dandoescode.com/blog/parallel-vibe-coding-with-git-worktrees) — Dan Does Code on parallel AI sessions
- [Claude Code: Common Workflows](https://code.claude.com/docs/en/common-workflows) — Official Claude Code docs on worktrees and branching
- [About GitHub Copilot Coding Agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent) — GitHub's docs on Copilot's `copilot/` branch prefix restriction
- [GitHub Copilot Coding Agent 101](https://github.blog/ai-and-ml/github-copilot/github-copilot-coding-agent-101-getting-started-with-agentic-workflows-on-github/) — Getting started with Copilot's agentic workflows
- [Responsible Use of GitHub Copilot Coding Agent](https://docs.github.com/en/copilot/responsible-use/copilot-coding-agent) — GitHub's safety guidelines including branch protection

### Vibecoding Best Practices

- [AI Coding Best Practices in 2025](https://dev.to/ranndy360/ai-coding-best-practices-in-2025-4eel) — DEV Community overview of commit hygiene with AI tools
- [Building With AI Coding Agents: Best Practices for Agent Workflows](https://medium.com/@elisheba.t.anderson/building-with-ai-coding-agents-best-practices-for-agent-workflows-be1d7095901b) — Elisheba Anderson on agent workflow patterns
- [My LLM Coding Workflow Going Into 2026](https://medium.com/@addyosmani/my-llm-coding-workflow-going-into-2026-52fe1681325e) — Addy Osmani on layering AI tools with git discipline
- [Vibe Coding with GitHub Copilot](https://docs.github.com/en/copilot/tutorials/vibe-coding) — GitHub's official vibecoding tutorial

### Turborepo

- [Turborepo Documentation](https://turbo.build/repo/docs) — Official Turborepo docs for monorepo management and caching
