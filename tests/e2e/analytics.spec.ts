import type { Page } from "@playwright/test";
import { expect, fillContactForm, successPanel, test, waitLikeAHuman, webhook } from "./support/fixtures";

/** Reads gtag("event", …) calls from the Google Analytics data layer. */
async function analyticsEvents(page: Page) {
  return page.evaluate(() =>
    ((window as unknown as { dataLayer?: IArguments[] }).dataLayer ?? [])
      .map((entry) => Array.from(entry) as unknown[])
      .filter((args) => args[0] === "event")
      .map(([, name, params]) => ({ name: name as string, params: params as Record<string, string> })),
  );
}

test("call, WhatsApp and email clicks are recorded", async ({ page, context }) => {
  await context.route(/wa\.me|api\.whatsapp\.com/, (route) => route.abort());
  await page.goto("/contact");

  await page.locator('a[href^="tel:"]').first().dispatchEvent("click");
  await page.locator('a[href*="wa.me"]').first().dispatchEvent("click");
  await page.locator('a[href^="mailto:"]').first().dispatchEvent("click");

  const names = (await analyticsEvents(page)).map((e) => e.name);
  expect(names).toEqual(expect.arrayContaining(["click_call", "click_whatsapp", "click_email"]));
  const call = (await analyticsEvents(page)).find((e) => e.name === "click_call");
  expect(call?.params.page_path).toBe("/contact");
});

test("form outcomes are recorded without any personal details", async ({ page }) => {
  await webhook.reset();
  await page.goto("/contact");
  await fillContactForm(page);
  await waitLikeAHuman(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(successPanel(page)).toBeVisible();

  const events = await analyticsEvents(page);
  expect(events).toContainEqual({ name: "form_submit_success", params: { form_id: "contact" } });
  expect(JSON.stringify(events)).not.toContain("E2E Tester");
});

test("the privacy notice mentions analytics when it is enabled", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: "Website analytics" })).toBeVisible();
});
