import { defineCollection, z } from 'astro:content';

/* ------------------------------------------------------------------
   BOOKS
   Each file in src/content/books/ is one book entry.
   ------------------------------------------------------------------ */
const books = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    cover: z.string().optional(),          // path like /images/books/fourth-wing.jpg
    rating: z.number().min(1).max(5).optional(),
    dateStarted: z.coerce.date().optional(),
    dateFinished: z.coerce.date().optional(),
    status: z.enum(['reading', 'finished', 'dnf', 'want-to-read']).default('finished'),
    series: z.string().optional(),         // e.g. "A Court of Thorns and Roses"
    seriesNumber: z.number().optional(),   // e.g. 1
    favouriteQuote: z.string().optional(),
    mood: z.string().optional(),           // e.g. "fae courts, slow burn, devastating"
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

/* ------------------------------------------------------------------
   PLANTS
   Each file in src/content/plants/ is one plant entry.
   ------------------------------------------------------------------ */
const plants = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    botanicalName: z.string().optional(),
    photo: z.string().optional(),          // path like /images/plants/monstera.jpg
    location: z.string().optional(),       // e.g. "living room window", "front garden"
    dateAcquired: z.coerce.date().optional(),
    difficulty: z.enum(['easy', 'moderate', 'dramatic', 'indestructible']).optional(),
    status: z.enum(['thriving', 'growing', 'recovering', 'dramatic', 'babying', 'wishlist', 'rip']).default('growing'),
    wateringNotes: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

/* ------------------------------------------------------------------
   TRAVEL
   Each file in src/content/travel/ is one trip or place entry.
   ------------------------------------------------------------------ */
const travel = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    destination: z.string(),
    date: z.coerce.date().optional(),
    cover: z.string().optional(),          // path like /images/travel/kyoto.jpg
    mood: z.string().optional(),           // e.g. "misty mornings, temple bells"
    highlights: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

/* ------------------------------------------------------------------
   RECIPES
   Each file in src/content/recipes/ is one recipe entry.
   ------------------------------------------------------------------ */
const recipes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    source: z.string().optional(),         // URL or "grandma's recipe"
    sourceUrl: z.string().url().optional(), // link to original recipe
    photo: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    dateTried: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]), // e.g. ["vegetarian", "comfort food", "quick"]
    wouldMakeAgain: z.boolean().default(true),
    featured: z.boolean().default(false),
  }),
});

export const collections = { books, plants, travel, recipes };
