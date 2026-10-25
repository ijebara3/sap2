import { defineConfig } from "@playwright/test";
import { projects } from "./devices";
import path from "node:path";

const baseURL = process.env.AUDIT_BASE_URL || "http://localhost:8080";
const artifacts = path.resolve(process.env.AUDIT_ARTIFACTS || "testing/artifacts");

export default defineConfig({
  testDir: "./specs",
  outputDir: path.join(artifacts, "results"),
  timeout: 120_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: path.join(artifacts, "html-report"), open: "never" }],
    ["json", { outputFile: path.join(artifacts, "results.json") }],
  ],
  use: { baseURL, trace: "retain-on-failure", screenshot: "only-on-failure", actionTimeout: 15_000 },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 8080 --strictPort",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects,
});
