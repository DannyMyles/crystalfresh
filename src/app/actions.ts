"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { formDefinitions, isFormId } from "@/lib/forms/definitions";
import { validateFields } from "@/lib/forms/validate";
import { looksAutomated, verifyTurnstile } from "@/lib/forms/guard";
import { isRateLimited } from "@/lib/forms/rate-limit";
import { deliverSubmission, DeliveryNotConfiguredError, sendAcknowledgement, type Submission } from "@/lib/forms/deliver";
import type { FormState } from "@/lib/forms/types";
import { site } from "@/config/site";

const FALLBACK = `Please call or WhatsApp ${site.phone.display}.`;

export async function submitInquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const formId = formData.get("_form");
  if (!isFormId(formId)) {
    return { status: "error", message: "This form could not be identified. Please refresh the page and try again." };
  }
  const definition = formDefinitions[formId];

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";

  if (looksAutomated(formData)) {
    return { status: "error", message: `We could not accept this submission. ${FALLBACK}` };
  }

  const raw: Record<string, string> = {};
  for (const field of definition.fields) {
    const value = formData.get(field.name);
    raw[field.name] = typeof value === "string" ? value : "";
  }

  const { values, errors } = validateFields(definition.fields, raw);
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors: errors };
  }

  if (await isRateLimited(ip)) {
    return {
      status: "error",
      message: `Too many requests. Please wait a few minutes, or call or WhatsApp ${site.phone.display}.`,
    };
  }

  if (!(await verifyTurnstile(formData, ip))) {
    return { status: "error", message: "Please complete the security check and try again." };
  }

  const reference = createReference();
  const subjectValue = values[definition.subjectField];

  const submission: Submission = {
    reference,
    formId: definition.id,
    formTitle: definition.title,
    subject: subjectValue ? `${definition.subject}: ${subjectValue}` : definition.subject,
    submittedAt: new Date().toISOString(),
    replyTo: values.email || undefined,
    fields: definition.fields.map((f) => ({ name: f.name, label: f.label, value: values[f.name] })),
  };

  try {
    const results = await deliverSubmission(submission);

    if (!results.some((r) => r.ok)) {
      return { status: "error", message: `Your request could not be sent. ${FALLBACK}` };
    }
  } catch (error) {
    if (error instanceof DeliveryNotConfiguredError) {
      console.error("[forms] No delivery channel configured. Set RESEND_API_KEY or FORM_WEBHOOK_URL.");
      return { status: "error", message: `Online requests are temporarily unavailable. ${FALLBACK}` };
    }
    console.error("[forms] Unexpected delivery error", error);
    return { status: "error", message: `Sorry, something went wrong. ${FALLBACK}` };
  }

  after(() => sendAcknowledgement(submission));

  return {
    status: "success",
    reference,
    message: "Thank you. We'll be in touch shortly.",
  };
}

function createReference(): string {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const random = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().slice(0, 5);
  return `CFH-${date}-${random.padStart(5, "0")}`;
}
