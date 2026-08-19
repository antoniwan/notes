---
name: version-bump-changelog
description: Updates CHANGELOG.md whenever package.json version is bumped. Diffs since the previous version, aggregates user-facing notes, and prepends a Keep a Changelog section. Use when bumping versions, cutting releases, or when the user asks for release notes / changelog.
---

# Version bump → changelog

## Goal

Every `package.json` version bump gets a matching `CHANGELOG.md` entry written from the git diff since the previous version.

## When to use

- User asks to bump the version / cut a release
- `package.json` `"version"` is changing in this session
- User asks for release notes or changelog updates

## Workflow

1. Confirm the **new** SemVer in `package.json` (or propose major/minor/patch from the change set).
2. Run the collector (do not invent commits):

   ```bash
   pnpm changelog:since
   # or, if the new version is already in package.json and you need an explicit prior:
   pnpm changelog:since --from <previous-version>
   pnpm changelog:since --json
   ```

3. Read the commit list + file groups. Aggregate into **reader-facing** bullets:
   - Prefer outcomes over file lists
   - Group under `Added` / `Changed` / `Fixed` / `Removed` / `Security` as needed
   - Skip noise unless meaningful (lockfile-only, generated fingerprints, formatting-only)
   - Technical changelog only: do **not** list published notes, translations, or copy edits in `src/content/`
4. Prepend a section to `CHANGELOG.md` **above** the previous release:

   ```markdown
   ## [X.Y.Z] — YYYY-MM-DD

   ### Added

   - …

   ### Changed

   - …
   ```

   Use today's date (user/local) unless the user specifies otherwise.

5. Keep README version badges in sync only if the repo already mirrors version there.
6. Do **not** commit unless the user asks.

## Rules

- Changelog entry version **must** match `package.json` `"version"`.
- Never delete older changelog sections.
- If `pnpm changelog:since` cannot find the previous version, ask for `--from` or the last known release.
- Prose style: direct, short bullets; same voice as existing `CHANGELOG.md` entries.

## Output

Report:

1. New version
2. Previous version / range used
3. Bullets written into `CHANGELOG.md`
