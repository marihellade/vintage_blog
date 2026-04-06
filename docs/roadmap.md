# Roadmap

Future features and improvements, tracked outside of active implementation briefs.

---

## /books page — future iterations

### Filter simplification (post-uplift)

The current filter UI has both "Year" pills and "Mood" tag pills. The mood/tag distinction is confusing and the tag list is too long (14+ flat pills).

**Plan:**
1. Remove the "Mood" filter label — just call them tags
2. By default, show only the **top 5 most-used tags** in the filter row
3. The rest available via a "+ more" expansion (already partially implemented)
4. When the collection reaches ~40-50 books, add a **search/autocomplete input** for tags so users can type to find a specific tag rather than scanning a long list
5. Eventually consider a "primary genre" vs "secondary tag" distinction in the content model, but only if tag volume warrants it

**Why:** The filter row should feel like a curated index, not a taxonomy dump. Showing fewer options by default reduces cognitive load and keeps the UI feeling editorial rather than administrative.

### Year-in-reading narrative

Allow Marihella to add a short personal note per reading year — a mini "year in review" that appears as an intro to that year's shelf section.

**How it could work:**
- Add a small content collection or YAML file for reading-year notes (e.g., `src/content/reading-years/2026.md`)
- Each entry: year, a 1-2 sentence narrative, optional mood/theme
- When browsing "All" years, these notes appear as shelf dividers between year groups
- When filtering to a specific year, the note appears at the top

**Example:** "2026 — the year I fell into romantasy and didn't come up for air."

**Why:** This turns the reviewed shelf from a sorted list into a personal reading story. It's low-maintenance (one note per year) but adds significant warmth.

### Series tracker sidebar placement

Consider moving the series tracker from a full-width section into a sidebar widget on desktop. This would free the main column for the reviewed shelf and strengthen the "cabinet" layout metaphor.

**Decision deferred** — figure this out during or after the Collector's Cabinet uplift once the new layout is in place and we can see how the space feels.

### Future browse pathways (50+ books)

When the collection grows larger:
- **Author browse** — group or filter by author
- **Rating filter** — "show only 4+ star books" or a "favourites" quick filter
- **Compact/dense view toggle** — smaller covers, more books visible at once
- **Seasonal grouping** — browse by reading season (Spring/Summer/Autumn/Winter)

### Separate reading stats page

At 50+ books, consider a separate `/books/stats` route with annual summaries, genre breakdowns, and reading patterns. Keep it out of the main `/books` page to avoid dashboard creep.
