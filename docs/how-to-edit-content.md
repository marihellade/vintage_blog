# How to Edit Content

All your content lives in simple text files inside the `src/content/` folder. You don't need to know any code to edit them — they're just text with a small header section.

## How content files work

Each content file has two parts:

1. **Frontmatter** — the metadata between the `---` lines at the top
2. **Body** — your actual writing below the frontmatter, in Markdown

Example:

```markdown
---
title: "Fourth Wing"
author: "Rebecca Yarros"
rating: 4
status: finished
tags: ["fantasy", "dragons"]
---

Your review text goes here. You can write paragraphs,
use *italics*, **bold**, and > quotes.
```

## Adding a new book review

1. Create a new file in `src/content/books/`
2. Name it something like `my-book-name.md` (use dashes instead of spaces)
3. Copy the frontmatter structure from an existing book file
4. Fill in your details and write your review

### Book frontmatter fields

| Field | Required | Example |
|-------|----------|---------|
| `title` | Yes | `"Fourth Wing"` |
| `author` | Yes | `"Rebecca Yarros"` |
| `cover` | No | `"/images/books/fourth-wing.jpg"` |
| `rating` | No | `4` (1 to 5) |
| `status` | No | `reading`, `finished`, `dnf`, `want-to-read` |
| `series` | No | `"The Empyrean"` |
| `seriesNumber` | No | `1` |
| `favouriteQuote` | No | `"Any quote you loved"` |
| `mood` | No | `"dragons, slow burn, brutal"` |
| `tags` | No | `["fantasy", "romantasy"]` |
| `featured` | No | `true` or `false` — shows on the home page |

### Adding a book cover image

1. Save the cover image in `public/images/books/`
2. Name it to match the book, like `fourth-wing.jpg`
3. In the frontmatter, set: `cover: "/images/books/fourth-wing.jpg"`

## Adding a new plant

1. Create a new file in `src/content/plants/`
2. Name it like `monstera.md`

### Plant frontmatter fields

| Field | Required | Example |
|-------|----------|---------|
| `name` | Yes | `"Monstera Deliciosa"` |
| `botanicalName` | No | `"Monstera deliciosa"` |
| `photo` | No | `"/images/plants/monstera.jpg"` |
| `location` | No | `"Living room window"` |
| `difficulty` | No | `easy`, `moderate`, `dramatic`, `indestructible` |
| `status` | No | `thriving`, `growing`, `recovering`, `dramatic`, `babying`, `wishlist`, `rip` |
| `wateringNotes` | No | `"Once a week in summer"` |
| `tags` | No | `["indoor", "tropical"]` |
| `featured` | No | `true` or `false` |

## Adding a new travel entry

1. Create a new file in `src/content/travel/`
2. Name it like `blue-mountains.md`

### Travel frontmatter fields

| Field | Required | Example |
|-------|----------|---------|
| `title` | Yes | `"A weekend in the mountains"` |
| `destination` | Yes | `"Blue Mountains"` |
| `date` | No | `2025-09-15` |
| `cover` | No | `"/images/travel/mountains.jpg"` |
| `mood` | No | `"eucalyptus mist, cliff edges"` |
| `highlights` | No | A list of memorable moments |
| `tags` | No | `["nature", "weekend trip"]` |
| `featured` | No | `true` or `false` |

## Adding a new recipe

1. Create a new file in `src/content/recipes/`
2. Name it like `rosemary-focaccia.md`

### Recipe frontmatter fields

| Field | Required | Example |
|-------|----------|---------|
| `title` | Yes | `"Rosemary Focaccia"` |
| `source` | No | `"Adapted from various"` |
| `sourceUrl` | No | `"https://example.com/recipe"` |
| `rating` | No | `5` (1 to 5) |
| `dateTried` | No | `2025-08-20` |
| `tags` | No | `["bread", "vegetarian"]` |
| `wouldMakeAgain` | No | `true` or `false` |
| `featured` | No | `true` or `false` |

## Editing the About page

The About page is at `src/pages/about.astro`. Open it in any text editor and change the text directly. The text is plain English inside HTML-like tags — just change the words between the `<p>` and `</p>` markers.

## Editing the home page welcome text

The home page is at `src/pages/index.astro`. Find the `welcome-card` section and change the text inside the `<p>` tag.

## Where to put images

| Type | Folder |
|------|--------|
| Book covers | `public/images/books/` |
| Plant photos | `public/images/plants/` |
| Travel photos | `public/images/travel/` |

Images placed in the `public/` folder are served at the same path. For example:
- File at `public/images/books/my-book.jpg`
- Use as `/images/books/my-book.jpg` in frontmatter

## Previewing your changes

After editing any file, make sure the dev server is running (`npm run dev`) and check your browser. Changes appear automatically.
