import { products } from "@/content/products";
import { segments } from "@/content/segments";

export type FieldType = "text" | "email" | "tel" | "textarea" | "select" | "date";

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
};

export type FormId = "contact" | "order" | "quote" | "tender";

export type FormDefinition = {
  id: FormId;
  title: string;
  /** Used for the notification email subject. */
  subject: string;
  /** Field whose value is appended to the email subject. */
  subjectField: string;
  fields: FieldConfig[];
};

const productOptions = [...products.map((p) => p.name), "Not sure yet – please advise"];
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
          "Tenders and procurement",
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
      { name: "name", label: "Your name", type: "text", required: true, autoComplete: "name" },
      { name: "phone", label: "Phone number", type: "tel", required: true, autoComplete: "tel", placeholder: "07XX XXX XXX",  },
      { name: "product", label: "Product", type: "select", required: true, options: productOptions },
      { name: "quantity", label: "Quantity and size", type: "text", required: true, placeholder: "e.g. 2 × 20 L", maxLength: 200 },
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
      { name: "quantity", label: "Estimated quantity", type: "text", required: true, placeholder: "e.g. 50 bottles per week", maxLength: 300 },
      { name: "frequency", label: "Supply frequency", type: "select", required: true, options: frequencyOptions },
      { name: "location", label: "Delivery location", type: "text", required: true, autoComplete: "street-address", maxLength: 300 },
      { name: "startDate", label: "Preferred start date", type: "date", notPast: true, hint: "Optional" },
      { name: "message", label: "Additional details", type: "textarea", full: true, rows: 4, maxLength: 2000, hint: "Optional" },
    ],
  },

  tender: {
    id: "tender",
    title: "Tender / procurement inquiry",
    subject: "New tender inquiry",
    subjectField: "organisation",
    fields: [
      { name: "organisation", label: "Organisation name", type: "text", required: true, autoComplete: "organization" },
      {
        name: "sector",
        label: "Sector",
        type: "select",
        required: true,
        options: [
          "National government",
          "County government",
          "State corporation / parastatal",
          "Private company",
          "NGO / development partner",
          "Educational institution",
          "Healthcare institution",
          "Other",
        ],
      },
      { name: "contactPerson", label: "Contact person", type: "text", required: true, autoComplete: "name" },
      { name: "designation", label: "Designation / role", type: "text", autoComplete: "organization-title", placeholder: "e.g. Procurement Officer", hint: "Optional" },
      ...contactPerson,
      { name: "products", label: "Products required", type: "textarea", required: true, full: true, rows: 3, maxLength: 1500, placeholder: "Products and specifications" },
      { name: "quantity", label: "Quantities", type: "text", required: true, maxLength: 300, placeholder: "e.g. 2,000 bottles per month" },
      { name: "frequency", label: "Supply frequency", type: "select", required: true, options: frequencyOptions },
      { name: "location", label: "Delivery location(s)", type: "text", required: true, full: true, maxLength: 300 },
      { name: "tenderReference", label: "Tender / RFQ reference", type: "text", maxLength: 120, hint: "Optional" },
      { name: "deadline", label: "Submission deadline", type: "date", notPast: true, hint: "Optional" },
      { name: "requirements", label: "Additional requirements", type: "textarea", full: true, rows: 4, maxLength: 3000, hint: "Optional" },
    ],
  },
};

export function isFormId(value: unknown): value is FormId {
  return typeof value === "string" && value in formDefinitions;
}
