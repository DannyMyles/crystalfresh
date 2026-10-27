import { orderOptions, products } from "@/content/products";
import { segments } from "@/content/segments";

/** `choice` renders options as large buttons; `quantity` renders a number with − / + buttons. */
export type FieldType = "text" | "email" | "tel" | "textarea" | "select" | "date" | "choice" | "quantity";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: readonly string[];
  /** Fields are half-width on larger screens unless marked full. */
  full?: boolean;
  autoComplete?: string;
  maxLength?: number;
  rows?: number;
  hint?: string;
  /** Date fields only: reject dates before today (Kenya time). */
  notPast?: boolean;
  /** Choice fields only: a short line shown under each option. */
  optionHints?: Readonly<Record<string, string>>;
  /** Quantity fields only. */
  min?: number;
  max?: number;
};

export type FormId = "contact" | "order" | "quote";

export type FormDefinition = {
  id: FormId;
  title: string;
  /** Used for the notification email subject. */
  subject: string;
  /** Field whose value is appended to the email subject. */
  subjectField: string;
  fields: FieldConfig[];
};

const supplyProducts = [...products.map((p) => p.name), "Both bottled water and refills"];
const frequencyOptions = [
  "One-off order",
  "Weekly",
  "Every two weeks",
  "Monthly",
  "Quarterly",
  "Other / to discuss",
];

const contactPerson: FieldConfig[] = [
  { name: "phone", label: "Phone number", type: "tel", required: true, autoComplete: "tel", placeholder: "07XX XXX XXX" },
  { name: "email", label: "Email address", type: "email", required: true, autoComplete: "email", placeholder: "you@organisation.co.ke" },
];

export const formDefinitions: Record<FormId, FormDefinition> = {
  contact: {
    id: "contact",
    title: "Contact message",
    subject: "New website message",
    subjectField: "name",
    fields: [
      { name: "name", label: "Your name", type: "text", required: true, autoComplete: "name" },
      { name: "phone", label: "Phone number", type: "tel", required: true, autoComplete: "tel", placeholder: "07XX XXX XXX" },
      { name: "email", label: "Email address", type: "email", autoComplete: "email", hint: "Optional" },
      {
        name: "topic",
        label: "What is it about?",
        type: "select",
        required: true,
        options: [
          "General inquiry",
          "Bottled drinking water",
          "Water refill services",
          "Delivery",
          "Corporate or bulk supply",
          "Other",
        ],
      },
      { name: "message", label: "Message", type: "textarea", required: true, full: true, rows: 5, maxLength: 2000 },
    ],
  },

  order: {
    id: "order",
    title: "Water order",
    subject: "New water order request",
    subjectField: "name",
    fields: [
      {
        name: "product",
        label: "What would you like?",
        type: "choice",
        required: true,
        full: true,
        options: orderOptions.map((o) => o.label),
        optionHints: Object.fromEntries(orderOptions.map((o) => [o.label, o.hint])),
      },
      { name: "quantity", label: "How many?", type: "quantity", required: true, min: 1, max: 500, hint: "Cases or 20 L pieces" },
      { name: "purpose", label: "What's it for?", type: "choice", required: true, options: ["Home", "Office", "Event"] },
      {
        name: "frequency",
        label: "How often?",
        type: "choice",
        required: true,
        full: true,
        options: ["One-time", "Weekly", "Every two weeks", "Monthly"],
      },
      { name: "name", label: "Your name", type: "text", required: true, autoComplete: "name" },
      { name: "phone", label: "Phone number", type: "tel", required: true, autoComplete: "tel", placeholder: "07XX XXX XXX" },
      { name: "location", label: "Delivery location", type: "text", required: true, full: true, autoComplete: "street-address", placeholder: "Estate, building or landmark", maxLength: 300 },
      { name: "date", label: "Preferred delivery date", type: "date", notPast: true, hint: "Optional" },
      { name: "time", label: "Preferred time", type: "select", options: ["Any time", "Morning", "Afternoon", "Evening"] },
      { name: "email", label: "Email address", type: "email", autoComplete: "email", hint: "Optional" },
      { name: "notes", label: "Additional notes", type: "textarea", full: true, rows: 4, maxLength: 1500, hint: "Optional" },
    ],
  },

  quote: {
    id: "quote",
    title: "Bulk / corporate quotation request",
    subject: "New quotation request",
    subjectField: "organisation",
    fields: [
      { name: "organisation", label: "Organisation name", type: "text", required: true, autoComplete: "organization" },
      { name: "organisationType", label: "Type of organisation", type: "select", required: true, options: segments.map((s) => s.name) },
      { name: "contactPerson", label: "Contact person", type: "text", required: true, autoComplete: "name" },
      ...contactPerson,
      { name: "products", label: "Products needed", type: "select", required: true, options: supplyProducts },
      { name: "quantity", label: "Estimated quantity", type: "text", required: true, placeholder: "e.g. 20 × 20 L per week", maxLength: 300 },
      { name: "frequency", label: "Supply frequency", type: "select", required: true, options: frequencyOptions },
      { name: "location", label: "Delivery location", type: "text", required: true, autoComplete: "street-address", maxLength: 300 },
      { name: "startDate", label: "Preferred start date", type: "date", notPast: true, hint: "Optional" },
      { name: "message", label: "Additional details", type: "textarea", full: true, rows: 4, maxLength: 2000, hint: "Optional" },
    ],
  },

};

export function isFormId(value: unknown): value is FormId {
  return typeof value === "string" && value in formDefinitions;
}
