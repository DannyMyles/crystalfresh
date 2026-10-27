import { describe, expect, it, vi } from "vitest";
import { looksAutomated, verifyTurnstile } from "@/lib/forms/guard";

function form(entries: Record<string, string>): FormData {
  const data = new FormData();
  for (const [k, v] of Object.entries(entries)) data.set(k, v);
  return data;
}

describe("looksAutomated", () => {
  const now = 1_800_000_000_000;

  it("flags a filled honeypot field", () => {
    expect(looksAutomated(form({ website: "http://spam.example" }), now)).toBe(true);
  });

  it("flags forms submitted faster than a person could fill them", () => {
    expect(looksAutomated(form({ _ts: String(now - 500) }), now)).toBe(true);
  });

  it("allows normal submissions, including ones without JavaScript (no timestamp)", () => {
    expect(looksAutomated(form({ _ts: String(now - 30_000), website: "" }), now)).toBe(false);
    expect(looksAutomated(form({ _ts: "" }), now)).toBe(false);
  });
});

describe("verifyTurnstile", () => {
  it("is skipped when Turnstile is not configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    expect(await verifyTurnstile(form({}), "1.2.3.4")).toBe(true);
  });

  it("rejects a missing token when Turnstile is configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    expect(await verifyTurnstile(form({}), "1.2.3.4")).toBe(false);
  });

  it("checks the token with Cloudflare", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    const fetchMock = vi.fn(async () => Response.json({ success: true }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await verifyTurnstile(form({ "cf-turnstile-response": "tok" }), "1.2.3.4")).toBe(true);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    expect(String(init.body)).toBe("secret=secret&response=tok&remoteip=1.2.3.4");
  });

  it("fails closed when Cloudflare cannot be reached", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("down"); }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await verifyTurnstile(form({ "cf-turnstile-response": "tok" }), "1.2.3.4")).toBe(false);
  });
});
