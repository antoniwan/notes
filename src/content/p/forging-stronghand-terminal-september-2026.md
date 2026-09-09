---
title: "Forging the 'Stronghand' Terminal — September 2026 Update"
description: >-
  Sixteen months after building an elaborate Windows terminal, almost none of it
  is left. What sixteen months of actual usage revealed about this machine, and
  the small setup that survived.
pubDate: '2026-09-08T12:00:00.000Z'
language:
  - en
heroImage: /images/2026/forging-stronghand-terminal-september-2026.avif
imageAlt: >-
  A dark brick workshop: a plain steel sword rests on a worn anvil, an unused
  ornate blade glows green against the wall, and a CRT monitor shows a single
  green cursor
category:
  - diy-creation
  - systems-strategy
  - learning-projects
  - metaspace
tags:
  - technology
  - tools
  - software-development
  - ai-agents
draft: false
featured: true
published: true
showComments: true
---

In April 2025 I wrote about [forging a terminal](/p/forging-stronghand-terminal/) on this machine. WezTerm as the emulator, Oh-My-Posh for the prompt, zoxide for jumping around, nvm and fzf, a `$PROFILE` full of git aliases, and two drives renamed Vault and Forge so the file system would mean something. I called it a cockpit. I meant it, and what follows is not a takedown of that post.

Here is the current state of that stack on the same box, sixteen months later:

| 2025                    | Now                                                  |
| ----------------------- | ---------------------------------------------------- |
| WezTerm                 | Gone. Windows Terminal.                              |
| Oh-My-Posh              | Gone. No prompt theme.                               |
| zoxide                  | Gone.                                                |
| nvm-windows             | Gone.                                                |
| fzf                     | Gone.                                                |
| `$PROFILE` with aliases | Gone. There is no profile file at all.               |
| `V:` Vault / `F:` Forge | Gone. `C:` `D:` `F:` `Z:`, named for what they hold. |
| WSL                     | Removed.                                             |

Not one piece of it survived, and I went looking, because I did not entirely believe it myself: no `wezterm.lua`, no `.omp.json`, no zoxide database, nothing under `AppData` carrying any of those names.

The easy version of this essay is a conversion story, the fool gets wise, the maximalist becomes a minimalist, and that version would be dishonest. Nothing failed. WezTerm never burned me and zoxide is still a good tool. What actually happened is duller and more useful than a conversion: I built that setup before I had any usage data, out of a general and slightly romantic idea of the kind of developer I wanted to be at this desk, and then I sat at the desk for sixteen months and the real usage surfaced, and the setup shrank to fit it. Ritual first, evidence later. I had it backwards, and I am not sure I could have gotten it right in the other order.

## What this machine actually turned out to be

The 2025 setup was built for a man who lives inside this terminal all day. That man exists. He just works on the Mac.

What sixteen months of usage says about the Windows box, if you read the disk instead of the intention:

- **Games.** `AppData\Local` is a wall of save folders. Whatever I told myself in 2025, that is the main use.
- **FORGE.** 1,359 live markdown notes in Obsidian, on `C:`, which is where my thinking lives. Live means not counting the archive or the dailies; with those it is 2,205.
- **Cursor**, when I happen to be sitting here rather than at the Mac.
- **A shell**, opened to run `pnpm` and `git`, and then closed.

That last line is the whole thing. I built a cockpit for a pilot who turns out to open the shell a few times a day, run two or three commands he already knows by heart, and close it. Oh-My-Posh renders a beautiful prompt for a man who is not looking at the prompt. zoxide learns the folders of someone who navigates from an editor. Aliases save keystrokes for a person whose bottleneck was never keystrokes.

So it came out, one piece at a time, over months, each time I noticed I was maintaining something I was not using. No principle involved.

## The setup that's actually here

This is the honest inventory as of the last full audit, which lives in a `PC-SETUP` folder on this machine rather than in my head.

**One terminal app, one shell inside it.** Windows Terminal, and the only visible profile is PowerShell 7. Command Prompt, Windows PowerShell 5.1, and Azure Cloud Shell are still installed because Windows installs them, but they're hidden in the profile list so the new-tab menu offers exactly one thing. Cursor's integrated panel points at the same `pwsh.exe`, so the shell inside the editor and the shell inside Windows Terminal are the same shell.

The entire `settings.json`, minus the profile GUIDs:

```json
{
  "defaultProfile": "{5fb123f1-...}",
  "keybindings": [
    { "id": "Terminal.CopyToClipboard", "keys": "ctrl+c" },
    { "id": "Terminal.PasteFromClipboard", "keys": "ctrl+v" },
    { "id": "Terminal.FindText", "keys": "ctrl+shift+f" },
    { "id": "Terminal.DuplicatePaneAuto", "keys": "alt+shift+d" }
  ],
  "profiles": { "defaults": {}, "list": [/* one visible: PowerShell 7 */] },
  "schemes": [],
  "themes": []
}
```

Four keybindings, and three of them exist only to make copy, paste, and find behave the way they behave in every other window on this computer. `schemes` and `themes` are empty arrays. There is no `$PROFILE` script. PowerShell 7.6.5 starts, prints its banner, and gives me a prompt.

**Drives labeled for what they hold**, which is less poetic than Vault and Forge and easier to answer questions about at 11pm:

| Letter | Label     | What lives there                        |
| ------ | --------- | --------------------------------------- |
| `C:`   | SYSTEM    | Windows, user folder, FORGE notes, code |
| `D:`   | MEDIA     | Video, music, pictures                  |
| `F:`   | GAMES-HDD | Steam and games, spinning disk          |
| `Z:`   | GAMES-SSD | Steam and games, fast disk              |

**The `[core]` block of my git config**, three settings, all three earning their place:

```ini
[core]
  autocrlf = input
  longpaths = true
  excludesfile = C:/Users/zombi/.gitignore_global
```

That last one is the good one. A user-global ignore file listing `.npmrc`, `.env`, `*.pem`, key files, `recovery-codes.txt` and friends, so secrets stay on disk where I need them and git never sees them, on any repo, without me remembering to do anything.

**What is deliberately not installed**, which took me longer to accept than the removals:

- **Docker.** Installing it would pull WSL back onto this machine. Compose and Linux work happen on the Mac. There is a whole document in `PC-SETUP` whose only job is to talk me out of this when I get the urge again.
- **A prompt theme.** I have not missed it once.
- **A version manager.** One Node, one Python (3.13.7), `uv` for Python tooling. When I need multiple versions I am doing something that belongs on the other machine.

## The cockpit moved up a layer

I did not see this part coming, and it is the reason none of the above feels like loss.

The customization energy did not disappear. It relocated. In 2025 the intelligence I was adding to this machine lived in the shell configuration: the prompt, the aliases, the jump list. In 2026 it lives one layer up, in the agent tooling, and the shell went dumb on purpose because it stopped being where the thinking happens.

Concretely: there's a private repo, `my-agentic-skills`, that is the canonical source for 27 agent skills, each one a folder with a `SKILL.md`. That repo is the source of truth, and the rule I wrote for myself is to symlink from it into each tool's global skills directory rather than copy, so that the definition I edit is the definition all of them read. Claude, Codex, and Cursor each keep their own skills folder, and keeping those honest against the canonical repo is ongoing work, not a solved problem. FORGE has an `AGENTS.md` that any agent working in the vault reads first.

Skills get ranked (I use One Punch Man association ranks, S through C, because I find it funny and because it forces me to say out loud which ones are load-bearing) and reviewed against actual session history rather than against how clever they seemed when I wrote them, which is the same lesson as the terminal, learned again in a different room.

And there's `PC-SETUP` itself, a folder of plain markdown in my home directory: a README, a current-state file, a running log, an audit, and a handful of guides for the specific things this machine gets wrong. It documents what is true right now and what we already tried, which is a different job than documenting an ideal.

When OneDrive followed some symlinks and ate about fifteen thousand game save files in August, the log is why I know exactly what happened and why it will not happen again the same way.

**My 2025 config was a prophecy, and my 2026 config is a record.** One described a person I imagined sitting here. The other describes the person who does.

## What I'd tell the guy who wrote the first post

Not much, honestly. He had to build the thing to find out.

But if he'd take one note from me it would be this: watch how the writing behaves, because the prose in that post was doing exactly what the config was doing. "Clear. Brutal. Freeing." "A weapon, not a toy." Those are good lines and I don't disown them, but they are certainty in formal dress, and the certainty wasn't there yet. I'd had the setup for a few days. The blade sentences and the elaborate `wezterm.lua` came from the same place, which was wanting the thing to already be true.

The setup that's here now is boring to describe and that is a feature. One terminal, one shell, no theme, no profile script, honest disk labels, a global ignore file, a folder of notes that tells me what we already learned. Everything in it earned its place by being reached for repeatedly, or by hurting when it was missing.

Sixteen months of usage told me who sits at this desk. I just had to stop describing him first and let him show up.

---

_The `PC-SETUP` folder stays a private local thing, but the pattern is free: keep a plain-text record of what your machine actually is, append to it every time you change something, and re-read it before you install anything clever._
