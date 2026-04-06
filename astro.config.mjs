import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://marihella.com',
  output: 'static',
  legacy: {
    collectionsBackwardsCompat: true,
  },
});
