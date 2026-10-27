import { describe, expect, it } from "vitest";
import { describeEstimate, estimateOrder, formatKes } from "@/lib/forms/estimate";

describe("estimateOrder", () => {
  it("multiplies the case price by the quantity", () => {
    expect(estimateOrder({ product: "Case of 1 L bottles", quantity: "3", frequency: "One-time" })).toEqual({
      kind: "priced",
      product: "Case of 1 L bottles",
      unitPrice: 600,
      quantity: 3,
      unit: "cases",
      contents: "36 bottles",
      total: 1800,
      frequency: undefined,
    });
  });

  it("uses the singular unit for one case and notes recurring deliveries", () => {
    const estimate = estimateOrder({ product: "Case of 1 L bottles", quantity: "1", frequency: "Weekly" });
    expect(describeEstimate(estimate)).toBe("KES 600 × 1 case (12 bottles) = KES 600 per delivery (weekly)");
  });

  it("formats large totals with thousands separators", () => {
    expect(describeEstimate(estimateOrder({ product: "Case of 1 L bottles", quantity: "25" }))).toBe(
      "KES 600 × 25 cases (300 bottles) = KES 15,000",
    );
    expect(formatKes(1200)).toBe("KES 1,200");
  });

  it("prices both case sizes per case", () => {
    expect(describeEstimate(estimateOrder({ product: "Case of 500 ml bottles", quantity: "2" }))).toBe("KES 600 × 2 cases (48 bottles) = KES 1,200");
  });

  it("does not invent a price for the 20 L refill", () => {
    expect(estimateOrder({ product: "20 L refill", quantity: "4" })).toEqual({ kind: "unpriced", product: "20 L refill" });
  });

  it("returns nothing until a product and a valid quantity are chosen", () => {
    expect(estimateOrder({ quantity: "2" })).toBeNull();
    expect(estimateOrder({ product: "Case of 1 L bottles", quantity: "" })).toBeNull();
  });
});
