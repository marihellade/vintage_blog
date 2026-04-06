# How to Run the Site

## What you need

- **Node.js** version 22.12.0 or higher — [download here](https://nodejs.org)
- A terminal (Terminal on Mac, or any command line tool)

To check if you have Node installed, run:

```bash
node --version
```

If it prints a version number like `v22.12.0` or newer, you're good.

## First time setup

Open a terminal, navigate to the project folder, and run:

```bash
npm install
```

This downloads all the things the site needs to work. You only need to do this once (or after updating `package.json`).

## Start the development server

```bash
npm run dev
```

This starts a local preview of your site at:

**http://localhost:4321**

Open that URL in your browser. Every time you save a file, the browser updates automatically.

Press `Ctrl + C` in the terminal to stop the server.

## Build for production

To create the final version of the site (the one you'd deploy):

```bash
npm run build
```

This creates a `dist/` folder with all the HTML, CSS, and images.

## Preview the production build

```bash
npm run preview
```

This lets you check the production build locally before deploying.

## Common issues

| Problem | Fix |
|---------|-----|
| `command not found: npm` | Install Node.js from nodejs.org |
| Port 4321 already in use | Close the other terminal running the server, or use `npm run dev -- --port 3000` |
| Changes not showing | Hard refresh the browser with `Ctrl + Shift + R` |
