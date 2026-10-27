import { UNCONFIGURED_URL } from "./support/env";
import { errorPanel, expect, fillContactForm, successPanel, test, waitLikeAHuman, webhook } from "./support/fixtures";

test.describe.configure({ mode: "serial" });

test.beforeEach(async () => {
  await webhook.reset();
});

test("order: validates in the browser, then delivers to the backend", async ({ page }) => {
  await page.goto("/order?product=water-refill");
  await expect(page.getByRole("radio", { name: /20 L refill/ })).toBeChecked();

  await page.getByRole("button", { name: "Send order request" }).click();
  await expect(page.getByText("Please make a choice.")).toHaveCount(2);
  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByRole("radio", { name: "Home" })).toBeFocused();
  expect(await webhook.hits()).toHaveLength(0);

  await page.getByRole("radio", { name: /Case of 1 L bottles/ }).check();
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await expect(page.getByLabel("How many?")).toHaveValue("3");
  await expect(page.getByText("KES 1,800")).toBeVisible();
  await page.getByRole("radio", { name: /20 L refill/ }).check();
  await expect(page.getByText("20 L refill: price confirmed when we call you.")).toBeVisible();
  await page.getByRole("button", { name: "Decrease quantity" }).click();
  await page.getByRole("radio", { name: "Office" }).check();
  await page.getByRole("radio", { name: "Weekly" }).check();
  await page.getByLabel("Your name").fill("Jane Wanjiku");
  await expect(page.getByText("Please enter your name.")).toBeHidden();
  await page.getByLabel("Phone number").fill("0712 345 678");
  await page.getByLabel("Delivery location").fill("Ndwaru Road, near the stage");
  await page.getByLabel("Preferred time").selectOption("Morning");
  await page.getByLabel("Additional notes").fill("<b>Ring</b> the bell & wait");
  await waitLikeAHuman(page);
  await page.getByRole("button", { name: "Send order request" }).click();

  await expect(successPanel(page)).toContainText("Request received");
  const reference = (await successPanel(page).locator("strong").textContent()) ?? "";
  expect(reference).toMatch(/^CFH-\d{6}-[0-9A-Z]{5}$/);

  const [hit] = await webhook.hits();
  expect(hit.secret).toBe("e2e-secret");
  expect(hit.payload.reference).toBe(reference);
  expect(hit.payload.formId).toBe("order");
  expect(hit.payload.data).toMatchObject({
    name: "Jane Wanjiku",
    product: "20 L refill",
    quantity: "2",
    purpose: "Office",
    frequency: "Weekly",
    time: "Morning",
    notes: "<b>Ring</b> the bell & wait",
  });

  await page.getByRole("button", { name: "Send another request" }).click();
  await expect(page.getByLabel("Your name")).toHaveValue("");
});

test("order: rejects a delivery date in the past", async ({ page }) => {
  await page.goto("/order");
  await page.getByLabel("Your name").fill("Jane");
  await page.getByLabel("Phone number").fill("0712345678");
  await page.getByRole("radio", { name: /Case of 1 L bottles/ }).check();
  await page.getByRole("radio", { name: "Home" }).check();
  await page.getByRole("radio", { name: "One-time" }).check();
  await page.getByLabel("Delivery location").fill("Ndwaru Road");
  await page.getByLabel("Preferred delivery date").fill("2020-01-01");
  await page.getByRole("button", { name: "Send order request" }).click();
  await expect(page.getByText("Please choose today or a later date.")).toBeVisible();
  expect(await webhook.hits()).toHaveLength(0);
});

test("quote: product buttons preselect the product and the request is delivered", async ({ page }) => {
  await page.goto("/products");
  await page.getByRole("link", { name: "Bulk quote", exact: true }).first().click();
  await expect(page).toHaveURL(/\/quote\?product=bottled-water$/);
  await expect(page.getByLabel("Products needed")).toHaveValue("Bottled Drinking Water");

  await page.getByLabel("Organisation name").fill("Example Academy");
  await page.getByLabel("Type of organisation").selectOption("Schools");
  await page.getByLabel("Contact person").fill("John Kamau");
  await page.getByLabel("Phone number").fill("0722000000");
  await page.getByLabel("Email address").fill("john@example.ac.ke");
  await page.getByLabel("Estimated quantity").fill("200 bottles per week");
  await page.getByLabel("Supply frequency").selectOption("Weekly");
  await page.getByLabel("Delivery location").fill("Example Academy, Ndwaru Road");
  await waitLikeAHuman(page);
  await page.getByRole("button", { name: "Request quotation" }).click();

  await expect(successPanel(page)).toContainText("Request received");
  const [hit] = await webhook.hits();
  expect(hit.payload.formId).toBe("quote");
  expect(hit.payload.data.organisation).toBe("Example Academy");
});

test("a failing backend shows an error with a WhatsApp fallback, never a success", async ({ page }) => {
  await webhook.fail(true);
  await page.goto("/contact");
  await fillContactForm(page);
  await waitLikeAHuman(page);
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(errorPanel(page)).toContainText("could not be sent");
  await expect(successPanel(page)).toHaveCount(0);
  await expect(page.getByLabel("Your name")).toHaveValue("E2E Tester");

  const fallback = page.getByRole("link", { name: "Send these details on WhatsApp" });
  await fallback.dispatchEvent("click");
  const message = decodeURIComponent((await fallback.getAttribute("href"))!.split("text=")[1]);
  expect(message).toContain("Your name: E2E Tester");
  expect(message).toContain("Message: Do you deliver on Saturdays?");
});

test("an unconfigured backend tells visitors to call or WhatsApp instead", async ({ page }) => {
  await page.goto(`${UNCONFIGURED_URL}/contact`);
  await fillContactForm(page);
  await waitLikeAHuman(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(errorPanel(page)).toContainText("Online requests are temporarily unavailable");
  await expect(successPanel(page)).toHaveCount(0);
});

test("losing the connection while submitting keeps the form usable", async ({ page, context }) => {
  await page.goto("/contact");
  await fillContactForm(page);
  await waitLikeAHuman(page);
  await context.setOffline(true);
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(errorPanel(page)).toContainText("offline");
  await expect(page.getByLabel("Your name")).toHaveValue("E2E Tester");

  await context.setOffline(false);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(successPanel(page)).toContainText("Request received");
  expect(await webhook.hits()).toHaveLength(1);
});

test("a stale page after a redeploy shows a friendly error instead of crashing", async ({ page }) => {
  await page.goto("/contact");
  await fillContactForm(page);
  await waitLikeAHuman(page);
  await page.route("**/contact", (route) =>
    route.request().method() === "POST" ? route.fulfill({ status: 404, body: "Server action not found" }) : route.continue(),
  );
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(errorPanel(page)).toContainText("could not reach our server");
  await expect(page.getByText("Application error")).toHaveCount(0);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the contact form still submits and shows the reference", async ({ page }) => {
    await page.goto("/contact");
    await fillContactForm(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(successPanel(page)).toContainText("Request received");
    const [hit] = await webhook.hits();
    expect(hit.payload.data.name).toBe("E2E Tester");
  });
});
