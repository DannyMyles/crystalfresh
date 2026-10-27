import "server-only";

const WINDOW_SECONDS = 10 * 60;

function maxPerWindow(): number {
  const configured = Number(process.env.FORM_RATE_LIMIT_MAX);
  return Number.isInteger(configured) && configured > 0 ? configured : 5;
}

/** Upstash Redis REST credentials; Vercel's KV / Upstash integration uses the KV_* names. */
function redisConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ""), token } : null;
}

/**
 * Counts a submission for `key` (the visitor's IP) and reports whether it is
 * over the limit. Uses a shared Redis counter when configured, so the limit
 * holds across serverless instances; otherwise counts in this instance's memory.
 * A Redis failure falls back to memory rather than blocking genuine customers.
 */
export async function isRateLimited(key: string, now = Date.now()): Promise<boolean> {
  const redis = redisConfig();
  if (redis) {
    try {
      return (await countInRedis(redis, key, now)) > maxPerWindow();
    } catch (error) {
      console.error("[forms] Rate-limit store unavailable, using in-memory limit", error);
    }
  }
  return countInMemory(key, now) > maxPerWindow();
}

async function countInRedis(redis: { url: string; token: string }, key: string, now: number): Promise<number> {
  const window = Math.floor(now / 1000 / WINDOW_SECONDS);
  const redisKey = `cfh:form-rl:${await hash(key)}:${window}`;
  const res = await fetch(`${redis.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${redis.token}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["INCR", redisKey],
      ["EXPIRE", redisKey, String(WINDOW_SECONDS)],
    ]),
    signal: AbortSignal.timeout(3000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis responded ${res.status}`);
  const [incr] = (await res.json()) as { result?: number; error?: string }[];
  if (typeof incr?.result !== "number") throw new Error(incr?.error ?? "Unexpected Redis response");
  return incr.result;
}

const memory = new Map<string, number[]>();

function countInMemory(key: string, now: number): number {
  const windowMs = WINDOW_SECONDS * 1000;
  const recent = (memory.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  memory.set(key, recent);
  if (memory.size > 5000) {
    for (const [k, times] of memory) {
      if (times.every((t) => now - t >= windowMs)) memory.delete(k);
    }
  }
  return recent.length;
}

/** IPs are hashed so the shared store never holds raw visitor addresses. */
async function hash(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest).slice(0, 12), (b) => b.toString(16).padStart(2, "0")).join("");
}
