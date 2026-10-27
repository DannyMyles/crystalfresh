import "server-only";

/** Honeypot input name. Real visitors never see or fill it. */
export const HONEYPOT_FIELD = "website";
export const TIMESTAMP_FIELD = "_ts";
export const TURNSTILE_FIELD = "cf-turnstile-response";

const MIN_FILL_MS = 2500;

export function looksAutomated(formData: FormData, now = Date.now()): boolean {
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") return true;

  const ts = Number(formData.get(TIMESTAMP_FIELD));
  if (Number.isFinite(ts) && ts > 0 && now - ts < MIN_FILL_MS) return true;

  return false;
}

export async function verifyTurnstile(formData: FormData, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  const token = formData.get(TURNSTILE_FIELD);
  if (typeof token !== "string" || !token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("[forms] Turnstile verification failed", error);
    return false;
  }
}
