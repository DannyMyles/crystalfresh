import { describe, expect, it } from "vitest";
import { mailtoHref, telHref, whatsappHref } from "@/lib/links";

describe("contact links", () => {
  it("uses the confirmed phone number for click-to-call", () => {
    expect(telHref).toBe("tel:0758269725");
  });

  it("builds mailto links with encoded subject and body", () => {
    expect(mailtoHref()).toBe("mailto:muhadiwawire@gmail.com");
    expect(mailtoHref("Quote & tender", "Line 1\nLine 2")).toBe(
      "mailto:muhadiwawire@gmail.com?subject=Quote%20%26%20tender&body=Line%201%0ALine%202",
    );
  });

  it("builds WhatsApp links in international format with a prefilled message", () => {
    const href = whatsappHref("Hello & welcome");
    expect(href.startsWith("https://wa.me/254758269725?text=")).toBe(true);
    expect(decodeURIComponent(href.split("text=")[1])).toBe("Hello & welcome");
    expect(decodeURIComponent(whatsappHref().split("text=")[1])).toMatch(/^Hello Crystal Fresh Hydrolife/);
  });
});
