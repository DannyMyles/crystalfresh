import { UNCONFIGURED_URL } from "./support/env";
import { errorPanel, expect, fillContactForm, successPanel, test, waitLikeAHuman, webhook } from "./support/fixtures";

test.describe.configure({ mode: "serial" });

test.beforeEach(async () => {
  await webhook.reset();
});

test("order: validates in the browser, then delivers to the backend", async ({ page }) => {
  await page.goto("/order?product=water-refill");
  await expect(page.getByLabel("Product")).toHaveValue("Water Refill Services");

  await page.getByRole("button", { name: "Send order" }).click();
  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByLabel("Your name")).toBeFocused();
  expect(await webhook.hits()).toHaveLength(0);

  await page.getByLabel("Your name").fill("Jane Wanjiku");
  await expect(page.getByText("Please enter your name.")).toBeHidden();
  await page.getByLabel("Phone number").fill("0712 345 678");
  await page.getByLabel("Quantity and size").fill("2 containers");
  await page.getByLabel("Delivery location").fill("Ndwaru Road, near the stage");
  await page.getByLabel("Preferred time").selectOption("Morning");
  await page.getByLabel("Additional notes").fill("<b>Ring</b> the bell & wait");
  await waitLikeAHuman(page);
  await page.getByRole("button", { name: "Send order" }).click();

  await expect(successPanel(page)).toContainText("Request received");
  const reference = (await successPanel(page).locator("strong").textContent()) ?? "";
  expect(reference).toMatch(/^CFH-\d{6}-[0-9A-Z]{5}$/);

  const [hit] = await webhook.hits();
  expect(hit.secret).toBe("e2e-secret");
  expect(hit.payload.reference).toBe(reference);
  expect(hit.payload.formId).toBe("order");
  expect(hit.payload.data).toMatchObject({
    name: "Jane Wanjiku",
    product: "Water Refill Services",
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
  await page.getByLabel("Product").selectOption({ index: 1 });
  await page.getByLabel("Quantity and size").fill("1 bottle");
  await page.getByLabel("Delivery location").fill("Ndwaru Road");
  await page.getByLabel("Preferred delivery date").fill("2020-01-01");
  await page.getByRole("button", { name: "Send order" }).click();
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

test("tender: server and browser agree on email validation, then the inquiry is delivered", async ({ page }) => {
  await page.goto("/business#tender-form");
  await page.getByLabel("Organisation name").fill("Example County Government");
  await page.getByLabel("Sector").selectOption("County government");
  await page.getByLabel("Contact person").fill("Jane Doe");
  await page.getByLabel("Designation / role").fill("Procurement Officer");
  await page.getByLabel("Phone number").fill("+254 712 345678");
  await page.getByLabel("Email address").fill("not-an-email");
  await page.getByLabel("Products required").fill("500 ml bottled drinking water");
  await page.getByLabel("Quantities").fill("1,000 bottles per month");
  await page.getByLabel("Supply frequency").selectOption("Monthly");
  await page.getByLabel("Delivery location(s)").fill("County headquarters");
  await page.getByLabel("Tender / RFQ reference").fill("RFQ/2027/001");
  await page.getByRole("button", { name: "Submit tender inquiry" }).click();
  await expect(page.getByText("Please enter a valid email address.")).toBeVisible();

  await page.getByLabel("Email address").fill("jane.doe@example.go.ke");
  await waitLikeAHuman(page);
  await page.getByRole("button", { name: "Submit tender inquiry" }).click();
  await expect(successPanel(page)).toContainText("Request received");

  const [hit] = await webhook.hits();
  expect(hit.payload.data).toMatchObject({ tenderReference: "RFQ/2027/001", email: "jane.doe@example.go.ke" });
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
