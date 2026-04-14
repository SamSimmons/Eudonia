import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: ["layout/**/*.spec.ts", "perf/**/*.spec.ts"],
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:5190",
    browserName: "chromium",
  },
  webServer: {
    command: "bun run dev",
    port: 5190,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "layout",
      testMatch: "layout/**/*.spec.ts",
    },
    {
      name: "perf",
      testMatch: "perf/**/*.spec.ts",
    },
  ],
});
