import "server-only";
import { site } from "@/config/site";

export type Submission = {
  reference: string;
  formId: string;
  formTitle: string;
  subject: string;
  submittedAt: string;
  replyTo?: string;
  fields: { name: string; label: string; value: string }[];
};

export class DeliveryNotConfiguredError extends Error {
  constructor() {
    super("No form delivery channel is configured.");
  }
}

type ChannelResult = { channel: string; ok: boolean };

/**
 * Sends a submission to every configured channel. Succeeds only if at least one
 * channel confirms delivery, so visitors never see a success message for a
 * submission that went nowhere.
 */
export async function deliverSubmission(submission: Submission): Promise<ChannelResult[]> {
  const tasks: Promise<ChannelResult>[] = [];

  if (emailProvider()) tasks.push(run("email", () => sendEmail(submission)));
  if (process.env.FORM_WEBHOOK_URL) tasks.push(run("webhook", () => sendWebhook(submission)));

  if (tasks.length === 0) throw new DeliveryNotConfiguredError();

  return Promise.all(tasks);
}

async function run(channel: string, fn: () => Promise<void>): Promise<ChannelResult> {
  try {
    await fn();
    return { channel, ok: true };
  } catch (error) {
    console.error(`[forms] ${channel} delivery failed`, error);
    return { channel, ok: false };
  }
}

const RESEND_TEST_SENDER = "onboarding@resend.dev";

type EmailMessage = {
  to: string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  /** Lets Resend drop accidental duplicates; ignored by SMTP. */
  idempotencyKey: string;
};

/** SMTP (e.g. Gmail with an app password) takes priority over Resend when both are set. */
function emailProvider(): "smtp" | "resend" | null {
  if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) return "smtp";
  if (process.env.RESEND_API_KEY) return "resend";
  return null;
}

function senderAddress(): string {
  if (process.env.INQUIRY_FROM_EMAIL) return process.env.INQUIRY_FROM_EMAIL;
  if (emailProvider() === "smtp") return `${site.name} Website <${process.env.SMTP_USER}>`;
  return `${site.name} Website <${RESEND_TEST_SENDER}>`;
}

async function sendMail(message: EmailMessage): Promise<void> {
  if (emailProvider() === "smtp") return sendViaSmtp(message);
  return sendViaResend(message);
}

async function sendViaSmtp({ to, subject, text, html, replyTo }: EmailMessage): Promise<void> {
  const nodemailer = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT) || 465;
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD?.replace(/\s+/g, "") },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  await transport.sendMail({ from: senderAddress(), to, subject, text, html, replyTo });
}

async function sendViaResend({ to, subject, text, html, replyTo, idempotencyKey }: EmailMessage): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ from: senderAddress(), to, subject, reply_to: replyTo, text, html }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

async function sendEmail(s: Submission): Promise<void> {
  const to = (process.env.INQUIRY_TO_EMAIL || site.email)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  await sendMail({
    idempotencyKey: s.reference,
    to,
    subject: `${s.subject} – ${s.reference}`,
    replyTo: s.replyTo,
    text: renderText(s),
    html: renderHtml(s),
  });
}

/**
 * Emails the customer a short receipt with their reference number, when they
 * gave an email address and the sender can reach outside inboxes (a real SMTP
 * mailbox, or Resend with a verified domain; Resend's test sender cannot).
 * It deliberately does not echo the customer's message back, so the form
 * cannot be used to relay spam. Failures are logged only: the business has
 * already received the request.
 */
export async function sendAcknowledgement(s: Submission): Promise<void> {
  const provider = emailProvider();
  if (!provider || !s.replyTo) return;
  if (provider === "resend" && (!process.env.INQUIRY_FROM_EMAIL || process.env.INQUIRY_FROM_EMAIL.includes(RESEND_TEST_SENDER))) return;
  if (process.env.SEND_CUSTOMER_CONFIRMATION === "false") return;

  const intro = `Thank you for contacting ${site.name}. We have received your ${s.formTitle.toLowerCase()} and will get back to you shortly.`;
  const contact = `Need to reach us sooner? Call or WhatsApp ${site.phone.display}, or reply to this email.`;

  try {
    await sendMail({
      idempotencyKey: `${s.reference}-ack`,
      to: [s.replyTo],
      replyTo: site.email,
      subject: `We received your request – ${s.reference}`,
      text: [intro, "", `Your reference: ${s.reference}`, "", contact, "", site.name].join("\n"),
      html: `<!doctype html><html><body style="margin:0;background:#f2f8fc;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:560px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #d6e8f5">
  <div style="background:#0e5488;color:#ffffff;padding:20px 24px;font-size:18px;font-weight:bold">${escapeHtml(site.name)}</div>
  <div style="padding:24px;color:#0b2540;font-size:15px;line-height:1.6">
    <p style="margin:0 0 16px">${escapeHtml(intro)}</p>
    <p style="margin:0 0 16px">Your reference: <strong>${escapeHtml(s.reference)}</strong></p>
    <p style="margin:0;color:#4a6378">${escapeHtml(contact)}</p>
  </div>
</div></body></html>`,
    });
  } catch (error) {
    console.error("[forms] Customer confirmation email failed", error);
  }
}

async function sendWebhook(s: Submission): Promise<void> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.FORM_WEBHOOK_SECRET) headers["X-Webhook-Secret"] = process.env.FORM_WEBHOOK_SECRET;

  const res = await fetch(process.env.FORM_WEBHOOK_URL as string, {
    method: "POST",
    headers,
    body: JSON.stringify({
      ...s,
      data: Object.fromEntries(s.fields.map((f) => [f.name, f.value])),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);

  // Some receivers (e.g. Google Apps Script) always answer 200 and report errors in the body.
  const body = await res.text();
  try {
    const parsed = JSON.parse(body) as { ok?: unknown; error?: unknown };
    if (parsed && parsed.ok === false) throw new Error(`Webhook rejected submission: ${String(parsed.error ?? "unknown error")}`);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
  }
}

function renderText(s: Submission): string {
  const lines = s.fields.filter((f) => f.value).map((f) => `${f.label}: ${f.value}`);
  return [
    `${s.formTitle} received via the ${site.name} website.`,
    `Reference: ${s.reference}`,
    `Submitted: ${formatDate(s.submittedAt)}`,
    "",
    ...lines,
  ].join("\n");
}

function renderHtml(s: Submission): string {
  const rows = s.fields
    .filter((f) => f.value)
    .map(
      (f) => `<tr>
  <td style="padding:10px 14px;border-bottom:1px solid #e3eef7;color:#4a6378;font-size:13px;vertical-align:top;width:38%">${escapeHtml(f.label)}</td>
  <td style="padding:10px 14px;border-bottom:1px solid #e3eef7;color:#0b2540;font-size:14px;white-space:pre-wrap">${escapeHtml(f.value)}</td>
</tr>`,
    )
    .join("");

  return `<!doctype html><html><body style="margin:0;background:#f2f8fc;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:620px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #d6e8f5">
  <div style="background:#0e5488;color:#ffffff;padding:20px 24px">
    <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.8">${escapeHtml(site.name)}</div>
    <div style="font-size:20px;font-weight:bold;margin-top:4px">${escapeHtml(s.formTitle)}</div>
  </div>
  <div style="padding:16px 24px;color:#4a6378;font-size:13px">Reference <strong style="color:#0b2540">${escapeHtml(s.reference)}</strong> · ${escapeHtml(formatDate(s.submittedAt))}</div>
  <table style="width:100%;border-collapse:collapse">${rows}</table>
  <div style="padding:16px 24px;color:#7a91a5;font-size:12px">Reply to this email to respond${s.replyTo ? " directly to the sender" : ""}.</div>
</div></body></html>`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-KE", {
    timeZone: "Africa/Nairobi",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
