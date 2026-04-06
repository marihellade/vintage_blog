# Book Diary Editorial Shelf Plan

## 1. Current-state diagnosis

### What currently works
- The page already belongs to the site: candlelit palette, serif typography, dotted dividers, and the sidebars all feel coherent with the wider apothecary-literary world.
- The reviewed shelf already uses progressive enhancement well: the first page is server-rendered, then client-side sorting and pagination take over without breaking no-JS browsing.
- The reviewed cards already avoid giant full-bleed posters. The small cover plus text treatment is a useful starting point for an editorial catalogue rather than a gallery.
- The current year and sort controls are understandable and keyboard-usable.

### What must change
- The reviewed shelf still reads as a generic utility grid once the controls and pagination appear. The bottom pager especially feels bolted on rather than composed.
- The controls all compete at the same visual weight, which makes the top of the section noisier than the books themselves.
- The reviewed cards need stronger hierarchy. Title, author, rating, mood, and tags all work, but they do not yet feel intentionally staged like catalogue notes around an artefact.
- The current grid density does not fully cash in on the available main-column space. The brief asks for a truer shelf rhythm that can show about six books on desktop where practical.

### What must be preserved
- The darker candlelit base, botanical/apothecary atmosphere, and handmade indie-web mood.
- The left rail and the sense that the page lives inside a wider personal “site world,” not a flat app canvas.
- The existing content model in `src/content/books/`. The owner should keep editing Markdown entries exactly as before.
- Lightweight motion, keyboard usability, and the server-rendered first pass for the reviewed shelf.

## 2. Council synthesis

### Round 1 signals

#### Style Guardian
- Working: the palette, type pairing, and card surfaces already feel native to the site.
- Hurting: the controls and bottom pagination flatten the page into utility UI.
- Recommendations: keep ornament restrained, make navigation feel like shelf furniture, and avoid bright or pill-heavy control styling.
- Risks: drifting into SaaS filtering language; over-cleaning the shelf until it loses its homemade soul.

#### Editorial Art Director
- Working: the covers already have presence and the card surfaces have warmth.
- Hurting: the composition stops at “small image plus metadata,” rather than becoming a literary object with annotation.
- Recommendations: make each reviewed card feel like a figurative book beside catalogue notes, use quieter tags, and introduce a stronger folio/frame treatment around the reviewed shelf.
- Risks: turning the grid into cramped mini-thumbnails; adding too much ornament and muddying scan order.

#### Information Hierarchy Editor
- Working: the key ingredients are already present.
- Hurting: title, author, rating, mood, and tags are too close in importance.
- Recommendations: enlarge and tighten the title, keep the author soft but clear, let rating/status scan in one glance, and push tags into a tertiary footer role.
- Risks: shrinking the type too far to fit more cards; letting mood text become a squeezed afterthought.

#### Interaction Designer
- Working: the current enhancement script is simple and dependable.
- Hurting: the bottom pager feels like default widgetry rather than part of the shelf; secondary filters are too exposed.
- Recommendations: move pagination into subtle side rails, show Roman numeral page state, and hide mood filters behind a plus-style reveal that still feels discoverable.
- Risks: making the navigation too subtle to find; making the reveal behave like a generic app accordion.

#### Frontend Systems Engineer
- Working: the reviewed shelf is self-contained in one page and can be refactored without repo-wide churn.
- Hurting: the page uses one broad card/grid style, so the reviewed shelf needs a more specific treatment rather than global changes that ripple everywhere.
- Recommendations: keep the new structure in `src/pages/books/index.astro`, preserve progressive enhancement, and extend the existing render script instead of replacing it.
- Risks: brittle markup duplication between the server-rendered cards and JS-rendered cards; hidden layout regressions at smaller breakpoints.

#### Performance and Accessibility Reviewer
- Working: the current interactions use lightweight DOM swaps and reduced-motion handling.
- Hurting: the control region can be hard to parse quickly, and the future side navigation needs stronger semantics than “pretty arrows.”
- Recommendations: keep buttons as real buttons, announce state through labels and page text, preserve reduced-motion behavior, and avoid expensive animation changes.
- Risks: turning the side navigation into decorative controls with weak focus states; creating layout jumpiness when filters reveal.

### Agreed direction
- Build the reviewed shelf as a framed editorial folio inside the existing page world, not as a new visual system.
- Keep the card treatment tactile and handmade, but sharpen hierarchy so the title leads, the author follows, the rating/status reads instantly, the mood line feels chosen, and the tags quietly sit at the bottom.
- Replace the bottom pager with side-mounted “shelf end” controls that stay visible, include Roman numeral page state, and reuse the existing restrained page-flip animation.
- Keep year and sort visible; move mood/tag filtering into a subtle plus-style reveal that feels like opening extra catalogue notes rather than launching a settings panel.
- Use the available main-column width more intelligently so the reviewed shelf can settle into a denser three-column rhythm on desktop where space allows.

## 3. Implementation contract

### Card proportions
- Keep reviewed cards horizontal, but rebalance them into a more deliberate two-part object: a slightly smaller cover block and a roomier annotation block.
- Reduce cover dominance by targeting a roughly 15–25% visual reduction through cover size, card padding, and text distribution rather than distortion.

### Cover sizing
- Reviewed covers will shrink from the current 80x120 treatment to a slimmer catalogue scale while keeping the same aspect ratio.
- Cover placeholders will match the new reviewed-cover size exactly.

### Information hierarchy
- Titles become larger, tighter, and more authoritative.
- Authors stay legible but visually softer.
- Rating and finish context sit together in a compact line that scans quickly.
- Mood becomes a short editorial note with more breathing room.
- Tags become smaller, lower-contrast, and visually secondary.

### Pagination redesign
- Remove the bottom page-number row.
- Add always-visible previous/next shelf controls mounted on the sides of the reviewed shelf frame.
- Keep the controls as actual buttons with disabled states and `aria-controls` pointing at the reviewed grid.

### Roman numeral page count
- Add a page-state indicator using Roman numerals, formatted like `I / III`.
- Update the indicator during client-side pagination changes and keep it present in the server-rendered first view.

### Filter reveal approach
- Keep Year and Sort visible in the main control bar.
- Move Mood filtering into a plus-style reveal area using accessible disclosure markup.
- Keep “All moods” inside the revealed region so the top row stays lighter.

### Layout width and grid behaviour
- Give the reviewed shelf its own denser grid rules instead of changing every book grid on the page.
- Aim for three reviewed cards per row on wider desktop widths, which supports about six visible books across two rows where viewport height allows.
- Preserve the sidebars and page shell; use local layout tuning inside the reviewed section rather than flattening the whole page.

### Responsiveness
- Collapse the side-mounted shelf controls into a cleaner stacked layout on narrower widths without losing the page indicator.
- Let the reviewed cards breathe back out on tablet/mobile so text does not feel cramped.
- Keep touch targets comfortable and the filter reveal easy to operate.

### Accessibility and performance constraints
- Preserve the current reduced-motion branch for the shelf animation.
- Keep no-JS browsing intact with a meaningful first reviewed page rendered on the server.
- Maintain visible focus states on filter controls and the new side navigation.
- Avoid large animation rewrites or heavy DOM work beyond the current card-swap pattern.

## 4. Risk register

| Risk | Mitigation |
| --- | --- |
| Losing the handmade tone and sliding into polished app UI | Reuse the site’s existing palette, serif language, borders, and atmospheric surfaces; keep new controls ornamental but readable |
| Making the layout feel like ecommerce | Avoid product-grid tropes, keep covers modest, and stage text like annotations rather than sales metadata |
| Making the controls too subtle to discover | Keep side nav always visible, include labels and Roman page state, and preserve clear hover/focus/disabled states |
| Shrinking covers too far | Target only a moderate reduction and keep strong card rhythm so books still feel treasured |
| Tags and filters crowding the shelf again | Reduce tag emphasis, move mood filtering behind a reveal, and keep the control bar split into primary and secondary actions |
| Breaking responsiveness while chasing denser desktop layout | Scope denser sizing to reviewed cards only and add explicit tablet/mobile breakpoints |
| Introducing brittle duplicated markup | Keep server-rendered and client-rendered card structures aligned and update both together during the refactor |
| Motion becoming noisy or janky | Reuse the existing flip timing, keep transforms light, and retain reduced-motion fallbacks |

## 5. Acceptance checklist

- [ ] The reviewed shelf still feels unmistakably part of Marihella’s site
- [ ] Reviewed cards read as editorial catalogue objects rather than default cards
- [ ] Covers remain lovely but no longer dominate the composition
- [ ] Desktop reviewed density supports roughly six visible books where practical
- [ ] Title, author, rating, mood, and tags have clearer hierarchy
- [ ] Bottom pagination is gone
- [ ] Side-mounted previous/next controls feel integrated and tasteful
- [ ] Roman numeral page count is present and updates correctly
- [ ] Primary filters remain visible and secondary filters live behind a plus-style reveal
- [ ] The left rail and wider page world still matter visually
- [ ] Mobile and tablet layouts remain comfortable
- [ ] Keyboard and focus behavior remain clear
- [ ] Reduced-motion handling still works
- [ ] The redesign feels more composed, not more generic
