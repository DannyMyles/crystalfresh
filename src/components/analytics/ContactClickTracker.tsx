"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Records clicks on call, WhatsApp and email links anywhere on the site with
 * one listener, so individual links never need tracking code.
 */
export function ContactClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;

      const href = link.getAttribute("href") ?? "";
      const name = href.startsWith("tel:")
        ? "click_call"
        : href.includes("wa.me/")
          ? "click_whatsapp"
          : href.startsWith("mailto:")
            ? "click_email"
            : null;
      if (!name) return;

      trackEvent(name, {
        page_path: window.location.pathname,
        link_text: (link.textContent ?? "").trim().slice(0, 80),
      });
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
