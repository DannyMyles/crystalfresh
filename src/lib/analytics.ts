type GtagWindow = Window & { gtag?: (command: "event", name: string, params?: Record<string, unknown>) => void };

/** Sends a Google Analytics event when analytics is configured; otherwise does nothing. */
export function trackEvent(name: string, params?: Record<string, string | number>): void {
  if (typeof window === "undefined") return;
  (window as GtagWindow).gtag?.("event", name, params);
}
