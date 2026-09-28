import { defineConfig, devices } from "@playwright/test";

// Plan 09: runs against the static prerendered build (`npm run build && npx serve build/client`).
export default defineConfig({
  testDir: "e2e",
  // The heaviest terrible-tier pages run several axe scans each; give them room under parallel load.
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["github"]] : "list",
  use: {
    baseURL: "http://localhost:4319",
    trace: "retain-on-failure",
  },
  webServer: {
    // A dedicated port, distinct from `npm run preview`'s 4173, so this never collides with an unrelated
    // local server already using that port.
    command: "npx serve build/client -l 4319",
    url: "http://localhost:4319",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
