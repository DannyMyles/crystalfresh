import { defineConfig, devices } from "@playwright/test";
import { APP_PORT, UNCONFIGURED_APP_PORT, UNCONFIGURED_URL, WEBHOOK_PORT, WEBHOOK_URL } from "./tests/e2e/support/env";

/** Must match the build made by `npm run test:e2e` (see package.json). */
const appEnv = {
  NEXT_DIST_DIR: ".next-e2e",
  NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-E2ETEST000",
  FORM_RATE_LIMIT_MAX: "1000",
  // Blank out real email credentials from .env.local so tests never send mail.
  SMTP_USER: "",
  SMTP_PASSWORD: "",
  RESEND_API_KEY: "",
};

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://127.0.0.1:${APP_PORT}`,
    trace: "retain-on-failure",
    // Set PW_CHANNEL=chrome to use an installed Google Chrome instead of Playwright's Chromium.
    channel: process.env.PW_CHANNEL || undefined,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: process.env.PW_CHANNEL || undefined } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: process.env.PW_CHANNEL || undefined }, testMatch: /navigation\.spec\.ts/ },
  ],
  webServer: [
    {
      command: "node tests/e2e/support/mock-webhook.mjs",
      url: `${WEBHOOK_URL}/health`,
      env: { MOCK_WEBHOOK_PORT: String(WEBHOOK_PORT) },
      reuseExistingServer: false,
    },
    {
      command: `npx next start -p ${APP_PORT}`,
      url: `http://127.0.0.1:${APP_PORT}`,
      env: { ...appEnv, FORM_WEBHOOK_URL: `${WEBHOOK_URL}/hook`, FORM_WEBHOOK_SECRET: "e2e-secret" },
      reuseExistingServer: false,
    },
    {
      command: `npx next start -p ${UNCONFIGURED_APP_PORT}`,
      url: UNCONFIGURED_URL,
      env: { ...appEnv, FORM_WEBHOOK_URL: "", RESEND_API_KEY: "" },
      reuseExistingServer: false,
    },
  ],
});
