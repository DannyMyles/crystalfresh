import { beforeEach, describe, expect, it, vi } from "vitest";
import { isRateLimited } from "@/lib/forms/rate-limit";

let n = 0;
const uniqueKey = () => `10.0.0.${++n}`;

beforeEach(() => {
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  vi.stubEnv("KV_REST_API_URL", "");
  vi.stubEnv("KV_REST_API_TOKEN", "");
  vi.stubEnv("FORM_RATE_LIMIT_MAX", "");
});

describe("isRateLimited (in memory)", () => {
  it("allows 5 submissions per 10 minutes, then blocks", async () => {
    const key = uniqueKey();
    const now = Date.now();
    for (let i = 0; i < 5; i++) expect(await isRateLimited(key, now + i)).toBe(false);
    expect(await isRateLimited(key, now + 10)).toBe(true);
    expect(await isRateLimited(uniqueKey(), now)).toBe(false);
  });

  it("lets visitors submit again once the window has passed", async () => {
    const key = uniqueKey();
    const now = Date.now();
    for (let i = 0; i < 6; i++) await isRateLimited(key, now);
    expect(await isRateLimited(key, now + 10 * 60 * 1000 + 1)).toBe(false);
  });

  it("respects FORM_RATE_LIMIT_MAX", async () => {
    vi.stubEnv("FORM_RATE_LIMIT_MAX", "2");
    const key = uniqueKey();
    expect(await isRateLimited(key)).toBe(false);
    expect(await isRateLimited(key)).toBe(false);
    expect(await isRateLimited(key)).toBe(true);
  });
});

describe("isRateLimited (shared Redis store)", () => {
  beforeEach(() => {
    vi.stubEnv("KV_REST_API_URL", "https://redis.example.com/");
    vi.stubEnv("KV_REST_API_TOKEN", "token-123");
  });

  it("increments a hashed per-window counter through the Upstash REST pipeline", async () => {
    const fetchMock = vi.fn(async () => Response.json([{ result: 6 }, { result: 1 }]));
    vi.stubGlobal("fetch", fetchMock);

    expect(await isRateLimited("203.0.113.9")).toBe(true);

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://redis.example.com/pipeline");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer token-123");
    const commands = JSON.parse(init.body as string) as string[][];
    expect(commands[0][0]).toBe("INCR");
    expect(commands[1]).toEqual(["EXPIRE", commands[0][1], "600"]);
    expect(commands[0][1]).toMatch(/^cfh:form-rl:[0-9a-f]{24}:\d+$/);
    expect(commands[0][1]).not.toContain("203.0.113.9");
  });

  it("allows submissions under the limit", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json([{ result: 1 }, { result: 1 }])));
    expect(await isRateLimited(uniqueKey())).toBe(false);
  });

  it("falls back to the in-memory limit when Redis is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network down"); }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const key = uniqueKey();
    for (let i = 0; i < 5; i++) expect(await isRateLimited(key)).toBe(false);
    expect(await isRateLimited(key)).toBe(true);
  });
});
