"use client";

import { site } from "@/config/site";
import { telHref, whatsappHref } from "@/lib/links";

/** Last-resort fallback when the root layout itself fails, so it cannot rely on the stylesheet. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-KE">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", color: "#0b2540", background: "#ffffff" }}>
        <main style={{ maxWidth: 520, margin: "15vh auto", padding: "0 16px", textAlign: "center" }}>
          <h1 style={{ fontSize: 28 }}>{site.name}</h1>
          <p style={{ color: "#4a6378", lineHeight: 1.6 }}>
            Something went wrong while loading the site. Please try again, or contact us directly.
          </p>
          <p style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={reset} style={{ padding: "10px 18px", borderRadius: 999, border: "1px solid #b2daf5", background: "#fff", cursor: "pointer" }}>
              Try again
            </button>
            <a href={telHref} style={{ padding: "10px 18px", borderRadius: 999, background: "#0f69a8", color: "#fff", textDecoration: "none" }}>
              Call {site.phone.display}
            </a>
            <a href={whatsappHref()} style={{ padding: "10px 18px", borderRadius: 999, background: "#157a42", color: "#fff", textDecoration: "none" }}>
              WhatsApp
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
