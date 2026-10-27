/**
 * Sends one clearly-labelled test submission through every configured delivery
 * channel (email and/or webhook), so you can confirm submissions really arrive
 * before going live. Reads settings from .env.local.
 *
 *   npm run check:delivery
 */
import { deliverSubmission, DeliveryNotConfiguredError, sendAcknowledgement, type Submission } from "@/lib/forms/deliver";

const submission: Submission = {
  reference: `CFH-TEST-${Date.now().toString(36).toUpperCase()}`,
  formId: "contact",
  formTitle: "Contact message",
  subject: "TEST – website delivery check",
  submittedAt: new Date().toISOString(),
  fields: [
    { name: "name", label: "Your name", value: "Delivery check" },
    { name: "message", label: "Message", value: "This is a test submission sent by `npm run check:delivery`. No action needed." },
  ],
};

async function main() {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    console.log("No .env.local found; using variables from the current environment.");
  }
  // Optional: an address of yours, to also test the customer confirmation email.
  submission.replyTo = process.env.CHECK_DELIVERY_REPLY_TO || undefined;
  console.log(`Sending test submission ${submission.reference}…`);
  try {
    const results = await deliverSubmission(submission);
    for (const r of results) console.log(`  ${r.ok ? "✓" : "✗"} ${r.channel}`);
    if (submission.replyTo) {
      await sendAcknowledgement(submission);
      console.log(`  • customer confirmation attempted to ${submission.replyTo} (see any errors above)`);
    }
    if (results.every((r) => r.ok)) {
      console.log("\nAll channels accepted the submission. Check the inbox and/or sheet for the reference above.");
    } else {
      console.log("\nAt least one channel failed. The error above explains why.");
      process.exitCode = 1;
    }
  } catch (error) {
    if (error instanceof DeliveryNotConfiguredError) {
      console.error("No delivery channel configured. Set RESEND_API_KEY or FORM_WEBHOOK_URL in .env.local.");
    } else {
      console.error(error);
    }
    process.exitCode = 1;
  }
}

void main();
