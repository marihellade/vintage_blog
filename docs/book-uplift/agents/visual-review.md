# Agent: Visual Review

**Phase:** 4 (final gate — sequential, runs after all other phases)
**Scope:** Full `/books` page visual audit and polish
**Depends on:** All Phase 2 and Phase 3 work merged

## Context

This is the final quality gate. All structural and visual changes have been made by previous agents. This agent's job is to run the full visual review workflow, inspect screenshots, score the result, and fix any issues.

## Task

### 1. Build and capture screenshots

```bash
npm run ui:review -- --update-snapshots
```

This will:
- Build the site
- Start a preview server on port 4174
- Run all Playwright specs (desktop, mobile, reviewed section, filters)
- Generate screenshot baselines
- Stop the server

### 2. Inspect all screenshots

Open and visually inspect every generated screenshot. Check for:

- Layout breakage (overlapping elements, overflow, misaligned grids)
- Visual regression (anything that looks worse than intended)
- Missing elements (dividers not rendering, header frame not visible, etc.)
- Typography issues (text too small, clipped, wrong colour)
- Cover display (correct size, correct aspect ratio, placeholder gradients working)
- Filter controls (correct styling, active states visible)
- Mobile layout (clean stacking, no horizontal overflow, readable text)

### 3. Score against the UI review playbook rubric

Use the rubric from `docs/ai/ui-review-playbook.md`. Score each area 1-5:

- **Readability:** clear hierarchy, comfortable line lengths, legible text, easy to scan headings/metadata
- **Layout:** no dead space, no cramped controls, consistent alignment, stable grid rhythm
- **Aesthetic fit:** matches style notes (literary, editorial, apothecary tone), no generic SaaS controls
- **Interaction quality:** hover/focus states feel deliberate, filters read clearly, no misleading click targets
- **Performance/stability:** no jank, no loading flashes, no layout shift

**Minimum passing score:** 3.5 average across all areas. If any single area scores below 3, that area must be fixed before passing.

### 4. Fix issues (up to 3 iterations)

If issues are found:
1. Make the fix
2. Rebuild and re-capture screenshots
3. Re-inspect
4. Repeat up to 3 times

If after 3 iterations issues remain unresolved, document them in the commit message and move on.

### 5. Additional style checks

Verify these specific design requirements from the council audit:

- [ ] Page header has a visible decorative frame
- [ ] Reviewed covers are ~130×195px on desktop (verify visually — they should be clearly larger than before)
- [ ] Cards use vertical layout (cover top, text below)
- [ ] Mood descriptor appears on reviewed cards
- [ ] Section dividers are visible between major sections
- [ ] Filter controls look editorial, not SaaS-like (no rounded pills, warm accents)
- [ ] Card tags have a hover state (pointer cursor, colour change)
- [ ] Roman numeral pagination is preserved
- [ ] Page flip animation works (test by clicking next/prev)
- [ ] Mobile layout is clean and structurally obvious
- [ ] "Browse by Mood" dead section is gone

### 6. Final commit

After all checks pass:

```
git add -A
git commit -m "style: final visual review pass for book diary collector's cabinet redesign"
```

## What NOT to do

- Do not make large structural changes — only visual fixes and polish
- Do not change interaction logic
- Do not add new features
- Do not change unrelated pages (even if other page screenshots exist)

## Acceptance criteria

- [ ] All Playwright specs pass
- [ ] All rubric areas score 3.5+
- [ ] All design requirements from the checklist above are verified
- [ ] Screenshots are committed as baselines
- [ ] No processes left running after review
