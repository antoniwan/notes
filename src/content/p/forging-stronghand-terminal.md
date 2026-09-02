---
title: "Forging the 'Stronghand' Terminal: From Chaos to Command"
description: >-
  Guide to building a development terminal on Windows 11 using WezTerm,
  PowerShell 7, Oh-My-Posh, and Zoxide. Includes setup steps and configuration
  examples.
pubDate: '2025-04-28'
language:
  - en
category:
  - diy-creation
  - systems-strategy
  - learning-projects
tags:
  - systems-strategy
  - productivity
  - technology
  - tools
  - efficiency
  - workflow
  - learning-projects
  - software-development
  - customization
draft: false
featured: false
published: true
showComments: true
---

"Stronghand" is the name I gave my computer after the latest reformat. I destroyed **EVERYTHING** across all my drives — four disks totaling over 10TB — wiping them clean to zero.

Why? Because clutter carries inertia. Because old data is old gravity. Because sometimes the only way forward is to burn the ship.

After the reset, I divided my new PC empire into two main territories:

- **V: Vault** — Permanent archive. Memories, music, videos, source materials. Things to keep safe.
- **F: Forge** — Active workspace. Development, documentation, experimentation. Things to build and break.

Every project, every piece of work, either belongs to the Vault (long-term memory) or the Forge (current creation).

Clear. Brutal. Freeing.

![Screenshot of Hard Drive Space](/images/1_hZS3n1fhg_eDQTmqxg8O2w.png)

## FREEDOM!

There are moments when you realize your tools no longer match your mind. That's what happened when I looked at the stock Windows 11 terminal experience. Too noisy. Too slow. Too soft.

I needed a cockpit. A blade. A command center worthy of the mission ahead. So I forged one.

Today, I'm sharing the exact steps I took to build my personal development terminal on Windows 11 — using WezTerm. Whether you're a web developer, gamer, engineer, or just someone who wants your machine to actually obey you, this is a path you can follow.

## Phase 1: Kill the Noise — Install WezTerm

I replaced the default Windows Terminal with [WezTerm](https://wezfurlong.org/wezterm/) (Wez Furlong, 2024).

![Before](/images/1_JMkniJ9RmTng62SL37WSBA.png)
![After](/images/1_wjEXa_8z9DI8Wq4zMCBqig.png)

**Before WezTerm, after WezTerm**

Why? It's fast, lightweight, GPU-accelerated, and cross-platform.
In short: a weapon, not a toy.

- Installed WezTerm
- Created `wezterm.lua` manually at `%USERPROFILE%\AppData\Local\wezterm\wezterm.lua`
- Set default shell to PowerShell 7, not cmd.exe

You can find the configuration I used here: wezterm configs. In a nutshell, we are looking at something like this:

```lua
return {
  default_prog = { 'pwsh.exe', '-NoLogo' },
  font = wezterm.font("JetBrainsMono Nerd Font"),
  font_size = 12.5,
  color_scheme = "Catppuccin Mocha",
}
```

## Phase 2: Upgrade the Shell — PowerShell 7, Oh-My-Posh, and Zoxide

Stock PowerShell? Slow. Clunky. Old. I installed [PowerShell 7](https://learn.microsoft.com/en-us/powershell/) (Microsoft, 2023) via winget and tuned it with:

- [Oh-My-Posh](https://ohmyposh.dev/) for visual clarity
- [Zoxide](https://github.com/ajeetdsouza/zoxide) for teleportation-level folder navigation

**Important**: When initializing zoxide inside PowerShell 7, use:

```powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
```

(not 'pwsh' — zoxide expects 'powershell' as input.)

I also added these to my PowerShell `$PROFILE`:

```powershell
oh-my-posh init pwsh | Invoke-Expression
Invoke-Expression (& { (zoxide init powershell | Out-String) })
```

Plus a few battle-tested aliases like `gs` (git status), `gp` (git push), `serve` (launch local servers). See my full list of aliases here (not exhaustive, just some to get your creative juices flowing):

```powershell
## Custom Aliases
Set-Alias gs git status
Set-Alias gc git commit
Set-Alias gp git push
Set-Alias gl git pull
Set-Alias gco git checkout
Set-Alias gb git branch
Set-Alias serve npx serve

## Quick Directory Shortcuts (Optional)
Set-Alias dev "cd F:\Dev"
Set-Alias pers "cd F:\Dev\Personal"
Set-Alias work "cd F:\Dev\Work"
```

## Phase 3: Install the Right Dev Tools

- [nvm-windows](https://github.com/coreybutler/nvm-windows) to manage Node.js versions cleanly (Butler, 2024)
- fzf for fuzzy file finding
- Organized folders into `F:\Dev\Personal`, `F:\Dev\Work`, etc.

Simple structure = simple mind = powerful output.

![New Terminal](/images/1_UVQ9Lyp4yJ3dnpMbnSIOCQ.png)

**Absolute magic!**

## Why This Matters

Most developers (and creators in general) live in accidental friction. Every terminal glitch, every PATH pollution, every second lost accumulates.

By building a terminal intentionally:

- You speed up mentally and physically
- You enjoy the craft more
- You eliminate avoidable frustrations
- You create a cockpit for serious work, not casual dabbling

This wasn't about "fancy customization."
This was about forging a sharper interface with reality. This is about moving with **INTENTION!** And when your interface is sharp, your spirit sharpens too.

![I love my new terminal and how it renders things](/images/1_Fdmjbqh4eRaDwA12bYERgw.png)
**MAGIC!!!**

## Closing Words

Your machine reflects your mind.
Your terminal reflects your discipline.

Forge them both carefully and intentionally.

And when you're ready for more? There are even deeper rituals to unlock — tmux sessions, worktrees, containerized dev environments.

But first: master your cockpit.
Everything else follows.

(If this guide helped you, feel free to share your own terminal screenshots — I'd love to see what weapons you're building.)

## References

- Butler, C. (2024). [nvm-windows](https://github.com/coreybutler/nvm-windows). GitHub.
- Microsoft. (2023). [PowerShell](https://learn.microsoft.com/en-us/powershell/).
- Wez Furlong. (2024). [WezTerm Terminal Emulator](https://wezfurlong.org/wezterm/).
- De Dobbeleer, J. (2024). [Oh My Posh](https://ohmyposh.dev/).
- D'Souza, A. (2024). [zoxide](https://github.com/ajeetdsouza/zoxide). GitHub.
