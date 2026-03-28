# How to Use These Files with Claude Code

## Put these files in your repo

Place:
- `CLAUDE.md` at the repo root
- `docs/personal-style-agent.md` inside the docs folder

You should also keep:
- `docs/how-to-run.md`
- `docs/how-to-edit-content.md`
- `docs/deploy-vps-traefik.md`
- `docs/style-notes.md`

## What the roles are

### `CLAUDE.md`
This is the main project contract.
It tells Claude Code:
- what to build
- what not to build
- how to behave while working
- what docs must exist
- how the site should stay maintainable
- how to use Git as part of normal work

### `docs/personal-style-agent.md`
This is the style guardrail.
It keeps the visual and writing taste consistent.
It helps prevent the project from turning into a generic modern website.
It also explains how future examples should update the style system.

### `docs/style-notes.md`
This is the style change log.
When you later show Claude Code a new example you like, it should update this file with:
- the date
- the reference
- what it liked about it
- what rules changed
- what stayed the same

## Recommended working method

### Before major work
Ask Claude Code to:
- read `CLAUDE.md`
- read `docs/personal-style-agent.md`
- explain the plan in plain English
- recommend a Git branch name if the change is meaningful

### During work
Ask it to:
- keep content easy to edit
- update docs if the editing process changes
- keep the look personal rather than modern-app-like

### After work
Ask it to provide:
- a summary of what changed
- a suggested commit message
- a note about any new docs or style guidance updates

## Good first prompt to Claude Code

Use something like this in your repo:

```text
Read and follow both `CLAUDE.md` and `docs/personal-style-agent.md`.

Build the first version of the website using Astro.
Use content collections for books, plants, travel, and blog-style entries.
Create a clean beginner-friendly content model.
Create sample content.
Add the required docs:
- README.md
- docs/how-to-run.md
- docs/how-to-edit-content.md
- docs/deploy-vps-traefik.md
- docs/style-notes.md

Use Git as part of the workflow.
Before major structural work, explain the plan in plain English and recommend a branch name.
After meaningful work, suggest a commit message.
```

## Good follow-up prompts

### Add a new section
```text
Read and follow `CLAUDE.md` and `docs/personal-style-agent.md`.
Add a new music favourites section.
Keep it easy to edit via content files.
Update the editing docs for the new section.
Recommend a branch name and suggest a commit message at the end.
```

### Improve the design without losing the vibe
```text
Read and follow `CLAUDE.md` and `docs/personal-style-agent.md`.
Improve the homepage layout and polish spacing, but do not modernise the look into SaaS styling.
Explain the files you plan to change first.
Recommend a branch name before editing and a commit message after.
```

### Add a new inspiration example later
```text
Read and follow `CLAUDE.md` and `docs/personal-style-agent.md`.
I like this new reference and want parts of its feeling in the site.
Extract the transferable style principles without copying it.
Update `docs/personal-style-agent.md` and `docs/style-notes.md`.
Explain what changes and what stays the same.
Recommend a branch name and give me a commit message.
```

### Make deployment clearer
```text
Read and follow `CLAUDE.md` and `docs/personal-style-agent.md`.
Prepare this site for Docker deployment behind Traefik on a VPS.
Update `docs/deploy-vps-traefik.md` with exact instructions.
Recommend a branch name before editing and a commit message after.
```

## Practical workflow

1. Initialise Git if the repo is not already using it.
2. Ask Claude Code to scaffold the site.
3. Review the file structure.
4. Ask it to explain how content is edited.
5. Add your real content slowly.
6. Ask it to containerise the project.
7. Ask it to add Traefik-ready deployment docs.
8. Keep using the same instruction files so the style stays stable.
9. When you discover a new style reference you love, ask it to update the style agent and the style log.

## Important habit

Any time you ask Claude Code to make a meaningful change, remind it to:
- follow `CLAUDE.md`
- follow `docs/personal-style-agent.md`
- update the docs if the editing process changes
- recommend a branch name when the change is substantial
- suggest a commit message when the work is done

That stops the project from drifting and keeps the version history useful.
