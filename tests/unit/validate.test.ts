import { describe, expect, it } from "vitest";
import { formDefinitions } from "@/lib/forms/definitions";
import { todayInKenya, validateFields } from "@/lib/forms/validate";
import { orderOptions } from "@/content/products";

const order = formDefinitions.order.fields;
const validOrder = {
  name: "Jane Wanjiku",
  phone: "0712 345 678",
  product: orderOptions[0].label,
  quantity: "10",
  purpose: "Home",
  frequency: "One-time",
  location: "Ndwaru Road",
};

describe("validateFields", () => {
  it("accepts a valid order and normalises whitespace", () => {
    const { values, errors } = validateFields(order, { ...validOrder, name: "  Jane   Wanjiku " });
    expect(errors).toEqual({});
    expect(values.name).toBe("Jane Wanjiku");
  });

  it("reports every missing required field", () => {
    const { errors } = validateFields(order, {});
    expect(Object.keys(errors).sort()).toEqual(["frequency", "location", "name", "phone", "product", "purpose", "quantity"]);
    expect(errors.product).toBe("Please make a choice.");
    expect(errors.name).toMatch(/^Please enter/);
  });

  it.each(["0712345678", "+254 712 345 678", "(0712) 345-678"])("accepts phone %s", (phone) => {
    expect(validateFields(order, { ...validOrder, phone }).errors.phone).toBeUndefined();
  });

  it.each(["12345", "call me", "0712abc678"])("rejects phone %s", (phone) => {
    expect(validateFields(order, { ...validOrder, phone }).errors.phone).toBeDefined();
  });

  it("rejects invalid email addresses but allows an empty optional one", () => {
    expect(validateFields(order, { ...validOrder, email: "not-an-email" }).errors.email).toBeDefined();
    expect(validateFields(order, { ...validOrder, email: "" }).errors.email).toBeUndefined();
  });

  it.each(["1", "24", "500"])("accepts quantity %s", (quantity) => {
    expect(validateFields(order, { ...validOrder, quantity }).errors.quantity).toBeUndefined();
  });

  it.each(["0", "501", "2.5", "two", "-3"])("rejects quantity %s", (quantity) => {
    expect(validateFields(order, { ...validOrder, quantity }).errors.quantity).toMatch(/number from 1 to 500/);
  });

  it("rejects choices that are not offered", () => {
    expect(validateFields(order, { ...validOrder, purpose: "Party boat" }).errors.purpose).toBeDefined();
  });

  it("rejects select values that are not in the options", () => {
    expect(validateFields(order, { ...validOrder, product: "Free water" }).errors.product).toBeDefined();
  });

  it("enforces maximum lengths", () => {
    expect(validateFields(order, { ...validOrder, name: "x".repeat(201) }).errors.name).toMatch(/under 200/);
  });

  it("rejects dates before today in Kenya time and accepts today", () => {
    // 22:30 UTC on 1 March is already 2 March in Nairobi (UTC+3).
    const now = new Date("2027-03-01T22:30:00Z");
    expect(todayInKenya(now)).toBe("2027-03-02");
    expect(validateFields(order, { ...validOrder, date: "2027-03-01" }, now).errors.date).toMatch(/later date/);
    expect(validateFields(order, { ...validOrder, date: "2027-03-02" }, now).errors.date).toBeUndefined();
    expect(validateFields(order, { ...validOrder, date: "2027-02-30x" }, now).errors.date).toMatch(/valid date/);
  });
});

describe("form definitions", () => {
  it("offer every product in the order form", () => {
    const productField = order.find((f) => f.name === "product");
    expect(productField?.type).toBe("choice");
    expect(productField?.options).toEqual(["Case of 500 ml bottles", "Case of 1 L bottles", "20 L refill"]);
  });

  it("have unique field names per form and a valid subject field", () => {
    for (const def of Object.values(formDefinitions)) {
      const names = def.fields.map((f) => f.name);
      expect(new Set(names).size).toBe(names.length);
      expect(names).toContain(def.subjectField);
    }
  });
});
