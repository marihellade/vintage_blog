import { defineConfig } from '@playwright/test';

const PORT = 4174;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './specs',
  fullyParallel: false,
  retries: 0,
  timeout: 60_000,
  use: {
    baseURL: BASE_URL,
    viewport: { width: 1440, height: 1100 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixels: 150,
      stylePath: './tests/ui/screenshot.css'
    }
  },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4174',
    url: BASE_URL,
    reuseExistingServer: false,
    stdout: 'ignore',
    stderr: 'pipe',
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 }
  }
});