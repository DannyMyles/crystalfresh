import type { FieldConfig } from "./definitions";

export type FieldErrors = Record<string, string>;

const DEFAULT_MAX_LENGTH = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?\(?[0-9][0-9\s\-()]{7,18}[0-9]$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Today's date as YYYY-MM-DD in Kenya, regardless of server or browser timezone. */
export function todayInKenya(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi" }).format(now);
}

/** Shared by the browser (instant feedback) and the server (authoritative). */
export function validateFields(
  fields: FieldConfig[],
  values: Record<string, string>,
  now: Date = new Date(),
): { values: Record<string, string>; errors: FieldErrors } {
  const clean: Record<string, string> = {};
  const errors: FieldErrors = {};

  for (const field of fields) {
    const raw = values[field.name] ?? "";
    const value = field.type === "textarea" ? raw.trim() : raw.replace(/\s+/g, " ").trim();
    clean[field.name] = value;

    if (!value) {
      if (field.required)
        errors[field.name] = `Please ${field.type === "select" ? "choose" : "enter"} ${article(field.label)}.`;
      continue;
    }

    const max = field.maxLength ?? DEFAULT_MAX_LENGTH;
    if (value.length > max) {
      errors[field.name] = `Please keep this under ${max} characters.`;
      continue;
    }

    switch (field.type) {
      case "email":
        if (!EMAIL_RE.test(value)) errors[field.name] = "Please enter a valid email address.";
        break;
      case "tel":
        if (!PHONE_RE.test(value) || value.replace(/\D/g, "").length < 9)
          errors[field.name] = "Please enter a valid phone number, e.g. 0712 345 678.";
        break;
      case "select":
        if (field.options && !field.options.includes(value))
          errors[field.name] = "Please choose one of the options.";
        break;
      case "date":
        if (!DATE_RE.test(value) || Number.isNaN(Date.parse(value)))
          errors[field.name] = "Please enter a valid date.";
        else if (field.notPast && value < todayInKenya(now))
          errors[field.name] = "Please choose today or a later date.";
        break;
    }
  }

  return { values: clean, errors };
}

function article(label: string): string {
  const lower = label.toLowerCase();
  if (lower.startsWith("your ")) return lower;
  return /^[aeiou]/.test(lower) ? `an ${lower}` : `the ${lower}`;
}
