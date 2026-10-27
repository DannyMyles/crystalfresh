import { orderOptions } from "@/content/products";

export type OrderEstimate =
  | {
      kind: "priced";
      product: string;
      unitPrice: number;
      quantity: number;
      unit: string;
      /** e.g. "72 bottles", when the unit has known contents. */
      contents?: string;
      total: number;
      frequency?: string;
    }
  | { kind: "unpriced"; product: string }
  | null;

/** Estimated order total from the order form values. Shared by the form (live) and the order email. */
export function estimateOrder(values: Record<string, string | undefined>): OrderEstimate {
  const option = orderOptions.find((o) => o.label === values.product);
  if (!option) return null;
  if (option.price === null) return { kind: "unpriced", product: option.label };

  const quantity = Number.parseInt(values.quantity ?? "", 10);
  if (!Number.isInteger(quantity) || quantity < 1) return null;

  const [singular, plural] = option.unit;
  const frequency = values.frequency && values.frequency !== "One-time" ? values.frequency.toLowerCase() : undefined;
  return {
    kind: "priced",
    product: option.label,
    unitPrice: option.price,
    quantity,
    unit: quantity === 1 ? singular : plural,
    contents: option.contents
      ? `${option.contents.count * quantity} ${option.contents.count * quantity === 1 ? option.contents.item[0] : option.contents.item[1]}`
      : undefined,
    total: option.price * quantity,
    frequency,
  };
}

export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

/** One-line description, e.g. "KES 600 × 3 cases = KES 1,800 per delivery (weekly)". */
export function describeEstimate(estimate: OrderEstimate): string | null {
  if (!estimate) return null;
  if (estimate.kind === "unpriced") return `${estimate.product}: price confirmed by phone`;
  const contents = estimate.contents ? ` (${estimate.contents})` : "";
  const base = `${formatKes(estimate.unitPrice)} × ${estimate.quantity} ${estimate.unit}${contents} = ${formatKes(estimate.total)}`;
  return estimate.frequency ? `${base} per delivery (${estimate.frequency})` : base;
}
