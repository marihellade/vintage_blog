# CLAUDE.md

## Purpose

Build and maintain a personal **indie-web style** website for **Marihella** that feels hand-made, warm, scrapbook-like, and unmistakably human.

The site must look like a lovingly maintained mid-2000s personal internet home while still behaving well in modern browsers.

This project is for a **novice maintainer**. The person editing this site may not know much code. Every technical choice must therefore support:

- easy local running
- easy content updates
- easy deployment to a VPS behind Traefik
- easy future edits by an agent without aesthetic drift
- safe, visible progress through Git version control

---

## How to behave as the coding agent

You are not just building pages. You are also building a website that a non-technical owner can actually live with.

When working on this project, always do the following:

1. **Explain before changing major things**
   - Before making substantial structural changes, explain in plain English:
     - what you plan to change
     - why
     - which files will be added or edited
     - how the owner will edit the result later

2. **Teach while building**
   - Assume the owner is a novice.
   - Give clear, copy-paste-ready commands.
   - Avoid unexplained jargon.
   - When introducing a concept such as layout, collection, component, route, frontmatter, or deployment, explain it simply.

3. **Leave clear maintenance trails**
   - If you add a feature, update the documentation that explains:
     - how to run the site
     - how to edit the content
     - how to deploy it
     - how the feature fits into the project structure
   - Do not leave hidden logic or “magic” steps undocumented.

4. **Preserve style consistency**
   - Follow `docs/personal-style-agent.md` for all aesthetic and tone decisions.
   - Do not drift into generic modern product design.

5. **Prefer simple systems**
   - Prefer static-first approaches.
   - Prefer content files over databases.
   - Prefer small, understandable abstractions over clever architecture.

6. **Use Git as a normal part of the work**
   - Treat Git version control as mandatory, not optional.
   - Before significant work, check the working tree state.
   - After meaningful units of work, create a sensible commit.
   - Use small, descriptive commit messages.
   - Do not bundle unrelated changes into one commit unless explicitly told to.
   - If Git is not initialised, explain how to initialise it and recommend doing so before major changes.

---

## Version control rules

Git must be part of the normal workflow for this project.

### Required Git behaviour

- Prefer working in a dedicated feature branch for meaningful changes.
- Before large edits, tell the owner what branch strategy you recommend.
- After completing a meaningful change, provide:
  - a suggested commit message
  - a brief summary of what changed
  - any files the owner should pay attention to
- If the change is large or risky, recommend a branch name.
- Do not assume GitHub is required. Local Git is enough for now.

### Default branch guidance

When appropriate, suggest branch names such as:
- `feature/homepage-refresh`
- `feature/book-diary`
- `feature/deploy-docker-traefik`
- `docs/editing-guide`
- `style/palette-update`

### Commit message style

Prefer concise commit messages such as:
- `feat: add book diary content collection`
- `style: refine scrapbook homepage layout`
- `docs: add beginner content editing guide`
- `deploy: add Docker and Traefik example`

### Git help for a novice

Whenever version control is relevant, explain in plain English:
- what branch the owner should be on
- whether changes are committed yet
- the exact commands to run if asked

---

## Personal style evolution rules

This project must be able to evolve its style over time without losing coherence.

### When the owner shares a new example they like

The owner may later provide:
- screenshots
- URLs
- colour palettes
- snippets of writing
- references to another website, blog, poster, scrapbook, or graphic style
- notes such as “I like this header treatment” or “I want more of this feeling”

When that happens, do the following:

1. identify what specifically is attractive about the example
   - layout
   - colour
   - typography
   - spacing
   - decorations
   - tone of writing
   - texture
   - navigation style
   - widget style

2. separate the **transferable style principles** from the exact copied surface details
   - do not simply clone another site
   - extract the feeling and reusable design logic

3. update the style guidance files
   - update `docs/personal-style-agent.md`
   - if useful, also update `docs/style-notes.md`
   - add a dated note describing what changed and why

4. preserve continuity
   - new influences should refine the visual language, not randomly replace it
   - avoid abrupt jumps from one aesthetic world to a totally different one unless explicitly requested

5. explain the effect of the update
   - what the new example changes
   - what stays the same
   - how future pages should reflect it

### Style update log

Maintain a lightweight running log in:
- `docs/style-notes.md`

This file should record:
- date
- new reference or inspiration
- what was extracted from it
- what rules changed
- what rules stayed the same

If the file does not exist yet, create it.

---

## Primary build goals

Create a complete personal website with the feeling of a real internet corner belonging to Marihella.

The site must include sections for:

1. **Book diary**
   - reading log
   - individual book entries
   - book reviews
   - ratings, favourite quotes, reading dates, moods, tags

2. **Plant journal and inventory**
   - list of plants
   - individual plant pages or cards
   - care notes
   - watering / repotting / growth observations
   - wishlist and plant babies / propagations if suitable

3. **Cute gif animations**
   - decorative gifs used tastefully throughout the site
   - small animated accents like sparkles, hearts, stars, flowers, blinking icons, tiny dividers, badges, stamps

4. **Travel information**
   - places visited
   - diary-style travel entries
   - favourite cafés / shops / streets / memories
   - maps, tips, small itineraries, photos or placeholders where useful

5. **Funny cursor**
   - custom cursor or cursor effect
   - charming and usable
   - easy to disable
   - safe fallback behaviour on touch devices and accessibility-sensitive cases

Also add small supporting features that strengthen the personal vintage feel.

---

## Recommended technical approach

Default stack preference:

1. **Astro**
2. Next.js static export
3. Vite + React
4. plain HTML/CSS/JS

Preferred default: **Astro**.

Reason:
- content-heavy site
- easy static deployment
- easy content collections
- easy future extension
- good fit for novice-friendly content editing

Avoid adding a backend unless there is a strong reason.

---

## Required project outputs

The final project must include:

1. a working website
2. a clean file structure
3. sample content
4. a root `README.md`
5. `docs/how-to-run.md`
6. `docs/how-to-edit-content.md`
7. `docs/deploy-vps-traefik.md`
8. `docs/personal-style-agent.md`
9. `docs/style-notes.md`
10. a simple Docker setup for deployment
11. a `docker-compose.yml` or equivalent deployment example suitable for Traefik labels

If any of these are missing, the work is incomplete.

---

## Non-negotiable maintainability rules

### 1. Content must be easy to edit
Use data-driven content structures.

Prefer:
- Markdown
- MDX if needed
- YAML or JSON only for small structured data
- Astro content collections

Do **not** hardcode ordinary content into page components if that content is expected to change.

Books, plants, travel entries, and diary-style updates should live in content files.

### 2. Editing instructions must be explicit
The project must clearly explain:
- how to add a new blog post
- how to add a new book review
- how to add a new plant entry
- how to add a new travel post
- where to place gifs, stamps, cursor assets, and images
- how to change the home page intro text
- how to update the About page
- how to preview changes before committing them

### 3. Running locally must be simple
The project should run with a small number of obvious commands.

Prefer a flow similar to:
- install dependencies
- run dev server
- build production output
- preview production output

### 4. Deployment must be realistic
The project must be easy to deploy behind Traefik on a VPS.

Provide:
- a production-ready Dockerfile
- a compose example
- volume/path assumptions if relevant
- example Traefik labels
- note what domain variables need changing

### 5. Documentation must stay current
Whenever you add or restructure a feature, also update the relevant docs.

### 6. Style updates must be documented
If a new design reference changes the visual direction, update the style files and the style log.

---

## Site structure

Create at least these pages or sections:

### Home
Include:
- welcome note from Marihella
- tiny intro / about the site
- featured latest book review
- featured plant update
- featured travel note
- decorative badges / blinkies / small gifs
- little status box such as “currently reading”, “currently growing”, “currently dreaming of”
- optional site update box

### About
Include:
- short bio
- likes / dislikes
- favourites
- current obsessions or interests
- fun facts
- optional website manifesto

### Book Diary
Include:
- hub page
- list or grid of books
- charming metadata display
- individual entries

Each book entry should support:
- title
- author
- cover image or placeholder
- date started / finished
- rating
- review
- favourite quote
- mood / vibe
- tags

### Plant Journal
Include:
- inventory or plant list
- individual entries or cards
- care notes
- room or location if useful
- date acquired
- care difficulty
- watering notes
- propagation notes if used

Optional playful status labels such as:
- thriving
- dramatic
- recovering
- babying this one

### Travel
Include:
- trips index
- travel diary entries
- favourite places
- cafés / shops / streets / walks
- scrapbook feeling
- photos or placeholders where useful

### Gallery / Cute Things
Include:
- cute gifs
- blinkies
- badges
- stamps
- decorative mini collections

### Extras
Add at least a few of the following:
- guestbook-style page or mock version
- now page
- links page
- favourites page
- shrine page
- music favourites page
- FAQ
- site updates / changelog
- 88x31 site button
- web ring inspired component
- faux hit counter
- mini diary snippets

---

## Visual design requirements

### Overall style
Use a mid-2000s personal web aesthetic with details such as:
- patterned backgrounds or soft tiled textures
- scrapbook layers
- stitched borders, dotted borders, rounded boxes, sticker-like cards
- glossy buttons or image-based navigation accents
- pastel, floral, dreamy, playful, or cosy palettes
- retro web widgets
- tiny icons in headings
- little stars / hearts / flowers / ribbons / sparkles

### Avoid
Do not make it look like:
- brutalist design
- monochrome minimalism
- modern corporate design
- glassmorphism-heavy product UI
- sterile luxury branding
- generic Tailwind landing page aesthetics

### Typography
Use web-safe or retro-feeling fonts, but preserve readability.

Possible direction:
- one decorative heading font
- one readable body font
- maybe one pixel or bitmap accent font in small doses

Do not overuse hard-to-read novelty fonts.

### Layout
Layout can be slightly busy and old-school, but should still be deliberate.

Possible layout ideas:
- header banner
- left sidebar navigation
- main content area
- right sidebar with widgets
- footer with badges, buttons, site credits

Make desktop feel like an old personal site, while mobile should stack cleanly and remain usable.

---

## Accessibility and usability

Even though the site looks vintage, modern usability matters.

Must do:
- semantic HTML
- alt text for meaningful images
- sufficient text contrast
- keyboard navigability
- visible focus states
- responsive layout
- reduced motion support for heavier animations
- avoid autoplay audio
- avoid flashing content that could be harmful
- ensure text remains readable over decorative backgrounds

The site may be maximalist, but not hostile.

---

## Performance rules

Keep the site light enough to load comfortably.

- optimise gifs and images
- use small decorative assets
- lazy load where appropriate
- avoid giant libraries for simple interactions
- avoid excessive client-side JS
- prefer CSS effects where practical
- preserve the handmade feel without making the site sluggish

---

## Definition of done

The project is complete when:

1. the website runs locally without friction
2. it clearly feels like a mid-2000s personal indie web site
3. it includes:
   - book diary with reviews
   - plant journal and inventory
   - cute gifs
   - travel section
   - funny cursor
4. it includes additional vintage personal-site touches
5. it is responsive and usable in modern browsers
6. the content feels personal and believable
7. the codebase is clean enough to continue extending
8. the workflow clearly supports Git version control
9. the style guidance can evolve through documented future references

---

## Final design principle

Modern underneath.
Vintage on the surface.
Personal everywhere.

Build Marihella a website that feels like stumbling onto somebody’s beautiful internet corner at 1:17am and wanting to stay there.
