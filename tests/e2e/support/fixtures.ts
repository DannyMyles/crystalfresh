import { test as base, expect, type Page } from "@playwright/test";
import { WEBHOOK_URL } from "./env";

export type Hit = { secret: string | null; payload: { reference: string; formId: string; data: Record<string, string> } };

/** Keeps tests offline-safe and fast: third-party scripts are never fetched. */
export const test = base.extend<{ blockThirdParties: void }>({
  blockThirdParties: [
    async ({ context }, use) => {
      await context.route(/googletagmanager\.com|google-analytics\.com|challenges\.cloudflare\.com/, (route) => route.abort());
      await use();
    },
    { auto: true },
  ],
});

export { expect };

export const webhook = {
  async reset() {
    await fetch(`${WEBHOOK_URL}/reset`, { method: "POST" });
  },
  async fail(fail: boolean) {
    await fetch(`${WEBHOOK_URL}/mode`, { method: "POST", body: JSON.stringify({ fail }) });
  },
  async hits(): Promise<Hit[]> {
    return (await fetch(`${WEBHOOK_URL}/hits`)).json();
  },
};

/** The server rejects forms filled faster than a person could, so wait past that threshold. */
export async function waitLikeAHuman(page: Page) {
  await page.waitForTimeout(2700);
}

export async function fillContactForm(page: Page) {
  await page.getByLabel("Your name").fill("E2E Tester");
  await page.getByLabel("Phone number").fill("0712 345 678");
  await page.getByLabel("What is it about?").selectOption("Delivery");
  await page.getByLabel("Message").fill("Do you deliver on Saturdays?");
}

export const successPanel = (page: Page) => page.locator("div[role=status][tabindex]");
export const errorPanel = (page: Page) => page.locator("form div[role=alert]");
