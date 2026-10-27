import { expect, test } from "./support/fixtures";

const pages = ["/", "/products", "/business", "/contact", "/order", "/quote", "/privacy"];

for (const path of pages) {
  test(`${path} renders without errors or horizontal scrolling`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error" && !/ERR_FAILED|net::/.test(m.text())) errors.push(m.text());
    });

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Crystal Fresh Hydrolife/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("unknown pages return a branded 404", async ({ page }) => {
  const response = await page.goto("/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

test("call, email and WhatsApp links use the confirmed contact details", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator("a[href]").evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));

  expect(hrefs.filter((h) => h.startsWith("tel:")).every((h) => h === "tel:0758269725")).toBe(true);
  expect(hrefs.filter((h) => h.startsWith("mailto:")).every((h) => h.startsWith("mailto:muhadiwawire@gmail.com"))).toBe(true);
  const whatsapp = hrefs.filter((h) => h.includes("wa.me"));
  expect(whatsapp.length).toBeGreaterThan(0);
  for (const h of whatsapp) expect(h).toMatch(/^https:\/\/wa\.me\/254758269725\?text=Hello%20Crystal%20Fresh/);
});

test("every internal link on the home page resolves", async ({ page, request }) => {
  await page.goto("/");
  const internal = await page
    .locator('a[href^="/"]')
    .evaluateAll((links) => [...new Set(links.map((a) => (a.getAttribute("href") ?? "").split("#")[0]))]);
  for (const href of internal) {
    expect((await request.get(href)).status(), href).toBe(200);
  }
});

test("main navigation reaches every section", async ({ page, isMobile }) => {
  await page.goto("/");
  for (const [label, path] of [
    ["Products", "/products"],
    ["Business", "/business"],
    ["Contact", "/contact"],
  ] as const) {
    if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
    const nav = page.getByRole("navigation", { name: isMobile ? "Mobile" : "Main" });
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.locator("h1")).toBeVisible();
    if (isMobile) {
      await expect(page.locator("#mobile-menu")).toBeHidden();
    } else {
      await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page");
    }
  }
});

test("hero calls to action lead to the order, quote and contact pages", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("section").first();
  for (const [name, path] of [
    ["Order Water", "/order"],
    ["Request a Quote", "/quote"],
    ["Contact Us", "/contact"],
  ] as const) {
    await hero.getByRole("link", { name }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await page.goBack();
  }
});

test("SEO files, structured data and security headers are served", async ({ page, request }) => {
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  const og = await request.get("/opengraph-image");
  expect(og.headers()["content-type"]).toBe("image/png");

  const response = await page.goto("/");
  const headers = response!.headers();
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'self'");
  expect(headers["x-content-type-options"]).toBe("nosniff");

  const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  expect(jsonLd["@type"]).toBe("LocalBusiness");
  expect(jsonLd.telephone).toBe("+254758269725");
  expect(jsonLd).not.toHaveProperty("openingHoursSpecification");
});

test("old Bulk Supply and Tenders addresses redirect to the Business page", async ({ page }) => {
  await page.goto("/corporate-supply");
  await expect(page).toHaveURL(/\/business$/);
  await page.goto("/tenders");
  await expect(page).toHaveURL(/\/business$/);
});

for (const path of ["/", "/business"]) {
  test(`${path} shows the organisations we have worked with`, async ({ page }) => {
    await page.goto(path);
    const section = page.locator("section", { has: page.getByRole("heading", { name: "Organisations we've worked with" }) });
    for (const name of ["Velocity Gym & Spa", "Ultimo Fitness & Spa", "Good Kenyan Foundation"]) {
      const logo = section.getByRole("img", { name: `${name} logo` });
      await logo.scrollIntoViewIfNeeded();
      await expect(logo).toBeVisible();
      await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
  });
}

test("the home page shows hydration tips", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section", { has: page.getByRole("heading", { name: "Stay well hydrated" }) });
  await expect(section.getByRole("listitem")).toHaveCount(4);
  await expect(section.getByRole("heading", { name: "Clean before refilling" })).toBeVisible();
});
