# Implementation Journal

## Phase 1 — Stabilise and remove drag

### Intent
Phase 1 removed a few high-impact sources of drag without changing the site's personality: slower font delivery, missing keyboard skip navigation, heading hierarchy skips, a dead cursor asset, and style documentation that no longer matched the live implementation.

### Work completed
- Moved Google Fonts loading out of `src/styles/global.css` and into the document head in `src/layouts/BaseLayout.astro` with `preconnect` links and a reduced font variant set
- Added a keyboard-accessible skip link at the top of the layout body and global styling for its hidden and focused states
- Repaired `h1` to `h2` hierarchy across the homepage, About page, travel and recipe indexes, and the book detail page panels
- Removed the unused `public/cursors/sprig.svg` asset
- Updated `docs/style-notes.md` to reflect the current dark base, warm-gold sparkle treatment, and the accepted cursor direction

### Validation
- Ran `npm run build` before changes to confirm the baseline build was green
- Ran `npm run build` after each major implementation slice and again during final acceptance
- Checked generated HTML in `dist/` for the font stylesheet link and the skip link
- Confirmed the old `section-title` and `panel-title` `h3` patterns were gone from the updated source
- Confirmed `public/cursors/sprig.svg` was removed

### Git
- Branch: `fix/phase1-stabilise`
- Key commits:
  - `7907155` `fix: move font loading into layout head`
  - `645fc9c` `fix: repair heading hierarchy across pages`
  - `7079272` `chore: remove sprig asset and sync style notes`
- Merge result: merged into `main` with `merge: complete phase 1 stabilise`

### Notes
- `npx astro check` is not yet available in the repo because `@astrojs/check` is not installed; that stays aligned with the roadmap and will be addressed in a later phase
- The working tree still contains unrelated pre-existing local edits in `.claude/settings.local.json` and `.gitignore`; they were left untouched
