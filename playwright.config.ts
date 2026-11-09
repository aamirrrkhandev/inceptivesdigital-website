import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  use: { baseURL: process.env.TEST_BASE_URL || "http://localhost:3100" },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "tablet", use: { viewport: { width: 820, height: 1180 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
  ],
});
