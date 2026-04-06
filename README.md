# Marihella's Vintage Blog

A personal indie-web style website — books, plants, travel, and recipes. Built with Astro, designed to feel like a beautifully kept grimoire.

Requires Node.js `22.12.0+`.

## Quick start

```bash
npm install
npm run dev
```

Then open [http://localhost:4321](http://localhost:4321) in your browser.

## Documentation

- [How to run the site](docs/how-to-run.md)
- [How to edit content](docs/how-to-edit-content.md)
- [How to deploy to a VPS](docs/deploy-vps-traefik.md)
- [Personal style guide](docs/personal-style-agent.md)
- [Style evolution notes](docs/style-notes.md)

## Checks

Run these before shipping changes:

```bash
npm run check
npm run build
```

## Project structure

- `src/layouts/BaseLayout.astro` keeps the page shell small and readable.
- `src/components/DecorativeTrees.astro` holds the fixed page-edge illustration.
- `src/components/RightSidebar.astro` holds the right-hand widgets.
- `src/content/` contains the editable Markdown collections.

## Site sections

- **Book Diary** — reading log, series tracker, reviews
- **Plant Journal** — garden inventory and care notes
- **Travel** — scrapbook-style travel memories
- **Recipe Box** — tried recipes with personal notes
- **About** — who I am and what this place is

## Tech

- [Astro](https://astro.build) static site generator
- Content collections (Markdown files)
- Docker + Nginx for production
- Traefik-ready with labels
